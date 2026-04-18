import { AttendanceRecord } from '../types/teacher';
import { getTeacherAttendance } from '../services/teacherAttendanceService';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

/**
 * Get all attendance records from real API (or mock fallback)
 */
export const getAllAttendanceRecords = async (): Promise<AttendanceRecord[]> => {
    try {
        if (USE_MOCK) {
            const { teacherApi } = await import('../services/teacherApi');
            return await teacherApi.getAttendanceRecords();
        }

        // Real API - fetch all records (no date filter)
        const data = await getTeacherAttendance();
        return data.map(a => ({
            id:           a.id,
            studentId:    a.studentId,
            studentName:  a.studentName,
            class:        a.class,
            date:         a.date,
            status:       a.status as AttendanceRecord['status'],
            subject:      a.subject,
            teacher:      '', // will be filled from profile
            lessonHour:   '',
            notes:        a.notes ?? undefined,
            academicYear: a.academicYear,
            semester:     (a.semester === 'Genap' ? 'Genap' : 'Ganjil') as 'Ganjil' | 'Genap',
        }));
    } catch (error) {
        console.error('Error loading attendance records:', error);
        return [];
    }
};

export const generateRecordKey = (record: AttendanceRecord): string => {
    return `${record.date}-${record.studentName}-${record.subject}-${record.lessonHour || 'no-hour'}`;
};

export const updateAttendanceRecord = async (record: AttendanceRecord): Promise<boolean> => {
    try {
        if (USE_MOCK) {
            const { teacherApi } = await import('../services/teacherApi');
            const result = await teacherApi.updateAttendanceRecord(record);
            return result.success;
        }
        // Real API update not implemented yet - return true optimistically
        return true;
    } catch (error) {
        console.error('Error updating attendance record:', error);
        return false;
    }
};

export const deleteAttendanceRecord = async (record: AttendanceRecord): Promise<boolean> => {
    try {
        if (USE_MOCK) {
            const { teacherApi } = await import('../services/teacherApi');
            const result = await teacherApi.deleteAttendanceRecord(record);
            return result.success;
        }
        // Real API delete not implemented yet
        return true;
    } catch (error) {
        console.error('Error deleting attendance record:', error);
        return false;
    }
};
