'use client';

import React, { useState } from 'react';
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
    Crown,
    Shield,
    ClipboardCheck,
    Eye,
    EyeOff,
    Lock,
    BookHeart,
    ScrollText,
    Stamp,
    Landmark,
    Building2,
    AlertCircle,
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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

import { StructuralPosition, TeacherStatus } from '../types/teacher';
import { useTeacher } from '../hooks/useTeacher';
import { useTeacherList } from '../hooks/useTeacherList';

// ─── Label Maps ────────────────────────────────────────────────────────────────

const GENDER_LABELS: Record<string, string> = {
    L: 'Laki-laki',
    P: 'Perempuan',
};

const STRUCTURAL_LABELS: Record<StructuralPosition, string> = {
    headmaster: 'Kepala Sekolah',
    vice_curriculum: 'Waka Kurikulum',
    vice_student_affairs: 'Waka Kesiswaan',
    coord_piket_ikhwan: 'Koord. Piket Ikhwan',
    coord_piket_akhwat: 'Koord. Piket Akhwat',
    admin_dapodik: 'TU & OPS Dapodik',
};

const EMPLOYMENT_STATUS_LABELS: Record<string, string> = {
    PNS: 'Pegawai Negeri Sipil (PNS)',
    PPPK: 'PPPK',
    GTY: 'Guru Tetap Yayasan (GTY)',
    GTT: 'Guru Tidak Tetap (GTT)',
    HONORER: 'Tenaga Honorer',
};

const STATUS_STYLES: Record<TeacherStatus, string> = {
    active: 'bg-green-100 text-green-700 border-green-200',
    inactive: 'bg-red-100 text-red-700 border-red-200',
    leave: 'bg-yellow-100 text-yellow-700 border-yellow-200',
};

const STATUS_LABELS: Record<TeacherStatus, string> = {
    active: 'Aktif',
    inactive: 'Nonaktif',
    leave: 'Cuti',
};

// ─── Skeleton ──────────────────────────────────────────────────────────────────

const TeacherDetailSkeleton = () => (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex gap-2">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-20" />
            </div>
        </div>
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-center gap-6 mb-6">
                    <Skeleton className="h-28 w-28 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-7 w-48" />
                        <Skeleton className="h-5 w-32" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                            <Skeleton className="h-9 w-9 rounded-full" />
                            <div className="flex-1 space-y-1">
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    </div>
);

// ─── Helper ────────────────────────────────────────────────────────────────────

const formatDate = (dateString?: string | null) => {
    if (!dateString) return '-';
    try {
        return format(new Date(dateString), 'dd MMMM yyyy', { locale: indonesia });
    } catch {
        return dateString;
    }
};

// ─── Component ─────────────────────────────────────────────────────────────────

