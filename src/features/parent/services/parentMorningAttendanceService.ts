import { PARENT_API_URL, getAuthHeaders, handleApiError, getAcademicYears } from "./parentApiClient";
import { getParentChildren, type DashboardChild as ChildInfo } from "./parentDashboardService";

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

const DAYS_ID = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export const getMorningTardiness = async (
    childId: string,
    academicYearId: string,
    _semesterId?: string
): Promise<LateRecord[]> => {
    const params = new URLSearchParams();
    if (academicYearId && academicYearId !== "all") params.append("academic_year_id", academicYearId);

    const response = await fetch(`${PARENT_API_URL}/children/${childId}/attendance/morning?${params}`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (result.data ?? []).map((item: Record<string, any>): LateRecord => ({
        id: item.id,
        date: item.date,
        day: DAYS_ID[new Date(item.date).getDay()] ?? "",
        time: item.time ?? "",
        notes: item.notes ?? undefined,
        location: item.location ?? undefined,
        recordedBy: item.recordedBy ?? item.recorded_by ?? undefined,
        academicYearId: item.academicYear?.name ?? academicYearId,
        semesterId: "",
        childId: String(childId),
    }));
};

export { getParentChildren, getAcademicYears, type ChildInfo };
