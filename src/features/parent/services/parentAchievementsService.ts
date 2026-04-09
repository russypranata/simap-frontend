import { PARENT_API_URL, getAuthHeaders, handleApiError } from "./parentApiClient";
import { getParentChildren, type DashboardChild as ChildInfo } from "./parentDashboardService";

export interface AchievementRecord {
    id: number;
    competitionName: string;
    category: string;
    rank: string;
    eventName: string;
    organizer: string;
    level: string;
    date: string;
    photo: string | null;
    academicYearId: string;
    semester: number;
}

export const getAchievements = async (
    childId: string,
    academicYearId?: string
): Promise<AchievementRecord[]> => {
    const params = new URLSearchParams();
    if (academicYearId && academicYearId !== "all") params.append("academic_year_id", academicYearId);

    const response = await fetch(`${PARENT_API_URL}/children/${childId}/achievements?${params}`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (result.data ?? []).map((item: Record<string, any>): AchievementRecord => ({
        id: item.id,
        competitionName: item.competitionName ?? item.competition_name ?? "",
        category: item.category ?? "",
        rank: item.rank ?? "",
        eventName: item.eventName ?? item.event_name ?? "",
        organizer: item.organizer ?? "",
        level: item.level ?? "",
        date: item.date ?? "",
        photo: item.photo ?? null,
        academicYearId: item.academicYear?.name ?? academicYearId ?? "",
        semester: item.semester ?? 1,
    }));
};

export { getParentChildren, type ChildInfo };
