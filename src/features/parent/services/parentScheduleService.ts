import {
    childScheduleMap,
    mockAcademicYears,
    DAYS,
    getSubjectColor,
    type ScheduleItem,
    type ChildScheduleData,
    type AcademicYearData,
} from "../data/mockParentScheduleData";

// Re-export types and constants for convenience
export type { ScheduleItem, ChildScheduleData, AcademicYearData };
export { DAYS, getSubjectColor };

/**
 * Fetch schedule data for a specific child and academic year.
 * Simulates API call with delay.
 * Note: Semester filter removed as most Indonesian schools use the same schedule for both semesters.
 */
export const getChildSchedule = async (
    childId: string,
    academicYearId: string
): Promise<ChildScheduleData> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simulate occasional API error (5% chance)
    if (Math.random() < 0.05) {
        throw new Error("Gagal memuat data jadwal. Silakan coba lagi.");
    }

    const childData = childScheduleMap[childId];

    if (!childData) {
        throw new Error(`Data jadwal untuk anak dengan ID ${childId} tidak ditemukan.`);
    }

    // In a real API, we would filter by academic year and semester
    // For mock purposes, we return the full schedule
    return {
        childId: childData.childId,
        childName: childData.childName,
        childClass: childData.childClass,
        schedule: childData.schedule,
    };
};

/**
 * Get list of children for the current parent.
 * Simulates API call with delay.
 */
export const getParentChildren = async (): Promise<ChildScheduleData[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return Object.values(childScheduleMap);
};

/**
 * Get list of all academic years with semesters.
 * Simulates API call with delay.
 */
export const getAcademicYears = async (): Promise<AcademicYearData[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return mockAcademicYears;
};

/**
 * Get schedule items for a specific day.
 */
export const getScheduleByDay = async (
    childId: string,
    day: string,
    academicYearId: string
): Promise<ScheduleItem[]> => {
    const childData = await getChildSchedule(childId, academicYearId);
    return childData.schedule.filter((item) => item.day === day);
};

/**
 * Check if a schedule item is currently happening (real-time tracking).
 * Compares current day and time with schedule item.
 */
export const isScheduleCurrentlyHappening = (item: ScheduleItem): boolean => {
    const now = new Date();
    const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const currentDay = dayNames[now.getDay()];

    // Check if current day matches
    if (item.day !== currentDay) {
        return false;
    }

    // Parse current time and schedule times
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [startHour, startMinute] = item.startTime.split(":").map(Number);
    const [endHour, endMinute] = item.endTime.split(":").map(Number);
    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    // Check if current time is within schedule time
    return currentTime >= startTime && currentTime <= endTime;
};

/**
 * Get the currently active schedule item(s) for a child.
 */
export const getCurrentSchedule = async (
    childId: string,
    academicYearId: string
): Promise<ScheduleItem[]> => {
    const childData = await getChildSchedule(childId, academicYearId);
    return childData.schedule.filter(isScheduleCurrentlyHappening);
};
