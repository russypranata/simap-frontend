import { AcademicYear, Semester } from '../types/academicYear';

// Helper function to generate semester IDs
const generateSemesterId = (yearId: string, code: "1" | "2") => `${yearId}-sem-${code}`;

// Mock Academic Year Data
export const mockAcademicYears: AcademicYear[] = [
    {
        id: 'ay-2025-2026',
        name: '2025/2026',
        startDate: '2025-07-14',
        endDate: '2026-06-30',
        isActive: true,
        semesters: [
            {
                id: generateSemesterId('ay-2025-2026', '1'),
                name: 'Ganjil',
                code: '1',
                startDate: '2025-07-14',
                endDate: '2025-12-20',
                isActive: true,
                createdAt: '2025-06-01T00:00:00Z',
                updatedAt: '2025-07-14T00:00:00Z',
            },
            {
                id: generateSemesterId('ay-2025-2026', '2'),
                name: 'Genap',
                code: '2',
                startDate: '2026-01-06',
                endDate: '2026-06-30',
                isActive: false,
                createdAt: '2025-06-01T00:00:00Z',
                updatedAt: '2025-06-01T00:00:00Z',
            },
        ],
        createdAt: '2025-06-01T00:00:00Z',
        updatedAt: '2025-07-14T00:00:00Z',
    },
    {
        id: 'ay-2024-2025',
        name: '2024/2025',
        startDate: '2024-07-15',
        endDate: '2025-06-28',
        isActive: false,
        semesters: [
            {
                id: generateSemesterId('ay-2024-2025', '1'),
                name: 'Ganjil',
                code: '1',
                startDate: '2024-07-15',
                endDate: '2024-12-21',
                isActive: false,
                createdAt: '2024-06-01T00:00:00Z',
                updatedAt: '2024-06-01T00:00:00Z',
            },
            {
                id: generateSemesterId('ay-2024-2025', '2'),
                name: 'Genap',
                code: '2',
                startDate: '2025-01-06',
                endDate: '2025-06-28',
                isActive: false,
                createdAt: '2024-06-01T00:00:00Z',
                updatedAt: '2025-06-28T00:00:00Z',
            },
        ],
        createdAt: '2024-06-01T00:00:00Z',
        updatedAt: '2025-06-28T00:00:00Z',
    },
    {
        id: 'ay-2023-2024',
        name: '2023/2024',
        startDate: '2023-07-17',
        endDate: '2024-06-29',
        isActive: false,
        semesters: [
            {
                id: generateSemesterId('ay-2023-2024', '1'),
                name: 'Ganjil',
                code: '1',
                startDate: '2023-07-17',
                endDate: '2023-12-22',
                isActive: false,
                createdAt: '2023-06-01T00:00:00Z',
                updatedAt: '2023-06-01T00:00:00Z',
            },
            {
                id: generateSemesterId('ay-2023-2024', '2'),
                name: 'Genap',
                code: '2',
                startDate: '2024-01-08',
                endDate: '2024-06-29',
                isActive: false,
                createdAt: '2023-06-01T00:00:00Z',
                updatedAt: '2024-06-29T00:00:00Z',
            },
        ],
        createdAt: '2023-06-01T00:00:00Z',
        updatedAt: '2024-06-29T00:00:00Z',
    },
];

// Helper to get current active academic year
export const getActiveAcademicYear = (): AcademicYear | undefined => {
    return mockAcademicYears.find(year => year.isActive);
};

// Helper to get active semester from active year
export const getActiveSemester = (): Semester | undefined => {
    const activeYear = getActiveAcademicYear();
    return activeYear?.semesters.find(sem => sem.isActive);
};
