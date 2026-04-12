export interface SubjectGrade {
    id: number;
    subject: string;
    teacher: string;
    ki3Scores: number[];
    ki3Average: number;
    ki3Predicate: string;
    ki3Description: string;
    ki4Scores: number[];
    ki4Average: number;
    ki4Predicate: string;
    ki4Description: string;
    finalAverage: number;
    finalGrade: string;
    kkm: number;
    academicYear: string;
    semester: "ganjil" | "genap";
    remedial?: {
        type: "remedial" | "pengayaan";
        date?: string;
        scoreAfter?: number;
        material?: string;
    };
}

export interface AttitudeScore {
    spiritual: {
        score: "A" | "B" | "C";
        predicate: "Sangat Baik" | "Baik" | "Cukup";
        description: string;
    };
    social: {
        score: "A" | "B" | "C";
        predicate: "Sangat Baik" | "Baik" | "Cukup";
        description: string;
    };
}

export interface Extracurricular {
    name: string;
    type: "Wajib" | "Pilihan";
    score: "A" | "B" | "C";
    predicate: "Sangat Baik" | "Baik" | "Cukup";
    description: string;
    instructor: string;
}

export interface AttendanceSummary {
    sick: number;
    permission: number;
    alpha: number;
    total: number;
    attendanceRate: number;
}

export interface SemesterSummary {
    semester: string;
    academicYear: string;
    averageScore: number;
    rank: number;
    totalStudents: number;
}

export interface AcademicYear {
    id: string;
    year: string;
    semesters: {
        id: string;
        label: string;
        status: "completed" | "active" | "upcoming";
    }[];
}
