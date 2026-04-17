import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { timeSlotService, DayKey, TimeSlot, TimeSlotPayload } from '../services/timeSlotService';

export const TIME_SLOT_KEYS = {
    day: (day: DayKey) => ['admin-time-slots', day] as const,
};

export const useTimeSlots = (day: DayKey) => {
    const queryClient = useQueryClient();
    const [isSaving, setIsSaving] = useState(false);

    const query = useQuery({
        queryKey: TIME_SLOT_KEYS.day(day),
        queryFn: () => timeSlotService.getByDay(day),
        staleTime: 5 * 60 * 1000, // jam pelajaran jarang berubah
        gcTime: 10 * 60 * 1000,
    });

    const save = async (slots: TimeSlot[]) => {
        setIsSaving(true);
        try {
            const payload: TimeSlotPayload[] = slots.map((s, i) => ({
                label: s.label,
                start_time: s.startTime,
                end_time: s.endTime,
                order: i,
                type: s.type,
            }));

            await timeSlotService.bulkUpdate(day, payload);
            queryClient.invalidateQueries({ queryKey: TIME_SLOT_KEYS.day(day) });
            toast.success(`Konfigurasi hari berhasil disimpan`);
        } catch (err: Error | unknown) {
            toast.error((err as Error)?.message ?? 'Gagal menyimpan slot waktu');
            throw err;
        } finally {
            setIsSaving(false);
        }
    };

    return {
        slots: query.data ?? [],
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isSaving,
        save,
    };
};
