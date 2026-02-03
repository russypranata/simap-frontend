import { Class, Teacher, Student } from '../types/class';

// Mock Teachers (Wali Kelas candidates)
export const MOCK_TEACHERS: Teacher[] = [
    { id: 't-1', name: 'Ahmad Dahlan', nip: '198501012010011001' },
    { id: 't-2', name: 'Siti Aminah', nip: '199002022015012002' },
    { id: 't-3', name: 'Budi Santoso', nip: '198803032012011003' },
    { id: 't-4', name: 'Dewi Sartika', nip: '199204042018012004' },
    { id: 't-5', name: 'Umar Bakri', nip: '198005052005011005' },
    { id: 't-6', name: 'Khadijah', nip: '198906062016012006' },
];

// Mock Students (For detail view)
export const MOCK_STUDENTS: Student[] = [
    { id: 's-1', name: 'Abdullah', nisn: '0051234567', status: 'ACTIVE' },
    { id: 's-2', name: 'Abdurrahman', nisn: '0051234568', status: 'ACTIVE' },
    { id: 's-3', name: 'Zaid', nisn: '0051234569', status: 'ACTIVE' },
    { id: 's-4', name: 'Usman', nisn: '0051234570', status: 'ACTIVE' },
    { id: 's-5', name: 'Ali', nisn: '0051234571', status: 'ACTIVE' },
];

// Mock Classes (10-12, A/B)
export const MOCK_CLASSES: Class[] = [
    // Kelas 10 (X)
    {
        id: 'c-10a',
        name: 'X-A',
        grade: 10,
        type: 'REGULER',
        academicYearId: 'ay-2025-2026',
        homeroomTeacherId: 't-1',
        homeroomTeacherName: 'Ahmad Dahlan',
        capacity: 30,
        totalStudents: 28,
        genderCategory: 'PUTRA',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'c-10b',
        name: 'X-B',
        grade: 10,
        type: 'REGULER',
        academicYearId: 'ay-2025-2026',
        homeroomTeacherId: 't-2',
        homeroomTeacherName: 'Siti Aminah',
        capacity: 30,
        totalStudents: 25,
        genderCategory: 'PUTRI',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    // Kelas 11 (XI)
    {
        id: 'c-11a',
        name: 'XI-A',
        grade: 11,
        type: 'REGULER',
        academicYearId: 'ay-2025-2026',
        homeroomTeacherId: 't-3',
        homeroomTeacherName: 'Budi Santoso',
        capacity: 30,
        totalStudents: 29,
        genderCategory: 'PUTRA',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'c-11-pem-akh-bio',
        name: 'XI PEM AKH BIOLOGI',
        grade: 11,
        type: 'PEMINATAN',
        peminatanCategory: 'AKH',
        subjectId: 's-1', // Assuming Biologi
        subjectName: 'Biologi',
        academicYearId: 'ay-2025-2026',
        homeroomTeacherId: 't-4',
        homeroomTeacherName: 'Dewi Sartika',
        capacity: 36,
        totalStudents: 32,
        genderCategory: 'CAMPURAN',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    // Kelas 12 (XII)
    {
        id: 'c-12a',
        name: 'XII-A',
        grade: 12,
        type: 'REGULER',
        academicYearId: 'ay-2025-2026',
        homeroomTeacherId: 't-5',
        homeroomTeacherName: 'Umar Bakri',
        capacity: 30,
        totalStudents: 27,
        genderCategory: 'PUTRA',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    // Kelas Tahun Lalu (2024/2025) - Untuk testing filter
    {
        id: 'c-10a-old',
        name: 'X-A',
        grade: 10,
        type: 'REGULER',
        academicYearId: 'ay-2024-2025',
        homeroomTeacherId: 't-1',
        homeroomTeacherName: 'Ahmad Dahlan',
        capacity: 30,
        totalStudents: 30,
        genderCategory: 'PUTRA',
        createdAt: '2024-07-15T00:00:00Z',
        updatedAt: '2024-07-15T00:00:00Z',
    },
];
