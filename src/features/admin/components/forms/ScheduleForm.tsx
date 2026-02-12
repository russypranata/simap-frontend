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

// Schemas & Types
import { ScheduleFormValues, scheduleSchema } from '../../schemas/scheduleSchema';
import { Schedule } from '../../types/schedule';
import { Teacher } from '../../types/teacher';
import { Class } from '../../types/class';
import { Subject } from '../../types/subject';

// Services
import { teacherService } from '../../services/teacherService';
import { classService } from '../../services/classService';
import { subjectService } from '../../services/subjectService';

import { checkScheduleConflict, getTimeSlotOptions, ConflictResult } from '../../utils/scheduleUtils';

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



    // Dropdown Data
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);

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
            academicYear: '2024/2025',
            semester: 'Ganjil',
        },
    });

    // Real-time Conflict Detection
    const [conflict, setConflict] = useState<ConflictResult>({ hasConflict: false });
    const watchedValues = form.watch();

    useEffect(() => {
        const { day, startTime, endTime, teacherId, classId } = watchedValues;
        
        if (day && startTime && endTime && (teacherId || classId)) {
            const payload = {
                day,
                startTime,
                endTime,
                teacherId,
                classId,
            };
            const result = checkScheduleConflict(payload as any, existingSchedules, initialData?.id);
            setConflict(result);
        } else {
            setConflict({ hasConflict: false });
        }
    }, [watchedValues.day, watchedValues.startTime, watchedValues.endTime, watchedValues.teacherId, watchedValues.classId, existingSchedules, initialData]);

    // Watch 'day' to update time slots dynamically
    const selectedDay = form.watch('day');
    
    const timeSlotOptions = useMemo(() => {
        return getTimeSlotOptions(selectedDay);
    }, [selectedDay]);

    // Fetch dependent data
    useEffect(() => {
        if (open) {
            const fetchData = async () => {
                try {
                    const [tData, cData, sData] = await Promise.all([
                        teacherService.getTeachers(),
                        classService.getClasses(),
                        subjectService.getSubjects(),
                    ]);
                    setTeachers(tData);
                    setClasses(cData);
                    setSubjects(sData);
                } catch (error) {
                    toast.error('Gagal memuat data referensi');
                }
            };
            fetchData();
        }
    }, [open]);

    // Reset Form
    useEffect(() => {
        if (initialData) {
            form.reset({
                day: initialData.day,
                startTime: initialData.startTime,
                endTime: initialData.endTime,
                subjectId: initialData.subjectId || '',
                classId: initialData.classId || '',
                teacherId: initialData.teacherId || '',
                room: initialData.room,
                academicYear: initialData.academicYear,
                semester: initialData.semester,
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
                academicYear: '2024/2025',
                semester: 'Ganjil',
            });
        }
    }, [initialData, form, open]);

    const handleSubmit = (values: ScheduleFormValues) => {
        // Find names based on IDs
        const selectedSubject = subjects.find(s => s.id === values.subjectId);
        const selectedClass = classes.find(c => c.id === values.classId);
        const selectedTeacher = teachers.find(t => t.id === values.teacherId);

        const payload = {
            ...values,
            subjectName: selectedSubject?.name || '',
            className: selectedClass?.name || '',
            teacherName: selectedTeacher?.name || '',
        };

        // Conflict Detection
        const conflict = checkScheduleConflict(payload as any, existingSchedules, initialData?.id);
        if (conflict.hasConflict) {
            toast.error(conflict.message || 'Terjadi bentrok jadwal!');
            return; // Stop submission
        }

        onSubmit(payload);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[650px]">
                <DialogHeader>
                    <div className="flex items-center gap-4 pb-2">
                        <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
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

                <div className="py-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                            
                            {/* Conflict Alert */}
                            {conflict.hasConflict && (
                                <Alert variant="destructive" className="bg-red-50 text-red-900 border-red-200">
                                    <AlertTriangle className="h-4 w-4 text-red-600" />
                                    <AlertTitle className="text-red-800 font-semibold ml-2">Bentrok Jadwal Terdeteksi!</AlertTitle>
                                    <AlertDescription className="text-red-700 ml-2 mt-1">
                                        {conflict.message}
                                    </AlertDescription>
                                </Alert>
                            )}
                            
                            {/* Section 1: Informasi Akademik */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Subject Select */}
                                <FormField
                                    control={form.control}
                                    name="subjectId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mata Pelajaran</FormLabel>
                                            <Select 
                                                onValueChange={field.onChange} 
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih Mapel" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {subjects.map((s) => (
                                                        <SelectItem key={s.id} value={s.id}>
                                                            {s.name} ({s.code})
                                                        </SelectItem>
                                                    ))}
                                                    {initialData && initialData.subjectId && !subjects.find(s => s.id === initialData.subjectId) && (
                                                            <SelectItem value={initialData.subjectId || ''}>{initialData.subjectName}</SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
    
                                {/* Teacher Select */}
                                <FormField
                                    control={form.control}
                                    name="teacherId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Guru Pengampu</FormLabel>
                                            <Select 
                                                onValueChange={field.onChange} 
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih Guru" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {teachers.map((t) => (
                                                        <SelectItem key={t.id} value={t.id}>
                                                            {t.name}
                                                        </SelectItem>
                                                    ))}
                                                        {initialData && initialData.teacherId && !teachers.find(t => t.id === initialData.teacherId) && (
                                                            <SelectItem value={initialData.teacherId || ''}>{initialData.teacherName}</SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
        
                            {/* Section 2: Kelas & Lokasi */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Class Select */}
                                    <FormField
                                    control={form.control}
                                    name="classId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Kelas</FormLabel>
                                            <Select 
                                                onValueChange={field.onChange} 
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih Kelas" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {classes.map((c) => (
                                                        <SelectItem key={c.id} value={c.id}>
                                                            {c.name}
                                                        </SelectItem>
                                                    ))}
                                                        {initialData && initialData.classId && !classes.find(c => c.id === initialData.classId) && (
                                                            <SelectItem value={initialData.classId || ''}>{initialData.className}</SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
    
                                {/* Room Input */}
                                <FormField
                                    control={form.control}
                                    name="room"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ruangan</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Contoh: R.101" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Section 3: Waktu Pelaksanaan */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="day"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Hari</FormLabel>
                                            <Select 
                                                onValueChange={(val) => {
                                                    field.onChange(val);
                                                    // Reset time fields on day change to avoid invalid combinations
                                                    form.setValue('startTime', '');
                                                    form.setValue('endTime', '');
                                                }} 
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih Hari" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map(d => (
                                                        <SelectItem key={d} value={d}>{d}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Smart Time Slot Selection */}
                                <div className="space-y-2">
                                    <FormLabel>Jam Ke-</FormLabel>
                                    <Select 
                                        onValueChange={(val) => {
                                            const slot = timeSlotOptions.find(opt => opt.value === val);
                                            if (slot) {
                                                form.setValue('startTime', slot.startTime);
                                                form.setValue('endTime', slot.endTime);
                                            }
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Jam Pelajaran" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {timeSlotOptions.map(option => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {/* Hidden Inputs for Form Submission */}
                                    <input type="hidden" {...form.register('startTime')} />
                                    <input type="hidden" {...form.register('endTime')} />
                                    <p className="text-xs text-muted-foreground">
                                        Waktu: {form.watch('startTime') || '--:--'} - {form.watch('endTime') || '--:--'}
                                    </p>
                                </div>
                            </div>
        
                            <DialogFooter className="gap-3">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => onOpenChange(false)}
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Batal
                                </Button>
                                <Button 
                                    type="submit" 
                                    className="bg-blue-800 hover:bg-blue-900 text-white"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    Simpan
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
};
