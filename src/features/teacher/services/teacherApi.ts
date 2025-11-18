// Teacher API service with mocked data
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
  mockAttendanceRecords,
  mockTeachingJournals,
  mockGrades,
  mockSchedule,
  mockAnnouncements,
  mockDocuments,
  mockEReports,
} from './mockData';

// Mock API base URL (not actually used since we're mocking)
const API_BASE_URL = '/api';

// Mock axios implementation
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
        return { data: mockAttendanceRecords as T };
      case '/teacher/journals':
        return { data: mockTeachingJournals as T };
      case '/teacher/grades':
        return { data: mockGrades as T };
      case '/teacher/schedule':
        return { data: mockSchedule as T };
      case '/teacher/announcements':
        return { data: mockAnnouncements as T };
      case '/teacher/documents':
        return { data: mockDocuments as T };
      case '/teacher/ereports':
        return { data: mockEReports as T };
      case '/teacher/dashboard':
        const stats: DashboardStats = {
          totalClasses: mockClasses.length,
          todaySchedule: mockSchedule.filter(s => s.day === 'Senin').length,
          teachingJournals: mockTeachingJournals.length,
          attendanceStatus: {
            present: mockAttendanceRecords.filter(a => a.status === 'hadir').length,
            absent: mockAttendanceRecords.filter(a => a.status !== 'hadir').length,
            total: mockAttendanceRecords.length,
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

// Teacher API service
export const teacherApi = {
  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await mockAxios.get<DashboardStats>('/teacher/dashboard');
    return response.data;
  },

  // Profile
  getProfile: async (): Promise<Teacher> => {
    const response = await mockAxios.get<Teacher>('/teacher/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<Teacher>): Promise<{ success: boolean; message: string }> => {
    const response = await mockAxios.put<{ success: boolean; message: string }>('/teacher/profile', data);
    return response.data;
  },

  // Classes
  getClasses: async (): Promise<TeacherClass[]> => {
    const response = await mockAxios.get<TeacherClass[]>('/teacher/classes');
    return response.data;
  },

  // Students
  getStudents: async (classId?: string): Promise<Student[]> => {
    const response = await mockAxios.get<Student[]>('/teacher/students');
    if (classId) {
      // Find class name from ID
      const classData = mockClasses.find(c => c.id === classId);
      if (classData) {
        return response.data.filter(student => student.class === classData.name);
      }
    }
    return response.data;
  },

  // Attendance
  getAttendanceRecords: async (classId?: string, date?: string): Promise<AttendanceRecord[]> => {
    const response = await mockAxios.get<AttendanceRecord[]>('/teacher/attendance');
    let filtered = response.data;
    
    if (classId) {
      // Find class name from ID
      const classData = mockClasses.find(c => c.id === classId);
      if (classData) {
        filtered = filtered.filter(record => record.class === classData.name);
      }
    }
    
    if (date) {
      filtered = filtered.filter(record => record.date === date);
    }
    
    return filtered;
  },

  saveAttendance: async (data: {
    studentId: string;
    class: string;
    date: string;
    status: 'hadir' | 'sakit' | 'izin' | 'tanpa-keterangan';
    subject: string;
    notes?: string;
  }[]): Promise<{ success: boolean; message: string }> => {
    const response = await mockAxios.post<{ success: boolean; message: string }>('/teacher/attendance', data);
    return response.data;
  },

  // Teaching Journals
  getTeachingJournals: async (classId?: string, subject?: string): Promise<TeachingJournal[]> => {
    const response = await mockAxios.get<TeachingJournal[]>('/teacher/journals');
    let filtered = response.data;
    
    if (classId) {
      filtered = filtered.filter(journal => journal.class === classId);
    }
    
    if (subject) {
      filtered = filtered.filter(journal => journal.subject === subject);
    }
    
    return filtered;
  },

  saveTeachingJournal: async (data: Omit<TeachingJournal, 'id'>): Promise<{ success: boolean; message: string }> => {
    const response = await mockAxios.post<{ success: boolean; message: string }>('/teacher/journals', data);
    return response.data;
  },

  updateTeachingJournal: async (id: string, data: Partial<TeachingJournal>): Promise<{ success: boolean; message: string }> => {
    const response = await mockAxios.put<{ success: boolean; message: string }>(`/teacher/journals/${id}`, data);
    return response.data;
  },

  deleteTeachingJournal: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await mockAxios.delete<{ success: boolean; message: string }>(`/teacher/journals/${id}`);
    return response.data;
  },

  // Grades
  getGrades: async (classId?: string, subject?: string, semester?: string): Promise<Grade[]> => {
    const response = await mockAxios.get<Grade[]>('/teacher/grades');
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
  },

  saveGrade: async (data: Omit<Grade, 'id' | 'average' | 'grade' | 'description'>): Promise<{ success: boolean; message: string }> => {
    const response = await mockAxios.post<{ success: boolean; message: string }>('/teacher/grades', data);
    return response.data;
  },

  updateGrade: async (id: string, data: Partial<Grade>): Promise<{ success: boolean; message: string }> => {
    const response = await mockAxios.put<{ success: boolean; message: string }>(`/teacher/grades/${id}`, data);
    return response.data;
  },

  // Schedule
  getSchedule: async (day?: string): Promise<Schedule[]> => {
    const response = await mockAxios.get<Schedule[]>('/teacher/schedule');
    if (day) {
      return response.data.filter(schedule => schedule.day === day);
    }
    return response.data;
  },

  // Announcements
  getAnnouncements: async (type?: string, priority?: string): Promise<Announcement[]> => {
    const response = await mockAxios.get<Announcement[]>('/teacher/announcements');
    let filtered = response.data;
    
    if (type) {
      filtered = filtered.filter(announcement => announcement.type === type);
    }
    
    if (priority) {
      filtered = filtered.filter(announcement => announcement.priority === priority);
    }
    
    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  },

  // Documents
  getDocuments: async (type?: string, status?: string): Promise<Document[]> => {
    const response = await mockAxios.get<Document[]>('/teacher/documents');
    let filtered = response.data;
    
    if (type) {
      filtered = filtered.filter(document => document.type === type);
    }
    
    if (status) {
      filtered = filtered.filter(document => document.status === status);
    }
    
    return filtered.sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime());
  },

  uploadDocument: async (data: {
    name: string;
    type: string;
    description: string;
    file: File;
  }): Promise<{ success: boolean; message: string }> => {
    const response = await mockAxios.post<{ success: boolean; message: string }>('/teacher/documents', data);
    return response.data;
  },

  // E-Reports
  getEReports: async (classId?: string, status?: string): Promise<EReport[]> => {
    const response = await mockAxios.get<EReport[]>('/teacher/ereports');
    let filtered = response.data;
    
    if (classId) {
      filtered = filtered.filter(ereport => ereport.class === classId);
    }
    
    if (status) {
      filtered = filtered.filter(ereport => ereport.status === status);
    }
    
    return filtered.sort((a, b) => b.generatedDate.getTime() - a.generatedDate.getTime());
  },
};