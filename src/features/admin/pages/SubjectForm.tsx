'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import {
    BookOpen,
    Loader2,
    Save,
    AlertCircle,
    Check,
    Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { SubjectCategory } from '../types/subject';
import { subjectService } from '../services/subjectService';
import { SubjectFormSkeleton } from '../components/subject';
import { SUBJECT_KEYS } from '../hooks/useSubjectList';

const formSchema = z.object({
    code: z.string()
        .min(1, 'Kode mapel wajib diisi')
        .min(2, 'Kode minimal 2 karakter')
        .max(10, 'Kode maksimal 10 karakter')
        .regex(/^[A-Z0-9]+$/, 'Kode hanya boleh huruf kapital dan angka'),
    name: z.string()
        .min(1, 'Nama mata pelajaran wajib diisi')
        .min(3, 'Nama minimal 3 karakter')
        .max(100, 'Nama maksimal 100 karakter'),
    category: z.enum(['UMUM', 'AGAMA', 'KEJURUAN', 'EKSKUL'], {
        message: 'Kategori wajib dipilih',
    }),
    type: z.enum(['WAJIB', 'PEMINATAN'], {
        message: 'Tipe mata pelajaran wajib dipilih',
    }),
    gradeLevel: z.array(z.string()).max(3).optional().default([]),
    description: z.string().max(500, 'Deskripsi maksimal 500 karakter').optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface SubjectFormProps {
    id?: string;
}

export const SubjectForm: React.FC<SubjectFormProps> = ({ id }) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const isEditMode = !!id;

    const [isLoading, setIsLoading] = useState(isEditMode);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: '',
            name: '',
            category: 'UMUM',
            type: 'WAJIB',
            gradeLevel: [],
            description: '',
        },
    });

    useEffect(() => {
        if (!isEditMode || !id) return;
        subjectService.getSubjectById(id)
            .then(data => {
                form.reset({
                    code: data.code,
                    name: data.name,
                    category: data.category,
                    type: data.type,
                    gradeLevel: data.gradeLevel ?? [],
                    description: data.description ?? '',
                });
            })
            .catch(() => {
                setError('Mata pelajaran tidak ditemukan');
                toast.error('Mata pelajaran tidak ditemukan');
                setTimeout(() => router.push('/admin/subject'), 2000);
            })
            .finally(() => setIsLoading(false));
    }, [id, isEditMode]);

    const onSubmit = async (values: FormValues) => {
        try {
            setIsSubmitting(true);
            setError(null);

            const payload = {
                code: values.code.toUpperCase(),
                name: values.name.trim(),
                category: values.category as SubjectCategory,
                type: values.type,
                grade_level: values.gradeLevel ?? [],
                description: values.description?.trim() || '',
            };

            if (isEditMode && id) {
                await subjectService.updateSubject(id, payload);
                toast.success('Mata pelajaran berhasil diperbarui');
            } else {
                await subjectService.createSubject(payload);
                toast.success('Mata pelajaran berhasil dibuat');
            }

            queryClient.invalidateQueries({ queryKey: SUBJECT_KEYS.all });
            router.push('/admin/subject');
        } catch (err: any) {
            const msg = err?.errors?.code?.[0]
                ?? err?.message
                ?? 'Gagal menyimpan data. Silakan coba lagi.';
            setError(msg);
            toast.error(msg);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <SubjectFormSkeleton />;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold tracking-tight">
                        <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                            {isEditMode ? 'Edit ' : 'Tambah '}
                        </span>
                        <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                            Mata Pelajaran
                        </span>
                    </h1>
                    <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                        <BookOpen className="h-5 w-5" />
                    </div>
                </div>
                <p className="text-muted-foreground mt-1">
                    {isEditMode
                        ? 'Perbarui informasi dan pengaturan mata pelajaran'
                        : 'Buat mata pelajaran baru untuk kurikulum'}
                </p>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
                    <p className="text-red-700 text-sm">{error}</p>
                </div>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-blue-100 rounded-xl">
                                    <BookOpen className="h-5 w-5 text-blue-700" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-semibold text-slate-800">Data Mata Pelajaran</CardTitle>
                                    <CardDescription className="text-sm text-slate-600">
                                        Lengkapi informasi identitas dan detail mata pelajaran
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Kode & Nama */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Kode Mapel</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Contoh: MTK"
                                                    {...field}
                                                    className="uppercase"
                                                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                                />
                                            </FormControl>
                                            <FormDescription className="text-[11px] flex items-center gap-1.5 text-slate-500 mt-1">
                                                <Info className="h-3 w-3 text-blue-500 shrink-0" />
                                                Kode singkat unik (2-10 karakter, huruf kapital & angka)
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nama Mata Pelajaran</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Contoh: Matematika" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Tipe & Kategori */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tipe Mata Pelajaran</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Pilih Tipe" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="WAJIB">Wajib</SelectItem>
                                                    <SelectItem value="PEMINATAN">Peminatan</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription className="text-[11px] flex items-center gap-1.5 text-slate-500 mt-1.5">
                                                <Info className="h-3 w-3 text-blue-500 shrink-0" />
                                                WAJIB: Semua siswa. PEMINATAN: Siswa tertentu saja.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Kategori Rapor</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Pilih Kategori" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="UMUM">Umum (Kelompok A)</SelectItem>
                                                    <SelectItem value="AGAMA">Agama (Kelompok B)</SelectItem>
                                                    <SelectItem value="KEJURUAN">Kejuruan</SelectItem>
                                                    <SelectItem value="EKSKUL">Ekstrakurikuler</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Tingkat Kelas */}
                            <FormField
                                control={form.control}
                                name="gradeLevel"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tingkat Kelas</FormLabel>
                                        <div className="flex flex-wrap gap-3">
                                            {['10', '11', '12'].map((level) => {
                                                const isChecked = (field.value ?? []).includes(level);
                                                return (
                                                    <div
                                                        key={level}
                                                        onClick={() => {
                                                            const current = field.value ?? [];
                                                            field.onChange(
                                                                isChecked
                                                                    ? current.filter(v => v !== level)
                                                                    : [...current, level]
                                                            );
                                                        }}
                                                        className={cn(
                                                            "cursor-pointer flex items-center justify-center rounded-lg border text-sm font-semibold transition-all duration-200 h-9 px-4 min-w-[90px] shadow-sm select-none",
                                                            isChecked
                                                                ? "bg-blue-800 text-white border-blue-800 ring-2 ring-blue-100 ring-offset-1"
                                                                : "bg-white text-slate-600 border-slate-200 hover:border-blue-800 hover:bg-blue-50/50 hover:text-blue-800"
                                                        )}
                                                    >
                                                        Kelas {level}
                                                        {isChecked && <Check className="ml-2 h-4 w-4 stroke-[3]" />}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Deskripsi */}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => {
                                    const charCount = field.value?.length || 0;
                                    const maxChars = 500;
                                    return (
                                        <FormItem>
                                            <FormLabel>Deskripsi (Opsional)</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Deskripsi singkat tentang mata pelajaran ini..."
                                                    className="resize-none"
                                                    rows={3}
                                                    maxLength={maxChars}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <div className="flex items-center justify-between">
                                                <FormMessage />
                                                <p className={cn(
                                                    "text-xs tabular-nums",
                                                    charCount > maxChars * 0.8 ? "text-orange-600 font-medium" : "text-muted-foreground"
                                                )}>
                                                    {charCount}/{maxChars}
                                                </p>
                                            </div>
                                        </FormItem>
                                    );
                                }}
                            />

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.push('/admin/subject')}
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
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            {isEditMode ? 'Simpan Perubahan' : 'Simpan'}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </Form>
        </div>
    );
};
