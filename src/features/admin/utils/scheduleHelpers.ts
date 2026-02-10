import { Schedule } from '../types/schedule';
import { MOCK_SCHEDULES } from '../data/mockScheduleData';
import { MOCK_TIME_SLOTS, TimeSlot, getLessonSlots } from '../data/mockTimeSlots';

// ======== Query Helpers ========

/**
 * Get all schedules for a specific day
 */
export const getSchedulesByDay = (day: string): Schedule[] => {
    return MOCK_SCHEDULES.filter(schedule => schedule.day === day);
};

/**
 * Get all schedules for a specific class
 */
export const getSchedulesByClass = (classId: string): Schedule[] => {
    return MOCK_SCHEDULES.filter(schedule => schedule.classId && schedule.classId === classId);
};

/**
 * Get all schedules for a specific teacher
 */
export const getSchedulesByTeacher = (teacherId: string): Schedule[] => {
    return MOCK_SCHEDULES.filter(schedule => schedule.teacherId && schedule.teacherId === teacherId);
};

/**
 * Get all schedules for a specific subject
 */
export const getSchedulesBySubject = (subjectId: string): Schedule[] => {
    return MOCK_SCHEDULES.filter(schedule => schedule.subjectId && schedule.subjectId === subjectId);
};

/**
 * Get schedule for a specific day, class, and time
 */
export const getScheduleByDayClassTime = (
    day: string,
    classId: string,
    startTime: string,
    endTime: string
): Schedule | undefined => {
    return MOCK_SCHEDULES.find(
        schedule =>
            schedule.day === day &&
            schedule.classId && schedule.classId === classId &&
            schedule.startTime === startTime &&
            schedule.endTime === endTime
    );
};

// ======== Grid Helpers ========

export interface ScheduleGridCell {
    schedule: Schedule | null;
    timeSlot: TimeSlot;
    classId: string;
}

export interface ScheduleGridRow {
    timeSlot: TimeSlot;
    cells: Map<string, Schedule | null>; // classId -> Schedule
}

/**
 * Get schedule grid for a specific day
 * Returns a matrix of time slots x classes
 */
export const getScheduleGrid = (
    day: string,
    classIds: string[]
): ScheduleGridRow[] => {
    const daySchedules = getSchedulesByDay(day);
    const lessonSlots = getLessonSlots();

    return lessonSlots.map(timeSlot => {
        const cells = new Map<string, Schedule | null>();

        classIds.forEach(classId => {
            const schedule = daySchedules.find(
                s =>
                    s.classId && s.classId === classId &&
                    s.startTime === timeSlot.startTime &&
                    s.endTime === timeSlot.endTime
            );
            cells.set(classId, schedule || null);
        });

        return {
            timeSlot,
            cells,
        };
    });
};

// ======== Grouping Helpers ========

export interface ScheduleByClass {
    classId: string;
    className: string;
    schedules: Schedule[];
}

/**
 * Group schedules by class for a specific day
 */
export const groupSchedulesByClass = (day: string): ScheduleByClass[] => {
    const daySchedules = getSchedulesByDay(day);
    const classMap = new Map<string, Schedule[]>();

    daySchedules.forEach(schedule => {
        if (schedule.classId) {
            if (!classMap.has(schedule.classId)) {
                classMap.set(schedule.classId, []);
            }
            classMap.get(schedule.classId)!.push(schedule);
        }
    });

    return Array.from(classMap.entries()).map(([classId, schedules]) => ({
        classId,
        className: schedules[0]?.className || classId,
        schedules: schedules.sort((a, b) => a.startTime.localeCompare(b.startTime)),
    }));
};

export interface ScheduleByTeacher {
    teacherId: string;
    teacherName: string;
    schedules: Schedule[];
}

/**
 * Group schedules by teacher for a specific day
 */
export const groupSchedulesByTeacher = (day: string): ScheduleByTeacher[] => {
    const daySchedules = getSchedulesByDay(day);
    const teacherMap = new Map<string, Schedule[]>();

    daySchedules.forEach(schedule => {
        if (schedule.teacherId) {
            if (!teacherMap.has(schedule.teacherId)) {
                teacherMap.set(schedule.teacherId, []);
            }
            teacherMap.get(schedule.teacherId)!.push(schedule);
        }
    });

    return Array.from(teacherMap.entries()).map(([teacherId, schedules]) => ({
        teacherId,
        teacherName: schedules[0]?.teacherName || teacherId,
        schedules: schedules.sort((a, b) => a.startTime.localeCompare(b.startTime)),
    }));
};

// ======== Validation Helpers ========

/**
 * Check if a teacher has a conflict at the given time
 */
export const hasTeacherConflict = (
    teacherId: string,
    day: string,
    startTime: string,
    endTime: string,
    excludeScheduleId?: string
): boolean => {
    const teacherSchedules = getSchedulesByTeacher(teacherId).filter(
        s => s.day === day && (!excludeScheduleId || s.id !== excludeScheduleId)
    );

    return teacherSchedules.some(
        schedule => schedule.startTime === startTime && schedule.endTime === endTime
    );
};

/**
 * Check if a class has a conflict at the given time
 */
export const hasClassConflict = (
    classId: string,
    day: string,
    startTime: string,
    endTime: string,
    excludeScheduleId?: string
): boolean => {
    const classSchedules = getSchedulesByClass(classId).filter(
        s => s.day === day && (!excludeScheduleId || s.id !== excludeScheduleId)
    );

    return classSchedules.some(
        schedule => schedule.startTime === startTime && schedule.endTime === endTime
    );
};

/**
 * Check if a room has a conflict at the given time
 */
export const hasRoomConflict = (
    room: string,
    day: string,
    startTime: string,
    endTime: string,
    excludeScheduleId?: string
): boolean => {
    const daySchedules = getSchedulesByDay(day).filter(
        s => !excludeScheduleId || s.id !== excludeScheduleId
    );

    return daySchedules.some(
        schedule =>
            schedule.room === room &&
            schedule.startTime === startTime &&
            schedule.endTime === endTime
    );
};

// ======== Statistics Helpers ========

/**
 * Get teaching hours for a teacher on a specific day
 */
export const getTeacherHoursPerDay = (teacherId: string, day: string): number => {
    const schedules = getSchedulesByTeacher(teacherId).filter(s => s.day === day);
    return schedules.length; // Each schedule = 40 minutes
};

/**
 * Get total teaching hours for a teacher per week
 */
export const getTeacherHoursPerWeek = (teacherId: string): number => {
    const schedules = getSchedulesByTeacher(teacherId);
    return schedules.length; // Each schedule = 40 minutes
};

/**
 * Get class hours for a specific class on a specific day
 */
export const getClassHoursPerDay = (classId: string, day: string): number => {
    const schedules = getSchedulesByClass(classId).filter(s => s.day === day);
    return schedules.length;
};
