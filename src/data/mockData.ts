import { SurveyResponse } from '../types/survey';

export const INITIAL_MOCK_RESPONSES: SurveyResponse[] = [
  {
    id: 'resp-dz-001',
    timestamp: '2026-11-04T10:14:00Z',
    language: 'ar',
    completionTimeSeconds: 280,
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
      q10_products_considered: ['refrigerators', 'washing_machines', 'living_room_sofas'],
      q11_primary_motivation: 'low_price',
      q12_biggest_hesitation: 'hidden_defects',
      q13_trust_builders: ['video_real_photos', 'inspection_before_pay', 'limited_warranty'],
      q14_expected_discount: '40_60',
      q15_concept_opinion: 'excellent',
      q16_willingness_to_use: 'definitely',
      q17_most_important_service: 'verify_condition',
      q18_platform_model: 'hybrid',
      q19_preferred_pickup: 'home_delivery',
      q20_delivery_provider: 'dedicated_furniture_movers',
      q21_delivery_fee_acceptance: 'yes_reasonable',
      q22_acceptable_delivery_time: '24_48_hours',
      q23_payment_method: 'cash_on_delivery',
      q24_had_past_problems: 'yes',
      q25_problem_type: ['hidden_technical_defects', 'transport_breakage'],
      q26_ideal_problem_solution: 'لو كان هناك فحص تقني مسبق للموتور وتوصيل مخصص للأجهزة الكبيرة عبر فورغون مجهز.',
      q27_biggest_market_barrier: 'lack_of_trust_scams',
      q28_one_thing_to_change: 'إلزام البائع بتقديم ضمان تجربة لمدة أسبوع وحظر الحسابات الوهمية.',
      q29_wishlist_services: ['technical_inspection', 'furniture_assembly_transport', 'working_warranty'],
      q30_seller_interest: 'yes',
      q31_seller_incentives: ['home_pickup_for_seller', 'serious_buyers', 'guaranteed_payment'],
      q32_open_suggestion: 'التطبيق يحتاج شراكة مع حرفيين معتمدين لفحص الثلاجات والغسالات قبل تسليمها.'
    },
    contactEmail: 'amine.k@example.dz',
    wantsBetaAccess: true
  },
  {
    id: 'resp-dz-002',
    timestamp: '2026-11-04T11:22:00Z',
    language: 'ar',
    completionTimeSeconds: 310,
    answers: {
      q1_age: '18-24',
      q2_wilaya: '31',
      q3_residence_nature: 'urban',
      q4_employment_status: 'student',
      q5_purchasing_power: 'limited',
      q6_bought_used_furniture: 'yes',
      q7_bought_used_appliance: 'no',
      q8_sold_used_items: 'no',
      q9_search_channels: ['facebook_marketplace', 'facebook_groups'],
      q10_products_considered: ['dining_tables_chairs', 'televisions', 'bedroom_furniture'],
      q11_primary_motivation: 'saving_money',
      q12_biggest_hesitation: 'fraud_scams',
      q13_trust_builders: ['trusted_escrow', 'seller_ratings', 'inspection_before_pay'],
      q14_expected_discount: 'over_60',
      q15_concept_opinion: 'excellent',
      q16_willingness_to_use: 'definitely',
      q17_most_important_service: 'cod',
      q18_platform_model: 'c2c_only',
      q19_preferred_pickup: 'depends_on_size',
      q20_delivery_provider: 'private_couriers',
      q21_delivery_fee_acceptance: 'yes_reasonable',
      q22_acceptable_delivery_time: '24_48_hours',
      q23_payment_method: 'baridimob',
      q24_had_past_problems: 'no',
      q27_biggest_market_barrier: 'transport_logistics',
      q28_one_thing_to_change: 'توفير أسعار مناسبة للطلبة والمقبلين على الزواج.',
      q29_wishlist_services: ['mandatory_video_360', 'trusted_seller_badges', 'buyer_protection_fund'],
      q30_seller_interest: 'maybe',
      q31_seller_incentives: ['free_listing', 'serious_buyers'],
      q32_open_suggestion: 'أرجو إضافة قسم خاص بتأثيث شقق الطلبة والعائلات الشابة.'
    },
    contactEmail: 'sarah.m@univ-oran.dz',
    wantsBetaAccess: true
  },
  {
    id: 'resp-dz-003',
    timestamp: '2026-11-04T12:05:00Z',
    language: 'en',
    completionTimeSeconds: 245,
    answers: {
      q1_age: '35-44',
      q2_wilaya: '25',
      q3_residence_nature: 'suburban',
      q4_employment_status: 'business_owner',
      q5_purchasing_power: 'good',
      q6_bought_used_furniture: 'yes',
      q7_bought_used_appliance: 'yes',
      q8_sold_used_items: 'yes',
      q9_search_channels: ['ouedkniss', 'traditional_shops'],
      q10_products_considered: ['air_conditioners', 'refrigerators', 'living_room_sofas'],
      q11_primary_motivation: 'high_build_quality',
      q12_biggest_hesitation: 'no_warranty',
      q13_trust_builders: ['limited_warranty', 'return_guarantee', 'inspection_before_pay'],
      q14_expected_discount: '20_40',
      q15_concept_opinion: 'good',
      q16_willingness_to_use: 'mostly',
      q17_most_important_service: 'verify_sellers',
      q18_platform_model: 'hybrid',
      q19_preferred_pickup: 'home_delivery',
      q20_delivery_provider: 'dedicated_furniture_movers',
      q21_delivery_fee_acceptance: 'yes_always',
      q22_acceptable_delivery_time: '24_48_hours',
      q23_payment_method: 'cash_on_delivery',
      q24_had_past_problems: 'yes',
      q25_problem_type: ['hidden_technical_defects', 'item_different_from_photos'],
      q26_ideal_problem_solution: 'Mandatory operational video and escrow guarantee for 72 hours before money release.',
      q27_biggest_market_barrier: 'lack_of_warranty_inspection',
      q28_one_thing_to_change: 'Professional inspection certificates for all second-hand cooling and compressor units.',
      q29_wishlist_services: ['technical_inspection', 'working_warranty', 'furniture_assembly_transport'],
      q30_seller_interest: 'yes',
      q31_seller_incentives: ['home_pickup_for_seller', 'guaranteed_payment'],
      q32_open_suggestion: 'Provide verified store badges for established shops in Constantine and Setif.'
    },
    contactEmail: 'tarek.c@gmail.com',
    wantsBetaAccess: true
  },
  {
    id: 'resp-dz-004',
    timestamp: '2026-11-04T13:40:00Z',
    language: 'ar',
    completionTimeSeconds: 320,
    answers: {
      q1_age: '45-54',
      q2_wilaya: '19',
      q3_residence_nature: 'urban',
      q4_employment_status: 'employee',
      q5_purchasing_power: 'medium',
      q6_bought_used_furniture: 'yes',
      q7_bought_used_appliance: 'yes',
      q8_sold_used_items: 'yes',
      q9_search_channels: ['ouedkniss', 'traditional_shops', 'friends_family'],
      q10_products_considered: ['bedroom_furniture', 'washing_machines', 'dining_tables_chairs'],
      q11_primary_motivation: 'unaffordable_new',
      q12_biggest_hesitation: 'hidden_defects',
      q13_trust_builders: ['video_real_photos', 'inspection_before_pay', 'return_guarantee'],
      q14_expected_discount: '40_60',
      q15_concept_opinion: 'excellent',
      q16_willingness_to_use: 'definitely',
      q17_most_important_service: 'verify_condition',
      q18_platform_model: 'hybrid',
      q19_preferred_pickup: 'home_delivery',
      q20_delivery_provider: 'dedicated_furniture_movers',
      q21_delivery_fee_acceptance: 'yes_reasonable',
      q22_acceptable_delivery_time: '24_48_hours',
      q23_payment_method: 'cash_on_delivery',
      q24_had_past_problems: 'yes',
      q25_problem_type: ['untrustworthy_seller', 'hidden_technical_defects'],
      q26_ideal_problem_solution: 'لو كان البائع موثقاً برقم هويته مع سياسة استرجاع واضحة في حال تعطل الجهاز بعد 48 ساعة.',
      q27_biggest_market_barrier: 'lack_of_trust_scams',
      q28_one_thing_to_change: 'إلغاء السماسرة والوسطاء الجشعين الذين يشترون بثمن بخس ويعيدون البيع بأسعار مبالغ فيها.',
      q29_wishlist_services: ['technical_inspection', 'working_warranty', 'buyer_protection_fund'],
      q30_seller_interest: 'yes',
      q31_seller_incentives: ['serious_buyers', 'home_pickup_for_seller'],
      q32_open_suggestion: 'فكرة ممتازة جداً، مدينة سطيف سوق نشط جداً للمستعمل وسيكون التجاوب كبيراً.'
    },
    contactPhone: '0550123456',
    wantsBetaAccess: true
  },
  {
    id: 'resp-dz-005',
    timestamp: '2026-11-04T14:15:00Z',
    language: 'ar',
    completionTimeSeconds: 215,
    answers: {
      q1_age: '25-34',
      q2_wilaya: '09',
      q3_residence_nature: 'suburban',
      q4_employment_status: 'freelancer',
      q5_purchasing_power: 'medium',
      q6_bought_used_furniture: 'no',
      q7_bought_used_appliance: 'yes',
      q8_sold_used_items: 'no',
      q9_search_channels: ['facebook_marketplace', 'ouedkniss'],
      q10_products_considered: ['televisions', 'air_conditioners', 'kitchen_appliances'],
      q11_primary_motivation: 'saving_money',
      q12_biggest_hesitation: 'no_warranty',
      q13_trust_builders: ['trusted_escrow', 'seller_ratings', 'limited_warranty'],
      q14_expected_discount: '20_40',
      q15_concept_opinion: 'excellent',
      q16_willingness_to_use: 'definitely',
      q17_most_important_service: 'limited_warranty',
      q18_platform_model: 'hybrid',
      q19_preferred_pickup: 'home_delivery',
      q20_delivery_provider: 'dedicated_furniture_movers',
      q21_delivery_fee_acceptance: 'yes_reasonable',
      q22_acceptable_delivery_time: 'same_day',
      q23_payment_method: 'baridimob',
      q24_had_past_problems: 'no',
      q27_biggest_market_barrier: 'lack_of_warranty_inspection',
      q28_one_thing_to_change: 'إتاحة إمكانية الدفع عبر بريدي موب مع تعليق الأموال حتى يؤكد المشتري استلام السلعة سليمة.',
      q29_wishlist_services: ['working_warranty', 'mandatory_video_360', 'trusted_seller_badges'],
      q30_seller_interest: 'maybe',
      q31_seller_incentives: ['easy_listing_ai', 'serious_buyers'],
      q32_open_suggestion: 'ركزوا على واجهة بسيطة وسريعة تعمل بسلاسة على شبكات الجيل الرابع في الجزائر.'
    },
    contactEmail: 'karim.blida@gmail.com',
    wantsBetaAccess: true
  },
  {
    id: 'resp-dz-006',
    timestamp: '2026-11-04T15:02:00Z',
    language: 'ar',
    completionTimeSeconds: 290,
    answers: {
      q1_age: '35-44',
      q2_wilaya: '23',
      q3_residence_nature: 'urban',
      q4_employment_status: 'employee',
      q5_purchasing_power: 'good',
      q6_bought_used_furniture: 'yes',
      q7_bought_used_appliance: 'no',
      q8_sold_used_items: 'yes',
      q9_search_channels: ['facebook_groups', 'friends_family'],
      q10_products_considered: ['living_room_sofas', 'bedroom_furniture', 'dining_tables_chairs'],
      q11_primary_motivation: 'high_build_quality',
      q12_biggest_hesitation: 'high_transport_costs',
      q13_trust_builders: ['video_real_photos', 'inspection_before_pay'],
      q14_expected_discount: '40_60',
      q15_concept_opinion: 'excellent',
      q16_willingness_to_use: 'mostly',
      q17_most_important_service: 'home_delivery',
      q18_platform_model: 'both',
      q19_preferred_pickup: 'home_delivery',
      q20_delivery_provider: 'dedicated_furniture_movers',
      q21_delivery_fee_acceptance: 'yes_always',
      q22_acceptable_delivery_time: '24_48_hours',
      q23_payment_method: 'cash_on_delivery',
      q24_had_past_problems: 'yes',
      q25_problem_type: ['transport_breakage', 'item_different_from_photos'],
      q26_ideal_problem_solution: 'عمال نقل وتغليف محترفين لحماية الأثاث من الخدوش والكسور أثناء الصعود في العمارات.',
      q27_biggest_market_barrier: 'transport_logistics',
      q28_one_thing_to_change: 'حل معضلة النقل وتنزيل الأثاث في الطوابق العليا.',
      q29_wishlist_services: ['furniture_assembly_transport', 'mandatory_video_360', 'trusted_seller_badges'],
      q30_seller_interest: 'yes',
      q31_seller_incentives: ['home_pickup_for_seller', 'serious_buyers'],
      q32_open_suggestion: 'عنابة تعاني من نقص شاحنات النقل المنظمة، هذه الميزة ستكون نقطة قوة خارقة للمنصة.'
    },
    contactPhone: '0661987654',
    wantsBetaAccess: true
  },
  {
    id: 'resp-dz-007',
    timestamp: '2026-11-04T16:20:00Z',
    language: 'ar',
    completionTimeSeconds: 270,
    answers: {
      q1_age: '25-34',
      q2_wilaya: '15',
      q3_residence_nature: 'suburban',
      q4_employment_status: 'freelancer',
      q5_purchasing_power: 'medium',
      q6_bought_used_furniture: 'yes',
      q7_bought_used_appliance: 'yes',
      q8_sold_used_items: 'no',
      q9_search_channels: ['facebook_marketplace', 'ouedkniss'],
      q10_products_considered: ['refrigerators', 'air_conditioners', 'televisions', 'kitchen_appliances'],
      q11_primary_motivation: 'low_price',
      q12_biggest_hesitation: 'hidden_defects',
      q13_trust_builders: ['video_real_photos', 'limited_warranty', 'return_guarantee'],
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
      q24_had_past_problems: 'yes',
      q25_problem_type: ['hidden_technical_defects'],
      q26_ideal_problem_solution: 'لو تم فحص كمبريسور المكيف قبل دفعه ثمنه.',
      q27_biggest_market_barrier: 'lack_of_warranty_inspection',
      q28_one_thing_to_change: 'إرساء الثقة والضمان.',
      q29_wishlist_services: ['technical_inspection', 'working_warranty', 'buyer_protection_fund'],
      q30_seller_interest: 'maybe',
      q31_seller_incentives: ['free_listing', 'guaranteed_payment'],
      q32_open_suggestion: 'توفير التوصيل للقرى والمداشر في منطقة القبائل.'
    },
    wantsBetaAccess: false
  },
  {
    id: 'resp-dz-008',
    timestamp: '2026-11-04T17:45:00Z',
    language: 'ar',
    completionTimeSeconds: 230,
    answers: {
      q1_age: '18-24',
      q2_wilaya: '16',
      q3_residence_nature: 'urban',
      q4_employment_status: 'student',
      q5_purchasing_power: 'limited',
      q6_bought_used_furniture: 'no',
      q7_bought_used_appliance: 'yes',
      q8_sold_used_items: 'no',
      q9_search_channels: ['facebook_marketplace'],
      q10_products_considered: ['televisions', 'kitchen_appliances'],
      q11_primary_motivation: 'saving_money',
      q12_biggest_hesitation: 'fraud_scams',
      q13_trust_builders: ['trusted_escrow', 'seller_ratings', 'inspection_before_pay'],
      q14_expected_discount: '40_60',
      q15_concept_opinion: 'excellent',
      q16_willingness_to_use: 'definitely',
      q17_most_important_service: 'cod',
      q18_platform_model: 'hybrid',
      q19_preferred_pickup: 'pickup_point',
      q20_delivery_provider: 'private_couriers',
      q21_delivery_fee_acceptance: 'yes_reasonable',
      q22_acceptable_delivery_time: '24_48_hours',
      q23_payment_method: 'baridimob',
      q24_had_past_problems: 'no',
      q27_biggest_market_barrier: 'lack_of_trust_scams',
      q28_one_thing_to_change: 'تقليل السماسرة وتسهيل المقارنة السريعة.',
      q29_wishlist_services: ['mandatory_video_360', 'smart_price_negotiation', 'trusted_seller_badges'],
      q30_seller_interest: 'no',
      q32_open_suggestion: 'التطبيق عبر الهاتف مهم جداً بالنسبة للجيل الجديد.'
    },
    contactEmail: 'yacine.dz99@gmail.com',
    wantsBetaAccess: true
  },
  {
    id: 'resp-dz-009',
    timestamp: '2026-11-04T18:10:00Z',
    language: 'ar',
    completionTimeSeconds: 340,
    answers: {
      q1_age: '35-44',
      q2_wilaya: '06',
      q3_residence_nature: 'urban',
      q4_employment_status: 'employee',
      q5_purchasing_power: 'medium',
      q6_bought_used_furniture: 'yes',
      q7_bought_used_appliance: 'yes',
      q8_sold_used_items: 'yes',
      q9_search_channels: ['ouedkniss', 'traditional_shops'],
      q10_products_considered: ['refrigerators', 'washing_machines', 'bedroom_furniture'],
      q11_primary_motivation: 'unaffordable_new',
      q12_biggest_hesitation: 'hidden_defects',
      q13_trust_builders: ['limited_warranty', 'return_guarantee', 'video_real_photos'],
      q14_expected_discount: '40_60',
      q15_concept_opinion: 'excellent',
      q16_willingness_to_use: 'definitely',
      q17_most_important_service: 'verify_condition',
      q18_platform_model: 'hybrid',
      q19_preferred_pickup: 'home_delivery',
      q20_delivery_provider: 'dedicated_furniture_movers',
      q21_delivery_fee_acceptance: 'yes_reasonable',
      q22_acceptable_delivery_time: '3_5_days',
      q23_payment_method: 'cash_on_delivery',
      q24_had_past_problems: 'yes',
      q25_problem_type: ['hidden_technical_defects', 'untrustworthy_seller'],
      q26_ideal_problem_solution: 'فحص مسبق من تقني تبريد متخصص قبل نشر الإعلان.',
      q27_biggest_market_barrier: 'lack_of_warranty_inspection',
      q28_one_thing_to_change: 'إلزام البائع بضمان كتابي أو عبر المنصة.',
      q29_wishlist_services: ['technical_inspection', 'working_warranty', 'furniture_assembly_transport'],
      q30_seller_interest: 'yes',
      q31_seller_incentives: ['home_pickup_for_seller', 'serious_buyers', 'guaranteed_payment'],
      q32_open_suggestion: 'أتمنى إطلاق المنصة في أقرب وقت لحاجتنا الماسة لها في بجاية.'
    },
    contactEmail: 'mouloud.b@yahoo.fr',
    wantsBetaAccess: true
  },
  {
    id: 'resp-dz-010',
    timestamp: '2026-11-04T19:25:00Z',
    language: 'ar',
    completionTimeSeconds: 260,
    answers: {
      q1_age: '45-54',
      q2_wilaya: '13',
      q3_residence_nature: 'urban',
      q4_employment_status: 'business_owner',
      q5_purchasing_power: 'good',
      q6_bought_used_furniture: 'yes',
      q7_bought_used_appliance: 'yes',
      q8_sold_used_items: 'yes',
      q9_search_channels: ['ouedkniss', 'friends_family', 'traditional_shops'],
      q10_products_considered: ['living_room_sofas', 'air_conditioners', 'dining_tables_chairs'],
      q11_primary_motivation: 'high_build_quality',
      q12_biggest_hesitation: 'seller_distrust',
      q13_trust_builders: ['seller_ratings', 'inspection_before_pay', 'video_real_photos'],
      q14_expected_discount: '20_40',
      q15_concept_opinion: 'good',
      q16_willingness_to_use: 'mostly',
      q17_most_important_service: 'verify_sellers',
      q18_platform_model: 'hybrid',
      q19_preferred_pickup: 'direct_seller_home',
      q20_delivery_provider: 'dedicated_furniture_movers',
      q21_delivery_fee_acceptance: 'yes_always',
      q22_acceptable_delivery_time: '24_48_hours',
      q23_payment_method: 'cash_on_delivery',
      q24_had_past_problems: 'no',
      q27_biggest_market_barrier: 'lack_of_trust_scams',
      q28_one_thing_to_change: 'محاربة الغش وتزييف صور السلع.',
      q29_wishlist_services: ['trusted_seller_badges', 'technical_inspection', 'smart_price_negotiation'],
      q30_seller_interest: 'yes',
      q31_seller_incentives: ['serious_buyers', 'guaranteed_payment'],
      q32_open_suggestion: 'التوثيق بالهوية الوطنية أمر أساسي لمنع المحتالين.'
    },
    contactPhone: '0770543210',
    wantsBetaAccess: true
  }
];

