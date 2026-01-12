import {
    StudentProfileData,
    StudentStats,
    mockStudentProfile,
    mockStudentStats
} from "../data/mockStudentData";

const SIMULATED_DELAY_MS = 1500;

/**
 * Service to fetch student profile data.
 * Replace the implementation with real API call when backend is ready.
 */
export const getStudentProfile = async (): Promise<StudentProfileData> => {
    // START: Mock Implementation
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY_MS));
    return mockStudentProfile;
    // END: Mock Implementation

    // Example Real Implementation:
    // const response = await fetch('/api/student/profile');
    // if (!response.ok) throw new Error('Failed to fetch profile');
    // return response.json();
};

/**
 * Service to fetch student statistics (if fetched separately).
 */
export const getStudentStats = async (): Promise<StudentStats> => {
    // START: Mock Implementation
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY_MS));
    return mockStudentStats;
    // END: Mock Implementation
};

/**
 * Service to update student profile.
 */
export const updateStudentProfile = async (data: StudentProfileData): Promise<void> => {
    // START: Mock Implementation
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY_MS));
    console.log("Updated Mock Data:", data);
    // return success
    // END: Mock Implementation
};
