'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Calendar,
    Save,
    Loader2,
    CalendarDays,
    AlertCircle,
    Info,
} from 'lucide-react';

import { CreateAcademicYearRequest, UpdateAcademicYearRequest } from '../types/academicYear';
import { academicYearService } from '../services/academicYearService';
import { AcademicYearFormSkeleton } from '../components/academic-year';
import { ACADEMIC_YEAR_KEYS } from '../hooks/useAcademicYearList';

const formSchema = z.object({
    name: z
        .string()
        .min(1, 'Nama tahun ajaran wajib diisi')
        .regex(/^\d{4}\/\d{4}$/, 'Format harus YYYY/YYYY (contoh: 2025/2026)'),
    startDate: z.string().min(1, 'Tanggal mulai wajib diisi'),
    endDate: z.string().min(1, 'Tanggal selesai wajib diisi'),
}).refine((data) => {
    if (data.startDate && data.endDate) {
        return new Date(data.startDate) < new Date(data.endDate);
    }
    return true;
}, {
    message: 'Tanggal selesai harus setelah tanggal mulai',
    path: ['endDate'],
});

type FormValues = z.infer<typeof formSchema>;

interface AcademicYearFormProps {
    id?: string;
}

export const AcademicYearForm: React.FC<AcademicYearFormProps> = ({ id }) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const isEditMode = Boolean(id);
    const [isLoading, setIsLoading] = useState(isEditMode);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [academicYearName, setAcademicYearName] = useState<string>('');

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: { name: '', startDate: '', endDate: '' },
    });

    useEffect(() => {
        if (isEditMode && id) {
            academicYearService.getAcademicYearById(id)
                .then(data => {
                    form.reset({
                        name: data.name,
                        startDate: data.startDate,
                        endDate: data.endDate,
                    });
                    setAcademicYearName(data.name);
                })
                .catch(() => setError('Gagal memuat data tahun ajaran'))
                .finally(() => setIsLoading(false));
        }
    }, [id, isEditMode]);

    const onSubmit = async (values: FormValues) => {
        try {
            setIsSubmitting(true);
            setError(null);

            if (isEditMode && id) {
                const payload: UpdateAcademicYearRequest = {
                    name: values.name,
                    startDate: values.startDate,
                    endDate: values.endDate,
                };
                await academicYearService.updateAcademicYear(id, payload);
                toast.success('Tahun ajaran berhasil diperbarui');
            } else {
                const payload: CreateAcademicYearRequest = {
                    name: values.name,
                    startDate: values.startDate,
                    endDate: values.endDate,
                };
                await academicYearService.createAcademicYear(payload);
                toast.success('Tahun ajaran berhasil dibuat');
            }

            // Invalidate list cache agar halaman list langsung fresh
            queryClient.invalidateQueries({ queryKey: ACADEMIC_YEAR_KEYS.all });
            router.push('/admin/academic-year');
        } catch (err: any) {
            const msg = err?.errors?.name?.[0]
                ?? err?.message
                ?? 'Gagal menyimpan data tahun ajaran';
            setError(msg);
            toast.error(msg);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Auto-generate nama dari tanggal jika nama belum diisi
    const tryAutoName = (startDate: string, endDate: string) => {
        if (form.getValues('name')) return;
        if (!startDate || !endDate) return;
        const sy = new Date(startDate).getFullYear();
        const ey = new Date(endDate).getFullYear();
        if (sy !== ey) form.setValue('name', `${sy}/${ey}`, { shouldValidate: true });
    };

    if (isLoading) return <AcademicYearFormSkeleton />;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold tracking-tight">
                        <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                            {isEditMode ? 'Edit Tahun Ajaran ' : 'Tambah '}
                        </span>
                        <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                            {isEditMode && academicYearName ? academicYearName : 'Tahun Ajaran'}
                        </span>
                    </h1>
                    <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                        <Calendar className="h-5 w-5" />
                    </div>
                </div>
                <p className="text-muted-foreground mt-1">
                    {isEditMode
                        ? 'Kelola informasi tahun ajaran yang terdaftar.'
                        : 'Buat tahun ajaran baru untuk memulai periode akademik.'}
                </p>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
                    <p className="text-sm text-red-800">{error}</p>
                </div>
            )}

            {/* Form Card */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-100 rounded-xl">
                            <CalendarDays className="h-5 w-5 text-blue-700" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold text-slate-800">Data Tahun Ajaran</CardTitle>
                            <CardDescription className="text-sm text-slate-600">
                                Isi informasi tahun ajaran beserta periode waktu mulai dan selesai
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Name */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nama Tahun Ajaran</FormLabel>
                                        <FormControl>
                                            <Input placeholder="2025/2026" {...field} />
                                        </FormControl>
                                        <FormDescription className="text-[11px] flex items-center gap-1.5 text-slate-500 mt-1">
                                            <Info className="h-3 w-3 text-blue-500 shrink-0" />
                                            Format: YYYY/YYYY (contoh: 2025/2026). Otomatis terisi dari tanggal.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Date Range */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="startDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tanggal Mulai</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="date"
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(e.target.value);
                                                        tryAutoName(e.target.value, form.getValues('endDate'));
                                                    }}
                                                />
                                            </FormControl>
                                            <FormDescription className="text-[11px] flex items-center gap-1.5 text-slate-500 mt-1">
                                                <Info className="h-3 w-3 text-blue-500 shrink-0" />
                                                Awal tahun ajaran
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="endDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tanggal Selesai</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="date"
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(e.target.value);
                                                        tryAutoName(form.getValues('startDate'), e.target.value);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormDescription className="text-[11px] flex items-center gap-1.5 text-slate-500 mt-1">
                                                <Info className="h-3 w-3 text-blue-500 shrink-0" />
                                                Akhir tahun ajaran
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Info Box */}
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <div className="p-1.5 bg-blue-100 rounded-md shrink-0 mt-0.5">
                                        <Calendar className="h-4 w-4 text-blue-700" />
                                    </div>
                                    <div className="text-sm text-blue-900 space-y-2">
                                        <p className="font-semibold text-blue-800">Pembagian Semester Otomatis</p>
                                        <p className="text-blue-700/90 leading-relaxed text-xs">
                                            Sistem akan otomatis membuat 2 semester (Ganjil dan Genap). Tanggal masing-masing semester dapat disesuaikan setelah tahun ajaran dibuat.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.push('/admin/academic-year')}
                                    disabled={isSubmitting}
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-blue-800 hover:bg-blue-900 text-white"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            {isEditMode ? 'Simpan Perubahan' : 'Simpan'}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};
