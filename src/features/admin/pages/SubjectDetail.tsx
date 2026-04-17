'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
    Edit,
    BookOpen,
    Users,
    Clock,
    Tag,
    Hash,
    ArrowLeft,
    Search,
    MoreVertical,
    User,
    Trash2,
    AlignLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Subject, SubjectCategory } from '../types/subject';
import { subjectService } from '../services/subjectService';
import { SubjectListSkeleton } from '../components/subject';

// Helper to format category for display
const formatCategory = (cat: SubjectCategory) => {
    const mapping: Record<SubjectCategory, string> = {
        UMUM: 'Umum',
        AGAMA: 'Agama',
        KEJURUAN: 'Kejuruan',
        EKSKUL: 'Ekstrakurikuler'
    };
    return mapping[cat] || cat;
};

interface SubjectDetailProps {
    id: string;
}

export const SubjectDetail: React.FC<SubjectDetailProps> = ({ id }) => {
    const router = useRouter();
    const [subject, setSubject] = useState<Subject | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [teacherSearch, setTeacherSearch] = useState('');

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                setIsLoading(true);
                const data = await subjectService.getSubjectById(id);
                setSubject(data);
            } catch (error) {
                console.error('Failed to fetch subject:', error);
                toast.error('Gagal memuat data mata pelajaran');
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    if (isLoading) {
        return <SubjectListSkeleton />;
    }

    if (!subject) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    <BookOpen className="h-8 w-8 text-slate-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Mata pelajaran tidak ditemukan</h2>
                <p className="text-slate-500 mt-2 mb-6 max-w-sm">
                    Data mata pelajaran yang Anda cari mungkin telah dihapus atau ID yang dimasukkan tidak valid.
                </p>
                <Button onClick={() => router.push('/admin/subject')} variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Daftar
                </Button>
            </div>
        );
    }

    const teachers = subject.teachers || subject.teacherNames?.map((name, index) => ({ 
        id: `mock-id-${index}`, 
        name, 
        nip: '-',
        specialization: ''
    })) || [];

    const filteredTeachers = teachers.filter(t => 
        t.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
        (t.nip && t.nip.includes(teacherSearch))
    );

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1.5">
                        <div onClick={() => router.back()} className="cursor-pointer hover:bg-slate-100 p-1.5 rounded-full transition-colors lg:hidden">
                            <ArrowLeft className="h-5 w-5 text-slate-500" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Detail{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Mata Pelajaran
                            </span>
                        </h1>
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 px-2.5 py-0.5 text-sm font-semibold">
                            {subject.code}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Informasi lengkap mata pelajaran <span className="font-semibold text-foreground">{subject.name}</span> dan kurikulum
                    </p>
                </div>
                <div>
                    <Button 
                        onClick={() => router.push(`/admin/subject/${id}/edit`)}
                        className="bg-blue-800 hover:bg-blue-900 text-white shadow-sm transition-colors"
                    >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Mapel
                    </Button>
                </div>
            </div>

            {/* Stats Separator Section (No Cards) */}
            <div className="flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-slate-200 bg-white/5 py-8">
                {/* Kode Mapel */}
                <div className="flex-1 w-full flex items-center justify-start gap-4 px-6 py-2">
                    <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                        <Hash className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Kode Mapel</p>
                        <p className="font-semibold text-slate-900 text-sm font-mono">
                            {subject.code}
                        </p>
                    </div>
                </div>

                {/* Kategori */}
                <div className="flex-1 w-full flex items-center justify-start gap-4 px-6 py-2">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center shrink-0 border border-slate-100 bg-slate-50 text-slate-400">
                        <Tag className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Kategori</p>
                        <p className="font-medium text-slate-600 text-xs">
                            {formatCategory(subject.category)}
                        </p>
                    </div>
                </div>

                {/* Tipe Mapel */}
                <div className="flex-1 w-full flex items-center justify-start gap-4 px-6 py-2">
                    <div className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center shrink-0 border",
                        subject.type === 'WAJIB' ? "bg-blue-50 text-blue-700 border-blue-100" : "bg-amber-50 text-amber-600 border-amber-100"
                    )}>
                        <Hash className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Tipe Mapel</p>
                        <p className="font-medium text-slate-600 text-xs tracking-tight">
                            {subject.type === 'WAJIB' ? 'Wajib' : 'Peminatan'}
                        </p>
                    </div>
                </div>
            </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                {/* Left Column: Configuration & Description */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    {/* JP Configuration Card */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-3 border-b border-slate-50">
                             <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-semibold text-gray-900">Beban Jam (JP)</CardTitle>
                                    <CardDescription className="text-xs text-slate-500">
                                        Per alokasi tingkat kelas
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="space-y-3">
                                {subject.gradeLevel && subject.gradeLevel.length > 0 ? (
                                    subject.gradeLevel.sort().map(grade => (
                                        <div key={grade} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                            <div className="flex items-center gap-3">
                                                <Badge variant="outline" className="bg-white border-slate-200 h-8 w-8 flex items-center justify-center p-0 text-sm font-bold text-slate-700">
                                                    {grade}
                                                </Badge>
                                                <span className="text-sm font-medium text-slate-600">Kelas {grade}</span>
                                            </div>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-lg font-bold text-slate-900">
                                                    {subject.gradeSpecificJp?.[grade] || 0}
                                                </span>
                                                <span className="text-xs text-slate-500">JP</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-slate-400 text-sm italic">
                                        Belum ada tingkat kelas diset
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Description Card */}
                    <Card className="border-slate-200 shadow-sm h-full">
                        <CardHeader className="pb-3 space-y-2">
                             <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0">
                                    <AlignLeft className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-semibold text-gray-900">Deskripsi</CardTitle>
                                    <CardDescription className="text-sm text-slate-500">
                                        Informasi umum
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {subject.description ? (
                                <div className="prose prose-sm prose-slate max-w-none">
                                    <p className="text-slate-600 leading-relaxed text-sm">
                                        {subject.description}
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-6 text-center border rounded-lg border-dashed border-slate-200 bg-slate-50/50">
                                    <p className="text-slate-400 text-sm italic">Belum ada deskripsi</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Teachers List (Takes up 2/3 space) */}
                <div className="lg:col-span-2">
                    <Card className="border-slate-200 shadow-sm h-full">
                        <CardHeader className="pb-2">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0">
                                        <Users className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-semibold text-gray-900">Daftar Guru Pengampu</CardTitle>
                                        <CardDescription className="text-sm text-slate-500">
                                            Total {filteredTeachers.length} guru pengampu terdaftar
                                        </CardDescription>
                                    </div>
                                </div>
                                
                                <div className="relative w-full sm:w-[250px]">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Cari nama atau NIP..."
                                        className="pl-9 h-9"
                                        value={teacherSearch}
                                        onChange={(e) => setTeacherSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider w-[50px] text-center">No</th>
                                            <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Nama Guru</th>
                                            <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">NIP</th>
                                            <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider text-center">Status</th>
                                            <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 bg-white">
                                        {filteredTeachers.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center">
                                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                                        <Search className="h-8 w-8 text-slate-300 mb-2" />
                                                        <p className="text-sm text-slate-500">Tidak ada guru ditemukan</p>
                                                        <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian Anda</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredTeachers.map((teacher, index) => (
                                                <tr key={index} className="group transition-colors border-b border-slate-50 hover:bg-slate-50/60">
                                                    <td className="px-6 py-4 text-center text-slate-500 font-mono text-xs">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 uppercase font-bold text-xs border border-blue-100">
                                                                {teacher.name.charAt(0)}
                                                            </div>
                                                            <span className="font-medium text-slate-900 text-sm">{teacher.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-xs text-slate-500 font-mono">{teacher.nip || '—'}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs font-medium">
                                                            Aktif
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-[160px]">
                                                                <DropdownMenuLabel>Aksi Guru</DropdownMenuLabel>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem className="cursor-pointer">
                                                                    <User className="mr-2 h-4 w-4 text-slate-400" /> Profil Guru
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem 
                                                                    className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" /> Lepas Tugas
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
