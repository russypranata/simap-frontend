import { PARENT_API_URL, getAuthHeaders, handleApiError } from "./parentApiClient";
import { getParentChildren, type DashboardChild as ChildInfo } from "./parentDashboardService";

export interface ScheduleItem {
    id: number;
    day: string;
    startTime: string;
    endTime: string;
    subject: string;
    teacher: string;
    room: string;
}

export interface ChildScheduleData {
    childId: string;
    childName: string;
    childClass: string;
    schedule: ScheduleItem[];
}

export interface AcademicYearData {
    id: string;
    year: string;
    semesters: { id: string; name: string; status: string }[];
}

export const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

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
    _academicYearId?: string  // eslint-disable-line @typescript-eslint/no-unused-vars
): Promise<ChildScheduleData> => {
    const response = await fetch(`${PARENT_API_URL}/children/${childId}/schedule`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const schedule: ScheduleItem[] = (result.data ?? []).map((item: Record<string, any>) => ({
        id: item.id,
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
    };
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
