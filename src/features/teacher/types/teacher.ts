// Teacher-related type definitions

export interface Teacher {
  id: string;
  name: string;
  nip: string;
  email: string;
  phone: string;
  role: 'guru' | 'admin';
  isHomeroomTeacher: boolean;
  homeroomClass?: string;
  subjects: string[];
  joinDate: string;
  education: string;
  certification: string;
}

export interface TeacherClass {
  id: string;
  name: string;
  grade: string;
  major?: string;
  homeroomTeacher: string;
  studentCount: number;
  schedule: string[];
}

export interface Student {
  id: string;
  nis: string;
  name: string;
  class: string;
  gender: 'L' | 'P';
  birthDate: string;
  address: string;
  phone: string;
  parentsName: string;
  parentsPhone: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  date: string;
  status: 'hadir' | 'sakit' | 'izin' | 'tanpa-keterangan';
  subject: string;
  teacher: string;
  lessonHour: string; // e.g., '1-2', '3-4', etc.
  notes?: string;
  academicYear: string;
  semester: 'Ganjil' | 'Genap';
}

export interface TeachingJournal {
  id: string;
  date: string;
  class: string;
  subject: string;
  lessonHour: string;
  material: string;
  learningObjective?: string;

  topic: string;
  teachingMethod: string;
  media: string;
  evaluation: string;
  notes: string;
  attendance: {
    total: number;
    present: number;
    sick: number;
    permit: number;
    absent: number;
  };
  academicYear: string;
  semester: 'Ganjil' | 'Genap';
  createdAt?: string;
  updatedAt?: string;
  startTime?: string;
  endTime?: string;
}

export interface Assignment {
  name: string;
  score: number;
  maxScore: number;
}

export interface Assignment {
  name: string;
  score: number;
  maxScore: number;

  // Moodle Integration Fields
  source?: 'manual' | 'moodle';
  moodleId?: string;
  lastSyncedAt?: string;
  isLocked?: boolean;
}

export interface Grade {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  subject: string;
  semester: 'Ganjil' | 'Genap';
  academicYear: string;
  assignments: Assignment[];
  midTerm: number;
  finalExam: number;
  average: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
  description: string;

  // Moodle Integration Fields
  moodleUserId?: string;
  syncStatus?: 'synced' | 'modified' | 'error' | 'manual';
  lastSync?: Date;
}

export interface Schedule {
  id: string;
  day: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  time: string;
  class: string;
  subject: string;
  teacher: string;
  room: string;
  hasJournal?: boolean;      // Indicates if teaching journal has been created
  hasAttendance?: boolean;   // Indicates if attendance has been recorded
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'academic' | 'event' | 'holiday' | 'general';
  priority: 'high' | 'medium' | 'low';
  sender: string;
  timestamp: Date;
  targetAudience: ('guru' | 'siswa' | 'admin' | 'orang_tua')[];
}

export interface Document {
  id: string;
  name: string;
  type: 'CP' | 'ATP' | 'Modul Ajar' | 'Prota' | 'Prosem' | 'Analisis Alokasi Waktu' | 'KKTP' | 'Kisi-Kisi Soal' | 'Analisis Asesmen' | 'Jurnal Refleksi' | 'Dokumen PKB' | 'Daya Serap';
  description: string;
  fileName: string;
  fileSize: number;
  uploadDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  uploadedBy: string;
}

export interface EReport {
  id: string;
  title: string;
  type: 'semester' | 'kenaikan' | 'kelulusan';
  class: string;
  semester: 'Ganjil' | 'Genap';
  academicYear: string;
  status: 'pending' | 'in_progress' | 'completed';
  generatedDate: Date;
  dueDate: Date;
  studentCount: number;
  completedCount: number;
  description: string;
}

export interface DashboardStats {
  totalClasses: number;
  todaySchedule: number;
  teachingJournals: number;
  attendanceStatus: {
    present: number;
    absent: number;
    total: number;
  };
  documentsSent: number;
  latestAnnouncements: number;
}

export interface RemediationNote {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  subject: string;
  semester: 'Ganjil' | 'Genap';
  status: 'remedial' | 'enrichment';
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
  note: string;
  actionPlan: string;
  createdAt: Date;
  updatedAt: Date;
}