// Mock data for Student Behavior Page
// TODO: Replace with actual API calls

export interface Student {
    id: number;
    name: string;
    class: string;
    nis: string;
}

export interface BehaviorRecord {
    id: number;
    studentId: number;
    teacherName: string;
    problem: string;
    followUp: string;
    location: "sekolah" | "asrama";
    date: string;
}

export const mockStudents: Student[] = [
    { id: 1, name: "Ahmad Rizky", class: "XII A", nis: "2024101" },
    { id: 2, name: "Budi Santoso", class: "XII A", nis: "2024102" },
    { id: 3, name: "Citra Dewi", class: "XII A", nis: "2024103" },
    { id: 4, name: "Dewi Putri", class: "XII A", nis: "2024104" },
    { id: 5, name: "Eko Prasetyo", class: "XII B", nis: "2024105" },
    { id: 6, name: "Fani Rahmawati", class: "XII B", nis: "2024106" },
    { id: 7, name: "Gunawan", class: "XI A", nis: "2024107" },
    { id: 8, name: "Hesti", class: "XI A", nis: "2024108" },
    { id: 9, name: "Indra", class: "X A", nis: "2024109" },
    { id: 10, name: "Joko", class: "X B", nis: "2024110" },
    { id: 11, name: "Kartika Sari", class: "XII A", nis: "2024111" },
    { id: 12, name: "Lestari", class: "XII B", nis: "2024112" },
    { id: 13, name: "Muhammad Iqbal", class: "XI A", nis: "2024113" },
    { id: 14, name: "Nur Azizah", class: "XI B", nis: "2024114" },
    { id: 15, name: "Omar Bakri", class: "X A", nis: "2024115" },
    { id: 16, name: "Putri Ayu", class: "X B", nis: "2024116" },
];

export const mockBehaviorRecords: BehaviorRecord[] = [
    {
        id: 1,
        studentId: 3,
        teacherName: "Pak Budi",
        problem: "Terlambat masuk kelas lebih dari 15 menit tanpa keterangan.",
        followUp: "Diberikan teguran lisan dan dicatat.",
        location: "sekolah",
        date: new Date(Date.now() - 86400000).toISOString(), // Kemarin
    },
    {
        id: 2,
        studentId: 5,
        teacherName: "Bu Siti",
        problem: "Tidak memakai seragam lengkap saat upacara.",
        followUp: "Diminta melengkapi atribut seragam.",
        location: "sekolah",
        date: new Date(Date.now() - 172800000).toISOString(), // 2 hari lalu
    },
    {
        id: 3,
        studentId: 10,
        teacherName: "Ust. Ahmad",
        problem: "Ribut di asrama saat jam istirahat malam.",
        followUp: "Diberikan nasehat dan poin pelanggaran.",
        location: "asrama",
        date: new Date(Date.now() - 259200000).toISOString(), // 3 hari lalu
    },
    {
        id: 4,
        studentId: 1,
        teacherName: "Pak Budi",
        problem: "Tidak membawa buku paket pelajaran.",
        followUp: "Diberikan tugas tambahan.",
        location: "sekolah",
        date: new Date(Date.now() - 345600000).toISOString(),
    },
    {
        id: 5,
        studentId: 7,
        teacherName: "Bu Rina",
        problem: "Tidur di kelas saat jam pelajaran berlangsung.",
        followUp: "Dibangunkan dan diminta cuci muka.",
        location: "sekolah",
        date: new Date(Date.now() - 432000000).toISOString(),
    },
    {
        id: 6,
        studentId: 12,
        teacherName: "Ust. Yusuf",
        problem: "Keluar lingkungan asrama tanpa izin.",
        followUp: "Panggilan orang tua dan skorsing asrama 1 hari.",
        location: "asrama",
        date: new Date(Date.now() - 518400000).toISOString(),
    },
    {
        id: 7,
        studentId: 2,
        teacherName: "Pak Joko",
        problem: "Membuang sampah sembarangan di koridor.",
        followUp: "Diminta membersihkan koridor.",
        location: "sekolah",
        date: new Date(Date.now() - 604800000).toISOString(),
    },
];

// Mock current teacher (should come from auth context later)
export const mockCurrentTeacher = "Pak Ahmad Hidayat";

// Helper to get unique classes from students
export const getUniqueClasses = (students: Student[]): string[] => {
    return Array.from(new Set(students.map(s => s.class))).sort();
};

// Helper to get unique teachers from records
export const getUniqueTeachers = (records: BehaviorRecord[]): string[] => {
    return Array.from(new Set(records.map(r => r.teacherName))).sort();
};
