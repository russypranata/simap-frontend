import { getParentChildren, type ChildInfo } from "./dailyAttendanceService";
import { getAcademicYears } from "./dailyAttendanceService";
import type { AcademicYear, Semester } from "@/features/admin/types/academicYear";

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
    childId: string;
}

// Mock database - Expanding it to test historical filters
const mockLateRecords: LateRecord[] = [
    { id: 1, date: "2026-01-10", day: "Jumat", time: "07:15", notes: "Ban bocor di jalan", location: "Gerbang Depan", recordedBy: "Budi Santoso, S.Pd", academicYearId: "ay-2025-2026", semesterId: "ay-2025-2026-sem-2", childId: "student-1" },
    { id: 2, date: "2026-01-07", day: "Selasa", time: "07:20", notes: "Macet akibat kecelakaan", location: "Gerbang Samping", recordedBy: "Siti Aminah, S.Pd", academicYearId: "ay-2025-2026", semesterId: "ay-2025-2026-sem-2", childId: "student-1" },
    { id: 3, date: "2026-01-02", day: "Kamis", time: "07:10", notes: "Kendaraan mogok", location: "Gerbang Depan", recordedBy: "Ahmad Fauzi, S.Pd", academicYearId: "ay-2025-2026", semesterId: "ay-2025-2026-sem-2", childId: "student-1" },
    { id: 4, date: "2025-12-19", day: "Jumat", time: "07:25", notes: "Terlambat bangun", location: "Gerbang Depan", recordedBy: "Budi Santoso, S.Pd", academicYearId: "ay-2025-2026", semesterId: "ay-2025-2026-sem-1", childId: "student-1" },
    { id: 5, date: "2025-12-12", day: "Jumat", time: "07:30", notes: "Mengantar adik ke sekolah dulu", location: "Gerbang Samping", recordedBy: "Rinawati, S.Pd", academicYearId: "ay-2025-2026", semesterId: "ay-2025-2026-sem-1", childId: "student-1" },
    { id: 7, date: "2025-05-15", day: "Kamis", time: "07:45", notes: "Hujan deras", location: "Gerbang Utama", recordedBy: "Joko, S.Pd", academicYearId: "ay-2024-2025", semesterId: "ay-2024-2025-sem-2", childId: "student-1" },
    
    // Testing Pagination (>10 records)
    { id: 8, date: "2026-02-01", day: "Minggu", time: "07:12", notes: "Macet", location: "Gerbang Depan", recordedBy: "Budi, S.Pd", academicYearId: "ay-2025-2026", semesterId: "ay-2025-2026-sem-2", childId: "student-1" },
    { id: 9, date: "2026-02-02", day: "Senin", time: "07:15", notes: "Macet", location: "Gerbang Depan", recordedBy: "Budi, S.Pd", academicYearId: "ay-2025-2026", semesterId: "ay-2025-2026-sem-2", childId: "student-1" },
    { id: 10, date: "2026-02-03", day: "Selasa", time: "07:18", notes: "Macet", location: "Gerbang Depan", recordedBy: "Budi, S.Pd", academicYearId: "ay-2025-2026", semesterId: "ay-2025-2026-sem-2", childId: "student-1" },
    { id: 11, date: "2026-02-04", day: "Rabu", time: "07:20", notes: "Macet", location: "Gerbang Depan", recordedBy: "Budi, S.Pd", academicYearId: "ay-2025-2026", semesterId: "ay-2025-2026-sem-2", childId: "student-1" },
    { id: 12, date: "2026-02-05", day: "Kamis", time: "07:22", notes: "Macet", location: "Gerbang Depan", recordedBy: "Budi, S.Pd", academicYearId: "ay-2025-2026", semesterId: "ay-2025-2026-sem-2", childId: "student-1" },
    { id: 13, date: "2026-02-06", day: "Jumat", time: "07:25", notes: "Macet", location: "Gerbang Depan", recordedBy: "Budi, S.Pd", academicYearId: "ay-2025-2026", semesterId: "ay-2025-2026-sem-2", childId: "student-1" },
    { id: 14, date: "2026-02-07", day: "Sabtu", time: "07:28", notes: "Macet", location: "Gerbang Depan", recordedBy: "Budi, S.Pd", academicYearId: "ay-2025-2026", semesterId: "ay-2025-2026-sem-2", childId: "student-1" },
    { id: 15, date: "2026-02-08", day: "Minggu", time: "07:30", notes: "Macet", location: "Gerbang Depan", recordedBy: "Budi, S.Pd", academicYearId: "ay-2025-2026", semesterId: "ay-2025-2026-sem-2", childId: "student-1" },
    
    // Child 2
    { id: 6, date: "2026-01-05", day: "Senin", time: "07:18", notes: "Ketinggalan buku", location: "Gerbang Depan", recordedBy: "Budi Santoso, S.Pd", academicYearId: "ay-2025-2026", semesterId: "ay-2025-2026-sem-2", childId: "student-2" },
];

export const getMorningTardiness = async (
    childId: string,
    academicYearId: string,
    semesterId: string
): Promise<LateRecord[]> => {
    console.log(`[API Mock] getMorningTardiness called with childId: ${childId}, academicYearId: ${academicYearId}, semesterId: ${semesterId}`);
    return new Promise((resolve) => {
        setTimeout(() => {
            let filtered = mockLateRecords.filter(r => r.childId === childId);
            console.log(`[API Mock] After child filter:`, filtered.length, filtered);
            
            if (academicYearId !== "all") {
                filtered = filtered.filter(r => r.academicYearId === academicYearId);
            }
            console.log(`[API Mock] After year filter:`, filtered.length, filtered);
            
            if (semesterId !== "all") {
                filtered = filtered.filter(r => r.semesterId === semesterId);
            }
            console.log(`[API Mock] After semester filter:`, filtered.length);
            
            // Sort by date descending
            filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            
            resolve(filtered);
        }, 800);
    });
};

export { getParentChildren, getAcademicYears, type ChildInfo, type AcademicYear, type Semester };
