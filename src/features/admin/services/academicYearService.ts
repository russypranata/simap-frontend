import {
    AcademicYear,
    CreateAcademicYearRequest,
    UpdateAcademicYearRequest,
    AcademicYearStats,
} from '../types/academicYear';
import { mockAcademicYears } from '../data/mockAcademicYearData';
import { apiClient } from '@/lib/api-client';

// ============================================
// CONFIGURATION
// ============================================

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';
const SIMULATED_DELAY_MS = 600;

// Local copy for mock mutations
let localMockData = [...mockAcademicYears];

// ============================================
// HELPER FUNCTIONS
// ============================================

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const generateId = () => `ay-${Date.now()}`;

/**
 * Smart Semester Split Algorithm
 * 
 * Generates 2 semesters with realistic distribution:
 * - Semester 1 (Ganjil): ~48% of academic year
 * - 2-3 weeks semester break
 * - Semester 2 (Genap): ~52% of academic year
 * - Semester 1 ends on Friday
 * - Semester 2 starts on Monday
 */
const generateSemesters = (yearId: string, startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Calculate total duration in days
    const totalDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    // Semester 1: 48% of total (leaving room for break)
    const semester1Days = Math.floor(totalDays * 0.48);
    let semester1End = new Date(start);
    semester1End.setDate(semester1End.getDate() + semester1Days);
    
    // Round to nearest Friday (end of week)
    const semester1EndDay = semester1End.getDay();
    const daysToFriday = (5 - semester1EndDay + 7) % 7;
    if (daysToFriday !== 0 && daysToFriday <= 3) {
        // If Friday is within 3 days ahead, round to it
        semester1End.setDate(semester1End.getDate() + daysToFriday);
    } else if (semester1EndDay > 5) {
        // If Saturday/Sunday, go to previous Friday
        semester1End.setDate(semester1End.getDate() - (semester1EndDay - 5));
    }
    
    // Semester break: 2-3 weeks (14-21 days, average 17)
    const semesterBreakDays = 17;
    let semester2Start = new Date(semester1End);
    semester2Start.setDate(semester2Start.getDate() + semesterBreakDays);
    
    // Round to nearest Monday (start of week)
    const semester2StartDay = semester2Start.getDay();
    if (semester2StartDay === 0) {
        // Sunday -> next Monday
        semester2Start.setDate(semester2Start.getDate() + 1);
    } else if (semester2StartDay > 1 && semester2StartDay <= 3) {
        // Tuesday/Wednesday -> this Monday
        semester2Start.setDate(semester2Start.getDate() - (semester2StartDay - 1));
    } else if (semester2StartDay > 3) {
        // Thursday/Friday/Saturday -> next Monday
        semester2Start.setDate(semester2Start.getDate() + (8 - semester2StartDay));
    }
    
    // Format dates as ISO strings (YYYY-MM-DD)
    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    const now = new Date().toISOString();

    return [
        {
            id: `${yearId}-sem-1`,
            name: 'Ganjil' as const,
            code: '1' as const,
            startDate: formatDate(start),
            endDate: formatDate(semester1End),
            isActive: false,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: `${yearId}-sem-2`,
            name: 'Genap' as const,
            code: '2' as const,
            startDate: formatDate(semester2Start),
            endDate: endDate, // Use original end date
            isActive: false,
            createdAt: now,
            updatedAt: now,
        },
    ];
};

// ============================================
// API SERVICES
// ============================================

/**
 * GET /admin/academic-years
 * Fetch all academic years
 */
export const getAcademicYears = async (): Promise<AcademicYear[]> => {
    if (USE_MOCK_DATA) {
        await delay(SIMULATED_DELAY_MS);
        // Sort by name descending (newest first)
        return [...localMockData].sort((a, b) => b.name.localeCompare(a.name));
    }

    return apiClient.get<AcademicYear[]>('/admin/academic-years');
};

/**
 * GET /admin/academic-years/:id
 * Get single academic year by ID
 */
