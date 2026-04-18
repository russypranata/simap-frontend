 
// Mock data for teacher functionality
import { TeacherClass, Student, Grade, Announcement, Document as TeacherDocument, EReport } from '../types/teacher';

// Mock teacher data
export const mockTeacher = {
  id: '1',
  name: 'Budi Santoso, S.Pd.',
  nip: '198506152008011001',
  email: 'budi.santoso@sekolah.sch.id',
  phone: '+62 812-3456-7890',
  role: 'guru' as const,
  isHomeroomTeacher: true,
  homeroomClass: 'XII A',
  subjects: ['Matematika', 'Fisika', 'Biologi'],
  joinDate: '2008-01-01',
  education: 'S1 Pendidikan Fisika',
  certification: 'Sertifikat Pendidik Profesional',
};

// Mock classes data - Classes taught by the teacher
export const mockClasses: TeacherClass[] = [
  {
    id: '1',
    name: 'XII A',
    grade: 'XII',
    homeroomTeacher: mockTeacher.name,
    studentCount: 32,
    schedule: ['Senin', 'Kamis'],
    subjects: [{ id: '1', name: 'Matematika' }],
  },
  {
    id: '2',
    name: 'XI A',
    grade: 'XI',
    homeroomTeacher: 'Siti Aminah, S.Pd.',
    studentCount: 28,
    schedule: ['Selasa', 'Rabu', 'Jumat'],
    subjects: [{ id: '1', name: 'Matematika' }, { id: '2', name: 'Fisika' }],
  },
  {
    id: '3',
    name: 'X B',
    grade: 'X',
    homeroomTeacher: 'Lina Marlina, S.Pd.',
    studentCount: 30,
    schedule: ['Rabu', 'Kamis'],
    subjects: [{ id: '3', name: 'Biologi' }],
  },
];

const maleNames = ['Aditya', 'Bayu', 'Eko', 'Fajar', 'Indra', 'Joko', 'Nanda', 'Oscar', 'Rizky', 'Tono', 'Wahyu', 'Yudi', 'Budi', 'Dimas', 'Gilang', 'Hendra', 'Arif', 'Bambang', 'Candra', 'Dedi'];
const femaleNames = ['Citra', 'Dewi', 'Gita', 'Hana', 'Kartika', 'Lina', 'Maya', 'Putri', 'Siti', 'Utami', 'Vina', 'Zahra', 'Anita', 'Dina', 'Rina', 'Tari', 'Wulan', 'Yulia', 'Nisa', 'Reri'];
const lastNames = ['Pratama', 'Santoso', 'Wijaya', 'Lestari', 'Saputra', 'Hidayat', 'Kusuma', 'Sari', 'Nugroho', 'Wibowo', 'Susanti', 'Rahmawati', 'Setiawan', 'Kurniawan', 'Pertiwi', 'Anggraini', 'Firmansyah', 'Hermawan', 'Mulyani', 'Suharto'];

// Helper to generate students for a class with realistic names
const generateStudents = (className: string, startId: number, count: number, gender: 'L' | 'P'): Student[] => {
  const selectedFirstNames = gender === 'L' ? maleNames : femaleNames;

  return Array.from({ length: count }, (_, i) => {
    const firstName = selectedFirstNames[(startId + i) % selectedFirstNames.length];
    const lastName = lastNames[(startId + i) % lastNames.length];

    return {
      id: String(startId + i),
      nis: String(10000 + startId + i),
      name: `${firstName} ${lastName}`,
      class: className,
      gender: gender,
      birthDate: '2006-01-01',
      address: 'Jl. Contoh No. 123',
      phone: '08123456789',
      parentsName: 'Orang Tua Siswa',
      parentsPhone: '08123456789',
    };
  });
};

