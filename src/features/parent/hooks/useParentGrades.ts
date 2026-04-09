import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { SubjectGrade, AcademicYear, AttitudeScore, AttendanceSummary, Extracurricular, SemesterSummary } from "../components/grades";
import { getChildGrades } from "../services/parentGradesService";
import { getParentChildren } from "../services/parentDashboardService";
import { getAcademicYears } from "../services/parentApiClient";

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

// Map API academic year to local AcademicYear shape
// Backend returns: { id, name, is_active, start_date, end_date }
// name format: "2025/2026" — derive semesters from is_active
const mapApiYears = (apiYears: Awaited<ReturnType<typeof getAcademicYears>>): AcademicYear[] =>
    apiYears.map(y => ({
        id: String(y.id),
        year: y.name,
        semesters: [
            { id: "ganjil", label: "Ganjil", status: y.isActive ? "active" : "completed" },
            { id: "genap",  label: "Genap",  status: y.isActive ? "upcoming" : "completed" },
        ],
    }));

export const useParentGrades = () => {
    const [selectedChildId, setSelectedChildId] = useState<string>("");
    const [selectedYearId, setSelectedYearId] = useState<string>("");
    const [selectedSemester, setSelectedSemester] = useState<string>("ganjil");
    const [selectedTab, setSelectedTab] = useState("nilai");
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedGrade, setSelectedGrade] = useState<SubjectGrade | null>(null);

    // Fetch children list
    const childrenQuery = useQuery({
        queryKey: ["parent-children"],
        queryFn: getParentChildren,
    });

    // Fetch academic years from API
    const academicYearsQuery = useQuery({
        queryKey: ["academic-years"],
        queryFn: getAcademicYears,
        staleTime: 5 * 60 * 1000, // 5 menit — jarang berubah
    });

    const academicYears: AcademicYear[] = useMemo(
        () => mapApiYears(academicYearsQuery.data ?? []),
        [academicYearsQuery.data]
    );

    // Auto-set default year setelah data tersedia
    const effectiveYearId = useMemo(() => {
        if (selectedYearId) return selectedYearId;
        return getDefaultYearId(academicYears);
    }, [selectedYearId, academicYears]);

    const effectiveSemester = useMemo(() => {
        if (selectedYearId) return selectedSemester; // user sudah pilih manual
        return getDefaultSemester(academicYears, effectiveYearId);
    }, [selectedYearId, selectedSemester, academicYears, effectiveYearId]);

    const children = (childrenQuery.data ?? []).map(c => ({
        id: c.id,
        name: c.name,
        class: c.class,
        nis: c.nis,
    }));

    const effectiveChildId = selectedChildId || children[0]?.id || "";

    // Fetch grades
    const gradesQuery = useQuery({
        queryKey: ["parent-grades", effectiveChildId, effectiveYearId],
        queryFn: () => getChildGrades(effectiveChildId, effectiveYearId),
        enabled: !!effectiveChildId && !!effectiveYearId,
    });

    const selectedChild = children.find(c => c.id === effectiveChildId);
    const activeYear = academicYears.find(y => y.id === effectiveYearId);
    const displaySemester = effectiveSemester === "ganjil" ? "Ganjil" : "Genap";
    const currentSemesterStatus = activeYear?.semesters.find(s => s.id === effectiveSemester)?.status ?? "completed";
    const isReportAvailable = currentSemesterStatus === "completed";

    // Map API grades to SubjectGrade shape
    const grades: SubjectGrade[] = useMemo(() => {
        return (gradesQuery.data ?? []).map(item => ({
            id: item.id,
            subject: item.subject,
            teacher: item.teacher,
            ki3Scores: [],
            ki3Average: item.ki3Average ?? 0,
            ki3Predicate: item.ki3Predicate ?? "-",
            ki3Description: "",
            ki4Scores: [],
            ki4Average: item.ki4Average ?? 0,
            ki4Predicate: item.ki4Predicate ?? "-",
            ki4Description: "",
            finalAverage: item.finalAverage ?? 0,
            finalGrade: item.finalGrade ?? "-",
            kkm: item.kkm,
            academicYear: effectiveYearId,
            semester: effectiveSemester,
        }));
    }, [gradesQuery.data, effectiveYearId, effectiveSemester]);

    const stats = useMemo(() => {
        if (grades.length === 0) return {
            totalAverage: 0, highestSubject: null, lowestSubject: null,
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

    const handleApplyFilter = useCallback((yearId: string, semester: string) => {
        setSelectedYearId(yearId);
        setSelectedSemester(semester);
    }, []);

    const isLoading = childrenQuery.isLoading || gradesQuery.isLoading || academicYearsQuery.isLoading;

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
        selectedChildId: effectiveChildId, setSelectedChildId,
        selectedYearId: effectiveYearId, selectedSemester: effectiveSemester,
        selectedTab, setSelectedTab,
        filterOpen, setFilterOpen,
        selectedGrade, setSelectedGrade,
        isLoading,
        error,
        handleApplyFilter,
    };
};
