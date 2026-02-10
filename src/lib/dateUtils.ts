
/**
 * Date utility functions for handling "Local Dates" (YYYY-MM-DD).
 * Use these functions to avoid timezone offsets issues when handling calendar dates.
 */

// Format a Date object to YYYY-MM-DD string using local time
export const formatLocalDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Parse a YYYY-MM-DD string to a Date object (at 00:00:00 local time)
export const parseLocalDate = (dateStr: string): Date => {
    if (!dateStr) return new Date();
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
};

// Check if two dates are the same calendar day
export const isSameDate = (date1: Date | string, date2: Date | string): boolean => {
    const d1 = typeof date1 === 'string' ? parseLocalDate(date1) : date1;
    const d2 = typeof date2 === 'string' ? parseLocalDate(date2) : date2;
    
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
};

// Get number of days in a month
export const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
};

// Get the day index (0-6, Mon-Sun) of the first day of the month
export const getFirstDayOfMonth = (year: number, month: number): number => {
    const day = new Date(year, month, 1).getDay();
    // Convert Sunday (0) to 6, and Monday (1) to 0, etc.
    // Sunday (0) -> 6
    // Monday (1) -> 0
    // ...
    // Saturday (6) -> 5
    return day === 0 ? 6 : day - 1;
};

// Format date for display (e.g., "Senin, 1 Januari 2024")
export const formatDisplayDate = (dateStr: string): string => {
    return parseLocalDate(dateStr).toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

// Format short date for specific needs
export const formatShortDate = (dateStr: string): string => {
    return parseLocalDate(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
    });
};
