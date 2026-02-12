import { 
    ExtracurricularAttendanceRecap, 
    ExtracurricularSession,
    SessionMemberAttendance
} from '../types/extracurricular';
import { MOCK_EXTRACURRICULARS } from '../data/mockExtracurriculars';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

class ExtracurricularAttendanceService {
    // Mock Recap Data
    async getAttendanceRecap(academicYear?: string, semester?: string): Promise<ExtracurricularAttendanceRecap[]> {
        await delay(800);
        // Filter mock data by year (if provided)
        const filteredEkskuls = academicYear 
            ? MOCK_EXTRACURRICULARS.filter(e => e.academicYearId === academicYear)
            : MOCK_EXTRACURRICULARS;

        return filteredEkskuls.map(e => ({
            extracurricularId: e.id,
            extracurricularName: e.name,
            category: e.category,
            totalSessions: semester === '2' ? 6 : 12 + Math.floor(Math.random() * 5),
            attendanceRate: 85 + Math.floor(Math.random() * 10),
            lastActivity: new Date().toISOString()
        }));
    }

    async getSessions(extracurricularId: string, academicYear?: string, semester?: string): Promise<ExtracurricularSession[]> {
        await delay(600);
        // Simulate sessions for the year/semester
        const sessionCount = semester === '2' ? 6 : 15;
        const mentor = MOCK_EXTRACURRICULARS.find(e => e.id === extracurricularId)?.mentorName || 'Pembina';

        return Array.from({ length: sessionCount }).map((_, i) => {
            const attendanceCount = 25 - (i % 5);
            return {
                id: `s-${extracurricularId}-${i}`,
                extracurricularId,
                date: new Date(2025, 6 + i, 10 + i).toISOString().split('T')[0],
                startTime: '14:00',
                endTime: '16:00',
                topic: `Materi Latihan Ke-${i + 1}`,
                attendanceCount: attendanceCount,
                totalMembers: 30,
                attendancePercentage: Math.round((attendanceCount / 30) * 100),
                mentorName: mentor
            };
        });
    }

    // Mock Detail for a specific session
    async getSessionDetail(sessionId: string): Promise<{ session: ExtracurricularSession; attendance: SessionMemberAttendance[] }> {
        await delay(500);
        
        // Mock session
        const session: ExtracurricularSession = {
            id: sessionId,
            extracurricularId: '1',
            date: '2025-12-20',
            startTime: '14:00',
            endTime: '16:00',
            topic: 'Latihan Rutin & Evaluasi Bulanan',
            attendanceCount: 28,
            totalMembers: 30,
            attendancePercentage: 93,
            mentorName: 'Ahmad Fauzi, S.Pd'
        };

        // Mock student attendance
        const attendance: SessionMemberAttendance[] = [
            { studentId: '1', studentName: 'Andi Wijaya', nis: '2022001', class: 'XII A', status: 'hadir' },
            { studentId: '2', studentName: 'Rina Kusuma', nis: '2022002', class: 'XI A', status: 'hadir' },
            { studentId: '3', studentName: 'Doni Pratama', nis: '2022003', class: 'XI B', status: 'sakit', note: 'Demam tinggi' },
            { studentId: '4', studentName: 'Siti Aminah', nis: '2022004', class: 'XII B', status: 'izin', note: 'Acara Keluarga' },
            { studentId: '5', studentName: 'Budi Santoso', nis: '2022005', class: 'X A', status: 'hadir' },
        ];

        return { session, attendance };
    }
}

export const extracurricularAttendanceService = new ExtracurricularAttendanceService();
