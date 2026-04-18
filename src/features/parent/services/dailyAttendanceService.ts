import { PARENT_API_URL, getAuthHeaders, handleApiError, getAcademicYears } from "./parentApiClient";
import { getParentChildren } from "./parentDashboardService";

export type AttendanceStatus = "hadir" | "sakit" | "izin" | "alpa" | "libur" | "belum_dicatat";

export interface DailyAttendanceRecord {
    date: string;
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

// Status mapping from backend (English) to frontend (Indonesian)
const statusMap: Record<string, AttendanceStatus> = {
    present: "hadir",
    absent: "alpa",
    late: "izin",
    excused: "sakit",
    hadir: "hadir",
    sakit: "sakit",
    izin: "izin",
    alpa: "alpa",
};

export const getDailyAttendance = async (
    childId: string,
    year: number,
    month: number,
    _semesterId?: string
): Promise<DailyAttendanceResponse> => {
    const params = new URLSearchParams({ year: String(year), month: String(month + 1) });
    const response = await fetch(`${PARENT_API_URL}/children/${childId}/attendance/daily?${params}`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();

    const apiMap: Record<string, DailyAttendanceRecord> = {};
    for (const item of result.data ?? []) {
        apiMap[item.date] = {
            date: item.date,
            status: statusMap[item.status] ?? "belum_dicatat",
            notes: item.notes ?? undefined,
        };
    }

    // Fill all days of the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const records: DailyAttendanceRecord[] = [];

    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i);
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
        const dow = date.getDay();

        if (dow === 0 || dow === 6) {
            records.push({ date: dateStr, status: "libur", notes: dow === 0 ? "Hari Minggu" : "Hari Sabtu" });
        } else if (date > today) {
            records.push({ date: dateStr, status: "belum_dicatat" });
        } else {
            records.push(apiMap[dateStr] ?? { date: dateStr, status: "belum_dicatat" });
        }
    }

    return {
        records,
        childName: result.childName ?? "",
        childClass: result.childClass ?? "",
    };
};

export { getParentChildren, getAcademicYears };
export type { ChildInfo as default };
