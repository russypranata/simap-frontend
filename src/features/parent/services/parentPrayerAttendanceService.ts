import { PARENT_API_URL, getAuthHeaders, handleApiError } from "./parentApiClient";
import { getParentChildren, type DashboardChild as ChildInfo } from "./parentDashboardService";

export type PrayerStatus = "hadir_tepat_waktu" | "masbuk" | "haid" | "tanpa_keterangan" | "belum_dicatat";

export interface PrayerRecord {
    id: string;
    date: string;
    day: string;
    subuh: PrayerStatus;
    dhuha: PrayerStatus;
    dzuhur: PrayerStatus;
    ashar: PrayerStatus;
    maghrib: PrayerStatus;
    isya: PrayerStatus;
    tahajjud: PrayerStatus;
}

const DAYS_ID = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

const statusMap: Record<string, PrayerStatus> = {
    hadir: "hadir_tepat_waktu",
    alpa: "tanpa_keterangan",
    hadir_tepat_waktu: "hadir_tepat_waktu",
    masbuk: "masbuk",
    haid: "haid",
    tanpa_keterangan: "tanpa_keterangan",
};

/**
 * Build a week of prayer records from API data grouped by date.
 */
const buildWeekRecords = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apiData: Record<string, any>[],
    dates: Date[],
    today: Date,
    childId: string
): PrayerRecord[] => {
    // Group by date
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const byDate: Record<string, Record<string, any>[]> = {};
    for (const item of apiData) {
        if (!byDate[item.date]) byDate[item.date] = [];
        byDate[item.date].push(item);
    }

    return dates.map((date) => {
        const dateStr = date.toISOString().split("T")[0];
        const dayRecords = byDate[dateStr] ?? [];
        const isFuture = date > today;

        const getStatus = (prayerTime: string): PrayerStatus => {
            if (isFuture) return "belum_dicatat";
            const rec = dayRecords.find((r) => r.prayerTime === prayerTime || r.prayer_time === prayerTime);
            if (!rec) return "belum_dicatat";
            return statusMap[rec.status] ?? "belum_dicatat";
        };

        return {
            id: `${childId}-${dateStr}`,
            date: dateStr,
            day: DAYS_ID[date.getDay()] ?? "",
            subuh: getStatus("subuh"),
            dhuha: "belum_dicatat",
            dzuhur: getStatus("dzuhur"),
            ashar: getStatus("ashar"),
            maghrib: getStatus("maghrib"),
            isya: getStatus("isya"),
            tahajjud: "belum_dicatat",
        };
    });
};

export const getPrayerAttendance = async (
    childId: string,
    weekOffset: number
): Promise<PrayerRecord[]> => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const currentDay = today.getDay();
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() + distanceToMonday + weekOffset * 7);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const dates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        return d;
    });

    const startStr = startOfWeek.toISOString().split("T")[0];
    const endStr = endOfWeek.toISOString().split("T")[0];

    const params = new URLSearchParams({ start_date: startStr, end_date: endStr });
    const response = await fetch(`${PARENT_API_URL}/children/${childId}/attendance/prayer?${params}`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();

    return buildWeekRecords(result.data ?? [], dates, today, childId);
};

export const getPrayerAttendanceByMonth = async (
    childId: string,
    year: number,
    month: number
): Promise<PrayerRecord[]> => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dates = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));

    const startStr = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const endStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(daysInMonth).padStart(2, "0")}`;

    const params = new URLSearchParams({ start_date: startStr, end_date: endStr });
    const response = await fetch(`${PARENT_API_URL}/children/${childId}/attendance/prayer?${params}`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();

    return buildWeekRecords(result.data ?? [], dates, today, childId);
};

export { getParentChildren, type ChildInfo };
