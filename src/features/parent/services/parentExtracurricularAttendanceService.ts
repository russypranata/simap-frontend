import { PARENT_API_URL, getAuthHeaders, handleApiError } from "./parentApiClient";
import { getParentChildren, type DashboardChild as ChildInfo } from "./parentDashboardService";

export type ExtracurricularStatus = "hadir" | "izin" | "alpa";

export interface Extracurricular {
    id: number;
    name: string;
    category: string;
    schedule: string;
    time: string;
    location: string;
    advisor: string;
    members: number;
    status: "active" | "inactive";
    attendanceRate: number;
    joinDate: string;
    academicYearId: string;
    achievements?: string[];
}

export interface ExtracurricularAttendance {
    id: number;
    date: string;
    activity: string;
    status: ExtracurricularStatus;
    academicYearId: string;
}

export interface ExtracurricularData {
    extracurriculars: Extracurricular[];
    recentAttendance: ExtracurricularAttendance[];
}

const statusMap: Record<string, ExtracurricularStatus> = {
    hadir: "hadir",
    izin: "izin",
    alpa: "alpa",
};

export const getExtracurricularData = async (
    childId: string,
    academicYearId?: string
): Promise<ExtracurricularData> => {
    const params = new URLSearchParams();
    if (academicYearId && academicYearId !== "all") params.append("academic_year_id", academicYearId);

    const response = await fetch(`${PARENT_API_URL}/children/${childId}/attendance/extracurricular?${params}`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();

    // Backend returns attendance records — group by extracurricular
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const records: Record<string, any>[] = result.data ?? [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recentAttendance: ExtracurricularAttendance[] = records.map((item: Record<string, any>, index: number) => ({
        id: item.id ?? index,
        date: item.date ?? "",
        activity: item.extracurricularName ?? item.extracurricular_name ?? "Ekstrakurikuler",
        status: statusMap[item.status] ?? "hadir",
        academicYearId: academicYearId ?? "",
    }));

    return {
        extracurriculars: [], // populated separately if needed
        recentAttendance,
    };
};

export { getParentChildren, type ChildInfo };
