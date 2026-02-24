'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    Edit,
    Trash2,
    Users,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Briefcase,
    User,
    Loader2,
    CheckCircle2,
    GraduationCap,
    AtSign,
    BadgeCheck,
    BookOpen,
    UsersRound,
    Trophy,
    Crown,
    Shield,
    ClipboardCheck,
    Fingerprint,
    Building2,
    Eye,
    EyeOff,
    Lock,
    BookHeart,
    ScrollText,
    Stamp,
    Landmark,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { id as indonesia } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Dialog,
    DialogContent,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import { Teacher, EmploymentType, StructuralPosition, TeacherStatus } from '../types/teacher';
import { MOCK_TEACHERS } from '../data/mockTeacherData';

const employmentLabels: Record<EmploymentType, string> = {
    teacher: 'Guru',
    staff: 'Staff / TU',
};

const structuralLabels: Record<StructuralPosition, string> = {
    headmaster: 'Kepala Sekolah',
    vice_curriculum: 'Waka Kurikulum',
    vice_student_affairs: 'Waka Kesiswaan',
    coord_piket_ikhwan: 'Koord. Piket Ikhwan',
    coord_piket_akhwat: 'Koord. Piket Akhwat',
    admin_dapodik: 'TU & OPS Dapodik',
};

const salaryStatusLabels: Record<string, string> = {
    PNS: 'PNS',
    PPPK: 'PPPK',
    GTY: 'Guru Tetap Yayasan',
    GTT: 'Guru Tidak Tetap',
    HONORER: 'Tenaga Honorer',
};

const statusLabels: Record<TeacherStatus, string> = {
    active: 'Aktif',
    inactive: 'Nonaktif',
    leave: 'Cuti',
};

const statusStyles: Record<TeacherStatus, string> = {
    active: 'bg-green-100 text-green-700 border-green-200',
    inactive: 'bg-red-100 text-red-700 border-red-200',
    leave: 'bg-yellow-100 text-yellow-700 border-yellow-200',
};

// Skeleton Loading Component
const TeacherDetailSkeleton = () => (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-48 mt-2" />
                </div>
            </div>
        </div>
        <Card>
            <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                            <Skeleton className="h-9 w-9 rounded-full" />
                            <div className="flex-1">
                                <Skeleton className="h-3 w-16 mb-2" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    </div>
);