// Mock students data
export const mockStudents: Student[] = [
  // XII A - Male Class
  {
    id: '1',
    nis: '12101',
    name: 'Ahmad Rizky Pratama',
    class: 'XII A',
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
    name: 'Budi Santoso',
    class: 'XII A',
    gender: 'L',
    birthDate: '2006-08-22',
    address: 'Jl. Sudirman No. 456, Jakarta',
    phone: '+62 812-2345-6789',
    parentsName: 'Bapak Santoso',
    parentsPhone: '+62 813-4567-8901',
  },
  {
    id: '3',
    nis: '12103',
    name: 'Muhammad Fadli',
    class: 'XII A',
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
    name: 'Dimas Anggara',
    class: 'XII A',
    gender: 'L',
    birthDate: '2006-03-18',
    address: 'Jl. Imam Bonjol No. 321, Jakarta',
    phone: '+62 812-4567-8901',
    parentsName: 'Bapak Anggara',
    parentsPhone: '+62 813-6789-0123',
  },
  {
    id: '5',
    nis: '12105',
    name: 'Rudi Hermawan',
    class: 'XII A',
    gender: 'L',
    birthDate: '2006-07-25',
    address: 'Jl. Diponegoro No. 654, Jakarta',
    phone: '+62 812-5678-9012',
    parentsName: 'Bapak Hermawan',
    parentsPhone: '+62 813-7890-1234',
  },
  ...generateStudents('XII A', 6, 26, 'L'),

  // XII B - Female Class
  ...generateStudents('XII B', 200, 30, 'P'),

  // XI A - Male Class
  ...generateStudents('XI A', 300, 28, 'L'),

  // XI B - Female Class
  ...generateStudents('XI B', 400, 28, 'P'),

  // X A - Male Class
  ...generateStudents('X A', 500, 30, 'L'),

  // X B - Female Class
  ...generateStudents('X B', 600, 30, 'P'),
];

// Helper to generate random grades
const generateGrades = (
  startId: number,
  count: number,
  className: string,
  subject: string,
  academicYear: string,
  semester: 'Ganjil' | 'Genap'
): Grade[] => {
  const students = mockStudents.filter(s => s.class === className).slice(startId - 1, startId - 1 + count);

  return students.map((student, index) => {
    // Randomize scores slightly
    const baseScore = 75 + Math.floor(Math.random() * 20); // 75-95
    const midTerm = baseScore - 5 + Math.floor(Math.random() * 10);
    const finalExam = baseScore - 5 + Math.floor(Math.random() * 10);
    const assignmentScore = baseScore;

    const average = (assignmentScore * 0.4) + (midTerm * 0.3) + (finalExam * 0.3);

    let grade: 'A' | 'B' | 'C' | 'D' | 'E' = 'C';
    let description = 'Cukup';

    if (average >= 90) { grade = 'A'; description = 'Sangat Baik'; }
    else if (average >= 80) { grade = 'B'; description = 'Baik'; }
    else if (average >= 70) { grade = 'C'; description = 'Cukup'; }
    else { grade = 'D'; description = 'Kurang'; }

    return {
      id: String(startId + index),
      studentId: student.id,
      studentName: student.name,
      class: className,
      subject: subject,
      semester: semester,
      academicYear: academicYear,
      assignments: [
        { name: 'Tugas 1', score: assignmentScore, maxScore: 100, source: 'manual' },
        { name: 'Tugas 2', score: assignmentScore + (Math.random() > 0.5 ? 2 : -2), maxScore: 100, source: 'manual' },
        { name: 'Tugas 3', score: assignmentScore + (Math.random() > 0.5 ? 3 : -3), maxScore: 100, source: 'manual' },
      ],
      midTerm,
      finalExam,
      average: Number(average.toFixed(1)),
      grade,
      description,
      syncStatus: 'manual',
    };
  });
};

