 
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
  Document,
  EReport,
} from '../types/teacher';

// Real API services
import { getTeacherProfile, updateTeacherProfile as apiUpdateProfile } from '../services/teacherProfileService';
import { getTeacherDashboard } from '../services/teacherDashboardService';
import { getTeacherClasses, getClassStudents } from '../services/teacherClassService';
import { getTeacherSchedule } from '../services/teacherScheduleService';
import { getTeacherAttendance, saveTeacherAttendance } from '../services/teacherAttendanceService';
import { getTeacherGrades, saveTeacherGrades, getTeacherClassSubjects } from '../services/teacherGradeService';
import { getAuthHeaders } from '../services/teacherApiClient';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export const useTeacherData = () => {
  const { role, isHomeroomTeacher: _isHomeroomTeacher } = useRole();
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
  
  // Documents data
  const [documents, setDocuments] = useState<Document[]>([]);
  
  // E-Reports data
  const [ereports, setEreports] = useState<EReport[]>([]);

  // Generic error handler
  const handleError = (err: unknown, defaultMessage: string) => {
    const error = err as { response?: { data?: { message?: string } }; message?: string };
    const errorMessage = error?.response?.data?.message || error?.message || defaultMessage;
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
      if (USE_MOCK) {
        const stats = await teacherApi.getDashboardStats();
        setDashboardStats(stats);
      } else {
        const data = await getTeacherDashboard();
        setDashboardStats({
          totalClasses:   data.stats.totalClasses,
          todaySchedule:  data.stats.todaySchedule,
          teachingJournals: 0,
          attendanceStatus: {
            present: data.stats.attendanceToday.present,
            absent:  data.stats.attendanceToday.absent,
            total:   data.stats.attendanceToday.total,
          },
          documentsSent:       0,
          latestAnnouncements: 0,
        });
      }
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
      if (USE_MOCK) {
        const profileData = await teacherApi.getProfile();
        setProfile(profileData);
      } else {
        const data = await getTeacherProfile();
        setProfile({
          id:               String(data.id),
          name:             data.name,
          nip:              data.nip ?? '',
          email:            data.email,
          phone:            data.phone ?? '',
          role:             'guru',
          isHomeroomTeacher: false,
          subjects:         [],
          joinDate:         data.joinDate ?? '',
          education:        data.lastEducation ?? '',
          certification:    '',
          profilePicture:   data.profilePicture ?? undefined,
        } as Teacher);
      }
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
      if (USE_MOCK) {
        const result = await teacherApi.updateProfile(data);
        if (result.success) await fetchProfile();
        setError(null);
        return result;
      } else {
        await apiUpdateProfile({ name: data.name, email: data.email, phone: data.phone });
        await fetchProfile();
        setError(null);
        return { success: true, message: 'Profil berhasil diperbarui.' };
      }
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
      if (USE_MOCK) {
        const classesData = await teacherApi.getClasses();
        setClasses(classesData);
      } else {
        const data = await getTeacherClasses();
        setClasses(data.map(c => ({
          id:              c.id,
          name:            c.name,
          grade:           c.name.split(' ')[0] ?? '',
          homeroomTeacher: c.homeroomTeacher,
          studentCount:    c.studentCount,
          schedule:        [],
          subjects:        c.subjects.map(s => ({ id: s.id ?? s.name, name: s.name })),
        } as TeacherClass)));
      }
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
      if (USE_MOCK) {
        const studentsData = await teacherApi.getStudents(classId);
        setStudents(studentsData);
      } else {
        if (classId) {
          const data = await getClassStudents(classId);
          // Cari nama kelas dari classes state
          const className = classes.find(c => c.id === classId)?.name ?? '';
          setStudents(data.map(s => ({
            id:          s.id,
            nis:         s.nis,
            name:        s.name,
            class:       className,
            gender:      (s.gender === 'L' || s.gender === 'P') ? s.gender : 'L',
            birthDate:   s.birthDate ?? '',
            address:     s.address,
            phone:       s.phone,
            parentsName: '',
            parentsPhone: '',
          })));
        } else {
          setStudents([]);
        }
      }
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
      if (USE_MOCK) {
        const records = await teacherApi.getAttendanceRecords(classId, date);
        setAttendanceRecords(records);
      } else {
        const data = await getTeacherAttendance({ class_id: classId, date });
        setAttendanceRecords(data.map(a => ({
          id:          a.id,
          studentId:   a.studentId,
          studentName: a.studentName,
          class:       a.class,
          date:        a.date,
          status:      a.status,
          subject:     a.subject,
          teacher:     '',
          lessonHour:  '',
          notes:       a.notes ?? undefined,
          academicYear: a.academicYear,
          semester:    (a.semester === 'Genap' ? 'Genap' : 'Ganjil') as 'Ganjil' | 'Genap',
        })));
      }
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
    lessonHour?: string;
    classSubjectId?: string;
    notes?: string;
  }[]) => {
    if (role !== 'guru') return;
    
    setLoading(true);
    try {
      if (USE_MOCK) {
        const result = await teacherApi.saveAttendance(data as Parameters<typeof teacherApi.saveAttendance>[0]);
        await fetchAttendanceRecords();
        setError(null);
        return result;
      } else {
        const records = data.map(d => ({
          student_id:       parseInt(d.studentId),
          class_subject_id: parseInt(d.classSubjectId ?? '0'),
          date:             d.date,
          status:           d.status,
          notes:            d.notes,
        }));
        await saveTeacherAttendance(records);
        await fetchAttendanceRecords();
        setError(null);
        return { success: true, message: 'Presensi berhasil disimpan.' };
      }
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
      if (USE_MOCK) {
        const gradesData = await teacherApi.getGrades(classId, subject, semester);
        setGrades(gradesData);
      } else {
        // subject param is a subject name — resolve to subject_id via class-subjects lookup
        let subjectId: string | undefined;
        if (subject && classId) {
          try {
            const classSubjects = await getTeacherClassSubjects();
            const match = classSubjects.find(
              cs => cs.classId === classId && cs.subject === subject
            );
            subjectId = match?.subjectId;
          } catch { /* ignore, fetch without subject filter */ }
        }

        const data = await getTeacherGrades({ class_id: classId, subject_id: subjectId });
        setGrades(data.map(g => ({
          id:          g.id,
          studentId:   g.studentId,
          studentName: g.studentName,
          class:       g.class,
          subject:     g.subject,
          semester:    'Ganjil' as const,
          academicYear: '',
          assignments: g.assignments,
          midTerm:     g.midTerm,
          finalExam:   g.finalExam,
          average:     g.average,
          grade:       g.grade,
          description: g.description,
        })));
      }
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
      if (USE_MOCK) {
        const result = await teacherApi.saveGrade(data);
        await fetchGrades();
        setError(null);
        return result;
      } else {
        // Real API: simpan via assessment bulk
        // Caller harus pass classSubjectId dan semesterId via data
        const extData = data as Grade & { classSubjectId?: string; semesterId?: string; assessmentType?: string; title?: string };
        await saveTeacherGrades({
          class_subject_id: parseInt(extData.classSubjectId ?? '0'),
          semester_id:      parseInt(extData.semesterId ?? '0'),
          assessment_type:  (extData.assessmentType ?? 'assignment') as 'quiz' | 'exam' | 'assignment' | 'project',
          title:            extData.title ?? 'Penilaian',
          max_score:        100,
          grades: [{
            student_id: parseInt(data.studentId),
            score:      data.assignments?.[0]?.score ?? 0,
          }],
        });
        await fetchGrades();
        setError(null);
        return { success: true, message: 'Nilai berhasil disimpan.' };
      }
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
      if (USE_MOCK) {
        const scheduleData = await teacherApi.getSchedule(day);
        setSchedule(scheduleData);
      } else {
        const data = await getTeacherSchedule(day);
        setSchedule(data.map(s => ({
          id:      s.id,
          day:     s.day,
          time:    s.time,
          class:   s.class,
          subject: s.subject,
          teacher: s.teacher,
          room:    s.room,
        })));
      }
      setError(null);
    } catch (err) {
      handleError(err, 'Gagal memuat jadwal mengajar');
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

  // Semesters
  const [semesters, setSemesters] = useState<Array<{ id: string; name: string; startDate: string; endDate: string; isActive: boolean }>>([]);
  const [activeSemester, setActiveSemester] = useState<{ id: string; name: string; startDate: string; endDate: string; isActive: boolean } | null>(null);

  const fetchSemesters = async () => {
    if (role !== 'guru') return;
    
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teacher/semesters`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch semesters');
      const result = await response.json();
      setSemesters(result.data ?? []);
      setError(null);
    } catch (err) {
      handleError(err, 'Gagal memuat data semester');
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveSemester = async () => {
    if (role !== 'guru') return;
    
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teacher/active-semester`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch active semester');
      const result = await response.json();
      setActiveSemester(result.data);
      setError(null);
    } catch (err) {
      handleError(err, 'Gagal memuat semester aktif');
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
      fetchDocuments();
      fetchEReports();
      fetchSemesters();
      fetchActiveSemester();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    documents,
    ereports,
    semesters,
    activeSemester,
    
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
    fetchDocuments,
    uploadDocument,
    fetchEReports,
    fetchSemesters,
    fetchActiveSemester,
  };
};