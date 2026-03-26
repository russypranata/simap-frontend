import { getParentChildren, type ChildInfo } from "./dailyAttendanceService";

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

// Internal base data for mocking
const baseMockSubjectRecords: Omit<SubjectAttendanceRecord, "id">[] = [
    // Tahun Ajaran 2025-2026 - Kelas XII A
    { date: "2026-01-10", day: "Jumat", subject: "Matematika", subjectType: "wajib", teacher: "Ahmad Fauzi, S.Pd., M.Si.", status: "hadir", time: "07:45 - 09:15", lessonHour: "1-2", topic: "Turunan Fungsi Aljabar", academicYearId: "2025-2026", semester: 2, class: "XII A" },
    { date: "2026-01-10", day: "Jumat", subject: "Fisika", subjectType: "peminatan", teacher: "Sari Wulandari, S.Pd.", status: "hadir", time: "09:30 - 11:00", lessonHour: "3-4", topic: "Hukum Newton tentang Gerak", academicYearId: "2025-2026", semester: 2, class: "XII A" },
    { date: "2026-01-09", day: "Kamis", subject: "Kimia", subjectType: "peminatan", teacher: "Ir. Rudi Hartono, M.Pd.", status: "hadir", time: "07:00 - 08:30", lessonHour: "1-2", topic: "Reaksi Redoks dan Elektrokimia", academicYearId: "2025-2026", semester: 2, class: "XII A" },
    { date: "2026-01-09", day: "Kamis", subject: "PKn", subjectType: "wajib", teacher: "Rina Kusumawati, S.H., M.H.", status: "hadir", time: "10:15 - 11:45", lessonHour: "5-6", topic: "Sistem Pemerintahan Indonesia", academicYearId: "2025-2026", semester: 2, class: "XII A" },
    { date: "2026-01-08", day: "Rabu", subject: "Bahasa Inggris", subjectType: "wajib", teacher: "Budi Santoso, S.S., M.A.", status: "izin", time: "08:30 - 10:00", lessonHour: "2-3", topic: "Narrative Text - Reading Comprehension", notes: "Lomba Debat Bahasa Inggris", academicYearId: "2025-2026", semester: 2, class: "XII A" },
    { date: "2026-01-07", day: "Selasa", subject: "Biologi", subjectType: "peminatan", teacher: "Dr. Hj. Ani Setianingsih", status: "hadir", time: "07:45 - 09:15", lessonHour: "1-2", topic: "Genetika dan Pewarisan Sifat", academicYearId: "2025-2026", semester: 2, class: "XII A" },
    { date: "2026-01-07", day: "Selasa", subject: "Sejarah", subjectType: "wajib", teacher: "Drs. Hendra Gunawan", status: "hadir", time: "10:15 - 11:45", lessonHour: "5-6", topic: "Perang Dunia II dan Dampaknya", academicYearId: "2025-2026", semester: 2, class: "XII A" },
    { date: "2026-01-06", day: "Senin", subject: "Matematika", subjectType: "wajib", teacher: "Ahmad Fauzi, S.Pd., M.Si.", status: "hadir", time: "07:45 - 09:15", lessonHour: "1-2", topic: "Integral Tentu dan Aplikasinya", academicYearId: "2025-2026", semester: 2, class: "XII A" },
    { date: "2025-12-20", day: "Jumat", subject: "Matematika", subjectType: "wajib", teacher: "Ahmad Fauzi, S.Pd., M.Si.", status: "hadir", time: "08:30 - 10:00", lessonHour: "2-3", topic: "Limit Fungsi Trigonometri", academicYearId: "2025-2026", semester: 1, class: "XII A" },
    { date: "2025-12-19", day: "Kamis", subject: "Kimia", subjectType: "peminatan", teacher: "Ir. Rudi Hartono, M.Pd.", status: "hadir", time: "07:00 - 08:30", lessonHour: "1-2", topic: "Termokimia dan Entalpi", academicYearId: "2025-2026", semester: 1, class: "XII A" },
    { date: "2025-12-18", day: "Rabu", subject: "PJOK", subjectType: "wajib", teacher: "Dedi Supriyadi, S.Or.", status: "alpa", time: "12:30 - 14:00", lessonHour: "7-8", topic: "Permainan Bola Basket", academicYearId: "2025-2026", semester: 1, class: "XII A" },
    
    // Tahun Ajaran 2024-2025 - Kelas XI A
    { date: "2025-01-15", day: "Rabu", subject: "Matematika", subjectType: "wajib", teacher: "Ahmad Fauzi, S.Pd., M.Si.", status: "hadir", time: "07:45 - 09:15", lessonHour: "1-2", topic: "Persamaan Kuadrat dan Fungsi Kuadrat", academicYearId: "2024-2025", semester: 2, class: "XI A" },
    { date: "2025-01-15", day: "Rabu", subject: "Fisika", subjectType: "peminatan", teacher: "Sari Wulandari, S.Pd.", status: "hadir", time: "09:30 - 11:00", lessonHour: "3-4", topic: "Gelombang Mekanik dan Bunyi", academicYearId: "2024-2025", semester: 2, class: "XI A" },
    { date: "2025-01-14", day: "Selasa", subject: "Kimia", subjectType: "peminatan", teacher: "Ir. Rudi Hartono, M.Pd.", status: "hadir", time: "07:00 - 08:30", lessonHour: "1-2", topic: "Laju Reaksi dan Kesetimbangan", academicYearId: "2024-2025", semester: 2, class: "XI A" },
    { date: "2025-01-14", day: "Selasa", subject: "Bahasa Indonesia", subjectType: "wajib", teacher: "Lestari Ayu, S.Pd., M.Hum.", status: "hadir", time: "10:15 - 11:45", lessonHour: "5-6", topic: "Teks Eksposisi dan Argumentasi", academicYearId: "2024-2025", semester: 2, class: "XI A" },
    { date: "2025-01-13", day: "Senin", subject: "Bahasa Inggris", subjectType: "wajib", teacher: "Budi Santoso, S.S., M.A.", status: "sakit", time: "08:30 - 10:00", lessonHour: "2-3", topic: "Analytical Exposition Text", notes: "Surat Dokter - Demam", academicYearId: "2024-2025", semester: 2, class: "XI A" },
    { date: "2025-01-13", day: "Senin", subject: "Sejarah", subjectType: "wajib", teacher: "Drs. Hendra Gunawan", status: "hadir", time: "10:15 - 11:45", lessonHour: "5-6", topic: "Pergerakan Nasional Indonesia", academicYearId: "2024-2025", semester: 2, class: "XI A" },
    { date: "2024-12-18", day: "Rabu", subject: "Matematika", subjectType: "wajib", teacher: "Ahmad Fauzi, S.Pd., M.Si.", status: "hadir", time: "07:45 - 09:15", lessonHour: "1-2", topic: "Trigonometri - Aturan Sinus dan Cosinus", academicYearId: "2024-2025", semester: 1, class: "XI A" },
    { date: "2024-12-17", day: "Selasa", subject: "Fisika", subjectType: "peminatan", teacher: "Sari Wulandari, S.Pd.", status: "hadir", time: "09:30 - 11:00", lessonHour: "3-4", topic: "Fluida Statis dan Dinamis", academicYearId: "2024-2025", semester: 1, class: "XI A" },
    { date: "2024-12-16", day: "Senin", subject: "PJOK", subjectType: "wajib", teacher: "Dedi Supriyadi, S.Or.", status: "izin", time: "12:30 - 14:00", lessonHour: "7-8", topic: "Atletik - Lari Jarak Pendek", notes: "Dispensasi - Representasi Sekolah", academicYearId: "2024-2025", semester: 1, class: "XI A" },
    
    // Tahun Ajaran 2023-2024 - Kelas X A
    { date: "2024-01-12", day: "Jumat", subject: "Matematika", subjectType: "wajib", teacher: "Ahmad Fauzi, S.Pd., M.Si.", status: "hadir", time: "07:45 - 09:15", lessonHour: "1-2", topic: "Sistem Persamaan Linear Tiga Variabel", academicYearId: "2023-2024", semester: 2, class: "X A" },
    { date: "2024-01-12", day: "Jumat", subject: "Fisika", subjectType: "peminatan", teacher: "Sari Wulandari, S.Pd.", status: "hadir", time: "09:30 - 11:00", lessonHour: "3-4", topic: "Kinematika Gerak Lurus", academicYearId: "2023-2024", semester: 2, class: "X A" },
    { date: "2024-01-11", day: "Kamis", subject: "Kimia", subjectType: "peminatan", teacher: "Ir. Rudi Hartono, M.Pd.", status: "hadir", time: "07:00 - 08:30", lessonHour: "1-2", topic: "Struktur Atom dan Sistem Periodik", academicYearId: "2023-2024", semester: 2, class: "X A" },
    { date: "2024-01-11", day: "Kamis", subject: "Bahasa Indonesia", subjectType: "wajib", teacher: "Lestari Ayu, S.Pd., M.Hum.", status: "hadir", time: "10:15 - 11:45", lessonHour: "5-6", topic: "Teks Laporan Hasil Observasi", academicYearId: "2023-2024", semester: 2, class: "X A" },
    { date: "2024-01-10", day: "Rabu", subject: "Bahasa Inggris", subjectType: "wajib", teacher: "Budi Santoso, S.S., M.A.", status: "hadir", time: "08:30 - 10:00", lessonHour: "2-3", topic: "Descriptive Text", academicYearId: "2023-2024", semester: 2, class: "X A" },
    { date: "2024-01-10", day: "Rabu", subject: "Sejarah", subjectType: "wajib", teacher: "Drs. Hendra Gunawan", status: "hadir", time: "10:15 - 11:45", lessonHour: "5-6", topic: "Kehidupan Manusia Purba", academicYearId: "2023-2024", semester: 2, class: "X A" },
    { date: "2024-01-09", day: "Selasa", subject: "Biologi", subjectType: "peminatan", teacher: "Dr. Hj. Ani Setianingsih", status: "hadir", time: "07:45 - 09:15", lessonHour: "1-2", topic: "Keanekaragaman Hayati", academicYearId: "2023-2024", semester: 2, class: "X A" },
    { date: "2024-01-09", day: "Selasa", subject: "PKn", subjectType: "wajib", teacher: "Rina Kusumawati, S.H., M.H.", status: "hadir", time: "10:15 - 11:45", lessonHour: "5-6", topic: "Norma dan Konstitusi", academicYearId: "2023-2024", semester: 2, class: "X A" },
    { date: "2023-12-15", day: "Jumat", subject: "Matematika", subjectType: "wajib", teacher: "Ahmad Fauzi, S.Pd., M.Si.", status: "hadir", time: "07:45 - 09:15", lessonHour: "1-2", topic: "Fungsi Komposisi dan Invers", academicYearId: "2023-2024", semester: 1, class: "X A" },
    { date: "2023-12-14", day: "Kamis", subject: "Fisika", subjectType: "peminatan", teacher: "Sari Wulandari, S.Pd.", status: "hadir", time: "09:30 - 11:00", lessonHour: "3-4", topic: "Vektor dan Resultan Gaya", academicYearId: "2023-2024", semester: 1, class: "X A" },
];

export const getSubjectAttendance = async (
    childId: string
): Promise<SubjectAttendanceRecord[]> => {
    return new Promise((resolve, reject) => {
        // Simulate potential API failure (10% chance)
        // if (Math.random() < 0.1) return reject(new Error("Gagal terhubung ke server SIMAP."));
        
        setTimeout(() => {
            // Generate deterministic mock variation based on childId
            const seed = childId.charCodeAt(childId.length - 1);
            
            // Map the base array uniquely for this child
            const records: SubjectAttendanceRecord[] = baseMockSubjectRecords.map((base, index) => {
                // If child is different, slightly tweak stats to look organic
                let status = base.status;
                if (seed % 2 !== 0 && index % 7 === 0) {
                    status = "izin";
                } else if (seed % 3 === 0 && index % 5 === 0) {
                    status = "alpa";
                }

                return {
                    ...base,
                    id: parseInt(`${seed}${index}`),
                    status: status as SubjectStatus,
                };
            });
            
            resolve(records);
        }, 800);
    });
};

export { getParentChildren, type ChildInfo };
