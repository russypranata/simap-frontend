import { PARENT_API_URL, getAuthHeaders, handleApiError } from "./parentApiClient";
import { getParentChildren, type DashboardChild as ChildInfo } from "./parentDashboardService";

export interface ScheduleItem {
    id: number;
    type: 'lesson' | 'break' | 'ceremony' | 'free';
    label?: string;
    day: string;
    startTime: string;
    endTime: string;
    subject: string;
    teacher: string;
    room: string;
    lessonNumber?: number | string;
}

export interface ChildScheduleData {
    childId: string;
    childName: string;
    childClass: string;
    schedule: ScheduleItem[];
    enrolledYears: { id: string; name: string; isActive: boolean }[];
}

export const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

export const getSubjectColor = (subject: string): string => {
    const colors: Record<string, string> = {
        Matematika: "blue", Fisika: "purple", Kimia: "green", Biologi: "emerald",
        "Bahasa Indonesia": "orange", "Bahasa Inggris": "sky", Sejarah: "amber",
        PKn: "red", PJOK: "lime", "Seni Budaya": "pink", BK: "slate",
        "Pendidikan Agama": "teal", TIK: "indigo", Prakarya: "yellow",
    };
    return colors[subject] ?? "gray";
};

const DAY_MAP: Record<string, string> = {
    monday: "Senin", tuesday: "Selasa", wednesday: "Rabu",
    thursday: "Kamis", friday: "Jumat", saturday: "Sabtu", sunday: "Minggu",
};

export const getChildSchedule = async (
    childId: string,
    academicYearId?: string
): Promise<ChildScheduleData> => {
    const url = new URL(`${PARENT_API_URL}/children/${childId}/schedule`);
    if (academicYearId) url.searchParams.set("academicYearId", academicYearId);

    const response = await fetch(url.toString(), {
        headers: getAuthHeaders(),
    });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const schedule: ScheduleItem[] = (result.data ?? []).map((item: Record<string, any>) => ({
        id: item.id,
        type: item.type ?? 'lesson',
        label: item.label ?? undefined,
        day: DAY_MAP[item.dayOfWeek ?? item.day_of_week] ?? item.dayOfWeek ?? "",
        startTime: item.startTime ?? item.start_time ?? "",
        endTime: item.endTime ?? item.end_time ?? "",
        subject: item.subject ?? "",
        teacher: item.teacher ?? "",
        room: item.room ?? "",
    }));

    return {
        childId: String(childId),
        childName: "",
        childClass: "",
        schedule,
        enrolledYears: [],
    };
};

// Maps start_time → lesson period number (skipping break slots)
// Slots: 07:00(1), 07:45(2), 08:30(3), [break], 09:30(4), 10:15(5), 11:00(6), [break], 12:30(7), 13:15(8), 14:00(9), 14:45(10)
const PERIOD_MAP: Record<string, number> = {
    "07:00": 1, "07:45": 2, "08:30": 3,
    "09:30": 4, "10:15": 5, "11:00": 6,
    "12:30": 7, "13:15": 8, "14:00": 9, "14:45": 10,
};

export const getLessonPeriod = (startTime: string): number | null => {
    const key = startTime.substring(0, 5);
    return PERIOD_MAP[key] ?? null;
};

export const isScheduleCurrentlyHappening = (item: ScheduleItem): boolean => {
    const now = new Date();
    const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    if (item.day !== dayNames[now.getDay()]) return false;
    const cur = now.getHours() * 60 + now.getMinutes();
    const [sh, sm] = item.startTime.split(":").map(Number);
    const [eh, em] = item.endTime.split(":").map(Number);
    return cur >= sh * 60 + sm && cur <= eh * 60 + em;
};

export { getParentChildren, type ChildInfo };
