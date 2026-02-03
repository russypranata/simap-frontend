'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
    Edit,
    School,
    Users,
    Calendar,
    ArrowLeft,
    Search,
    MoreVertical,
    Trash2,
    GraduationCap,
    Plus,
    User,
    FileSpreadsheet,
    FileUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription, // Added CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ClassListSkeleton } from '../components/class';

import { Class, Student } from '../types/class';
import { classService } from '../services/classService';
import { MOCK_STUDENTS } from '../data/mockClassData';

import { academicYearService } from '../services/academicYearService';

interface ClassDetailProps {
    id: string;
}

export const ClassDetail: React.FC<ClassDetailProps> = ({ id }) => {
    const router = useRouter();
    const [classData, setClassData] = useState<Class | null>(null);
    const [academicYearName, setAcademicYearName] = useState<string>('');
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [removeStudentId, setRemoveStudentId] = useState<string | null>(null);
    const [isRemoving, setIsRemoving] = useState(false);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const data = await classService.getClassById(id);
                if (data) {
                    setClassData(data);
                    
                    // Fetch Academic Year Name
                    try {
                        const yearData = await academicYearService.getAcademicYearById(data.academicYearId);
                        if (yearData) {
                            setAcademicYearName(yearData.name);
                        }
                    } catch (err) {
                        console.error('Failed to fetch academic year:', err);
                    }

                    // Mock student fetching
                    setStudents(MOCK_STUDENTS); 
                }
            } catch (error) {
                console.error('Failed to fetch class detail:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    const handleRemoveStudent = async () => {
        if (!removeStudentId) return;

        try {
            setIsRemoving(true);
            // Mock removal
            await new Promise(resolve => setTimeout(resolve, 800));
            setStudents(prev => prev.filter(s => s.id !== removeStudentId));
            toast.success('Siswa berhasil dikeluarkan dari kelas');
        } catch (error) {
            console.error('Failed to remove student:', error);
            toast.error('Gagal mengeluarkan siswa');
        } finally {
            setIsRemoving(false);
            setRemoveStudentId(null);
        }
    };

    if (isLoading) {
        return <ClassListSkeleton />;
    }

    if (!classData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    <School className="h-8 w-8 text-slate-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Kelas tidak ditemukan</h2>
                <p className="text-slate-500 mt-2 mb-6 max-w-sm">
                    Data kelas yang Anda cari mungkin telah dihapus atau ID yang dimasukkan tidak valid.
                </p>
                <Button onClick={() => router.push('/admin/class')} variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Daftar
                </Button>
            </div>
        );
    }

    const filteredStudents = students.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        student.nisn.includes(searchTerm)
    );

    const occupancyRate = (classData.totalStudents / classData.capacity) * 100;
    const isNearCapacity = occupancyRate >= 80 && occupancyRate < 100;
    const isFull = occupancyRate >= 100;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1.5">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Detail{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                {classData.name}
                            </span>
                        </h1>
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 px-2.5 py-0.5 text-sm font-semibold">
                            Kelas {classData.grade}
                        </Badge>
                        <Badge variant="outline" className={cn(
                            "font-bold text-xs px-2.5 py-0.5 uppercase tracking-wide",
                            classData.type === 'REGULER' 
                                ? "bg-slate-50 text-slate-500 border-slate-200" 
                                : "bg-purple-50 text-purple-700 border-purple-200"
                        )}>
                            {classData.type}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Kelola data rombongan belajar dan daftar siswa
                    </p>
                </div>
                <div>
                    <Button
                        className="bg-blue-800 hover:bg-blue-900 text-white shadow-sm transition-colors"
                        onClick={() => router.push(`/admin/class/${id}/edit`)}
                    >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Kelas
                    </Button>
                </div>
            </div>

            <div className={cn(
                "grid gap-4",
                classData.type === 'REGULER' ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2"
            )}>
                {/* Wali Kelas Card (Only Reguler) */}
                {classData.type === 'REGULER' && (
                    <Card className="border-slate-200 shadow-sm">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                                <Users className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">Wali Kelas</p>
                                <p className="font-semibold text-slate-900 text-base">
                                    {classData.homeroomTeacherName || <span className="text-slate-400 font-normal">Belum ditugaskan</span>}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Siswa / Kapasitas Card */}
                <Card className="border-slate-200 shadow-sm">
                    <CardContent className="py-3 px-4 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                            <GraduationCap className="h-6 w-6" />
                        </div>
                        <div className="flex-1 space-y-1.5">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Kapasitas</p>
                                <span className={cn(
                                    "text-xs font-bold",
                                    isFull ? "text-red-600" : isNearCapacity ? "text-amber-600" : "text-blue-600"
                                )}>
                                    {Math.round(occupancyRate)}%
                                </span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="font-bold text-slate-900 text-xl">{classData.totalStudents}</span>
                                <span className="text-sm text-slate-500 font-medium">/ {classData.capacity} Siswa</span>
                            </div>
                            <Progress 
                                value={occupancyRate} 
                                className="h-1.5"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Tahun Ajaran Card */}
                <Card className="border-slate-200 shadow-sm">
                    <CardContent className="py-3 px-4 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                            <Calendar className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">Tahun Ajaran</p>
                            <p className="font-semibold text-slate-900 text-base">
                                {academicYearName || <span className="text-slate-400 italic">Memuat...</span>}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Peminatan Information (Conditional) */}
            {classData.type === 'PEMINATAN' && (
                <Card className="border-purple-100 bg-purple-50/30 shadow-sm">
                    <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 border border-purple-200">
                                <GraduationCap className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-purple-500 mb-0.5">Informasi Peminatan</p>
                                <h3 className="font-bold text-slate-900 text-lg">
                                    PEM {classData.peminatanCategory === 'AKH' ? 'Akhlak' : 'Ikhtishosh'} - {classData.subjectName}
                                </h3>
                                <p className="text-sm text-slate-500">
                                    Kelas ini dikhususkan untuk pendalaman materi {classData.subjectName}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <Badge variant="outline" className="bg-white border-purple-200 text-purple-700 px-3 py-1">
                                ID Mapel: {classData.subjectId}
                           </Badge>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Students List Table */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-primary flex-shrink-0">
                                <Users className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">Daftar Siswa</CardTitle>
                                <CardDescription className="text-sm text-slate-500">
                                    Total {filteredStudents.length} siswa terdaftar di kelas ini
                                </CardDescription>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <div className="relative w-full sm:w-[250px]">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Cari nama atau NISN..."
                                    className="pl-9 h-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button className="h-9 bg-blue-800 hover:bg-blue-900 text-white shadow-sm">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Tambah Siswa
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[200px]">
                                    <DropdownMenuItem className="cursor-pointer">
                                        <Plus className="h-4 w-4 mr-2" /> Input Manual
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer">
                                        <FileUp className="h-4 w-4 mr-2" /> Pilih dari Database
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="cursor-pointer text-blue-600">
                                        <FileSpreadsheet className="h-4 w-4 mr-2" /> Import Excel/CSV
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-white text-slate-500 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider w-[50px] text-center">No</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Nama Siswa</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">NISN</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-center">Status</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 bg-white">
                                {filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                                                    <Search className="h-6 w-6" />
                                                </div>
                                                <p className="text-slate-900 font-medium mt-2">Tidak ada siswa ditemukan</p>
                                                <p className="text-slate-500 text-sm">Coba sesuaikan kata kunci pencarian Anda</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((student, index) => (
                                        <tr key={student.id} className="group hover:bg-slate-50/60 transition-colors">
                                            <td className="px-6 py-4 text-center text-slate-500 font-mono text-xs">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                                        <User className="h-4 w-4" />
                                                    </div>
                                                    <span className="font-semibold text-slate-900 text-sm">{student.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-slate-500 text-sm">
                                                {student.nisn}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-medium">
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
                                                        <DropdownMenuLabel>Aksi Siswa</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="cursor-pointer">
                                                            <Edit className="mr-2 h-4 w-4 text-slate-400" /> Edit Detail
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            onClick={() => setRemoveStudentId(student.id)}
                                                            className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" /> Keluarkan
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

            {/* Remove Student Confirmation Dialog */}
            <AlertDialog open={!!removeStudentId} onOpenChange={(open) => !open && setRemoveStudentId(null)}>
                <AlertDialogContent className="max-w-[400px]">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Keluarkan Siswa?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini akan mengeluarkan siswa dari rombongan belajar ini. Data siswa akan tetap ada di database sistem.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isRemoving}>Batal</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={(e) => {
                                e.preventDefault();
                                handleRemoveStudent();
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={isRemoving}
                        >
                            {isRemoving ? 'Proses...' : 'Ya, Keluarkan'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
