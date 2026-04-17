import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { alumniService } from '../services/alumniService';
import { AlumniFilters } from '../types/alumni';

export const ALUMNI_KEYS = {
    all:  ['admin-alumni'] as const,
    list: (f: AlumniFilters) => ['admin-alumni', 'list', f] as const,
};

export function useAlumniList() {
    const [filters, setFiltersState] = useState<AlumniFilters>({ page: 1, per_page: 15 });

    const { data, isLoading, isFetching, isError } = useQuery({
        queryKey: ALUMNI_KEYS.list(filters),
        queryFn:  () => alumniService.getAlumni(filters),
        staleTime: 0,
        placeholderData: (prev) => prev,
    });

    const setFilters = useCallback((f: Partial<AlumniFilters>) =>
        setFiltersState((prev) => ({ ...prev, ...f })), []);

    return {
        alumni: data?.data ?? [], meta: data?.meta,
        isLoading, isFetching, isError,
        filters, setFilters,
    };
}
