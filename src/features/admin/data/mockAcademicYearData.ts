import { AcademicYear, Semester } from '../types/academicYear';

// Helper function to generate semester IDs
const generateSemesterId = (yearId: string, code: "1" | "2") => `${yearId}-sem-${code}`;

/**
 * Mock Data untuk Tahun Ajaran (Academic Year)
 * Mengikuti standar Kalender Akademik Indonesia:
 * - Semester Ganjil: Juli - Desember
 * - Semester Genap: Januari - Juni
 *
 * Skenario saat ini:
 * - Tanggal simulasi: Februari 2026
 * - Tahun Ajaran Aktif: 2025/2026
 * - Semester Aktif: Genap
 */
export const mockAcademicYears: AcademicYear[] = [
    {
        id: 'ay-2026-2027',
        name: '2026/2027',
        startDate: '2026-07-13',
        endDate: '2027-06-19',
        isActive: false, // Future year
        semesters: [
            {
                id: generateSemesterId('ay-2026-2027', '1'),
                name: 'Ganjil',
                code: '1',
                startDate: '2026-07-13',
                endDate: '2026-12-18',
                isActive: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: generateSemesterId('ay-2026-2027', '2'),
                name: 'Genap',
                code: '2',
                startDate: '2027-01-04',
                endDate: '2027-06-19',
                isActive: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'ay-2025-2026',
        name: '2025/2026',
        startDate: '2025-07-14', // Senin minggu ke-2/3 Juli
        endDate: '2026-06-20',   // Sabtu minggu ke-3 Juni
        isActive: true, // TAHUN AJARAN SAAT INI (Active)
        semesters: [
            {
                id: generateSemesterId('ay-2025-2026', '1'),
                name: 'Ganjil',
                code: '1',
                startDate: '2025-07-14',
                endDate: '2025-12-19',
                isActive: false, // Sudah lewat
                createdAt: '2025-01-01T00:00:00Z',
                updatedAt: '2025-01-01T00:00:00Z',
            },
            {
                id: generateSemesterId('ay-2025-2026', '2'),
                name: 'Genap',
                code: '2',
                startDate: '2026-01-05',
                endDate: '2026-06-20',
                isActive: true, // SEMESTER SAAT INI (Active)
                createdAt: '2025-01-01T00:00:00Z',
                updatedAt: '2025-01-01T00:00:00Z',
            },
        ],
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
    },
    {
        id: 'ay-2024-2025',
        name: '2024/2025',
        startDate: '2024-07-15',
        endDate: '2025-06-21',
        isActive: false, // Sudah lewat (Past)
        semesters: [
            {
                id: generateSemesterId('ay-2024-2025', '1'),
                name: 'Ganjil',
                code: '1',
                startDate: '2024-07-15',
                endDate: '2024-12-20',
                isActive: false,
                createdAt: '2024-06-01T00:00:00Z',
                updatedAt: '2024-06-01T00:00:00Z',
            },
            {
                id: generateSemesterId('ay-2024-2025', '2'),
                name: 'Genap',
                code: '2',
                startDate: '2025-01-06',
                endDate: '2025-06-21',
                isActive: false,
                createdAt: '2024-06-01T00:00:00Z',
                updatedAt: '2025-01-06T00:00:00Z',
            },
        ],
        createdAt: '2024-06-01T00:00:00Z',
        updatedAt: '2025-01-06T00:00:00Z',
    },
    {
        id: 'ay-2023-2024',
        name: '2023/2024',
        startDate: '2023-07-17',
        endDate: '2024-06-22',
        isActive: false, // Sudah lewat (Past)
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
                endDate: '2024-06-22',
                isActive: false,
                createdAt: '2023-06-01T00:00:00Z',
                updatedAt: '2023-06-01T00:00:00Z',
            },
        ],
        createdAt: '2023-06-01T00:00:00Z',
        updatedAt: '2024-06-22T00:00:00Z',
    },
    {
        id: 'ay-2022-2023',
        name: '2022/2023',
        startDate: '2022-07-18',
        endDate: '2023-06-24',
        isActive: false, // Arsip lama
        semesters: [
            {
                id: generateSemesterId('ay-2022-2023', '1'),
                name: 'Ganjil',
                code: '1',
                startDate: '2022-07-18',
                endDate: '2022-12-23',
                isActive: false,
                createdAt: '2022-06-01T00:00:00Z',
                updatedAt: '2022-06-01T00:00:00Z',
            },
            {
                id: generateSemesterId('ay-2022-2023', '2'),
                name: 'Genap',
                code: '2',
                startDate: '2023-01-09',
                endDate: '2023-06-24',
                isActive: false,
                createdAt: '2022-06-01T00:00:00Z',
                updatedAt: '2022-06-01T00:00:00Z',
            },
        ],
        createdAt: '2022-06-01T00:00:00Z',
        updatedAt: '2023-06-24T00:00:00Z',
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
