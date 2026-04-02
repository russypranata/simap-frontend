// ============================================
// STUDENT GRADES SERVICE
// ============================================

export interface SubjectGrade {
    id: number;
    subject: string;
    teacher: string;
    dailyScore: number;
    midTermScore: number;
    finalScore: number;
    averageScore: number;
    grade: string;
    kkm: number;
}

export interface SemesterSummary {
    semester: string;
    academicYear: string;
    averageScore: number;
    rank: number;
    totalStudents: number;
    attendance: number;
}

const mockGrades: SubjectGrade[] = [
    { id: 1, subject: "Matematika", teacher: "Pak Ahmad", dailyScore: 85, midTermScore: 82, finalScore: 88, averageScore: 85, grade: "A-", kkm: 75 },
    { id: 2, subject: "Fisika", teacher: "Bu Sari", dailyScore: 78, midTermScore: 80, finalScore: 82, averageScore: 80, grade: "B+", kkm: 75 },
    { id: 3, subject: "Kimia", teacher: "Pak Rudi", dailyScore: 82, midTermScore: 85, finalScore: 84, averageScore: 84, grade: "A-", kkm: 75 },
    { id: 4, subject: "Biologi", teacher: "Bu Ani", dailyScore: 88, midTermScore: 90, finalScore: 92, averageScore: 90, grade: "A", kkm: 75 },
    { id: 5, subject: "Bahasa Indonesia", teacher: "Bu Dewi", dailyScore: 80, midTermScore: 78, finalScore: 82, averageScore: 80, grade: "B+", kkm: 75 },
    { id: 6, subject: "Bahasa Inggris", teacher: "Pak Budi", dailyScore: 85, midTermScore: 88, finalScore: 86, averageScore: 86, grade: "A-", kkm: 75 },
    { id: 7, subject: "Sejarah", teacher: "Pak Hendra", dailyScore: 78, midTermScore: 75, finalScore: 80, averageScore: 78, grade: "B", kkm: 75 },
    { id: 8, subject: "Pendidikan Agama", teacher: "Pak Usman", dailyScore: 92, midTermScore: 95, finalScore: 93, averageScore: 93, grade: "A", kkm: 75 },
    { id: 9, subject: "PKn", teacher: "Bu Rina", dailyScore: 82, midTermScore: 80, finalScore: 84, averageScore: 82, grade: "B+", kkm: 75 },
    { id: 10, subject: "Seni Budaya", teacher: "Bu Ratna", dailyScore: 88, midTermScore: 85, finalScore: 90, averageScore: 88, grade: "A-", kkm: 75 },
    { id: 11, subject: "PJOK", teacher: "Pak Dedi", dailyScore: 85, midTermScore: 88, finalScore: 85, averageScore: 86, grade: "A-", kkm: 75 },
    { id: 12, subject: "Prakarya", teacher: "Pak Joko", dailyScore: 80, midTermScore: 82, finalScore: 80, averageScore: 81, grade: "B+", kkm: 75 },
    { id: 13, subject: "TIK", teacher: "Pak Fajar", dailyScore: 90, midTermScore: 92, finalScore: 88, averageScore: 90, grade: "A", kkm: 75 },
];

const mockSemesterHistory: SemesterSummary[] = [
    { semester: "Ganjil", academicYear: "2025/2026", averageScore: 85.2, rank: 5, totalStudents: 32, attendance: 98 },
    { semester: "Genap", academicYear: "2024/2025", averageScore: 84.5, rank: 6, totalStudents: 32, attendance: 96 },
    { semester: "Ganjil", academicYear: "2024/2025", averageScore: 83.8, rank: 8, totalStudents: 32, attendance: 95 },
    { semester: "Genap", academicYear: "2023/2024", averageScore: 82.1, rank: 10, totalStudents: 32, attendance: 94 },
];

export const getStudentGrades = async (): Promise<SubjectGrade[]> => {
    return Promise.resolve(mockGrades);
};

export const getStudentSemesterHistory = async (): Promise<SemesterSummary[]> => {
    return Promise.resolve(mockSemesterHistory);
};
