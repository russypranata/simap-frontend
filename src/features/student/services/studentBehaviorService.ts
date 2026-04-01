export interface ViolationRecord {
    id: number;
    date: string;
    time: string;
    location: "sekolah" | "asrama";
    problem: string;
    followUp: string;
    reporterName: string;
    reporterGender: "L" | "P";
    reporterRole?: string;
    academicYearId: string;
}

const baseMockViolations: Omit<ViolationRecord, "id">[] = [
    { date: "2026-02-15", time: "07:15", location: "sekolah", problem: "Terlambat masuk kelas 15 menit", followUp: "Peringatan lisan dan poin pelanggaran", reporterName: "Hendra Wijaya", reporterGender: "L", reporterRole: "Guru Piket", academicYearId: "2025-2026" },
    { date: "2025-11-10", time: "10:00", location: "sekolah", problem: "Tidur di kelas saat jam pelajaran", followUp: "Teguran lisan dan cuci muka", reporterName: "Budi Santoso", reporterGender: "L", reporterRole: "Guru Sejarah", academicYearId: "2025-2026" },
    { date: "2025-09-28", time: "21:30", location: "asrama", problem: "Keluar kamar setelah jam malam tanpa izin", followUp: "Teguran tertulis dari pembina asrama", reporterName: "Ahmad Zulfikar", reporterGender: "L", reporterRole: "Pembina Asrama", academicYearId: "2025-2026" },
    { date: "2025-04-12", time: "08:00", location: "sekolah", problem: "Tidak memakai sepatu hitam standar sekolah", followUp: "Peringatan dan sepatu disita sementara", reporterName: "Sri Wahyuni", reporterGender: "P", reporterRole: "Kesiswaan", academicYearId: "2024-2025" },
    { date: "2024-11-05", time: "16:15", location: "asrama", problem: "Tidak mengikuti kegiatan sholat Ashar berjamaah", followUp: "Membersihkan masjid asrama selama 3 hari", reporterName: "Maulana Malik", reporterGender: "L", reporterRole: "Mushrif Asrama", academicYearId: "2024-2025" },
    { date: "2024-03-15", time: "09:30", location: "sekolah", problem: "Tidak mengerjakan PR Matematika", followUp: "Hukuman lari lapangan 2 keliling", reporterName: "Endang Suparni", reporterGender: "P", reporterRole: "Guru Matematika", academicYearId: "2023-2024" },
];

export const getStudentBehaviorData = async (): Promise<{ records: ViolationRecord[] }> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const records = baseMockViolations.map((base, i) => ({ ...base, id: i + 1 }));
            records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            resolve({ records });
        }, 800);
    });
};
