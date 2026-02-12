import { Schedule } from '../types/schedule';
import { MOCK_TIME_SLOTS, MOCK_FRIDAY_SLOTS, MOCK_MONDAY_SLOTS, MOCK_TUESDAY_SLOTS, MOCK_WEDNESDAY_SLOTS } from '../data/mockTimeSlots';
import { SubjectCategory } from '../types/subject';

// Palette for dynamic coloring (Tailwind classes)
const COLOR_PALETTE = [
    { bg: 'from-violet-50 to-violet-100', border: 'border-violet-200', text: 'text-violet-900', subtext: 'text-violet-600' },
    { bg: 'from-emerald-50 to-emerald-100', border: 'border-emerald-200', text: 'text-emerald-900', subtext: 'text-emerald-600' },
    { bg: 'from-sky-50 to-sky-100', border: 'border-sky-200', text: 'text-sky-900', subtext: 'text-sky-600' },
    { bg: 'from-amber-50 to-amber-100', border: 'border-amber-200', text: 'text-amber-900', subtext: 'text-amber-600' },
    { bg: 'from-rose-50 to-rose-100', border: 'border-rose-200', text: 'text-rose-900', subtext: 'text-rose-600' },
    { bg: 'from-cyan-50 to-cyan-100', border: 'border-cyan-200', text: 'text-cyan-900', subtext: 'text-cyan-600' },
    { bg: 'from-orange-50 to-orange-100', border: 'border-orange-200', text: 'text-orange-900', subtext: 'text-orange-600' },
    { bg: 'from-pink-50 to-pink-100', border: 'border-pink-200', text: 'text-pink-900', subtext: 'text-pink-600' },
    { bg: 'from-indigo-50 to-indigo-100', border: 'border-indigo-200', text: 'text-indigo-900', subtext: 'text-indigo-600' },
    { bg: 'from-blue-50 to-blue-100', border: 'border-blue-200', text: 'text-blue-900', subtext: 'text-blue-600' },
    { bg: 'from-teal-50 to-teal-100', border: 'border-teal-200', text: 'text-teal-900', subtext: 'text-teal-600' },
    { bg: 'from-fuchsia-50 to-fuchsia-100', border: 'border-fuchsia-200', text: 'text-fuchsia-900', subtext: 'text-fuchsia-600' },
];

/**
 * Simple hash function to generate a consistent index from a string
 */
const getStringHash = (str: string): number => {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
};

// Helper to get color based on Subject Name (Priority) or Category (Fallback)
export const getSubjectColor = (subjectName: string, category?: SubjectCategory | string) => {
    // If we have a category, we might want to group colors by category logic 
    // But for now, let's use the subject name to ensure variety even within same category
    const index = getStringHash(subjectName) % COLOR_PALETTE.length;
    return COLOR_PALETTE[index];
};

export interface ConflictResult {
    hasConflict: boolean;
    type?: 'teacher' | 'class';
    message?: string;
    conflictingSchedule?: Schedule;
}

/**
 * Checks for scheduling conflicts based on Teacher, Class, and Time.
 * @param newSchedule The schedule being created or updated
 * @param existingSchedules List of all existing schedules
 * @param excludeId ID to exclude (for update operations)
 */
export const checkScheduleConflict = (
    newSchedule: Partial<Schedule>,
    existingSchedules: Schedule[],
    excludeId?: string
): ConflictResult => {
    if (!newSchedule.day || !newSchedule.startTime || !newSchedule.endTime) {
        return { hasConflict: false };
    }

    // Filter relevant schedules (same day, overlapping time)
    const overlappingSchedules = existingSchedules.filter(s => {
        if (s.id === excludeId) return false;
        if (s.day !== newSchedule.day) return false;

        // Check time overlap: (StartA < EndB) and (EndA > StartB)
        // String comparison works for "HH:MM" format
        return s.startTime < newSchedule.endTime! && s.endTime > newSchedule.startTime!;
    });

    for (const existing of overlappingSchedules) {
        // Check Teacher Conflict
        if (newSchedule.teacherId && existing.teacherId === newSchedule.teacherId) {
            return {
                hasConflict: true,
                type: 'teacher',
                message: `Guru ${existing.teacherName} sudah mengajar di kelas ${existing.className} pada jam ini.`,
                conflictingSchedule: existing
            };
        }

        // Check Class Conflict
        if (newSchedule.classId && existing.classId === newSchedule.classId) {
            return {
                hasConflict: true,
                type: 'class',
                message: `Kelas ${existing.className} sudah ada pelajaran ${existing.subjectName} pada jam ini.`,
                conflictingSchedule: existing
            };
        }
    }

    return { hasConflict: false };
};

export const getTimeSlotOptions = (day: string = 'Senin') => {
    let slots = MOCK_MONDAY_SLOTS;

    if (day === 'Jumat') {
        slots = MOCK_FRIDAY_SLOTS;
    } else if (day === 'Rabu') {
        slots = MOCK_WEDNESDAY_SLOTS;
    } else if (['Selasa', 'Kamis', 'Sabtu'].includes(day)) {
        slots = MOCK_TUESDAY_SLOTS;
    }
    
    return slots.filter(s => s.type === 'lesson').map(slot => ({
        label: `${slot.label} (${slot.startTime} - ${slot.endTime})`,
        value: slot.startTime, // Changed: Use startTime as value directly for simpler matching
        startTime: slot.startTime,
        endTime: slot.endTime,
        originalLabel: slot.label
    }));
};
