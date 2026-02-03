'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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

import { AcademicYear, CreateAcademicYearRequest, UpdateAcademicYearRequest } from '../types/academicYear';
import { academicYearService } from '../services/academicYearService';
import { AcademicYearFormSkeleton } from '../components/academic-year';

// Validation schema
const formSchema = z.object({
    name: z
        .string()
        .min(1, 'Nama tahun ajaran wajib diisi')
        .regex(/^\d{4}\/\d{4}$/, 'Format harus YYYY/YYYY (contoh: 2025/2026)'),
    startDate: z
        .string()
        .min(1, 'Tanggal mulai wajib diisi'),
    endDate: z
        .string()
        .min(1, 'Tanggal selesai wajib diisi'),
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
    id?: string; // If provided, it's edit mode
}

export const AcademicYearForm: React.FC<AcademicYearFormProps> = ({ id }) => {
    const router = useRouter();
    const isEditMode = Boolean(id);
    const [isLoading, setIsLoading] = useState(isEditMode);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [academicYearName, setAcademicYearName] = useState<string>('');

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            startDate: '',
            endDate: '',
        },
    });

    // Fetch existing data for edit mode
    useEffect(() => {
        if (isEditMode && id) {
            fetchAcademicYear(id);
        }
    }, [id, isEditMode]);

    const fetchAcademicYear = async (yearId: string) => {
        try {
            setIsLoading(true);
            const data = await academicYearService.getAcademicYearById(yearId);
            if (data) {
                form.reset({
                    name: data.name,
                    startDate: data.startDate,
                    endDate: data.endDate,
                });
                setAcademicYearName(data.name);
            }
        } catch (err) {
            console.error('Failed to fetch academic year:', err);
            setError('Gagal memuat data tahun ajaran');
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (values: FormValues) => {
        try {
            setIsSubmitting(true);
            setError(null);

            if (isEditMode && id) {
                const updateData: UpdateAcademicYearRequest = {
                    name: values.name,
                    startDate: values.startDate,
                    endDate: values.endDate,
                };
                await academicYearService.updateAcademicYear(id, updateData);
            } else {
                const createData: CreateAcademicYearRequest = {
                    name: values.name,
                    startDate: values.startDate,
                    endDate: values.endDate,
                };
                await academicYearService.createAcademicYear(createData);
            }

            toast.success(isEditMode ? 'Tahun ajaran berhasil diperbarui' : 'Tahun ajaran berhasil dibuat');
            router.push('/admin/academic-year');
        } catch (err) {
            console.error('Failed to save academic year:', err);
            const errorMessage = 'Gagal menyimpan data tahun ajaran';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Auto-generate name from dates
    const handleStartDateChange = (value: string) => {
        form.setValue('startDate', value);
        
        const currentName = form.getValues('name');
        const endDate = form.getValues('endDate');
        
        if (!currentName && value && endDate) {
            const startYear = new Date(value).getFullYear();
            const endYear = new Date(endDate).getFullYear();
            if (startYear !== endYear) {
                form.setValue('name', `${startYear}/${endYear}`);
            }
        }
    };

    const handleEndDateChange = (value: string) => {
        form.setValue('endDate', value);
        
        const currentName = form.getValues('name');
        const startDate = form.getValues('startDate');
        
        if (!currentName && startDate && value) {
            const startYear = new Date(startDate).getFullYear();
            const endYear = new Date(value).getFullYear();
            if (startYear !== endYear) {
                form.setValue('name', `${startYear}/${endYear}`);
            }
        }
    };

    if (isLoading) {
        return <AcademicYearFormSkeleton />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
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
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <p className="text-sm text-red-800">{error}</p>
                </div>
            )}

            {/* Form Card */}
            <Card className="border-slate-200">
                <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-primary flex-shrink-0">
                            <CalendarDays className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold text-gray-900">Data Tahun Ajaran</CardTitle>
                            <CardDescription className="text-sm text-muted-foreground">
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
                                            <Input
                                                placeholder="2025/2026"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-[11px] flex items-center gap-1.5 text-slate-500 mt-1">
                                            <Info className="h-3 w-3 text-blue-500 shrink-0" />
                                            Format: YYYY/YYYY (contoh: 2025/2026)
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
                                                    onChange={(e) => handleStartDateChange(e.target.value)}
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
                                                    onChange={(e) => handleEndDateChange(e.target.value)}
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
                            {/* Info Box */}
                            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <div className="p-1.5 bg-blue-100 rounded-md shrink-0 mt-0.5">
                                        <Calendar className="h-4 w-4 text-blue-700" />
                                    </div>
                                    <div className="text-sm text-blue-900 space-y-3">
                                        <div>
                                            <p className="font-semibold text-blue-800">Pembagian Semester Otomatis & Cerdas</p>
                                            <p className="mt-1 text-blue-700/90 leading-relaxed">
                                                Sistem akan otomatis membuat 2 semester (Ganjil dan Genap) dengan algoritma pembagian yang realistis:
                                            </p>
                                        </div>
                                        
                                        <ul className="space-y-1.5 text-xs text-blue-700 list-disc list-outside ml-4 marker:text-blue-500">
                                            <li>Semester Ganjil berakhir di hari Jumat (~48% periode)</li>
                                            <li>Libur semester 2-3 minggu (mid-term break)</li>
                                            <li>Semester Genap dimulai di hari Senin (~52% periode)</li>
                                        </ul>

                                        <p className="text-xs text-blue-800 pt-1 leading-snug">
                                            <strong>Tip:</strong> Anda dapat menyesuaikan tanggal masing-masing semester secara manual setelah tahun ajaran berhasil dibuat.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4">
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
