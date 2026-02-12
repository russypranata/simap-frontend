export type PromotionAction = 'PROMOTE' | 'STAY' | 'GRADUATE';

export interface StudentPromotion {
    studentId: string;
    studentName: string;
    nisn: string;
    currentClassId: string;
    action: PromotionAction;
    targetClassId?: string; // Only if action is PROMOTE or STAY (if changing class within same grade)
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
