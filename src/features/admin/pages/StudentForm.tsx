'use client';

import React, { useEffect, useState, startTransition } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    GraduationCap, Save, Loader2, AlertCircle,
    User, Users, Info, ArrowLeft, Wand2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form, FormControl, FormDescription, FormField,
    FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { useStudentList, useStudentDetail } from '../hooks/useStudentList';

// ─── Schema ───────────────────────────────────────────────────────────────────

const baseSchema = z.object({
    name:             z.string().min(3, 'Nama minimal 3 karakter'),
    email:            z.string().email('Email tidak valid'),
    username:         z.string().min(3, 'Username minimal 3 karakter').regex(/^[a-z0-9._]+$/, 'Hanya huruf kecil, angka, titik, underscore'),
    phone:            z.string().optional(),
    address:          z.string().optional(),
    dob:              z.string().optional(),
    birth_place:      z.string().optional(),
    gender:           z.enum(['L', 'P']).optional(),
    admission_number: z.string().min(1, 'No. pendaftaran wajib diisi'),
    religion:         z.string().optional(),
    guardian_name:    z.string().optional(),
    guardian_phone:   z.string().optional(),
    guardian_relation:z.string().optional(),
});

const createSchema = baseSchema.extend({
    password: z.string().min(8, 'Password minimal 8 karakter'),
});

const editSchema = baseSchema.extend({
    password: z.string().min(8).optional().or(z.literal('')),
});

type CreateValues = z.infer<typeof createSchema>;
type EditValues   = z.infer<typeof editSchema>;
type FormValues   = CreateValues | EditValues;

// ─── Section Header ───────────────────────────────────────────────────────────

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-blue-100 shrink-0">
            <span className="h-5 w-5 block [&>svg]:h-5 [&>svg]:w-5 text-blue-700">{icon}</span>
        </div>
        <div>
            <CardTitle className="text-lg font-semibold text-slate-800">{title}</CardTitle>
            <CardDescription className="text-sm text-slate-600 mt-0.5">{description}</CardDescription>
        </div>
    </div>
);

// ─── Auto-generate username ───────────────────────────────────────────────────

const generateUsername = (name: string): string =>
    name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/).filter(Boolean).join('.');

// ─── Component ────────────────────────────────────────────────────────────────

