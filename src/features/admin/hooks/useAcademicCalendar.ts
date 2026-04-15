import { useState, useMemo, useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CalendarEvent } from '../types/calendar';
import { CalendarEventFormValues } from '../schemas/calendarSchema';
import { calendarEventService } from '../services/calendarEventService';
import { formatLocalDate, parseLocalDate } from '@/lib/dateUtils';

export const CALENDAR_KEYS = {
    all: ['calendar-events'] as const,
    byMonth: (year: number, month: number) =>
        ['calendar-events', year, month] as const,
};

export const useAcademicCalendar = () => {
    // Stable today reference — tidak berubah selama session
    const todayRef = useRef(new Date());
    const today = todayRef.current;

    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());

    // Modal & Form State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedEventDetail, setSelectedEventDetail] = useState<CalendarEvent | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; id: string | null }>({
        isOpen: false,
        id: null,
    });
    const [isSyncConfirmOpen, setIsSyncConfirmOpen] = useState(false);
    const [intendedType, setIntendedType] = useState<'event' | 'holiday'>('event');

    const queryClient = useQueryClient();

    // Format month param: YYYY-MM
    const monthParam = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;

    // -- Data Fetching --
    const {
        data: events = [],
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: CALENDAR_KEYS.byMonth(currentYear, currentMonth),
        queryFn: () => calendarEventService.getCalendarEvents({ month: monthParam }),
        staleTime: 2 * 60 * 1000, // 2 menit
    });

    // -- Optimized Map --
    const eventMap = useMemo(() => {
        const map = new Map<string, CalendarEvent[]>();
        events.forEach(event => {
            const startDate = parseLocalDate(event.startDate);
            const endDate = parseLocalDate(event.endDate);
            const current = new Date(startDate);
            while (current <= endDate) {
                const dateKey = formatLocalDate(current);
                if (!map.has(dateKey)) map.set(dateKey, []);
                map.get(dateKey)?.push(event);
                current.setDate(current.getDate() + 1);
            }
        });
        return map;
    }, [events]);

    const getEventsForDate = useCallback(
        (dateStr: string) => eventMap.get(dateStr) || [],
        [eventMap]
    );

    // -- Mutations --
    const invalidateCalendar = () =>
        queryClient.invalidateQueries({ queryKey: CALENDAR_KEYS.all });

    const createMutation = useMutation({
        mutationFn: calendarEventService.createCalendarEvent,
        onSuccess: (_, values) => {
            invalidateCalendar();
            const label = values.type === 'holiday' ? 'Hari libur' : 'Kegiatan';
            toast.success(`${label} berhasil ditambahkan`);
        },
        onError: () => toast.error('Gagal menambahkan event kalender'),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, values }: { id: string; values: CalendarEventFormValues }) =>
            calendarEventService.updateCalendarEvent(id, values),
        onSuccess: (_, { values }) => {
            invalidateCalendar();
            const label = values.type === 'holiday' ? 'Hari libur' : 'Kegiatan';
            toast.success(`${label} berhasil diperbarui`);
            setEditingId(null);
        },
        onError: () => toast.error('Gagal memperbarui event kalender'),
    });

    const deleteMutation = useMutation({
        mutationFn: calendarEventService.deleteCalendarEvent,
        onSuccess: (_, deletedId) => {
            invalidateCalendar();
            toast.success('Event berhasil dihapus');
            setDeleteConfirmation({ isOpen: false, id: null });
            setSelectedEventDetail(prev => (prev?.id === deletedId ? null : prev));
        },
        onError: () => toast.error('Gagal menghapus event kalender'),
    });

    const syncMutation = useMutation({
        mutationFn: (year: number) => calendarEventService.syncHolidays(year),
        onSuccess: (result) => {
            invalidateCalendar();
            if (result.added > 0) {
                toast.success(`${result.added} Libur Nasional berhasil disinkronisasi`);
            } else {
                toast.info('Semua data libur nasional sudah sinkron');
            }
            setIsSyncConfirmOpen(false);
        },
        onError: () => toast.error('Gagal menyinkronisasi libur nasional'),
    });

    // -- Action Handlers --
    const handleCreate = async (values: CalendarEventFormValues) => {
        await createMutation.mutateAsync(values);
    };

    const handleUpdate = async (values: CalendarEventFormValues) => {
        if (!editingId) return;
        await updateMutation.mutateAsync({ id: editingId, values });
    };

    const handleDelete = async () => {
        if (!deleteConfirmation.id) return;
        await deleteMutation.mutateAsync(deleteConfirmation.id);
    };

    const handleSyncHolidays = async () => {
        await syncMutation.mutateAsync(currentYear);
    };

    // -- Calendar Navigation --
    const prevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(y => y - 1);
        } else {
            setCurrentMonth(m => m - 1);
        }
    };

    const nextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(y => y + 1);
        } else {
            setCurrentMonth(m => m + 1);
        }
    };

    const goToToday = () => {
        setCurrentMonth(today.getMonth());
        setCurrentYear(today.getFullYear());
        setSelectedDate(null);
    };

    // -- Modal Helpers --
    const openAddModal = (dateStr?: string, type: 'event' | 'holiday' = 'event') => {
        if (dateStr) setSelectedDate(dateStr);
        setIntendedType(type);
        setEditingId(null);
        setIsFormOpen(true);
        setIsDateModalOpen(false);
    };

    const openEditModal = (event: CalendarEvent) => {
        setEditingId(event.id);
        setIsFormOpen(true);
        setIsDateModalOpen(false);
        setSelectedEventDetail(null);
    };

    const openDateDetail = (dateStr: string) => {
        setSelectedDate(dateStr);
        setIsDateModalOpen(true);
    };

    return {
        // Data
        events,
        eventMap,
        isLoading,
        isError,
        refetch,
        isSaving: createMutation.isPending || updateMutation.isPending,

        // Navigation
        currentMonth,
        currentYear,
        prevMonth,
        nextMonth,
        goToToday,
        today,

        // Selection
        selectedDate,
        selectedEventDetail,
        setSelectedEventDetail,

        // Modals & Forms
        isFormOpen,
        setIsFormOpen,
        isDateModalOpen,
        setIsDateModalOpen,
        editingId,
        setEditingId,
        intendedType,
        setIntendedType,
        deleteConfirmation,
        setDeleteConfirmation,

        // Actions
        getEventsForDate,
        handleCreate,
        handleUpdate,
        handleDelete,
        handleSyncHolidays,
        isSyncing: syncMutation.isPending,
        isSyncConfirmOpen,
        setIsSyncConfirmOpen,
        openAddModal,
        openEditModal,
        openDateDetail,
    };
};