export const getAcademicYearById = async (id: string): Promise<AcademicYear | null> => {
    if (USE_MOCK_DATA) {
        await delay(SIMULATED_DELAY_MS);
        return localMockData.find(year => year.id === id) || null;
    }

    return apiClient.get<AcademicYear>(`/admin/academic-years/${id}`);
};

/**
 * POST /admin/academic-years
 * Create new academic year
 */
export const createAcademicYear = async (
    data: CreateAcademicYearRequest
): Promise<AcademicYear> => {
    if (USE_MOCK_DATA) {
        await delay(SIMULATED_DELAY_MS);

        const id = generateId();
        const now = new Date().toISOString();

        const newYear: AcademicYear = {
            id,
            name: data.name,
            startDate: data.startDate,
            endDate: data.endDate,
            isActive: false,
            semesters: generateSemesters(id, data.startDate, data.endDate),
            createdAt: now,
            updatedAt: now,
        };

        localMockData.push(newYear);
        console.log('[Mock] Academic year created:', newYear);
        return newYear;
    }

    return apiClient.post<AcademicYear>('/admin/academic-years', data);
};

/**
 * PUT /admin/academic-years/:id
 * Update academic year
 */
export const updateAcademicYear = async (
    id: string,
    data: UpdateAcademicYearRequest
): Promise<AcademicYear> => {
    if (USE_MOCK_DATA) {
        await delay(SIMULATED_DELAY_MS);

        const index = localMockData.findIndex(year => year.id === id);
        if (index === -1) {
            throw new Error('Academic year not found');
        }

        const updated: AcademicYear = {
            ...localMockData[index],
            ...data,
            updatedAt: new Date().toISOString(),
        };

        // Regenerate semesters if dates changed
        if (data.startDate || data.endDate) {
            updated.semesters = generateSemesters(
                id,
                data.startDate || updated.startDate,
                data.endDate || updated.endDate
            );
        }

        localMockData[index] = updated;
        console.log('[Mock] Academic year updated:', updated);
        return updated;
    }

    return apiClient.put<AcademicYear>(`/admin/academic-years/${id}`, data);
};

/**
 * DELETE /admin/academic-years/:id
 * Delete academic year (soft delete)
 */
export const deleteAcademicYear = async (id: string): Promise<void> => {
    if (USE_MOCK_DATA) {
        await delay(SIMULATED_DELAY_MS);

        const index = localMockData.findIndex(year => year.id === id);
        if (index === -1) {
            throw new Error('Academic year not found');
        }

        if (localMockData[index].isActive) {
            throw new Error('Cannot delete active academic year');
        }

        localMockData.splice(index, 1);
        console.log('[Mock] Academic year deleted:', id);
        return;
    }

    return apiClient.delete(`/admin/academic-years/${id}`);
};

/**
 * POST /admin/academic-years/:id/activate
 * Activate academic year (sets as current active year)
 */
export const activateAcademicYear = async (id: string): Promise<AcademicYear> => {
    if (USE_MOCK_DATA) {
        await delay(SIMULATED_DELAY_MS);

        const index = localMockData.findIndex(year => year.id === id);
        if (index === -1) {
            throw new Error('Academic year not found');
        }

        // Deactivate all years and their semesters
        localMockData = localMockData.map(year => ({
            ...year,
            isActive: false,
            semesters: year.semesters.map(sem => ({ ...sem, isActive: false })),
        }));

        // Activate selected year and its first semester
        localMockData[index] = {
            ...localMockData[index],
            isActive: true,
            semesters: localMockData[index].semesters.map((sem, semIndex) => ({
                ...sem,
                isActive: semIndex === 0, // Activate first semester (Ganjil)
            })),
            updatedAt: new Date().toISOString(),
        };

        console.log('[Mock] Academic year activated:', localMockData[index]);
        return localMockData[index];
    }

    return apiClient.post<AcademicYear>(`/admin/academic-years/${id}/activate`, {});
};

/**
 * POST /admin/academic-years/:yearId/semesters/:semesterId/activate
 * Activate specific semester
 */
