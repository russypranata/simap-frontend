import { useState, useEffect, useCallback } from "react";
import {
    getStudents,
    GetStudentsParams,
    Student,
    PaginatedResponse,
} from "../services/behaviorService";

export interface UseStudentsResult {
    students: Student[];
    loading: boolean;
    error: string | null;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    refetch: () => Promise<void>;
    setPage: (page: number) => void;
    setLimit: (limit: number) => void;
}

export const useStudents = (
    params: GetStudentsParams = {}
): UseStudentsResult => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(params.page || 1);
    const [limit, setLimit] = useState(params.limit || 10);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    });

    const fetchStudents = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await getStudents({
                ...params,
                page,
                limit,
            });

            setStudents(response.data);
            setPagination(response.pagination);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch students");
            setStudents([]);
        } finally {
            setLoading(false);
        }
    }, [params, page, limit]);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    return {
        students,
        loading,
        error,
        pagination,
        refetch: fetchStudents,
        setPage,
        setLimit,
    };
};
