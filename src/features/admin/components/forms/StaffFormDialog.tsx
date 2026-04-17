'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

import { Staff, CreateStaffPayload, UpdateStaffPayload } from '../../types/staff';

// ─── Zod Schemas ───────────────────────────────────────────────────────────────

const baseStaffSchema = z.object({
    name: z.string().min(1, 'Nama harus diisi'),
    email: z.string().email('Email tidak valid'),
    username: z.string().min(3, 'Username minimal 3 karakter'),
    phone: z.string().optional(),
    address: z.string().optional(),
    role: z.enum(['mutamayizin_coordinator', 'headmaster', 'admin'] as const),
    employee_id: z.string().optional(),
    department: z.string().optional(),
    job_title: z.string().optional(),
    employment_status: z.enum(['PNS', 'PPPK', 'GTY', 'GTT', 'HONORER']).optional(),
    status: z.enum(['active', 'inactive', 'leave'] as const).default('active'),
    join_date: z.string().optional(),
});

// Create: password wajib
const createStaffSchema = baseStaffSchema.extend({
    password: z.string().min(8, 'Password minimal 8 karakter'),
});

// Edit: password opsional
const editStaffSchema = baseStaffSchema.extend({
    password: z.string().min(8, 'Password minimal 8 karakter').optional().or(z.literal('')),
});

type CreateStaffFormValues = z.infer<typeof createStaffSchema>;
type EditStaffFormValues = z.infer<typeof editStaffSchema>;
type StaffFormValues = CreateStaffFormValues | EditStaffFormValues;

// ─── Props ─────────────────────────────────────────────────────────────────────

interface StaffFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: Staff | null;
    onSubmit: (data: CreateStaffPayload | UpdateStaffPayload) => Promise<void>;
    isSubmitting?: boolean;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export const StaffFormDialog: React.FC<StaffFormDialogProps> = ({
    open,
    onOpenChange,
    initialData,
    onSubmit,
    isSubmitting = false,
}) => {
    const isEdit = !!initialData;

    const form = useForm<StaffFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(isEdit ? editStaffSchema : createStaffSchema) as any,
        defaultValues: {
            name: '',
            email: '',
            username: '',
            password: '',
            phone: '',
            address: '',
            role: 'admin',
            employee_id: '',
            department: '',
            job_title: '',
            employment_status: undefined,
            status: 'active',
            join_date: '',
        },
    });

    // Populate form saat edit
    useEffect(() => {
        if (open) {
            if (initialData) {
                form.reset({
                    name: initialData.name,
                    email: initialData.email,
                    username: initialData.username,
                    password: '',
                    phone: initialData.phone ?? '',
                    address: initialData.address ?? '',
                    role: initialData.roles[0] ?? 'admin',
                    employee_id: initialData.staff_profile?.employee_id ?? '',
                    department: initialData.staff_profile?.department ?? '',
                    job_title: initialData.staff_profile?.job_title ?? '',
                    employment_status: initialData.staff_profile?.employment_status ?? undefined,
                    status: initialData.staff_profile?.status ?? 'active',
                    join_date: initialData.staff_profile?.join_date ?? '',
                });
            } else {
                form.reset({
                    name: '',
                    email: '',
                    username: '',
                    password: '',
                    phone: '',
                    address: '',
                    role: 'admin',
                    employee_id: '',
                    department: '',
                    job_title: '',
                    employment_status: undefined,
                    status: 'active',
                    join_date: '',
                });
            }
        }
    }, [open, initialData, form]);

    const handleSubmit = async (values: StaffFormValues) => {
        const payload: CreateStaffPayload | UpdateStaffPayload = {
            name: values.name,
            email: values.email,
            username: values.username,
            phone: values.phone || undefined,
            address: values.address || undefined,
            role: values.role,
            employee_id: values.employee_id || undefined,
            department: values.department || undefined,
            job_title: values.job_title || undefined,
            employment_status: values.employment_status,
            status: values.status,
            join_date: values.join_date || undefined,
        };

        // Sertakan password hanya jika diisi
        if (values.password) {
            (payload as CreateStaffPayload).password = values.password;
        }

        await onSubmit(payload);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? 'Edit Data Staf' : 'Tambah Staf Baru'}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        {/* Identitas */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Nama Lengkap</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nama beserta gelar" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="email@sekolah.id" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="username" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Password{' '}
                                            {isEdit && (
                                                <span className="text-slate-400 font-normal text-xs">
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
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>No. Telepon</FormLabel>
                                        <FormControl>
                                            <Input placeholder="08..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Kepegawaian */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Peran Sistem</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih peran" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="admin">Administrator</SelectItem>
                                                <SelectItem value="headmaster">Kepala Sekolah</SelectItem>
                                                <SelectItem value="mutamayizin_coordinator">
                                                    Koord. Mutamayizin
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status Kepegawaian</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="active">Aktif</SelectItem>
                                                <SelectItem value="inactive">Tidak Aktif</SelectItem>
                                                <SelectItem value="leave">Cuti</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="employee_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>NIP / ID Pegawai</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nomor Induk Pegawai" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="employment_status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status Ikatan Kerja</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value ?? ''}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="PNS">PNS</SelectItem>
                                                <SelectItem value="PPPK">PPPK</SelectItem>
                                                <SelectItem value="GTY">GTY</SelectItem>
                                                <SelectItem value="GTT">GTT</SelectItem>
                                                <SelectItem value="HONORER">Honorer</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="department"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Departemen / Bidang</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Tata Usaha, dll." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="job_title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Jabatan / Posisi</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Kepala TU, dll." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="join_date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tanggal Bergabung</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isSubmitting}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-blue-800 hover:bg-blue-900 text-white"
                            >
                                {isSubmitting && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {isEdit ? 'Simpan Perubahan' : 'Tambah Staf'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
