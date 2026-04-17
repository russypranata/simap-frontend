'use client';

import React, { useEffect, useState, startTransition } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Save, UserPlus, UserCog, Shield, Loader2, AlertCircle,
    AlertTriangle, ExternalLink, ChevronDown, ChevronUp, Info, Users,
    Wand2, ArrowLeft,
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import { AdminUser, UserRole } from '../types/user';
import { useUserManagement } from '../hooks/useUserManagement';
import { userService } from '../services/userService';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Generate username dari nama: "Ahmad Fauzan Hakim" → "ahmad.fauzan.hakim" */
const generateUsername = (name: string): string => {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')   // hapus diakritik
        .replace(/[^a-z0-9\s]/g, '')        // hapus karakter non-alfanumerik
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .join('.');
};

// ─── Role metadata ────────────────────────────────────────────────────────────

interface RoleMeta {
    label: string;
    description: string;
    dedicatedPath?: string;
    dedicatedLabel?: string;
    profileSection?: string;
}

const ROLE_META: Record<UserRole, RoleMeta> = {
    admin:                   { label: 'Administrator',    description: 'Akses penuh ke seluruh fitur sistem.' },
    headmaster:              { label: 'Kepala Sekolah',   description: 'Akses dashboard kepala sekolah dan laporan.', profileSection: 'Data Jabatan' },
    mutamayizin_coordinator: { label: 'PJ Mutamayizin',   description: 'Koordinator program mutamayizin.', profileSection: 'Data Jabatan' },
    subject_teacher:         { label: 'Guru Mapel',       description: 'Akses input nilai, jadwal, dan absensi mapel.', dedicatedPath: '/admin/users/teachers', dedicatedLabel: 'Halaman Data PTK', profileSection: 'Data Kepegawaian' },
    picket_teacher:          { label: 'Guru Piket',       description: 'Akses fitur piket dan presensi harian.', dedicatedPath: '/admin/users/teachers', dedicatedLabel: 'Halaman Data PTK', profileSection: 'Data Kepegawaian' },
    homeroom_teacher:        { label: 'Wali Kelas',       description: 'Akses manajemen kelas dan laporan siswa.', dedicatedPath: '/admin/users/teachers', dedicatedLabel: 'Halaman Data PTK', profileSection: 'Data Kepegawaian' },
    student:                 { label: 'Siswa',            description: 'Akses nilai, jadwal, dan presensi siswa.', dedicatedPath: '/admin/users/students', dedicatedLabel: 'Halaman Data Siswa', profileSection: 'Data Siswa' },
    parent:                  { label: 'Wali Murid',       description: 'Akses monitoring perkembangan anak.', dedicatedPath: '/admin/users/parents', dedicatedLabel: 'Halaman Wali Murid', profileSection: 'Data Wali Murid' },
    extracurricular_tutor:   { label: 'Tutor Ekskul',     description: 'Akses manajemen ekskul dan presensi anggota.', dedicatedPath: '/admin/users/tutors', dedicatedLabel: 'Halaman Tutor Ekskul', profileSection: 'Data Tutor' },
};

const DEDICATED_ROLES: UserRole[] = ['subject_teacher', 'picket_teacher', 'homeroom_teacher', 'student', 'parent', 'extracurricular_tutor'];

// ─── Schema ───────────────────────────────────────────────────────────────────

const baseSchema = z.object({
    name:             z.string().min(3, 'Nama minimal 3 karakter'),
    email:            z.string().email('Email tidak valid'),
    username:         z.string().min(3, 'Username minimal 3 karakter').regex(/^[a-z0-9._]+$/, 'Hanya huruf kecil, angka, titik, underscore'),
    phone:            z.string().optional(),
    role:             z.enum(['admin','subject_teacher','picket_teacher','homeroom_teacher','student','parent','extracurricular_tutor','mutamayizin_coordinator','headmaster'] as const),
    department:       z.string().optional(),
    job_title:        z.string().optional(),
    employee_id:      z.string().optional(),
    qualifications:   z.string().optional(),
    admission_number: z.string().optional(),
    religion:         z.string().optional(),
    occupation:       z.string().optional(),
    nip:              z.string().optional(),
    extracurricular:  z.string().optional(),
    join_date:        z.string().optional(),
});

const createSchema = baseSchema.extend({ password: z.string().min(8, 'Password minimal 8 karakter') });
const editSchema   = baseSchema.extend({ password: z.string().min(8).optional().or(z.literal('')) });

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

