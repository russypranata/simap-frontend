export type PPDBStatus = 'pending' | 'interview' | 'accepted' | 'rejected';

export interface PPDBApplicant {
    id: string;
    registrationNumber: string;
    name: string;
    previousSchool: string;
    averageGrade: number;
    parentName: string;
    phone: string;
    registrationDate: string;
    status: PPDBStatus;
}
