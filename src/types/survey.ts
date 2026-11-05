export type Language = 'ar' | 'en';

export type QuestionType = 
  | 'single_choice'
  | 'multiple_choice'
  | 'rating_scale'
  | 'text'
  | 'textarea'
  | 'wilaya_select';

export interface QuestionOption {
  id: string;
  labelAr: string;
  labelEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  iconName?: string;
  image?: string;
}

export interface QuestionCondition {
  dependsOnQuestionId: string;
  operator: 'equals' | 'not_equals' | 'includes' | 'not_includes';
  value: string | string[];
}

export interface Question {
  id: string;
  number: number;
  sectionId: number;
  titleAr: string;
  titleEn: string;
  subtitleAr?: string;
  subtitleEn?: string;
  type: QuestionType;
  options?: QuestionOption[];
  condition?: QuestionCondition;
  required?: boolean;
  minSelection?: number;
  maxSelection?: number;
  placeholderAr?: string;
  placeholderEn?: string;
  sectionInterstitialAr?: string;
  sectionInterstitialEn?: string;
}

export interface Section {
  id: number;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  iconName: string;
  interstitialQuoteAr?: string;
  interstitialQuoteEn?: string;
}

export interface SurveyAnswers {
  [questionId: string]: string | string[] | undefined;
}

export interface SurveyResponse {
  id: string;
  timestamp: string;
  language: Language;
  completionTimeSeconds: number;
  answers: SurveyAnswers;
  contactEmail?: string;
  contactPhone?: string;
  wantsBetaAccess?: boolean;
}

export interface FilterCriteria {
  wilaya?: string;
  ageGroup?: string;
  purchasingPower?: string;
  currentStatus?: string;
  ideaRating?: string;
  willingnessToUse?: string;
  segmentId?: string;
  searchQuery?: string;
}

// Segmentation Archetypes
export interface CustomerSegment {
  id: string;
  nameAr: string;
  nameEn: string;
  badge: string;
  count: number;
  percentage: number;
  descriptionAr: string;
  descriptionEn: string;
  dominantTraitsAr: string[];
  dominantTraitsEn: string[];
  keyFearsAr: string[];
  keyFearsEn: string[];
  recommendedServicesAr: string[];
  recommendedServicesEn: string[];
  marketingStrategyAr: string;
  marketingStrategyEn: string;
}

// Pain Point Intelligence
export interface PainPointItem {
  id: string;
  categoryAr: string;
  categoryEn: string;
  frequency: number; // count
  percentage: number;
  severityScore: number; // 1 - 10
  commercialPriorityScore: number; // 1 - 100
  verbatimQuotesAr: string[];
  verbatimQuotesEn: string[];
  proposedSolutionsAr: string[];
  proposedSolutionsEn: string[];
}

// Cross Tabulation Cell
export interface CrossTabMatrix {
  rowTitleAr: string;
  rowTitleEn: string;
  colTitleAr: string;
  colTitleEn: string;
  rows: {
    labelAr: string;
    labelEn: string;
    cols: {
      labelAr: string;
      labelEn: string;
      count: number;
      percentage: number;
    }[];
  }[];
}

// Sentiment & Text Intelligence
export interface SentimentAnalysis {
  positivePercentage: number;
  neutralPercentage: number;
  criticalPercentage: number;
  confidenceScore: number; // e.g. 88%
  sampleSizeAnalyzed: number;
  topKeywords: { word: string; count: number; category: string }[];
  thematicClusters: { themeAr: string; themeEn: string; count: number; sentiment: 'positive' | 'neutral' | 'critical' }[];
  novelIdeas: string[];
}

// Strategic Recommendation
export interface StrategicRecommendation {
  id: string;
  titleAr: string;
  titleEn: string;
  priority: 'high' | 'medium' | 'critical';
  supportingData: string;
  sampleBacking: { count: number; percentage: number };
  actionItemAr: string;
  actionItemEn: string;
}

export interface AnalyticsSummary {
  totalResponses: number;
  completionRate: number;
  ideaApprovalRate: number; // % Excellent or Good
  highWillingnessRate: number; // % Definitely or Mostly
  buyerRatio: number;
  sellerRatio: number;
  marketTrustIndex: number; // 0 - 100
  topHurdles: { titleAr: string; titleEn: string; percentage: number }[];
  topOpportunities: { titleAr: string; titleEn: string; metric: string }[];
  
  // Distributions
  topProducts: { name: string; count: number; percentage: number; image?: string }[];
  topConcerns: { name: string; count: number; percentage: number }[];
  deliveryPreferences: { name: string; count: number; percentage: number }[];
  paymentPreferences: { name: string; count: number; percentage: number }[];
  ageDistribution: { name: string; count: number; percentage: number }[];
  wilayaDistribution: { code: string; name: string; count: number; percentage: number }[];
  discountExpectations: { name: string; count: number; percentage: number }[];
  pastProblemsEncountered: { name: string; count: number; percentage: number }[];
  desiredServices: { name: string; count: number; percentage: number }[];
  sellerWillingness: { name: string; count: number; percentage: number }[];

  // Advanced Intelligence Suites
  customerSegments: CustomerSegment[];
  painPointsRanked: PainPointItem[];
  sentimentInsights: SentimentAnalysis;
  crossTabulations: {
    ageByApproval: CrossTabMatrix;
    powerByDiscount: CrossTabMatrix;
    experienceByTrust: CrossTabMatrix;
    wilayaByDelivery: CrossTabMatrix;
  };
  logisticsIntelligence: {
    bulkyVsSmallRatio: { bulky: number; small: number };
    deliveryFeeAcceptanceRate: number;
    avgAcceptableTimeDays: string;
    preferredLogisticsModel: string;
    actionableDirectivesAr: string[];
    actionableDirectivesEn: string[];
  };
  strategicRecommendations: StrategicRecommendation[];

  openEndedResponses: {
    solutions: string[];
    barriers: string[];
    desiredChanges: string[];
    sellerIncentives: string[];
    generalSuggestions: string[];
  };
}
