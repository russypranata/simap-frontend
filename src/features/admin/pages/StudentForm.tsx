'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Save, Upload, Loader2, User, BookOpen, Contact, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

import { MOCK_STUDENTS } from '../data/mockStudentData';

const studentSchema = z.object({
    name: z.string().min(3, 'Nama harus diisi minimal 3 karakter'),
    nis: z.string().min(3, 'NIS harus diisi'),
    nisn: z.string().min(10, 'NISN harus 10 digit').max(10, 'NISN harus 10 digit'),
    gender: z.enum(['L', 'P']),
    placeOfBirth: z.string().optional(),
    dateOfBirth: z.string().optional(),
    
    // Academic
    generation: z.string().min(4, 'Tahun masuk harus 4 digit'),
    className: z.string().optional(), // Nanti jadi Select Class ID
    status: z.enum(['active', 'graduated', 'transferred', 'dropped_out'] as const),

    // Parent
    parentName: z.string().min(3, 'Nama Wali harus diisi'),
    parentPhone: z.string().min(10, 'Nomor HP Wali minimal 10 digit'),
    
    // Contact
    email: z.string().email('Email tidak valid').optional().or(z.literal('')),
    phoneNumber: z.string().optional(),
    address: z.string().min(5, 'Alamat harus diisi'),
});

type StudentFormValues = z.infer<typeof studentSchema>;

export const StudentForm: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const isEditMode = !!id;

    const [isLoading, setIsLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const form = useForm<StudentFormValues>({
        resolver: zodResolver(studentSchema),
        defaultValues: {
            name: '',
            nis: '',
            nisn: '',
            gender: 'L',
            placeOfBirth: '',
            dateOfBirth: '',
            generation: new Date().getFullYear().toString(),
            className: '',
            status: 'active',
            parentName: '',
            parentPhone: '',
            email: '',
            phoneNumber: '',
            address: '',
        },
    });

    useEffect(() => {
        if (isEditMode) {
            const student = MOCK_STUDENTS.find(s => s.id === id);
            if (student) {
                form.reset({
                    name: student.name,
                    nis: student.nis,
                    nisn: student.nisn,
                    gender: student.gender,
                    placeOfBirth: student.placeOfBirth || '',
                    dateOfBirth: student.dateOfBirth,
                    generation: student.generation,
                    className: student.className || '',
                    status: (student.status as any),
                    parentName: student.parentName || '',
                    parentPhone: student.parentPhone || '',
                    email: student.email || '',
                    phoneNumber: student.phoneNumber || '',
                    address: student.address,
                });
                if (student.profilePicture) {
                    setPreviewImage(student.profilePicture);
                }
            } else {
                toast.error('Data siswa tidak ditemukan');
                router.push('/admin/users/students');
            }
        }
    }, [isEditMode, id, form, router]);

    const onSubmit = async (data: StudentFormValues) => {
        try {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log('Student Data:', data);
            toast.success(isEditMode ? 'Data siswa diperbarui' : 'Siswa baru ditambahkan');
            router.push('/admin/users/students');
        } catch (error) {
            console.error(error);
            toast.error('Gagal menyimpan data');
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
                            Siswa
                        </span>
                    </h1>
                     <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                        <GraduationCap className="h-5 w-5" />
                    </div>
                </div>
                <p className="text-muted-foreground mt-1">
                    {isEditMode 
                        ? 'Perbarui informasi akademik dan data diri siswa.' 
                        : 'Input data siswa baru ke dalam sistem.'}
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    
                    {/* 1. Identitas Siswa */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <User className="h-5 w-5 text-blue-600" />
                                <CardTitle>Identitas Siswa</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                             {/* Foto Profil */}
                             <div className="flex items-center gap-6 mb-6">
                                <Avatar className="h-24 w-24 border-2 border-slate-100">
                                    <AvatarImage src={previewImage || ''} />
                                    <AvatarFallback className="bg-slate-100 text-2xl font-bold text-slate-400">
                                        SIS
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-2">
                                    <Button variant="outline" size="sm" type="button" className="text-xs">
                                        <Upload className="h-3 w-3 mr-2" />
                                        Upload Foto
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nama Lengkap <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nama sesuai ijazah" {...field} />
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
                                        name="nis"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>NIS (Lokal) <span className="text-red-500">*</span></FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nomor Induk Sekolah" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="nisn"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>NISN (Nasional) <span className="text-red-500">*</span></FormLabel>
                                                <FormControl>
                                                    <Input placeholder="10 digit angka" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="placeOfBirth"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tempat Lahir</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Kota" {...field} />
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

                    {/* 2. Data Akademik */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-blue-600" />
                                <CardTitle>Data Akademik</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormField
                                    control={form.control}
                                    name="generation"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Angkatan / Tahun Masuk <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="2023" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="className"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Kelas Saat Ini</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Contoh: X IPA 1" {...field} />
                                                {/* Nanti diganti Select dari Class Service */}
                                            </FormControl>
                                            <FormDescription className="text-xs">Kosongkan jika belum ada kelas.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status Siswa <span className="text-red-500">*</span></FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="active">Aktif</SelectItem>
                                                    <SelectItem value="graduated">Lulus</SelectItem>
                                                    <SelectItem value="transferred">Pindah Sekolah</SelectItem>
                                                    <SelectItem value="dropped_out">Putus Sekolah / DO</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* 3. Data Wali & Kontak */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Contact className="h-5 w-5 text-blue-600" />
                                <CardTitle>Data Wali & Kontak</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="parentName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nama Wali Murid <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nama Ayah/Ibu/Wali" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="parentPhone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>No. HP Wali <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Input placeholder="08xxxxxxxxxx" {...field} />
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
                                            <FormLabel>Email Siswa (Opsional)</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="siswa@sekolah.sch.id" {...field} />
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
                                            <FormLabel>No. HP Siswa (Opsional)</FormLabel>
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
                                        <FormLabel>Alamat Lengkap <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Alamat domisili saat ini..." className="resize-none h-20" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
