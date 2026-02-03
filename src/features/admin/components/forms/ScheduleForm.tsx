'use client';

import React, { useEffect } from 'react';
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
import { ScheduleFormValues, scheduleSchema } from '../../schemas/scheduleSchema';
import { Schedule } from '../../types/schedule';

interface ScheduleFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: Schedule | null;
    onSubmit: (data: ScheduleFormValues) => void;
}

export const ScheduleForm: React.FC<ScheduleFormProps> = ({
    open,
    onOpenChange,
    initialData,
    onSubmit,
}) => {
    const form = useForm<ScheduleFormValues>({
        resolver: zodResolver(scheduleSchema),
        defaultValues: {
            day: 'Senin',
            startTime: '',
            endTime: '',
            subjectName: '',
            className: '',
            teacherName: '',
            room: '',
            academicYear: '2024/2025',
            semester: 'Ganjil',
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                day: initialData.day,
                startTime: initialData.startTime,
                endTime: initialData.endTime,
                subjectName: initialData.subjectName,
                className: initialData.className,
                teacherName: initialData.teacherName,
                room: initialData.room,
                academicYear: initialData.academicYear,
                semester: initialData.semester,
            });
        } else {
            form.reset({
                day: 'Senin',
                startTime: '',
                endTime: '',
                subjectName: '',
                className: '',
                teacherName: '',
                room: '',
                academicYear: '2024/2025',
                semester: 'Ganjil',
            });
        }
    }, [initialData, form, open]);

    const handleSubmit = (values: ScheduleFormValues) => {
        onSubmit(values);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? 'Edit Jadwal' : 'Tambah Jadwal Pelajaran'}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="subjectName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mata Pelajaran</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Contoh: Matematika" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="teacherName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Guru Pengampu</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nama Guru" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="className"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Kelas</FormLabel>
                                        <FormControl>
                                            <Input placeholder="X-A" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="room"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ruangan</FormLabel>
                                        <FormControl>
                                            <Input placeholder="R.101" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="day"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hari</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="startTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Jam Mulai</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="endTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Jam Selesai</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Batal
                            </Button>
                            <Button type="submit">Simpan</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
