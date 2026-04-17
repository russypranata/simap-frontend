'use client';

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Save, Users, Loader2, AlertCircle, Info,
    UserCircle, Briefcase, GraduationCap, KeyRound,
    ShieldCheck, ArrowLeft,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { TeacherRole, CreateTeacherPayload, UpdateTeacherPayload } from '../types/teacher';
import { useTeacher } from '../hooks/useTeacher';
import { useTeacherList } from '../hooks/useTeacherList';

// ─── Schemas ───────────────────────────────────────────────────────────────────

const baseSchema = z.object({
    // User fields
    name: z.string().min(3, 'Nama minimal 3 karakter'),
    email: z.string().email('Email tidak valid'),
    username: z.string().min(3, 'Username minimal 3 karakter'),
    phone: z.string().optional(),
    address: z.string().optional(),
    dob: z.string().optional(),
    birth_place: z.string().optional(),
    gender: z.enum(['L', 'P']).optional(),
    role: z.enum(['subject_teacher', 'picket_teacher', 'homeroom_teacher'] as const),

    // Profile fields
    employee_id: z.string().optional(),
    nuptk: z.string().optional(),
    nik: z.string().optional(),
    qualifications: z.string().optional(),
    employment_status: z.enum(['PNS', 'PPPK', 'GTY', 'GTT', 'HONORER']).optional(),
    institution: z.string().optional(),
    sk_number: z.string().optional(),
    sk_date: z.string().optional(),
    status: z.enum(['active', 'inactive', 'leave']).default('active'),
    join_date: z.string().optional(),
    last_education: z.enum(['SMA', 'D3', 'S1', 'S2', 'S3']).optional(),
    education_major: z.string().optional(),
    education_university: z.string().optional(),
    education_graduation_year: z.string().max(4).optional(),
});

// Create: password wajib
const createSchema = baseSchema.extend({
    password: z.string().min(8, 'Password minimal 8 karakter'),
});

// Edit: password opsional
const editSchema = baseSchema.extend({
    password: z.string().min(8, 'Password minimal 8 karakter').optional().or(z.literal('')),
});

type CreateFormValues = z.infer<typeof createSchema>;
type EditFormValues = z.infer<typeof editSchema>;
type FormValues = CreateFormValues | EditFormValues;

// ─── Section Header Helper ─────────────────────────────────────────────────────

