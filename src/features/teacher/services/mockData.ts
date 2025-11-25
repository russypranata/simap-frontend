// Mock data for teacher functionality
import { TeacherClass, Student, AttendanceRecord, TeachingJournal, Grade, Schedule, Announcement, Document as TeacherDocument, EReport } from '../types/teacher';

// Mock teacher data
export const mockTeacher = {
  id: '1',
  name: 'Budi Santoso, S.Pd.',
  nip: '198506152008011001',
  email: 'budi.santoso@sekolah.sch.id',
  phone: '+62 812-3456-7890',
  role: 'guru' as const,
  isHomeroomTeacher: true,
  homeroomClass: 'XII IPA 1',
  subjects: ['Matematika', 'Fisika'],
  joinDate: '2008-01-01',
  education: 'S1 Pendidikan Fisika',
  certification: 'Sertifikat Pendidik Profesional',
};

// Mock classes data - SYNCHRONIZED WITH extendedMockSchedule
export const mockClasses: TeacherClass[] = [
  // Kelas XII
  {
    id: '1',
    name: 'XII IPA 1',
    grade: 'XII',
    major: 'IPA',
    homeroomTeacher: mockTeacher.name,
    studentCount: 32,
    schedule: ['Senin', 'Rabu', 'Jumat'],
  },
  {
    id: '2',
    name: 'XII IPA 2',
    grade: 'XII',
    major: 'IPA',
    homeroomTeacher: 'Dewi Lestari, S.Pd.',
    studentCount: 30, // Updated to 30
    schedule: ['Selasa', 'Kamis'],
  },
  // Kelas XI
  {
    id: '4',
    name: 'XI IPA 1',
    grade: 'XI',
    major: 'IPA',
    homeroomTeacher: 'Siti Aminah, S.Pd.',
    studentCount: 28, // Updated to 28
    schedule: ['Selasa', 'Jumat'],
  },
  {
    id: '5',
    name: 'XI IPA 2',
    grade: 'XI',
    major: 'IPA',
    homeroomTeacher: 'Budi Hartono, S.Pd.',
    studentCount: 28, // Updated to 28
    schedule: ['Senin', 'Rabu'],
  },
  // Kelas X
  {
    id: '7',
    name: 'X IPA 1',
    grade: 'X',
    major: 'IPA',
    homeroomTeacher: 'Hadi Pranoto, S.Pd.',
    studentCount: 30, // Updated to 30
    schedule: ['Selasa'],
  },
  {
    id: '8',
    name: 'X IPA 2',
    grade: 'X',
    major: 'IPA',
    homeroomTeacher: 'Lina Marlina, S.Pd.',
    studentCount: 28, // Updated to 28
    schedule: ['Rabu'],
  },
];

// Helper to generate students for a class
const generateStudents = (className: string, startId: number, count: number): Student[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: String(startId + i),
    nis: String(10000 + startId + i),
    name: `Siswa ${className} ${i + 1}`,
    class: className,
    gender: i % 2 === 0 ? 'L' : 'P',
    birthDate: '2006-01-01',
    address: 'Jl. Contoh No. 123',
    phone: '08123456789',
    parentsName: 'Orang Tua Siswa',
    parentsPhone: '08123456789',
  }));
};

