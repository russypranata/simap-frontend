// Custom hook for teacher data management
import { useState, useEffect } from 'react';
import { useRole } from '@/app/context/RoleContext';
import { teacherApi } from '../services/teacherApi';
import {
  DashboardStats,
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
} from '../types/teacher';

export const useTeacherData = () => {
  const { role, isHomeroomTeacher } = useRole();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dashboard data
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  
  // Profile data
  const [profile, setProfile] = useState<Teacher | null>(null);
  
  // Classes data
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  
  // Students data
  const [students, setStudents] = useState<Student[]>([]);
  
  // Attendance data
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  
  // Teaching journals data
  const [teachingJournals, setTeachingJournals] = useState<TeachingJournal[]>([]);
  
  // Grades data
  const [grades, setGrades] = useState<Grade[]>([]);
  
  // Schedule data
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  
  // Announcements data
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  
  // Documents data
  const [documents, setDocuments] = useState<Document[]>([]);
  
  // E-Reports data
  const [ereports, setEreports] = useState<EReport[]>([]);

  // Generic error handler
  const handleError = (err: any, defaultMessage: string) => {
    const errorMessage = err?.response?.data?.message || err?.message || defaultMessage;
    setError(errorMessage);
    console.error(defaultMessage, err);
  };

  // Clear error
  const clearError = () => setError(null);

  // Dashboard
  const fetchDashboardStats = async () => {
    if (role !== 'guru') return;
    
    setLoading(true);
    try {
      const stats = await teacherApi.getDashboardStats();
      setDashboardStats(stats);
      setError(null);
    } catch (err) {
      handleError(err, 'Gagal memuat data dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Profile
  const fetchProfile = async () => {
    if (role !== 'guru') return;
    
    setLoading(true);
    try {
      const profileData = await teacherApi.getProfile();
      setProfile(profileData);
      setError(null);
    } catch (err) {
      handleError(err, 'Gagal memuat data profil');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<Teacher>) => {
    if (role !== 'guru') return;
    
    setLoading(true);
    try {
      const result = await teacherApi.updateProfile(data);
      if (result.success) {
        await fetchProfile(); // Refresh profile data
      }
      setError(null);
      return result;
    } catch (err) {
      handleError(err, 'Gagal memperbarui profil');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Classes
  const fetchClasses = async () => {
    if (role !== 'guru') return;
    
    setLoading(true);
    try {
      const classesData = await teacherApi.getClasses();
      setClasses(classesData);
      setError(null);
    } catch (err) {
      handleError(err, 'Gagal memuat data kelas');
    } finally {
      setLoading(false);
    }
  };

  // Students
  const fetchStudents = async (classId?: string) => {
    if (role !== 'guru') return;
    
    setLoading(true);
    try {
      const studentsData = await teacherApi.getStudents(classId);
      setStudents(studentsData);
      setError(null);
    } catch (err) {
      handleError(err, 'Gagal memuat data siswa');
    } finally {
      setLoading(false);
    }
  };

  // Attendance
  const fetchAttendanceRecords = async (classId?: string, date?: string) => {
    if (role !== 'guru') return;
    
    setLoading(true);
    try {
      const records = await teacherApi.getAttendanceRecords(classId, date);
      setAttendanceRecords(records);
      setError(null);
    } catch (err) {
      handleError(err, 'Gagal memuat data absensi');
    } finally {
      setLoading(false);
    }
  };

  const saveAttendance = async (data: {
    studentId: string;
    class: string;
    date: string;
    status: 'hadir' | 'sakit' | 'izin' | 'tanpa-keterangan';
    subject: string;
    notes?: string;
  }[]) => {
    if (role !== 'guru') return;
    
    setLoading(true);
    try {
      const result = await teacherApi.saveAttendance(data);
      await fetchAttendanceRecords(); // Refresh attendance data
      setError(null);
      return result;
    } catch (err) {
      handleError(err, 'Gagal menyimpan data absensi');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Teaching Journals
  const fetchTeachingJournals = async (classId?: string, subject?: string) => {
    if (role !== 'guru') return;
    
    setLoading(true);
    try {
      const journals = await teacherApi.getTeachingJournals(classId, subject);
      setTeachingJournals(journals);
      setError(null);
    } catch (err) {
      handleError(err, 'Gagal memuat jurnal mengajar');
    } finally {
      setLoading(false);
    }
  };

  const saveTeachingJournal = async (data: Omit<TeachingJournal, 'id'>) => {
    if (role !== 'guru') return;
    
    setLoading(true);
    try {
      const result = await teacherApi.saveTeachingJournal(data);
      await fetchTeachingJournals(); // Refresh journals data
      setError(null);
      return result;
    } catch (err) {
      handleError(err, 'Gagal menyimpan jurnal mengajar');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTeachingJournal = async (id: string, data: Partial<TeachingJournal>) => {
    if (role !== 'guru') return;
    
    setLoading(true);
    try {
      const result = await teacherApi.updateTeachingJournal(id, data);
      await fetchTeachingJournals(); // Refresh journals data
      setError(null);
      return result;
    } catch (err) {
      handleError(err, 'Gagal memperbarui jurnal mengajar');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTeachingJournal = async (id: string) => {
    if (role !== 'guru') return;
    
    setLoading(true);
    try {
      const result = await teacherApi.deleteTeachingJournal(id);
      await fetchTeachingJournals(); // Refresh journals data
      setError(null);
      return result;
    } catch (err) {
      handleError(err, 'Gagal menghapus jurnal mengajar');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Grades
  const fetchGrades = async (classId?: string, subject?: string, semester?: string) => {
    if (role !== 'guru') return;
    
    setLoading(true);
    try {
      const gradesData = await teacherApi.getGrades(classId, subject, semester);
      setGrades(gradesData);
      setError(null);
    } catch (err) {
      handleError(err, 'Gagal memuat data nilai');
    } finally {
      setLoading(false);
    }
  };

  const saveGrade = async (data: Omit<Grade, 'id' | 'average' | 'grade' | 'description'>) => {
    if (role !== 'guru') return;
    
    setLoading(true);
    try {
      const result = await teacherApi.saveGrade(data);
      await fetchGrades(); // Refresh grades data
      setError(null);
      return result;
    } catch (err) {
      handleError(err, 'Gagal menyimpan data nilai');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Schedule
  const fetchSchedule = async (day?: string) => {
    if (role !== 'guru') return;
    
    setLoading(true);
    try {
      const scheduleData = await teacherApi.getSchedule(day);
      setSchedule(scheduleData);
      setError(null);
    } catch (err) {
      handleError(err, 'Gagal memuat jadwal mengajar');
    } finally {
      setLoading(false);
    }
  };

  // Announcements
  const fetchAnnouncements = async (type?: string, priority?: string) => {
    if (role !== 'guru') return;
    
    setLoading(true);
    try {
      const announcementsData = await teacherApi.getAnnouncements(type, priority);
      setAnnouncements(announcementsData);
      setError(null);
    } catch (err) {
      handleError(err, 'Gagal memuat pengumuman');
    } finally {
      setLoading(false);
    }
  };

  // Documents
  const fetchDocuments = async (type?: string, status?: string) => {
    if (role !== 'guru') return;
    
    setLoading(true);
    try {
      const documentsData = await teacherApi.getDocuments(type, status);
      setDocuments(documentsData);
      setError(null);
    } catch (err) {
      handleError(err, 'Gagal memuat dokumen');
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (data: {
    name: string;
    type: string;
    description: string;
    file: File;
  }) => {
    if (role !== 'guru') return;
    
    setLoading(true);
    try {
      const result = await teacherApi.uploadDocument(data);
      await fetchDocuments(); // Refresh documents data
      setError(null);
      return result;
    } catch (err) {
      handleError(err, 'Gagal mengupload dokumen');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // E-Reports
  const fetchEReports = async (classId?: string, status?: string) => {
    if (role !== 'guru') return;
    
    setLoading(true);
    try {
      const ereportsData = await teacherApi.getEReports(classId, status);
      setEreports(ereportsData);
      setError(null);
    } catch (err) {
      handleError(err, 'Gagal memuat data E-Rapor');
    } finally {
      setLoading(false);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    if (role === 'guru') {
      fetchDashboardStats();
      fetchProfile();
      fetchClasses();
      fetchStudents();
      fetchSchedule();
      fetchAnnouncements();
      fetchDocuments();
      fetchEReports();
    }
  }, [role]);

  return {
    // State
    loading,
    error,
    dashboardStats,
    profile,
    classes,
    students,
    attendanceRecords,
    teachingJournals,
    grades,
    schedule,
    announcements,
    documents,
    ereports,
    
    // Actions
    clearError,
    fetchDashboardStats,
    fetchProfile,
    updateProfile,
    fetchClasses,
    fetchStudents,
    fetchAttendanceRecords,
    saveAttendance,
    fetchTeachingJournals,
    saveTeachingJournal,
    updateTeachingJournal,
    deleteTeachingJournal,
    fetchGrades,
    saveGrade,
    fetchSchedule,
    fetchAnnouncements,
    fetchDocuments,
    uploadDocument,
    fetchEReports,
  };
};