interface SectionHeaderProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    iconBg?: string;
    iconColor?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
    icon, title, description, iconBg = 'bg-blue-100', iconColor = 'text-blue-700',
}) => (
    <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl ${iconBg}`}>
            <span className={`h-5 w-5 block [&>svg]:h-5 [&>svg]:w-5 ${iconColor}`}>{icon}</span>
        </div>
        <div>
            <CardTitle className="text-lg font-semibold text-slate-800">{title}</CardTitle>
            <CardDescription className="text-sm text-slate-600">{description}</CardDescription>
        </div>
    </div>
);

// ─── Component ─────────────────────────────────────────────────────────────────

export const TeacherForm: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const rawId = params?.id as string | undefined;
    const isEdit = !!rawId && rawId !== 'new';
    const teacherId = isEdit ? Number(rawId) : null;

    const { teacher, isLoading: isLoadingTeacher, isError } = useTeacher(teacherId);
    const { createTeacher, updateTeacher, isCreating, isUpdating } = useTeacherList();

    const isSaving = isCreating || isUpdating;

    const form = useForm<FormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(isEdit ? editSchema : createSchema) as any,
        defaultValues: {
            name: '',
            email: '',
            username: '',
            password: '',
            phone: '',
            address: '',
            dob: '',
            birth_place: '',
            gender: undefined,
            role: 'subject_teacher',
            employee_id: '',
            nuptk: '',
            nik: '',
            qualifications: '',
            employment_status: undefined,
            institution: '',
            sk_number: '',
            sk_date: '',
            status: 'active',
            join_date: '',
            last_education: undefined,
            education_major: '',
            education_university: '',
            education_graduation_year: '',
        },
    });

    // Populate form saat edit
    useEffect(() => {
        if (isEdit && teacher) {
            const p = teacher.teacher_profile;
            form.reset({
                name: teacher.name,
                email: teacher.email,
                username: teacher.username,
                password: '',
                phone: teacher.phone ?? '',
                address: teacher.address ?? '',
                dob: teacher.dob ?? '',
                birth_place: teacher.birth_place ?? '',
                gender: (teacher.gender as 'L' | 'P') ?? undefined,
                role: (teacher.roles[0] as TeacherRole) ?? 'subject_teacher',
                employee_id: p?.employee_id ?? '',
                nuptk: p?.nuptk ?? '',
                nik: p?.nik ?? '',
                qualifications: p?.qualifications ?? '',
                employment_status: p?.employment_status ?? undefined,
                institution: p?.institution ?? '',
                sk_number: p?.sk_number ?? '',
                sk_date: p?.sk_date ?? '',
                status: p?.status ?? 'active',
                join_date: p?.join_date ?? '',
                last_education: p?.last_education ?? undefined,
                education_major: p?.education_major ?? '',
                education_university: p?.education_university ?? '',
                education_graduation_year: p?.education_graduation_year ?? '',
            });
        }
    }, [isEdit, teacher, form]);

    const onSubmit = async (values: FormValues) => {
        // Bersihkan string kosong jadi undefined
        const clean = <T extends Record<string, unknown>>(obj: T): T =>
            Object.fromEntries(
                Object.entries(obj).map(([k, v]) => [k, v === '' ? undefined : v])
            ) as T;

        if (isEdit && teacherId) {
            const payload: UpdateTeacherPayload = clean({
                ...values,
                password: (values as EditFormValues).password || undefined,
            });
            await updateTeacher({ id: teacherId, data: payload });
            router.push(`/admin/users/teachers/${teacherId}`);
        } else {
            const payload: CreateTeacherPayload = clean(values as CreateFormValues) as CreateTeacherPayload;
            const created = await createTeacher(payload);
            router.push(`/admin/users/teachers/${created.id}`);
        }
    };

    // Loading state saat edit
    if (isEdit && isLoadingTeacher) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        );
    }

    if (isEdit && isError) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <AlertCircle className="h-12 w-12 text-red-400" />
                <p className="text-slate-600 font-medium">Data guru tidak ditemukan</p>
                <Button variant="outline" onClick={() => router.push('/admin/users/teachers')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Kembali ke Daftar
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-6">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold tracking-tight">
                        <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                            {isEdit ? 'Edit ' : 'Tambah '}
                        </span>
                        <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                            Data PTK
                        </span>
                    </h1>
                    <div className="flex items-center gap-2 p-2 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                        <Users className="h-5 w-5" />
                    </div>
                </div>
                <p className="text-muted-foreground mt-1">
                    {isEdit
                        ? 'Perbarui informasi data diri dan kepegawaian.'
                        : 'Lengkapi formulir untuk menambahkan guru baru ke sistem.'}
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    {/* ── 1. Akun Sistem ── */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-2">
                            <SectionHeader
                                icon={<KeyRound />}
                                title="Akun Sistem"
                                description="Kredensial login dan hak akses di aplikasi"
                                iconBg="bg-blue-100"
                                iconColor="text-blue-700"
                            />
                        </CardHeader>
                        <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel>Nama Lengkap <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nama beserta gelar, contoh: Ahmad Dahlan, S.Pd." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="nama@simap.sch.id" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="username" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="nama.guru" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="password" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Password {!isEdit && <span className="text-red-500">*</span>}
                                        {isEdit && (
                                            <span className="text-slate-400 font-normal text-xs ml-1">
                                                (kosongkan jika tidak diubah)
                                            </span>
                                        )}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder={isEdit ? '••••••••' : 'Min. 8 karakter'}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="role" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Peran Sistem <span className="text-red-500">*</span></FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih peran" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="subject_teacher">Guru Mapel</SelectItem>
                                            <SelectItem value="picket_teacher">Guru Piket</SelectItem>
                                            <SelectItem value="homeroom_teacher">Wali Kelas</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription className="text-[11px] flex items-center gap-1.5 text-slate-500 mt-1">
                                        <Info className="h-3 w-3 text-blue-500 shrink-0" />
                                        Menentukan menu dan fitur yang dapat diakses guru ini.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    {/* ── 2. Data Pribadi ── */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-2">
                            <SectionHeader
                                icon={<UserCircle />}
                                title="Data Pribadi"
                                description="Informasi identitas diri dan kontak"
                                iconBg="bg-blue-100"
                                iconColor="text-blue-700"
                            />
                        </CardHeader>
                        <CardContent className="pt-4 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField control={form.control} name="phone" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>No. Handphone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="08xxxxxxxxxx" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="gender" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Jenis Kelamin</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value ?? ''}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih jenis kelamin" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="L">Laki-laki</SelectItem>
                                                <SelectItem value="P">Perempuan</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="birth_place" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tempat Lahir</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Kota lahir" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="dob" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tanggal Lahir</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                            <FormField control={form.control} name="address" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Alamat Lengkap</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Jl. Contoh No. 1, Kelurahan, Kecamatan, Kota..."
                                            className="resize-none h-20"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    {/* ── 3. Data Kepegawaian ── */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-2">
                            <SectionHeader
                                icon={<Briefcase />}
                                title="Data Kepegawaian"
                                description="NIP, NUPTK, status ikatan kerja, jabatan, dan SK pengangkatan"
                                iconBg="bg-blue-100"
                                iconColor="text-blue-700"
                            />
                        </CardHeader>
                        <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="employee_id" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>NIP / ID Pegawai</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nomor Induk Pegawai" {...field} />
                                    </FormControl>
                                    <FormDescription className="text-[11px] flex items-center gap-1.5 text-slate-500 mt-1">
                                        <Info className="h-3 w-3 text-blue-500 shrink-0" />
                                        Untuk PNS/PPPK gunakan NIP resmi BKN.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="nuptk" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>NUPTK</FormLabel>
                                    <FormControl>
                                        <Input placeholder="16 digit NUPTK" {...field} />
                                    </FormControl>
                                    <FormDescription className="text-[11px] flex items-center gap-1.5 text-slate-500 mt-1">
                                        <Info className="h-3 w-3 text-blue-500 shrink-0" />
                                        Nomor Unik Pendidik dan Tenaga Kependidikan.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="nik" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>NIK</FormLabel>
                                    <FormControl>
                                        <Input placeholder="16 digit NIK KTP" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="qualifications" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Gelar Akademik</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Contoh: S.Pd., M.Pd." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="employment_status" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status Ikatan Kerja</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value ?? ''}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="PNS">PNS — Pegawai Negeri Sipil</SelectItem>
                                            <SelectItem value="PPPK">PPPK</SelectItem>
                                            <SelectItem value="GTY">GTY — Guru Tetap Yayasan</SelectItem>
                                            <SelectItem value="GTT">GTT — Guru Tidak Tetap</SelectItem>
                                            <SelectItem value="HONORER">Honorer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="status" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status Aktif</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="active">Aktif</SelectItem>
                                            <SelectItem value="inactive">Nonaktif</SelectItem>
                                            <SelectItem value="leave">Cuti</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="institution" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lembaga Pengangkat</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Contoh: Ketua Yayasan Pendidikan SIMAP" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="sk_number" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>No. SK Pengangkatan</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Contoh: YPS/SK/2020/001" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="sk_date" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tanggal SK</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="join_date" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>TMT Pengangkatan</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormDescription className="text-[11px] flex items-center gap-1.5 text-slate-500 mt-1">
                                        <Info className="h-3 w-3 text-blue-500 shrink-0" />
                                        Terhitung Mulai Tanggal pengangkatan.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    {/* ── 4. Riwayat Pendidikan ── */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-2">
                            <SectionHeader
                                icon={<GraduationCap />}
                                title="Riwayat Pendidikan"
                                description="Pendidikan formal terakhir yang ditempuh"
                                iconBg="bg-blue-100"
                                iconColor="text-blue-700"
                            />
                        </CardHeader>
                        <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="last_education" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Jenjang Pendidikan</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value ?? ''}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih jenjang" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="SMA">SMA / Sederajat</SelectItem>
                                            <SelectItem value="D3">D3</SelectItem>
                                            <SelectItem value="S1">S1 / Sarjana</SelectItem>
                                            <SelectItem value="S2">S2 / Magister</SelectItem>
                                            <SelectItem value="S3">S3 / Doktor</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="education_graduation_year" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tahun Lulus</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Contoh: 2015" maxLength={4} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="education_university" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Universitas / Institusi</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Contoh: Universitas Negeri Malang" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="education_major" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Jurusan / Program Studi</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Contoh: Pendidikan Matematika" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    {/* ── Info Box ── */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-3">
                            <div className="p-1.5 bg-blue-100 rounded-md shrink-0 mt-0.5">
                                <ShieldCheck className="h-4 w-4 text-blue-700" />
                            </div>
                            <div className="text-sm text-blue-900 space-y-1">
                                <p className="font-semibold text-blue-800">Keamanan Data</p>
                                <p className="text-blue-700/90 leading-relaxed text-xs">
                                    Data NIK bersifat privat dan hanya dapat dilihat oleh admin. Pastikan semua data yang dimasukkan sudah benar sebelum menyimpan.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ── Actions ── */}
                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={isSaving}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="bg-blue-800 hover:bg-blue-900 text-white min-w-[160px]"
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    {isEdit ? 'Simpan Perubahan' : 'Tambah Guru'}
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};
