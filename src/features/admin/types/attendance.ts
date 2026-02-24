export type AttendanceStatus = 'present' | 'sick' | 'permission' | 'alpha' | 'late';

export interface DailyAttendanceStats {
    date: string;
    totalStudents: number;
    present: number;
    sick: number;
    permission: number;
    alpha: number;
    late: number;
    attendanceRate: number; // percentage
}

export interface RecentAttendanceLog {
    id: string;
    studentName: string;
    className: string;
    status: AttendanceStatus;
    time: string; // HH:mm
    date: string;
    notes?: string;
}