// ─── Component ────────────────────────────────────────────────────────────────

export const UserForm: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const rawId = params?.id as string | undefined;
    const isEdit = !!rawId && rawId !== 'new';
    const userId = isEdit ? Number(rawId) : null;

    const { createUser, updateUser, isCreating, isUpdating } = useUserManagement();
    const isSaving = isCreating || isUpdating;

    const [isLoadingUser, setIsLoadingUser] = useState(isEdit);
    const [loadError, setLoadError]         = useState(false);
    const [showProfile, setShowProfile]     = useState(false);
    const [usernameEdited, setUsernameEdited] = useState(false);

    const form = useForm<FormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(isEdit ? editSchema : createSchema) as any,
        defaultValues: {
            name: '', email: '', username: '', phone: '', password: '',
            role: 'admin',
            department: '', job_title: '',
            employee_id: '', qualifications: '',
            admission_number: '', religion: '',
            occupation: '',
            nip: '', extracurricular: '', join_date: '',
        },
    });

    const selectedRole = useWatch({ control: form.control, name: 'role' }) as UserRole;
    const watchedName  = useWatch({ control: form.control, name: 'name' }) as string;
    const roleMeta     = ROLE_META[selectedRole] ?? ROLE_META['admin'];
    const isDedicated  = DEDICATED_ROLES.includes(selectedRole);

    // Auto-generate username dari nama (hanya saat create & belum diedit manual)
    useEffect(() => {
        if (!isEdit && !usernameEdited && watchedName) {
            const generated = generateUsername(watchedName);
            if (generated) form.setValue('username', generated, { shouldValidate: false });
        }
    }, [watchedName, isEdit, usernameEdited, form]);

    // Reset profile fields saat ganti role (hanya create)
    useEffect(() => {
        if (!isEdit) {
            const profileFields = ['department','job_title','employee_id','qualifications','admission_number','religion','occupation','nip','extracurricular','join_date'] as const;
            profileFields.forEach(f => form.setValue(f, ''));
            startTransition(() => {
                setShowProfile(false);
            });
        }
    }, [selectedRole, isEdit, form]);

    // Load data saat edit
    useEffect(() => {
        if (!isEdit || !userId) return;
        startTransition(() => { setIsLoadingUser(true); });
        userService.getUserById(userId)
            .then((user: AdminUser) => {
                form.reset({
                    name:             user.name,
                    email:            user.email,
                    username:         user.username,
                    phone:            user.phone ?? '',
                    password:         '',
                    role:             (user.roles[0] as UserRole) ?? 'admin',
                    department:       user.staff_profile?.department ?? '',
                    job_title:        user.staff_profile?.job_title ?? '',
                    employee_id:      user.teacher_profile?.employee_id ?? '',
                    qualifications:   user.teacher_profile?.qualifications ?? '',
                    admission_number: user.student_profile?.admission_number ?? '',
                    religion:         user.student_profile?.religion ?? '',
                    occupation:       user.parent_profile?.occupation ?? '',
                    nip:              user.tutor_profile?.nip ?? '',
                    extracurricular:  user.tutor_profile?.extracurricular ?? '',
                    join_date:        user.tutor_profile?.join_date ?? '',
                });
                startTransition(() => {
                    setUsernameEdited(true);
                });
                const hasProfile = !!(
                    user.staff_profile?.department || user.staff_profile?.job_title ||
                    user.teacher_profile?.employee_id || user.teacher_profile?.qualifications ||
                    user.student_profile?.admission_number || user.student_profile?.religion ||
                    user.parent_profile?.occupation ||
                    user.tutor_profile?.nip || user.tutor_profile?.extracurricular
                );
                if (hasProfile) setShowProfile(true);
            })
            .catch(() => setLoadError(true))
            .finally(() => setIsLoadingUser(false));
    }, [isEdit, userId, form]);

    const onSubmit = async (values: FormValues) => {
        const clean = (v: string | undefined) => (v === '' ? undefined : v);
        const payload = {
            name: values.name, email: values.email, username: values.username,
            phone: clean(values.phone), role: values.role,
            department: clean(values.department), job_title: clean(values.job_title),
            employee_id: clean(values.employee_id), qualifications: clean(values.qualifications),
            admission_number: clean(values.admission_number), religion: clean(values.religion),
            occupation: clean(values.occupation),
            nip: clean(values.nip), extracurricular: clean(values.extracurricular), join_date: clean(values.join_date),
        };
        if (isEdit && userId) {
            await updateUser({ id: userId, data: { ...payload, password: clean((values as EditValues).password) } });
        } else {
            await createUser({ ...payload, password: (values as CreateValues).password });
        }
        router.push('/admin/users/management');
    };

    // ── Loading ──
    if (isEdit && isLoadingUser) {
        return (
            <div className="space-y-6">
                <div className="space-y-2"><Skeleton className="h-9 w-64" /><Skeleton className="h-4 w-48" /></div>
                <Card><CardContent className="pt-6 space-y-4">{[...Array(5)].map((_,i) => <Skeleton key={i} className="h-10 w-full" />)}</CardContent></Card>
            </div>
        );
    }

    if (isEdit && loadError) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <AlertCircle className="h-12 w-12 text-red-400" />
                <p className="text-slate-600 font-medium">Data pengguna tidak ditemukan</p>
                <Button variant="outline" onClick={() => router.push('/admin/users/management')}>
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
                            Pengguna
                        </span>
                    </h1>
                    <div className="p-2 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                        <Users className="h-5 w-5" />
                    </div>
                </div>
                <p className="text-muted-foreground mt-1">
                    {isEdit ? 'Perbarui informasi akun dan akses sistem pengguna.' : 'Buat akun pengguna baru dengan akses sistem yang sesuai.'}
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    {/* ── Card 1: Akses Sistem ── */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-3">
                            <SectionHeader icon={<Shield />} title="Akses Sistem" description="Tentukan level akses pengguna di aplikasi" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField control={form.control} name="role" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Akses Sistem <span className="text-red-500">*</span></FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value} disabled={isEdit}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih akses sistem" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.entries(ROLE_META).map(([value, meta]) => (
                                                <SelectItem key={value} value={value}>
                                                    {meta.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {isEdit && <FormDescription className="text-[11px] text-slate-400">Akses sistem tidak dapat diubah setelah akun dibuat.</FormDescription>}
                                    <FormMessage />
                                </FormItem>
                            )} />

                            {selectedRole && (
                                <div className={cn('flex items-start gap-3 p-3 rounded-lg border', isDedicated ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-100')}>
                                    {isDedicated
                                        ? <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                                        : <Shield className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                                    }
                                    <div className="flex-1 min-w-0">
                                        <p className={cn('text-xs font-semibold', isDedicated ? 'text-amber-800' : 'text-blue-800')}>{roleMeta.label}</p>
                                        <p className={cn('text-xs mt-0.5', isDedicated ? 'text-amber-700' : 'text-blue-700')}>{roleMeta.description}</p>
                                        {isDedicated && !isEdit && (
                                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                                <p className="text-xs text-amber-700">Role ini punya halaman khusus dengan form lebih lengkap.</p>
                                                <Button type="button" variant="outline" size="sm"
                                                    className="h-6 text-[11px] border-amber-300 text-amber-800 hover:bg-amber-100 shrink-0"
                                                    onClick={() => router.push(roleMeta.dedicatedPath!)}>
                                                    <ExternalLink className="h-3 w-3 mr-1" />{roleMeta.dedicatedLabel}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* ── Card 2: Data Akun ── */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-3">
                            <SectionHeader icon={isEdit ? <UserCog /> : <UserPlus />} title="Data Akun" description="Informasi login dan kontak pengguna" />
                        </CardHeader>
                        <CardContent className="space-y-5">
                            {/* Nama */}
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Lengkap <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nama lengkap pengguna" autoComplete="off" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            {/* Email & Username */}
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
                                                placeholder="nama.pengguna"
                                                autoComplete="off"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setUsernameEdited(true);
                                                }}
                                            />
                                        </FormControl>
                                        {!isEdit && (
                                            <FormDescription className="text-[11px] flex items-center gap-1.5 text-slate-500">
                                                <Info className="h-3 w-3 text-blue-500 shrink-0" />
                                                Otomatis dari nama. Edit jika perlu.
                                            </FormDescription>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            {/* Phone & Password */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FormField control={form.control} name="phone" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>No. Handphone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="08xxxxxxxxxx" autoComplete="off" {...field} />
                                        </FormControl>
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

                    {/* ── Card 3: Data Profil (collapsible, dinamis) ── */}
                    {roleMeta.profileSection && (
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="pb-3">
                                {/* Saat edit role dedicated: tampilkan redirect, bukan form profil */}
                                {isEdit && isDedicated ? (
                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                                        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-amber-800">{roleMeta.profileSection}</p>
                                            <p className="text-xs text-amber-700 mt-0.5">
                                                Data profil lengkap dikelola di halaman khusus agar tidak terjadi konflik data.
                                            </p>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="mt-2 h-7 text-xs border-amber-300 text-amber-800 hover:bg-amber-100"
                                                onClick={() => router.push(roleMeta.dedicatedPath!)}
                                            >
                                                <ExternalLink className="h-3 w-3 mr-1.5" />
                                                Edit di {roleMeta.dedicatedLabel}
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <button type="button" onClick={() => setShowProfile(!showProfile)}
                                        className="w-full flex items-center justify-between text-left group">
                                        <SectionHeader icon={<Info />} title={roleMeta.profileSection} description="Data tambahan — dapat dilengkapi kapan saja" />
                                        <div className="flex items-center gap-2 shrink-0 ml-4">
                                            <Badge variant="outline" className="text-[10px] h-5 px-2 text-slate-400 border-slate-200">Opsional</Badge>
                                            {showProfile ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                                        </div>
                                    </button>
                                )}
                            </CardHeader>

                            {showProfile && !(isEdit && isDedicated) && (
                                <CardContent className="pt-0 space-y-5 border-t border-slate-100">
                                    <div className="pt-4">
                                    {/* Teacher */}
                                    {['subject_teacher','picket_teacher','homeroom_teacher'].includes(selectedRole) && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <FormField control={form.control} name="employee_id" render={({ field }) => (
                                                <FormItem><FormLabel>NIP / ID Pegawai</FormLabel><FormControl><Input placeholder="Nomor Induk Pegawai" {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                            <FormField control={form.control} name="qualifications" render={({ field }) => (
                                                <FormItem><FormLabel>Gelar Akademik</FormLabel><FormControl><Input placeholder="S.Pd., M.Pd." {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                        </div>
                                    )}
                                    {/* Student */}
                                    {selectedRole === 'student' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <FormField control={form.control} name="admission_number" render={({ field }) => (
                                                <FormItem><FormLabel>No. Pendaftaran</FormLabel><FormControl><Input placeholder="Nomor pendaftaran" {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                            <FormField control={form.control} name="religion" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Agama</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value ?? ''}>
                                                        <FormControl><SelectTrigger><SelectValue placeholder="Pilih agama" /></SelectTrigger></FormControl>
                                                        <SelectContent>{['Islam','Kristen','Katolik','Hindu','Buddha','Konghucu'].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        </div>
                                    )}
                                    {/* Parent */}
                                    {selectedRole === 'parent' && (
                                        <FormField control={form.control} name="occupation" render={({ field }) => (
                                            <FormItem><FormLabel>Pekerjaan</FormLabel><FormControl><Input placeholder="Pekerjaan wali murid" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                    )}
                                    {/* Tutor */}
                                    {selectedRole === 'extracurricular_tutor' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <FormField control={form.control} name="nip" render={({ field }) => (
                                                <FormItem><FormLabel>NIP</FormLabel><FormControl><Input placeholder="Nomor Induk Pegawai" {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                            <FormField control={form.control} name="extracurricular" render={({ field }) => (
                                                <FormItem><FormLabel>Ekskul Diampu</FormLabel><FormControl><Input placeholder="Nama ekskul" {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                            <FormField control={form.control} name="join_date" render={({ field }) => (
                                                <FormItem><FormLabel>Tanggal Bergabung</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                        </div>
                                    )}
                                    {/* Staff */}
                                    {['headmaster','mutamayizin_coordinator'].includes(selectedRole) && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <FormField control={form.control} name="job_title" render={({ field }) => (
                                                <FormItem><FormLabel>Jabatan</FormLabel><FormControl><Input placeholder="Jabatan resmi" {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                            <FormField control={form.control} name="department" render={({ field }) => (
                                                <FormItem><FormLabel>Departemen / Bidang</FormLabel><FormControl><Input placeholder="Bidang tugas" {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                        </div>
                                    )}
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    )}

                    {/* ── Actions ── */}
                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => router.push('/admin/users/management')} disabled={isSaving}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Batal
                        </Button>
                        <Button type="submit" className="bg-blue-800 hover:bg-blue-900 text-white min-w-[160px]" disabled={isSaving}>
                            {isSaving ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menyimpan...</>
                            ) : isEdit ? (
                                <><Save className="mr-2 h-4 w-4" />Simpan Perubahan</>
                            ) : (
                                <><UserPlus className="mr-2 h-4 w-4" />Tambah Pengguna</>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};
