'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, CalendarPlus, Save, X } from 'lucide-react';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

import { ScheduleFormValues, scheduleSchema } from '../../schemas/scheduleSchema';
import { Schedule, DAY_MAP } from '../../types/schedule';
import { classService } from '../../services/classService';
import { subjectService } from '../../services/subjectService';
import { timeSlotService, DayKey } from '../../services/timeSlotService';
import { checkScheduleConflict, ConflictResult, getTimeSlotOptionsFromSlots } from '../../utils/scheduleUtils';

interface ScheduleFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: Schedule | null;
    existingSchedules: Schedule[];
    onSubmit: (data: ScheduleFormValues) => void;
}

const FormSkeleton = () => (
    <div className="space-y-5 py-2">
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-9 w-full" /></div>
            <div className="space-y-2"><Skeleton className="h-4 w-16" /><Skeleton className="h-9 w-full" /></div>
        </div>
        <div className="space-y-2"><Skeleton className="h-4 w-28" /><Skeleton className="h-9 w-full" /></div>
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Skeleton className="h-4 w-12" /><Skeleton className="h-9 w-full" /></div>
            <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-9 w-full" /></div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
            <Skeleton className="h-9 w-20" /><Skeleton className="h-9 w-24" />
        </div>
    </div>
);

export const ScheduleForm: React.FC<ScheduleFormProps> = ({
    open,
    onOpenChange,
    initialData,
    existingSchedules,
    onSubmit,
}) => {
    const { data: teachers = [], isPending: loadingTeachers } = useQuery({
        queryKey: ['schedule-form-teachers'],
        queryFn: async () => {
            const data = await classService.getTeachers();
            return (Array.isArray(data) ? data : []).map(t => ({ id: String(t.id), name: t.name }));
        },
        staleTime: 5 * 60 * 1000,
    });

    const { data: classes = [], isPending: loadingClasses } = useQuery({
        queryKey: ['schedule-form-classes'],
        queryFn: async () => {
            const data = await classService.getClasses();
            return (Array.isArray(data) ? data : []).map((c: { id: string | number; name: string }) => ({ id: String(c.id), name: c.name }));
        },
        staleTime: 5 * 60 * 1000,
    });

    const { data: subjects = [], isPending: loadingSubjects } = useQuery({
        queryKey: ['schedule-form-subjects'],
        queryFn: async () => {
            const data = await subjectService.getSubjects();
            return data.map(s => ({ id: String(s.id), name: s.name, code: s.code }));
        },
        staleTime: 5 * 60 * 1000,
    });

    const isPending = loadingTeachers || loadingClasses || loadingSubjects;

    // Set default values langsung dari initialData — komponen sudah di-remount fresh via key prop
    const form = useForm<ScheduleFormValues>({
        resolver: zodResolver(scheduleSchema),
        defaultValues: initialData ? {
            day:       initialData.day,
            startTime: initialData.startTime,
            endTime:   initialData.endTime,
            subjectId: String(initialData.subjectId),
            classId:   String(initialData.classId),
            teacherId: initialData.teacherId ? String(initialData.teacherId) : '',
        } : {
            day: 'Senin', startTime: '', endTime: '',
            subjectId: '', classId: '', teacherId: '',
        },
    });

    const selectedDay = form.watch('day');
    const [timeSlots, setTimeSlots] = React.useState<ReturnType<typeof getTimeSlotOptionsFromSlots>>([]);

    useEffect(() => {
        if (!open) return;
        const dayKey = DAY_MAP[selectedDay] as DayKey;
        timeSlotService.getByDay(dayKey).then(slots => setTimeSlots(getTimeSlotOptionsFromSlots(slots)));
    }, [open, selectedDay]);

    const [conflict, setConflict] = React.useState<ConflictResult>({ hasConflict: false });
    const watchedValues = form.watch();
    useEffect(() => {
        const { day, startTime, endTime, teacherId, classId } = watchedValues;
        if (day && startTime && endTime && (teacherId || classId)) {
            setConflict(checkScheduleConflict({ day, startTime, endTime, teacherId, classId } as Partial<Schedule>, existingSchedules, initialData?.id));
        } else {
            setConflict({ hasConflict: false });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watchedValues.day, watchedValues.startTime, watchedValues.endTime, watchedValues.teacherId, watchedValues.classId]);

    const handleSubmit = (values: ScheduleFormValues) => {
        if (checkScheduleConflict(values as Partial<Schedule>, existingSchedules, initialData?.id).hasConflict) return;
        onSubmit(values);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[560px]">
                <DialogHeader>
                    <div className="flex items-center gap-4 pb-2">
                        <div className="p-3 bg-blue-50 rounded-xl">
                            <CalendarPlus className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl">
                                {initialData ? 'Detail & Edit Jadwal' : 'Tambah Jadwal Baru'}
                            </DialogTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                {initialData ? 'Lihat detail atau ubah jadwal pelajaran ini.' : 'Isi form berikut untuk menambahkan jadwal pelajaran.'}
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                {isPending ? <FormSkeleton /> : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 py-2">
                            {conflict.hasConflict && (
                                <Alert variant="destructive" className="bg-red-50 text-red-900 border-red-200">
                                    <AlertTriangle className="h-4 w-4 text-red-600" />
                                    <AlertTitle className="text-red-800 font-semibold ml-2">Bentrok Jadwal!</AlertTitle>
                                    <AlertDescription className="text-red-700 ml-2 mt-1">{conflict.message}</AlertDescription>
                                </Alert>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="subjectId" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mata Pelajaran</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full overflow-hidden">
                                                    <SelectValue placeholder="Pilih Mapel" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name} ({s.code})</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="classId" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Kelas</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full overflow-hidden">
                                                    <SelectValue placeholder="Pilih Kelas" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <FormField control={form.control} name="teacherId" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Guru Pengampu</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full overflow-hidden">
                                                <SelectValue placeholder="Pilih Guru" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {teachers.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="day" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hari</FormLabel>
                                        <Select onValueChange={(val) => {
                                            field.onChange(val);
                                            form.setValue('startTime', '');
                                            form.setValue('endTime', '');
                                        }} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Pilih Hari" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'] as const).map(d => (
                                                    <SelectItem key={d} value={d}>{d}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <div className="space-y-2">
                                    <FormLabel>Jam Pelajaran</FormLabel>
                                    <Select onValueChange={(val) => {
                                        const slot = timeSlots.find(o => o.value === val);
                                        if (slot) {
                                            form.setValue('startTime', slot.startTime, { shouldValidate: true });
                                            form.setValue('endTime', slot.endTime, { shouldValidate: true });
                                        }
                                    }} value={form.watch('startTime')}>
                                        <SelectTrigger className="w-full overflow-hidden">
                                            <SelectValue placeholder="Pilih Jam" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {timeSlots.length === 0
                                                ? <SelectItem value="_" disabled>Tidak ada slot tersedia</SelectItem>
                                                : timeSlots.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)
                                            }
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <DialogFooter className="gap-3 pt-2">
                                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                    <X className="h-4 w-4 mr-2" />Batal
                                </Button>
                                <Button type="submit" className="bg-blue-800 hover:bg-blue-900 text-white">
                                    <Save className="h-4 w-4 mr-2" />Simpan
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
};
