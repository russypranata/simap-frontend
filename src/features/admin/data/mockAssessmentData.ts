import { AssessmentClass, ReportCardClass } from '../types/assessment';

export const MOCK_ASSESSMENT_CLASSES: AssessmentClass[] = [
    {
        id: 'ac-001',
        className: 'X-A',
        subjectName: 'Matematika Wajib',
        teacherName: 'Budi Santoso, S.Pd',
        totalStudents: 32,
        gradedStudents: 32,
        status: 'completed',
        lastUpdated: '2024-06-10T14:30:00Z',
    },
    {
        id: 'ac-002',
        className: 'X-A',
        subjectName: 'Bahasa Indonesia',
        teacherName: 'Siti Aminah, S.Pd',
        totalStudents: 32,
        gradedStudents: 15,
        status: 'partial',
        lastUpdated: '2024-06-12T09:15:00Z',
    },
    {
        id: 'ac-003',
        className: 'XI-A',
        subjectName: 'Fisika',
        teacherName: 'Dr. Rina Wati',
        totalStudents: 30,
        gradedStudents: 0,
        status: 'pending',
        lastUpdated: '2024-06-01T08:00:00Z',
    },
];

export const MOCK_REPORT_CARDS: ReportCardClass[] = [
    {
        id: 'rc-001',
        className: 'X-A',
        homeroomTeacher: 'Budi Santoso, S.Pd',
        totalStudents: 32,
        generatedReports: 32,
        academicYear: '2024/2025',
        semester: 'Genap',
        status: 'ready',
    },
    {
        id: 'rc-002',
        className: 'X-B',
        homeroomTeacher: 'Siti Aminah, S.Pd',
        totalStudents: 31,
        generatedReports: 0,
        academicYear: '2024/2025',
        semester: 'Genap',
        status: 'pending',
    },
    {
        id: 'rc-003',
        className: 'XI-A',
        homeroomTeacher: 'Dr. Rina Wati',
        totalStudents: 30,
        generatedReports: 10,
        academicYear: '2024/2025',
        semester: 'Genap',
        status: 'processing',
    },
];
