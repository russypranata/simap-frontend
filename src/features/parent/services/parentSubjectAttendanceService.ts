import { PARENT_API_URL, getAuthHeaders, handleApiError } from "./parentApiClient";
import { getParentChildren, type DashboardChild as ChildInfo } from "./parentDashboardService";

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

const DAYS_ID = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

const statusMap: Record<string, SubjectStatus> = {
    present: "hadir",
    absent: "alpa",
    late: "izin",
    excused: "sakit",
    hadir: "hadir",
    sakit: "sakit",
    izin: "izin",
    alpa: "alpa",
};

export const getSubjectAttendance = async (
    childId: string
): Promise<SubjectAttendanceRecord[]> => {
    const response = await fetch(`${PARENT_API_URL}/children/${childId}/attendance/subject`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (result.data ?? []).map((item: Record<string, any>, index: number): SubjectAttendanceRecord => ({
        id: item.id ?? index,
        date: item.date ?? "",
        day: DAYS_ID[new Date(item.date).getDay()] ?? "",
        subject: item.subject ?? "",
        subjectType: "wajib",
        teacher: item.teacher ?? "",
        status: statusMap[item.status] ?? "hadir",
        time: "",
        lessonHour: "",
        topic: item.topic ?? undefined,
        notes: item.notes ?? undefined,
        academicYearId: "",
        semester: 1,
        class: "",
    }));
};

export { getParentChildren, type ChildInfo };
