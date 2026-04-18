 
// Service layer for Student Behavior
// Currently using mock data, ready to be replaced with actual API calls

import {
    Student,
    BehaviorRecord,
    mockStudents,
    mockBehaviorRecords,
    mockCurrentTeacher,
} from "../data/mockBehaviorData";

// Re-export types for external use
export type { Student, BehaviorRecord };

// ============================================
// STUDENT SERVICES
// ============================================

export interface GetStudentsParams {
    class?: string;
    search?: string;
    page?: number;
    limit?: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

/**
 * Get students with filters and pagination
 * TODO: Replace with actual API call
 * Endpoint: GET /api/students
 */
export const getStudents = async (
    params: GetStudentsParams = {}
): Promise<PaginatedResponse<Student>> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const { class: className, search, page = 1, limit = 10 } = params;

    // Filter logic
    let filtered = [...mockStudents];

    if (className && className !== "all") {
        filtered = filtered.filter((s) => s.class === className);
    }

    if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(
            (s) =>
                s.name.toLowerCase().includes(searchLower) ||
                s.nis.includes(search)
        );
    }

    // Pagination
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return {
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages,
        },
    };
};

// ============================================
// BEHAVIOR RECORD SERVICES
// ============================================

export interface GetBehaviorRecordsParams {
    academicYear?: string;
    semester?: string;
    class?: string;
    teacherId?: number;
    teacherName?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
}

export interface BehaviorRecordWithStudent extends BehaviorRecord {
    student?: Student;
}

/**
 * Get behavior records with filters and pagination
 * TODO: Replace with actual API call
 * Endpoint: GET /api/behavior-records
 */
export const getBehaviorRecords = async (
    params: GetBehaviorRecordsParams = {}
): Promise<PaginatedResponse<BehaviorRecordWithStudent>> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    const {
        academicYear,
        semester,
        class: className,
        teacherName,
        search,
        dateFrom,
        dateTo,
        page = 1,
        limit = 5,
    } = params;

    // Combine records with student data
    let filtered = mockBehaviorRecords.map((record) => ({
        ...record,
        student: mockStudents.find((s) => s.id === record.studentId),
    }));

    // Apply filters
    if (className && className !== "all") {
        filtered = filtered.filter((r) => r.student?.class === className);
    }

    if (teacherName && teacherName !== "all") {
        filtered = filtered.filter((r) => r.teacherName === teacherName);
    }

    if (academicYear && academicYear !== "all") {
        // Mock: assume all data is for 2025/2026
        if (academicYear !== "2025/2026") {
            filtered = [];
        }
    }

    if (semester && semester !== "all") {
        // Mock: assume all data is for Ganjil
        if (semester !== "Ganjil") {
            filtered = [];
        }
    }

    if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(
            (r) =>
                r.student?.name.toLowerCase().includes(searchLower) ||
                r.student?.nis.includes(search) ||
                r.problem.toLowerCase().includes(searchLower)
        );
    }

    if (dateFrom || dateTo) {
        filtered = filtered.filter((r) => {
            const recordDate = new Date(r.date);
            recordDate.setHours(0, 0, 0, 0);

            if (dateFrom) {
                const fromDate = new Date(dateFrom);
                fromDate.setHours(0, 0, 0, 0);
                if (recordDate < fromDate) return false;
            }

            if (dateTo) {
                const toDate = new Date(dateTo);
                toDate.setHours(0, 0, 0, 0);
                if (recordDate > toDate) return false;
            }

            return true;
        });
    }

    // Pagination
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return {
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages,
        },
    };
};

/**
 * Get single behavior record by ID
 * TODO: Replace with actual API call
 * Endpoint: GET /api/behavior-records/:id
 */
export const getBehaviorRecordById = async (
    id: number
): Promise<BehaviorRecordWithStudent | null> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const record = mockBehaviorRecords.find((r) => r.id === id);
    if (!record) return null;

    return {
        ...record,
        student: mockStudents.find((s) => s.id === record.studentId),
    };
};

export interface CreateBehaviorRecordData {
    studentId: number;
    problem: string;
    followUp: string;
    location: "sekolah" | "asrama";
}

/**
 * Create new behavior record
 * TODO: Replace with actual API call
 * Endpoint: POST /api/behavior-records
 */
export const createBehaviorRecord = async (
    data: CreateBehaviorRecordData
): Promise<BehaviorRecord> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newRecord: BehaviorRecord = {
        id: Date.now(),
        studentId: data.studentId,
        teacherName: mockCurrentTeacher,
        problem: data.problem,
        followUp: data.followUp,
        location: data.location,
        date: new Date().toISOString(),
    };

    // In real implementation, this would be saved to backend
    mockBehaviorRecords.unshift(newRecord);

    return newRecord;
};

/**
 * Update behavior record
 * TODO: Replace with actual API call
 * Endpoint: PUT /api/behavior-records/:id
 */
export const updateBehaviorRecord = async (
    id: number,
    data: Partial<CreateBehaviorRecordData>
): Promise<BehaviorRecord | null> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const index = mockBehaviorRecords.findIndex((r) => r.id === id);
    if (index === -1) return null;

    const updated = {
        ...mockBehaviorRecords[index],
        ...data,
    };

    mockBehaviorRecords[index] = updated;
    return updated;
};

/**
 * Delete behavior record
 * TODO: Replace with actual API call
 * Endpoint: DELETE /api/behavior-records/:id
 */
export const deleteBehaviorRecord = async (id: number): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const index = mockBehaviorRecords.findIndex((r) => r.id === id);
    if (index === -1) return false;

    mockBehaviorRecords.splice(index, 1);
    return true;
};

// ============================================
// AUTH SERVICES
// ============================================

/**
 * Get current logged-in teacher
 * TODO: Replace with actual auth context
 */
export const getCurrentTeacher = (): string => {
    return mockCurrentTeacher;
};

// ============================================
// MASTER DATA SERVICES
// ============================================

/**
 * Get unique classes
 * TODO: Replace with actual API call
 * Endpoint: GET /api/classes
 */
export const getClasses = async (): Promise<string[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return Array.from(new Set(mockStudents.map((s) => s.class))).sort();
};

/**
 * Get unique teachers
 * TODO: Replace with actual API call
 * Endpoint: GET /api/teachers
 */
export const getTeachers = async (): Promise<string[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return Array.from(new Set(mockBehaviorRecords.map((r) => r.teacherName))).sort();
};
