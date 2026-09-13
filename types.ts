export type DiagnosisCategory = 'POST_LASER' | 'POST_PEEL' | 'ACNE_TREATMENT';

export type RoutineSession = 'MORNING' | 'EVENING';

export type TriageSeverity = 1 | 2 | 3; // 1: Mild, 2: Moderate (SLA 30m), 3: Severe (Emergency)

export interface RoutineItem {
  itemId: string;
  session: RoutineSession;
  stepOrder: number;
  productName: string;
  activeIngredient: string;
  dosageInstruction: string;
  waitMinutesAfter: number; // Spacing timer in minutes (e.g. 15)
  notes?: string;
  completed?: boolean;
  completedAt?: string;
}

export interface CarePass {
  carepassId: string; // Token e.g. "CP-1024"
  clinicId: string;
  clinicName: string;
  patientName: string;
  patientPhone: string;
  diagnosisCategory: DiagnosisCategory;
  diagnosisTitle: string;
  startDate: string;
  totalDays: number;
  currentDay: number;
  adherenceRate: number; // 0 - 100
  points: number; // Gamification points
  status: 'ACTIVE' | 'WARNING_ALLERGY' | 'COMPLETED';
  routine: RoutineItem[];
  createdAt: string;
}

export interface TriageIncident {
  incidentId: string;
  carepassId: string;
  patientName: string;
  patientPhone: string;
  diagnosisTitle: string;
  severityLevel: TriageSeverity;
  symptoms: string;
  affectedArea: string;
  photoUrl?: string;
  doctorNotes?: string;
  isResolved: boolean;
  slaMinutesRemaining: number; // Count down from 30
  createdAt: string;
  resolvedAt?: string;
}

export interface IngredientConflictInfo {
  status: 'DANGER' | 'WARNING' | 'SAFE';
  statusText: string;
  title: string;
  mechanism: string;
  clinicalAdvice: string;
  badgeColor: string;
}

export interface AffiliateProduct {
  id: string;
  name: string;
  brand: string;
  badge: 'Shopee Mall Chính Hãng' | 'LazMall Chính Hãng' | 'Chính Hãng Phòng Khám';
  image: string;
  price: string;
  originalPrice: string;
  rating: number;
  reviewsCount: number;
  suitableFor: string;
  category: 'SERUM_B5' | 'CERAMIDE' | 'SUNSCREEN' | 'CLEANSER' | 'HA';
}
