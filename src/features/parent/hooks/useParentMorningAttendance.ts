import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMorningTardiness, getParentChildren, getAcademicYears, type LateRecord, type ChildInfo } from "../services/parentMorningAttendanceService";
import type { AcademicYearItem as AcademicYear } from "../services/parentApiClient";

export const useParentMorningAttendance = () => {
    const [selectedChildId, setSelectedChildId] = useState<string>("");
    const [selectedYearId, setSelectedYearId] = useState<string>("all");
    const [selectedSemesterId, setSelectedSemesterId] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const childrenQuery = useQuery<ChildInfo[]>({
        queryKey: ["parent-children"],
        queryFn: getParentChildren,
        staleTime: 5 * 60 * 1000,
    });

    const academicYearsQuery = useQuery<AcademicYear[]>({
        queryKey: ["academic-years"],
        queryFn: getAcademicYears,
        staleTime: 10 * 60 * 1000,
    });

    const children = childrenQuery.data ?? [];
    const academicYears = academicYearsQuery.data ?? [];
    const effectiveChildId = selectedChildId || children[0]?.id || "";

    // Auto-select active year on first load
    const effectiveYearId = useMemo(() => {
        if (selectedYearId !== "all") return selectedYearId;
        const active = academicYears.find(y => y.isActive);
        return active?.id ?? "all";
    }, [selectedYearId, academicYears]);

    const morningQuery = useQuery<LateRecord[]>({
        queryKey: ["parent-morning", effectiveChildId, effectiveYearId, selectedSemesterId],
        queryFn: () => getMorningTardiness(effectiveChildId, effectiveYearId, selectedSemesterId),
        enabled: !!effectiveChildId,
        staleTime: 2 * 60 * 1000,
    });

    const records = morningQuery.data ?? [];
    const totalItems = records.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const pagedRecords = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return records.slice(start, start + itemsPerPage);
    }, [records, currentPage, itemsPerPage]);

    const error = childrenQuery.error instanceof Error
        ? childrenQuery.error.message
        : morningQuery.error instanceof Error
        ? morningQuery.error.message
        : null;

    return {
        records: pagedRecords,
        totalRecords: totalItems,
        children,
        academicYears,
        selectedChildId: effectiveChildId,
        selectedYearId: effectiveYearId,
        selectedSemesterId,
        isLoading: childrenQuery.isLoading || academicYearsQuery.isLoading || (!!effectiveChildId && morningQuery.isLoading),
        isFetching: childrenQuery.isFetching || morningQuery.isFetching,
        error,
        setSelectedChildId,
        setSelectedYearId: (id: string) => { setSelectedYearId(id); setCurrentPage(1); },
        setSelectedSemesterId: (id: string) => { setSelectedSemesterId(id); setCurrentPage(1); },
        refetch: () => morningQuery.refetch(),
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage: (val: number) => { setItemsPerPage(val); setCurrentPage(1); },
        totalPages,
        showPagination: totalItems > 10,
    };
};
