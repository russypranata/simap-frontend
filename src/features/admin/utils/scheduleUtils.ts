import { Schedule } from '../types/schedule';
import { MOCK_TIME_SLOTS, MOCK_FRIDAY_SLOTS, MOCK_MONDAY_SLOTS, MOCK_TUESDAY_SLOTS, MOCK_WEDNESDAY_SLOTS } from '../data/mockTimeSlots';
import { SubjectCategory } from '../types/subject';

// Helper to get color based on Subject Name (Priority) or Category (Fallback)
export const getSubjectColor = (subjectName: string, category?: SubjectCategory | string) => {
    const name = subjectName.toLowerCase();

    // 1. Name-based Overrides (Restoring original vibrant palette)
    if (name.includes('matematika') || name.includes('mtk')) 
        return { bg: 'from-violet-50 to-violet-100', border: 'border-violet-200', text: 'text-violet-900', subtext: 'text-violet-600' };
    
    if (name.includes('fisika') || name.includes('kimia') || name.includes('biologi') || name.includes('ipa')) 
        return { bg: 'from-emerald-50 to-emerald-100', border: 'border-emerald-200', text: 'text-emerald-900', subtext: 'text-emerald-600' };
    
    if (name.includes('inggris') || name.includes('arab') || name.includes('indonesia') || name.includes('bahasa')) 
        return { bg: 'from-sky-50 to-sky-100', border: 'border-sky-200', text: 'text-sky-900', subtext: 'text-sky-600' };
    
    if (name.includes('tajwid') || name.includes('fikih') || name.includes('pai') || name.includes('sjr') || name.includes('sejarah') || name.includes('quran')) 
        return { bg: 'from-amber-50 to-amber-100', border: 'border-amber-200', text: 'text-amber-900', subtext: 'text-amber-600' };
    
    if (name.includes('penjaskes') || name.includes('seni') || name.includes('sbd') || name.includes('pjok')) 
        return { bg: 'from-rose-50 to-rose-100', border: 'border-rose-200', text: 'text-rose-900', subtext: 'text-rose-600' };
    
    if (name.includes('informatika') || name.includes('koding') || name.includes('komputer')) 
        return { bg: 'from-cyan-50 to-cyan-100', border: 'border-cyan-200', text: 'text-cyan-900', subtext: 'text-cyan-600' };
    
    if (name.includes('ekonomi') || name.includes('sosiologi') || name.includes('geografi') || name.includes('ips')) 
        return { bg: 'from-orange-50 to-orange-100', border: 'border-orange-200', text: 'text-orange-900', subtext: 'text-orange-600' };
    
    if (name.includes('bk') || name.includes('bimbel')) 
        return { bg: 'from-pink-50 to-pink-100', border: 'border-pink-200', text: 'text-pink-900', subtext: 'text-pink-600' };
    
    if (name.includes('pkn') || name.includes('ppkn') || name.includes('pancasila')) 
        return { bg: 'from-indigo-50 to-indigo-100', border: 'border-indigo-200', text: 'text-indigo-900', subtext: 'text-indigo-600' };

    // 2. Category Fallback
    switch (category) {
        case 'AGAMA':
            return {
                bg: 'from-amber-50 to-amber-100',
                border: 'border-amber-200',
                text: 'text-amber-900',
                subtext: 'text-amber-600'
            };
        case 'KEJURUAN':
        case 'PEMINATAN':
            return {
                bg: 'from-blue-50 to-blue-100',
                border: 'border-blue-200',
                text: 'text-blue-900',
                subtext: 'text-blue-600'
            };
        case 'EKSKUL':
            return {
                bg: 'from-orange-50 to-orange-100',
                border: 'border-orange-200',
                text: 'text-orange-900',
                subtext: 'text-orange-600'
            };
        case 'UMUM':
        default:
            return {
                bg: 'from-slate-50 to-slate-100',
                border: 'border-slate-200',
                text: 'text-slate-900',
                subtext: 'text-slate-500'
            };
    }
};

export interface ConflictResult {
    hasConflict: boolean;
    message?: string;
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
    if (!newSchedule.day || !newSchedule.startTime || !newSchedule.endTime || !newSchedule.teacherId || !newSchedule.classId) {
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
        if (existing.teacherId === newSchedule.teacherId) {
            return {
                hasConflict: true,
                message: `Bentrok Guru: ${existing.teacherName} sudah mengajar di kelas ${existing.className} pada jam ini.`
            };
        }

        // Check Class Conflict
        if (existing.classId === newSchedule.classId) {
            return {
                hasConflict: true,
                message: `Bentrok Kelas: Kelas ${existing.className} sudah ada pelajaran ${existing.subjectName} pada jam ini.`
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
        value: slot.id,
        startTime: slot.startTime,
        endTime: slot.endTime
    }));
};
