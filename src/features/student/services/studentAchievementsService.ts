// ============================================
// STUDENT ACHIEVEMENTS SERVICE
// ============================================

export interface Achievement {
    id: number;
    competitionName: string;
    category: string;
    rank: string;
    eventName: string;
    organizer: string;
    level: string;
    date: string;
    photo: string | null;
}

const mockAchievements: Achievement[] = [
    {
        id: 1,
        competitionName: "Olimpiade Matematika",
        category: "Akademik",
        rank: "Juara 1",
        eventName: "OSN Tingkat Provinsi",
        organizer: "Dinas Pendidikan Provinsi Kalimantan Barat",
        level: "Provinsi",
        date: "2024-11-15",
        photo: null,
    },
    {
        id: 101,
        competitionName: "Kompetisi Sains Madrasah",
        category: "Akademik",
        rank: "Juara 3",
        eventName: "KSM Kabupaten",
        organizer: "Kemenag Kabupaten",
        level: "Kabupaten",
        date: "2024-08-10",
        photo: null,
    },
    {
        id: 102,
        competitionName: "Lomba Cerdas Cermat",
        category: "Akademik",
        rank: "Juara 1",
        eventName: "LCC Sekolah",
        organizer: "OSIS SMA",
        level: "Sekolah",
        date: "2024-05-02",
        photo: null,
    },
    {
        id: 103,
        competitionName: "Olimpiade Matematika Nasional",
        category: "Akademik",
        rank: "Juara 2",
        eventName: "OSN Nasional",
        organizer: "Puspresnas",
        level: "Nasional",
        date: "2023-11-15",
        photo: null,
    },
    {
        id: 104,
        competitionName: "Lomba Pidato Bahasa Arab",
        category: "Bahasa",
        rank: "Juara 1",
        eventName: "Festival Bahasa Arab",
        organizer: "MGMP Bahasa Arab",
        level: "Provinsi",
        date: "2023-08-20",
        photo: null,
    },
    {
        id: 105,
        competitionName: "Musabaqah Tilawatil Quran",
        category: "Keagamaan",
        rank: "Harapan 1",
        eventName: "MTQ Kabupaten",
        organizer: "LPTQ Kabupaten",
        level: "Kabupaten",
        date: "2023-05-10",
        photo: null,
    },
    {
        id: 106,
        competitionName: "Lomba Kaligrafi Islam",
        category: "Seni",
        rank: "Juara 3",
        eventName: "Pekan Seni Islami",
        organizer: "Yayasan Al-Fityan",
        level: "Sekolah",
        date: "2023-03-05",
        photo: null,
    },
    {
        id: 107,
        competitionName: "Science Fair Project",
        category: "Sains",
        rank: "Juara 2",
        eventName: "Expo Pendidikan",
        organizer: "Dinas Pendidikan Kota",
        level: "Kecamatan",
        date: "2023-01-20",
        photo: null,
    },
];

export const getStudentAchievements = async (): Promise<Achievement[]> => {
    return Promise.resolve(mockAchievements);
};
