export interface LateRecord {
    id: number;
    date: string;
    day: string;
    time: string;
    notes?: string;
    location?: string;
    recordedBy?: string;
    academicYearId: string;
    semesterId: string;
}

export interface AcademicYear {
    id: string;
    name: string;
    isActive: boolean;
    semesters: { id: string; name: string; isActive: boolean }[];
}

const mockLateRecords: LateRecord[] = [
    { id: 1, date: "2026-01-10", day: "Jumat", time: "07:15", notes: "Ban bocor di jalan", location: "Gerbang Depan", recordedBy: "Budi Santoso, S.Pd", academicYearId: "ay-2025-2026", semesterId: "ay-2025-2026-sem-2" },
    { id: 2, date: "2026-01-07", day: "Selasa", time: "07:20", notes: "Macet akibat kecelakaan", location: "Gerbang Samping", recordedBy: "Siti Aminah, S.Pd", academicYearId: "ay-2025-2026", semesterId: "ay-2025-2026-sem-2" },
    { id: 3, date: "2026-01-02", day: "Kamis", time: "07:10", notes: "Kendaraan mogok", location: "Gerbang Depan", recordedBy: "Ahmad Fauzi, S.Pd", academicYearId: "ay-2025-2026", semesterId: "ay-2025-2026-sem-2" },
    { id: 4, date: "2025-12-19", day: "Jumat", time: "07:25", notes: "Terlambat bangun", location: "Gerbang Depan", recordedBy: "Budi Santoso, S.Pd", academicYearId: "ay-2025-2026", semesterId: "ay-2025-2026-sem-1" },
    { id: 5, date: "2025-12-12", day: "Jumat", time: "07:30", notes: "Mengantar adik ke sekolah dulu", location: "Gerbang Samping", recordedBy: "Rinawati, S.Pd", academicYearId: "ay-2025-2026", semesterId: "ay-2025-2026-sem-1" },
    { id: 6, date: "2025-05-15", day: "Kamis", time: "07:45", notes: "Hujan deras", location: "Gerbang Utama", recordedBy: "Joko, S.Pd", academicYearId: "ay-2024-2025", semesterId: "ay-2024-2025-sem-2" },
];

export const mockAcademicYears: AcademicYear[] = [
    {
        id: "ay-2025-2026", name: "2025/2026", isActive: true,
        semesters: [
            { id: "ay-2025-2026-sem-1", name: "Ganjil", isActive: false },
            { id: "ay-2025-2026-sem-2", name: "Genap", isActive: true },
        ],
    },
    {
        id: "ay-2024-2025", name: "2024/2025", isActive: false,
        semesters: [
            { id: "ay-2024-2025-sem-1", name: "Ganjil", isActive: false },
            { id: "ay-2024-2025-sem-2", name: "Genap", isActive: false },
        ],
    },
];

export const getStudentMorningTardiness = async (
    academicYearId: string,
    semesterId: string
): Promise<LateRecord[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            let filtered = [...mockLateRecords];
            if (academicYearId !== "all") filtered = filtered.filter(r => r.academicYearId === academicYearId);
            if (semesterId !== "all") filtered = filtered.filter(r => r.semesterId === semesterId);
            filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            resolve(filtered);
        }, 800);
    });
};

export const getStudentAcademicYears = async (): Promise<AcademicYear[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockAcademicYears;
};
