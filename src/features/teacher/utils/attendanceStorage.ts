import { AttendanceRecord } from '../types/teacher';
import { teacherApi } from '../services/teacherApi';

/**
 * Get all attendance records from teacherApi
 */
export const getAllAttendanceRecords = async (): Promise<AttendanceRecord[]> => {
    try {
        // Get all attendance records without filtering
        const records = await teacherApi.getAttendanceRecords();
        return records;
    } catch (error) {
        console.error('Error loading attendance records:', error);
        return [];
    }
};

/**
 * Generate unique key for an attendance record
 */
export const generateRecordKey = (record: AttendanceRecord): string => {
    return `${record.date}-${record.studentName}-${record.subject}-${record.lessonHour || 'no-hour'}`;
};

/**
 * Update an attendance record
 */
export const updateAttendanceRecord = async (record: AttendanceRecord): Promise<boolean> => {
    try {
        const result = await teacherApi.updateAttendanceRecord(record);
        return result.success;
    } catch (error) {
        console.error('Error updating attendance record:', error);
        return false;
    }
};

/**
 * Delete an attendance record
 */
export const deleteAttendanceRecord = async (record: AttendanceRecord): Promise<boolean> => {
    try {
        const result = await teacherApi.deleteAttendanceRecord(record);
        return result.success;
    } catch (error) {
        console.error('Error deleting attendance record:', error);
        return false;
    }
};
