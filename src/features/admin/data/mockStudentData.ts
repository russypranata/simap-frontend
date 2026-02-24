import { Student } from '../types/student';

const generateStudentsForClass = (classId: string, className: string, count: number, startId: string) => {
    const students: Student[] = [];
    const baseNames = ['Abdullah', 'Fatimah', 'Muhammad', 'Aisyah', 'Zaid', 'Umar', 'Ali', 'Siti', 'Budi', 'Dewi'];
    
    for (let i = 0; i < count; i++) {
        const id = `${startId}-${i}`;
        const name = `${baseNames[i % baseNames.length]} ${String.fromCharCode(65 + Math.floor(i / 10))}`;
        students.push({
            id,
            nis: `2324${i.toString().padStart(4, '0')}`,
            nisn: `008${Math.random().toString().slice(2, 9)}`,
            name,
            gender: i % 2 === 0 ? 'L' : 'P',
            placeOfBirth: 'Jakarta',
            dateOfBirth: '2008-05-15',
            className,
            classId,
            generation: '2025',
            status: 'active',
            address: 'Jl. Contoh No. ' + i,
            parentName: 'Wali ' + name,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
    }
    return students;
};

// Generate a realistic spread of students across years and classes
export const MOCK_STUDENTS: Student[] = [
    // 2023/2024 students (Source for past tests)
    ...generateStudentsForClass('c-ay-2023-2024-10a', 'X-A', 25, 's23-10a'),
    ...generateStudentsForClass('c-ay-2023-2024-11a', 'XI-A', 28, 's23-11a'),
    ...generateStudentsForClass('c-ay-2023-2024-12a', 'XII-A', 30, 's23-12a'),
    
    // 2024/2025 students (The Most likely Source year for current tests)
    ...generateStudentsForClass('c-ay-2024-2025-10a', 'X-A', 26, 's24-10a'),
    ...generateStudentsForClass('c-ay-2024-2025-10b', 'X-B', 24, 's24-10b'),
    ...generateStudentsForClass('c-ay-2024-2025-11a', 'XI-A', 27, 's24-11a'),
    ...generateStudentsForClass('c-ay-2024-2025-11b', 'XI-B', 25, 's24-11b'),
    ...generateStudentsForClass('c-ay-2024-2025-12a', 'XII-A', 29, 's24-12a'),
    ...generateStudentsForClass('c-ay-2024-2025-12b', 'XII-B', 31, 's24-12b'),

    // 2025/2026 students (Current active year)
    ...generateStudentsForClass('c-ay-2025-2026-10a', 'X-A', 15, 's25-10a'),
];
