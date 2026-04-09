import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { SubjectGrade, AcademicYear, AttitudeScore, AttendanceSummary, Extracurricular, SemesterSummary } from "../components/grades";
import { getChildGrades } from "../services/parentGradesService";
import { getParentChildren } from "../services/parentDashboardService";

// Academic years — fetched from API in future; static for now as backend doesn't have a parent-specific endpoint yet
const academicYears: AcademicYear[] = [
    {
        id: "2025-2026", year: "2025/2026",
        semesters: [
            { id: "ganjil", label: "Ganjil", status: "active" },
            { id: "genap", label: "Genap", status: "upcoming" },
        ],
    },
    {
        id: "2024-2025", year: "2024/2025",
        semesters: [
            { id: "genap", label: "Genap", status: "completed" },
            { id: "ganjil", label: "Ganjil", status: "completed" },
        ],
    },
];

const defaultAttitude: AttitudeScore = {
    spiritual: { score: "A", predicate: "Sangat Baik", description: "-" },
    social: { score: "A", predicate: "Sangat Baik", description: "-" },
};
const defaultAttendance: AttendanceSummary = { sick: 0, permission: 0, alpha: 0 };
const defaultExtracurriculars: Extracurricular[] = [];
const defaultSemesterHistory: SemesterSummary[] = [];
const defaultReportCardNotes: { category: string; note: string; icon: string }[] = [];

const getDefaultYearId = () => {
    for (const year of academicYears) {
        if (year.semesters.some(s => s.status === "completed")) return year.id;
    }
    return academicYears[0]?.id ?? "2025-2026";
};

const getDefaultSemester = () => {
    for (const year of academicYears) {
        const completed = year.semesters.find(s => s.status === "completed");
        if (completed) return completed.id;
    }
    return "ganjil";
};

export const useParentGrades = () => {
    const [selectedChildId, setSelectedChildId] = useState<string>("");
    const [selectedYearId, setSelectedYearId] = useState(getDefaultYearId);
    const [selectedSemester, setSelectedSemester] = useState(getDefaultSemester);
    const [selectedTab, setSelectedTab] = useState("nilai");
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedGrade, setSelectedGrade] = useState<SubjectGrade | null>(null);

    // Fetch children list
    const childrenQuery = useQuery({
        queryKey: ["parent-children"],
        queryFn: getParentChildren,
    });

    const children = (childrenQuery.data ?? []).map(c => ({
        id: c.id,
        name: c.name,
        class: c.class,
        nis: c.nis,
    }));

    // Auto-select first child
    const effectiveChildId = selectedChildId || children[0]?.id || "";

    // Fetch grades
    const gradesQuery = useQuery({
        queryKey: ["parent-grades", effectiveChildId, selectedYearId],
        queryFn: () => getChildGrades(effectiveChildId, selectedYearId),
        enabled: !!effectiveChildId,
    });

    const selectedChild = children.find(c => c.id === effectiveChildId);
    const activeYear = academicYears.find(y => y.id === selectedYearId);
    const displaySemester = selectedSemester === "ganjil" ? "Ganjil" : "Genap";
    const currentSemesterStatus = activeYear?.semesters.find(s => s.id === selectedSemester)?.status ?? "completed";
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
            academicYear: selectedYearId,
            semester: selectedSemester,
        }));
    }, [gradesQuery.data, selectedYearId, selectedSemester]);

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

    const isLoading = childrenQuery.isLoading || gradesQuery.isLoading;

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
        selectedYearId, selectedSemester,
        selectedTab, setSelectedTab,
        filterOpen, setFilterOpen,
        selectedGrade, setSelectedGrade,
        isLoading,
        handleApplyFilter,
    };
};
