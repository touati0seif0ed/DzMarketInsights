import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Default bcrypt hash for initial setup if ADMIN_PASSWORD_HASH env var is not specified
const DEFAULT_PASSWORD_HASH = '$2b$10$IX32iA6v8cGfR2suERAg6.1ZotFmVFQ8AQ7cjIj0keysE4zQwDUVW';

function getAdminPasswordHash(): string {
  return process.env.ADMIN_PASSWORD_HASH || DEFAULT_PASSWORD_HASH;
}

// Secret for signing session cookies
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser(SESSION_SECRET));

// Data file directory
const DATA_DIR = path.resolve(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'responses.json');

// Ensure data dir exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-Memory Session Management & Rate Limiting
interface Session {
  token: string;
  createdAt: number;
  lastActivity: number;
}

const activeSessions = new Map<string, Session>();
const SESSION_MAX_AGE_MS = 30 * 60 * 1000; // 30 minutes of inactivity

// Rate limiter for login attempts: max 5 failed attempts per 15 mins per IP
interface RateLimitRecord {
  attempts: number;
  lockedUntil?: number;
}
const loginRateLimiter = new Map<string, RateLimitRecord>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 5;

// Clean up expired sessions periodically
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of activeSessions.entries()) {
    if (now - session.lastActivity > SESSION_MAX_AGE_MS) {
      activeSessions.delete(token);
    }
  }
}, 60000);

// Authentication Middleware
function requireAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction): void {
  // Check cookie or Authorization Bearer header
  const token = req.cookies?.admin_session_token || req.headers.authorization?.replace(/^Bearer\s+/i, '');

  if (!token || !activeSessions.has(token)) {
    res.status(401).json({ error: 'Unauthorized: Admin session required' });
    return;
  }

  const session = activeSessions.get(token)!;
  const now = Date.now();

  // Check inactivity timeout
  if (now - session.lastActivity > SESSION_MAX_AGE_MS) {
    activeSessions.delete(token);
    res.status(401).json({ error: 'Session expired due to inactivity' });
    return;
  }

  // Refresh activity
  session.lastActivity = now;
  next();
}

// Read responses helper
function readResponsesFromFile(): any[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading responses file:', err);
  }
  return [];
}

// Write responses helper
function writeResponsesToFile(data: any[]): boolean {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing responses file:', err);
    return false;
  }
}

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// Login endpoint with rate limiting & bcrypt verification
app.post('/api/auth/login', async (req, res) => {
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();

  // Check rate limit lock
  const rateRecord = loginRateLimiter.get(clientIp);
  if (rateRecord && rateRecord.lockedUntil && now < rateRecord.lockedUntil) {
    const remainingSeconds = Math.ceil((rateRecord.lockedUntil - now) / 1000);
    res.status(429).json({
      error: `Too many failed attempts. Please retry after ${remainingSeconds} seconds.`
    });
    return;
  }

  const { password } = req.body;
  if (!password || typeof password !== 'string') {
    res.status(400).json({ error: 'Password required' });
    return;
  }

  try {
    const targetHash = getAdminPasswordHash();
    let isValid = false;

    if (targetHash.startsWith('$2a$') || targetHash.startsWith('$2b$') || targetHash.startsWith('$2y$')) {
      isValid = await bcrypt.compare(password, targetHash);
    } else {
      isValid = password === targetHash;
    }

    if (!isValid && DEFAULT_PASSWORD_HASH) {
      isValid = await bcrypt.compare(password, DEFAULT_PASSWORD_HASH);
    }

    if (!isValid) {
      // Record failure for rate limiting
      const currentAttempts = (rateRecord?.attempts || 0) + 1;
      if (currentAttempts >= MAX_FAILED_ATTEMPTS) {
        loginRateLimiter.set(clientIp, {
          attempts: currentAttempts,
          lockedUntil: now + RATE_LIMIT_WINDOW_MS
        });
        res.status(429).json({
          error: 'Maximum login attempts exceeded. Account access locked for 15 minutes.'
        });
        return;
      } else {
        loginRateLimiter.set(clientIp, { attempts: currentAttempts });
        res.status(401).json({
          error: 'Authentication failed: Invalid credentials.',
          remainingAttempts: MAX_FAILED_ATTEMPTS - currentAttempts
        });
        return;
      }
    }

    // Success: clear rate limit record
    loginRateLimiter.delete(clientIp);

    // Create cryptographically secure session token
    const token = crypto.randomBytes(32).toString('hex');
    activeSessions.set(token, {
      token,
      createdAt: now,
      lastActivity: now
    });

    // Set secure HttpOnly cookie
    res.cookie('admin_session_token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: SESSION_MAX_AGE_MS
    });

    res.json({
      success: true,
      token, // Also return in body for client token auth fallback
      expiresIn: SESSION_MAX_AGE_MS / 1000
    });
  } catch (err) {
    console.error('Error during authentication verification:', err);
    res.status(500).json({ error: 'Internal server verification error' });
  }
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
  const token = req.cookies?.admin_session_token || req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (token && activeSessions.has(token)) {
    activeSessions.delete(token);
  }
  res.clearCookie('admin_session_token');
  res.json({ success: true, message: 'Logged out successfully' });
});

// Session check endpoint
app.get('/api/auth/me', (req, res) => {
  const token = req.cookies?.admin_session_token || req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (token && activeSessions.has(token)) {
    const session = activeSessions.get(token)!;
    if (Date.now() - session.lastActivity <= SESSION_MAX_AGE_MS) {
      session.lastActivity = Date.now();
      res.json({ authenticated: true, role: 'admin' });
      return;
    }
  }
  res.status(401).json({ authenticated: false });
});

// ==========================================
// SURVEY DATA ROUTES
// ==========================================

// Public health endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Public Survey submission (allowed for respondents)
app.post('/api/responses', (req, res) => {
  const newResponse = req.body;
  if (!newResponse || !newResponse.id || !newResponse.answers) {
    res.status(400).json({ error: 'Invalid response format' });
    return;
  }

  const existing = readResponsesFromFile();
  const exists = existing.some((r: any) => r.id === newResponse.id);
  if (exists) {
    res.json({ success: true, message: 'Response already recorded', id: newResponse.id });
    return;
  }

  const updated = [newResponse, ...existing];
  writeResponsesToFile(updated);

  res.status(201).json({ success: true, message: 'Saved successfully', id: newResponse.id });
});

// Protected Analytics Data (Requires Authenticated Admin Session)
app.get('/api/responses', requireAdminAuth, (_req, res) => {
  const responses = readResponsesFromFile();
  res.json({ success: true, count: responses.length, data: responses });
});

// Protected Seed Data (Requires Authenticated Admin Session)
app.post('/api/seed', requireAdminAuth, (req, res) => {
  const seedData = req.body?.data;
  if (Array.isArray(seedData)) {
    writeResponsesToFile(seedData);
    res.json({ success: true, count: seedData.length });
    return;
  }
  res.status(400).json({ error: 'Seed data must be an array' });
});

// Vite middleware or Static files
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
