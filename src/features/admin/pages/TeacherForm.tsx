'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Save, Upload, Calendar as CalendarIcon, Loader2, Users } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { id as indonesia } from 'date-fns/locale';

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
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import { Teacher, TeacherPosition, TeacherStatus } from '../types/teacher';
import { MOCK_TEACHERS } from '../data/mockTeacherData';

const teacherSchema = z.object({
    name: z.string().min(3, 'Nama harus diisi minimal 3 karakter'),
    nip: z.string().min(5, 'NIP harus diisi (jika belum ada, gunakan NIK/ID Sementara)'),
    nuptk: z.string().optional(),
    title: z.string().optional(),
    gender: z.enum(['L', 'P']),
    placeOfBirth: z.string().optional(),
    dateOfBirth: z.string().optional(),
    
    email: z.string().email('Email tidak valid'),
    phoneNumber: z.string().min(10, 'Nomor HP minimal 10 digit'),
    address: z.string().optional(),
    
    position: z.enum(['teacher', 'headmaster', 'staff', 'pj_mutamayizin'] as const),
    status: z.enum(['active', 'inactive', 'leave'] as const),
    joinDate: z.string().min(1, 'Tanggal bergabung harus diisi'),
});

type TeacherFormValues = z.infer<typeof teacherSchema>;

export const TeacherForm: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const isEditMode = !!id;

    const [isLoading, setIsLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const form = useForm<TeacherFormValues>({
        resolver: zodResolver(teacherSchema),
        defaultValues: {
            name: '',
            nip: '',
            nuptk: '',
            title: '',
            gender: 'L',
            email: '',
            phoneNumber: '',
            address: '',
            position: 'teacher',
            status: 'active',
            placeOfBirth: '',
            dateOfBirth: '',
            joinDate: new Date().toISOString().split('T')[0],
        },
    });

    useEffect(() => {
        if (isEditMode) {
            // Simulate fetch
            const teacher = MOCK_TEACHERS.find(t => t.id === id);
            if (teacher) {
                let formPosition: 'teacher' | 'headmaster' | 'staff' | 'pj_mutamayizin' = 'teacher';
                
                if (teacher.structuralPositions?.includes('headmaster')) {
                    formPosition = 'headmaster';
                } else if (teacher.employmentType === 'staff') {
                    formPosition = 'staff';
                }

                form.reset({
                    name: teacher.name,
                    nip: teacher.nip,
                    nuptk: teacher.nuptk || '',
                    title: teacher.title || '',
                    gender: teacher.gender,
                    email: teacher.email,
                    phoneNumber: teacher.phoneNumber,
                    address: teacher.address || '',
                    position: formPosition,
                    status: teacher.status,
                    placeOfBirth: teacher.placeOfBirth || '',
                    dateOfBirth: teacher.dateOfBirth,
                    joinDate: teacher.joinDate || new Date().toISOString().split('T')[0],
                });
                if (teacher.profilePicture) {
                    setPreviewImage(teacher.profilePicture);
                }
            } else {
                toast.error('Data guru tidak ditemukan');
                router.push('/admin/users/teachers');
            }
        }
    }, [isEditMode, id, form, router]);

    const onSubmit = async (data: TeacherFormValues) => {
        try {
            setIsLoading(true);
            // Simulate API format
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            console.log('Form Data:', data);
            toast.success(isEditMode ? 'Data berhasil diperbarui' : 'Guru baru berhasil ditambahkan');
            router.push('/admin/users/teachers');
        } catch (error) {
            console.error(error);
            toast.error('Terjadi kesalahan saat menyimpan data');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold tracking-tight">
                        <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                            {isEditMode ? 'Edit ' : 'Tambah '}
                        </span>
                        <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                            Guru & Staff
                        </span>
                    </h1>
                     <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                        <Users className="h-5 w-5" />
                    </div>
                </div>
                <p className="text-muted-foreground mt-1">
                    {isEditMode 
                        ? 'Perbarui informasi data diri dan kepegawaian.' 
                        : 'Lengkapi formulir di bawah untuk menambahkan personil baru.'}
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    
                    {/* 1. Informasi Pribadi */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Pribadi</CardTitle>
                            <CardDescription>Data identitas utama guru/staff.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Foto Profil */}
                            <div className="flex items-center gap-6">
                                <Avatar className="h-24 w-24 border-2 border-slate-100">
                                    <AvatarImage src={previewImage || ''} />
                                    <AvatarFallback className="bg-slate-100 text-2xl font-bold text-slate-400">
                                        IMG
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-2">
                                    <Button variant="outline" size="sm" type="button" className="text-xs">
                                        <Upload className="h-3 w-3 mr-2" />
                                        Upload Foto
                                    </Button>
                                    <p className="text-[11px] text-muted-foreground">
                                        Format: JPG, PNG. Maksimal 2MB.
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nama Lengkap <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Input placeholder="Contoh: Budi Santoso" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Gelar Akademik</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Contoh: S.Pd., M.Pd." {...field} />
                                            </FormControl>
                                            <FormDescription className="text-xs">Opsional, bisa dikosongkan.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="nip"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>NIP / ID Pegawai <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Input placeholder="1980xxxx..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="nuptk"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>NUPTK</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nomor Unik Pendidik..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="gender"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Jenis Kelamin <span className="text-red-500">*</span></FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="placeOfBirth"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tempat Lahir</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Kota lahir" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="dateOfBirth"
                                        render={({ field }) => (
                                            <FormItem>
                                                 <FormLabel>Tanggal Lahir</FormLabel>
                                                <FormControl>
                                                    <Input type="date" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 2. Informasi Kontak */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Kontak & Alamat</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email Sekolah <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="nama@sekolah.sch.id" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phoneNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>No. Handphone / WA <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Input placeholder="08xxxxxxxxxx" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Alamat Domisili</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Alamat lengkap saat ini..." className="resize-none h-20" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* 3. Data Kepegawaian */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Kepegawaian</CardTitle>
                            <CardDescription>Status, jabatan, dan masa kerja.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormField
                                    control={form.control}
                                    name="position"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Jabatan / Peran Utama <span className="text-red-500">*</span></FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih jabatan" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="headmaster">Kepala Sekolah</SelectItem>
                                                    <SelectItem value="teacher">Guru Mapel / Kelas</SelectItem>
                                                    <SelectItem value="pj_mutamayizin">PJ Mutamayyizin</SelectItem>
                                                    <SelectItem value="staff">Staff / Tenaga Kependidikan</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription className="text-xs">
                                                Role ini menentukan hak akses di aplikasi.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status Kepegawaian <span className="text-red-500">*</span></FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="active">Aktif</SelectItem>
                                                    <SelectItem value="inactive">Nonaktif (Keluar/Pensiun)</SelectItem>
                                                    <SelectItem value="leave">Cuti</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="joinDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tanggal Mulai Bergabung <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-4 pt-4">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => router.back()}
                            disabled={isLoading}
                        >
                            Batal
                        </Button>
                        <Button 
                            type="submit" 
                            className="bg-blue-800 hover:bg-blue-900 min-w-[140px]"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Simpan Data
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};
