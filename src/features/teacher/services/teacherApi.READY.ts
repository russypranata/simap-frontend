// Teacher API service - READY FOR REAL API
import axios from 'axios';
import {
    Teacher,
    TeacherClass,
    Student,
    AttendanceRecord,
    TeachingJournal,
    Grade,
    Schedule,
    Announcement,
    Document,
    EReport,
    DashboardStats,
} from '../types/teacher';
import {
    mockTeacher,
    mockClasses,
    mockStudents,
    mockGrades,
    mockAnnouncements,
    mockDocuments,
    mockEReports,
} from './mockData';
import { extendedMockSchedule } from './extendedMockSchedule';
import { extendedMockAttendanceRecords, extendedMockTeachingJournals } from './extendedMockData';

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

// Axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor for authentication
apiClient.interceptors.request.use(
    (config) => {
        // Add auth token if available
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized - redirect to login
            console.error('Unauthorized access - redirecting to login');
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Mock axios implementation (for development)
const mockAxios = {
    get: async <T = any>(url: string): Promise<{ data: T }> => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));

        switch (url) {
            case '/teacher/profile':
                return { data: mockTeacher as T };
            case '/teacher/classes':
                return { data: mockClasses as T };
            case '/teacher/students':
                return { data: mockStudents as T };
            case '/teacher/attendance':
                return { data: extendedMockAttendanceRecords as T };
            case '/teacher/journals':
                return { data: extendedMockTeachingJournals as T };
            case '/teacher/grades':
                return { data: mockGrades as T };
            case '/teacher/schedule':
                return { data: extendedMockSchedule as T };
            case '/teacher/announcements':
                return { data: mockAnnouncements as T };
            case '/teacher/documents':
                return { data: mockDocuments as T };
            case '/teacher/ereports':
                return { data: mockEReports as T };
            case '/teacher/dashboard':
                const stats: DashboardStats = {
                    totalClasses: mockClasses.length,
                    todaySchedule: extendedMockSchedule.filter(s => s.day === 'Senin').length,
                    teachingJournals: extendedMockTeachingJournals.length,
                    attendanceStatus: {
                        present: extendedMockAttendanceRecords.filter(a => a.status === 'hadir').length,
                        absent: extendedMockAttendanceRecords.filter(a => a.status !== 'hadir').length,
                        total: extendedMockAttendanceRecords.length,
                    },
                    documentsSent: mockDocuments.filter(d => d.status === 'approved').length,
                    latestAnnouncements: mockAnnouncements.filter(a =>
                        new Date().getTime() - a.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000
                    ).length,
                };
                return { data: stats as T };
            default:
                throw new Error(`API endpoint not found: ${url}`);
        }
    },

    post: async <T = any>(url: string, data: any): Promise<{ data: T }> => {
        await new Promise(resolve => setTimeout(resolve, 500));

        switch (url) {
            case '/teacher/attendance':
                return { data: { success: true, message: 'Absensi berhasil disimpan' } as T };
            case '/teacher/journals':
                return { data: { success: true, message: 'Jurnal mengajar berhasil disimpan' } as T };
            case '/teacher/grades':
                return { data: { success: true, message: 'Nilai berhasil disimpan' } as T };
            case '/teacher/documents':
                return { data: { success: true, message: 'Dokumen berhasil diupload' } as T };
            default:
                throw new Error(`API endpoint not found: ${url}`);
        }
    },

    put: async <T = any>(url: string, data: any): Promise<{ data: T }> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return { data: { success: true, message: 'Data berhasil diperbarui' } as T };
    },

    delete: async <T = any>(url: string): Promise<{ data: T }> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return { data: { success: true, message: 'Data berhasil dihapus' } as T };
    },
};

// Helper function to choose between mock and real API
const getApiClient = () => (USE_MOCK ? mockAxios : apiClient);

