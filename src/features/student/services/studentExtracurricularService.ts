export type ExtracurricularStatus = "hadir" | "izin" | "alpa";

export interface Extracurricular {
    id: number;
    name: string;
    category: string;
    schedule: string;
    time: string;
    location: string;
    advisor: string;
    members: number;
    status: "active" | "inactive";
    attendanceRate: number;
    joinDate: string;
    academicYearId: string;
    achievements?: string[];
}

export interface ExtracurricularAttendance {
    id: number;
    date: string;
    activity: string;
    status: ExtracurricularStatus;
    academicYearId: string;
}

const mockExtracurriculars: Extracurricular[] = [
    { id: 1, name: "Pramuka", category: "Kepramukaan", schedule: "Jumat", time: "14:00 - 16:00", location: "Lapangan Sekolah", advisor: "Pak Ahmad Fauzi", members: 45, status: "active", attendanceRate: 92, joinDate: "2025-07-14", academicYearId: "2025-2026", achievements: ["Juara 2 Jambore Tingkat Kota 2025", "Best Team Camping 2026"] },
    { id: 2, name: "Basket", category: "Olahraga", schedule: "Selasa & Kamis", time: "15:00 - 17:00", location: "Lapangan Basket", advisor: "Pak Dedi Kurniawan", members: 20, status: "active", attendanceRate: 88, joinDate: "2025-07-14", academicYearId: "2025-2026", achievements: ["Juara 1 Turnamen Antar SMA 2026"] },
    { id: 3, name: "Pramuka", category: "Kepramukaan", schedule: "Jumat", time: "14:00 - 16:00", location: "Lapangan Sekolah", advisor: "Pak Ahmad Fauzi", members: 42, status: "inactive", attendanceRate: 90, joinDate: "2024-07-15", academicYearId: "2024-2025", achievements: ["Juara 1 Pionering Antar Ranting 2024"] },
    { id: 4, name: "Paduan Suara", category: "Seni", schedule: "Rabu", time: "14:00 - 15:30", location: "Aula Sekolah", advisor: "Bu Siti Rahmawati", members: 30, status: "inactive", attendanceRate: 85, joinDate: "2024-07-15", academicYearId: "2024-2025" },
];

const mockAttendance: ExtracurricularAttendance[] = [
    { id: 1, date: "2026-01-10", activity: "Pramuka - Latihan Rutin", status: "hadir", academicYearId: "2025-2026" },
    { id: 2, date: "2026-01-09", activity: "Basket - Latihan", status: "hadir", academicYearId: "2025-2026" },
    { id: 3, date: "2026-01-07", activity: "Basket - Latihan", status: "hadir", academicYearId: "2025-2026" },
    { id: 4, date: "2026-01-03", activity: "Pramuka - Latihan Rutin", status: "izin", academicYearId: "2025-2026" },
    { id: 5, date: "2025-12-26", activity: "Basket - Latihan", status: "hadir", academicYearId: "2025-2026" },
    { id: 6, date: "2025-12-24", activity: "Basket - Latihan", status: "alpa", academicYearId: "2025-2026" },
    { id: 7, date: "2025-12-20", activity: "Pramuka - Penjelajahan", status: "hadir", academicYearId: "2025-2026" },
    { id: 8, date: "2025-06-06", activity: "Pramuka - Latihan Rutin", status: "hadir", academicYearId: "2024-2025" },
    { id: 9, date: "2025-05-28", activity: "Paduan Suara - Latihan", status: "hadir", academicYearId: "2024-2025" },
    { id: 10, date: "2025-05-21", activity: "Paduan Suara - Latihan", status: "izin", academicYearId: "2024-2025" },
];

export const getStudentExtracurricularData = async (): Promise<{ extracurriculars: Extracurricular[]; recentAttendance: ExtracurricularAttendance[] }> => {
    return new Promise(resolve => {
        setTimeout(() => resolve({ extracurriculars: mockExtracurriculars, recentAttendance: mockAttendance }), 800);
    });
};