export const activateSemester = async (
    yearId: string,
    semesterId: string
): Promise<AcademicYear> => {
    if (USE_MOCK_DATA) {
        await delay(SIMULATED_DELAY_MS);

        const yearIndex = localMockData.findIndex(year => year.id === yearId);
        if (yearIndex === -1) {
            throw new Error('Academic year not found');
        }

        if (!localMockData[yearIndex].isActive) {
            throw new Error('Cannot activate semester of inactive academic year');
        }

        // Update semester activation
        localMockData[yearIndex] = {
            ...localMockData[yearIndex],
            semesters: localMockData[yearIndex].semesters.map(sem => ({
                ...sem,
                isActive: sem.id === semesterId,
            })),
            updatedAt: new Date().toISOString(),
        };

        console.log('[Mock] Semester activated:', semesterId);
        return localMockData[yearIndex];
    }

    return apiClient.post<AcademicYear>(
        `/admin/academic-years/${yearId}/semesters/${semesterId}/activate`,
        {}
    );
};

/**
 * GET /admin/academic-years/stats
 * Get academic year statistics
 */
export const getAcademicYearStats = async (): Promise<AcademicYearStats> => {
    if (USE_MOCK_DATA) {
        await delay(SIMULATED_DELAY_MS);

        const activeYear = localMockData.find(year => year.isActive);
        const activeSemester = activeYear?.semesters.find(sem => sem.isActive);

        return {
            totalAcademicYears: localMockData.length,
            activeAcademicYear: activeYear?.name || null,
            activeSemester: activeSemester?.name || null,
        };
    }

    return apiClient.get<AcademicYearStats>('/admin/academic-years/stats');
};

/**
 * GET /admin/academic-years/active
 * Get currently active academic year
 */
export const getActiveAcademicYear = async (): Promise<AcademicYear | null> => {
    if (USE_MOCK_DATA) {
        await delay(SIMULATED_DELAY_MS);
        return localMockData.find(year => year.isActive) || null;
    }

    return apiClient.get<AcademicYear>('/admin/academic-years/active');
};

/**
 * PUT /admin/academic-years/:yearId/semesters/:semesterId
 * Update semester dates
 */
export const updateSemester = async (
    yearId: string,
    semesterId: string,
    startDate: string,
    endDate: string
): Promise<AcademicYear> => {
    if (USE_MOCK_DATA) {
        await delay(SIMULATED_DELAY_MS);

        const yearIndex = localMockData.findIndex(year => year.id === yearId);
        if (yearIndex === -1) {
            throw new Error('Academic year not found');
        }

        const year = localMockData[yearIndex];
        
        // Validate dates are within academic year range
        const semStart = new Date(startDate);
        const semEnd = new Date(endDate);
        const yearStart = new Date(year.startDate);
        const yearEnd = new Date(year.endDate);

        if (semStart < yearStart || semEnd > yearEnd) {
            throw new Error('Semester dates must be within academic year range');
        }

        if (semStart >= semEnd) {
            throw new Error('End date must be after start date');
        }

        // Update semester
        localMockData[yearIndex] = {
            ...year,
            semesters: year.semesters.map(sem =>
                sem.id === semesterId
                    ? { ...sem, startDate, endDate, updatedAt: new Date().toISOString() }
                    : sem
            ),
            updatedAt: new Date().toISOString(),
        };

        console.log('[Mock] Semester updated:', semesterId);
        return localMockData[yearIndex];
    }

    return apiClient.put<AcademicYear>(
        `/admin/academic-years/${yearId}/semesters/${semesterId}`,
        { startDate, endDate }
    );
};

// Export as object for easier imports
export const academicYearService = {
    getAcademicYears,
    getAcademicYearById,
    createAcademicYear,
    updateAcademicYear,
    deleteAcademicYear,
    activateAcademicYear,
    activateSemester,
    updateSemester,
    getAcademicYearStats,
    getActiveAcademicYear,
};

export default academicYearService;
