import { useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { CalendarEvent, EventType } from '../types/calendar';
import { CalendarEventFormValues } from '../schemas/calendarSchema';
import {
    getDaysInMonth,
    getFirstDayOfMonth,
    formatLocalDate,
    parseLocalDate
} from '@/lib/dateUtils';
import { getHolidaysForYear } from '@/lib/holidays';
import { MOCK_CALENDAR_EVENTS } from '../data/mockCalendarData';

export const useAcademicCalendar = () => {
    // UI State
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    
    // Calendar Navigation State
    const today = new Date();
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
        id: null
    });
    const [isSyncConfirmOpen, setIsSyncConfirmOpen] = useState(false);
    
    // Intended type for new events (e.g. from "Set Hari Libur" button)
    const [intendedType, setIntendedType] = useState<'event' | 'holiday'>('event');

    // -- Data Fetching --
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                // Simulate API call for base events
                await new Promise(resolve => setTimeout(resolve, 500));
                setEvents(MOCK_CALENDAR_EVENTS);
            } catch (error) {
                console.error('Failed to fetch calendar events:', error);
                toast.error('Gagal memuat data kalender');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run once on mount

    // -- Optimized Data Structure (The "Kamus" / Map) --
    // Map<YYYY-MM-DD, CalendarEvent[]>
    const eventMap = useMemo(() => {
        const map = new Map<string, CalendarEvent[]>();

        events.forEach(event => {
            const startDate = parseLocalDate(event.startDate);
            const endDate = parseLocalDate(event.endDate);
            
            // Loop through each day of the event
            const current = new Date(startDate);
            while (current <= endDate) {
                const dateKey = formatLocalDate(current);
                
                if (!map.has(dateKey)) {
                    map.set(dateKey, []);
                }
                map.get(dateKey)?.push(event);

                // Increment day
                current.setDate(current.getDate() + 1);
            }
        });

        return map;
    }, [events]);

    // -- Actions --
    const getEventsForDate = (dateStr: string) => {
        return eventMap.get(dateStr) || [];
    };

    const handleCreate = async (values: CalendarEventFormValues) => {
        setIsSaving(true);
        // Simulate API
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const newItem: CalendarEvent = {
            id: `cal-${Date.now()}`,
            ...values,
        };
        setEvents(prev => [...prev, newItem]);
        const label = values.type === 'holiday' ? 'Hari libur' : 'Kegiatan';
        toast.success(`${label} berhasil ditambahkan`);
        setIsSaving(false);
    };

    const handleUpdate = async (values: CalendarEventFormValues) => {
        if (!editingId) return;
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 800));

        setEvents(prev => prev.map(item => item.id === editingId ? { ...item, ...values } : item));
        const label = values.type === 'holiday' ? 'Hari libur' : 'Kegiatan';
        toast.success(`${label} berhasil diperbarui`);
        setEditingId(null);
        setIsSaving(false);
    };

    const handleDelete = async () => {
        if (!deleteConfirmation.id) return;
        
        setEvents(prev => prev.filter(item => item.id !== deleteConfirmation.id));
        toast.success('Item berhasil dihapus');
        setDeleteConfirmation({ isOpen: false, id: null });
        
        if (selectedEventDetail?.id === deleteConfirmation.id) {
            setSelectedEventDetail(null);
        }
    };

    const handleSyncHolidays = async () => {
        setIsSyncing(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1200));

        const nationalHolidays = [
            ...getHolidaysForYear(currentYear - 1),
            ...getHolidaysForYear(currentYear),
            ...getHolidaysForYear(currentYear + 1)
        ];

        let addedCount = 0;
        const newEvents = [...events];

        nationalHolidays.forEach(h => {
            // Check if THIS SPECIFIC holiday already exists on that date
            // We check for title similarity to avoid literal duplicates
            const normalizedNewTitle = h.name.toLowerCase();
            const exists = events.some(e => 
                e.startDate === h.date && 
                e.type === 'holiday' && 
                (e.title.toLowerCase().includes(normalizedNewTitle) || normalizedNewTitle.includes(e.title.toLowerCase().replace('[nasional]', '').trim()))
            );
            
            if (!exists) {
                newEvents.push({
                    id: `holiday-sync-${h.date}-${Date.now()}-${Math.random()}`,
                    title: `[Nasional] ${h.name}`,
                    description: '',
                    startDate: h.date,
                    endDate: h.date,
                    type: 'holiday',
                    isHoliday: true,
                });
                addedCount++;
            }
        });

        if (addedCount > 0) {
            setEvents(newEvents);
            toast.success(`${addedCount} Libur Nasional berhasil disinkronisasi`);
        } else {
            toast.info('Semua data libur nasional sudah sinkron');
        }

        setIsSyncing(false);
    };

    // -- Calendar Navigation --
    const prevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(curr => curr - 1);
        } else {
            setCurrentMonth(curr => curr - 1);
        }
    };

    const nextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(curr => curr + 1);
        } else {
            setCurrentMonth(curr => curr + 1);
        }
    };

    const goToToday = () => {
        setCurrentMonth(today.getMonth());
        setCurrentYear(today.getFullYear());
        setSelectedDate(null);
    };

    // -- Helpers for Modal/Form --
    const openAddModal = (dateStr?: string, type: 'event' | 'holiday' = 'event') => {
        if(dateStr) setSelectedDate(dateStr);
        setIntendedType(type);
        setEditingId(null);
        setIsFormOpen(true);
        setIsDateModalOpen(false); // Close date detail modal if open
    };

    const openEditModal = (event: CalendarEvent) => {
        setEditingId(event.id);
        setIsFormOpen(true);
        setIsDateModalOpen(false); // Close date detail modal if open
        // Close detail modal automatically
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
        isSaving,
        
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
        isSyncing,
        isSyncConfirmOpen,
        setIsSyncConfirmOpen,
        openAddModal,
        openEditModal,
        openDateDetail,
    };
};
