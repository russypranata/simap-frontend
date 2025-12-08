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
  mockGrades,
  mockAnnouncements,
  mockDocuments,
  mockEReports,
} from './mockData';
import { extendedMockSchedule } from './extendedMockSchedule';
import { extendedMockAttendanceRecords, extendedMockTeachingJournals } from './extendedMockData';

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
        // Update mock data
        const newRecords = data as any[];
        newRecords.forEach(newRecord => {
          const existingIndex = extendedMockAttendanceRecords.findIndex(
            r => r.studentId === newRecord.studentId &&
              r.date === newRecord.date &&
              r.subject === newRecord.subject &&
              r.lessonHour === newRecord.lessonHour
          );

          if (existingIndex >= 0) {
            // Update existing
            extendedMockAttendanceRecords[existingIndex] = {
              ...extendedMockAttendanceRecords[existingIndex],
              ...newRecord
            };
          } else {
            // Add new
            extendedMockAttendanceRecords.push({
              id: Math.random().toString(36).substr(2, 9),
              teacher: mockTeacher.name,
              ...newRecord
            });
          }
        });
        return { data: { success: true, message: 'Absensi berhasil disimpan' } as T };
      case '/teacher/attendance/update':
        const updateData = data as AttendanceRecord;
        const updateIndex = extendedMockAttendanceRecords.findIndex(
          r => r.studentId === updateData.studentId &&
            r.date === updateData.date &&
            r.subject === updateData.subject &&
            r.lessonHour === updateData.lessonHour
        );
        if (updateIndex >= 0) {
          extendedMockAttendanceRecords[updateIndex] = { ...extendedMockAttendanceRecords[updateIndex], ...updateData };
          return { data: { success: true, message: 'Data presensi berhasil diperbarui' } as T };
        }
        return { data: { success: false, message: 'Data presensi tidak ditemukan' } as T };
      case '/teacher/attendance/delete':
        const deleteData = data as AttendanceRecord;
        const deleteIndex = extendedMockAttendanceRecords.findIndex(
          r => r.studentId === deleteData.studentId &&
            r.date === deleteData.date &&
            r.subject === deleteData.subject &&
            r.lessonHour === deleteData.lessonHour
        );
        if (deleteIndex >= 0) {
          extendedMockAttendanceRecords.splice(deleteIndex, 1);
          return { data: { success: true, message: 'Data presensi berhasil dihapus' } as T };
        }
        return { data: { success: false, message: 'Data presensi tidak ditemukan' } as T };
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
    academicYear?: string;
    semester?: 'Ganjil' | 'Genap';
  }[]): Promise<{ success: boolean; message: string }> => {
    const response = await mockAxios.post<{ success: boolean; message: string }>('/teacher/attendance', data);
    return response.data;
  },

  updateAttendanceRecord: async (data: AttendanceRecord): Promise<{ success: boolean; message: string }> => {
    const response = await mockAxios.post<{ success: boolean; message: string }>('/teacher/attendance/update', data);
    return response.data;
  },

  deleteAttendanceRecord: async (data: AttendanceRecord): Promise<{ success: boolean; message: string }> => {
    const response = await mockAxios.post<{ success: boolean; message: string }>('/teacher/attendance/delete', data);
    return response.data;
  },

  // Teaching Journals
  getTeachingJournals: async (classId?: string, subject?: string): Promise<TeachingJournal[]> => {
    const response = await mockAxios.get<TeachingJournal[]>('/teacher/journals');
    let journals = response.data;

    // Get all attendance records to calculate dynamic stats
    const attendanceResponse = await mockAxios.get<AttendanceRecord[]>('/teacher/attendance');
    const allAttendance = attendanceResponse.data;

    // Calculate dynamic attendance stats for each journal
    journals = journals.map(journal => {
      const journalAttendance = allAttendance.filter(record =>
        record.class === journal.class &&
        record.date === journal.date &&
        record.subject === journal.subject &&
        record.lessonHour === journal.lessonHour
      );

      if (journalAttendance.length > 0) {
        const present = journalAttendance.filter(r => r.status === 'hadir').length;
        const sick = journalAttendance.filter(r => r.status === 'sakit').length;
        const permit = journalAttendance.filter(r => r.status === 'izin').length;
        const absent = journalAttendance.filter(r => r.status === 'tanpa-keterangan').length;
        const total = journalAttendance.length;

        return {
          ...journal,
          attendance: {
            total,
            present,
            sick,
            permit,
            absent
          }
        };
      }
      return journal;
    });

    if (classId) {
      journals = journals.filter(journal => journal.class === classId);
    }

    if (subject) {
      journals = journals.filter(journal => journal.subject === subject);
    }

    return journals;
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
      // Find class name from ID
      const classData = mockClasses.find(c => c.id === classId);
      if (classData) {
        filtered = filtered.filter(grade => grade.class === classData.name);
      } else {
        // If class ID not found, return empty
        filtered = [];
      }
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

  // Moodle Integration
  fetchMoodleCourses: async (): Promise<{ id: string; fullname: string; shortname: string }[]> => {
    // Mock Moodle courses
    return [
      { id: '101', fullname: 'Matematika XII A (2024/2025)', shortname: 'MATH12A' },
      { id: '102', fullname: 'Fisika XII A (2024/2025)', shortname: 'PHYS12A' },
      { id: '103', fullname: 'Biologi X B (2024/2025)', shortname: 'BIO10B' },
    ];
  },

  fetchMoodleAssignments: async (courseId: string): Promise<{ id: string; name: string; maxScore: number }[]> => {
    // Mock Moodle assignments based on course
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network
    return [
      { id: 'm1', name: 'Quiz 1: Aljabar', maxScore: 100 },
      { id: 'm2', name: 'UTS Online', maxScore: 100 },
      { id: 'm3', name: 'Tugas Proyek', maxScore: 100 },
      { id: 'm4', name: 'UAS Online', maxScore: 100 },
    ];
  },

  syncMoodleGrades: async (config: {
    courseId: string;
    mapping: Record<string, string>; // moodleAssignmentId -> simapColumnName (e.g., 'm1' -> 'assignment_0')
    overwriteManual: boolean;
  }): Promise<{ success: boolean; message: string; syncedCount: number }> => {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing

    // In a real app, this would fetch grades from Moodle and update the backend.
    // Here we just simulate a success response.
    return {
      success: true,
      message: 'Sinkronisasi dengan Moodle berhasil!',
      syncedCount: 25
    };
  },
};
