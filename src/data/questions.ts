import { Question, Section } from '../types/survey';

export const SURVEY_SECTIONS: Section[] = [
  {
    id: 1,
    titleAr: 'التعرف على المستهلك',
    titleEn: 'Consumer Profile',
    descriptionAr: 'معلومات عامة تساعدنا في فهم التركيبة السكانية وموقعك الجغرافي',
    descriptionEn: 'General demographics to understand geographic and economic distribution',
    iconName: 'UserCheck',
    interstitialQuoteAr: 'خطوتك الأولى لمساعدتنا في رسم خريطة دقيقة لاحتياجات المستهلك الجزائري.',
    interstitialQuoteEn: 'Your first step to help us map the real needs of Algerian consumers.'
  },
  {
    id: 2,
    titleAr: 'سلوك الشراء والبيع',
    titleEn: 'Buying & Selling Behavior',
    descriptionAr: 'عاداتك السابقة والحالية في التعامل مع الأثاث والأجهزة المستعملة',
    descriptionEn: 'Your past and current habits regarding second-hand appliances & furniture',
    iconName: 'ShoppingBag',
    interstitialQuoteAr: 'دعنا نفهم كيف تتخذ قرار الشراء وما هي المنتجات الأقرب لاهتمامك.',
    interstitialQuoteEn: 'Let us understand how you make purchasing decisions and what products matter most.'
  },
  {
    id: 3,
    titleAr: 'دوافع الشراء والمخاوف',
    titleEn: 'Motivations & Concerns',
    descriptionAr: 'ما يحفزك لشراء المستعمل والعوامل النفسية التي تجعلك تتردد',
    descriptionEn: 'What motivates you to buy used items and what makes you hesitate',
    iconName: 'ShieldAlert',
    interstitialQuoteAr: 'ما الذي يجعلك تثق في منتج مستعمل لم تجربه من قبل؟',
    interstitialQuoteEn: 'What makes you truly trust a second-hand item you have never tested before?'
  },
  {
    id: 4,
    titleAr: 'تقييم فكرة المنصة',
    titleEn: 'Platform Concept Evaluation',
    descriptionAr: 'رأيك المباشر في إنشاء منصة جزائرية متخصصة ومحمية',
    descriptionEn: 'Your direct feedback on an Algerian specialized, protected platform',
    iconName: 'Sparkles',
    interstitialQuoteAr: 'رأيك يحدد مباشرة أولويات تطوير منصة تلائم طموح وتطلعات الجزائريين.',
    interstitialQuoteEn: 'Your feedback directly guides the design of an authentically trusted Algerian platform.'
  },
  {
    id: 5,
    titleAr: 'الشحن والتوصيل وطرق الدفع',
    titleEn: 'Delivery & Payment Methods',
    descriptionAr: 'الخيارات اللوجستية والمالية الأكثر ملاءمة للواقع الجزائري',
    descriptionEn: 'Logistics and payment methods suited to the Algerian market reality',
    iconName: 'Truck',
    interstitialQuoteAr: 'اللوجستيات والشحن: شريان نجاح تجارة الأثاث والأجهزة الثقيلة في الجزائر.',
    interstitialQuoteEn: 'Logistics & heavy item moving: the vital backbone of household commerce in Algeria.'
  },
  {
    id: 6,
    titleAr: 'المشاكل والتحديات السابقة',
    titleEn: 'Past Issues & Challenges',
    descriptionAr: 'تجاربك السابقة، المشاكل التي واجهتها، والحلول المقترحة',
    descriptionEn: 'Real past hurdles, fraud concerns, and potential solutions',
    iconName: 'AlertTriangle',
    interstitialQuoteAr: 'تجاربك وتحدياتك السابقة هي المنطلق الحقيقي لبناء آليات الحماية المفقودة.',
    interstitialQuoteEn: 'Your past friction points are the concrete foundation for building missing protections.'
  },
  {
    id: 7,
    titleAr: 'الاحتياجات والاقتراحات',
    titleEn: 'Needs & Suggestions',
    descriptionAr: 'الخدمات التي تتمنى توفرها ورؤيتك لدور البائع والمشتري',
    descriptionEn: 'Features you hope to see and incentives for sellers and buyers',
    iconName: 'Lightbulb',
    interstitialQuoteAr: 'معاً نصيغ الميزات الأساسية للنسخة الأولى (MVP) لضمان تجربة مريحة وعادلة.',
    interstitialQuoteEn: 'Together we define the high-priority MVP features for a fair, frictionless experience.'
  }
];

