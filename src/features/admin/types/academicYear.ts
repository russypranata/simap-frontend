// Type definitions untuk Tahun Ajaran (Academic Year)

export interface Semester {
    id: string;
    name: string;                    // "Ganjil" | "Genap"
    code: "1" | "2";                 // "1" = Ganjil, "2" = Genap
    startDate: string;               // ISO date
    endDate: string;                 // ISO date
    isActive: boolean;               // Semester yang sedang berjalan
    createdAt: string;               // Timestamp created
    updatedAt: string;               // Timestamp last updated
}

export interface AcademicYear {
    id: string;
    name: string;                    // "2025/2026"
    startDate: string;               // ISO date
    endDate: string;                 // ISO date
    isActive: boolean;               // Apakah tahun ajaran ini yang sedang berjalan
    semesters: Semester[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateAcademicYearRequest {
    name: string;
    startDate: string;
    endDate: string;
}

export interface UpdateAcademicYearRequest {
    name?: string;
    startDate?: string;
    endDate?: string;
}

export interface AcademicYearListResponse {
    data: AcademicYear[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface AcademicYearStats {
    totalAcademicYears: number;
    activeAcademicYear: string | null;
    activeSemester: string | null;
}
