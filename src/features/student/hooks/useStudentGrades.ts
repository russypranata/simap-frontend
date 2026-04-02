"use client";

import { useState, useMemo, useEffect } from "react";
import { getStudentGrades, getStudentSemesterHistory, type SubjectGrade, type SemesterSummary } from "../services/studentGradesService";

export const useStudentGrades = () => {
    const [grades, setGrades] = useState<SubjectGrade[]>([]);
    const [semesterHistory, setSemesterHistory] = useState<SemesterSummary[]>([]);
    const [selectedSemester, setSelectedSemester] = useState("current");
    const [activeTab, setActiveTab] = useState("all");

    useEffect(() => {
        getStudentGrades().then(setGrades);
        getStudentSemesterHistory().then(setSemesterHistory);
    }, []);

    const stats = useMemo(() => {
        if (grades.length === 0) return null;
        const totalAverage = grades.reduce((sum, g) => sum + g.averageScore, 0) / grades.length;
        const highestSubject = grades.reduce((prev, current) =>
            prev.averageScore > current.averageScore ? prev : current
        );
        const lowestSubject = grades.reduce((prev, current) =>
            prev.averageScore < current.averageScore ? prev : current
        );
        const aboveKKM = grades.filter(g => g.averageScore >= g.kkm).length;
        return {
            totalAverage: Math.round(totalAverage * 10) / 10,
            highestSubject,
            lowestSubject,
            aboveKKM,
            totalSubjects: grades.length,
        };
    }, [grades]);

    const currentSemester = semesterHistory[0] ?? null;
    const previousSemester = semesterHistory[1] ?? null;

    return {
        grades,
        semesterHistory,
        selectedSemester,
        setSelectedSemester,
        activeTab,
        setActiveTab,
        stats,
        currentSemester,
        previousSemester,
    };
};