export const TeacherDetail: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [isLoading, setIsLoading] = useState(true);
    const [teacher, setTeacher] = useState<Teacher | null>(null);
    const [showNik, setShowNik] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPhotoOpen, setIsPhotoOpen] = useState(false);

    useEffect(() => {
        const fetchTeacher = async () => {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const found = MOCK_TEACHERS.find(t => t.id === id);
            if (found) {
                setTeacher(found);
            } else {
                toast.error('Data guru tidak ditemukan');
                router.push('/admin/users/teachers');
            }
            setIsLoading(false);
        };

        fetchTeacher();
    }, [id, router]);

    const handleDelete = async () => {
        setIsDeleting(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        toast.success('Data guru berhasil dihapus');
        setIsDeleting(false);
        setIsDeleteDialogOpen(false);
        router.push('/admin/users/teachers');
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        try {
            return format(new Date(dateString), 'dd MMMM yyyy', { locale: indonesia });
        } catch {
            return dateString;
        }
    };

    if (isLoading) return <TeacherDetailSkeleton />;
    if (!teacher) return null;

    const initials = teacher.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Detail{' '}
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
                        Informasi lengkap data personil sekolah
                    </p>
                </div>
            </div>

            {/* Profile Card */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <User className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Data Diri</CardTitle>
                                <p className="text-sm text-muted-foreground mt-0.5 font-normal">
                                    Informasi lengkap guru/staff
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge
                                variant="secondary"
                                className={cn("pl-2 pr-3 py-1 hidden sm:flex", statusStyles[teacher.status])}
                            >
                                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                                {statusLabels[teacher.status]}
                            </Badge>
                            <Button
                                onClick={() => router.push(`/admin/users/teachers/${id}/edit`)}
                                size="sm"
                                className="flex items-center space-x-2 bg-blue-800 hover:bg-blue-900 text-white"
                            >
                                <Edit className="h-4 w-4" />
                                <span>Edit Data</span>
                            </Button>
                            <Button
                                onClick={() => setIsDeleteDialogOpen(true)}
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-200 bg-red-50 hover:bg-red-100 hover:text-red-700"
                            >
                                <Trash2 className="h-4 w-4" />
                                <span className="hidden sm:inline ml-2">Hapus</span>
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {/* Profile Picture and Basic Info */}
                        <div className="flex flex-col md:flex-row items-center md:items-center space-y-4 md:space-y-0 md:space-x-6">
                            <div
                                onClick={() => {
                                    if (teacher.profilePicture) {
                                        setIsPhotoOpen(true);
                                    }
                                }}
                                className={`relative group ${teacher.profilePicture ? 'cursor-pointer' : 'cursor-default'}`}
                            >
                                <Avatar className="w-28 h-28 rounded-full border-4 border-primary/10 transition-transform duration-300 group-hover:scale-105">
                                    <AvatarImage
                                        src={teacher.profilePicture}
                                        alt={teacher.name}
                                        className="object-cover"
                                    />
                                    <AvatarFallback className="text-3xl font-semibold bg-blue-800 text-white rounded-full">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                {teacher.profilePicture && (
                                    <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <div className="bg-white/90 p-2 rounded-full shadow-sm backdrop-blur-sm">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="text-gray-800"
                                            >
                                                <circle cx="11" cy="11" r="8" />
                                                <path d="m21 21-4.3-4.3" />
                                                <path d="M11 8v6" />
                                                <path d="M8 11h6" />
                                            </svg>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Photo Dialog */}
                            <Dialog open={isPhotoOpen} onOpenChange={setIsPhotoOpen}>
                                <DialogContent className="max-w-md md:max-w-lg p-1 bg-transparent border-none shadow-none text-transparent">
                                    <div className="relative rounded-lg overflow-hidden bg-white shadow-2xl">
                                        {teacher.profilePicture && (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img
                                                src={teacher.profilePicture}
                                                alt={`Foto Profil ${teacher.name}`}
                                                className="w-full h-auto object-contain max-h-[80vh] rounded-lg"
                                            />
                                        )}
                                    </div>
                                </DialogContent>
                            </Dialog>

                            <div className="flex-1 text-center md:text-left space-y-2">
                                <h2 className="text-2xl font-bold text-foreground">
                                    {teacher.name}
                                </h2>
                                <div className="space-y-2 mt-2">
                                    {/* Row 1: Roles & Positions */}
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                                        {/* Structural Positions Badges - PERTAMA */}
                                        {teacher.structuralPositions?.map((pos) => (
                                            <Badge 
                                                key={pos}
                                                className="bg-blue-800 text-white pl-2 pr-3 py-1"
                                            >
                                                {pos === 'headmaster' && <Crown className="h-3.5 w-3.5 mr-1.5" />}
                                                {(pos === 'vice_curriculum' || pos === 'vice_student_affairs') && <Shield className="h-3.5 w-3.5 mr-1.5" />}
                                                {(pos === 'coord_piket_ikhwan' || pos === 'coord_piket_akhwat') && <ClipboardCheck className="h-3.5 w-3.5 mr-1.5" />}
                                                {pos === 'admin_dapodik' && <Briefcase className="h-3.5 w-3.5 mr-1.5" />}
                                                {structuralLabels[pos]}
                                            </Badge>
                                        ))}
                                        
                                        {/* Employment Type Badge */}
                                        <Badge className="bg-blue-800 text-white pl-2 pr-3 py-1">
                                            <Briefcase className="h-3.5 w-3.5 mr-1.5" />
                                            {employmentLabels[teacher.employmentType]}
                                        </Badge>
                                        
                                        {/* Wali Kelas Badge */}
                                        {teacher.homeroomClass && (
                                            <Badge className="bg-blue-800 text-white pl-2 pr-3 py-1">
                                                <UsersRound className="h-3.5 w-3.5 mr-1.5" />
                                                Wali Kelas {teacher.homeroomClass.className}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Informasi Identitas */}
                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="text-base font-medium text-foreground flex items-center gap-2">
                                <GraduationCap className="h-4.5 w-4.5 text-primary" />
                                Informasi Identitas
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <BadgeCheck className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">NIP</p>
                                        <p className="text-sm font-mono font-medium mt-0.5 tracking-wide">{teacher.nip}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <BookHeart className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Agama</p>
                                        <p className="text-sm font-medium mt-0.5">{teacher.religion || '-'}</p>
                                    </div>
                                </div>

                                {/* NIK - Data Pribadi Sensitif (Masked) */}
                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-amber-50/50 border border-amber-100">
                                    <div className="p-2 rounded-full bg-amber-100/80">
                                        <Lock className="h-5 w-5 text-amber-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs text-muted-foreground">NIK (Pribadi)</p>
                                                <Badge variant="outline" className="text-[10px] h-4 px-1 py-0 border-amber-200 text-amber-700 bg-white">
                                                    Privat
                                                </Badge>
                                            </div>
                                            <button 
                                                onClick={() => setShowNik(!showNik)}
                                                className="text-muted-foreground hover:text-foreground transition-colors"
                                                title={showNik ? "Sembunyikan NIK" : "Tampilkan NIK"}
                                            >
                                                {showNik ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        <p className="text-sm font-mono font-medium text-slate-700 mt-0.5 tracking-wide">
                                            {showNik 
                                                ? teacher.nik 
                                                : teacher.nik.substring(0, 4) + '•'.repeat(teacher.nik.length - 8) + teacher.nik.substring(teacher.nik.length - 4)
                                            }
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <User className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">NUPTK</p>
                                        <p className="text-sm font-mono font-medium text-slate-700 mt-0.5 tracking-wide">{teacher.nuptk || '-'}</p>
                                    </div>
                                </div>



                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <AtSign className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Gelar Akademik</p>
                                        <p className="text-sm font-medium">{teacher.title || '-'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <User className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Jenis Kelamin</p>
                                        <p className="text-sm font-medium">
                                            {teacher.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 md:col-span-2">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <Calendar className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Tempat, Tanggal Lahir</p>
                                        <p className="text-sm font-medium">
                                            {teacher.placeOfBirth || '-'}, {formatDate(teacher.dateOfBirth)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Informasi Kontak */}
                        <div className="space-y-4 pt-6 border-t">
                            <h3 className="text-base font-medium text-foreground flex items-center gap-2">
                                <Phone className="h-4.5 w-4.5 text-primary" />
                                Informasi Kontak
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <Mail className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-muted-foreground">Email</p>
                                        <p className="text-sm font-medium truncate">{teacher.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <Phone className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">No. Handphone</p>
                                        <p className="text-sm font-medium">{teacher.phoneNumber}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 md:col-span-2">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <MapPin className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Alamat</p>
                                        <p className="text-sm font-medium">{teacher.address || '-'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Data Kepegawaian & Penugasan - LENGKAP */}
                        <div className="space-y-4 pt-6 border-t">
                            <h3 className="text-base font-medium text-foreground flex items-center gap-2">
                                <Briefcase className="h-4.5 w-4.5 text-primary" />
                                Informasi Karir & SK
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Status Kepegawaian */}
                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50/50 border border-blue-100">
                                    <div className="p-2 rounded-full bg-blue-100/80">
                                        <Briefcase className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Status Kepegawaian</p>
                                        <p className="text-sm font-semibold text-slate-900 mt-0.5">
                                            {salaryStatusLabels[teacher.employmentStatus]}
                                        </p>
                                    </div>
                                </div>

                                {/* Jenis PTK */}
                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <User className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Jenis PTK</p>
                                        <p className="text-sm font-medium mt-0.5">{teacher.ptkType || '-'}</p>
                                    </div>
                                </div>

                                {/* Lembaga Pengangkat */}
                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <Landmark className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Lembaga Pengangkat</p>
                                        <p className="text-sm font-medium mt-0.5">{teacher.institution || '-'}</p>
                                    </div>
                                </div>
                                
                                {/* SK Pengangkatan */}
                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <ScrollText className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">No. SK Kerja</p>
                                        <p className="text-sm font-mono font-medium mt-0.5 tracking-wide text-xs">
                                            {teacher.skNumber || '-'}
                                        </p>
                                    </div>
                                </div>

                                {/* Tanggal SK */}
                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <Stamp className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Tanggal SK</p>
                                        <p className="text-sm font-medium mt-0.5">
                                            {teacher.skDate ? format(new Date(teacher.skDate), 'd MMMM yyyy', { locale: indonesia }) : '-'}
                                        </p>
                                    </div>
                                </div>

                                {/* TMT Pengangkatan */}
                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-emerald-50/50 border border-emerald-100">
                                    <div className="p-2 rounded-full bg-emerald-100/80">
                                        <Calendar className="h-5 w-5 text-emerald-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">TMT Pengangkatan</p>
                                        <p className="text-sm font-semibold text-emerald-900 mt-0.5">
                                            {format(new Date(teacher.joinDate), 'd MMMM yyyy', { locale: indonesia })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Riwayat Pendidikan */}
                        {teacher.education && (
                            <div className="space-y-4 pt-6 border-t">
                                <h3 className="text-base font-medium text-foreground flex items-center gap-2">
                                    <GraduationCap className="h-4.5 w-4.5 text-primary" />
                                    Riwayat Pendidikan
                                </h3>
                                <div className="flex items-start space-x-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                                    <div className="p-3 rounded-lg bg-white shadow-sm border border-slate-100">
                                        <Building2 className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-semibold text-slate-900">{teacher.education.university}</h4>
                                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] px-2 py-0.5 flex items-center gap-1">
                                                <CheckCircle2 className="h-3 w-3" />
                                                Lulus {teacher.education.graduationYear}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-slate-600">
                                            {teacher.education.lastEducation} - {teacher.education.major}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Mata Pelajaran & Kelas (untuk siapa saja yang mengajar) */}
                        {teacher.teachingAssignments && teacher.teachingAssignments.length > 0 && (
                            <div className="space-y-4 pt-6 border-t">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-base font-medium text-foreground flex items-center gap-2">
                                        <BookOpen className="h-4.5 w-4.5 text-primary" />
                                        Mata Pelajaran & Kelas
                                    </h3>
                                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">
                                        {teacher.teachingAssignments.length} Mapel | {teacher.teachingAssignments.reduce((acc, curr) => acc + curr.classes.length, 0)} Kelas
                                    </Badge>
                                </div>
                                <div className="space-y-3">
                                    {teacher.teachingAssignments.map((assignment) => (
                                        <div 
                                            key={assignment.subjectId} 
                                            className="p-4 rounded-xl bg-gradient-to-r from-blue-50/80 to-slate-50/50 border border-blue-100/50"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2.5 rounded-lg bg-blue-100 shadow-sm">
                                                        <BookOpen className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-900">{assignment.subjectName}</p>
                                                        <p className="text-xs text-slate-500 mt-0.5">Kode: {assignment.subjectCode}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-1.5 justify-end">
                                                    {assignment.classes.map((cls) => (
                                                        <Badge 
                                                            key={cls.classId}
                                                            className="bg-blue-800 text-white text-xs"
                                                        >
                                                            {cls.className}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Wali Kelas (jika ada) */}
                        {teacher.homeroomClass && (
                            <div className="space-y-4 pt-6 border-t">
                                <h3 className="text-base font-medium text-foreground flex items-center gap-2">
                                    <UsersRound className="h-4.5 w-4.5 text-primary" />
                                    Wali Kelas
                                </h3>
                                <div className="flex items-center space-x-3 p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                                    <div className="p-2 rounded-full bg-emerald-100">
                                        <UsersRound className="h-5 w-5 text-emerald-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-emerald-900">Kelas {teacher.homeroomClass.className}</p>
                                        <p className="text-xs text-emerald-700">Tahun Ajaran {teacher.homeroomClass.academicYear}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Pembina Ekstrakurikuler (jika ada) */}
                        {teacher.extracurriculars && teacher.extracurriculars.length > 0 && (
                            <div className="space-y-4 pt-6 border-t">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-base font-medium text-foreground flex items-center gap-2">
                                        <Trophy className="h-4.5 w-4.5 text-primary" />
                                        Pembina Ekstrakurikuler
                                    </h3>
                                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                        {teacher.extracurriculars.length} Ekskul
                                    </Badge>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {teacher.extracurriculars.map((ext) => (
                                        <div 
                                            key={ext.extracurricularId}
                                            className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200"
                                        >
                                            <div className="p-1.5 rounded-full bg-amber-100">
                                                <Trophy className="h-4 w-4 text-amber-600" />
                                            </div>
                                            <span className="text-sm font-medium text-amber-900">{ext.extracurricularName}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Data Guru?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Data <strong>{teacher.name}</strong> akan dihapus permanen dari sistem.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Menghapus...
                                </>
                            ) : (
                                'Ya, Hapus'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