// Mock students data
export const mockStudents: Student[] = [
  // XII IPA 1 (Existing names kept for realism)
  {
    id: '1',
    nis: '12101',
    name: 'Ahmad Rizki Pratama',
    class: 'XII IPA 1',
    gender: 'L',
    birthDate: '2006-05-15',
    address: 'Jl. Merdeka No. 123, Jakarta',
    phone: '+62 812-3456-7890',
    parentsName: 'Bapak H. Pratama',
    parentsPhone: '+62 813-5678-9012',
  },
  {
    id: '2',
    nis: '12102',
    name: 'Siti Nurhaliza',
    class: 'XII IPA 1',
    gender: 'P',
    birthDate: '2006-08-22',
    address: 'Jl. Sudirman No. 456, Jakarta',
    phone: '+62 812-2345-6789',
    parentsName: 'Ibu Siti Aminah',
    parentsPhone: '+62 813-4567-8901',
  },
  {
    id: '3',
    nis: '12103',
    name: 'Muhammad Fadli',
    class: 'XII IPA 1',
    gender: 'L',
    birthDate: '2006-12-10',
    address: 'Jl. Gatot Subroto No. 789, Jakarta',
    phone: '+62 812-3456-7891',
    parentsName: 'Bapak Fadli Muhammad',
    parentsPhone: '+62 813-5678-9013',
  },
  {
    id: '4',
    nis: '12104',
    name: 'Dewi Anggraini',
    class: 'XII IPA 1',
    gender: 'P',
    birthDate: '2006-03-18',
    address: 'Jl. Imam Bonjol No. 321, Jakarta',
    phone: '+62 812-4567-8901',
    parentsName: 'Bapak Anggraini',
    parentsPhone: '+62 813-6789-0123',
  },
  {
    id: '5',
    nis: '12105',
    name: 'Rudi Hermawan',
    class: 'XII IPA 1',
    gender: 'L',
    birthDate: '2006-07-25',
    address: 'Jl. Diponegoro No. 654, Jakarta',
    phone: '+62 812-5678-9012',
    parentsName: 'Ibu Hermawan',
    parentsPhone: '+62 813-7890-1234',
  },
  {
    id: '6',
    nis: '12106',
    name: 'Rina Kartika',
    class: 'XII IPA 1',
    gender: 'P',
    birthDate: '2006-11-30',
    address: 'Jl. Ahmad Yani No. 987, Jakarta',
    phone: '+62 812-6789-0123',
    parentsName: 'Bapak Kartika',
    parentsPhone: '+62 813-8901-2345',
  },
  {
    id: '7',
    nis: '12107',
    name: 'Budi Setiawan',
    class: 'XII IPA 1',
    gender: 'L',
    birthDate: '2006-04-12',
    address: 'Jl. Veteran No. 147, Jakarta',
    phone: '+62 812-7890-1234',
    parentsName: 'Ibu Setiawan',
    parentsPhone: '+62 813-9012-3456',
  },
  {
    id: '8',
    nis: '12108',
    name: 'Fitri Handayani',
    class: 'XII IPA 1',
    gender: 'P',
    birthDate: '2006-09-05',
    address: 'Jl. Pahlawan No. 258, Jakarta',
    phone: '+62 812-8901-2345',
    parentsName: 'Bapak Handayani',
    parentsPhone: '+62 813-0123-4567',
  },
  {
    id: '9',
    nis: '12109',
    name: 'Arif Rahman',
    class: 'XII IPA 1',
    gender: 'L',
    birthDate: '2006-02-28',
    address: 'Jl. Cendana No. 369, Jakarta',
    phone: '+62 812-9012-3456',
    parentsName: 'Ibu Rahman',
    parentsPhone: '+62 813-1234-5678',
  },
  {
    id: '10',
    nis: '12110',
    name: 'Maya Sari',
    class: 'XII IPA 1',
    gender: 'P',
    birthDate: '2006-06-14',
    address: 'Jl. Flamboyan No. 741, Jakarta',
    phone: '+62 812-0123-4567',
    parentsName: 'Bapak Sari',
    parentsPhone: '+62 813-2345-6789',
  },
  // Generate remaining 22 students for XII IPA 1 (Total 32)
  ...generateStudents('XII IPA 1', 11, 22),

  // Generate students for other classes
  ...generateStudents('XII IPA 2', 200, 30),
  ...generateStudents('XI IPA 1', 300, 28),
  ...generateStudents('XI IPA 2', 400, 28),
  ...generateStudents('X IPA 1', 500, 30),
  ...generateStudents('X IPA 2', 550, 28),
  // Empty classes
  ...generateStudents('XII IPA 3', 250, 0),
  ...generateStudents('XI IPA 3', 450, 0),
  ...generateStudents('X IPA 3', 600, 0),
];

// Mock grades data
export const mockGrades: Grade[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'Ahmad Rizki Pratama',
    class: 'XII IPA 1',
    subject: 'Matematika',
    semester: 'Ganjil',
    academicYear: '2024/2025',
    assignments: [
      { name: 'Tugas 1', score: 85, maxScore: 100 },
      { name: 'Tugas 2', score: 90, maxScore: 100 },
      { name: 'Tugas 3', score: 88, maxScore: 100 },
    ],
    midTerm: 87,
    finalExam: 92,
    average: 88.4,
    grade: 'A',
    description: 'Sangat Baik',
  },
  {
    id: '2',
    studentId: '2',
    studentName: 'Siti Nurhaliza',
    class: 'XII IPA 1',
    subject: 'Matematika',
    semester: 'Ganjil',
    academicYear: '2024/2025',
    assignments: [
      { name: 'Tugas 1', score: 92, maxScore: 100 },
      { name: 'Tugas 2', score: 95, maxScore: 100 },
      { name: 'Tugas 3', score: 90, maxScore: 100 },
    ],
    midTerm: 93,
    finalExam: 96,
    average: 93.2,
    grade: 'A',
    description: 'Sangat Baik',
  },
];

