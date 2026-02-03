'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    GraduationCap,
    Users,
    FilterX,
    FileX,
    MoreHorizontal,
    UserCircle,
    Phone,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Student, StudentStatus } from '../types/student';
import { MOCK_STUDENTS } from '../data/mockStudentData';
import { StudentListSkeleton } from '../components/student/StudentListSkeleton';

const statusStyles: Record<StudentStatus, string> = {
    active: 'bg-green-50 text-green-700 border-green-200',
    graduated: 'bg-blue-50 text-blue-700 border-blue-200',
    transferred: 'bg-orange-50 text-orange-700 border-orange-200',
    dropped_out: 'bg-red-50 text-red-700 border-red-200',
};

const statusLabels: Record<StudentStatus, string> = {
    active: 'Aktif',
    graduated: 'Lulus',
    transferred: 'Pindah',
    dropped_out: 'Putus Sekolah',
};

export const StudentList: React.FC = () => {
    const router = useRouter();
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedGeneration, setSelectedGeneration] = useState<string>('all');

    // Selection & Actions
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isBulkDelete, setIsBulkDelete] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 800)); // Fake delay
            setStudents(MOCK_STUDENTS);
            setIsLoading(false);
        };
        loadData();
    }, []);

    // Unique generations for filter
    const generations = Array.from(new Set(students.map(s => s.generation))).sort().reverse();

    // Filter Logic
    const filteredStudents = students.filter(student => {
        const matchesSearch = 
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.nis.includes(searchTerm) ||
            student.nisn.includes(searchTerm);
        
        const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;
        const matchesGeneration = selectedGeneration === 'all' || student.generation === selectedGeneration;

        return matchesSearch && matchesStatus && matchesGeneration;
    });

    const toggleSelectAll = () => {
        if (selectedItems.length === filteredStudents.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(filteredStudents.map(s => s.id));
        }
    };

    const toggleSelectItem = (id: string) => {
        setSelectedItems(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (isBulkDelete) {
            setStudents(prev => prev.filter(s => !selectedItems.includes(s.id)));
            setSelectedItems([]);
            toast.success(`${selectedItems.length} data siswa berhasil dihapus`);
        } else if (deleteId) {
            setStudents(prev => prev.filter(s => s.id !== deleteId));
            toast.success('Data siswa berhasil dihapus');
        }
        
        setIsDeleting(false);
        setDeleteId(null);
        setIsBulkDelete(false);
    };

    if (isLoading) return <StudentListSkeleton />;

    return (
        <div className="space-y-6">
            {/* Context Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Data{' '}
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
                        Kelola data induk siswa, riwayat kelas, dan status akademik.
                    </p>
                </div>
                <Button 
                    onClick={() => router.push('/admin/users/students/new')}
                    className="bg-blue-800 hover:bg-blue-900 text-white shadow-md hover:shadow-lg transition-all"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Siswa
                </Button>
            </div>

            {/* List Card */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-primary flex-shrink-0">
                                <Users className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    Daftar Siswa
                                </CardTitle>
                                <CardDescription>
                                    Total {students.length} siswa terdaftar
                                </CardDescription>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari Nama, NIS, atau NISN..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 w-full"
                            />
                        </div>

                        {/* Generation Filter */}
                        <Select value={selectedGeneration} onValueChange={setSelectedGeneration}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Angkatan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Angkatan</SelectItem>
                                {generations.map(gen => (
                                    <SelectItem key={gen} value={gen}>{gen}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Status Filter */}
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                <SelectItem value="active">Aktif</SelectItem>
                                <SelectItem value="graduated">Lulus</SelectItem>
                                <SelectItem value="transferred">Pindah</SelectItem>
                                <SelectItem value="dropped_out">Putus Sekolah</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="border-t border-slate-200 overflow-x-auto">
                        <table className="w-full text-sm text-left">
                             <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                                <tr>
                                    <th className="pl-4 pr-0 py-4 font-semibold text-xs uppercase tracking-wider w-[40px]">
                                        <Checkbox 
                                            checked={filteredStudents.length > 0 && selectedItems.length === filteredStudents.length}
                                            onCheckedChange={toggleSelectAll}
                                        />
                                    </th>
                                    <th className="pl-3 pr-6 py-4 font-semibold text-xs uppercase tracking-wider">Nama & NIS</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Kelas & Angkatan</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Orang Tua</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-center">Status</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                                                    {searchTerm ? (
                                                        <FilterX className="h-8 w-8 text-slate-300" />
                                                    ) : (
                                                        <FileX className="h-8 w-8 text-slate-300" />
                                                    )}
                                                </div>
                                                <p className="text-slate-500 font-medium">Data tidak ditemukan</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((student) => (
                                        <tr key={student.id} className={cn(
                                            "group transition-colors border-b border-slate-50",
                                            selectedItems.includes(student.id) ? "bg-blue-50/50" : "hover:bg-slate-50/60"
                                        )}>
                                            <td className="pl-4 pr-0 py-4">
                                                <Checkbox 
                                                    checked={selectedItems.includes(student.id)}
                                                    onCheckedChange={() => toggleSelectItem(student.id)}
                                                />
                                            </td>
                                            <td className="pl-3 pr-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9 border border-slate-200">
                                                        <AvatarImage src={student.profilePicture} />
                                                        <AvatarFallback className="bg-slate-100 text-slate-500 text-xs">
                                                            {student.name.substring(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium text-slate-900">{student.name}</p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className="text-[10px] bg-slate-100 text-slate-600 px-1 rounded">
                                                                {student.nis}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400">
                                                                NISN: {student.nisn}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <Badge variant="outline" className="w-fit font-normal bg-white text-slate-700 border-slate-300">
                                                        {student.className || 'Belum Masuk Kelas'}
                                                    </Badge>
                                                    <span className="text-xs text-slate-500">
                                                        Angkatan {student.generation}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <UserCircle className="h-3.5 w-3.5 text-slate-400" />
                                                        <span className="text-xs font-medium text-slate-700">
                                                            {student.parentName || '-'}
                                                        </span>
                                                    </div>
                                                    {student.parentPhone && (
                                                        <div className="flex items-center gap-1.5">
                                                            <Phone className="h-3 w-3 text-slate-400" />
                                                            <span className="text-[11px] text-slate-500">
                                                                {student.parentPhone}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                 <Badge 
                                                    variant="outline"
                                                    className={cn("text-[10px] uppercase tracking-wider font-semibold", statusStyles[student.status])}
                                                >
                                                    {statusLabels[student.status]}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => router.push(`/admin/users/students/${student.id}`)}>
                                                            <Eye className="mr-2 h-4 w-4 text-blue-500" /> Detail
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => router.push(`/admin/users/students/${student.id}/edit`)}>
                                                            <Edit className="mr-2 h-4 w-4 text-amber-500" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            onClick={() => setDeleteId(student.id)}
                                                            className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" /> Hapus
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

            {/* Bulk Actions & Delete Dialog (Same as Teachers) */}
            {selectedItems.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4">
                    <div className="bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 border border-slate-800">
                        <div className="flex items-center gap-2 pr-6 border-r border-slate-700">
                            <span className="h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                                {selectedItems.length}
                            </span>
                            <span className="text-sm font-medium text-slate-300">Siswa dipilih</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-white hover:bg-slate-800 h-9"
                                onClick={() => setIsBulkDelete(true)}
                            >
                                <Trash2 className="h-4 w-4 mr-2 text-red-400" />
                                Hapus Massal
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-white hover:bg-slate-800 h-9"
                                onClick={() => setSelectedItems([])}
                            >
                                Batal
                            </Button>
                        </div>
                    </div>
                </div>
            )}

             <AlertDialog open={!!deleteId || isBulkDelete} onOpenChange={(open) => !open && (setDeleteId(null), setIsBulkDelete(false))}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Data Siswa?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. {isBulkDelete ? `${selectedItems.length} data siswa` : 'Data siswa ini'} akan dihapus permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
