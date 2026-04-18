import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBehaviorData, getParentChildren, type ViolationRecord, type ChildInfo } from "../services/parentBehaviorService";

export const useParentBehavior = () => {
    const [selectedChildId, setSelectedChildId] = useState<string>("");
    const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>("all");
    const [locationFilter, setLocationFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isFetchingOverlay, setIsFetchingOverlay] = useState(false);

    const childrenQuery = useQuery<ChildInfo[]>({
        queryKey: ["parent-children"],
        queryFn: getParentChildren,
        staleTime: 5 * 60 * 1000,
    });

    const children = childrenQuery.data ?? [];
    const effectiveChildId = selectedChildId || children[0]?.id || "";

    const behaviorQuery = useQuery<ViolationRecord[]>({
        queryKey: ["parent-behavior", effectiveChildId],
        queryFn: async () => {
            const data = await getBehaviorData(effectiveChildId);
            return data.records;
        },
        enabled: !!effectiveChildId,
        staleTime: 2 * 60 * 1000,
        select: (records) => {
            // Auto-select latest year on first load
            if (selectedAcademicYear === "all" && records.length > 0) {
                const years = [...new Set(records.map(r => r.academicYearId))].sort((a, b) => b.localeCompare(a));
                if (years[0]) setSelectedAcademicYear(years[0]);
            }
            return records;
        },
    });

    const allRecords = useMemo(() => behaviorQuery.data ?? [], [behaviorQuery.data]);

    const academicYears = useMemo(() => {
        const unique = new Set(allRecords.map(r => r.academicYearId));
        return Array.from(unique).sort((a, b) => b.localeCompare(a));
    }, [allRecords]);

    const recordsForYear = useMemo(() => {
        if (selectedAcademicYear === "all") return allRecords;
        return allRecords.filter(r => r.academicYearId === selectedAcademicYear);
    }, [allRecords, selectedAcademicYear]);

    const stats = useMemo(() => ({
        totalViolations: recordsForYear.length,
        schoolViolations: recordsForYear.filter(r => r.location === "sekolah").length,
        dormViolations: recordsForYear.filter(r => r.location === "asrama").length,
    }), [recordsForYear]);

    const filteredRecords = useMemo(() =>
        recordsForYear.filter(r => locationFilter === "all" || r.location === locationFilter),
        [recordsForYear, locationFilter]
    );

    const totalItems = filteredRecords.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pagedRecords = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredRecords.slice(start, start + itemsPerPage);
    }, [filteredRecords, currentPage, itemsPerPage]);

    const triggerFetchingOverlay = () => {
        setIsFetchingOverlay(true);
        setTimeout(() => setIsFetchingOverlay(false), 300);
    };

    const error = childrenQuery.error instanceof Error
        ? childrenQuery.error.message
        : behaviorQuery.error instanceof Error
        ? behaviorQuery.error.message
        : null;

    return {
        children,
        selectedChildId: effectiveChildId,
        setSelectedChildId,
        filteredRecords: pagedRecords,
        allFilteredCount: totalItems,
        stats,
        academicYears,
        selectedAcademicYear,
        handleAcademicYearChange: (val: string) => { setSelectedAcademicYear(val); setCurrentPage(1); triggerFetchingOverlay(); },
        locationFilter,
        handleLocationChange: (val: string) => { setLocationFilter(val); setCurrentPage(1); triggerFetchingOverlay(); },
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        totalPages,
        showPagination: totalItems > 10,
        isLoading: childrenQuery.isLoading || (!!effectiveChildId && behaviorQuery.isLoading),
        isFetching: childrenQuery.isFetching || behaviorQuery.isFetching || isFetchingOverlay,
        error,
        refetch: () => behaviorQuery.refetch(),
        triggerFetchingOverlay,
    };
};
