import { DailyAttendanceStats, RecentAttendanceLog } from '../types/attendance';

export const MOCK_ATTENDANCE_STATS: DailyAttendanceStats = {
    date: new Date().toISOString().split('T')[0],
    totalStudents: 450,
    present: 410,
    sick: 15,
    permission: 10,
    alpha: 5,
    late: 10,
    attendanceRate: 91.1,
};

export const MOCK_RECENT_ATTENDANCE: RecentAttendanceLog[] = [
    {
        id: 'att-001',
        studentName: 'Ahmad Rizki',
        className: 'X-A',
        status: 'late',
        time: '07:15',
        date: new Date().toISOString().split('T')[0],
        notes: 'Terlambat 15 menit',
    },
    {
        id: 'att-002',
        studentName: 'Budi Santoso',
        className: 'XI-IPA-2',
        status: 'sick',
        time: '06:55',
        date: new Date().toISOString().split('T')[0],
        notes: 'Sakit demam (Surat Dokter)',
    },
    {
        id: 'att-003',
        studentName: 'Citra Kirana',
        className: 'XII-IPS-1',
        status: 'permission',
        time: '06:50',
        date: new Date().toISOString().split('T')[0],
        notes: 'Izin acara keluarga',
    },
    {
        id: 'att-004',
        studentName: 'Dewi Ayu',
        className: 'X-B',
        status: 'alpha',
        time: '-',
        date: new Date().toISOString().split('T')[0],
    },
    {
        id: 'att-005',
        studentName: 'Eko Prasetyo',
        className: 'XI-IPA-1',
        status: 'present',
        time: '06:45',
        date: new Date().toISOString().split('T')[0],
    },
];