export const TeacherDetail: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const id = Number(params.id);

    const [showNik, setShowNik] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isPhotoOpen, setIsPhotoOpen] = useState(false);

    const { teacher, isLoading, isError } = useTeacher(id);
    const { deleteTeacher, isDeleting } = useTeacherList();

    const handleDelete = () => {
        deleteTeacher(id);
        toast.success(`Data ${teacher?.name} berhasil dihapus`);
        router.push('/admin/users/teachers');
    };

    if (isLoading) return <TeacherDetailSkeleton />;

    if (isError || !teacher) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <AlertCircle className="h-12 w-12 text-red-400" />
                <p className="text-slate-600 font-medium">Data guru tidak ditemukan</p>
                <Button variant="outline" onClick={() => router.push('/admin/users/teachers')}>
                    Kembali ke Daftar
                </Button>
            </div>
        );
    }

    const profile = teacher.teacher_profile;
    const status: TeacherStatus = profile?.status ?? 'active';
    const initials = teacher.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);

    const nik = profile?.nik ?? '';
    const maskedNik = nik.length > 8
        ? nik.substring(0, 4) + '•'.repeat(nik.length - 8) + nik.substring(nik.length - 4)
        : '••••••••';

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
                                Data PTK
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                            <Users className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">Informasi lengkap data personil sekolah</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge
                        variant="secondary"
                        className={cn('pl-2 pr-3 py-1', STATUS_STYLES[status])}
                    >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                        {STATUS_LABELS[status]}
                    </Badge>
                    <Button
                        onClick={() => router.push(`/admin/users/teachers/${id}/edit`)}
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

            {/* Profile Card */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                            <User className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Data Diri</CardTitle>
                            <p className="text-sm text-muted-foreground mt-0.5 font-normal">
                                Informasi lengkap guru/pendidik
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Avatar & Nama */}
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div
                            onClick={() => teacher.avatar && setIsPhotoOpen(true)}
                            className={cn(
                                'relative group',
                                teacher.avatar ? 'cursor-pointer' : 'cursor-default'
                            )}
                        >
                            <Avatar className="w-28 h-28 border-4 border-primary/10 transition-transform duration-300 group-hover:scale-105">
                                <AvatarImage src={teacher.avatar ?? undefined} alt={teacher.name} className="object-cover" />
                                <AvatarFallback className="text-3xl font-semibold bg-blue-800 text-white">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        <Dialog open={isPhotoOpen} onOpenChange={setIsPhotoOpen}>
                            <DialogContent className="max-w-md p-1 bg-transparent border-none shadow-none">
                                <div className="rounded-lg overflow-hidden bg-white shadow-2xl">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={teacher.avatar ?? ''}
                                        alt={teacher.name}
                                        className="w-full h-auto object-contain max-h-[80vh]"
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>

                        <div className="flex-1 text-center md:text-left space-y-2">
                            <h2 className="text-2xl font-bold text-foreground">{teacher.name}</h2>
                            <p className="text-sm text-muted-foreground">@{teacher.username}</p>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
                                {teacher.roles.map((role) => (
                                    <Badge key={role} className="bg-blue-800 text-white pl-2 pr-3 py-1">
                                        <Briefcase className="h-3.5 w-3.5 mr-1.5" />
                                        {role === 'subject_teacher' ? 'Guru Mapel' :
                                         role === 'picket_teacher' ? 'Guru Piket' :
                                         role === 'homeroom_teacher' ? 'Wali Kelas' : role}
                                    </Badge>
                                ))}
                                {profile?.structural_positions?.map((pos) => (
                                    <Badge key={pos} className="bg-blue-800 text-white pl-2 pr-3 py-1">
                                        {pos === 'headmaster' && <Crown className="h-3.5 w-3.5 mr-1.5" />}
                                        {(pos === 'vice_curriculum' || pos === 'vice_student_affairs') && <Shield className="h-3.5 w-3.5 mr-1.5" />}
                                        {(pos === 'coord_piket_ikhwan' || pos === 'coord_piket_akhwat') && <ClipboardCheck className="h-3.5 w-3.5 mr-1.5" />}
                                        {pos === 'admin_dapodik' && <Briefcase className="h-3.5 w-3.5 mr-1.5" />}
                                        {STRUCTURAL_LABELS[pos]}
                                    </Badge>
                                ))}
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
                            <InfoItem icon={<BadgeCheck />} label="NIP / ID Pegawai" value={profile?.employee_id} mono />
                            <InfoItem icon={<BookHeart />} label="NUPTK" value={profile?.nuptk} mono />

                            {/* NIK — masked */}
                            {nik && (
                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-amber-50/50 border border-amber-100">
                                    <div className="p-2 rounded-full bg-amber-100/80">
                                        <Lock className="h-5 w-5 text-amber-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs text-muted-foreground">NIK</p>
                                                <Badge variant="outline" className="text-[10px] h-4 px-1 border-amber-200 text-amber-700 bg-white">
                                                    Privat
                                                </Badge>
                                            </div>
                                            <button
                                                onClick={() => setShowNik(!showNik)}
                                                className="text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                {showNik ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        <p className="text-sm font-mono font-medium text-slate-700 mt-0.5 tracking-wide">
                                            {showNik ? nik : maskedNik}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <InfoItem icon={<AtSign />} label="Gelar Akademik" value={profile?.qualifications} />
                            <InfoItem icon={<User />} label="Jenis Kelamin" value={teacher.gender ? GENDER_LABELS[teacher.gender] : undefined} />
                            <InfoItem
                                icon={<Calendar />}
                                label="Tempat, Tanggal Lahir"
                                value={
                                    teacher.birth_place || teacher.dob
                                        ? `${teacher.birth_place ?? '-'}, ${formatDate(teacher.dob)}`
                                        : undefined
                                }
                                colSpan
                            />
                        </div>
                    </div>

                    {/* Kontak */}
                    <div className="space-y-4 pt-6 border-t">
                        <h3 className="text-base font-medium flex items-center gap-2">
                            <Phone className="h-4 w-4 text-blue-700" />
                            Informasi Kontak
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoItem icon={<Mail />} label="Email" value={teacher.email} />
                            <InfoItem icon={<Phone />} label="No. Handphone" value={teacher.phone} />
                            <InfoItem icon={<MapPin />} label="Alamat" value={teacher.address} colSpan />
                        </div>
                    </div>

                    {/* Kepegawaian */}
                    <div className="space-y-4 pt-6 border-t">
                        <h3 className="text-base font-medium flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-blue-700" />
                            Informasi Karir & SK
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoItem
                                icon={<Briefcase />}
                                label="Status Kepegawaian"
                                value={profile?.employment_status
                                    ? EMPLOYMENT_STATUS_LABELS[profile.employment_status]
                                    : undefined}
                                highlight="blue"
                            />
                            <InfoItem icon={<User />} label="Jenis PTK" value={profile?.ptk_type} />
                            <InfoItem icon={<Landmark />} label="Lembaga Pengangkat" value={profile?.institution} />
                            <InfoItem icon={<ScrollText />} label="No. SK Kerja" value={profile?.sk_number} mono />
                            <InfoItem icon={<Stamp />} label="Tanggal SK" value={formatDate(profile?.sk_date)} />
                            <InfoItem
                                icon={<Calendar />}
                                label="TMT Pengangkatan"
                                value={formatDate(profile?.join_date)}
                                highlight="blue"
                            />
                        </div>
                    </div>

                    {/* Pendidikan */}
                    {(profile?.last_education || profile?.education_university) && (
                        <div className="space-y-4 pt-6 border-t">
                            <h3 className="text-base font-medium flex items-center gap-2">
                                <GraduationCap className="h-4 w-4 text-blue-700" />
                                Riwayat Pendidikan
                            </h3>
                            <div className="flex items-start space-x-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                                <div className="p-3 rounded-lg bg-white shadow-sm border border-slate-100">
                                    <Building2 className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-semibold text-slate-900">
                                            {profile.education_university ?? '-'}
                                        </h4>
                                        {profile.education_graduation_year && (
                                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] px-2 py-0.5 flex items-center gap-1">
                                                <CheckCircle2 className="h-3 w-3" />
                                                Lulus {profile.education_graduation_year}
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-600">
                                        {profile.last_education} — {profile.education_major ?? '-'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Delete Dialog */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <div className="flex items-center gap-4 mb-1">
                            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                <Trash2 className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                                <AlertDialogTitle className="text-lg">Hapus Data Guru?</AlertDialogTitle>
                                <AlertDialogDescription className="mt-1">
                                    Data <strong>{teacher.name}</strong> akan dihapus permanen dan tidak dapat dipulihkan.
                                </AlertDialogDescription>
                            </div>
                        </div>
                        <div className="ml-16 p-3 bg-red-50 border border-red-100 rounded-lg">
                            <p className="text-xs text-red-700 leading-relaxed">
                                ⚠️ Semua data terkait termasuk riwayat kepegawaian dan penugasan mengajar juga akan ikut terhapus.
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
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Menghapus...
                                </>
                            ) : (
                                'Ya, Hapus Sekarang'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

// ─── InfoItem helper ───────────────────────────────────────────────────────────

interface InfoItemProps {
    icon: React.ReactNode;
    label: string;
    value?: string | null;
    mono?: boolean;
    colSpan?: boolean;
    highlight?: 'blue' | 'green';
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value, mono, colSpan, highlight }) => {
    const bgClass = highlight === 'blue'
        ? 'bg-blue-50/50 border border-blue-100'
        : 'bg-muted/30';

    const iconBg = highlight === 'blue'
        ? 'bg-blue-100/80'
        : 'bg-blue-100/60';

    const iconColor = 'text-blue-700';

    const textColor = highlight === 'blue'
        ? 'text-slate-900 font-semibold'
        : 'text-slate-800 font-medium';

    return (
        <div className={cn('flex items-center space-x-3 p-3 rounded-lg', bgClass, colSpan && 'md:col-span-2')}>
            <div className={cn('p-2 rounded-full shrink-0', iconBg)}>
                <span className={cn('h-5 w-5 block [&>svg]:h-5 [&>svg]:w-5', iconColor)}>
                    {icon}
                </span>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className={cn('text-sm mt-0.5 truncate', mono && 'font-mono tracking-wide', textColor)}>
                    {value ?? '-'}
                </p>
            </div>
        </div>
    );
};
