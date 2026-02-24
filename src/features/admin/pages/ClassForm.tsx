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
    FormDescription,
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
    Info,
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

import { Teacher, Student } from '../types/class';
import { Subject } from '../types/subject';
import { classService } from '../services/classService';
import { academicYearService } from '../services/academicYearService';
import { subjectService } from '../services/subjectService';
import { ClassFormSkeleton } from '../components/class';

// Schema
const formSchema = z.object({
    name: z.string().min(1, 'Nama kelas wajib diisi'),
    grade: z.string().min(1, 'Tingkat wajib dipilih'),
    type: z.enum(['REGULER', 'PEMINATAN']),
    peminatanCategory: z.enum(['IKH', 'AKH']).optional(),
    subjectId: z.string().optional(),
    capacity: z.coerce.number().min(1, 'Kapasitas minimal 1'),
    homeroomTeacherId: z.string().optional(),
    academicYearId: z.string().optional(),
    genderCategory: z.enum(['PUTRA', 'PUTRI', 'CAMPURAN']),
});

type FormValues = z.infer<typeof formSchema>;

interface ClassFormProps {
    id?: string;
}

export const ClassForm: React.FC<ClassFormProps> = ({ id }) => {
    const router = useRouter();
    const isEditMode = Boolean(id);
    const [isLoading, setIsLoading] = useState(isEditMode);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [activeYearId, setActiveYearId] = useState<string>('');

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            grade: '',
            type: 'REGULER' as const,
            peminatanCategory: undefined,
            subjectId: '',
            capacity: 30,
            homeroomTeacherId: '',
            academicYearId: '',
            genderCategory: 'CAMPURAN' as const,
        },
    });

    useEffect(() => {
        loadInitialData();
    }, [id, isEditMode]);

    const loadInitialData = async () => {
        try {
            setIsLoading(true);
            // 1. Load Teachers, Subjects and Active Year
            const [teachersData, yearsData, subjectsData] = await Promise.all([
                classService.getTeachers(),
                academicYearService.getAcademicYears(),
                subjectService.getSubjects(),
            ]);
            setTeachers(teachersData);
            setSubjects(subjectsData.filter(s => s.type === 'PEMINATAN'));
            
            const activeYear = yearsData.find(y => y.isActive);
            if (activeYear) setActiveYearId(activeYear.name); // Using name as ID for mock simplification

            // 2. Load Class Data if Edit Mode
            if (isEditMode && id) {
                const classData = await classService.getClassById(id);
                if (classData) {
                    // Update activeYearId to match the class's year
                    if (classData.academicYearId) {
                        setActiveYearId(classData.academicYearId);
                    }
                    
                    form.reset({
                        name: classData.name,
                        grade: classData.grade.toString(),
                        type: classData.type,
                        peminatanCategory: classData.peminatanCategory,
                        subjectId: classData.subjectId || '',
                        capacity: classData.capacity,
                        homeroomTeacherId: classData.homeroomTeacherId || '',
                        academicYearId: classData.academicYearId || activeYear?.name,
                        genderCategory: classData.genderCategory,
                    });
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
                name: values.name,
                grade: parseInt(values.grade),
                type: values.type,
                peminatanCategory: values.peminatanCategory,
                subjectId: values.subjectId,
                capacity: values.capacity,
                homeroomTeacherId: values.homeroomTeacherId === 'none' ? undefined : values.homeroomTeacherId,
                academicYearId: activeYearId,
                genderCategory: values.genderCategory,
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

    if (isLoading) {
        return <ClassFormSkeleton />;
    }

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
                            Kelas
                        </span>
                    </h1>
                    <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                        <School className="h-5 w-5" />
                    </div>
                </div>
                <p className="text-muted-foreground mt-1">
                    {isEditMode
                        ? 'Perbarui informasi dan pengaturan detail kelas'
                        : 'Buat kelas baru untuk tahun ajaran aktif'}
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
                            <School className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold text-gray-900">Informasi Kelas</CardTitle>
                            <CardDescription className="text-sm text-muted-foreground">
                                Lengkapi informasi identitas kelas dan pengaturan rombongan belajar
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Tipe Kelas */}
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tipe Kelas</FormLabel>
                                            <Select 
                                                onValueChange={(val) => {
                                                    field.onChange(val);
                                                    if (val === 'REGULER') {
                                                        form.setValue('peminatanCategory', undefined);
                                                        form.setValue('subjectId', '');
                                                    } else {
                                                        form.setValue('homeroomTeacherId', '');
                                                    }
                                                }} 
                                                defaultValue={field.value} 
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Pilih Tipe Kelas" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="REGULER">Reguler (Wajib)</SelectItem>
                                                    <SelectItem value="PEMINATAN">Peminatan (Elektif)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Tingkat */}
                                <FormField
                                    control={form.control}
                                    name="grade"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tingkat</FormLabel>
                                            <Select 
                                                onValueChange={(val) => {
                                                    field.onChange(val);
                                                    // Trigger rename suggestion if applicable
                                                }} 
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Pilih Tingkat" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="10">Kelas 10 (X)</SelectItem>
                                                    <SelectItem value="11">Kelas 11 (XI)</SelectItem>
                                                    <SelectItem value="12">Kelas 12 (XII)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Conditional Fields for PEMINATAN */}
                                {form.watch('type') === 'PEMINATAN' && (
                                    <>
                                        <FormField
                                            control={form.control}
                                            name="peminatanCategory"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Kategori Peminatan</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Pilih Kategori" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="AKH">PEM AKH (Akhlak)</SelectItem>
                                                            <SelectItem value="IKH">PEM IKH (Ikhtishosh)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="subjectId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Mata Pelajaran Peminatan</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Pilih Mata Pelajaran" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {subjects.map((s) => (
                                                                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </>
                                )}

                                {/* Nama Kelas */}
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nama Kelas</FormLabel>
                                            <div className="flex gap-2">
                                                <FormControl>
                                                    <Input placeholder="Contoh: X-A" {...field} />
                                                </FormControl>
                                                {form.watch('type') === 'PEMINATAN' && (
                                                    <Button 
                                                        type="button" 
                                                        variant="outline" 
                                                        size="sm"
                                                        className="h-10 text-xs shrink-0"
                                                        onClick={() => {
                                                            const grade = form.getValues('grade');
                                                            const category = form.getValues('peminatanCategory');
                                                            const subjectId = form.getValues('subjectId');
                                                            const subject = subjects.find(s => s.id === subjectId);
                                                            
                                                            if (grade && category && subject) {
                                                                const romanGrade = grade === '10' ? 'X' : grade === '11' ? 'XI' : 'XII';
                                                                form.setValue('name', `${romanGrade} PEM ${category} ${subject.name.toUpperCase()}`);
                                                            } else {
                                                                toast.error('Lengkapi Sertifikat/Mata Pelajaran untuk saran nama');
                                                            }
                                                        }}
                                                    >
                                                        Saran Nama
                                                    </Button>
                                                )}
                                            </div>
                                            <FormDescription className="text-[11px] flex items-center gap-1.5 text-slate-500 mt-1">
                                                <Info className="h-3 w-3 text-blue-500 shrink-0" />
                                                Gunakan penamaan yang konsisten (misal: X-A, XI PEM AKH BIOLOGI).
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Wali Kelas (Combobox) - Only for Regular classes */}
                                {form.watch('type') === 'REGULER' && (
                                    <FormField
                                        control={form.control}
                                        name="homeroomTeacherId"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Wali Kelas</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                className={cn(
                                                                    "w-full justify-between font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value
                                                                    ? teachers.find(
                                                                        (t) => t.id === field.value
                                                                    )?.name
                                                                    : "Pilih Wali Kelas"}
                                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-full p-0">
                                                        <Command>
                                                            <CommandInput placeholder="Cari guru..." />
                                                            <CommandList>
                                                                <CommandEmpty>Guru tidak ditemukan.</CommandEmpty>
                                                                <CommandGroup>
                                                                    <CommandItem
                                                                        value="none"
                                                                        onSelect={() => {
                                                                            form.setValue("homeroomTeacherId", "");
                                                                        }}
                                                                    >
                                                                        <Check
                                                                            className={cn(
                                                                                "mr-2 h-4 w-4",
                                                                                field.value === "" ? "opacity-100" : "opacity-0"
                                                                            )}
                                                                        />
                                                                        -- Belum Ada --
                                                                    </CommandItem>
                                                                    {teachers.map((teacher) => (
                                                                        <CommandItem
                                                                            value={teacher.name}
                                                                            key={teacher.id}
                                                                            onSelect={() => {
                                                                                form.setValue("homeroomTeacherId", teacher.id);
                                                                            }}
                                                                        >
                                                                            <Check
                                                                                className={cn(
                                                                                    "mr-2 h-4 w-4",
                                                                                    teacher.id === field.value
                                                                                        ? "opacity-100"
                                                                                        : "opacity-0"
                                                                                )}
                                                                            />
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

                                {/* Kapasitas */}
                                <FormField
                                    control={form.control}
                                    name="capacity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Kapasitas Siswa</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="number"
                                                    {...field}
                                                    value={(field.value as string | number) ?? ''}
                                                />
                                            </FormControl>
                                            <FormDescription className="text-[11px] flex items-center gap-1.5 text-slate-500 mt-1">
                                                <Info className="h-3 w-3 text-blue-500 shrink-0" />
                                                Standard kapasitas kelas biasanya 30-36 siswa.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Kategori Gender */}
                                <FormField
                                    control={form.control}
                                    name="genderCategory"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Kategori Gender</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Pilih Kategori" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="PUTRA">Putra (Laki-laki)</SelectItem>
                                                    <SelectItem value="PUTRI">Putri (Perempuan)</SelectItem>
                                                    <SelectItem value="CAMPURAN">Campuran</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex gap-3 pt-4 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.push('/admin/class')}
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
                                            Simpan
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
