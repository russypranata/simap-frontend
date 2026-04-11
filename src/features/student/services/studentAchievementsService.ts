import { STUDENT_API_URL, getAuthHeaders, handleApiError } from './studentApiClient';

export interface Achievement {
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
}

export const getStudentAchievements = async (academicYearId?: string): Promise<Achievement[]> => {
    const params = new URLSearchParams();
    if (academicYearId && academicYearId !== 'all') params.append('academic_year_id', academicYearId);

    const response = await fetch(`${STUDENT_API_URL}/achievements?${params}`, { headers: getAuthHeaders() });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (result.data ?? []).map((item: Record<string, any>): Achievement => ({
        id:              item.id,
        competitionName: item.competitionName ?? item.competition_name ?? '',
        category:        item.category        ?? '',
        rank:            item.rank            ?? '',
        eventName:       item.eventName       ?? item.event_name       ?? '',
        organizer:       item.organizer       ?? '',
        level:           item.level           ?? '',
        date:            item.date            ?? '',
        photo:           item.photo           ?? null,
        academicYearId:  item.academicYear?.name ?? academicYearId ?? '',
    }));
};
