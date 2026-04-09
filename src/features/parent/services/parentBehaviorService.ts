import { PARENT_API_URL, getAuthHeaders, handleApiError } from "./parentApiClient";
import { getParentChildren, type DashboardChild as ChildInfo } from "./parentDashboardService";

export interface ViolationRecord {
    id: number;
    date: string;
    time: string;
    location: "sekolah" | "asrama";
    problem: string;
    followUp: string;
    reporterName: string;
    reporterGender: "L" | "P";
    reporterRole?: string;
    academicYearId: string;
}

export interface BehaviorData {
    records: ViolationRecord[];
}

export const getBehaviorData = async (
    childId: string,
    academicYearId?: string
): Promise<BehaviorData> => {
    const params = new URLSearchParams();
    if (academicYearId && academicYearId !== "all") params.append("academic_year_id", academicYearId);

    const response = await fetch(`${PARENT_API_URL}/children/${childId}/behavior?${params}`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const records: ViolationRecord[] = (result.data ?? []).map((item: Record<string, any>) => ({
        id: item.id,
        date: item.date ?? "",
        time: item.time ?? "",
        location: item.location ?? "sekolah",
        problem: item.problem ?? "",
        followUp: item.followUp ?? item.follow_up ?? "",
        reporterName: item.reportedBy ?? item.reported_by ?? "",
        reporterGender: "L" as const,
        reporterRole: undefined,
        academicYearId: item.academicYear?.name ?? academicYearId ?? "",
    }));

    return { records };
};

export { getParentChildren, type ChildInfo };
