'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, CalendarPlus, Save, X } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

import { ScheduleFormValues, scheduleSchema } from '../../schemas/scheduleSchema';
import { Schedule, DAY_MAP } from '../../types/schedule';
import { Teacher } from '../../types/teacher';
import { Class } from '../../types/class';
import { Subject } from '../../types/subject';
import { teacherService } from '../../services/teacherService';
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

export const ScheduleForm: React.FC<ScheduleFormProps> = ({
    open,
    onOpenChange,
    initialData,
    existingSchedules,
    onSubmit,
}) => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [timeSlots, setTimeSlots] = useState<ReturnType<typeof getTimeSlotOptionsFromSlots>>([]);
    const [conflict, setConflict] = useState<ConflictResult>({ hasConflict: false });

    const form = useForm<ScheduleFormValues>({
        resolver: zodResolver(scheduleSchema),
        defaultValues: {
            day: 'Senin',
            startTime: '',
            endTime: '',
            subjectId: '',
            classId: '',
            teacherId: '',
            room: '',
        },
    });

    const selectedDay = form.watch('day');

    // Fetch reference data when dialog opens
    useEffect(() => {
        if (!open) return;
        Promise.all([
            teacherService.getTeachers(),
            classService.getClasses(),
            subjectService.getSubjects(),
        ]).then(([t, c, s]) => {
            setTeachers(t);
            setClasses(c);
            setSubjects(s);
        }).catch(() => toast.error('Gagal memuat data referensi'));
    }, [open]);

    // Fetch time slots when day changes
    useEffect(() => {
        if (!open) return;
        const dayKey = DAY_MAP[selectedDay] as DayKey;
        timeSlotService.getByDay(dayKey).then(slots => {
            setTimeSlots(getTimeSlotOptionsFromSlots(slots));
        });
    }, [open, selectedDay]);

    // Reset form when initialData changes
    useEffect(() => {
        if (initialData) {
            form.reset({
                day: initialData.day,
                startTime: initialData.startTime,
                endTime: initialData.endTime,
                subjectId: initialData.subjectId,
                classId: initialData.classId,
                teacherId: initialData.teacherId,
                room: initialData.room ?? '',
            });
        } else {
            form.reset({
                day: 'Senin',
                startTime: '',
                endTime: '',
                subjectId: '',
                classId: '',
                teacherId: '',
                room: '',
            });
        }
    }, [initialData, open]);

    // Real-time conflict detection
    const watchedValues = form.watch();
    useEffect(() => {
        const { day, startTime, endTime, teacherId, classId } = watchedValues;
        if (day && startTime && endTime && (teacherId || classId)) {
            setConflict(checkScheduleConflict(
                { day, startTime, endTime, teacherId, classId } as any,
                existingSchedules,
                initialData?.id
            ));
        } else {
            setConflict({ hasConflict: false });
        }
    }, [watchedValues.day, watchedValues.startTime, watchedValues.endTime, watchedValues.teacherId, watchedValues.classId]);

    const handleSubmit = (values: ScheduleFormValues) => {
        const c = checkScheduleConflict(values as any, existingSchedules, initialData?.id);
        if (c.hasConflict) {
            toast.error(c.message ?? 'Terjadi bentrok jadwal!');
            return;
        }
        onSubmit(values);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <div className="flex items-center gap-4 pb-2">
                        <div className="p-3 bg-blue-50 rounded-xl">
                            <CalendarPlus className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl">
                                {initialData ? 'Edit Jadwal Pelajaran' : 'Buat Jadwal Baru'}
                            </DialogTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Isi form berikut untuk mengatur jadwal pelajaran.
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 py-2">
                        {conflict.hasConflict && (
                            <Alert variant="destructive" className="bg-red-50 text-red-900 border-red-200">
                                <AlertTriangle className="h-4 w-4 text-red-600" />
                                <AlertTitle className="text-red-800 font-semibold ml-2">Bentrok Jadwal!</AlertTitle>
                                <AlertDescription className="text-red-700 ml-2 mt-1">
                                    {conflict.message}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Mapel & Guru */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="subjectId" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mata Pelajaran</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Pilih Mapel" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            {subjects.map(s => (
                                                <SelectItem key={s.id} value={s.id}>{s.name} ({s.code})</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="teacherId" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Guru Pengampu</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Pilih Guru" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            {teachers.map(t => (
                                                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        {/* Kelas & Ruangan */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="classId" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Kelas</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Pilih Kelas" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            {classes.map(c => (
                                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="room" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ruangan (Opsional)</FormLabel>
                                    <FormControl><Input placeholder="Contoh: R.101" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        {/* Hari & Jam */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="day" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Hari</FormLabel>
                                    <Select onValueChange={(val) => {
                                        field.onChange(val);
                                        form.setValue('startTime', '');
                                        form.setValue('endTime', '');
                                    }} value={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Pilih Hari" /></SelectTrigger></FormControl>
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
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Jam" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {timeSlots.length === 0
                                            ? <SelectItem value="_" disabled>Tidak ada slot tersedia</SelectItem>
                                            : timeSlots.map(o => (
                                                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                                {form.watch('startTime') && (
                                    <p className="text-xs text-muted-foreground">
                                        {form.watch('startTime')} – {form.watch('endTime')}
                                    </p>
                                )}
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
            </DialogContent>
        </Dialog>
    );
};
