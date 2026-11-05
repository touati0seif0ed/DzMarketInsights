import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const BASE_URL = 'http://localhost:3000';

async function capture() {
  console.log('Launching headless Chromium via Playwright...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  // Ensure directories exist
  const dirs = [
    path.join(ROOT_DIR, 'screenshots', 'survey'),
    path.join(ROOT_DIR, 'screenshots', 'analytics'),
    path.join(ROOT_DIR, 'screenshots', 'mobile')
  ];
  dirs.forEach(d => fs.mkdirSync(d, { recursive: true }));

  // -------------------------------------------------------------
  // 1. DESKTOP CONTEXT
  // -------------------------------------------------------------
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1.5,
    locale: 'ar-DZ'
  });
  const page = await desktopContext.newPage();

  console.log('1. Capturing survey/home-ar.png...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ROOT_DIR, 'screenshots', 'survey', 'home-ar.png') });

  console.log('2. Capturing survey/home-en.png...');
  // Click language switch button (English)
  const langBtn = page.locator('header button:has-text("English")');
  if (await langBtn.count() > 0) {
    await langBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(ROOT_DIR, 'screenshots', 'survey', 'home-en.png') });
    // Switch back to Arabic
    const arBtn = page.locator('header button:has-text("العربية")');
    if (await arBtn.count() > 0) await arBtn.click();
    await page.waitForTimeout(600);
  }

  console.log('3. Capturing survey/furniture-appliances.png...');
  // Inject draft state with Q10 active (Visual choice cards)
  await page.evaluate(() => {
    const draft = {
      answers: {
        q1_age: '25-34',
        q2_wilaya: '16',
        q3_residence_nature: 'urban',
        q4_employment_status: 'employee',
        q5_purchasing_power: 'medium',
        q6_bought_used_furniture: 'yes',
        q7_bought_used_appliance: 'yes',
        q8_sold_used_items: 'yes',
        q9_search_channels: ['facebook_marketplace', 'ouedkniss'],
        q10_products_considered: ['refrigerators', 'washing_machines', 'living_room_sofas']
      },
      currentStep: 9
    };
    localStorage.setItem('dz_used_market_survey_draft_v1', JSON.stringify(draft));
  });

  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const resumeBtn = page.locator('button:has-text("متابعة الاستبيان المحفوظ")');
  if (await resumeBtn.count() > 0) {
    await resumeBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(ROOT_DIR, 'screenshots', 'survey', 'furniture-appliances.png') });
  }

  console.log('4. Capturing survey/interactive-questions.png...');
  // Advance to Q12 or Q13
  await page.evaluate(() => {
    const draft = {
      answers: {
        q1_age: '25-34',
        q2_wilaya: '16',
        q3_residence_nature: 'urban',
        q4_employment_status: 'employee',
        q5_purchasing_power: 'medium',
        q6_bought_used_furniture: 'yes',
        q7_bought_used_appliance: 'yes',
        q8_sold_used_items: 'yes',
        q9_search_channels: ['facebook_marketplace'],
        q10_products_considered: ['refrigerators'],
        q11_primary_motivation: 'low_price',
        q12_biggest_hesitation: 'hidden_defects',
        q13_trust_builders: ['video_real_photos', 'inspection_before_pay', 'limited_warranty']
      },
      currentStep: 12
    };
    localStorage.setItem('dz_used_market_survey_draft_v1', JSON.stringify(draft));
  });
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  const resumeBtn2 = page.locator('button:has-text("متابعة الاستبيان المحفوظ")');
  if (await resumeBtn2.count() > 0) {
    await resumeBtn2.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(ROOT_DIR, 'screenshots', 'survey', 'interactive-questions.png') });
  }

  console.log('5. Capturing survey/delivery-payment.png...');
  // Advance to Q19 or Q20
  await page.evaluate(() => {
    const draft = {
      answers: {
        q1_age: '25-34',
        q2_wilaya: '16',
        q3_residence_nature: 'urban',
        q4_employment_status: 'employee',
        q5_purchasing_power: 'medium',
        q6_bought_used_furniture: 'yes',
        q7_bought_used_appliance: 'yes',
        q8_sold_used_items: 'yes',
        q9_search_channels: ['facebook_marketplace'],
        q10_products_considered: ['refrigerators'],
        q11_primary_motivation: 'low_price',
        q12_biggest_hesitation: 'hidden_defects',
        q13_trust_builders: ['video_real_photos'],
        q14_expected_discount: '40_60',
        q15_concept_opinion: 'excellent',
        q16_willingness_to_use: 'definitely',
        q17_most_important_service: 'verify_condition',
        q18_platform_model: 'hybrid',
        q19_preferred_pickup: 'home_delivery',
        q20_delivery_provider: 'dedicated_furniture_movers'
      },
      currentStep: 19
    };
    localStorage.setItem('dz_used_market_survey_draft_v1', JSON.stringify(draft));
  });
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  const resumeBtn3 = page.locator('button:has-text("متابعة الاستبيان المحفوظ")');
  if (await resumeBtn3.count() > 0) {
    await resumeBtn3.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(ROOT_DIR, 'screenshots', 'survey', 'delivery-payment.png') });
  }

  console.log('6. Capturing survey/completion.png...');
  await page.evaluate(() => {
    const draft = {
      answers: {
        q1_age: '25-34',
        q2_wilaya: '16',
        q3_residence_nature: 'urban',
        q4_employment_status: 'employee',
        q5_purchasing_power: 'medium',
        q6_bought_used_furniture: 'yes',
        q7_bought_used_appliance: 'yes',
        q8_sold_used_items: 'yes',
        q9_search_channels: ['facebook_marketplace'],
        q10_products_considered: ['living_room_sofas', 'refrigerators'],
        q11_primary_motivation: 'low_price',
        q12_biggest_hesitation: 'hidden_defects',
        q13_trust_builders: ['video_real_photos', 'fair_inspection_label'],
        q14_expected_discount: '40_60',
        q15_concept_opinion: 'excellent',
        q16_willingness_to_use: 'definitely',
        q17_most_important_service: 'verify_condition',
        q18_platform_model: 'hybrid',
        q19_preferred_pickup: 'home_delivery',
        q20_delivery_provider: 'dedicated_furniture_movers',
        q21_delivery_fee_acceptance: 'yes_reasonable',
        q22_acceptable_delivery_time: '24_48_hours',
        q23_payment_method: 'baridimob',
        q24_had_past_problems: 'no',
        q27_biggest_market_barrier: 'lack_of_trust_scams',
        q28_fair_price_ratio: '50_percent',
        q29_wishlist_services: ['technical_inspection', 'disassembly_assembly'],
        q30_seller_interest: 'yes',
        q31_seller_incentives: ['serious_buyers', 'guaranteed_payment'],
        q32_open_suggestion: 'منصة ممتازة جداً ونحتاج مثل هذه الخدمات المتخصصة والموثوقة في الجزائر بالتوفيق!'
      },
      currentStep: 30
    };
    localStorage.setItem('dz_used_market_survey_draft_v1', JSON.stringify(draft));
  });

  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  const resumeBtnEnd = page.locator('button:has-text("متابعة الاستبيان المحفوظ")').first();
  if (await resumeBtnEnd.count() > 0) {
    await resumeBtnEnd.click();
    await page.waitForTimeout(600);
    let nextCount = 0;
    while (await page.locator('button:has-text("متابعة")').count() > 0 && nextCount < 6) {
      await page.locator('button:has-text("متابعة")').first().click();
      await page.waitForTimeout(400);
      nextCount++;
    }
    const finalSubmit = page.locator('button:has-text("إرسال الإجابات النهائية")').first();
    if (await finalSubmit.count() > 0) {
      await finalSubmit.click();
      await page.waitForTimeout(1500);
      await page.screenshot({ path: path.join(ROOT_DIR, 'screenshots', 'survey', 'completion.png') });
    }
  }

  // -------------------------------------------------------------
  // 2. MOBILE CONTEXT (390 x 844)
  // -------------------------------------------------------------
  console.log('7. Capturing mobile/survey-mobile.png...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    locale: 'ar-DZ'
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(BASE_URL, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({ path: path.join(ROOT_DIR, 'screenshots', 'mobile', 'survey-mobile.png') });
  await mobileContext.close();

  // -------------------------------------------------------------
  // 3. ANALYTICS DASHBOARD CONTEXT (1440 x 1000)
  // -------------------------------------------------------------
  console.log('Capturing Analytics Dashboard Screenshots...');

  // Authenticate Admin via login API
  const adminPassword = process.env.ADMIN_PASSWORD_HASH || 'Admin2026!';
  const authResponse = await page.request.post(`${BASE_URL}/api/auth/login`, {
    data: { password: adminPassword }
  });
  const authData = await authResponse.json();
  const token = authData.token;

  // Set auth token in localStorage and navigate
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  if (token) {
    await page.evaluate((tok) => {
      localStorage.setItem('dz_admin_auth_token_v1', tok);
    }, token);
  }

  // Click Admin Dashboard access button
  const adminBtn = page.locator('header button:has-text("لوحة الإدارة الآمنة"), header button:has-text("ذكاء أبحاث السوق")').first();
  if (await adminBtn.count() > 0) {
    await adminBtn.click();
    await page.waitForTimeout(1500);
  }

  // Wait for AdminDashboard to render
  await page.locator('button:has-text("نظرة تنفيذية عامة")').first().waitFor({ state: 'visible', timeout: 15000 });

  // A. Executive Overview
  console.log('8. Capturing analytics/overview.png...');
  await page.locator('button:has-text("نظرة تنفيذية عامة")').first().click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ROOT_DIR, 'screenshots', 'analytics', 'overview.png') });

  // B. Consumer Behavior
  console.log('9. Capturing analytics/consumer-behavior.png...');
  await page.locator('button:has-text("سلوك المستهلك")').first().click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ROOT_DIR, 'screenshots', 'analytics', 'consumer-behavior.png') });

  // C. Customer Segmentation
  console.log('10. Capturing analytics/customer-segmentation.png...');
  await page.locator('button:has-text("تقسيم العملاء")').first().click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ROOT_DIR, 'screenshots', 'analytics', 'customer-segmentation.png') });

  // D. Pain Points
  console.log('11. Capturing analytics/pain-points.png...');
  await page.locator('button:has-text("نقاط الألم والأولويات")').first().click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ROOT_DIR, 'screenshots', 'analytics', 'pain-points.png') });

  // E. Cross-Analysis
  console.log('12. Capturing analytics/cross-analysis.png...');
  await page.locator('button:has-text("التحليل المتقاطع")').first().click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ROOT_DIR, 'screenshots', 'analytics', 'cross-analysis.png') });

  // F. Logistics
  console.log('13. Capturing analytics/logistics.png...');
  await page.locator('button:has-text("اللوجستيات والشحن")').first().click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ROOT_DIR, 'screenshots', 'analytics', 'logistics.png') });

  // G. Strategic Insights
  console.log('14. Capturing analytics/strategic-insights.png...');
  await page.locator('button:has-text("الفرص والتوصيات")').first().click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ROOT_DIR, 'screenshots', 'analytics', 'strategic-insights.png') });

  // H. Sentiment Analysis
  console.log('15. Capturing analytics/sentiment-analysis.png...');
  await page.locator('button:has-text("تحليل المشاعر والنصوص")').first().click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ROOT_DIR, 'screenshots', 'analytics', 'sentiment-analysis.png') });

  await browser.close();
  console.log('All authentic application screenshots captured successfully!');
}

capture().catch(err => {
  console.error('Error during screenshot capture:', err);
  process.exit(1);
});
