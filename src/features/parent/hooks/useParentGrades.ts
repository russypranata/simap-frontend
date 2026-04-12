import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { SubjectGrade, AcademicYear, AttitudeScore, AttendanceSummary, Extracurricular, SemesterSummary } from "../components/grades";
import { getChildGrades } from "../services/parentGradesService";
import { getParentChildren } from "../services/parentDashboardService";

const defaultAttitude: AttitudeScore = {
    spiritual: { score: "A", predicate: "Sangat Baik", description: "-" },
    social: { score: "A", predicate: "Sangat Baik", description: "-" },
};
const defaultAttendance: AttendanceSummary = { sick: 0, permission: 0, alpha: 0 };
const defaultExtracurriculars: Extracurricular[] = [];
const defaultSemesterHistory: SemesterSummary[] = [];
const defaultReportCardNotes: { category: string; note: string; icon: string }[] = [];

const getDefaultYearId = (years: AcademicYear[]): string => {
    const active = years.find(y => y.semesters.some(s => s.status === "active"));
    if (active) return active.id;
    const withCompleted = years.find(y => y.semesters.some(s => s.status === "completed"));
    return withCompleted?.id ?? years[0]?.id ?? "";
};

const getDefaultSemester = (years: AcademicYear[], yearId: string): string => {
    const year = years.find(y => y.id === yearId);
    const active = year?.semesters.find(s => s.status === "active");
    if (active) return active.id;
    const completed = year?.semesters.find(s => s.status === "completed");
    return completed?.id ?? "ganjil";
};

