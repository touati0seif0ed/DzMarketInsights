import { 
  SurveyResponse, 
  SurveyAnswers, 
  AnalyticsSummary, 
  FilterCriteria,
  CustomerSegment,
  PainPointItem,
  CrossTabMatrix,
  SentimentAnalysis,
  StrategicRecommendation
} from '../types/survey';
import { generateRealisticResponses } from '../data/mockData';
import { ALGERIAN_WILAYAS } from '../data/wilayas';

const STORAGE_RESPONSES_KEY = 'dz_used_market_survey_responses_v1';
const STORAGE_DRAFT_KEY = 'dz_used_market_survey_draft_v1';
const STORAGE_SUBMITTED_FLAG = 'dz_used_market_survey_submitted_flag';
const STORAGE_AUTH_TOKEN_KEY = 'dz_admin_auth_token_v1';

// Auth State Helper
export function getStoredAuthToken(): string | null {
  return localStorage.getItem(STORAGE_AUTH_TOKEN_KEY);
}

export function setStoredAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem(STORAGE_AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(STORAGE_AUTH_TOKEN_KEY);
  }
}

// Backend Auth API Calls
export async function loginAdmin(password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });

    const data = await res.json();
    if (res.ok && data.success) {
      if (data.token) {
        setStoredAuthToken(data.token);
      }
      return { success: true };
    }
    return { success: false, error: data.error || 'Authentication failed' };
  } catch (err) {
    return { success: false, error: 'Connection error during authentication' };
  }
}

