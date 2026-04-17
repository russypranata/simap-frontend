'use client';

import React, { useEffect, useState, startTransition } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import {
    Loader2, Info, UserPlus, UserCog, Shield,
    AlertTriangle, ExternalLink, ChevronDown, ChevronUp,
    X, Save,
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
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import { AdminUser, UserRole } from '../../types/user';
import { useUserManagement } from '../../hooks/useUserManagement';

// ─── Role metadata ────────────────────────────────────────────────────────────

interface RoleMeta {
    label: string;
    description: string;
    dedicatedPath?: string;       // halaman dedicated untuk role ini
    dedicatedLabel?: string;      // label tombol redirect
    profileSection?: string;      // judul section profil tambahan
}

const ROLE_META: Record<UserRole, RoleMeta> = {
    admin: {
        label: 'Administrator',
        description: 'Akses penuh ke seluruh fitur sistem.',
    },
    headmaster: {
        label: 'Kepala Sekolah',
        description: 'Akses dashboard kepala sekolah dan laporan.',
        profileSection: 'Data Jabatan',
    },
    mutamayizin_coordinator: {
        label: 'PJ Mutamayizin',
        description: 'Koordinator program mutamayizin.',
        profileSection: 'Data Jabatan',
    },
    subject_teacher: {
        label: 'Guru Mapel',
        description: 'Akses input nilai, jadwal, dan absensi mapel.',
        dedicatedPath: '/admin/users/teachers',
        dedicatedLabel: 'Halaman Data PTK',
        profileSection: 'Data Kepegawaian',
    },
    picket_teacher: {
        label: 'Guru Piket',
        description: 'Akses fitur piket dan presensi harian.',
        dedicatedPath: '/admin/users/teachers',
        dedicatedLabel: 'Halaman Data PTK',
        profileSection: 'Data Kepegawaian',
    },
    homeroom_teacher: {
        label: 'Wali Kelas',
        description: 'Akses manajemen kelas dan laporan siswa.',
        dedicatedPath: '/admin/users/teachers',
        dedicatedLabel: 'Halaman Data PTK',
        profileSection: 'Data Kepegawaian',
    },
    student: {
        label: 'Siswa',
        description: 'Akses nilai, jadwal, dan presensi siswa.',
        dedicatedPath: '/admin/users/students',
        dedicatedLabel: 'Halaman Data Siswa',
        profileSection: 'Data Siswa',
    },
    parent: {
        label: 'Wali Murid',
        description: 'Akses monitoring perkembangan anak.',
        dedicatedPath: '/admin/users/parents',
        dedicatedLabel: 'Halaman Wali Murid',
        profileSection: 'Data Wali Murid',
    },
    extracurricular_tutor: {
        label: 'Tutor Ekskul',
        description: 'Akses manajemen ekskul dan presensi anggota.',
        dedicatedPath: '/admin/users/tutors',
        dedicatedLabel: 'Halaman Tutor Ekskul',
        profileSection: 'Data Tutor',
    },
};

// Roles yang punya halaman dedicated
const DEDICATED_ROLES: UserRole[] = [
    'subject_teacher', 'picket_teacher', 'homeroom_teacher',
    'student', 'parent', 'extracurricular_tutor',
];

// ─── Schema ───────────────────────────────────────────────────────────────────

const baseSchema = z.object({
    name:     z.string().min(3, 'Nama minimal 3 karakter'),
    email:    z.string().email('Email tidak valid'),
    username: z.string().min(3, 'Username minimal 3 karakter'),
    phone:    z.string().optional(),
    role:     z.enum([
        'admin', 'subject_teacher', 'picket_teacher', 'homeroom_teacher',
        'student', 'parent', 'extracurricular_tutor', 'mutamayizin_coordinator', 'headmaster',
    ] as const),
    // Staff / headmaster / coordinator
    department: z.string().optional(),
    job_title:  z.string().optional(),
    // Teacher
    employee_id:    z.string().optional(),
    qualifications: z.string().optional(),
    // Student
    admission_number: z.string().optional(),
    religion:         z.string().optional(),
    // Parent
    occupation: z.string().optional(),
    // Tutor
    nip:              z.string().optional(),
    extracurricular:  z.string().optional(),
    join_date:        z.string().optional(),
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

// ─── Props ────────────────────────────────────────────────────────────────────

interface UserFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingUser?: AdminUser | null;
    onSuccess?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const UserFormDialog: React.FC<UserFormDialogProps> = ({
    open, onOpenChange, editingUser, onSuccess,
}) => {
    const router = useRouter();
    const isEdit = !!editingUser;
    const { createUser, updateUser, isCreating, isUpdating } = useUserManagement();
    const isSaving = isCreating || isUpdating;
    const [showProfileFields, setShowProfileFields] = useState(false);

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
    const roleMeta = ROLE_META[selectedRole];
    const isDedicatedRole = DEDICATED_ROLES.includes(selectedRole);

    // Reset profile fields when role changes
    useEffect(() => {
        form.setValue('department', '');
        form.setValue('job_title', '');
        form.setValue('employee_id', '');
        form.setValue('qualifications', '');
        form.setValue('admission_number', '');
        form.setValue('religion', '');
        form.setValue('occupation', '');
        form.setValue('nip', '');
        form.setValue('extracurricular', '');
        form.setValue('join_date', '');
        startTransition(() => {
            setShowProfileFields(false);
        });
    }, [selectedRole, form]);

    // Populate on edit
    useEffect(() => {
        if (open && editingUser) {
            const p = editingUser;
            form.reset({
                name:     p.name,
                email:    p.email,
                username: p.username,
                phone:    p.phone ?? '',
                password: '',
                role:     (p.roles[0] as UserRole) ?? 'admin',
                department:  p.staff_profile?.department ?? '',
                job_title:   p.staff_profile?.job_title ?? '',
                employee_id:    p.teacher_profile?.employee_id ?? '',
                qualifications: p.teacher_profile?.qualifications ?? '',
                admission_number: p.student_profile?.admission_number ?? '',
                religion:         p.student_profile?.religion ?? '',
                occupation: p.parent_profile?.occupation ?? '',
                nip:             p.tutor_profile?.nip ?? '',
                extracurricular: p.tutor_profile?.extracurricular ?? '',
                join_date:       p.tutor_profile?.join_date ?? '',
            });
        } else if (open && !editingUser) {
            form.reset({
                name: '', email: '', username: '', phone: '', password: '',
                role: 'admin',
                department: '', job_title: '',
                employee_id: '', qualifications: '',
                admission_number: '', religion: '',
                occupation: '',
                nip: '', extracurricular: '', join_date: '',
            });
        }
    }, [open, editingUser, form]);

    const onSubmit = async (values: FormValues) => {
        const clean = (v: string | undefined) => (v === '' ? undefined : v);

        const payload = {
            name:     values.name,
            email:    values.email,
            username: values.username,
            phone:    clean(values.phone),
            role:     values.role,
            // Profile fields — backend ignores irrelevant ones
            department:       clean(values.department),
            job_title:        clean(values.job_title),
            employee_id:      clean(values.employee_id),
            qualifications:   clean(values.qualifications),
            admission_number: clean(values.admission_number),
            religion:         clean(values.religion),
            occupation:       clean(values.occupation),
            nip:              clean(values.nip),
            extracurricular:  clean(values.extracurricular),
            join_date:        clean(values.join_date),
        };

        if (isEdit && editingUser) {
            await updateUser({
                id: editingUser.id,
                data: {
                    ...payload,
                    password: clean((values as EditValues).password),
                },
            });
        } else {
            await createUser({
                ...payload,
                password: (values as CreateValues).password,
            });
        }
        onOpenChange(false);
        onSuccess?.();
    };

    const handleRedirect = () => {
        onOpenChange(false);
        if (roleMeta.dedicatedPath) router.push(roleMeta.dedicatedPath);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                            {isEdit ? <UserCog className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-semibold text-slate-800">
                                {isEdit ? 'Edit Data Pengguna' : 'Tambah Pengguna Baru'}
                            </DialogTitle>
                            <p className="text-sm text-slate-500 mt-0.5 font-normal">
                                {isEdit
                                    ? 'Perbarui informasi akun dan akses sistem pengguna.'
                                    : 'Buat akun pengguna baru dengan akses sistem yang sesuai.'}
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <Separator className="my-1" />

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                        {/* ── Akses Sistem (pilih dulu) ── */}
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
                                                <div className="flex items-center gap-2">
                                                    <span>{meta.label}</span>
                                                    {DEDICATED_ROLES.includes(value as UserRole) && (
                                                        <Badge variant="outline" className="text-[10px] h-4 px-1 border-amber-200 text-amber-700">
                                                            Ada halaman khusus
                                                        </Badge>
                                                    )}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {isEdit && (
                                    <FormDescription className="text-[11px] text-slate-400">
                                        Akses sistem tidak dapat diubah setelah akun dibuat.
                                    </FormDescription>
                                )}
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* ── Role description badge ── */}
                        {selectedRole && (
                            <div className={cn(
                                'flex items-start gap-2.5 p-3 rounded-lg text-sm',
                                isDedicatedRole
                                    ? 'bg-amber-50 border border-amber-200'
                                    : 'bg-blue-50 border border-blue-100'
                            )}>
                                {isDedicatedRole
                                    ? <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                                    : <Shield className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                                }
                                <div className="flex-1">
                                    <p className={cn(
                                        'font-medium text-xs',
                                        isDedicatedRole ? 'text-amber-800' : 'text-blue-800'
                                    )}>
                                        {roleMeta.label}
                                    </p>
                                    <p className={cn(
                                        'text-xs mt-0.5',
                                        isDedicatedRole ? 'text-amber-700' : 'text-blue-700'
                                    )}>
                                        {roleMeta.description}
                                    </p>
                                    {isDedicatedRole && !isEdit && (
                                        <div className="mt-2 flex items-center gap-2">
                                            <p className="text-xs text-amber-700">
                                                Role ini memiliki halaman khusus dengan form yang lebih lengkap.
                                            </p>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="h-6 text-[11px] border-amber-300 text-amber-800 hover:bg-amber-100 shrink-0"
                                                onClick={handleRedirect}
                                            >
                                                <ExternalLink className="h-3 w-3 mr-1" />
                                                {roleMeta.dedicatedLabel}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ── Data Akun ── */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="h-5 w-5 rounded bg-blue-100 flex items-center justify-center">
                                    <UserPlus className="h-3 w-3 text-blue-700" />
                                </div>
                                <p className="text-sm font-medium text-slate-700">Data Akun</p>
                            </div>

                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Lengkap <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nama lengkap pengguna" autoComplete="off" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <div className="grid grid-cols-2 gap-4">
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
                                        <FormLabel>Username <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="nama.pengguna" autoComplete="off" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="phone" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>No. Handphone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="08xxxxxxxxxx" {...field} />
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
                                                    (opsional)
                                                </span>
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder={isEdit ? '••••••••' : 'Min. 8 karakter'}
                                                autoComplete="new-password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                        </div>

                        {/* ── Profile Fields (dinamis per role) ── */}
                        {roleMeta.profileSection && (
                            <div className="space-y-4">
                                <button
                                    type="button"
                                    onClick={() => setShowProfileFields(!showProfileFields)}
                                    className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="h-5 w-5 rounded bg-blue-100 flex items-center justify-center">
                                            <Info className="h-3 w-3 text-blue-700" />
                                        </div>
                                        <p className="text-sm font-medium text-slate-700">
                                            {roleMeta.profileSection}
                                        </p>
                                        <Badge variant="outline" className="text-[10px] h-4 px-1.5 text-slate-500">
                                            Opsional
                                        </Badge>
                                    </div>
                                    {showProfileFields
                                        ? <ChevronUp className="h-4 w-4 text-slate-400" />
                                        : <ChevronDown className="h-4 w-4 text-slate-400" />
                                    }
                                </button>

                                {showProfileFields && (
                                    <div className="space-y-4 pl-1">
                                        {/* Teacher fields */}
                                        {['subject_teacher', 'picket_teacher', 'homeroom_teacher'].includes(selectedRole) && (
                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField control={form.control} name="employee_id" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>NIP / ID Pegawai</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Nomor Induk Pegawai" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                                <FormField control={form.control} name="qualifications" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Gelar Akademik</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="S.Pd., M.Pd." {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                            </div>
                                        )}

                                        {/* Student fields */}
                                        {selectedRole === 'student' && (
                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField control={form.control} name="admission_number" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>No. Pendaftaran</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Nomor pendaftaran" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                                <FormField control={form.control} name="religion" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Agama</FormLabel>
                                                        <Select onValueChange={field.onChange} value={field.value ?? ''}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Pilih agama" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="Islam">Islam</SelectItem>
                                                                <SelectItem value="Kristen">Kristen</SelectItem>
                                                                <SelectItem value="Katolik">Katolik</SelectItem>
                                                                <SelectItem value="Hindu">Hindu</SelectItem>
                                                                <SelectItem value="Buddha">Buddha</SelectItem>
                                                                <SelectItem value="Konghucu">Konghucu</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                            </div>
                                        )}

                                        {/* Parent fields */}
                                        {selectedRole === 'parent' && (
                                            <FormField control={form.control} name="occupation" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Pekerjaan</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Pekerjaan wali murid" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        )}

                                        {/* Tutor fields */}
                                        {selectedRole === 'extracurricular_tutor' && (
                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField control={form.control} name="nip" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>NIP</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Nomor Induk Pegawai" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                                <FormField control={form.control} name="extracurricular" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Ekskul Diampu</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Nama ekskul" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                                <FormField control={form.control} name="join_date" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Tanggal Bergabung</FormLabel>
                                                        <FormControl>
                                                            <Input type="date" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                            </div>
                                        )}

                                        {/* Staff / headmaster / coordinator fields */}
                                        {['headmaster', 'mutamayizin_coordinator'].includes(selectedRole) && (
                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField control={form.control} name="job_title" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Jabatan</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Jabatan resmi" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                                <FormField control={form.control} name="department" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Departemen / Bidang</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Bidang tugas" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                            </div>
                                        )}

                                        <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                                            <Info className="h-3 w-3 shrink-0" />
                                            Data profil dapat dilengkapi kapan saja melalui halaman detail pengguna.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── Actions ── */}
                        <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isSaving}
                            >
                                <X className="h-4 w-4 mr-2" />
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                className="bg-blue-800 hover:bg-blue-900 text-white min-w-[130px]"
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : isEdit ? (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Simpan Perubahan
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="h-4 w-4 mr-2" />
                                        Tambah Pengguna
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
