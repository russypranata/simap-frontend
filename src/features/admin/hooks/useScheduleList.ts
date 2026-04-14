import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { scheduleService } from '../services/scheduleService';
import { ScheduleFormValues } from '../schemas/scheduleSchema';
import { DAY_MAP } from '../types/schedule';

export const SCHEDULE_KEYS = {
    all: ['admin-schedules'] as const,
};

export const useScheduleList = () => {
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const query = useQuery({
        queryKey: SCHEDULE_KEYS.all,
        queryFn: scheduleService.getSchedules,
        staleTime: 0,
        gcTime: 5 * 60 * 1000,
    });

    const invalidate = () =>
        queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all });

    const createSchedule = async (values: ScheduleFormValues) => {
        setIsSubmitting(true);
        try {
            await scheduleService.createSchedule({
                subject_id: values.subjectId,
                class_id: values.classId,
                teacher_id: values.teacherId || undefined,
                day_of_week: DAY_MAP[values.day],
                start_time: values.startTime,
                end_time: values.endTime,
            });
            toast.success('Jadwal berhasil ditambahkan');
            invalidate();
        } catch (error: any) {
            toast.error(error?.message ?? 'Gagal membuat jadwal');
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateSchedule = async (id: string, values: ScheduleFormValues) => {
        setIsSubmitting(true);
        try {
            await scheduleService.updateSchedule(id, {
                subject_id: values.subjectId,
                class_id: values.classId,
                teacher_id: values.teacherId || undefined,
                day_of_week: DAY_MAP[values.day],
                start_time: values.startTime,
                end_time: values.endTime,
            });
            toast.success('Jadwal berhasil diperbarui');
            invalidate();
        } catch (error: any) {
            toast.error(error?.message ?? 'Gagal memperbarui jadwal');
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteSchedule = async (id: string) => {
        setIsDeleting(true);
        try {
            await scheduleService.deleteSchedule(id);
            toast.success('Jadwal berhasil dihapus');
            invalidate();
        } catch {
            toast.error('Gagal menghapus jadwal');
        } finally {
            setIsDeleting(false);
        }
    };

    const deleteBulk = async (ids: string[]) => {
        setIsDeleting(true);
        try {
            await Promise.all(ids.map(id => scheduleService.deleteSchedule(id)));
            toast.success(`${ids.length} jadwal berhasil dihapus`);
            invalidate();
        } catch {
            toast.error('Gagal menghapus jadwal');
        } finally {
            setIsDeleting(false);
        }
    };

    return {
        schedules: query.data ?? [],
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isSubmitting,
        isDeleting,
        createSchedule,
        updateSchedule,
        deleteSchedule,
        deleteBulk,
    };
};
