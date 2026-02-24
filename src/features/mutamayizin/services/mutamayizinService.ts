// Mutamayizin Coordinator Service
// This service handles all API interactions for the Mutamayizin Coordinator role

// TODO: Replace with actual API URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export interface MutamayizinDashboardStats {
    totalStudents: number;
    activeStudents: number;
    totalAchievements: number;
    totalEkskul: number;
    totalTutors: number;
    activeTutors: number;
}

export interface RecentAchievement {
    id: number;
    studentName: string;
    competitionName: string;
    rank: string;
    level: string;
    date: string;
}

export interface EkskulSummary {
    name: string;
    memberCount: number;
    tutorName: string;
    lastActivity: string;
}

export interface MutamayizinStudent {
    id: number;
    nis: string;
    name: string;
    class: string;
    joinDate: string;
    performance: number;
}

export interface MutamayizinProfileData {
    name: string;
    email: string;
    phone: string;
    role: string;
    profilePicture: string;
    address: string;
    joinDate: string;
    nip: string;
    programName: string;
}

// Service definition
export const mutamayizinService = {
    // Dashboard related endpoints
    getDashboardStats: async (): Promise<MutamayizinDashboardStats> => {
        return {
            totalStudents: 12,
            activeStudents: 10,
            totalAchievements: 22,
            totalEkskul: 8,
            totalTutors: 8,
            activeTutors: 6,
        };
    },

    getRecentAchievements: async (): Promise<RecentAchievement[]> => {
        return [
            { id: 1, studentName: "Ahmad Rizki", competitionName: "Olimpiade Matematika", rank: "Juara 1", level: "Provinsi", date: "2024-11-15" },
            { id: 2, studentName: "Siti Nabila", competitionName: "Lomba Pidato Bahasa Inggris", rank: "Juara 2", level: "Kabupaten", date: "2024-10-20" },
            { id: 3, studentName: "Muhammad Fajar", competitionName: "Kompetisi Robotika", rank: "Juara 1", level: "Nasional", date: "2024-09-10" },
            { id: 4, studentName: "Rina Amelia", competitionName: "Lomba Karya Tulis Ilmiah", rank: "Juara 3", level: "Nasional", date: "2024-08-25" },
            { id: 5, studentName: "Budi Santoso", competitionName: "Lomba Futsal", rank: "Juara 1", level: "Provinsi", date: "2024-07-18" },
        ];
    },

    getEkskulSummary: async (): Promise<EkskulSummary[]> => {
        return [
            { name: "Pramuka", memberCount: 8, tutorName: "Ahmad Fauzi, S.Pd", lastActivity: "2024-11-22" },
            { name: "Futsal", memberCount: 6, tutorName: "Budi Santoso, S.Kom", lastActivity: "2024-11-20" },
            { name: "PMR", memberCount: 5, tutorName: "Eka Pertiwi, S.Pd", lastActivity: "2024-11-19" },
            { name: "Seni Tari", memberCount: 4, tutorName: "Citra Dewi, S.Sn", lastActivity: "2024-11-18" },
            { name: "Robotik", memberCount: 3, tutorName: "Fajar Nugraha, S.Kom", lastActivity: "2024-11-15" },
            { name: "English Club", memberCount: 4, tutorName: "Gita Savitri, S.Pd", lastActivity: "2024-11-14" },
            { name: "Basket", memberCount: 5, tutorName: "Budi Santoso, S.Kom", lastActivity: "2024-11-13" },
            { name: "Paskibra", memberCount: 3, tutorName: "Dedi Kurniawan, S.Pd", lastActivity: "2024-11-10" },
        ];
    },

    getProfileData: async (): Promise<MutamayizinProfileData> => {
        return {
            name: "Dr. Fatimah Zahra, M.Pd.I",
            email: "fatimah.zahra@alfityan.sch.id",
            phone: "+62 821-9876-5432",
            role: "PJ Mutamayizin",
            profilePicture: "",
            address: "Jl. Pendidikan Islami No. 45, Kubu Raya, Kalimantan Barat",
            joinDate: "1 Agustus 2021",
            nip: "198807122012012001",
            programName: "Mutamayizin",
        };
    },

    // Student management endpoints
    getStudents: async (academicYear: string): Promise<MutamayizinStudent[]> => {
        // const response = await fetch(`${API_BASE_URL}/mutamayizin/students?year=${academicYear}`);
        return [];
    },

    addStudent: async (studentData: any) => {
        return { success: true };
    },

    deleteStudent: async (studentId: number) => {
        return { success: true };
    },

    // Achievement endpoints
    getAchievements: async (filter: any) => {
        return [];
    },

    addAchievement: async (data: any) => {
        return { success: true };
    }
};
