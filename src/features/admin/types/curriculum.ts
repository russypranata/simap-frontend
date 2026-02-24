export type CurriculumStatus = 'active' | 'inactive' | 'draft';

export interface Curriculum {
    id: string;
    name: string; // e.g. "Kurikulum Merdeka 2024", "K13 Revisi"
    code: string; // e.g. "KM-2024"
    description: string;
    academicYearId: string; // Linked to Academic Year
    academicYearName: string;
    status: CurriculumStatus;
    totalSubjects: number;
    createdAt: string;
    updatedAt: string;
}
