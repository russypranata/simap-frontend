'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
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
import {
    School,
    Save,
    Loader2,
    AlertCircle,
    Check,
    ChevronsUpDown,
    UserCheck,
    Calendar,
    Users,
    BookOpen,
    ArrowLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from 'sonner';

import { TeacherDropdown } from '../types/class';
import { AcademicYear } from '../types/academicYear';
import { classService } from '../services/classService';
import { academicYearService } from '../services/academicYearService';
import { ClassFormSkeleton } from '../components/class';

// ─── Schema ───────────────────────────────────────────────────────────────────
const formSchema = z.object({
    name:                z.string().min(1, 'Nama kelas wajib diisi').max(255),
    type:                z.enum(['reguler', 'peminatan_group']),
    academic_year_id:    z.string().min(1, 'Tahun ajaran wajib dipilih'),
    homeroom_teacher_id: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ClassFormProps {
    id?: string;
}

export const ClassForm: React.FC<ClassFormProps> = ({ id }) => {
    const router = useRouter();
    const isEditMode = Boolean(id);

    const [isLoading, setIsLoading]       = useState(isEditMode);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError]               = useState<string | null>(null);
    const [teachers, setTeachers]         = useState<TeacherDropdown[]>([]);
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
    const [teacherPopoverOpen, setTeacherPopoverOpen] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name:                '',
            type:                'reguler',
            academic_year_id:    '',
            homeroom_teacher_id: '',
        },
    });

    useEffect(() => {
        loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, isEditMode]);

    const loadInitialData = async () => {
        try {
            setIsLoading(true);

            const [teachersData, yearsData] = await Promise.all([
                classService.getTeachers(),
                academicYearService.getAcademicYears(),
            ]);

            setTeachers(teachersData);
            setAcademicYears(yearsData);

            if (isEditMode && id) {
                const classData = await classService.getClassById(id);
                if (classData) {
                    form.reset({
                        name:                classData.name,
                        type:                classData.type ?? 'reguler',
                        academic_year_id:    String(classData.academic_year_id),
                        homeroom_teacher_id: classData.homeroom_teacher_id
                            ? String(classData.homeroom_teacher_id)
                            : '',
                    });
                }
            } else {
                const activeYear = yearsData.find(y => y.isActive);
                if (activeYear) {
                    form.setValue('academic_year_id', activeYear.id);
                }
            }
        } catch (err) {
            console.error('Failed to load data:', err);
            setError('Gagal memuat data');
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (values: FormValues) => {
        try {
            setIsSubmitting(true);
            setError(null);

            const payload = {
                name:                values.name,
                type:                values.type,
                academic_year_id:    Number(values.academic_year_id),
                // Wali kelas hanya dikirim untuk kelas reguler
                homeroom_teacher_id: values.type === 'reguler' && values.homeroom_teacher_id
                    ? Number(values.homeroom_teacher_id)
                    : undefined,
            };

            if (isEditMode && id) {
                await classService.updateClass(id, payload);
                toast.success('Kelas berhasil diperbarui');
            } else {
                await classService.createClass(payload);
                toast.success('Kelas berhasil dibuat');
            }

            router.push('/admin/class');
        } catch (err) {
            console.error('Failed to save class:', err);
            const msg = 'Gagal menyimpan data kelas';
            setError(msg);
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <ClassFormSkeleton />;

    // Watch tipe untuk conditional rendering
    const classType = form.watch('type');
    const isReguler = classType === 'reguler';

    return (
        <div className="space-y-6">
            {/* ── Header ── */}
            <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold tracking-tight">
                        <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                            {isEditMode ? 'Edit ' : 'Tambah '}
                        </span>
                        <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                            Kelas
                        </span>
                    </h1>
                    <div className="flex items-center gap-2 p-2 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                        <School className="h-5 w-5" />
                    </div>
                </div>
                <p className="text-muted-foreground mt-1">
                    {isEditMode
                        ? 'Perbarui informasi kelas yang sudah ada'
                        : 'Buat kelas baru untuk tahun ajaran yang dipilih'}
                </p>
            </div>

            {/* ── Error Alert ── */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
                    <p className="text-sm text-red-800">{error}</p>
                </div>
            )}

            {/* ── Form Card ── */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0">
                            <School className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold text-gray-900">Informasi Kelas</CardTitle>
                            <CardDescription className="text-sm text-muted-foreground">
                                Lengkapi informasi identitas kelas
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                            {/* ── Field Grid ── */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Nama Kelas */}
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                                <School className="h-4 w-4 text-slate-400" />
                                                Nama Kelas <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Contoh: X A, XI B, XII C"
                                                    className="h-10"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Tahun Ajaran */}
                                <FormField
                                    control={form.control}
                                    name="academic_year_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                                <Calendar className="h-4 w-4 text-slate-400" />
                                                Tahun Ajaran <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="h-10 w-full">
                                                        <SelectValue placeholder="Pilih Tahun Ajaran" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {academicYears.map(year => (
                                                        <SelectItem key={year.id} value={year.id}>
                                                            {year.name} {year.isActive && '(Aktif)'}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Tipe Kelas — full width */}
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                                <School className="h-4 w-4 text-slate-400" />
                                                Tipe Kelas <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <div className="grid grid-cols-2 gap-3">
                                                {/* Reguler */}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        field.onChange('reguler');
                                                    }}
                                                    className={cn(
                                                        'flex items-start gap-3 p-4 rounded-lg border-2 text-left transition-all',
                                                        field.value === 'reguler'
                                                            ? 'border-blue-500 bg-blue-50'
                                                            : 'border-slate-200 bg-white hover:border-slate-300'
                                                    )}
                                                >
                                                    <div className={cn(
                                                        'h-9 w-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
                                                        field.value === 'reguler' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                                                    )}>
                                                        <Users className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className={cn('text-sm font-semibold', field.value === 'reguler' ? 'text-blue-900' : 'text-slate-700')}>
                                                            Reguler
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-0.5">
                                                            Kelas inti (X A, XI B, XII A, dll). Punya wali kelas dan daftar siswa tetap.
                                                        </p>
                                                    </div>
                                                </button>

                                                {/* Peminatan Group */}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        field.onChange('peminatan_group');
                                                        form.setValue('homeroom_teacher_id', '');
                                                    }}
                                                    className={cn(
                                                        'flex items-start gap-3 p-4 rounded-lg border-2 text-left transition-all',
                                                        field.value === 'peminatan_group'
                                                            ? 'border-amber-500 bg-amber-50'
                                                            : 'border-slate-200 bg-white hover:border-slate-300'
                                                    )}
                                                >
                                                    <div className={cn(
                                                        'h-9 w-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
                                                        field.value === 'peminatan_group' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                                                    )}>
                                                        <BookOpen className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className={cn('text-sm font-semibold', field.value === 'peminatan_group' ? 'text-amber-900' : 'text-slate-700')}>
                                                            Peminatan
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-0.5">
                                                            Wadah kelas peminatan (XI PEM IKH, XI PEM AKH). Siswa masuk via mapel peminatan.
                                                        </p>
                                                    </div>
                                                </button>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Wali Kelas — hanya untuk kelas reguler */}
                                {isReguler && (
                                    <FormField
                                        control={form.control}
                                        name="homeroom_teacher_id"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col md:col-span-2">
                                                <FormLabel className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                                    <UserCheck className="h-4 w-4 text-slate-400" />
                                                    Wali Kelas{' '}
                                                    <span className="text-slate-400 font-normal">(opsional)</span>
                                                </FormLabel>
                                                <Popover open={teacherPopoverOpen} onOpenChange={setTeacherPopoverOpen}>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                className={cn(
                                                                    'w-full h-10 justify-between font-normal',
                                                                    !field.value && 'text-muted-foreground'
                                                                )}
                                                            >
                                                                {field.value
                                                                    ? teachers.find(t => String(t.id) === field.value)?.name
                                                                    : 'Pilih Wali Kelas'}
                                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-full p-0" align="start">
                                                        <Command>
                                                            <CommandInput placeholder="Cari nama guru..." />
                                                            <CommandList>
                                                                <CommandEmpty>Guru tidak ditemukan.</CommandEmpty>
                                                                <CommandGroup>
                                                                    <CommandItem
                                                                        value="__none__"
                                                                        onSelect={() => {
                                                                            form.setValue('homeroom_teacher_id', '');
                                                                            setTeacherPopoverOpen(false);
                                                                        }}
                                                                    >
                                                                        <Check className={cn('mr-2 h-4 w-4', !field.value ? 'opacity-100' : 'opacity-0')} />
                                                                        — Belum Ada —
                                                                    </CommandItem>
                                                                    {teachers.map(teacher => (
                                                                        <CommandItem
                                                                            value={teacher.name}
                                                                            key={teacher.id}
                                                                            onSelect={() => {
                                                                                form.setValue('homeroom_teacher_id', String(teacher.id));
                                                                                setTeacherPopoverOpen(false);
                                                                            }}
                                                                        >
                                                                            <Check className={cn('mr-2 h-4 w-4', String(teacher.id) === field.value ? 'opacity-100' : 'opacity-0')} />
                                                                            {teacher.name}
                                                                        </CommandItem>
                                                                    ))}
                                                                </CommandGroup>
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>

                            {/* ── Actions ── */}
                            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.push('/admin/class')}
                                    disabled={isSubmitting}
                                    className="min-w-[90px]"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-blue-800 hover:bg-blue-900 text-white shadow-md hover:shadow-lg transition-all min-w-[140px]"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            {isEditMode ? 'Perbarui Kelas' : 'Buat Kelas'}
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