// Helper to generate a full statistical sample of 120+ responses
export function generateRealisticResponses(): SurveyResponse[] {
  const wilayaPool = [
    '16', '16', '16', '16', '16', // Alger heavy
    '31', '31', '31', '31', // Oran
    '25', '25', '25', // Constantine
    '19', '19', '19', // Setif
    '09', '09', '09', // Blida
    '23', '23', // Annaba
    '15', '15', // Tizi Ouzou
    '06', '06', // Bejaia
    '13', '13', // Tlemcen
    '05', '05', // Batna
    '35', '35', // Boumerdes
    '47', // Ghardaia
    '30', // Ouargla
    '27', // Mostaganem
    '02', // Chlef
    '28', // M\'sila
    '34', // BBA
    '18', // Jijel
    '21', // Skikda
    '14', // Tiaret
    '26', // Medea
    '42'  // Tipaza
  ];

  const agePool = ['18-24', '25-34', '25-34', '25-34', '35-44', '35-44', '45-54', '55+'];
  const employmentPool = ['student', 'employee', 'employee', 'business_owner', 'freelancer', 'unemployed', 'other'];
  const powerPool = ['limited', 'medium', 'medium', 'good', 'high'];
  const conceptPool = ['excellent', 'excellent', 'excellent', 'good', 'good', 'neutral'];
  const willPool = ['definitely', 'definitely', 'mostly', 'mostly', 'maybe', 'probably_not'];
  const hesitations = ['hidden_defects', 'hidden_defects', 'fraud_scams', 'no_warranty', 'high_transport_costs', 'seller_distrust'];
  const payPool = ['cash_on_delivery', 'cash_on_delivery', 'baridimob', 'baridimob', 'edahabia_cib', 'platform_escrow'];
  const deliveryPool = ['home_delivery', 'home_delivery', 'depends_on_size', 'direct_seller_home', 'pickup_point'];

  const results: SurveyResponse[] = [...INITIAL_MOCK_RESPONSES];

  for (let i = 11; i <= 145; i++) {
    const wilaya = wilayaPool[i % wilayaPool.length];
    const age = agePool[i % agePool.length];
    const power = powerPool[i % powerPool.length];
    const hadProblem = (i % 3 === 0);
    const isSeller = (i % 2 === 0);

    const resp: SurveyResponse = {
      id: `resp-dz-${i.toString().padStart(3, '0')}`,
      timestamp: new Date(Date.now() - (145 - i) * 3600000 * 3.5).toISOString(),
      language: i % 7 === 0 ? 'en' : 'ar',
      completionTimeSeconds: 190 + (i * 13) % 240,
      answers: {
        q1_age: age,
        q2_wilaya: wilaya,
        q3_residence_nature: i % 4 === 0 ? 'suburban' : (i % 9 === 0 ? 'rural' : 'urban'),
        q4_employment_status: employmentPool[i % employmentPool.length],
        q5_purchasing_power: power,
        q6_bought_used_furniture: i % 5 === 0 ? 'no' : 'yes',
        q7_bought_used_appliance: i % 4 === 0 ? 'no' : 'yes',
        q8_sold_used_items: isSeller ? 'yes' : 'no',
        q9_search_channels: i % 2 === 0 ? ['facebook_marketplace', 'ouedkniss'] : ['facebook_marketplace', 'traditional_shops', 'friends_family'],
        q10_products_considered: i % 3 === 0 
          ? ['refrigerators', 'washing_machines', 'televisions'] 
          : ['living_room_sofas', 'bedroom_furniture', 'air_conditioners', 'dining_tables_chairs'],
        q11_primary_motivation: i % 4 === 0 ? 'saving_money' : (i % 3 === 0 ? 'low_price' : 'unaffordable_new'),
        q12_biggest_hesitation: hesitations[i % hesitations.length],
        q13_trust_builders: ['video_real_photos', 'inspection_before_pay', 'limited_warranty'],
        q14_expected_discount: i % 3 === 0 ? '40_60' : (i % 2 === 0 ? '20_40' : 'over_60'),
        q15_concept_opinion: conceptPool[i % conceptPool.length],
        q16_willingness_to_use: willPool[i % willPool.length],
        q17_most_important_service: i % 4 === 0 ? 'verify_condition' : (i % 3 === 0 ? 'home_delivery' : (i % 2 === 0 ? 'limited_warranty' : 'cod')),
        q18_platform_model: i % 4 === 0 ? 'c2c_only' : 'hybrid',
        q19_preferred_pickup: deliveryPool[i % deliveryPool.length],
        q20_delivery_provider: i % 2 === 0 ? 'dedicated_furniture_movers' : 'private_couriers',
        q21_delivery_fee_acceptance: i % 5 === 0 ? 'no_free_or_cheap' : (i % 2 === 0 ? 'yes_reasonable' : 'yes_always'),
        q22_acceptable_delivery_time: i % 3 === 0 ? '24_48_hours' : (i % 2 === 0 ? 'same_day' : '3_5_days'),
        q23_payment_method: payPool[i % payPool.length],
        q24_had_past_problems: hadProblem ? 'yes' : 'no',
        ...(hadProblem ? {
          q25_problem_type: i % 2 === 0 ? ['hidden_technical_defects'] : ['item_different_from_photos', 'transport_breakage'],
          q26_ideal_problem_solution: i % 2 === 0 ? 'توفير فني مختص لفحص السلعة' : 'حجز ثمن السلعة حتى استلامها سليمة'
        } : {}),
        q27_biggest_market_barrier: i % 3 === 0 ? 'lack_of_trust_scams' : (i % 2 === 0 ? 'transport_logistics' : 'lack_of_warranty_inspection'),
        q28_one_thing_to_change: i % 4 === 0 ? 'توفير حل حقيقي لنقل الأثاث الكبير' : 'إلزام البائعين بالصدق في وصف العيوب',
        q29_wishlist_services: ['technical_inspection', 'furniture_assembly_transport', 'working_warranty'],
        q30_seller_interest: isSeller ? 'yes' : (i % 3 === 0 ? 'maybe' : 'no'),
        ...(isSeller ? {
          q31_seller_incentives: ['home_pickup_for_seller', 'serious_buyers', 'guaranteed_payment']
        } : {}),
        ...(i % 5 === 0 ? {
          q32_open_suggestion: 'توفير تطبيق جوال خفيف وسريع، وشراكة مع ياليدين أو ناقلين محليين.'
        } : {})
      },
      wantsBetaAccess: i % 3 === 0
    };

    results.push(resp);
  }

  return results;
}
