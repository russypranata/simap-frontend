import { PARENT_API_URL, getAuthHeaders, handleApiError } from "./parentApiClient";

export interface GradeItem {
    id: number;
    subject: string;
    teacher: string;
    kkm: number;
    ki3Average: number | null;
    ki3Predicate: string | null;
    ki3Scores: number[];
    ki4Average: number | null;
    ki4Predicate: string | null;
    ki4Scores: number[];
    finalAverage: number | null;
    finalGrade: string | null;
}

export interface AttendanceSummaryData {
    sick: number;
    permission: number;
    alpha: number;
}

export interface EkskulSummaryItem {
    name: string;
    type: "Wajib" | "Pilihan";
    score: "A" | "B" | "C";
    predicate: "Sangat Baik" | "Baik" | "Cukup";
    description: string;
    instructor: string;
    attendanceRate: number;
}

export const getChildGrades = async (
    childId: string,
    academicYearId?: string
): Promise<GradeItem[]> => {
    const params = new URLSearchParams();
    if (academicYearId && academicYearId !== "all") params.append("academic_year_id", academicYearId);

    const response = await fetch(`${PARENT_API_URL}/children/${childId}/grades?${params}`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (result.data ?? []).map((item: Record<string, any>): GradeItem => ({
        id: item.id,
        subject: item.subject ?? "",
        teacher: item.teacher ?? "",
        kkm: item.kkm ?? 75,
        ki3Average: item.ki3Average ?? item.ki3_average ?? null,
        ki3Predicate: item.ki3Predicate ?? item.ki3_predicate ?? null,
        ki3Scores: item.ki3Scores ?? item.ki3_scores ?? [],
        ki4Average: item.ki4Average ?? item.ki4_average ?? null,
        ki4Predicate: item.ki4Predicate ?? item.ki4_predicate ?? null,
        ki4Scores: item.ki4Scores ?? item.ki4_scores ?? [],
        finalAverage: item.finalAverage ?? item.final_average ?? null,
        finalGrade: item.finalGrade ?? item.final_grade ?? null,
    }));
};

export const getChildAttendanceSummary = async (
    childId: string,
    academicYearId?: string
): Promise<AttendanceSummaryData> => {
    const params = new URLSearchParams();
    if (academicYearId) params.append("academic_year_id", academicYearId);

    const response = await fetch(`${PARENT_API_URL}/children/${childId}/attendance/subject?${params}`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) return { sick: 0, permission: 0, alpha: 0 };
    const result = await response.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const records: Record<string, any>[] = result.data ?? [];
    const sick = records.filter(r => r.status === "excused").length;
    const permission = records.filter(r => r.status === "late").length;
    const alpha = records.filter(r => r.status === "absent").length;

    return { sick, permission, alpha };
};

export const getChildEkskulSummary = async (
    childId: string,
    academicYearId?: string
): Promise<EkskulSummaryItem[]> => {
    const params = new URLSearchParams();
    if (academicYearId) params.append("academic_year_id", academicYearId);

    const response = await fetch(`${PARENT_API_URL}/children/${childId}/attendance/extracurricular?${params}`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) return [];
    const result = await response.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const records: Record<string, any>[] = result.data ?? [];

    // Group by extracurricular name and compute attendance rate
    const grouped: Record<string, { total: number; hadir: number }> = {};
    for (const r of records) {
        const name = r.extracurricularName ?? "Ekstrakurikuler";
        if (!grouped[name]) grouped[name] = { total: 0, hadir: 0 };
        grouped[name].total++;
        if (r.status === "hadir") grouped[name].hadir++;
    }

    return Object.entries(grouped).map(([name, stat]) => {
        const rate = stat.total > 0 ? Math.round((stat.hadir / stat.total) * 100) : 0;
        const score: "A" | "B" | "C" = rate >= 85 ? "A" : rate >= 75 ? "B" : "C";
        const predicate: "Sangat Baik" | "Baik" | "Cukup" = rate >= 85 ? "Sangat Baik" : rate >= 75 ? "Baik" : "Cukup";
        return {
            name,
            type: "Wajib" as const,
            score,
            predicate,
            description: `Tingkat kehadiran ${rate}% dari ${stat.total} pertemuan`,
            instructor: "-",
            attendanceRate: rate,
        };
    });
};
