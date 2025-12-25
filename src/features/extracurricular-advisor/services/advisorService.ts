// Advisor Service
// This service handles all API interactions for the Extracurricular Advisor role

// TODO: Replace with actual API URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export interface AdvisorDashboardStats {
    totalMembers: number;
    lastAttendancePresent: number;
    averageAttendance: number;
    totalMeetings: number;
}

export interface AdvisorMember {
    id: number;
    nis: string;
    name: string;
    class: string;
    joinDate: string;
    attendance: number;
}

// Service definition
export const advisorService = {
    // Dashboard related endpoints
    getDashboardStats: async (): Promise<AdvisorDashboardStats> => {
        // Placeholder implementation
        // const response = await fetch(`${API_BASE_URL}/advisor/dashboard/stats`);
        // if (!response.ok) throw new Error("Failed to fetch dashboard stats");
        // return response.json();

        // Return mock data for now
        return {
            totalMembers: 45,
            lastAttendancePresent: 42,
            averageAttendance: 91,
            totalMeetings: 12
        };
    },

    getUpcomingSchedule: async () => {
        // const response = await fetch(`${API_BASE_URL}/advisor/schedule/upcoming`);
        return [];
    },

    getRecentActivities: async () => {
        // const response = await fetch(`${API_BASE_URL}/advisor/activities/recent`);
        return [];
    },

    // Member management endpoints
    getMembers: async (academicYear: string): Promise<AdvisorMember[]> => {
        // const response = await fetch(`${API_BASE_URL}/advisor/members?year=${academicYear}`);
        return [];
    },

    addMember: async (memberData: any) => {
        // const response = await fetch(`${API_BASE_URL}/advisor/members`, {
        //     method: "POST",
        //     body: JSON.stringify(memberData)
        // });
        return { success: true };
    },

    deleteMember: async (memberId: number) => {
        // const response = await fetch(`${API_BASE_URL}/advisor/members/${memberId}`, {
        //     method: "DELETE"
        // });
        return { success: true };
    },

    // Attendance endpoints
    getAttendanceHistory: async (filter: any) => {
        // const response = await fetch(`${API_BASE_URL}/advisor/attendance/history`);
        return [];
    },

    submitAttendance: async (data: any) => {
        // const response = await fetch(`${API_BASE_URL}/advisor/attendance`, {
        //     method: "POST",
        //     body: JSON.stringify(data)
        // });
        return { success: true };
    }
};
