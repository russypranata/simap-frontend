import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { subjectService } from "../services/subjectService";

export const SUBJECT_KEYS = {
    all: ["admin-subjects"] as const,
};

export const useSubjectList = () => {
    const queryClient = useQueryClient();
    const [isDeleting, setIsDeleting] = useState(false);

    const query = useQuery({
        queryKey: SUBJECT_KEYS.all,
        queryFn: subjectService.getSubjects,
        staleTime: 0,
        gcTime: 5 * 60 * 1000,
    });

    const invalidate = () =>
        queryClient.invalidateQueries({ queryKey: SUBJECT_KEYS.all });

    const deleteSubject = async (id: string) => {
        setIsDeleting(true);
        try {
            await subjectService.deleteSubject(id);
            toast.success("Mata pelajaran berhasil dihapus");
            invalidate();
        } catch {
            toast.error("Gagal menghapus mata pelajaran");
        } finally {
            setIsDeleting(false);
        }
    };

    const deleteBulk = async (ids: string[]) => {
        setIsDeleting(true);
        try {
            await Promise.all(ids.map((id) => subjectService.deleteSubject(id)));
            toast.success(`${ids.length} mata pelajaran berhasil dihapus`);
            invalidate();
        } catch {
            toast.error("Gagal menghapus data");
        } finally {
            setIsDeleting(false);
        }
    };

    return {
        subjects: query.data ?? [],
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isDeleting,
        deleteSubject,
        deleteBulk,
    };
};
