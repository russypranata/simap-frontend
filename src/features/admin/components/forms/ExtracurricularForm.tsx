'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogFooter,
    DialogDescription
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { extracurricularSchema, ExtracurricularFormValues } from '../../schemas/extracurricularSchema';
import { Extracurricular } from '../../types/extracurricular';
import { teacherService } from '../../services/teacherService';
import { Teacher } from '../../types/teacher';
import { toast } from 'sonner';
import { useAcademicYear } from '@/context/AcademicYearContext';

interface ExtracurricularFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: ExtracurricularFormValues) => Promise<void>;
    initialData?: Extracurricular;
    title: string;
}

export const ExtracurricularForm: React.FC<ExtracurricularFormProps> = ({
    open,
    onOpenChange,
    onSubmit,
    initialData,
    title
}) => {
    const { academicYear: activeYearCtx } = useAcademicYear();
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<ExtracurricularFormValues>({
        resolver: zodResolver(extracurricularSchema),
        defaultValues: {
            name: '',
            category: 'Lainnya',
            mentorId: '',
            mentorName: '',
            day: '',
            time: '',
            maxCapacity: 30,
            location: '',
            description: '',
            academicYearId: activeYearCtx.academicYear,
        },
    });

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const data = await teacherService.getTeachers();
                setTeachers(data);
            } catch (error) {
                console.error('Failed to fetch teachers:', error);
            }
        };
        fetchTeachers();
    }, []);

    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name,
                category: initialData.category,
                mentorId: initialData.mentorId,
                mentorName: initialData.mentorName,
                day: initialData.day,
                time: initialData.time,
                maxCapacity: initialData.maxCapacity,
                location: initialData.location || '',
                description: initialData.description || '',
            });
        } else {
            form.reset({
                name: '',
                category: 'Lainnya',
                mentorId: '',
                mentorName: '',
                day: '',
                time: '',
                maxCapacity: 30,
                location: '',
                description: '',
                academicYearId: activeYearCtx.academicYear,
            });
        }
    }, [initialData, open, form, activeYearCtx]);

    const handleFormSubmit = async (values: ExtracurricularFormValues) => {
        try {
            setIsSubmitting(true);
            await onSubmit(values);
            onOpenChange(false);
            form.reset();
        } catch (error) {
            // Error handling is usually done in the parent
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        Lengkapi informasi detail kegiatan ekstrakurikuler di bawah ini.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 py-2">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Ekstrakurikuler</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Contoh: Pramuka, Basket, KIR" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="academicYearId"
                            render={({ field }) => (
                                <FormItem className="hidden">
                                    <FormControl>
                                        <Input type="hidden" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Kategori</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih Kategori" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Olahraga">Olahraga</SelectItem>
                                                <SelectItem value="Seni">Seni</SelectItem>
                                                <SelectItem value="Akademik">Akademik</SelectItem>
                                                <SelectItem value="Keagamaan">Keagamaan</SelectItem>
                                                <SelectItem value="Lainnya">Lainnya</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="maxCapacity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Kapasitas Maksimal</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number" 
                                                placeholder="Contoh: 30" 
                                                {...field} 
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="mentorId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Pembina (Guru)</FormLabel>
                                        <Select 
                                            onValueChange={(val) => {
                                                field.onChange(val);
                                                const teacher = teachers.find(t => t.id === val);
                                                if (teacher) {
                                                    form.setValue('mentorName', teacher.name);
                                                }
                                            }} 
                                            defaultValue={field.value}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih Guru Pembina" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {teachers.map(t => (
                                                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="day"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hari Latihan</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih Hari" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map(d => (
                                                    <SelectItem key={d} value={d}>{d}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="time"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Waktu (Jam)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Contoh: 15:00 - 17:00" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lokasi / Tempat</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Contoh: Lapangan Utama, Aula" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Deskripsi</FormLabel>
                                    <FormControl>
                                        <Textarea 
                                            placeholder="Penjelasan singkat mengenai kegiatan..." 
                                            className="resize-none"
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Batal
                            </Button>
                            <Button type="submit" className="bg-blue-800 hover:bg-blue-900" disabled={isSubmitting}>
                                {isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