export const useParentGrades = () => {
    const [selectedChildId, setSelectedChildId] = useState<string>("");
    const [selectedYearId, setSelectedYearId] = useState<string>("");
    const [selectedSemester, setSelectedSemester] = useState<string>("ganjil");
    const [selectedTab, setSelectedTab] = useState("nilai");
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedGrade, setSelectedGrade] = useState<SubjectGrade | null>(null);

    // Fetch children list — staleTime 5 menit, jarang berubah
    const childrenQuery = useQuery({
        queryKey: ["parent-children"],
        queryFn: getParentChildren,
        staleTime: 5 * 60 * 1000,
    });

    const children = (childrenQuery.data ?? []).map(c => ({
        id: c.id,
        name: c.name,
        class: c.class,
        nis: c.nis,
        enrolledYears: c.enrolledYears ?? [],
    }));

    const effectiveChildId = selectedChildId || children[0]?.id || "";
    const activeChild = children.find(c => c.id === effectiveChildId);

    // Academic years derived from child's enrolledYears — same pattern as schedule
    const academicYears: AcademicYear[] = useMemo(() => {
        return (activeChild?.enrolledYears ?? []).map(y => ({
            id: y.id,
            year: y.name,
            semesters: [
                { id: "ganjil", label: "Ganjil", status: (y.isActive ? "active" : "completed") as "active" | "completed" | "upcoming" },
                { id: "genap",  label: "Genap",  status: (y.isActive ? "upcoming" : "completed") as "active" | "completed" | "upcoming" },
            ],
        }));
    }, [activeChild]);

    const effectiveYearId = useMemo(() => {
        if (selectedYearId && academicYears.some(y => y.id === selectedYearId)) return selectedYearId;
        return getDefaultYearId(academicYears);
    }, [selectedYearId, academicYears]);

    const effectiveSemester = useMemo(() => {
        if (selectedYearId) return selectedSemester;
        return getDefaultSemester(academicYears, effectiveYearId);
    }, [selectedYearId, selectedSemester, academicYears, effectiveYearId]);

    // Fetch grades — staleTime 0, gcTime default 5 menit (konsisten dengan halaman lain)
    const gradesQuery = useQuery({
        queryKey: ["parent-grades", effectiveChildId, effectiveYearId, effectiveSemester],
        queryFn: () => getChildGrades(effectiveChildId, effectiveYearId),
        enabled: !!effectiveChildId && !!effectiveYearId,
        staleTime: 0,
    });

    const selectedChild = children.find(c => c.id === effectiveChildId);
    const activeYear = academicYears.find(y => y.id === effectiveYearId);
    const displaySemester = effectiveSemester === "ganjil" ? "Ganjil" : "Genap";
    const currentSemesterStatus = activeYear?.semesters.find(s => s.id === effectiveSemester)?.status ?? "completed";
    // Show report if there are grades — don't block on semester status
    const isReportAvailable = (gradesQuery.data?.length ?? 0) > 0 || currentSemesterStatus === "completed";

    // Map API grades to SubjectGrade shape
    const grades: SubjectGrade[] = useMemo(() => {
        return (gradesQuery.data ?? []).map(item => ({
            id: item.id,
            subject: item.subject,
            teacher: item.teacher,
            ki3Scores: item.ki3Scores ?? [],
            ki3Average: item.ki3Average ?? 0,
            ki3Predicate: item.ki3Predicate ?? "-",
            ki3Description: "",
            ki4Scores: item.ki4Scores ?? [],
            ki4Average: item.ki4Average ?? 0,
            ki4Predicate: item.ki4Predicate ?? "-",
            ki4Description: "",
            finalAverage: item.finalAverage ?? 0,
            finalGrade: item.finalGrade ?? "-",
            kkm: item.kkm,
            academicYear: effectiveYearId,
            semester: effectiveSemester as "ganjil" | "genap",
        }));
    }, [gradesQuery.data, effectiveYearId, effectiveSemester]);

    const stats = useMemo(() => {
        if (grades.length === 0) return {
            totalAverage: 0,
            highestSubject: { subject: "-", finalAverage: 0 },
            lowestSubject: { subject: "-", finalAverage: 0 },
            aboveKKM: 0, totalSubjects: 0, currentRank: "-", totalStudents: "-",
        };
        const totalAverage = grades.reduce((sum, g) => sum + g.finalAverage, 0) / grades.length;
        const highestSubject = grades.reduce((prev, cur) => prev.finalAverage > cur.finalAverage ? prev : cur);
        const lowestSubject = grades.reduce((prev, cur) => prev.finalAverage < cur.finalAverage ? prev : cur);
        const aboveKKM = grades.filter(g => g.finalAverage >= g.kkm).length;
        return {
            totalAverage: Math.round(totalAverage * 10) / 10,
            highestSubject, lowestSubject, aboveKKM,
            totalSubjects: grades.length, currentRank: "-", totalStudents: "-",
        };
    }, [grades]);

    // Reset year/semester when child changes
    const handleSetSelectedChildId = useCallback((id: string) => {
        setSelectedChildId(id);
        setSelectedYearId("");
        setSelectedSemester("ganjil");
    }, []);

    const handleApplyFilter = useCallback((yearId: string, semester: string) => {
        setSelectedYearId(yearId);
        setSelectedSemester(semester);
    }, []);

    const isLoading = childrenQuery.isLoading || (!!effectiveChildId && !!effectiveYearId && gradesQuery.isLoading);
    const isFetching = childrenQuery.isFetching || gradesQuery.isFetching;

    const error = childrenQuery.error instanceof Error
        ? childrenQuery.error.message
        : gradesQuery.error instanceof Error
        ? gradesQuery.error.message
        : null;

    return {
        children, selectedChild, academicYears, activeYear,
        grades,
        attitude: defaultAttitude,
        extracurriculars: defaultExtracurriculars,
        attendance: defaultAttendance,
        semesterHistory: defaultSemesterHistory,
        reportCardNotes: defaultReportCardNotes,
        stats, isReportAvailable, displaySemester, currentSemesterStatus,
        selectedChildId: effectiveChildId, setSelectedChildId: handleSetSelectedChildId,
        selectedYearId: effectiveYearId, selectedSemester: effectiveSemester,
        selectedTab, setSelectedTab,
        filterOpen, setFilterOpen,
        selectedGrade, setSelectedGrade,
        isLoading, isFetching,
        error,
        handleApplyFilter,
    };
};
