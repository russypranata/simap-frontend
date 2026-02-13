export type PromotionAction = 'PROMOTE' | 'STAY' | 'GRADUATE';

export interface StudentPromotion {
    studentId: string;
    studentName: string;
    nisn: string;
    currentClassId: string;
    currentClassName: string; // Added for display
    action: PromotionAction;
    targetClassId?: string; // Only if action is PROMOTE or STAY (if changing class within same grade)
    targetClassName?: string; // Added for display
}

export interface PromotionPayload {
    sourceAcademicYearId: string;
    targetAcademicYearId: string;
    promotions: StudentPromotion[];
}

export interface PromotionStatus {
    totalStudents: number;
    promoted: number;
    stayed: number;
    graduated: number;
}

// Wizard Types
export type PromotionStep = 1 | 2 | 3 | 4;

export interface ClassMapping {
    sourceClassId: string;
    sourceClassName: string;
    sourceGrade: number;
    targetClassId: string | 'GRADUATE' | 'IGNORE';
    targetClassName?: string;
}

export interface PromotionWizardState {
    step: PromotionStep;
    sourceYearId: string;
    targetYearId: string;
    mappings: ClassMapping[];
    students: StudentPromotion[];
}
