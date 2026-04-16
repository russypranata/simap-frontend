export type AttendanceStatus = 'present' | 'sick' | 'permission' | 'alpha' | 'late';
export type PrayerTime = 'subuh' | 'dzuhur' | 'ashar' | 'maghrib' | 'isya';
export type AttendanceTab = 'daily' | 'morning' | 'prayer' | 'extracurricular';

// Response dari GET /admin/attendance/summary
export interface AttendanceSummary {
    date: string;
    totalStudents: number;
    // Presensi mata pelajaran (per siswa unik)
    present: number;
    absent: number;
    late: number;
    excused: number;
    mapelTotal: number;
    attendanceRate: number;
    // Presensi pagi
    morningPresent: number;
    // Presensi sholat
    prayerTotal: number;
    prayerPresent: number;
}

// Response dari GET /admin/attendance/daily (per item)
export interface AdminDailyAttendance {
    id: number;
    date: string;
    status: string;
    studentName: string | null;
    studentNis: string | null;
    className: string | null;
    subjectName: string | null;
    notes: string | null;
}

// Response dari GET /admin/attendance/morning (per item)
export interface AdminMorningAttendance {
    id: number;
    date: string;
    time: string | null;
    studentName: string | null;
    studentNis: string | null;
    className: string | null;
    notes: string | null;
    location: string | null;
    recordedBy: string | null;
}

// Response dari GET /admin/attendance/prayer (per item)
export interface AdminPrayerAttendance {
    id: number;
    date: string;
    prayerTime: PrayerTime | string;
    status: string;
    studentName: string | null;
    studentNis: string | null;
    className: string | null;
    location: string | null;
    notes: string | null;
}

// Response dari GET /admin/attendance/extracurricular (per item)
export interface AdminEkskulAttendance {
    id: number;
    date: string | null;
    status: string;
    studentName: string | null;
    studentNis: string | null;
    className: string | null;
    ekskulName: string;
    note: string | null;
}

// Filter params untuk semua endpoint list
export interface AttendanceFilters {
    page?: number;
    per_page?: number;
    date?: string;
    class_id?: string;
    status?: string;
    search?: string;
    prayer_time?: string;
    academic_year_id?: string;
}