export const SURVEY_QUESTIONS: Question[] = [
  // SECTION 1: Consumer Profile
  {
    id: 'q1_age',
    number: 1,
    sectionId: 1,
    titleAr: 'ما الفئة العمرية التي تنتمي إليها؟',
    titleEn: 'Which age group do you belong to?',
    type: 'single_choice',
    required: true,
    options: [
      { id: '18-24', labelAr: '18 – 24 سنة', labelEn: '18 – 24 years old' },
      { id: '25-34', labelAr: '25 – 34 سنة', labelEn: '25 – 34 years old' },
      { id: '35-44', labelAr: '35 – 44 سنة', labelEn: '35 – 44 years old' },
      { id: '45-54', labelAr: '45 – 54 سنة', labelEn: '45 – 54 years old' },
      { id: '55+', labelAr: '55 سنة فما فوق', labelEn: '55+ years old' }
    ]
  },
  {
    id: 'q2_wilaya',
    number: 2,
    sectionId: 1,
    titleAr: 'ما الولاية التي تقيم فيها حالياً؟',
    titleEn: 'In which Algerian wilaya do you currently reside?',
    type: 'wilaya_select',
    required: true
  },
  {
    id: 'q3_residence_nature',
    number: 3,
    sectionId: 1,
    titleAr: 'ما طبيعة مكان إقامتك؟',
    titleEn: 'What is the nature of your place of residence?',
    type: 'single_choice',
    required: true,
    options: [
      { id: 'urban', labelAr: 'مدينة / وسط المدينة (حضري)', labelEn: 'Urban city / City center' },
      { id: 'suburban', labelAr: 'منطقة شبه حضرية / ضواحي', labelEn: 'Suburban / City outskirts' },
      { id: 'rural', labelAr: 'منطقة ريفية', labelEn: 'Rural area' }
    ]
  },
  {
    id: 'q4_employment_status',
    number: 4,
    sectionId: 1,
    titleAr: 'ما وضعك المهني / الاجتماعي الحالي؟',
    titleEn: 'What is your current occupational / social status?',
    type: 'single_choice',
    required: true,
    options: [
      { id: 'student', labelAr: 'طالب جامعي / متدرب', labelEn: 'University student / Trainee' },
      { id: 'employee', labelAr: 'موظف (قطاع عام أو خاص)', labelEn: 'Salaried employee (Public or Private)' },
      { id: 'business_owner', labelAr: 'صاحب عمل أو مشروع تجاري', labelEn: 'Business owner / Merchant' },
      { id: 'freelancer', labelAr: 'عمل حر / مستقل (Freelance)', labelEn: 'Freelancer / Independent professional' },
      { id: 'unemployed', labelAr: 'بدون عمل / باحث عن عمل', labelEn: 'Job seeker / Unemployed' },
      { id: 'other', labelAr: 'أخرى (متقاعد، ربة منزل...)', labelEn: 'Other (Homemaker, Retired...)' }
    ]
  },
  {
    id: 'q5_purchasing_power',
    number: 5,
    sectionId: 1,
    titleAr: 'كيف تصف قدرتك الشرائية بشكل عام؟',
    titleEn: 'How would you describe your overall purchasing power?',
    subtitleAr: 'يساعدنا هذا في معايرة الفئات السعرية المناسبة في المنصة',
    subtitleEn: 'Helps us calibrate appropriate price tiers on the platform',
    type: 'single_choice',
    required: true,
    options: [
      { id: 'limited', labelAr: 'محدودة (أبحث دائماً عن أقل سعر ممكن)', labelEn: 'Limited (Always searching for lowest price)' },
      { id: 'medium', labelAr: 'متوسطة (أوازن بين الجودة والسعر)', labelEn: 'Medium (Balancing quality and price)' },
      { id: 'good', labelAr: 'جيدة (أهتم بالقيمة العالية والراحة)', labelEn: 'Good (Prioritizing high value and comfort)' },
      { id: 'high', labelAr: 'مرتفعة (مستعد لدفع سعر أعلى مقابل الجودة الممتازة)', labelEn: 'High (Ready to pay premium for top condition)' }
    ]
  },

  // SECTION 2: Buying & Selling Behavior
  {
    id: 'q6_bought_used_furniture',
    number: 6,
    sectionId: 2,
    titleAr: 'هل سبق لك شراء أثاث مستعمل؟',
    titleEn: 'Have you ever bought used furniture before?',
    type: 'single_choice',
    required: true,
    options: [
      { id: 'yes', labelAr: 'نعم، سبق لي ذلك', labelEn: 'Yes, I have' },
      { id: 'no', labelAr: 'لا، لم يسبق لي أبداً', labelEn: 'No, never' }
    ]
  },
  {
    id: 'q7_bought_used_appliance',
    number: 7,
    sectionId: 2,
    titleAr: 'هل سبق لك شراء جهاز كهرومنزلِي مستعمل (ثلاجة، غسالة، تلفاز...)؟',
    titleEn: 'Have you ever bought a used home appliance (fridge, washing machine, TV...)?',
    type: 'single_choice',
    required: true,
    options: [
      { id: 'yes', labelAr: 'نعم، سبق لي ذلك', labelEn: 'Yes, I have' },
      { id: 'no', labelAr: 'لا، لم يسبق لي أبداً', labelEn: 'No, never' }
    ]
  },
  {
    id: 'q8_sold_used_items',
    number: 8,
    sectionId: 2,
    titleAr: 'هل سبق لك بيع أثاث أو أجهزة منزلية مستعملة تخصك؟',
    titleEn: 'Have you ever sold any used furniture or appliances of your own?',
    type: 'single_choice',
    required: true,
    options: [
      { id: 'yes', labelAr: 'نعم، قمت بالبيع من قبل', labelEn: 'Yes, I have sold items' },
      { id: 'no', labelAr: 'لا، لم أبع من قبل', labelEn: 'No, never sold' }
    ]
  },
  {
    id: 'q9_search_channels',
    number: 9,
    sectionId: 2,
    titleAr: 'أين تفضل عادة البحث عن المنتجات المستعملة في الجزائر؟',
    titleEn: 'Where do you usually search for used items in Algeria?',
    subtitleAr: 'يمكنك اختيار أكثر من خيار',
    subtitleEn: 'You can select multiple options',
    type: 'multiple_choice',
    required: true,
    minSelection: 1,
    options: [
      { id: 'facebook_marketplace', labelAr: 'Facebook Marketplace', labelEn: 'Facebook Marketplace' },
      { id: 'facebook_groups', labelAr: 'مجموعات فيسبوك المتخصصة (Groups)', labelEn: 'Facebook Buy/Sell Groups' },
      { id: 'ouedkniss', labelAr: 'موقع واد كنيس (Ouedkniss)', labelEn: 'Ouedkniss' },
      { id: 'traditional_shops', labelAr: 'المحلات والأسواق التقليدية (دلالة / أسواق أسبوعية)', labelEn: 'Traditional thrift shops & flea markets' },
      { id: 'friends_family', labelAr: 'الأصدقاء، الأقارب والمعارف', labelEn: 'Friends, relatives & word of mouth' },
      { id: 'other_platforms', labelAr: 'منصات وتطبيقات أخرى', labelEn: 'Other platforms / apps' }
    ]
  },
  {
    id: 'q10_products_considered',
    number: 10,
    sectionId: 2,
    titleAr: 'ما هي المنتجات التي قد تفكر جدياً في شرائها مستعملة؟',
    titleEn: 'Which products would you seriously consider purchasing used?',
    subtitleAr: 'اختر جميع المنتجات المناسبة لك (بطاقات مرئية تفاعلية)',
    subtitleEn: 'Select all products that apply (interactive visual cards)',
    type: 'multiple_choice',
    required: true,
    minSelection: 1,
    options: [
      { 
        id: 'refrigerators', 
        labelAr: 'الثلاجات والمجمدات (Frigos & Congélateurs)', 
        labelEn: 'Refrigerators & Freezers',
        image: '/src/assets/images/fridge_appliance_clean_1793885099602.jpg'
      },
      { 
        id: 'washing_machines', 
        labelAr: 'الغسالات وغسالات الأطباق (Lave-linge)', 
        labelEn: 'Washing machines & Dishwashers',
        image: '/src/assets/images/washing_machine_clean_1793885099000.jpg'
      },
      { 
        id: 'televisions', 
        labelAr: 'أجهزة التلفاز والشاشات (TVs & Monitors)', 
        labelEn: 'TVs & Screens'
      },
      { 
        id: 'air_conditioners', 
        labelAr: 'المكيفات وأجهزة التدفئة (Climatiseurs & Chauffages)', 
        labelEn: 'Air conditioners & Heaters'
      },
      { 
        id: 'living_room_sofas', 
        labelAr: 'الأرائك والصالونات (Salons & Fauteuils)', 
        labelEn: 'Living room sofas & armchairs',
        image: '/src/assets/images/modern_sofa_living_1793885100256.jpg'
      },
      { 
        id: 'bedroom_furniture', 
        labelAr: 'غرف النوم والأسرة وخزائن الملابس (Chambres à coucher)', 
        labelEn: 'Bedrooms, beds & wardrobes'
      },
      { 
        id: 'dining_tables_chairs', 
        labelAr: 'طاولات الطعام والكراسي والمكاتب', 
        labelEn: 'Dining tables, chairs & desks'
      },
      { 
        id: 'kitchen_appliances', 
        labelAr: 'أجهزة المطبخ (أفران، ماكينات قهوة، ميكروويف...)', 
        labelEn: 'Small kitchen appliances (Ovens, Microwaves...)'
      },
      { 
        id: 'other', 
        labelAr: 'أخرى (أجهزة رياضية منزلية، أثاث حدائق...)', 
        labelEn: 'Other (Home gym, Garden furniture...)'
      }
    ]
  },

  // SECTION 3: Motivations & Concerns
  {
    id: 'q11_primary_motivation',
    number: 11,
    sectionId: 3,
    titleAr: 'ما هو أهم سبب يدفعك للتفكير في شراء منتج مستعمل؟',
    titleEn: 'What is the primary motivation driving you to consider buying used?',
    type: 'single_choice',
    required: true,
    options: [
      { id: 'low_price', labelAr: 'السعر المنخفض بفارق ملحوظ عن الجديد', labelEn: 'Significantly lower price compared to new' },
      { id: 'saving_money', labelAr: 'توفير المال واستثماره في أولويات عائلية أخرى', labelEn: 'Saving money for other family priorities' },
      { id: 'high_build_quality', labelAr: 'العثور على ماركات أصلية قديمة بجودة تصنيع أفضل', labelEn: 'Finding durable vintage/original brands' },
      { id: 'unaffordable_new', labelAr: 'شراء منتجات أو أجهزة لا تمكنني ميزانيتي من شرائها جديدة', labelEn: 'Purchasing items I cannot afford brand new' },
      { id: 'eco_friendly', labelAr: 'أسباب بيئية ودعم الاقتصاد الدائري وإعادة الاستخدام', labelEn: 'Environmental reasons & circular economy' }
    ]
  },
  {
    id: 'q12_biggest_hesitation',
    number: 12,
    sectionId: 3,
    titleAr: 'ما أكثر شيء يجعلك تتردد أو تخاف من شراء منتج مستعمل؟',
    titleEn: 'What makes you hesitate the most when buying a used item?',
    subtitleAr: 'حدد التحدي الأكبر بالنسبة لك',
    subtitleEn: 'Identify your single biggest concern',
    type: 'single_choice',
    required: true,
    options: [
      { id: 'hidden_defects', labelAr: 'عدم معرفة الحالة التقنية الحقيقية والخوف من عيوب مخفية', labelEn: 'Unknown real technical condition / Hidden defects' },
      { id: 'fraud_scams', labelAr: 'الخوف من الاحتيال والنصب وعدم مطابقة المنتج للإعلان', labelEn: 'Fear of scams and product not matching listing' },
      { id: 'no_warranty', labelAr: 'غياب أي شكل من أشكال الضمان أو حق التجربة', labelEn: 'Total absence of warranty or test period' },
      { id: 'no_return_policy', labelAr: 'استحالة إرجاع المنتج أو استرداد المال بعد الاستلام', labelEn: 'Inability to return the product or get a refund' },
      { id: 'high_transport_costs', labelAr: 'صعوبة وارتفاع تكلفة النقل وتأجير شاحنة (فورغون)', labelEn: 'High cost and hassle of renting transport vans' },
      { id: 'seller_distrust', labelAr: 'عدم الثقة بنوايا البائع المجهول في منصات التواصل', labelEn: 'Distrust of anonymous sellers on social media' }
    ]
  },
  {
    id: 'q13_trust_builders',
    number: 13,
    sectionId: 3,
    titleAr: 'ما الذي يجعلك تثق تماماً في منتج مستعمل قبل شرائه؟',
    titleEn: 'What would make you fully trust a used product before buying?',
    subtitleAr: 'يمكنك اختيار أهم العوامل',
    subtitleEn: 'Select the most influential factors',
    type: 'multiple_choice',
    required: true,
    minSelection: 1,
    options: [
      { id: 'video_real_photos', labelAr: 'صور واقعية عالية الدقة وفيديو تفصيلي للجهاز أثناء تشغيله', labelEn: 'High-res real photos & operational video' },
      { id: 'inspection_before_pay', labelAr: 'فحص المنتج وتجربته شخصياً قبل دفع كامل المبلغ', labelEn: 'Inspecting & testing in person prior to payment' },
      { id: 'seller_ratings', labelAr: 'تقييمات موثقة ومراجعات من مشترين حقيقيين سابقين', labelEn: 'Verified ratings & reviews from past buyers' },
      { id: 'limited_warranty', labelAr: 'ضمان تشغيل محدود (مثلاً: أسبوع أو شهر للاختبار)', labelEn: 'Limited operational warranty (e.g. 7 to 30 days)' },
      { id: 'return_guarantee', labelAr: 'إمكانية إرجاع المنتج واسترداد المبلغ إذا وُجد عيب مخفي', labelEn: 'Money-back return policy if defect is discovered' },
      { id: 'trusted_escrow', labelAr: 'وسيط رسمي موثوق يحجز المال حتى يؤكد المشتري سلامة السلعة', labelEn: 'Trusted intermediary/escrow securing payment until approval' }
    ]
  },
  {
    id: 'q14_expected_discount',
    number: 14,
    sectionId: 3,
    titleAr: 'ما هي نسبة التخفيض التي تتوقعها عادة في سعر المنتج المستعمل مقارنة بسعر الجديد؟',
    titleEn: 'What discount percentage do you expect compared to the brand-new price?',
    type: 'single_choice',
    required: true,
    options: [
      { id: 'under_20', labelAr: 'أقل من 20% (إذا كان المنتج شبه جديد أو بكرتونته)', labelEn: 'Less than 20% (if like-new / in box)' },
      { id: '20_40', labelAr: 'من 20% إلى 40% (تخفيض معتدل لحالة ممتازة)', labelEn: '20% to 40% (Fair discount for great condition)' },
      { id: '40_60', labelAr: 'من 40% إلى 60% (السعر يجب أن يكون قريباً من النصف)', labelEn: '40% to 60% (Expected around half price)' },
      { id: 'over_60', labelAr: 'أكثر من 60% (أبحث عن صفقات وفرص تصفية مغرية جداً)', labelEn: 'More than 60% (Looking for deep bargains/clearance)' }
    ]
  },

  // SECTION 4: Platform Concept Evaluation
  {
    id: 'q15_concept_opinion',
    number: 15,
    sectionId: 4,
    titleAr: 'ما هو رأيك في فكرة إطلاق هذه المنصة الجزائرية المتخصصة؟',
    titleEn: 'What is your opinion on launching this specialized Algerian platform?',
    subtitleAr: 'منصة تجمع البائعين والمشترين للأثاث والأجهزة، مع صور وفيديو، حالة مفحوصة، توصيل، وحماية للمشتري',
    subtitleEn: 'A platform connecting buyers & sellers with video check, condition grading, delivery & buyer protection',
    type: 'single_choice',
    required: true,
    options: [
      { id: 'excellent', labelAr: 'فكرة ممتازة وتلبي حاجة حقيقية ومفقودة في السوق', labelEn: 'Excellent idea fulfilling a critical market gap' },
      { id: 'good', labelAr: 'فكرة جيدة ومفيدة، ستحسن السوق إذا طُبقت باحترافية', labelEn: 'Good idea, will improve the market if done professionally' },
      { id: 'neutral', labelAr: 'محايد / تعتمد على طريقة التطبيق وجودة الأسعار', labelEn: 'Neutral / Depends on execution and pricing' },
      { id: 'not_necessary', labelAr: 'لا أراها ضرورية (الفيسبوك وواد كنيس كافيان حالياً)', labelEn: 'Not necessary (Current tools are sufficient)' },
      { id: 'opposed', labelAr: 'لا أؤيدها / لا أعتقد أنها ستنجح في السياق الجزائري', labelEn: 'Opposed / Doubt it will work in Algerian context' }
    ]
  },
  {
    id: 'q16_willingness_to_use',
    number: 16,
    sectionId: 4,
    titleAr: 'هل ستستخدم هذه المنصة بشكل فعلي عند إطلاقها؟',
    titleEn: 'Would you actually use this platform once launched?',
    type: 'single_choice',
    required: true,
    options: [
      { id: 'definitely', labelAr: 'بالتأكيد، سأكون من أوائل المستخدمين', labelEn: 'Definitely, I will be an early adopter' },
      { id: 'mostly', labelAr: 'غالباً نعم، عندما أحتاج أثاثاً أو أجهزة', labelEn: 'Mostly yes, when looking for furniture/appliances' },
      { id: 'maybe', labelAr: 'ربما، بعد أن أرى تجارب وآراء الناس حولها', labelEn: 'Maybe, after reading initial reviews & feedback' },
      { id: 'probably_not', labelAr: 'غالباً لا، أفضل الشراء بالطرق التقليدية', labelEn: 'Probably not, I prefer traditional methods' },
      { id: 'never', labelAr: 'لن أستخدمها إطلاقاً', labelEn: 'I will definitely not use it' }
    ]
  },
  {
    id: 'q17_most_important_service',
    number: 17,
    sectionId: 4,
    titleAr: 'ما هي الخدمة الأكثر أهمية بالنسبة لك لكي تعتمد المنصة؟',
    titleEn: 'Which single service is most critical for you to adopt the platform?',
    type: 'single_choice',
    required: true,
    options: [
      { id: 'verify_sellers', labelAr: 'التحقق من هوية البائعين وموثوقيتهم بالوثائق', labelEn: 'ID-verified sellers and verified profiles' },
      { 
        id: 'verify_condition', 
        labelAr: 'التحقق الميداني من حالة الأجهزة وتشغيلها وتقديم تقرير فحص', 
        labelEn: 'Physical inspection and technical condition report',
        image: '/src/assets/images/technical_inspection_tool_1793885101904.jpg'
      },
      { 
        id: 'home_delivery', 
        labelAr: 'توفير التوصيل والشحن المباشر إلى باب المنزل (شاحنة متخصصة)', 
        labelEn: 'Doorstep bulky item delivery service',
        image: '/src/assets/images/delivery_van_moving_1793885101017.jpg'
      },
      { id: 'cod', labelAr: 'الدفع عند الاستلام والمعاينة (Main à main)', labelEn: 'Cash on delivery after hands-on inspection' },
      { id: 'limited_warranty', labelAr: 'ضمان تشغيل لمدة أسبوعين مع حماية المشتري', labelEn: '2-week test warranty with buyer protection' },
      { id: 'easy_returns', labelAr: 'سياسة إرجاع واضحة وسهلة في حال وجود عيب خفي', labelEn: 'Clear return policy for undisclosed defects' },
      { id: 'price_comparison', labelAr: 'أدوات مقارنة الأسعار ومؤشر السعر العادل للسلعة', labelEn: 'Fair market value & price comparison tools' }
    ]
  },
  {
    id: 'q18_platform_model',
    number: 18,
    sectionId: 4,
    titleAr: 'كيف تفضل نموذج البائعين في المنصة؟',
    titleEn: 'Which seller model do you prefer on the platform?',
    type: 'single_choice',
    required: true,
    options: [
      { id: 'c2c_only', labelAr: 'بين الأفراد فقط (من عائلة لعائلة / مستعمل شخصي)', labelEn: 'Peer-to-peer only (Direct between individuals)' },
      { id: 'b2c_only', labelAr: 'تجار ومحلات متخصصة في الأجهزة والأثاث المفحوص والمجدد', labelEn: 'Professional shops & certified refurbished outlets' },
      { id: 'hybrid', labelAr: 'الاثنان معاً (قسم للأفراد وقسم للمحلات المعتمدة مع علامة تمييز)', labelEn: 'Both together (P2P section + Verified Pro badges)' }
    ]
  },

  // SECTION 5: Delivery & Payment
  {
    id: 'q19_preferred_pickup',
    number: 19,
    sectionId: 5,
    titleAr: 'ما طريقة استلام السلعة التي تفضلها شخصياً؟',
    titleEn: 'Which item pickup method do you personally prefer?',
    type: 'single_choice',
    required: true,
    options: [
      { id: 'home_delivery', labelAr: 'التوصيل المباشر إلى باب البيت مع عمال التنزيل', labelEn: 'Direct doorstep delivery with offloading assistance' },
      { id: 'pickup_point', labelAr: 'الاستلام من نقطة تسليم أو مستودع قريب في ولايتي', labelEn: 'Pickup from nearby regional depot/hub' },
      { id: 'direct_seller_home', labelAr: 'الذهاب إلى منزل البائع شخصياً ومعاينة السلعة في مكانها', labelEn: 'Visiting seller\'s location directly for in-situ test' },
      { id: 'depends_on_size', labelAr: 'حسب حجم السلعة (الأجهزة الكبيرة توصيل، والأشياء الصغيرة استلام مباشر)', labelEn: 'Depends on item size (Bulky delivered, Small in person)' }
    ]
  },
  {
    id: 'q20_delivery_provider',
    number: 20,
    sectionId: 5,
    titleAr: 'ما طريقة أو جهة التوصيل التي تشعرك بالأمان أكثر في الجزائر؟',
    titleEn: 'Which delivery method feels most reliable to you in Algeria?',
    type: 'single_choice',
    required: true,
    options: [
      { 
        id: 'dedicated_furniture_movers', 
        labelAr: 'ناقلون معتمدون متخصصون في الأثاث والأجهزة (فورغون مجهز ومحمي)', 
        labelEn: 'Specialized furniture & appliance movers with padded vans',
        image: '/src/assets/images/delivery_van_moving_1793885101017.jpg'
      },
      { id: 'private_couriers', labelAr: 'شركات التوصيل السريع المعروفة (ياليدين، زر إكسبريس...) للقطع الصغيرة', labelEn: 'Known parcel couriers (Yalidine, ZR...) for small items' },
      { id: 'interstate_transporters', labelAr: 'محطات الشحن وسائقو الشاحنات بين الولايات', labelEn: 'Inter-wilaya haulers and transport stations' },
      { id: 'direct_in_person', labelAr: 'التنسيق الشخصي المباشر دون وسيط توصيل', labelEn: 'Direct self-arranged transport' }
    ]
  },
  {
    id: 'q21_delivery_fee_acceptance',
    number: 21,
    sectionId: 5,
    titleAr: 'هل تقبل دفع تكلفة توصيل إضافية لضمان وصول الأثاث أو الجهاز سليماً؟',
    titleEn: 'Are you willing to pay an extra delivery fee for safe handled transport?',
    type: 'single_choice',
    required: true,
    options: [
      { id: 'yes_always', labelAr: 'نعم بالتأكيد، سلامة الجهاز وراحتي تستحق التكلفة', labelEn: 'Yes definitely, peace of mind & item safety are worth it' },
      { id: 'yes_reasonable', labelAr: 'نعم، بشرط أن تكون التسعيرة مدروسة ومعقولة حسب المسافة', labelEn: 'Yes, provided pricing is reasonable and distance-based' },
      { id: 'only_high_value', labelAr: 'فقط إذا كانت السلعة ثمينة أو نادرة وتستحق', labelEn: 'Only if the item is valuable or a rare find' },
      { id: 'no_free_or_cheap', labelAr: 'لا، أفضل أن أتكفل بالنقل بنفسي بأقل سعر', labelEn: 'No, I prefer arranging my own cheap transport' }
    ]
  },
  {
    id: 'q22_acceptable_delivery_time',
    number: 22,
    sectionId: 5,
    titleAr: 'ما هي المدة الزمنية المقبولة بالنسبة لك لوصول السلعة بعد تأكيد الطلب؟',
    titleEn: 'What is an acceptable delivery timeframe after order confirmation?',
    type: 'single_choice',
    required: true,
    options: [
      { id: 'same_day', labelAr: 'في نفس اليوم (خلال ساعات قليلة داخل نفس الولاية)', labelEn: 'Same day (Within hours within same wilaya)' },
      { id: '24_48_hours', labelAr: 'خلال 24 إلى 48 ساعة (المعيار النموذجي)', labelEn: 'Within 24 – 48 hours (Standard)' },
      { id: '3_5_days', labelAr: 'خلال 3 إلى 5 أيام (مقبول للشحن بين الولايات البعيدة)', labelEn: 'Within 3 – 5 days (Acceptable across distant wilayas)' },
      { id: 'flexible', labelAr: 'لا مشكلة لدي في الانتظار طالما السعر ممتاز والسلعة محمية', labelEn: 'No rush as long as price is great and item is protected' }
    ]
  },
  {
    id: 'q23_payment_method',
    number: 23,
    sectionId: 5,
    titleAr: 'كيف تفضل دفع ثمن السلعة عند التعامل عبر المنصة؟',
    titleEn: 'How do you prefer paying for items on the platform?',
    subtitleAr: 'حدد وسيلة الدفع المفضلة لديك',
    subtitleEn: 'Select your preferred payment method',
    type: 'single_choice',
    required: true,
    options: [
      { id: 'cash_on_delivery', labelAr: 'الدفع نقداً عند الاستلام والمعاينة (Espèces à la livraison)', labelEn: 'Cash on delivery after in-person inspection' },
      { id: 'baridimob', labelAr: 'تطبيق بريدي موب (BaridiMob) بعد المعاينة المباشرة', labelEn: 'BaridiMob app transfer upon inspection' },
      { id: 'ccp_transfer', labelAr: 'تحويل بريدي عبر حساب CCP', labelEn: 'Postal CCP transfer' },
      { id: 'edahabia_cib', labelAr: 'الدفع الإلكتروني عبر البطاقة الذهبية أو بطاقة CIB البنكية', labelEn: 'Online e-payment via Edahabia / CIB card' },
      { id: 'platform_escrow', labelAr: 'حساب الضمان عبر المنصة (المنصة تحتفظ بالمبلغ حتى ترضى عن السلعة)', labelEn: 'Platform Escrow (held safely until buyer confirms receipt)' },
      { id: 'seller_agreement', labelAr: 'بالاتفاق الودي المباشر مع البائع', labelEn: 'Mutual informal agreement with seller' }
    ]
  },

  // SECTION 6: Past Issues & Challenges
  {
    id: 'q24_had_past_problems',
    number: 24,
    sectionId: 6,
    titleAr: 'هل واجهت في السابق أي مشكلة أو تجربة سلبية عند بيع أو شراء منتج مستعمل؟',
    titleEn: 'Have you ever encountered a problem or negative experience buying/selling used items?',
    type: 'single_choice',
    required: true,
    options: [
      { id: 'yes', labelAr: 'نعم، واجهت مشاكل وتجارب سلبية', labelEn: 'Yes, I had problems/negative experiences' },
      { id: 'no', labelAr: 'لا، لم أواجه أي مشكلة تذكر', labelEn: 'No, smooth experience so far' }
    ]
  },
  {
    id: 'q25_problem_type',
    number: 25,
    sectionId: 6,
    titleAr: 'ما هو نوع المشكلة أو العائق الأكبر الذي واجهته؟',
    titleEn: 'What type of problem did you encounter?',
    subtitleAr: 'يظهر هذا السؤال لأنك حددت مواجهتك لمشاكل سابقة',
    subtitleEn: 'Visible because you indicated past negative experiences',
    type: 'multiple_choice',
    required: true,
    minSelection: 1,
    condition: {
      dependsOnQuestionId: 'q24_had_past_problems',
      operator: 'equals',
      value: 'yes'
    },
    options: [
      { id: 'item_different_from_photos', labelAr: 'السلعة في الواقع مختلفة تماماً عن الصور المنشورة في الإعلان', labelEn: 'Item in reality looked very different from advertised photos' },
      { id: 'hidden_technical_defects', labelAr: 'الجهاز تعطل بعد أيام قليلة أو به عيب تقني مخفي كتمه البائع', labelEn: 'Item broke down soon after or had concealed defects' },
      { id: 'untrustworthy_seller', labelAr: 'البائع كان غير صادق أو تراجع عن كلامه أو أضاع الوقت', labelEn: 'Seller was dishonest, flaky or time-waster' },
      { id: 'transport_breakage', labelAr: 'تضرر أو انكسار الأثاث/الجهاز أثناء عملية النقل والتنزيل', labelEn: 'Item damaged or broken during transport/handling' },
      { id: 'price_renegotiation', labelAr: 'محاولة تغيير السعر المتفق عليه عند اللقاء وجهاً لوجه', labelEn: 'Attempting to renegotiate price upon meetup' },
      { id: 'scam_or_loss', labelAr: 'تعرض للاحتيال المالي أو سرقة عربون', labelEn: 'Financial scam or lost deposit' },
      { id: 'other', labelAr: 'مشاكل أخرى', labelEn: 'Other issues' }
    ]
  },
  {
    id: 'q26_ideal_problem_solution',
    number: 26,
    sectionId: 6,
    titleAr: 'ما هو الحل الذي كان سيجنبك هذه المشكلة لو توفر في المنصة؟',
    titleEn: 'What solution would have prevented this problem for you?',
    subtitleAr: 'اكتب لنا الحل من وجهة نظرك (مثال: فحص تقني مسبق، حجز العربون في المنصة، تصوير فيديو إجباري...)',
    subtitleEn: 'Share what mechanism could have saved you from that issue',
    type: 'textarea',
    required: false,
    condition: {
      dependsOnQuestionId: 'q24_had_past_problems',
      operator: 'equals',
      value: 'yes'
    },
    placeholderAr: 'مثال: لو كانت المنصة توفر خبير فحص يؤكد خلو الثلاجة من تسرب الغاز، وحجز المبلغ حتى مرور 48 ساعة...',
    placeholderEn: 'e.g. If an inspector had tested the appliance, or an escrow held funds for 48 hours...'
  },
  {
    id: 'q27_biggest_market_barrier',
    number: 27,
    sectionId: 6,
    titleAr: 'برأيك، ما هو أكبر عائق يمنع تطور وانتشار سوق منظم للمستعمل في الجزائر حالياً؟',
    titleEn: 'In your view, what is the biggest barrier preventing an organized used goods market in Algeria?',
    type: 'single_choice',
    required: true,
    options: [
      { id: 'lack_of_trust_scams', labelAr: 'انعدام الثقة بين الأفراد والخوف من النصب', labelEn: 'Lack of trust between strangers and fraud fears' },
      { id: 'lack_of_warranty_inspection', labelAr: 'غياب خدمات الفحص التقني والضمان', labelEn: 'Absence of technical inspection & warranty guarantees' },
      { id: 'transport_logistics', labelAr: 'تعقيد اللوجستيات ونقل الأثاث والأجهزة الثقيلة بين المدن', labelEn: 'Logistics and bulky transport difficulties across cities' },
      { id: 'cultural_stigma', labelAr: 'نظرة اجتماعية سلبية تجاه شراء المستعمل في بعض الأوساط', labelEn: 'Social stigma surrounding second-hand items' },
      { id: 'payment_hurdles', labelAr: 'صعوبة وسائل الدفع الإلكتروني والاعتماد المفرط على الكاش', labelEn: 'Electronic payment friction & heavy cash reliance' }
    ]
  },
  {
    id: 'q28_one_thing_to_change',
    number: 28,
    sectionId: 6,
    titleAr: 'إذا كنت تملك القدرة على تغيير شيء واحد في طريقة بيع وشراء المستعمل في الجزائر اليوم، فماذا ستغير؟',
    titleEn: 'If you could change one single thing about how used goods are bought and sold in Algeria today, what would it be?',
    type: 'textarea',
    required: false,
    placeholderAr: 'شاركنا فكرتك بحرية... نعتمد على أفكاركم في صياغة الحل النهائي',
    placeholderEn: 'Freely share your thought... your input directly shapes the future product'
  },

  // SECTION 7: Needs & Suggestions
  {
    id: 'q29_wishlist_services',
    number: 29,
    sectionId: 7,
    titleAr: 'ما هي الخدمات التي تتمنى وجودها بشدة في هذه المنصة؟',
    titleEn: 'Which specific services do you most strongly wish to see on the platform?',
    subtitleAr: 'اختر أهم 3 خدمات بالنسبة لك',
    subtitleEn: 'Pick up to 3 top priority services',
    type: 'multiple_choice',
    required: true,
    minSelection: 1,
    maxSelection: 3,
    options: [
      { 
        id: 'technical_inspection', 
        labelAr: 'فحص تقني للأجهزة بشهادة حالة معتمدة (Diagnostic)', 
        labelEn: 'Technical diagnostic certification of appliances',
        image: '/src/assets/images/technical_inspection_tool_1793885101904.jpg'
      },
      { id: 'mandatory_video_360', labelAr: 'فيديوهات وصور 360 درجة إلزامية توضح كافة الزوايا وأدق الخدوش', labelEn: 'Mandatory 360° video & transparent scratch documentation' },
      { id: 'trusted_seller_badges', labelAr: 'نظام تقييم ومراجعات صارم للبائعين مع شارات التوثيق', labelEn: 'Rigorous seller rating system & verified identity badges' },
      { id: 'working_warranty', labelAr: 'ضمان تشغيل مدفوع أو مدمج لمدة 15 إلى 30 يوماً', labelEn: 'Integrated 15-to-30 day operational warranty' },
      { 
        id: 'furniture_assembly_transport', 
        labelAr: 'خدمة متكاملة: فك الأثاث، نقله، تركيبه في البيت الجديد', 
        labelEn: 'End-to-end service: Disassembly, transport, and reassembly',
        image: '/src/assets/images/delivery_van_moving_1793885101017.jpg'
      },
      { id: 'buyer_protection_fund', labelAr: 'برنامج حماية المشتري مع استرجاع كامل للمبلغ عند أي خلل', labelEn: 'Buyer protection program with full refund guarantee' },
      { id: 'smart_price_negotiation', labelAr: 'نظام تقديم عروض وتفاوض ذكي على السعر دون إحراج', labelEn: 'Smart anonymous offer & counter-offer price bargaining' },
      { id: 'other', labelAr: 'خدمات أخرى مبتكرة', labelEn: 'Other innovative services' }
    ]
  },
  {
    id: 'q30_seller_interest',
    number: 30,
    sectionId: 7,
    titleAr: 'هل ترغب في استخدام المنصة كبائع أيضاً لعرض أثاثك أو أجهزتك القديمة؟',
    titleEn: 'Would you be interested in using the platform as a seller to offload your items?',
    type: 'single_choice',
    required: true,
    options: [
      { id: 'yes', labelAr: 'نعم، لدي أثاث أو أجهزة أرغب ببيعها قريباً', labelEn: 'Yes, I have items I would like to sell soon' },
      { id: 'maybe', labelAr: 'ربما في المستقبل عند تجديد أثاث البيت', labelEn: 'Maybe in the future when redecorating' },
      { id: 'no', labelAr: 'لا، أهتم بالشراء فقط حالياً', labelEn: 'No, strictly looking to buy' }
    ]
  },
  {
    id: 'q31_seller_incentives',
    number: 31,
    sectionId: 7,
    titleAr: 'كبائع محتمل، ما الذي يشجعك أكثر على عرض منتجاتك على المنصة؟',
    titleEn: 'As a potential seller, what would encourage you most to list items on the platform?',
    subtitleAr: 'يظهر لأنك مهتم أو قد تهتم بالبيع على المنصة',
    subtitleEn: 'Visible because you indicated interest in selling',
    type: 'multiple_choice',
    required: false,
    condition: {
      dependsOnQuestionId: 'q30_seller_interest',
      operator: 'includes',
      value: ['yes', 'maybe']
    },
    options: [
      { id: 'easy_listing_ai', labelAr: 'سهولة نشر الإعلان (المساعدة في تسعير السلعة ووصفها)', labelEn: 'Easy listing with smart price suggestion & description' },
      { id: 'free_listing', labelAr: 'مجانية نشر الإعلانات بدون عمولات مسبقة', labelEn: 'Free listing without upfront commission fees' },
      { id: 'serious_buyers', labelAr: 'تصفية المشترين الجادين وحمايتي من تضييع الوقت والرسائل العشوائية', labelEn: 'Filtering serious buyers & eliminating time-wasters' },
      { id: 'home_pickup_for_seller', labelAr: 'المنصة تتكفل باستلام السلعة الثقيلة من بيتي ونقلها للمشتري', labelEn: 'Platform handles heavy pickup directly from my apartment' },
      { id: 'guaranteed_payment', labelAr: 'ضمان استلام حقي المالي فور تسليم السلعة مباشرة', labelEn: 'Guaranteed prompt payout upon item handover' }
    ]
  },
  {
    id: 'q32_open_suggestion',
    number: 32,
    sectionId: 7,
    titleAr: 'هل لديك أي فكرة، نصيحة، أو ميزة تقترحها لتجعل هذه المنصة الرقمية أفضل؟',
    titleEn: 'Do you have any suggestions, advice, or ideas to make this platform outstanding?',
    subtitleAr: 'رأيك الشخصي سيؤثر بشكل مباشر في تحديد ميزات المنصة القادمة',
    subtitleEn: 'Your unique feedback will directly shape our launch roadmap',
    type: 'textarea',
    required: false,
    placeholderAr: 'اكتب كل ما يخطر ببالك، كل ملاحظة محل اهتمام وتقدير فريق البحث...',
    placeholderEn: 'Share any thoughts, ideas or remarks with the research team...'
  }
];
