import { mockParentProfile } from "../data/mockParentData";
import { mockAcademicYears } from "@/features/admin/data/mockAcademicYearData";
import type { AcademicYear } from "@/features/admin/types/academicYear";
// Types
export type AttendanceStatus = "hadir" | "sakit" | "izin" | "alpa" | "libur" | "belum_dicatat";

export interface DailyAttendanceRecord {
    date: string; // YYYY-MM-DD
    status: AttendanceStatus;
    notes?: string;
    submittedBy?: string;
    submittedAt?: string;
}

export interface DailyAttendanceResponse {
    records: DailyAttendanceRecord[];
    childName: string;
    childClass: string;
}

export interface ChildInfo {
    id: string;
    name: string;
    class: string;
    nis: string;
}

// Mock Data Generator
const generateMockData = (year: number, month: number): DailyAttendanceRecord[] => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const records: DailyAttendanceRecord[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i);
        date.setHours(0, 0, 0, 0);
        const dayOfWeek = date.getDay();
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;

        if (dayOfWeek === 0 || dayOfWeek === 6) {
            records.push({ date: dateStr, status: "libur", notes: dayOfWeek === 0 ? "Hari Minggu" : "Hari Sabtu" });
        } else if (date >= today) {
            // Hari ini dan ke depan → belum dicatat oleh wali kelas
            records.push({ date: dateStr, status: "belum_dicatat" });
        } else if (i % 10 === 0) {
            records.push({ date: dateStr, status: "sakit", notes: "Demam", submittedBy: "Wali Kelas", submittedAt: `${dateStr}T08:00:00` });
        } else if (i % 7 === 0) {
            records.push({ date: dateStr, status: "izin", notes: "Acara Keluarga", submittedBy: "Orang Tua", submittedAt: `${dateStr}T07:30:00` });
        } else if (i === 15) {
            records.push({ date: dateStr, status: "alpa" });
        } else {
            records.push({ date: dateStr, status: "hadir" });
        }
    }
    return records;
};

/**
 * Fetch daily attendance records for a specific child and month.
 * Currently uses mock data — replace with real API call later:
 * GET /api/parent/{parentId}/attendance/daily?childId={childId}&semesterId={semesterId}&year={year}&month=YYYY-MM
 */
export const getDailyAttendance = async (
    childId: string,
    year: number,
    month: number,
    semesterId: string
): Promise<DailyAttendanceResponse> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simulate occasional API error (uncomment to test)
    // if (Math.random() < 0.3) throw new Error("Gagal memuat data presensi. Silakan coba lagi.");

    const child = mockParentProfile.children.find(c => c.id === childId);
    const records = generateMockData(year, month);

    return {
        records,
        childName: child?.name || "Siswa",
        childClass: child?.class || "-",
    };
};

/**
 * Get list of children for the current parent.
 * Currently uses mock data.
 */
export const getParentChildren = async (): Promise<ChildInfo[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockParentProfile.children;
};

/**
 * Get list of all academic years with semesters.
 */
export const getAcademicYears = async (): Promise<AcademicYear[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockAcademicYears;
};
