// Mutamayizin Coordinator Service
// This service handles all API interactions for the Mutamayizin Coordinator role

// TODO: Replace with actual API URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export interface MutamayizinDashboardStats {
    totalStudents: number;
    activeStudents: number;
    totalAchievements: number;
    avgStudentPerformance: number;
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
        // Placeholder implementation
        // const response = await fetch(`${API_BASE_URL}/mutamayizin/dashboard/stats`);
        // if (!response.ok) throw new Error("Failed to fetch dashboard stats");
        // return response.json();

        // Return mock data for now
        return {
            totalStudents: 28,
            activeStudents: 27,
            totalAchievements: 15,
            avgStudentPerformance: 87
        };
    },

    getProfileData: async (): Promise<MutamayizinProfileData> => {
        // const response = await fetch(`${API_BASE_URL}/mutamayizin/profile`);
        // if (!response.ok) throw new Error("Failed to fetch profile data");
        // return response.json();

        // Return mock data for now
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
        // const response = await fetch(`${API_BASE_URL}/mutamayizin/students`, {
        //     method: "POST",
        //     body: JSON.stringify(studentData)
        // });
        return { success: true };
    },

    deleteStudent: async (studentId: number) => {
        // const response = await fetch(`${API_BASE_URL}/mutamayizin/students/${studentId}`, {
        //     method: "DELETE"
        // });
        return { success: true };
    },

    // Achievement endpoints
    getAchievements: async (filter: any) => {
        // const response = await fetch(`${API_BASE_URL}/mutamayizin/achievements`);
        return [];
    },

    addAchievement: async (data: any) => {
        // const response = await fetch(`${API_BASE_URL}/mutamayizin/achievements`, {
        //     method: "POST",
        //     body: JSON.stringify(data)
        // });
        return { success: true };
    }
};
