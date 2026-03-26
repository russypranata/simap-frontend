import { getParentChildren, type ChildInfo } from "./dailyAttendanceService";

// Types
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

export interface ExtracurricularData {
    extracurriculars: Extracurricular[];
    recentAttendance: ExtracurricularAttendance[];
}

// Internal base mock data — per academic year, students can join different ekskul
const baseMockExtracurriculars: Omit<Extracurricular, "id">[] = [
    // Tahun Ajaran 2025-2026 (current)
    {
        name: "Pramuka",
        category: "Kepramukaan",
        schedule: "Jumat",
        time: "14:00 - 16:00",
        location: "Lapangan Sekolah",
        advisor: "Pak Ahmad Fauzi",
        members: 45,
        status: "active",
        attendanceRate: 92,
        joinDate: "2025-07-14",
        academicYearId: "2025-2026",
        achievements: ["Juara 2 Jambore Tingkat Kota 2025", "Best Team Camping 2026"],
    },
    {
        name: "Basket",
        category: "Olahraga",
        schedule: "Selasa & Kamis",
        time: "15:00 - 17:00",
        location: "Lapangan Basket",
        advisor: "Pak Dedi Kurniawan",
        members: 20,
        status: "active",
        attendanceRate: 88,
        joinDate: "2025-07-14",
        academicYearId: "2025-2026",
        achievements: ["Juara 1 Turnamen Antar SMA 2026"],
    },

    // Tahun Ajaran 2024-2025 (different ekskul combination)
    {
        name: "Pramuka",
        category: "Kepramukaan",
        schedule: "Jumat",
        time: "14:00 - 16:00",
        location: "Lapangan Sekolah",
        advisor: "Pak Ahmad Fauzi",
        members: 42,
        status: "inactive",
        attendanceRate: 90,
        joinDate: "2024-07-15",
        academicYearId: "2024-2025",
        achievements: ["Juara 1 Pionering Antar Ranting 2024"],
    },
    {
        name: "Paduan Suara",
        category: "Seni",
        schedule: "Rabu",
        time: "14:00 - 15:30",
        location: "Aula Sekolah",
        advisor: "Bu Siti Rahmawati",
        members: 30,
        status: "inactive",
        attendanceRate: 85,
        joinDate: "2024-07-15",
        academicYearId: "2024-2025",
        achievements: ["Juara 3 Festival Paduan Suara Tingkat Kabupaten 2025"],
    },

    // Tahun Ajaran 2023-2024
    {
        name: "Futsal",
        category: "Olahraga",
        schedule: "Senin & Rabu",
        time: "15:00 - 17:00",
        location: "Lapangan Futsal",
        advisor: "Pak Budi Santoso",
        members: 18,
        status: "inactive",
        attendanceRate: 82,
        joinDate: "2023-07-17",
        academicYearId: "2023-2024",
    },
    {
        name: "Pramuka",
        category: "Kepramukaan",
        schedule: "Jumat",
        time: "14:00 - 16:00",
        location: "Lapangan Sekolah",
        advisor: "Pak Ahmad Fauzi",
        members: 40,
        status: "inactive",
        attendanceRate: 87,
        joinDate: "2023-07-17",
        academicYearId: "2023-2024",
        achievements: ["Juara 1 Pionering Antar Ranting 2023"],
    },
];