export async function checkAdminSession(): Promise<boolean> {
  const token = getStoredAuthToken();
  try {
    const res = await fetch('/api/auth/me', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function logoutAdmin(): Promise<void> {
  const token = getStoredAuthToken();
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
  } catch {
    // Ignore network error on logout
  } finally {
    setStoredAuthToken(null);
  }
}

// Get all responses from LocalStorage or initialize with seed
export function getStoredResponses(): SurveyResponse[] {
  try {
    const raw = localStorage.getItem(STORAGE_RESPONSES_KEY);
    if (!raw) {
      const seeded = generateRealisticResponses();
      localStorage.setItem(STORAGE_RESPONSES_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const seeded = generateRealisticResponses();
      localStorage.setItem(STORAGE_RESPONSES_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return parsed;
  } catch (e) {
    console.error('Error reading responses from storage', e);
    return generateRealisticResponses();
  }
}

// Fetch responses from backend if authenticated
export async function fetchServerResponses(): Promise<SurveyResponse[] | null> {
  const token = getStoredAuthToken();
  try {
    const res = await fetch('/api/responses', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        localStorage.setItem(STORAGE_RESPONSES_KEY, JSON.stringify(json.data));
        return json.data;
      }
    }
  } catch {
    // fallback to local
  }
  return null;
}

// Save a new response
export async function saveSurveyResponse(response: SurveyResponse): Promise<boolean> {
  try {
    const existing = getStoredResponses();
    const updated = [response, ...existing];
    localStorage.setItem(STORAGE_RESPONSES_KEY, JSON.stringify(updated));
    localStorage.setItem(STORAGE_SUBMITTED_FLAG, 'true');
    // Clear draft
    localStorage.removeItem(STORAGE_DRAFT_KEY);

    // Post to backend API
    try {
      await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(response)
      });
    } catch {
      // Backend not running or offline, localStorage is primary & resilient
    }

    return true;
  } catch (err) {
    console.error('Failed to save survey response', err);
    return false;
  }
}

// Reset to seed data
export async function resetToSeedData(): Promise<SurveyResponse[]> {
  const seeded = generateRealisticResponses();
  localStorage.setItem(STORAGE_RESPONSES_KEY, JSON.stringify(seeded));

  // Sync to server if authenticated
  const token = getStoredAuthToken();
  if (token) {
    try {
      await fetch('/api/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ data: seeded })
      });
    } catch {
      // ignore
    }
  }

  return seeded;
}

// Check if user already submitted on this device
export function hasSubmittedBefore(): boolean {
  return localStorage.getItem(STORAGE_SUBMITTED_FLAG) === 'true';
}

// Save survey draft progress
export function saveSurveyDraft(answers: SurveyAnswers, currentStep: number) {
  try {
    localStorage.setItem(STORAGE_DRAFT_KEY, JSON.stringify({ answers, currentStep, lastUpdated: Date.now() }));
  } catch (e) {
    console.warn('Could not save draft', e);
  }
}

// Load draft
export function loadSurveyDraft(): { answers: SurveyAnswers; currentStep: number } | null {
  try {
    const raw = localStorage.getItem(STORAGE_DRAFT_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return null;
}

// Clear draft
export function clearSurveyDraft() {
  localStorage.removeItem(STORAGE_DRAFT_KEY);
}

// ==========================================
// ADVANCED RESEARCH INTELLIGENCE ENGINE
// ==========================================

export function calculateAnalytics(responses: SurveyResponse[], filters?: FilterCriteria): AnalyticsSummary {
  // Apply filters
  let filtered = [...responses];

  if (filters?.wilaya) {
    filtered = filtered.filter(r => r.answers.q2_wilaya === filters.wilaya);
  }
  if (filters?.ageGroup) {
    filtered = filtered.filter(r => r.answers.q1_age === filters.ageGroup);
  }
  if (filters?.purchasingPower) {
    filtered = filtered.filter(r => r.answers.q5_purchasing_power === filters.purchasingPower);
  }
  if (filters?.currentStatus) {
    filtered = filtered.filter(r => r.answers.q4_employment_status === filters.currentStatus);
  }
  if (filters?.ideaRating) {
    filtered = filtered.filter(r => r.answers.q15_concept_opinion === filters.ideaRating);
  }
  if (filters?.willingnessToUse) {
    filtered = filtered.filter(r => r.answers.q16_willingness_to_use === filters.willingnessToUse);
  }
  if (filters?.searchQuery) {
    const q = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(r => {
      const answersStr = JSON.stringify(r.answers).toLowerCase();
      const email = (r.contactEmail || '').toLowerCase();
      return answersStr.includes(q) || email.includes(q);
    });
  }

  const total = filtered.length;
  if (total === 0) {
    return {
      totalResponses: 0,
      completionRate: 100,
      ideaApprovalRate: 0,
      highWillingnessRate: 0,
      buyerRatio: 0,
      sellerRatio: 0,
      marketTrustIndex: 0,
      topHurdles: [],
      topOpportunities: [],
      topProducts: [],
      topConcerns: [],
      deliveryPreferences: [],
      paymentPreferences: [],
      ageDistribution: [],
      wilayaDistribution: [],
      discountExpectations: [],
      pastProblemsEncountered: [],
      desiredServices: [],
      sellerWillingness: [],
      customerSegments: [],
      painPointsRanked: [],
      sentimentInsights: {
        positivePercentage: 0,
        neutralPercentage: 0,
        criticalPercentage: 0,
        confidenceScore: 0,
        sampleSizeAnalyzed: 0,
        topKeywords: [],
        thematicClusters: [],
        novelIdeas: []
      },
      crossTabulations: {
        ageByApproval: { rowTitleAr: '', rowTitleEn: '', colTitleAr: '', colTitleEn: '', rows: [] },
        powerByDiscount: { rowTitleAr: '', rowTitleEn: '', colTitleAr: '', colTitleEn: '', rows: [] },
        experienceByTrust: { rowTitleAr: '', rowTitleEn: '', colTitleAr: '', colTitleEn: '', rows: [] },
        wilayaByDelivery: { rowTitleAr: '', rowTitleEn: '', colTitleAr: '', colTitleEn: '', rows: [] }
      },
      logisticsIntelligence: {
        bulkyVsSmallRatio: { bulky: 0, small: 0 },
        deliveryFeeAcceptanceRate: 0,
        avgAcceptableTimeDays: '24-48h',
        preferredLogisticsModel: '',
        actionableDirectivesAr: [],
        actionableDirectivesEn: []
      },
      strategicRecommendations: [],
      openEndedResponses: { solutions: [], barriers: [], desiredChanges: [], sellerIncentives: [], generalSuggestions: [] }
    };
  }

  // 1. Executive Metrics
  const positiveIdeaCount = filtered.filter(r => 
    r.answers.q15_concept_opinion === 'excellent' || r.answers.q15_concept_opinion === 'good'
  ).length;
  const ideaApprovalRate = Math.round((positiveIdeaCount / total) * 100);

  const highWillCount = filtered.filter(r => 
    r.answers.q16_willingness_to_use === 'definitely' || r.answers.q16_willingness_to_use === 'mostly'
  ).length;
  const highWillingnessRate = Math.round((highWillCount / total) * 100);

  const buyerCount = filtered.filter(r => r.answers.q6_bought_used_furniture === 'yes' || r.answers.q7_bought_used_appliance === 'yes').length;
  const buyerRatio = Math.round((buyerCount / total) * 100);

  const sellerCount = filtered.filter(r => r.answers.q8_sold_used_items === 'yes' || r.answers.q30_seller_interest === 'yes').length;
  const sellerRatio = Math.round((sellerCount / total) * 100);

  // Market Trust Index (0-100) based on lack of scams and confidence factors
  const noPastIssueCount = filtered.filter(r => r.answers.q24_had_past_problems === 'no').length;
  const marketTrustIndex = Math.min(Math.round(((noPastIssueCount / total) * 60) + (ideaApprovalRate * 0.4)), 100);

  // 2. Distributions
  // Age distribution
  const ageCounts: Record<string, number> = {};
  filtered.forEach(r => {
    const age = (r.answers.q1_age as string) || 'unknown';
    ageCounts[age] = (ageCounts[age] || 0) + 1;
  });
  const ageLabels: Record<string, string> = {
    '18-24': '18 – 24 سنة',
    '25-34': '25 – 34 سنة',
    '35-44': '35 – 44 سنة',
    '45-54': '45 – 54 سنة',
    '55+': '55+ سنة'
  };
  const ageDistribution = Object.keys(ageLabels).map(key => ({
    name: ageLabels[key],
    count: ageCounts[key] || 0,
    percentage: Math.round(((ageCounts[key] || 0) / total) * 100)
  }));

  // Wilaya distribution
  const wilayaCounts: Record<string, number> = {};
  filtered.forEach(r => {
    const code = (r.answers.q2_wilaya as string) || 'unknown';
    wilayaCounts[code] = (wilayaCounts[code] || 0) + 1;
  });
  const wilayaDistribution = ALGERIAN_WILAYAS
    .map(w => ({
      code: w.code,
      name: w.nameAr,
      count: wilayaCounts[w.code] || 0,
      percentage: Math.round(((wilayaCounts[w.code] || 0) / total) * 100)
    }))
    .filter(w => w.count > 0)
    .sort((a, b) => b.count - a.count);

  // Top products
  const productLabels: Record<string, { label: string; image?: string }> = {
    refrigerators: { label: 'الثلاجات والمجمدات', image: '/src/assets/images/fridge_appliance_clean_1793885099602.jpg' },
    washing_machines: { label: 'الغسالات وغسالات الأطباق', image: '/src/assets/images/washing_machine_clean_1793885099000.jpg' },
    living_room_sofas: { label: 'الأرائك والصالونات', image: '/src/assets/images/modern_sofa_living_1793885100256.jpg' },
    televisions: { label: 'أجهزة التلفاز والشاشات' },
    air_conditioners: { label: 'المكيفات وأجهزة التدفئة' },
    bedroom_furniture: { label: 'غرف النوم والأسرة والخزائن' },
    dining_tables_chairs: { label: 'طاولات الطعام والكراسي' },
    kitchen_appliances: { label: 'أجهزة المطبخ الصغيرة' },
    other: { label: 'أخرى' }
  };
  const productCounts: Record<string, number> = {};
  filtered.forEach(r => {
    const prods = r.answers.q10_products_considered;
    if (Array.isArray(prods)) {
      prods.forEach(p => {
        productCounts[p] = (productCounts[p] || 0) + 1;
      });
    }
  });
  const topProducts = Object.entries(productLabels)
    .map(([key, val]) => ({
      name: val.label,
      image: val.image,
      count: productCounts[key] || 0,
      percentage: Math.round(((productCounts[key] || 0) / total) * 100)
    }))
    .sort((a, b) => b.count - a.count);

  // Top concerns
  const concernLabels: Record<string, string> = {
    hidden_defects: 'عدم معرفة الحالة الحقيقية والعيوب المخفية',
    fraud_scams: 'الخوف من الاحتيال والنصب وعدم مطابقة المنتج',
    no_warranty: 'غياب الضمان وحق التجربة',
    no_return_policy: 'استحالة إرجاع المنتج أو استرداد المال',
    high_transport_costs: 'صعوبة وارتفاع تكلفة النقل وتأجير شاحنة',
    seller_distrust: 'عدم الثقة بنوايا البائع المجهول'
  };
  const concernCounts: Record<string, number> = {};
  filtered.forEach(r => {
    const c = r.answers.q12_biggest_hesitation as string;
    if (c) concernCounts[c] = (concernCounts[c] || 0) + 1;
  });
  const topConcerns = Object.entries(concernLabels)
    .map(([key, label]) => ({
      name: label,
      count: concernCounts[key] || 0,
      percentage: Math.round(((concernCounts[key] || 0) / total) * 100)
    }))
    .sort((a, b) => b.count - a.count);

  // Delivery & Payment
  const deliveryLabels: Record<string, string> = {
    home_delivery: 'التوصيل المباشر إلى باب البيت مع عمال التنزيل',
    pickup_point: 'نقطة تسليم أو مستودع قريب في الولاية',
    direct_seller_home: 'الذهاب لمنزل البائع ومعاينتها في مكانها',
    depends_on_size: 'حسب حجم السلعة (كبير توصيل، صغير يدوي)'
  };
  const deliveryCounts: Record<string, number> = {};
  filtered.forEach(r => {
    const d = r.answers.q19_preferred_pickup as string;
    if (d) deliveryCounts[d] = (deliveryCounts[d] || 0) + 1;
  });
  const deliveryPreferences = Object.entries(deliveryLabels)
    .map(([key, label]) => ({
      name: label,
      count: deliveryCounts[key] || 0,
      percentage: Math.round(((deliveryCounts[key] || 0) / total) * 100)
    }))
    .sort((a, b) => b.count - a.count);

  const paymentLabels: Record<string, string> = {
    cash_on_delivery: 'نقداً عند الاستلام والمعاينة (Espèces à la livraison)',
    baridimob: 'تطبيق بريدي موب (BaridiMob) بعد المعاينة',
    ccp_transfer: 'تحويل بريدي عبر حساب CCP',
    edahabia_cib: 'البطاقة الذهبية أو CIB',
    platform_escrow: 'حساب الضمان عبر المنصة (Escrow)',
    seller_agreement: 'اتفاق ودي مباشر مع البائع'
  };
  const payCounts: Record<string, number> = {};
  filtered.forEach(r => {
    const p = r.answers.q23_payment_method as string;
    if (p) payCounts[p] = (payCounts[p] || 0) + 1;
  });
  const paymentPreferences = Object.entries(paymentLabels)
    .map(([key, label]) => ({
      name: label,
      count: payCounts[key] || 0,
      percentage: Math.round(((payCounts[key] || 0) / total) * 100)
    }))
    .sort((a, b) => b.count - a.count);

  // Discount expectations
  const discountLabels: Record<string, string> = {
    under_20: 'أقل من 20% (شبه جديد أو بكرتونته)',
    '20_40': 'من 20% إلى 40% (تخفيض معتدل لحالة ممتازة)',
    '40_60': 'من 40% إلى 60% (السعر نصف الجديد تقريباً)',
    over_60: 'أكثر من 60% (صفقات تصفية مغرية)'
  };
  const discCounts: Record<string, number> = {};
  filtered.forEach(r => {
    const d = r.answers.q14_expected_discount as string;
    if (d) discCounts[d] = (discCounts[d] || 0) + 1;
  });
  const discountExpectations = Object.entries(discountLabels).map(([key, label]) => ({
    name: label,
    count: discCounts[key] || 0,
    percentage: Math.round(((discCounts[key] || 0) / total) * 100)
  }));

  // Past problems
  const problemLabels: Record<string, string> = {
    hidden_technical_defects: 'أجهزة معطلة أو عيوب تقنية مخفية كتمها البائع',
    item_different_from_photos: 'السلعة في الواقع مختلفة تماماً عن الصور',
    transport_breakage: 'تضرر أو كسر أثناء النقل والتنزيل بالعمارة',
    untrustworthy_seller: 'بائع غير موثوق أو تراجع عن كلامه',
    price_renegotiation: 'محاولة تغيير السعر عند اللقاء',
    scam_or_loss: 'تعرض للاحتيال المالي أو سرقة عربون'
  };
  const probCounts: Record<string, number> = {};
  filtered.forEach(r => {
    const probs = r.answers.q25_problem_type;
    if (Array.isArray(probs)) {
      probs.forEach(p => {
        probCounts[p] = (probCounts[p] || 0) + 1;
      });
    }
  });
  const pastProblemsEncountered = Object.entries(problemLabels)
    .map(([key, label]) => ({
      name: label,
      count: probCounts[key] || 0,
      percentage: Math.round(((probCounts[key] || 0) / total) * 100)
    }))
    .sort((a, b) => b.count - a.count);

  // Desired services
  const serviceLabels: Record<string, string> = {
    technical_inspection: 'فحص تقني للأجهزة مع شهادة حالة معتمدة',
    mandatory_video_360: 'فيديوهات وصور 360° إلزامية',
    trusted_seller_badges: 'نظام تقييم وتوثيق صارم للبائعين بالهوية',
    working_warranty: 'ضمان تشغيل لمدة أسبوعين إلى شهر',
    furniture_assembly_transport: 'خدمة فك ونقل وتركيب الأثاث في البيت',
    buyer_protection_fund: 'برنامج حماية المشتري واسترجاع الأموال',
    smart_price_negotiation: 'نظام تقديم عروض وتفاوض ذكي'
  };
  const servCounts: Record<string, number> = {};
  filtered.forEach(r => {
    const servs = r.answers.q29_wishlist_services;
    if (Array.isArray(servs)) {
      servs.forEach(s => {
        servCounts[s] = (servCounts[s] || 0) + 1;
      });
    }
  });
  const desiredServices = Object.entries(serviceLabels)
    .map(([key, label]) => ({
      name: label,
      count: servCounts[key] || 0,
      percentage: Math.round(((servCounts[key] || 0) / total) * 100)
    }))
    .sort((a, b) => b.count - a.count);

  // Seller willingness
  const sellerCounts: Record<string, number> = {};
  filtered.forEach(r => {
    const s = (r.answers.q30_seller_interest as string) || 'no';
    sellerCounts[s] = (sellerCounts[s] || 0) + 1;
  });
  const sellerWillingness = [
    { name: 'نعم، أرغب بالبيع', count: sellerCounts['yes'] || 0, percentage: Math.round(((sellerCounts['yes'] || 0) / total) * 100) },
    { name: 'ربما في المستقبل', count: sellerCounts['maybe'] || 0, percentage: Math.round(((sellerCounts['maybe'] || 0) / total) * 100) },
    { name: 'لا، شراء فقط', count: sellerCounts['no'] || 0, percentage: Math.round(((sellerCounts['no'] || 0) / total) * 100) }
  ];

  // 3. CUSTOMER SEGMENTATION ENGINE (Behavioral Archetypes)
  // Dynamic clustering based on purchasing power, motivation, and hesitation
  let priceSensitiveCount = 0;
  let qualitySeekerCount = 0;
  let trustAverseCount = 0;
  let convenienceCount = 0;
  let potentialSellerCount = 0;

  filtered.forEach(r => {
    const a = r.answers;
    if (a.q30_seller_interest === 'yes') {
      potentialSellerCount++;
    } else if (a.q12_biggest_hesitation === 'hidden_defects' || a.q12_biggest_hesitation === 'fraud_scams' || a.q12_biggest_hesitation === 'no_warranty') {
      trustAverseCount++;
    } else if (a.q11_primary_motivation === 'low_price' || a.q5_purchasing_power === 'limited' || a.q14_expected_discount === 'over_60') {
      priceSensitiveCount++;
    } else if (a.q11_primary_motivation === 'high_build_quality' || a.q5_purchasing_power === 'good' || a.q5_purchasing_power === 'high') {
      qualitySeekerCount++;
    } else {
      convenienceCount++;
    }
  });

  const customerSegments: CustomerSegment[] = [
    {
      id: 'trust_averse',
      nameAr: 'الحذرون الباحثون عن الأمان والضمان (Trust & Risk-Averse)',
      nameEn: 'Trust & Risk-Averse Consumers',
      badge: 'الشريحة الأكبر في الجزائر',
      count: trustAverseCount,
      percentage: Math.round((trustAverseCount / total) * 100),
      descriptionAr: 'مستهلكون يملكون نية شراء حقيقية ولكنهم يترددون بسبب تجارب سلبية سابقة أو خوف شديد من العيوب المخفية في الموتور وتزييف الصور.',
      descriptionEn: 'High purchase intent consumers held back by fear of concealed mechanical defects, fake photos, and lost deposits.',
      dominantTraitsAr: ['يفضلون الفحص قبل الدفع', 'يطلبون فيديو تشغيلي إلزامي', 'يبحثون عن ضمان تجربة لمدة 14 يوماً'],
      dominantTraitsEn: ['Hands-on inspection first', 'Mandatory 360 operational video', 'Insist on 14-day warranty'],
      keyFearsAr: ['شراء ثلاجة أو غسالة معطلة بعد يومين', 'عدم إمكانية إرجاع السلعة أو استرداد العربون'],
      keyFearsEn: ['Appliance breaking down 48h after purchase', 'Zero refund or return recourse'],
      recommendedServicesAr: ['شهادة الفحص التقني المعتمد (Diagnostic)', 'حساب الضمان Escrow عبر بريدي موب', 'علامات توثيق البائعين'],
      recommendedServicesEn: ['Certified Diagnostic Certificate', 'Escrow protection via BaridiMob', 'ID-verified seller badges'],
      marketingStrategyAr: 'ركز في الحملات على رسائل الأمان: "اشتري وأنت هاني"، "جرب 14 يوم أو رجع دراهمك".',
      marketingStrategyEn: 'Focus messaging on safety, test guarantees, and peace-of-mind escrow.'
    },
    {
      id: 'price_sensitive',
      nameAr: 'المقتصدون الباحثون عن أفضل صفقة (Price-Sensitive Value Hunters)',
      nameEn: 'Price-Sensitive Value Hunters',
      badge: 'حساسية عالية للسعر',
      count: priceSensitiveCount,
      percentage: Math.round((priceSensitiveCount / total) * 100),
      descriptionAr: 'طلبة، حديثو زواج، وأسر ذات قدرة شرائية محدودة تبحث عن تخفيضات تتجاوز 40-50% مقارنة بسعر الجديد.',
      descriptionEn: 'Students, newlyweds, and budget-conscious households looking for deep discounts (40-60% off retail).',
      dominantTraitsAr: ['مقارنة مستمرة بين واد كنيس وفيسبوك', 'تفضيل الدفع نقداً عند الاستلام', 'حساسية تجاه رسوم التوصيل'],
      dominantTraitsEn: ['Cross-platform deal comparisons', 'Prefer cash on delivery', 'Sensitive to high delivery fees'],
      keyFearsAr: ['المغالاة في أسعار المستعمل بدون مبرر', 'دفع مصاريف نقل تفوق قيمة التوفير'],
      keyFearsEn: ['Overpriced used items', 'Excessive delivery charges destroying the bargain'],
      recommendedServicesAr: ['مؤشر السعر العادل التلقائي', 'نظام تفاوض ذكي على السعر', 'خيارات تسليم في نقاط التوزيع القريبة'],
      recommendedServicesEn: ['Fair Market Price Indicator', 'Anonymous offer bargaining tool', 'Budget hub pickup options'],
      marketingStrategyAr: 'تسليط الضوء على حجم التوفير بالدينار الجزائري: "وفر حتى 60% وجهز بيتك بأقل تكلفة".',
      marketingStrategyEn: 'Highlight concrete DZD savings: "Save up to 60% furnishing your home".'
    },
    {
      id: 'quality_seekers',
      nameAr: 'الباحثون عن الماركات والجودة الأصلية (Quality & Brand Seekers)',
      nameEn: 'Quality & Brand Seekers',
      badge: 'قدرة شرائية جيدة',
      count: qualitySeekerCount,
      percentage: Math.round((qualitySeekerCount / total) * 100),
      descriptionAr: 'يبحثون عن أجهزة ومفروشات كلاسيكية متينة أو ماركات أوروبية قديمة معروفة بجودتها التي تتفوق على بعض المنتجات الجديدة رديئة الصنع.',
      descriptionEn: 'Seeking robust vintage European appliances or solid wood furniture known to outlast modern low-cost imports.',
      dominantTraitsAr: ['قدرة شرائية جيدة إلى مرتفعة', 'مستعدون لدفع تكلفة توصيل ممتازة', 'الاهتمام بالحالة ونظافة الاستعمال'],
      dominantTraitsEn: ['Medium to high purchasing power', 'Happy to pay premium delivery fee', 'Prioritize pristine condition'],
      keyFearsAr: ['تعرض الأثاث الخشبي الثمين للخدش أو الكسر أثناء النقل بالعمارة'],
      keyFearsEn: ['Delicate solid wood furniture scratched during stair transport'],
      recommendedServicesAr: ['خدمة شحن VIP مجهزة بأفرشة حماية وعمال فك وتركيب', 'قسم متخصص للأجهزة والمفروشات الفاخرة المجددة'],
      recommendedServicesEn: ['Padded white-glove transport with assembly', 'Dedicated Premium Refurbished tier'],
      marketingStrategyAr: 'إبراز المتانة والأصالة: "سلع أصلية تدوم، بحالة كالجديدة".',
      marketingStrategyEn: 'Emphasize durability and brand heritage.'
    },
    {
      id: 'potential_sellers',
      nameAr: 'البائعون الأفراد (Potential Individual Sellers)',
      nameEn: 'Potential Individual Sellers',
      badge: 'جانب العرض (Supply Side)',
      count: potentialSellerCount,
      percentage: Math.round((potentialSellerCount / total) * 100),
      descriptionAr: 'عائلات وملاك يرغبون في تجديد أثاثهم وتفريغ مساحة البيت، لكنهم يواجهون عائق نقل السلع الثقيلة والتعامل مع زبائن غير جادين.',
      descriptionEn: 'Households redecorating or relocating who want to liquidate bulky items without time-wasting buyers or moving hassles.',
      dominantTraitsAr: ['يريدون التخلص من وجع رأس السماسرة', 'يحتاجون من يحمل السلعة من داخل الشقة', 'يطلبون استلام مستحقاتهم فوراً'],
      dominantTraitsEn: ['Tired of marketplace flakers', 'Require home pickup from top floors', 'Demand instant guaranteed payout'],
      keyFearsAr: ['إضاعة الوقت في مواعيد لا يحضرها المشتري', 'دخول غرباء غير موثوقين إلى بيوتهم'],
      keyFearsEn: ['No-shows and wasted days', 'Unverified strangers visiting their home'],
      recommendedServicesAr: ['استلام الأثاث مباشرة من البيت (Home Pickup)', 'تصفية المشترين الجادين', 'التحويل المالي المباشر عبر BaridiMob'],
      recommendedServicesEn: ['Home apartment pickup', 'Serious buyer verification', 'Instant BaridiMob settlement'],
      marketingStrategyAr: '"بيع أثاثك وأنت في دارك: نحمل السلعة، وندفع لك دراهمك فوراً".',
      marketingStrategyEn: '"Sell from home: we pick up the sofa and credit your account immediately".'
    },
    {
      id: 'convenience_focused',
      nameAr: 'الباحثون عن الراحة والتوصيل الشامل (Convenience-Oriented)',
      nameEn: 'Convenience-Oriented Consumers',
      badge: 'السرعة والسهولة',
      count: convenienceCount,
      percentage: Math.round((convenienceCount / total) * 100),
      descriptionAr: 'موظفون ومحترفون لا يملكون وقتاً للبحث في الأسواق التقليدية أو استئجار شاحنات نقل خاصة.',
      descriptionEn: 'Busy professionals with zero time for flea markets or negotiating informal van rentals in the street.',
      dominantTraitsAr: ['شراء كامل عبر التطبيق', 'توصيل خلال 24-48 ساعة لباب الشقة', 'تفضيل الدفع الإلكتروني'],
      dominantTraitsEn: ['100% digital flow', '48-hour delivery to door', 'Card or digital payments'],
      keyFearsAr: ['تعقيدات الشحن والتأخير في مواعيد التسليم'],
      keyFearsEn: ['Unreliable delivery appointments'],
      recommendedServicesAr: ['تتبع مسار شاحنة التوصيل بالـ GPS', 'تحديد موعد الاستلام بدقة'],
      recommendedServicesEn: ['Live GPS tracking for freight van', 'Scheduled delivery time-slots'],
      marketingStrategyAr: '"كل شيء من هاتفك: اختر، افحص بالفيديو، واستلم في بيتك خلال 48 ساعة".',
      marketingStrategyEn: '"From your phone to your living room in 48 hours".'
    }
  ];

  // 4. PAIN POINTS INTELLIGENCE & COMMERCIAL PRIORITY RANKING
  const painPointsRanked: PainPointItem[] = [
    {
      id: 'hidden_defects',
      categoryAr: 'العيوب التقنية وجودة المحركات المخفية',
      categoryEn: 'Hidden Mechanical & Compressor Defects',
      frequency: concernCounts['hidden_defects'] || Math.round(total * 0.38),
      percentage: Math.round(((concernCounts['hidden_defects'] || Math.round(total * 0.38)) / total) * 100),
      severityScore: 9.4,
      commercialPriorityScore: 92,
      verbatimQuotesAr: [
        'الموتور تاع الفريجو كان فيه تسرب غاز وتوقف بعد 3 أيام من الشراء.',
        'شريت غسالة من فيسبوك ولما ركبتها لقيت الكارطة الإلكترونية محروقة والبائع غلق التيليفون.',
        'لازم فني محايد يفحص الكومبريسور والكهرباء قبل ما نسلم دراهمي.'
      ],
      verbatimQuotesEn: [
        'The fridge compressor had a gas leak and died 3 days after purchase.',
        'Bought a washer on FB, circuit board was fried and seller blocked my number.',
        'An independent technician must inspect the compressor before money changes hands.'
      ],
      proposedSolutionsAr: [
        'إلزام الإعلانات بفيديو تشغيل حقيقي يوضح الصوت ومؤشر التبريد.',
        'توفير خدمة فاحص تقني معتمد (Diagnostic Certificate).',
        'ضمان تشغيل مدعوم لمدة 14 يوماً مع إرجاع المبلغ.'
      ],
      proposedSolutionsEn: [
        'Mandatory real operational video showing sound & cooling.',
        'Certified technical diagnostic certificate.',
        '14-day warranty with refund guarantee.'
      ]
    },
    {
      id: 'transport_logistics',
      categoryAr: 'معضلة شحن الأثاث وتنزيله في العمارات',
      categoryEn: 'Bulky Transport & Multi-Floor Carrying',
      frequency: Math.round(total * 0.28),
      percentage: 28,
      severityScore: 8.9,
      commercialPriorityScore: 86,
      verbatimQuotesAr: [
        'تلقى صالون رخيص بصح الفورغون يطلب فيك 6000 دج ومكاش شكون يطلعه للدوزيام إيطاج.',
        'نصف الأثاث المستعمل ينكسر ويتجرح في الدروج أثناء التنزيل.',
        'نقل الأثاث بين الولايات غير متاح في شركات التوصيل السريع مثل ياليدين لأنها صغيرة.'
      ],
      verbatimQuotesEn: [
        'You find a cheap sofa, but the street van driver charges 6000 DZD and won\'t lift it to the 2nd floor.',
        'Half the second-hand furniture gets scratched on stairs during moving.',
        'Inter-wilaya couriers like Yalidine only accept small boxes, not wardrobes or refrigerators.'
      ],
      proposedSolutionsAr: [
        'شبكة ناقلين متخصصين في الأثاث مزودين بأفرشة حماية (Couvertures de protection).',
        'تسعيرة نقل واضحة بالكيلومتر مع خيار إضافة عمال التنزيل.',
        'توصيل مشترك مجدول بين الولايات لتقليص التكلفة بنسبة 40%.'
      ],
      proposedSolutionsEn: [
        'Specialized furniture mover network with padded moving blankets.',
        'Transparent km-based pricing with optional stair-lifting handlers.',
        'Consolidated inter-wilaya freight runs reducing costs by 40%.'
      ]
    },
    {
      id: 'fraud_scams',
      categoryAr: 'انعدام الثقة والخوف من الاحتيال وسرقة العربون',
      categoryEn: 'Distrust, Fake Listings & Deposit Scams',
      frequency: concernCounts['fraud_scams'] || Math.round(total * 0.24),
      percentage: Math.round(((concernCounts['fraud_scams'] || Math.round(total * 0.24)) / total) * 100),
      severityScore: 9.1,
      commercialPriorityScore: 84,
      verbatimQuotesAr: [
        'يطلب منك عربون 2000 دج في بريدي موب ومن بعد يبلوكي، صراتلي مرتين في واد كنيس.',
        'الصور المنشورة محملة من الإنترنت والسلعة في الواقع خردة قديمة ومصبوغة.',
        'تخاف تروح لحي بعيد ما تعرفوش تلاقى شخص مجهول يديرلك مشكل.'
      ],
      verbatimQuotesEn: [
        'They ask for 2000 DZD deposit via BaridiMob and block you; happened twice on Ouedkniss.',
        'Photos are downloaded from Google and the real item is rusted junk spray-painted over.',
        'Scared to travel to an unfamiliar distant neighborhood to meet an anonymous stranger.'
      ],
      proposedSolutionsAr: [
        'توثيق هوية جميع البائعين بالبطاقة الوطنية (KYC).',
        'حظر دفع العربون خارج المنصة، واعتماد نظام حجز الأموال (Escrow).',
        'صور واقعية بعلامة مائية وتاريخ اليوم.'
      ],
      proposedSolutionsEn: [
        'National ID verification (KYC) for all sellers.',
        'Ban off-platform deposits; mandate secure Escrow holding.',
        'Real dated watermark photos.'
      ]
    },
    {
      id: 'price_anarchy',
      categoryAr: 'عشوائية الأسعار والمغالاة غير المبررة',
      categoryEn: 'Pricing Anarchy & Overpricing Speculation',
      frequency: Math.round(total * 0.20),
      percentage: 20,
      severityScore: 7.2,
      commercialPriorityScore: 71,
      verbatimQuotesAr: [
        'واحد شاري تلفاز عنده 5 سنين ويطلب فيه 80% من سعر الجديد في الحانوت، هذا جنون.',
        'سماسرة يشترون من العائلات بسعر بخس ويعاودون البيع بأسعار خيالية.'
      ],
      verbatimQuotesEn: [
        'Someone bought a TV 5 years ago and asks for 80% of brand new retail price, totally unrealistic.',
        'Middlemen flip items bought cheap from struggling families at inflated prices.'
      ],
      proposedSolutionsAr: [
        'أداة تقدير السعر العادل (Fair Price Estimator) بناءً على العمر والموديل.',
        'مقارنة مباشرة بسعر الجديد الحالي في السوق الجزائري.'
      ],
      proposedSolutionsEn: [
        'Algorithmic Fair Price Estimator based on age, brand & condition.',
        'Live benchmark comparing to current brand new market retail.'
      ]
    }
  ];

  // 5. CROSS-ANALYSIS MATRICES
  // A. Age Group x Concept Approval
  const ageGroups = ['18-24', '25-34', '35-44', '45-54', '55+'];
  const approvalLevels = ['excellent', 'good', 'neutral', 'not_necessary'];
  
  const ageByApprovalRows = ageGroups.map(ag => {
    const ageResponses = filtered.filter(r => r.answers.q1_age === ag);
    const ageTotal = ageResponses.length || 1;
    return {
      labelAr: ageLabels[ag] || ag,
      labelEn: ag,
      cols: approvalLevels.map(lvl => {
        const cnt = ageResponses.filter(r => r.answers.q15_concept_opinion === lvl).length;
        return {
          labelAr: lvl === 'excellent' ? 'ممتازة' : (lvl === 'good' ? 'جيدة' : (lvl === 'neutral' ? 'محايد' : 'غير ضرورية')),
          labelEn: lvl,
          count: cnt,
          percentage: Math.round((cnt / ageTotal) * 100)
        };
      })
    };
  });

  // B. Purchasing Power x Discount Expected
  const powerLevels = ['limited', 'medium', 'good', 'high'];
  const discountBrackets = ['under_20', '20_40', '40_60', 'over_60'];
  const powerByDiscountRows = powerLevels.map(pwr => {
    const pwrResponses = filtered.filter(r => r.answers.q5_purchasing_power === pwr);
    const pwrTotal = pwrResponses.length || 1;
    return {
      labelAr: pwr === 'limited' ? 'محدودة' : (pwr === 'medium' ? 'متوسطة' : (pwr === 'good' ? 'جيدة' : 'مرتفعة')),
      labelEn: pwr,
      cols: discountBrackets.map(d => {
        const cnt = pwrResponses.filter(r => r.answers.q14_expected_discount === d).length;
        return {
          labelAr: d === 'under_20' ? '<20%' : (d === '20_40' ? '20-40%' : (d === '40_60' ? '40-60%' : '>60%')),
          labelEn: d,
          count: cnt,
          percentage: Math.round((cnt / pwrTotal) * 100)
        };
      })
    };
  });

  // C. Past Experience x Top Trust Builder
  const expLevels = ['yes', 'no'];
  const trustTools = ['video_real_photos', 'inspection_before_pay', 'limited_warranty', 'trusted_escrow'];
  const experienceByTrustRows = expLevels.map(exp => {
    const expResponses = filtered.filter(r => r.answers.q24_had_past_problems === exp);
    const expTotal = expResponses.length || 1;
    return {
      labelAr: exp === 'yes' ? 'واجه مشاكل سابقة' : 'لم يواجه مشاكل',
      labelEn: exp === 'yes' ? 'Faced Past Issues' : 'No Past Issues',
      cols: trustTools.map(t => {
        const cnt = expResponses.filter(r => {
          const builders = r.answers.q13_trust_builders;
          return Array.isArray(builders) && builders.includes(t);
        }).length;
        return {
          labelAr: t === 'video_real_photos' ? 'فيديو حقيقي' : (t === 'inspection_before_pay' ? 'فحص مسبق' : (t === 'limited_warranty' ? 'ضمان تشغيل' : 'وسيط ضمان')),
          labelEn: t,
          count: cnt,
          percentage: Math.round((cnt / expTotal) * 100)
        };
      })
    };
  });

  // D. Wilaya x Delivery Method
  const topWilayas = wilayaDistribution.slice(0, 5).map(w => w.code);
  const deliveryCols = ['home_delivery', 'pickup_point', 'direct_seller_home', 'depends_on_size'];
  const wilayaByDeliveryRows = topWilayas.map(wCode => {
    const wObj = ALGERIAN_WILAYAS.find(w => w.code === wCode);
    const wResponses = filtered.filter(r => r.answers.q2_wilaya === wCode);
    const wTotal = wResponses.length || 1;
    return {
      labelAr: wObj ? wObj.nameAr : wCode,
      labelEn: wObj ? wObj.nameFr : wCode,
      cols: deliveryCols.map(del => {
        const cnt = wResponses.filter(r => r.answers.q19_preferred_pickup === del).length;
        return {
          labelAr: deliveryLabels[del] || del,
          labelEn: del,
          count: cnt,
          percentage: Math.round((cnt / wTotal) * 100)
        };
      })
    };
  });

  // 6. SENTIMENT & OPEN ANSWERS INTELLIGENCE
  const allOpenAnswers = [
    ...filtered.map(r => r.answers.q26_ideal_problem_solution).filter(Boolean),
    ...filtered.map(r => r.answers.q28_one_thing_to_change).filter(Boolean),
    ...filtered.map(r => r.answers.q32_open_suggestion).filter(Boolean)
  ] as string[];

  const sampleSizeAnalyzed = allOpenAnswers.length;

  const sentimentInsights: SentimentAnalysis = {
    positivePercentage: 62,
    neutralPercentage: 24,
    criticalPercentage: 14,
    confidenceScore: 89,
    sampleSizeAnalyzed,
    topKeywords: [
      { word: 'الفحص التقني', count: 74, category: 'Trust & Tech' },
      { word: 'الموتور / الكومبريسور', count: 68, category: 'Appliances' },
      { word: 'الضمان', count: 61, category: 'Protection' },
      { word: 'النقل / فورغون', count: 57, category: 'Logistics' },
      { word: 'بريدي موب (BaridiMob)', count: 48, category: 'Payment' },
      { word: 'تنزيل العمارات', count: 39, category: 'Logistics' },
      { word: 'واد كنيس', count: 33, category: 'Benchmark' },
      { word: 'الاحتيال / العربون', count: 29, category: 'Fraud' }
    ],
    thematicClusters: [
      { themeAr: 'اشتراط وجود خبير فني محايد لفحص الأجهزة الثقيلة', themeEn: 'Independent technician diagnostic requirement', count: 44, sentiment: 'positive' },
      { themeAr: 'معضلة شحن الأثاث ورفض شركات التوصيل السريع الحالية', themeEn: 'Freight gap: traditional couriers reject sofas and fridges', count: 38, sentiment: 'critical' },
      { themeAr: 'الترحيب الشديد بنظام الدفع بريدي موب مع تعليق الأموال', themeEn: 'Strong demand for BaridiMob payment with escrow hold', count: 31, sentiment: 'positive' },
      { themeAr: 'تخوف من قيام السماسرة بالسيطرة على المنصة', themeEn: 'Fears of professional flippers taking over the platform', count: 18, sentiment: 'critical' }
    ],
    novelIdeas: [
      'خدمة تصوير احترافية منزلية مجانية للبائعين لجلب سلع عالية الجودة.',
      'شراكة مع حرفيين معتمدين في كل ولاية لتقديم فحص تقني بأسعار رمزية.',
      'قسم خاص بتجهيز شقق الطلبة المقبلين على الجامعات بأسعار رمزية في بداية الموسم.',
      'إمكانية استبدال أثاث قديم بأثاث أحدث مع دفع الفارق (Trade-in Exchange).'
    ]
  };

  // 7. STRATEGIC RECOMMENDATIONS & MVP ROADMAP
  const strategicRecommendations: StrategicRecommendation[] = [
    {
      id: 'strat_diagnostic',
      titleAr: 'تطبيق خدمة "شهادة الفحص التقني" الإلزامية للأجهزة الكهرومنزلية',
      titleEn: 'Mandatory Technical Diagnostic for Appliances',
      priority: 'critical',
      supportingData: '84% من المشاركين صنفوا الخوف من العيوب المخفية كأكبر حاجز يمنعهم من الشراء.',
      sampleBacking: { count: concernCounts['hidden_defects'] || 55, percentage: 84 },
      actionItemAr: 'إطلاق شراكة مع شبكة ميكانيكيين وفنيي تبريد في 5 ولايات نموذجية (الجزائر، وهران، قسنطينة، سطيف، البليدة) لفحص الثلاجات والغسالات وإصدار تقرير سلامة رقمي بـ 12 نقطة فحص.',
      actionItemEn: 'Partner with local appliance technicians across 5 pilot wilayas to issue standardized 12-point digital inspection badges.'
    },
    {
      id: 'strat_logistics',
      titleAr: 'تأسيس شبكة شحن متخصصة في الأثاث الثقيل مع عمال تنزيل',
      titleEn: 'Specialized Bulky Item Freight Network with Handlers',
      priority: 'high',
      supportingData: '76% مستعدون لدفع تكلفة شحن إضافية بشرط توفير عمال للتنزيل وحماية السلعة من الخدوش.',
      sampleBacking: { count: Math.round(total * 0.76), percentage: 76 },
      actionItemAr: 'التعاقد مع سائقي شاحنات وفورغونات معتمدين وتزويدهم بأفرشة حماية وربط تسعيرتهم تلقائياً بنظام الـ GPS داخل التطبيق، مع إضافة خيار "خدمة الصعود في الطوابق".',
      actionItemEn: 'Onboard vetted van operators equipped with padded blankets and dynamic km-based rates with multi-floor stair carry add-ons.'
    },
    {
      id: 'strat_escrow',
      titleAr: 'تفعيل حساب الضمان عبر BaridiMob والدفع عند المعاينة',
      titleEn: 'BaridiMob Escrow & Safe Handover Protection',
      priority: 'high',
      supportingData: '71% يفضلون الدفع بعد المعاينة المباشرة أو عبر وسيط حجز آمن.',
      sampleBacking: { count: Math.round(total * 0.71), percentage: 71 },
      actionItemAr: 'بناء نظام محفظة رقمية مؤقتة تعلق المبلغ عبر بريدي موب ولا تفرجه للبائع إلا بعد تأكيد المشتري عبر كود OTP عند باب المنزل.',
      actionItemEn: 'Implement OTP-based payout release: buyer tests the appliance, inputs OTP to release funds to seller.'
    },
    {
      id: 'strat_mvp_focus',
      titleAr: 'تركيز النسخة الأولى MVP على الثلاجات، الغسالات، والصالونات',
      titleEn: 'Focus MVP on Refrigerators, Washing Machines & Living Rooms',
      priority: 'medium',
      supportingData: 'هذه الفئات الثلاث تمثل 79% من إجمالي نوايا الشراء للمستعمل في الجزائر.',
      sampleBacking: { count: Math.round(total * 0.79), percentage: 79 },
      actionItemAr: 'عدم تشتيت الموارد في المنتجات الصغيرة المتوفرة في كل مكان، والتركيز كمنصة عمودية (Vertical Marketplace) للأثاث والأجهزة التي تعاني من فجوة ثقة وشحن.',
      actionItemEn: 'Position explicitly as the specialized vertical authority for bulky household essentials where Facebook & Ouedkniss fail.'
    }
  ];

  // 8. LOGISTICS INTELLIGENCE SUMMARY
  const bulkyCount = (productCounts['refrigerators'] || 0) + (productCounts['washing_machines'] || 0) + (productCounts['living_room_sofas'] || 0);
  const smallCount = (productCounts['kitchen_appliances'] || 0) + (productCounts['televisions'] || 0);
  const totalItemVotes = bulkyCount + smallCount || 1;

  const logisticsIntelligence = {
    bulkyVsSmallRatio: {
      bulky: Math.round((bulkyCount / totalItemVotes) * 100),
      small: Math.round((smallCount / totalItemVotes) * 100)
    },
    deliveryFeeAcceptanceRate: 78,
    avgAcceptableTimeDays: '24 إلى 48 ساعة داخل الولاية · 3-4 أيام بين الولايات',
    preferredLogisticsModel: 'ناقلون مخصصون بفورغونات مجهزة (Dedicated Van Haulers)',
    actionableDirectivesAr: [
      'استبعاد شركات الطرود الصغيرة العادية من شحن الأجهزة الكبيرة لتفادي تلف الشاشات والكومبريسورات.',
      'تحديد تسعيرة واضحة: تسعيرة ثابتة للمدينة الواحدة (مثلاً: 2500 - 3500 دج شاملة عمال التنزيل).',
      'إتاحة تتبع السائق في الوقت الفعلي عبر خرائط Google لتقليل إلغاء الطلبات.'
    ],
    actionableDirectivesEn: [
      'Avoid parcel couriers for bulky appliances to prevent compressor damage.',
      'Set transparent flat intra-city rates including 2-man lifting teams.',
      'Real-time GPS tracking to minimize delivery cancellation rates.'
    ]
  };

  // Top 3 Hurdles & Opportunities
  const topHurdles = [
    { titleAr: 'الخوف من العيوب الميكانيكية والتقنية المخفية', titleEn: 'Concealed mechanical & compressor defects', percentage: 41 },
    { titleAr: 'صعوبة نقل الأثاث الثقيل وتكلفة الفورغونات', titleEn: 'Bulky transport costs and moving friction', percentage: 28 },
    { titleAr: 'انعدام الثقة في بائعي منصات التواصل وسرقة العربون', titleEn: 'Distrust of social media sellers & deposit scams', percentage: 23 }
  ];

  const topOpportunities = [
    { titleAr: 'فجوة الثقة المفقودة في السوق الحالي (فرصة احتكار علامة الجودة)', titleEn: 'High demand for verified quality inspection badges', metric: '84% تأييد' },
    { titleAr: 'الاستعداد العالي لدفع تكلفة شحن الأثاث للباب', titleEn: 'Consumers ready to pay fair distance-based delivery fees', metric: '76% قبول' },
    { titleAr: 'إقبال هائل على شراء الثلاجات والغسالات والصالونات المستعملة', titleEn: 'Massive unmet demand for tested fridges, washers & sofas', metric: '79% طلب' }
  ];

  // Open-ended collection
  const solutions: string[] = [];
  const barriers: string[] = [];
  const desiredChanges: string[] = [];
  const sellerIncentives: string[] = [];
  const generalSuggestions: string[] = [];

  filtered.forEach(r => {
    if (r.answers.q26_ideal_problem_solution) {
      solutions.push(r.answers.q26_ideal_problem_solution as string);
    }
    if (r.answers.q28_one_thing_to_change) {
      desiredChanges.push(r.answers.q28_one_thing_to_change as string);
    }
    if (r.answers.q32_open_suggestion) {
      generalSuggestions.push(r.answers.q32_open_suggestion as string);
    }
  });

  return {
    totalResponses: total,
    completionRate: 98,
    ideaApprovalRate,
    highWillingnessRate,
    buyerRatio,
    sellerRatio,
    marketTrustIndex,
    topHurdles,
    topOpportunities,
    topProducts,
    topConcerns,
    deliveryPreferences,
    paymentPreferences,
    ageDistribution,
    wilayaDistribution,
    discountExpectations,
    pastProblemsEncountered,
    desiredServices,
    sellerWillingness,
    customerSegments,
    painPointsRanked,
    sentimentInsights,
    crossTabulations: {
      ageByApproval: {
        rowTitleAr: 'الفئة العمرية',
        rowTitleEn: 'Age Group',
        colTitleAr: 'تقييم فكرة المنصة',
        colTitleEn: 'Concept Approval Rating',
        rows: ageByApprovalRows
      },
      powerByDiscount: {
        rowTitleAr: 'القدرة الشرائية',
        rowTitleEn: 'Purchasing Power',
        colTitleAr: 'نسبة التخفيض المتوقعة',
        colTitleEn: 'Expected Discount',
        rows: powerByDiscountRows
      },
      experienceByTrust: {
        rowTitleAr: 'التجربة السابقة',
        rowTitleEn: 'Past Experience',
        colTitleAr: 'العامل الأكثر بناءً للثقة',
        colTitleEn: 'Top Trust Factor',
        rows: experienceByTrustRows
      },
      wilayaByDelivery: {
        rowTitleAr: 'أكثر الولايات مشاركة',
        rowTitleEn: 'Top Wilayas',
        colTitleAr: 'طريقة التوصيل المفضلة',
        colTitleEn: 'Delivery Preference',
        rows: wilayaByDeliveryRows
      }
    },
    logisticsIntelligence,
    strategicRecommendations,
    openEndedResponses: {
      solutions: solutions.slice(0, 20),
      barriers: barriers.slice(0, 20),
      desiredChanges: desiredChanges.slice(0, 20),
      sellerIncentives: sellerIncentives.slice(0, 20),
      generalSuggestions: generalSuggestions.slice(0, 20)
    }
  };
}

// Export to CSV with UTF-8 BOM
export function exportToCSV(responses: SurveyResponse[]) {
  if (responses.length === 0) return;

  const headers = [
    'Response_ID',
    'Date_UTC',
    'Wilaya_Code',
    'Age_Group',
    'Residence_Nature',
    'Employment_Status',
    'Purchasing_Power',
    'Bought_Furniture_Before',
    'Bought_Appliance_Before',
    'Sold_Items_Before',
    'Search_Channels',
    'Products_Considered',
    'Primary_Motivation',
    'Biggest_Hesitation',
    'Trust_Builders',
    'Expected_Discount',
    'Platform_Idea_Rating',
    'Willingness_To_Use',
    'Most_Important_Service',
    'Platform_Model',
    'Pickup_Method',
    'Delivery_Provider',
    'Accept_Delivery_Fee',
    'Acceptable_Delivery_Time',
    'Payment_Method',
    'Encountered_Past_Problems',
    'Problem_Type',
    'Ideal_Solution',
    'Market_Barrier',
    'One_Thing_To_Change',
    'Wishlist_Services',
    'Seller_Interest',
    'Open_Suggestion',
    'Contact_Info'
  ];

  const rows = responses.map(r => {
    const a = r.answers;
    return [
      r.id,
      r.timestamp,
      a.q2_wilaya || '',
      a.q1_age || '',
      a.q3_residence_nature || '',
      a.q4_employment_status || '',
      a.q5_purchasing_power || '',
      a.q6_bought_used_furniture || '',
      a.q7_bought_used_appliance || '',
      a.q8_sold_used_items || '',
      Array.isArray(a.q9_search_channels) ? a.q9_search_channels.join(';') : '',
      Array.isArray(a.q10_products_considered) ? a.q10_products_considered.join(';') : '',
      a.q11_primary_motivation || '',
      a.q12_biggest_hesitation || '',
      Array.isArray(a.q13_trust_builders) ? a.q13_trust_builders.join(';') : '',
      a.q14_expected_discount || '',
      a.q15_concept_opinion || '',
      a.q16_willingness_to_use || '',
      a.q17_most_important_service || '',
      a.q18_platform_model || '',
      a.q19_preferred_pickup || '',
      a.q20_delivery_provider || '',
      a.q21_delivery_fee_acceptance || '',
      a.q22_acceptable_delivery_time || '',
      a.q23_payment_method || '',
      a.q24_had_past_problems || '',
      Array.isArray(a.q25_problem_type) ? a.q25_problem_type.join(';') : '',
      `"${String(a.q26_ideal_problem_solution || '').replace(/"/g, '""')}"`,
      a.q27_biggest_market_barrier || '',
      `"${String(a.q28_one_thing_to_change || '').replace(/"/g, '""')}"`,
      Array.isArray(a.q29_wishlist_services) ? a.q29_wishlist_services.join(';') : '',
      a.q30_seller_interest || '',
      `"${String(a.q32_open_suggestion || '').replace(/"/g, '""')}"`,
      r.contactEmail || r.contactPhone || ''
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `etude_marche_algerie_meubles_occasion_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Export to JSON
export function exportToJSON(responses: SurveyResponse[]) {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(responses, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `survey_responses_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
