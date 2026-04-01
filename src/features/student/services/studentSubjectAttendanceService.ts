export type SubjectType = "wajib" | "peminatan";
export type SubjectStatus = "hadir" | "izin" | "sakit" | "alpa";

export interface SubjectAttendanceRecord {
    id: number;
    date: string;
    day: string;
    subject: string;
    subjectType: SubjectType;
    teacher: string;
    status: SubjectStatus;
    time: string;
    lessonHour: string;
    topic?: string;
    notes?: string;
    academicYearId: string;
    semester: number;
    class: string;
}

const baseMockRecords: Omit<SubjectAttendanceRecord, "id">[] = [
    { date: "2026-01-11", day: "Sabtu", subject: "TIK", subjectType: "wajib", teacher: "Fajar Nugroho, S.Kom.", status: "hadir", time: "07:00 - 08:30", lessonHour: "1-2", topic: "Pengolahan Data dengan Spreadsheet", academicYearId: "2025-2026", semester: 2, class: "XII A" },
    { date: "2026-01-10", day: "Jumat", subject: "Bahasa Inggris", subjectType: "wajib", teacher: "Budi Santoso, S.Pd.", status: "hadir", time: "07:00 - 08:30", lessonHour: "1-2", topic: "Procedure Text - Writing", academicYearId: "2025-2026", semester: 2, class: "XII A" },
    { date: "2026-01-10", day: "Jumat", subject: "Pendidikan Agama", subjectType: "wajib", teacher: "Usman Abdullah, S.Ag.", status: "hadir", time: "08:30 - 09:15", lessonHour: "3", topic: "Fiqih - Thaharah", academicYearId: "2025-2026", semester: 2, class: "XII A" },
    { date: "2026-01-09", day: "Kamis", subject: "Matematika", subjectType: "wajib", teacher: "Ahmad Fauzi, S.Pd.", status: "hadir", time: "07:00 - 08:30", lessonHour: "1-2", topic: "Statistika - Peluang", academicYearId: "2025-2026", semester: 2, class: "XII A" },
    { date: "2026-01-08", day: "Rabu", subject: "Bahasa Inggris", subjectType: "wajib", teacher: "Budi Santoso, S.Pd.", status: "hadir", time: "07:00 - 08:30", lessonHour: "1-2", topic: "Report Text - Reading", academicYearId: "2025-2026", semester: 2, class: "XII A" },
    { date: "2026-01-08", day: "Rabu", subject: "Biologi", subjectType: "peminatan", teacher: "Ani Lestari, S.Si.", status: "hadir", time: "08:30 - 10:00", lessonHour: "3-4", topic: "Sistem Pernapasan Manusia", academicYearId: "2025-2026", semester: 2, class: "XII A" },
    { date: "2026-01-08", day: "Rabu", subject: "Seni Budaya", subjectType: "wajib", teacher: "Ratna Sari, S.Sn.", status: "izin", time: "10:15 - 11:45", lessonHour: "5-6", topic: "Seni Rupa Kontemporer", notes: "Dispensasi - Pameran Seni", academicYearId: "2025-2026", semester: 2, class: "XII A" },
    { date: "2026-01-07", day: "Selasa", subject: "Fisika", subjectType: "peminatan", teacher: "Sari Wahyuni, S.Si.", status: "hadir", time: "07:00 - 08:30", lessonHour: "1-2", topic: "Listrik Dinamis", academicYearId: "2025-2026", semester: 2, class: "XII A" },
    { date: "2026-01-07", day: "Selasa", subject: "Kimia", subjectType: "peminatan", teacher: "Rudi Hartono, S.Si.", status: "hadir", time: "08:30 - 10:00", lessonHour: "3-4", topic: "Kimia Unsur", academicYearId: "2025-2026", semester: 2, class: "XII A" },
    { date: "2026-01-06", day: "Senin", subject: "Matematika", subjectType: "wajib", teacher: "Ahmad Fauzi, S.Pd.", status: "hadir", time: "07:45 - 09:15", lessonHour: "2-3", topic: "Matriks - Operasi dan Determinan", academicYearId: "2025-2026", semester: 2, class: "XII A" },
    { date: "2025-12-20", day: "Jumat", subject: "Matematika", subjectType: "wajib", teacher: "Ahmad Fauzi, S.Pd.", status: "hadir", time: "08:30 - 10:00", lessonHour: "2-3", topic: "Limit Fungsi Aljabar", academicYearId: "2025-2026", semester: 1, class: "XII A" },
    { date: "2025-12-19", day: "Kamis", subject: "Kimia", subjectType: "peminatan", teacher: "Rudi Hartono, S.Si.", status: "hadir", time: "07:00 - 08:30", lessonHour: "1-2", topic: "Larutan Penyangga", academicYearId: "2025-2026", semester: 1, class: "XII A" },
    { date: "2025-12-13", day: "Sabtu", subject: "TIK", subjectType: "wajib", teacher: "Fajar Nugroho, S.Kom.", status: "sakit", time: "07:00 - 08:30", lessonHour: "1-2", topic: "Algoritma dan Pemrograman", notes: "Surat Dokter", academicYearId: "2025-2026", semester: 1, class: "XII A" },
    { date: "2025-01-15", day: "Rabu", subject: "Matematika", subjectType: "wajib", teacher: "Ahmad Fauzi, S.Pd.", status: "hadir", time: "07:45 - 09:15", lessonHour: "1-2", topic: "Persamaan Kuadrat", academicYearId: "2024-2025", semester: 2, class: "XI A" },
    { date: "2025-01-14", day: "Selasa", subject: "Kimia", subjectType: "peminatan", teacher: "Rudi Hartono, S.Si.", status: "hadir", time: "07:00 - 08:30", lessonHour: "1-2", topic: "Laju Reaksi", academicYearId: "2024-2025", semester: 2, class: "XI A" },
    { date: "2025-01-13", day: "Senin", subject: "Bahasa Inggris", subjectType: "wajib", teacher: "Budi Santoso, S.Pd.", status: "alpa", time: "08:30 - 10:00", lessonHour: "2-3", topic: "Analytical Exposition Text", academicYearId: "2024-2025", semester: 2, class: "XI A" },
];

export const getStudentSubjectAttendance = async (): Promise<SubjectAttendanceRecord[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(baseMockRecords.map((base, index) => ({ ...base, id: index + 1 })));
        }, 800);
    });
};
