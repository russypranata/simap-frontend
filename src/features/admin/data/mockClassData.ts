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

const generateClassesForYear = (yearId: string) => {
    const classes: Class[] = [];
    const grades = [10, 11, 12];
    const sections = ['A', 'B'];
    const teachers = [...MOCK_TEACHERS];

    grades.forEach((grade, gIdx) => {
        sections.forEach((section, sIdx) => {
            const roman = grade === 10 ? 'X' : grade === 11 ? 'XI' : 'XII';
            const teacher = teachers[(gIdx * 2 + sIdx) % teachers.length];
            classes.push({
                id: `c-${yearId}-${grade}${section.toLowerCase()}`,
                name: `${roman}-${section}`,
                grade,
                type: 'REGULER',
                academicYearId: yearId,
                homeroomTeacherId: teacher.id,
                homeroomTeacherName: teacher.name,
                capacity: 30,
                totalStudents: 25 + Math.floor(Math.random() * 6),
                genderCategory: sIdx === 0 ? 'PUTRA' : 'PUTRI',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
        });
    });
    return classes;
};

// Comprehensive Mock Classes across 3 years
export const MOCK_CLASSES: Class[] = [
    ...generateClassesForYear('ay-2023-2024'),
    ...generateClassesForYear('ay-2024-2025'),
    ...generateClassesForYear('ay-2025-2026'),
    ...generateClassesForYear('ay-2026-2027'),
    
    // Add some Peminatan classes for 2025/2026 to keep diversity
    {
        id: 'c-bio-11-ikh',
        name: 'BIOLOGI XI PEM IKH',
        grade: 11,
        type: 'PEMINATAN',
        academicYearId: 'ay-2025-2026',
        homeroomTeacherId: 't-1',
        homeroomTeacherName: 'Ahmad Dahlan',
        capacity: 40,
        totalStudents: 15,
        peminatanCategory: 'IKH',
        genderCategory: 'PUTRA',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
];