// Mock announcements
export const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Pengumuman Ujian Tengah Semester',
    content: 'UTS akan dilaksanakan pada tanggal 20-25 Maret 2024. Siswa diharapkan mempersiapkan diri dengan baik.',
    type: 'academic',
    priority: 'high',
    sender: 'Kepala Sekolah',
    timestamp: new Date('2024-01-10T08:00:00'),
    targetAudience: ['guru', 'siswa'],
  },
  {
    id: '2',
    title: 'Workshop Pengembangan Profesional',
    content: 'Akan ada workshop tentang pembelajaran berbasis digital pada hari Sabtu, 18 Maret 2024.',
    type: 'event',
    priority: 'medium',
    sender: 'Kurikulum',
    timestamp: new Date('2024-01-09T10:30:00'),
    targetAudience: ['guru'],
  },
  {
    id: '3',
    title: 'Libur Semester Ganjil',
    content: 'Libur semester ganjil akan dimulai dari tanggal 25 Desember 2024 hingga 6 Januari 2025.',
    type: 'holiday',
    priority: 'low',
    sender: 'Tata Usaha',
    timestamp: new Date('2024-01-08T14:00:00'),
    targetAudience: ['guru', 'siswa', 'orang_tua'],
  },
];

// Mock documents
export const mockDocuments: TeacherDocument[] = [
  {
    id: '1',
    name: 'CP Matematika XII IPA 1',
    type: 'CP',
    description: 'Capaian Pembelajaran Matematika Kelas XII IPA 1',
    fileName: 'cp-matematika-xii-ipa-1.pdf',
    fileSize: 2456789,
    uploadDate: new Date('2024-01-05T09:00:00'),
    status: 'approved',
    uploadedBy: mockTeacher.name,
  },
  {
    id: '2',
    name: 'ATP Fisika Semester Genap',
    type: 'ATP',
    description: 'Alur Tujuan Pembelajaran Fisika Semester Genap',
    fileName: 'atp-fisika-genap.pdf',
    fileSize: 1876543,
    uploadDate: new Date('2024-01-04T10:30:00'),
    status: 'pending',
    uploadedBy: mockTeacher.name,
  },
  {
    id: '3',
    name: 'Modul Ajar Turunan',
    type: 'Modul Ajar',
    description: 'Modul ajar materi turunan fungsi',
    fileName: 'modul-ajar-turunan.pdf',
    fileSize: 3456789,
    uploadDate: new Date('2024-01-03T13:15:00'),
    status: 'approved',
    uploadedBy: mockTeacher.name,
  },
];

// Mock E-Reports
export const mockEReports: EReport[] = [
  {
    id: '1',
    title: 'Rapor Siswa XII IPA 1 Semester Ganjil',
    type: 'semester',
    class: 'XII IPA 1',
    semester: 'Ganjil',
    academicYear: '2024/2025',
    status: 'completed',
    generatedDate: new Date('2024-01-08T16:00:00'),
    dueDate: new Date('2024-01-15T23:59:59'),
    studentCount: 32,
    completedCount: 32,
    description: 'Rapor semester ganjil untuk kelas XII IPA 1',
  },
  {
    id: '2',
    title: 'Rapor Siswa XI IPA 2 Semester Ganjil',
    type: 'semester',
    class: 'XI IPA 2',
    semester: 'Ganjil',
    academicYear: '2024/2025',
    status: 'in_progress',
    generatedDate: new Date('2024-01-09T08:00:00'),
    dueDate: new Date('2024-01-20T23:59:59'),
    studentCount: 30,
    completedCount: 25,
    description: 'Rapor semester ganjil untuk kelas XI IPA 2',
  },
  {
    id: '3',
    title: 'Rapor Siswa X IPA 1 Semester Ganjil',
    type: 'semester',
    class: 'X IPA 1',
    semester: 'Ganjil',
    academicYear: '2024/2025',
    status: 'pending',
    generatedDate: new Date('2024-01-10T10:00:00'),
    dueDate: new Date('2024-01-25T23:59:59'),
    studentCount: 30,
    completedCount: 0,
    description: 'Rapor semester ganjil untuk kelas X IPA 1',
  },
];
