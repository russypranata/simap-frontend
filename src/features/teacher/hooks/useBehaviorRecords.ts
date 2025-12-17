import { useState, useEffect, useCallback } from "react";
import {
    getBehaviorRecords,
    createBehaviorRecord,
    GetBehaviorRecordsParams,
    CreateBehaviorRecordData,
    BehaviorRecordWithStudent,
    PaginatedResponse,
} from "../services/behaviorService";

export interface UseBehaviorRecordsResult {
    records: BehaviorRecordWithStudent[];
    loading: boolean;
    error: string | null;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    refetch: () => Promise<void>;
    createRecord: (data: CreateBehaviorRecordData) => Promise<boolean>;
    setPage: (page: number) => void;
    setLimit: (limit: number) => void;
}

export const useBehaviorRecords = (
    params: GetBehaviorRecordsParams = {}
): UseBehaviorRecordsResult => {
    const [records, setRecords] = useState<BehaviorRecordWithStudent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(params.page || 1);
    const [limit, setLimit] = useState(params.limit || 5);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 5,
        total: 0,
        totalPages: 0,
    });

    const fetchRecords = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await getBehaviorRecords({
                ...params,
                page,
                limit,
            });

            setRecords(response.data);
            setPagination(response.pagination);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch records");
            setRecords([]);
        } finally {
            setLoading(false);
        }
    }, [params, page, limit]);

    useEffect(() => {
        fetchRecords();
    }, [fetchRecords]);

    const createRecord = async (data: CreateBehaviorRecordData): Promise<boolean> => {
        try {
            setError(null);
            await createBehaviorRecord(data);
            await fetchRecords(); // Refresh list
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create record");
            return false;
        }
    };

    return {
        records,
        loading,
        error,
        pagination,
        refetch: fetchRecords,
        createRecord,
        setPage,
        setLimit,
    };
};
