/**
 * Lesson hour time mappings
 */
export const LESSON_HOUR_TIMES: Record<string, string> = {
    '1': '07:00-07:45',
    '2': '07:45-08:30',
    '3': '08:30-09:15',
    '4': '09:15-10:00',
    '5': '10:15-11:00',
    '6': '11:00-11:45',
    '7': '12:00-12:45',
    '8': '12:45-13:30',
    '1-2': '07:00-08:30',
    '3-4': '08:30-10:00',
    '5-6': '10:15-11:45',
    '7-8': '12:00-13:30',
};

/**
 * Format lesson hour with time details
 * @param lessonHour - Lesson hour string (e.g., '1', '1-2', '3-4')
 * @returns Formatted string with time (e.g., 'Jam ke-1 (07:00-07:45)')
 */
export function formatLessonHourWithTime(lessonHour: string): string {
    const timeRange = LESSON_HOUR_TIMES[lessonHour];

    if (timeRange) {
        return `Jam ke-${lessonHour} (${timeRange})`;
    }

    // Fallback if time not found
    return `Jam ke-${lessonHour}`;
}
