import { ClassHomeroom } from '../types/homeroom';

export const MOCK_HOMEROOM_CLASSES: ClassHomeroom[] = [
    {
        id: 'cls-001',
        className: 'X-A',
        academicYear: '2024/2025',
        homeroomTeacherId: 'stf-001',
        homeroomTeacherName: 'Budi Santoso, S.Pd',
        totalStudents: 32,
    },
    {
        id: 'cls-002',
        className: 'X-B',
        academicYear: '2024/2025',
        homeroomTeacherId: 'stf-002',
        homeroomTeacherName: 'Siti Aminah, S.Pd',
        totalStudents: 31,
    },
    {
        id: 'cls-003',
        className: 'XI-A',
        academicYear: '2024/2025',
        homeroomTeacherId: 'stf-003',
        homeroomTeacherName: 'Ahmad Dahlan, M.Sc',
        totalStudents: 30,
    },
    {
        id: 'cls-004',
        className: 'XI-B',
        academicYear: '2024/2025',
        homeroomTeacherId: null,
        homeroomTeacherName: null, // Vacant
        totalStudents: 28,
    },
];