// Mock grades data
// Mock grades data
export const mockGrades: Grade[] = [
  // 1. XII A - Matematika (Detailed Demo Data)
  {
    id: '1',
    studentId: '1',
    studentName: 'Ahmad Rizki Pratama',
    class: 'XII A',
    subject: 'Matematika',
    semester: 'Ganjil',
    academicYear: '2025/2026',
    assignments: [
      { name: 'Tugas 1', score: 85, maxScore: 100, source: 'manual' },
      { name: 'Tugas 2', score: 90, maxScore: 100, source: 'manual' },
      { name: 'Tugas 3', score: 88, maxScore: 100, source: 'manual' },
    ],
    midTerm: 87,
    finalExam: 92,
    average: 88.4,
    grade: 'A',
    description: 'Sangat Baik',
    syncStatus: 'manual',
  },
  {
    id: '2',
    studentId: '2',
    studentName: 'Siti Nurhaliza',
    class: 'XII A',
    subject: 'Matematika',
    semester: 'Ganjil',
    academicYear: '2025/2026',
    assignments: [
      { name: 'Quiz 1: Aljabar', score: 95, maxScore: 100, source: 'moodle', moodleId: 'm1' },
      { name: 'Tugas Proyek', score: 98, maxScore: 100, source: 'moodle', moodleId: 'm3' },
      { name: 'Tugas 3', score: 92, maxScore: 100, source: 'manual' },
    ],
    midTerm: 95,
    finalExam: 96,
    average: 95.2,
    grade: 'A',
    description: 'Sangat Baik',
    syncStatus: 'synced',
    lastSync: new Date('2025-08-20T10:00:00'),
  },
  {
    id: '3',
    studentId: '3',
    studentName: 'Muhammad Fadli',
    class: 'XII A',
    subject: 'Matematika',
    semester: 'Ganjil',
    academicYear: '2025/2026',
    assignments: [
      { name: 'Quiz 1: Aljabar', score: 75, maxScore: 100, source: 'moodle', moodleId: 'm1' },
      { name: 'Tugas Proyek', score: 80, maxScore: 100, source: 'manual' },
    ],
    midTerm: 78,
    finalExam: 82,
    average: 78.5,
    grade: 'B',
    description: 'Baik',
    syncStatus: 'modified',
    lastSync: new Date('2025-08-19T09:00:00'),
  },
  // Generate remaining students for XII A - Matematika (Start from ID 4)
  ...generateGrades(4, 29, 'XII A', 'Matematika', '2025/2026', 'Ganjil'),

  // 2. XI A - Matematika
  ...generateGrades(300, 28, 'XI A', 'Matematika', '2025/2026', 'Ganjil'),

  // 3. XI A - Fisika
  ...generateGrades(300, 28, 'XI A', 'Fisika', '2025/2026', 'Ganjil'),

  // 4. X B - Biologi
  ...generateGrades(600, 30, 'X B', 'Biologi', '2025/2026', 'Ganjil'),
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
    name: 'CP Matematika XII A',
    type: 'CP',
    description: 'Capaian Pembelajaran Matematika Kelas XII A',
    fileName: 'cp-matematika-xii-a.pdf',
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
    title: 'Rapor Siswa XII A Semester Ganjil',
    type: 'semester',
    class: 'XII A',
    semester: 'Ganjil',
    academicYear: '2024/2025',
    status: 'completed',
    generatedDate: new Date('2024-01-08T16:00:00'),
    dueDate: new Date('2024-01-15T23:59:59'),
    studentCount: 32,
    completedCount: 32,
    description: 'Rapor semester ganjil untuk kelas XII A',
  },
  {
    id: '2',
    title: 'Rapor Siswa XI B Semester Ganjil',
    type: 'semester',
    class: 'XI B',
    semester: 'Ganjil',
    academicYear: '2024/2025',
    status: 'in_progress',
    generatedDate: new Date('2024-01-09T08:00:00'),
    dueDate: new Date('2024-01-20T23:59:59'),
    studentCount: 30,
    completedCount: 25,
    description: 'Rapor semester ganjil untuk kelas XI B',
  },
  {
    id: '3',
    title: 'Rapor Siswa X A Semester Ganjil',
    type: 'semester',
    class: 'X A',
    semester: 'Ganjil',
    academicYear: '2024/2025',
    status: 'pending',
    generatedDate: new Date('2024-01-10T10:00:00'),
    dueDate: new Date('2024-01-25T23:59:59'),
    studentCount: 30,
    completedCount: 0,
    description: 'Rapor semester ganjil untuk kelas X A',
  },
];
