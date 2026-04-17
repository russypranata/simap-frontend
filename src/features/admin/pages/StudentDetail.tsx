'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    GraduationCap, Edit, Trash2, Users, Mail, Phone,
    MapPin, Calendar, User, Loader2,
    BookOpen, Award, AlertCircle, ArrowLeft,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { id as indonesia } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

import { useStudentDetail, useStudentList } from '../hooks/useStudentList';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (d?: string | null) => {
    if (!d) return '—';
    try { return format(new Date(d), 'dd MMMM yyyy', { locale: indonesia }); }
    catch { return d; }
};

const GENDER_LABELS: Record<string, string> = { L: 'Laki-laki', P: 'Perempuan' };

// ─── InfoItem ─────────────────────────────────────────────────────────────────

interface InfoItemProps {
    icon: React.ReactNode;
    label: string;
    value?: string | null;
    mono?: boolean;
    colSpan?: boolean;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value, mono, colSpan }) => (
    <div className={cn('flex items-center space-x-3 p-3 rounded-lg bg-muted/30', colSpan && 'md:col-span-2')}>
        <div className="p-2 rounded-full bg-blue-100/60 shrink-0">
            <span className="h-5 w-5 block [&>svg]:h-5 [&>svg]:w-5 text-blue-700">{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className={cn('text-sm mt-0.5 truncate font-medium text-slate-800', mono && 'font-mono tracking-wide')}>
                {value ?? '—'}
            </p>
        </div>
    </div>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const StudentDetailSkeleton = () => (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div className="space-y-2"><Skeleton className="h-9 w-64" /><Skeleton className="h-4 w-48" /></div>
            <div className="flex gap-2"><Skeleton className="h-9 w-24" /><Skeleton className="h-9 w-20" /></div>
        </div>
        <Card><CardContent className="pt-6">
            <div className="flex items-center gap-6 mb-6">
                <Skeleton className="h-28 w-28 rounded-full" />
                <div className="space-y-2"><Skeleton className="h-7 w-48" /><Skeleton className="h-5 w-32" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <div className="flex-1 space-y-1"><Skeleton className="h-3 w-16" /><Skeleton className="h-4 w-32" /></div>
                    </div>
                ))}
            </div>
        </CardContent></Card>
    </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

export const StudentDetail: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const id = Number(params.id);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const { data: student, isLoading, isError } = useStudentDetail(id);
    const { deleteStudent, isDeleting } = useStudentList();

    const handleDelete = () => {
        deleteStudent(id);
        toast.success('Data siswa berhasil dihapus');
        router.push('/admin/users/students');
    };

    if (isLoading) return <StudentDetailSkeleton />;

    if (isError || !student) {
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

    const initials = student.name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);
    const guardian = student.guardian_details;

    return (
        <div className="space-y-6">
            {/* ── Header ── */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Detail{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Data Siswa
                            </span>
                        </h1>
                        <div className="p-2 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                            <GraduationCap className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">Informasi lengkap data siswa</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        onClick={() => router.push(`/admin/users/students/${id}/edit`)}
                        size="sm"
                        className="bg-blue-800 hover:bg-blue-900 text-white"
                    >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Data
                    </Button>
                    <Button
                        onClick={() => setIsDeleteOpen(true)}
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 bg-red-50 hover:bg-red-100"
                    >
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden sm:inline ml-2">Hapus</span>
                    </Button>
                </div>
            </div>

            {/* ── Profile Card ── */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                            <User className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Data Diri</CardTitle>
                            <p className="text-sm text-muted-foreground mt-0.5 font-normal">Informasi lengkap siswa</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Avatar & Nama */}
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <Avatar className="w-28 h-28 border-4 border-primary/10">
                            <AvatarImage src={student.avatar ?? undefined} alt={student.name} className="object-cover" />
                            <AvatarFallback className="text-3xl font-semibold bg-blue-800 text-white">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-center md:text-left space-y-2">
                            <h2 className="text-2xl font-bold text-foreground">{student.name}</h2>
                            <p className="text-sm text-muted-foreground font-mono">@{student.username}</p>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
                                {student.class_name && (
                                    <Badge className="bg-blue-800 text-white">
                                        <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                                        {student.class_name}
                                    </Badge>
                                )}
                                {student.academic_year_name && (
                                    <Badge variant="outline" className="text-slate-600">
                                        TA. {student.academic_year_name}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Identitas */}
                    <div className="space-y-4 pt-4 border-t">
                        <h3 className="text-base font-medium flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-blue-700" />
                            Informasi Identitas
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoItem icon={<User />} label="No. Pendaftaran" value={student.admission_number} mono />
                            <InfoItem icon={<User />} label="Jenis Kelamin" value={student.gender ? GENDER_LABELS[student.gender] : undefined} />
                            <InfoItem icon={<Calendar />} label="Tanggal Lahir" value={formatDate(student.dob)} />
                            <InfoItem icon={<MapPin />} label="Tempat Lahir" value={student.birth_place} />
                            <InfoItem icon={<BookOpen />} label="Agama" value={student.religion} />
                        </div>
                    </div>

                    {/* Kontak */}
                    <div className="space-y-4 pt-6 border-t">
                        <h3 className="text-base font-medium flex items-center gap-2">
                            <Phone className="h-4 w-4 text-blue-700" />
                            Informasi Kontak
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoItem icon={<Mail />} label="Email" value={student.email} />
                            <InfoItem icon={<Phone />} label="No. Handphone" value={student.phone} />
                            <InfoItem icon={<MapPin />} label="Alamat" value={student.address} colSpan />
                        </div>
                    </div>

                    {/* Wali */}
                    {guardian && (
                        <div className="space-y-4 pt-6 border-t">
                            <h3 className="text-base font-medium flex items-center gap-2">
                                <Users className="h-4 w-4 text-blue-700" />
                                Data Wali
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoItem icon={<User />} label="Nama Wali" value={guardian.name} />
                                <InfoItem icon={<Phone />} label="No. HP Wali" value={guardian.phone} />
                                <InfoItem icon={<User />} label="Hubungan" value={guardian.relation} />
                            </div>
                        </div>
                    )}

                    {/* Ekskul */}
                    {student.extracurriculars && student.extracurriculars.length > 0 && (
                        <div className="space-y-4 pt-6 border-t">
                            <h3 className="text-base font-medium flex items-center gap-2">
                                <Award className="h-4 w-4 text-blue-700" />
                                Ekstrakurikuler
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {student.extracurriculars.map((ekskul, i) => (
                                    <Badge key={i} className="bg-blue-800 text-white">
                                        {ekskul}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* ── Delete Dialog ── */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <div className="flex items-center gap-4 mb-1">
                            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                <Trash2 className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                                <AlertDialogTitle className="text-lg">Hapus Data Siswa?</AlertDialogTitle>
                                <AlertDialogDescription className="mt-1">
                                    Data <strong>{student.name}</strong> akan dihapus permanen.
                                </AlertDialogDescription>
                            </div>
                        </div>
                        <div className="ml-16 p-3 bg-red-50 border border-red-100 rounded-lg">
                            <p className="text-xs text-red-700 leading-relaxed">
                                ⚠️ Semua data terkait termasuk nilai, presensi, dan keanggotaan ekskul juga akan ikut terhapus.
                            </p>
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-2">
                        <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Menghapus...</>
                            ) : 'Ya, Hapus Sekarang'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