// Teacher API service
export const teacherApi = {
    // Dashboard
    getDashboardStats: async (): Promise<DashboardStats> => {
        const client = getApiClient();
        const response = await client.get<DashboardStats>('/teacher/dashboard');
        return response.data;
    },

    // Profile
    getProfile: async (): Promise<Teacher> => {
        const client = getApiClient();
        const response = await client.get<Teacher>('/teacher/profile');
        return response.data;
    },

    updateProfile: async (data: Partial<Teacher>): Promise<{ success: boolean; message: string }> => {
        const client = getApiClient();
        const response = await client.put<{ success: boolean; message: string }>('/teacher/profile', data);
        return response.data;
    },

    // Classes
    getClasses: async (): Promise<TeacherClass[]> => {
        const client = getApiClient();
        const response = await client.get<TeacherClass[]>('/teacher/classes');
        return response.data;
    },

    // Students
    getStudents: async (classId?: string): Promise<Student[]> => {
        const client = getApiClient();

        if (USE_MOCK) {
            const response = await client.get<Student[]>('/teacher/students');
            if (classId) {
                const classData = mockClasses.find(c => c.id === classId);
                if (classData) {
                    return response.data.filter(student => student.class === classData.name);
                }
            }
            return response.data;
        } else {
            // Real API call with query params
            const params = classId ? { classId } : {};
            const response = await apiClient.get<{ data: Student[] }>('/teacher/students', { params });
            return response.data.data;
        }
    },

    // Attendance
    getAttendanceRecords: async (classId?: string, date?: string): Promise<AttendanceRecord[]> => {
        const client = getApiClient();

        if (USE_MOCK) {
            const response = await client.get<AttendanceRecord[]>('/teacher/attendance');
            let filtered = response.data;

            if (classId) {
                const classData = mockClasses.find(c => c.id === classId);
                if (classData) {
                    filtered = filtered.filter(record => record.class === classData.name);
                }
            }

            if (date) {
                filtered = filtered.filter(record => record.date === date);
            }

            return filtered;
        } else {
            // Real API call with query params
            const params: any = {};
            if (classId) params.classId = classId;
            if (date) params.date = date;

            const response = await apiClient.get<{ data: AttendanceRecord[] }>('/teacher/attendance', { params });
            return response.data.data;
        }
    },

    saveAttendance: async (data: {
        studentId: string;
        class: string;
        date: string;
        status: 'hadir' | 'sakit' | 'izin' | 'tanpa-keterangan';
        subject: string;
        notes?: string;
    }[]): Promise<{ success: boolean; message: string }> => {
        const client = getApiClient();

        if (USE_MOCK) {
            const response = await client.post<{ success: boolean; message: string }>('/teacher/attendance', data);
            return response.data;
        } else {
            const response = await apiClient.post<{ success: boolean; message: string; data?: any }>('/teacher/attendance', { records: data });
            return {
                success: response.data.success,
                message: response.data.message,
            };
        }
    },

    // Teaching Journals
    getTeachingJournals: async (classId?: string, subject?: string): Promise<TeachingJournal[]> => {
        const client = getApiClient();

        if (USE_MOCK) {
            const response = await client.get<TeachingJournal[]>('/teacher/journals');
            let filtered = response.data;

            if (classId) {
                filtered = filtered.filter(journal => journal.class === classId);
            }

            if (subject) {
                filtered = filtered.filter(journal => journal.subject === subject);
            }

            return filtered;
        } else {
            const params: any = {};
            if (classId) params.classId = classId;
            if (subject) params.subject = subject;

            const response = await apiClient.get<{ data: TeachingJournal[] }>('/teacher/journals', { params });
            return response.data.data;
        }
    },

    saveTeachingJournal: async (data: Omit<TeachingJournal, 'id'>): Promise<{ success: boolean; message: string }> => {
        const client = getApiClient();

        if (USE_MOCK) {
            const response = await client.post<{ success: boolean; message: string }>('/teacher/journals', data);
            return response.data;
        } else {
            const response = await apiClient.post<{ success: boolean; message: string; data?: any }>('/teacher/journals', data);
            return {
                success: response.data.success,
                message: response.data.message,
            };
        }
    },

    updateTeachingJournal: async (id: string, data: Partial<TeachingJournal>): Promise<{ success: boolean; message: string }> => {
        const client = getApiClient();

        if (USE_MOCK) {
            const response = await client.put<{ success: boolean; message: string }>(`/teacher/journals/${id}`, data);
            return response.data;
        } else {
            const response = await apiClient.put<{ success: boolean; message: string; data?: any }>(`/teacher/journals/${id}`, data);
            return {
                success: response.data.success,
                message: response.data.message,
            };
        }
    },

    deleteTeachingJournal: async (id: string): Promise<{ success: boolean; message: string }> => {
        const client = getApiClient();

        if (USE_MOCK) {
            const response = await client.delete<{ success: boolean; message: string }>(`/teacher/journals/${id}`);
            return response.data;
        } else {
            const response = await apiClient.delete<{ success: boolean; message: string; data?: any }>(`/teacher/journals/${id}`);
            return {
                success: response.data.success,
                message: response.data.message,
            };
        }
    },

    // Grades
    getGrades: async (classId?: string, subject?: string, semester?: string): Promise<Grade[]> => {
        const client = getApiClient();

        if (USE_MOCK) {
            const response = await client.get<Grade[]>('/teacher/grades');
            let filtered = response.data;

            if (classId) {
                filtered = filtered.filter(grade => grade.class === classId);
            }

            if (subject) {
                filtered = filtered.filter(grade => grade.subject === subject);
            }

            if (semester) {
                filtered = filtered.filter(grade => grade.semester === semester);
            }

            return filtered;
        } else {
            const params: any = {};
            if (classId) params.classId = classId;
            if (subject) params.subject = subject;
            if (semester) params.semester = semester;

            const response = await apiClient.get<{ data: Grade[] }>('/teacher/grades', { params });
            return response.data.data;
        }
    },

    saveGrade: async (data: Omit<Grade, 'id' | 'average' | 'grade' | 'description'>): Promise<{ success: boolean; message: string }> => {
        const client = getApiClient();

        if (USE_MOCK) {
            const response = await client.post<{ success: boolean; message: string }>('/teacher/grades', data);
            return response.data;
        } else {
            const response = await apiClient.post<{ success: boolean; message: string; data?: any }>('/teacher/grades', data);
            return {
                success: response.data.success,
                message: response.data.message,
            };
        }
    },

    updateGrade: async (id: string, data: Partial<Grade>): Promise<{ success: boolean; message: string }> => {
        const client = getApiClient();

        if (USE_MOCK) {
            const response = await client.put<{ success: boolean; message: string }>(`/teacher/grades/${id}`, data);
            return response.data;
        } else {
            const response = await apiClient.put<{ success: boolean; message: string; data?: any }>(`/teacher/grades/${id}`, data);
            return {
                success: response.data.success,
                message: response.data.message,
            };
        }
    },

    // Schedule - READY FOR REAL API
    getSchedule: async (day?: string): Promise<Schedule[]> => {
        const client = getApiClient();

        if (USE_MOCK) {
            const response = await client.get<Schedule[]>('/teacher/schedule');
            if (day) {
                return response.data.filter(schedule => schedule.day === day);
            }
            return response.data;
        } else {
            // Real API call with query params
            const params = day ? { day } : {};
            const response = await apiClient.get<{ data: Schedule[] }>('/teacher/schedule', { params });

            // Validate schedule data format
            const schedules = response.data.data;
            schedules.forEach((schedule, index) => {
                if (!validateScheduleFormat(schedule)) {
                    console.warn(`Invalid schedule format at index ${index}:`, schedule);
                }
            });

            return schedules;
        }
    },

    // Announcements
    getAnnouncements: async (type?: string, priority?: string): Promise<Announcement[]> => {
        const client = getApiClient();

        if (USE_MOCK) {
            const response = await client.get<Announcement[]>('/teacher/announcements');
            let filtered = response.data;

            if (type) {
                filtered = filtered.filter(announcement => announcement.type === type);
            }

            if (priority) {
                filtered = filtered.filter(announcement => announcement.priority === priority);
            }

            return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        } else {
            const params: any = {};
            if (type) params.type = type;
            if (priority) params.priority = priority;

            const response = await apiClient.get<{ data: Announcement[] }>('/teacher/announcements', { params });
            return response.data.data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        }
    },

    // Documents
    getDocuments: async (type?: string, status?: string): Promise<Document[]> => {
        const client = getApiClient();

        if (USE_MOCK) {
            const response = await client.get<Document[]>('/teacher/documents');
            let filtered = response.data;

            if (type) {
                filtered = filtered.filter(document => document.type === type);
            }

            if (status) {
                filtered = filtered.filter(document => document.status === status);
            }

            return filtered.sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime());
        } else {
            const params: any = {};
            if (type) params.type = type;
            if (status) params.status = status;

            const response = await apiClient.get<{ data: Document[] }>('/teacher/documents', { params });
            return response.data.data.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
        }
    },

    uploadDocument: async (data: {
        name: string;
        type: string;
        description: string;
        file: File;
    }): Promise<{ success: boolean; message: string }> => {
        const client = getApiClient();

        if (USE_MOCK) {
            const response = await client.post<{ success: boolean; message: string }>('/teacher/documents', data);
            return response.data;
        } else {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('type', data.type);
            formData.append('description', data.description);
            formData.append('file', data.file);

            const response = await apiClient.post<{ success: boolean; message: string; data?: any }>('/teacher/documents', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return {
                success: response.data.success,
                message: response.data.message,
            };
        }
    },

    // E-Reports
    getEReports: async (classId?: string, status?: string): Promise<EReport[]> => {
        const client = getApiClient();

        if (USE_MOCK) {
            const response = await client.get<EReport[]>('/teacher/ereports');
            let filtered = response.data;

            if (classId) {
                filtered = filtered.filter(ereport => ereport.class === classId);
            }

            if (status) {
                filtered = filtered.filter(ereport => ereport.status === status);
            }

            return filtered.sort((a, b) => b.generatedDate.getTime() - a.generatedDate.getTime());
        } else {
            const params: any = {};
            if (classId) params.classId = classId;
            if (status) params.status = status;

            const response = await apiClient.get<{ data: EReport[] }>('/teacher/ereports', { params });
            return response.data.data.sort((a, b) => new Date(b.generatedDate).getTime() - new Date(a.generatedDate).getTime());
        }
    },
};

// Helper function to validate schedule format
function validateScheduleFormat(schedule: Schedule): boolean {
    // 1. Validate time format
    const timeRegex = /^\d{2}:\d{2} - \d{2}:\d{2}$/;
    if (!timeRegex.test(schedule.time)) {
        console.error(`Invalid time format: ${schedule.time}. Expected format: "HH:MM - HH:MM"`);
        return false;
    }

    // 2. Validate day
    const validDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    if (!validDays.includes(schedule.day)) {
        console.error(`Invalid day: ${schedule.day}. Must be one of: ${validDays.join(', ')}`);
        return false;
    }

    // 3. Validate time mapping
    const [startTime] = schedule.time.split(' - ');
    const validTimes = ['07:00', '07:45', '08:30', '09:15', '10:15', '11:00', '11:45', '13:00', '13:45'];

    if (!validTimes.includes(startTime)) {
        console.warn(`Start time ${startTime} not in standard time mapping. This may cause issues with lesson hour grouping.`);
    }

    return true;
}