export const StudentForm: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const rawId = params?.id as string | undefined;
    const isEdit = !!rawId && rawId !== 'new';
    const studentId = isEdit ? Number(rawId) : null;

    // Pre-fill from PPDB conversion
    const fromPpdb = searchParams?.get('from_ppdb');
    const ppdbDefaults = fromPpdb ? {
        name:          searchParams?.get('name') ?? '',
        dob:           searchParams?.get('dob') ?? '',
        birth_place:   searchParams?.get('birth_place') ?? '',
        gender:        (searchParams?.get('gender') as 'L' | 'P') ?? undefined,
        guardian_name: searchParams?.get('parent_name') ?? '',
        guardian_phone:searchParams?.get('parent_phone') ?? '',
    } : null;

    const { createStudent, updateStudent, isCreating, isUpdating } = useStudentList();
    const { data: student, isLoading: isLoadingStudent, isError } = useStudentDetail(studentId);

    const isSaving = isCreating || isUpdating;
    const [usernameEdited, setUsernameEdited] = useState(false);

    const form = useForm<FormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(isEdit ? editSchema : createSchema) as any,
        defaultValues: {
            name:             ppdbDefaults?.name ?? '',
            email:            '',
            username:         '',
            phone:            '',
            address:          '',
            dob:              ppdbDefaults?.dob ?? '',
            birth_place:      ppdbDefaults?.birth_place ?? '',
            gender:           ppdbDefaults?.gender ?? undefined,
            password:         '',
            admission_number: '',
            religion:         '',
            guardian_name:    ppdbDefaults?.guardian_name ?? '',
            guardian_phone:   ppdbDefaults?.guardian_phone ?? '',
            guardian_relation:'Orang Tua',
        },
    });

    const watchedName = useWatch({ control: form.control, name: 'name' }) as string;

    // Auto-generate username
    useEffect(() => {
        if (!isEdit && !usernameEdited && watchedName) {
            const generated = generateUsername(watchedName);
            if (generated) form.setValue('username', generated, { shouldValidate: false });
        }
    }, [watchedName, isEdit, usernameEdited, form]);

    // Populate form saat edit
    useEffect(() => {
        if (isEdit && student) {
            const g = student.guardian_details;
            form.reset({
                name:             student.name,
                email:            student.email,
                username:         student.username,
                phone:            student.phone ?? '',
                address:          student.address ?? '',
                dob:              student.dob ?? '',
                birth_place:      student.birth_place ?? '',
                gender:           (student.gender as 'L' | 'P') ?? undefined,
                password:         '',
                admission_number: student.admission_number,
                religion:         student.religion ?? '',
                guardian_name:    g?.name ?? '',
                guardian_phone:   g?.phone ?? '',
                guardian_relation:g?.relation ?? 'Orang Tua',
            });
            startTransition(() => { setUsernameEdited(true); });
        }
    }, [isEdit, student, form]);

    const onSubmit = async (values: FormValues) => {
        const clean = (v: string | undefined) => (v === '' ? undefined : v);
        const payload = {
            name:             values.name,
            email:            values.email,
            username:         values.username,
            phone:            clean(values.phone),
            address:          clean(values.address),
            dob:              clean(values.dob),
            birth_place:      clean(values.birth_place),
            gender:           values.gender,
            admission_number: values.admission_number,
            religion:         clean(values.religion),
            guardian_name:    clean(values.guardian_name),
            guardian_phone:   clean(values.guardian_phone),
            guardian_relation:clean(values.guardian_relation),
        };

        if (isEdit && studentId) {
            await updateStudent({
                id: studentId,
                data: { ...payload, password: clean((values as EditValues).password) },
            });
            router.push(`/admin/users/students/${studentId}`);
        } else {
            await createStudent({ ...payload, password: (values as CreateValues).password });
            router.push('/admin/users/students');
        }
    };

    // ── Loading ──
    if (isEdit && isLoadingStudent) {
        return (
            <div className="space-y-6">
                <div className="space-y-2"><Skeleton className="h-9 w-64" /><Skeleton className="h-4 w-48" /></div>
                <Card><CardContent className="pt-6 space-y-4">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</CardContent></Card>
            </div>
        );
    }

    if (isEdit && isError) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <AlertCircle className="h-12 w-12 text-red-400" />
                <p className="text-slate-600 font-medium">Data siswa tidak ditemukan</p>
                <Button variant="outline" onClick={() => router.push('/admin/users/students')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Kembali ke Daftar
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-6">
            {/* ── Header ── */}
            <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold tracking-tight">
                        <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                            {isEdit ? 'Edit ' : 'Tambah '}
                        </span>
                        <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                            Data Siswa
                        </span>
                    </h1>
                    <div className="p-2 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                        <GraduationCap className="h-5 w-5" />
                    </div>
                </div>
                <p className="text-muted-foreground mt-1">
                    {isEdit ? 'Perbarui informasi data siswa.' : 'Tambahkan siswa baru ke sistem.'}
                </p>
            </div>

            {/* PPDB conversion banner */}
            {fromPpdb && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-semibold text-blue-900">Data dari PPDB</p>
                        <p className="text-xs text-blue-700 mt-0.5">
                            Beberapa field sudah diisi otomatis dari data pendaftar PPDB. Lengkapi data yang masih kosong sebelum menyimpan.
                        </p>
                    </div>
                </div>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    {/* ── Card 1: Akun Sistem ── */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-3">
                            <SectionHeader icon={<User />} title="Akun Sistem" description="Kredensial login siswa di aplikasi" />
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Lengkap <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nama lengkap siswa" autoComplete="off" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FormField control={form.control} name="email" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="email@sekolah.id" autoComplete="off" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="username" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Username <span className="text-red-500">*</span>
                                            {!isEdit && !usernameEdited && (
                                                <span className="ml-2 inline-flex items-center gap-1 text-[10px] text-blue-600 font-normal">
                                                    <Wand2 className="h-3 w-3" />auto
                                                </span>
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="nama.siswa"
                                                autoComplete="off"
                                                {...field}
                        onChange={(e) => { field.onChange(e); startTransition(() => { setUsernameEdited(true); }); }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FormField control={form.control} name="phone" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>No. Handphone</FormLabel>
                                        <FormControl><Input placeholder="08xxxxxxxxxx" autoComplete="off" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="password" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Password {!isEdit && <span className="text-red-500">*</span>}
                                            {isEdit && <span className="text-slate-400 font-normal text-xs ml-1">(kosongkan jika tidak diubah)</span>}
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder={isEdit ? '••••••••' : 'Min. 8 karakter'} autoComplete="new-password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* ── Card 2: Data Pribadi ── */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-3">
                            <SectionHeader icon={<GraduationCap />} title="Data Pribadi" description="Identitas dan informasi diri siswa" />
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FormField control={form.control} name="admission_number" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>No. Pendaftaran <span className="text-red-500">*</span></FormLabel>
                                        <FormControl><Input placeholder="ADM-2024-0001" autoComplete="off" {...field} /></FormControl>
                                        <FormDescription className="text-[11px] flex items-center gap-1.5 text-slate-500">
                                            <Info className="h-3 w-3 text-blue-500 shrink-0" />
                                            Nomor unik pendaftaran siswa.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="gender" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Jenis Kelamin</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value ?? ''}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Pilih jenis kelamin" /></SelectTrigger></FormControl>
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
                                        <FormControl><Input placeholder="Kota lahir" autoComplete="off" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="dob" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tanggal Lahir</FormLabel>
                                        <FormControl><Input type="date" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="religion" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Agama</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value ?? ''}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Pilih agama" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                {['Islam','Kristen','Katolik','Hindu','Buddha','Konghucu'].map((r) => (
                                                    <SelectItem key={r} value={r}>{r}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                            <FormField control={form.control} name="address" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Alamat Lengkap</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Jl. Contoh No. 1, Kelurahan, Kecamatan, Kota..." className="resize-none h-20" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    {/* ── Card 3: Data Wali ── */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-3">
                            <SectionHeader icon={<Users />} title="Data Wali" description="Informasi orang tua atau wali siswa" />
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FormField control={form.control} name="guardian_name" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nama Wali</FormLabel>
                                        <FormControl><Input placeholder="Nama orang tua / wali" autoComplete="off" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="guardian_phone" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>No. HP Wali</FormLabel>
                                        <FormControl><Input placeholder="08xxxxxxxxxx" autoComplete="off" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="guardian_relation" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hubungan</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value ?? 'Orang Tua'}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Pilih hubungan" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                {['Ayah','Ibu','Orang Tua','Kakak','Paman','Bibi','Wali'].map((r) => (
                                                    <SelectItem key={r} value={r}>{r}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* ── Actions ── */}
                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => router.push('/admin/users/students')} disabled={isSaving}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Batal
                        </Button>
                        <Button type="submit" className="bg-blue-800 hover:bg-blue-900 text-white min-w-[160px]" disabled={isSaving}>
                            {isSaving ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menyimpan...</>
                            ) : isEdit ? (
                                <><Save className="mr-2 h-4 w-4" />Simpan Perubahan</>
                            ) : (
                                <><GraduationCap className="mr-2 h-4 w-4" />Tambah Siswa</>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};
