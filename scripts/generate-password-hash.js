#!/usr/bin/env node
import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
  console.log('\nUsage: node scripts/generate-password-hash.js <your_secret_password>');
  console.log('Example: node scripts/generate-password-hash.js "AdminSecure2026!"\n');
  process.exit(1);
}

const saltRounds = 10;
bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
    process.exit(1);
  }
  console.log('\nGenerated Bcrypt Hash for ADMIN_PASSWORD_HASH:');
  console.log('----------------------------------------------------');
  console.log(hash);
  console.log('----------------------------------------------------');
  console.log('Add this line to your .env file:');
  console.log(`ADMIN_PASSWORD_HASH="${hash}"\n`);
});
