import { getParentChildren, type ChildInfo } from "./dailyAttendanceService";

export interface AchievementRecord {
    id: number;
    competitionName: string;
    category: string;
    rank: string;
    eventName: string;
    organizer: string;
    level: string;
    date: string;
    photo: string | null;
    academicYearId: string;
    semester: number;
}

const baseMockAchievements: Omit<AchievementRecord, "id">[] = [
    // Tahun Ajaran 2025-2026
    {
        competitionName: "Olimpiade Sains Nasional",
        category: "Akademik",
        rank: "Juara 1",
        eventName: "OSN Tingkat Provinsi 2026",
        organizer: "Puspresnas Kemdikbudristek",
        level: "Provinsi",
        date: "2026-02-15",
        photo: null,
        academicYearId: "2025-2026",
        semester: 2,
    },
    {
        competitionName: "Lomba Karya Tulis Ilmiah",
        category: "Akademik",
        rank: "Juara 2",
        eventName: "Festival Inovasi Pelajar",
        organizer: "Universitas Indonesia",
        level: "Nasional",
        date: "2025-11-10",
        photo: null,
        academicYearId: "2025-2026",
        semester: 1,
    },
    // Tahun Ajaran 2024-2025
    {
        competitionName: "Kompetisi Sains Madrasah",
        category: "Akademik",
        rank: "Juara 3",
        eventName: "KSM Kabupaten",
        organizer: "Kemenag Kabupaten",
        level: "Kabupaten",
        date: "2025-05-10",
        photo: null,
        academicYearId: "2024-2025",
        semester: 2,
    },
    {
        competitionName: "Lomba Pidato Bahasa Arab",
        category: "Bahasa",
        rank: "Juara 1",
        eventName: "Festival Bahasa Arab",
        organizer: "MGMP Bahasa Arab",
        level: "Provinsi",
        date: "2024-10-20",
        photo: null,
        academicYearId: "2024-2025",
        semester: 1,
    },
    // Tahun Ajaran 2023-2024
    {
        competitionName: "Musabaqah Tilawatil Quran",
        category: "Keagamaan",
        rank: "Harapan 1",
        eventName: "MTQ Kabupaten",
        organizer: "LPTQ Kabupaten",
        level: "Kabupaten",
        date: "2024-03-15",
        photo: null,
        academicYearId: "2023-2024",
        semester: 2,
    },
    {
        competitionName: "Science Fair Project",
        category: "Sains",
        rank: "Juara 2",
        eventName: "Expo Pendidikan",
        organizer: "Dinas Pendidikan Kota",
        level: "Kecamatan",
        date: "2023-11-20",
        photo: null,
        academicYearId: "2023-2024",
        semester: 1,
    },
    {
        competitionName: "Lomba Cerdas Cermat",
        category: "Akademik",
        rank: "Juara 1",
        eventName: "LCC Sekolah",
        organizer: "OSIS SMA",
        level: "Sekolah",
        date: "2023-08-02",
        photo: null,
        academicYearId: "2023-2024",
        semester: 1,
    },
];

export const getAchievements = async (
    childId: string
): Promise<AchievementRecord[]> => {
    return new Promise((resolve, reject) => {
        // Uncomment to simulate API failure:
        // if (Math.random() < 0.1) return reject(new Error("Gagal mengambil data prestasi."));

        setTimeout(() => {
            // Generate deterministic mock variation based on childId
            const seed = childId.charCodeAt(0) || 1;
            
            // Adjust mock data slightly based on child seed to feel organic
            const records: AchievementRecord[] = baseMockAchievements.map((base, index) => {
                return {
                    ...base,
                    id: parseInt(`${seed}${index}`),
                };
            });

            // If seed is even, maybe simulate fewer achievements
            if (seed % 2 === 0) {
                resolve(records.slice(0, 4));
            } else {
                resolve(records);
            }
            
        }, 800);
    });
};

export { getParentChildren, type ChildInfo };
