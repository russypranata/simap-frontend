'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
    ArrowLeft,
    BookOpen,
    Loader2,
    Save,
    AlertCircle,
    Check,
    ChevronsUpDown,
    Info,
    Users,
    X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

import { Subject, SubjectCategory } from '../types/subject';
import { subjectService, TeacherOption } from '../services/subjectService';
import { SubjectFormSkeleton } from '../components/subject';

// Schema with comprehensive validation
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
    
    forGender: z.enum(['PUTRA', 'PUTRI', 'CAMPURAN'], {
        message: 'Jenis kelamin wajib dipilih',
    }).optional(),
    
    gradeLevel: z.array(z.string())
        .max(3, 'Maksimal 3 tingkat kelas')
        .optional()
        .default([]),
    
    description: z.string().max(500, 'Deskripsi maksimal 500 karakter').optional(),
    
    teacherIds: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface SubjectFormProps {
    id?: string;
}

export const SubjectForm: React.FC<SubjectFormProps> = ({ id }) => {
    const router = useRouter();
    const isEditMode = !!id;

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [teachers, setTeachers] = useState<TeacherOption[]>([]);
    const [selectedTeachers, setSelectedTeachers] = useState<TeacherOption[]>([]);
    const [teacherPopoverOpen, setTeacherPopoverOpen] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: '',
            name: '',
            category: 'UMUM',
            type: 'WAJIB',
            gradeLevel: [],
            description: '',
            teacherIds: [],
        },
    });

    useEffect(() => {
        loadInitialData();
    }, [id, isEditMode]);

    // Auto-naming logic removed as we are using Neutral Gender for Master Data
    

    const loadInitialData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            // Load teachers
            const teachersData = await subjectService.getTeachers();
            setTeachers(teachersData);

            // Load subject data if edit mode
            if (isEditMode && id) {
                const subjectData = await subjectService.getSubjectById(id);
                
                if (!subjectData) {
                    setError('Mata pelajaran tidak ditemukan');
                    toast.error('Mata pelajaran tidak ditemukan');
                    setTimeout(() => router.push('/admin/subject'), 2000);
                    return;
                }
                
                form.reset({
                    code: subjectData.code,
                    name: subjectData.name,
                    category: subjectData.category,
                    type: subjectData.type || 'WAJIB',
                    gradeLevel: subjectData.gradeLevel || [],
                    description: subjectData.description || '',
                    teacherIds: [],
                });
                
                // Set selected teachers for display
                const selected = teachersData.filter(t => subjectData.teacherIds.includes(t.id));
                setSelectedTeachers(selected);
            }
        } catch (err: any) {
            console.error('Failed to load data:', err);
            const errorMessage = err?.message || 'Gagal memuat data. Silakan coba lagi.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (values: FormValues) => {
        try {
            setIsSubmitting(true);
            setError(null);

            // Show loading toast
            const loadingToast = toast.loading(
                isEditMode ? 'Memperbarui mata pelajaran...' : 'Menyimpan mata pelajaran...'
            );

            const payload = {
                code: values.code.toUpperCase(),
                name: values.name.trim(),
                category: values.category as SubjectCategory,
                type: values.type,
                grade_level: values.gradeLevel,
                description: values.description?.trim() || '',
            };

            if (isEditMode && id) {
                await subjectService.updateSubject(id, payload);
                toast.success('Mata pelajaran berhasil diperbarui', { id: loadingToast });
            } else {
                await subjectService.createSubject(payload);
                toast.success('Mata pelajaran berhasil dibuat', { id: loadingToast });
            }

            // Reset form and navigate
            form.reset();
            setSelectedTeachers([]);
            
            // Small delay for better UX
            setTimeout(() => {
                router.push('/admin/subject');
            }, 500);
            
        } catch (err: any) {
            console.error('Submit failed:', err);
            
            // Determine error message
            let errorMessage = 'Gagal menyimpan data. Silakan coba lagi.';
            
            if (err?.response?.status === 409) {
                errorMessage = 'Kode mata pelajaran sudah digunakan';
            } else if (err?.response?.status === 404) {
                errorMessage = 'Mata pelajaran tidak ditemukan';
            } else if (err?.response?.status === 400) {
                errorMessage = err?.response?.data?.message || 'Data tidak valid';
            } else if (err?.message) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
            toast.error(errorMessage);
            
            // Scroll to top to show error alert
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleTeacher = (teacher: TeacherRef) => {
        setSelectedTeachers(prev => {
            const exists = prev.find(t => t.id === teacher.id);
            if (exists) {
                return prev.filter(t => t.id !== teacher.id);
            } else {
                return [...prev, teacher];
            }
        });
    };

    const removeTeacher = (teacherId: string) => {
        setSelectedTeachers(prev => prev.filter(t => t.id !== teacherId));
    };

    if (isLoading) {
        return <SubjectFormSkeleton />;
    }

    return (
        <div className="space-y-4">
            {/* Page Header */}
            {/* Page Header */}
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
                    {/* Main Form Card */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-primary flex-shrink-0">
                                    <BookOpen className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-semibold text-gray-900">Data Mata Pelajaran</CardTitle>
                                    <CardDescription className="text-sm text-muted-foreground">
                                        Lengkapi informasi identitas dan detail mata pelajaran
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Row 1: Code & Name */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                {/* Kode Mapel */}
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
                                                Kode singkat unik untuk identifikasi (2-10 karakter)
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Nama Mapel */}
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


                            {/* Row 2: Type & Category */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                {/* Tipe Mapel */}
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tipe Mata Pelajaran</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Pilih Tipe Mapel" />
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

                                {/* Kategori */}
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Kategori Rapor</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Pilih Kategori" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="UMUM">Wajib (Kelompok A)</SelectItem>
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

                            {/* Row 3: Grade Level (Tingkat Kelas) */}
                            <FormField
                                control={form.control}
                                name="gradeLevel"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">Tingkat Kelas</FormLabel>
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
                                                                    ? current.filter((v) => v !== level)
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

                            {/* Row 4: Description */}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => {
                                    const charCount = field.value?.length || 0;
                                    const maxChars = 500;
                                    const isNearLimit = charCount > maxChars * 0.8;
                                    
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
                                                    isNearLimit ? "text-orange-600 font-medium" : "text-muted-foreground"
                                                )}>
                                                    {charCount}/{maxChars} karakter
                                                </p>
                                            </div>
                                        </FormItem>
                                    );
                                }}
                            />

                            {/* Row 4: Teacher Assignment */}
                            <div className="space-y-3">
                                <FormLabel>Guru Pengampu</FormLabel>
                                <Popover open={teacherPopoverOpen} onOpenChange={setTeacherPopoverOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className="w-full justify-between h-10 font-normal"
                                        >
                                            <span className="text-muted-foreground">
                                                {selectedTeachers.length > 0 
                                                    ? `${selectedTeachers.length} guru dipilih`
                                                    : 'Pilih guru pengampu...'}
                                            </span>
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0" align="start">
                                        <Command>
                                            <CommandInput placeholder="Cari guru..." />
                                            <CommandList>
                                                <CommandEmpty>Tidak ada guru ditemukan.</CommandEmpty>
                                                <CommandGroup>
                                                    {teachers.map((teacher) => (
                                                        <CommandItem
                                                            key={teacher.id}
                                                            value={teacher.name}
                                                            onSelect={() => toggleTeacher(teacher)}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    selectedTeachers.find(t => t.id === teacher.id)
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            <div>
                                                                <p className="font-medium">{teacher.name}</p>
                                                                {teacher.specialization && (
                                                                    <p className="text-xs text-muted-foreground">{teacher.specialization}</p>
                                                                )}
                                                            </div>
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                
                                {/* Selected Teachers Display */}
                                {selectedTeachers.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {selectedTeachers.map((teacher) => (
                                            <Badge 
                                                key={teacher.id} 
                                                variant="secondary"
                                                className="bg-blue-50 text-blue-700 border-blue-100 pr-1.5"
                                            >
                                                {teacher.name}
                                                <button
                                                    type="button"
                                                    onClick={() => removeTeacher(teacher.id)}
                                                    className="ml-1.5 hover:bg-blue-200 rounded-full p-0.5"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
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