const baseMockRecentAttendance: Omit<ExtracurricularAttendance, "id">[] = [
    // 2025-2026
    { date: "2026-01-10", activity: "Pramuka - Latihan Rutin", status: "hadir", academicYearId: "2025-2026" },
    { date: "2026-01-09", activity: "Basket - Latihan", status: "hadir", academicYearId: "2025-2026" },
    { date: "2026-01-07", activity: "Basket - Latihan", status: "hadir", academicYearId: "2025-2026" },
    { date: "2026-01-03", activity: "Pramuka - Latihan Rutin", status: "izin", academicYearId: "2025-2026" },
    { date: "2025-12-26", activity: "Basket - Latihan", status: "hadir", academicYearId: "2025-2026" },
    { date: "2025-12-24", activity: "Basket - Latihan", status: "alpa", academicYearId: "2025-2026" },
    { date: "2025-12-20", activity: "Pramuka - Penjelajahan", status: "hadir", academicYearId: "2025-2026" },
    { date: "2025-12-18", activity: "Basket - Pertandingan Persahabatan", status: "hadir", academicYearId: "2025-2026" },
    { date: "2025-12-13", activity: "Pramuka - Latihan Rutin", status: "hadir", academicYearId: "2025-2026" },
    { date: "2025-12-10", activity: "Basket - Latihan", status: "hadir", academicYearId: "2025-2026" },
    { date: "2025-12-06", activity: "Pramuka - Latihan Rutin", status: "izin", academicYearId: "2025-2026" },
    { date: "2025-11-28", activity: "Basket - Latihan", status: "hadir", academicYearId: "2025-2026" },
    { date: "2025-11-21", activity: "Pramuka - Latihan Rutin", status: "hadir", academicYearId: "2025-2026" },
    { date: "2025-11-14", activity: "Pramuka - Upacara Api Unggun", status: "hadir", academicYearId: "2025-2026" },
    { date: "2025-10-31", activity: "Basket - Latihan", status: "hadir", academicYearId: "2025-2026" },
    { date: "2025-10-24", activity: "Pramuka - Latihan Rutin", status: "hadir", academicYearId: "2025-2026" },
    { date: "2025-10-10", activity: "Basket - Latihan", status: "alpa", academicYearId: "2025-2026" },

    // 2024-2025
    { date: "2025-06-06", activity: "Pramuka - Latihan Rutin", status: "hadir", academicYearId: "2024-2025" },
    { date: "2025-05-28", activity: "Paduan Suara - Latihan", status: "hadir", academicYearId: "2024-2025" },
    { date: "2025-05-21", activity: "Paduan Suara - Latihan", status: "izin", academicYearId: "2024-2025" },
    { date: "2025-05-16", activity: "Pramuka - Penjelajahan", status: "hadir", academicYearId: "2024-2025" },
    { date: "2025-04-30", activity: "Paduan Suara - Persiapan Lomba", status: "hadir", academicYearId: "2024-2025" },
    { date: "2025-04-25", activity: "Pramuka - Latihan Rutin", status: "hadir", academicYearId: "2024-2025" },
    { date: "2025-03-28", activity: "Paduan Suara - Latihan", status: "hadir", academicYearId: "2024-2025" },
    { date: "2025-03-14", activity: "Pramuka - Latihan Rutin", status: "alpa", academicYearId: "2024-2025" },
    { date: "2025-02-21", activity: "Paduan Suara - Latihan", status: "hadir", academicYearId: "2024-2025" },
    { date: "2025-01-17", activity: "Pramuka - Latihan Rutin", status: "hadir", academicYearId: "2024-2025" },
    { date: "2024-12-13", activity: "Paduan Suara - Pentas Seni", status: "hadir", academicYearId: "2024-2025" },
    { date: "2024-11-22", activity: "Pramuka - Latihan Rutin", status: "hadir", academicYearId: "2024-2025" },
    { date: "2024-10-18", activity: "Paduan Suara - Latihan", status: "hadir", academicYearId: "2024-2025" },

    // 2023-2024
    { date: "2024-05-24", activity: "Futsal - Latihan", status: "hadir", academicYearId: "2023-2024" },
    { date: "2024-05-17", activity: "Pramuka - Latihan Rutin", status: "hadir", academicYearId: "2023-2024" },
    { date: "2024-04-26", activity: "Futsal - Pertandingan Persahabatan", status: "hadir", academicYearId: "2023-2024" },
    { date: "2024-04-19", activity: "Pramuka - Latihan Rutin", status: "izin", academicYearId: "2023-2024" },
    { date: "2024-03-22", activity: "Futsal - Latihan", status: "hadir", academicYearId: "2023-2024" },
    { date: "2024-02-16", activity: "Pramuka - Latihan Rutin", status: "hadir", academicYearId: "2023-2024" },
    { date: "2024-01-19", activity: "Futsal - Latihan", status: "alpa", academicYearId: "2023-2024" },
    { date: "2023-12-15", activity: "Pramuka - Perkemahan Akhir Tahun", status: "hadir", academicYearId: "2023-2024" },
    { date: "2023-11-17", activity: "Futsal - Latihan", status: "hadir", academicYearId: "2023-2024" },
    { date: "2023-10-20", activity: "Pramuka - Latihan Rutin", status: "hadir", academicYearId: "2023-2024" },
];

/**
 * Fetch extracurricular data for a specific child.
 * Currently uses mock data — replace with real API call later:
 * GET /api/parent/{parentId}/extracurricular?childId={childId}
 */
export const getExtracurricularData = async (
    childId: string
): Promise<ExtracurricularData> => {
    return new Promise((resolve, reject) => {
        // Simulate potential API failure (10% chance)
        // if (Math.random() < 0.1) return reject(new Error("Gagal terhubung ke server SIMAP."));

        setTimeout(() => {
            const seed = childId.charCodeAt(childId.length - 1);

            const extracurriculars: Extracurricular[] = baseMockExtracurriculars.map((base, index) => {
                const rateVariation = (seed % 5) - 2;
                return {
                    ...base,
                    id: parseInt(`${seed}${index}`),
                    attendanceRate: Math.min(100, Math.max(0, base.attendanceRate + rateVariation)),
                };
            });

            const recentAttendance: ExtracurricularAttendance[] = baseMockRecentAttendance.map((base, index) => {
                let status = base.status;
                if (seed % 2 !== 0 && index % 5 === 0) {
                    status = "izin";
                } else if (seed % 3 === 0 && index % 4 === 0) {
                    status = "alpa";
                }

                return {
                    ...base,
                    id: parseInt(`${seed}${index}`),
                    status: status as ExtracurricularStatus,
                };
            });

            resolve({ extracurriculars, recentAttendance });
        }, 800);
    });
};

export { getParentChildren, type ChildInfo };
