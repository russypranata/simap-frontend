'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    UserPlus,
    Search,
    Edit,
    Trash2,
    Eye,
    School,
    User,
    Users,
    FilterX,
    FileX,
    Settings,
    Briefcase,
    BadgeCheck,
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

import { Teacher, EmploymentType, StructuralPosition, TeacherStatus } from '../types/teacher';
import { MOCK_TEACHERS } from '../data/mockTeacherData';
import { TeacherListSkeleton } from '../components/teacher/TeacherListSkeleton';

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

const statusStyles: Record<TeacherStatus, string> = {
    active: 'bg-green-50 text-green-700 border-green-200',
    inactive: 'bg-red-50 text-red-700 border-red-200',
    leave: 'bg-yellow-50 text-yellow-700 border-yellow-200',
};

export const TeacherList: React.FC = () => {
    const router = useRouter();
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPosition, setSelectedPosition] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');

    // Selection & Actions
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isBulkDelete, setIsBulkDelete] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        // Simulate fetch
        const loadData = async () => {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 800)); // Fake delay
            setTeachers(MOCK_TEACHERS);
            setIsLoading(false);
        };
        loadData();
    }, []);

    // Filter Logic
    const filteredTeachers = teachers.filter(teacher => {
        const matchesSearch = 
            teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.nip.includes(searchTerm) ||
            (teacher.nuptk && teacher.nuptk.includes(searchTerm));
        
        const matchesPosition = selectedPosition === 'all' || 
            teacher.employmentType === selectedPosition ||
            teacher.structuralPositions?.includes(selectedPosition as StructuralPosition);
        const matchesStatus = selectedStatus === 'all' || teacher.status === selectedStatus;

        return matchesSearch && matchesPosition && matchesStatus;
    });

    const toggleSelectAll = () => {
        if (selectedItems.length === filteredTeachers.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(filteredTeachers.map(t => t.id));
        }
    };

    const toggleSelectItem = (id: string) => {
        setSelectedItems(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (isBulkDelete) {
            setTeachers(prev => prev.filter(t => !selectedItems.includes(t.id)));
            setSelectedItems([]);
            toast.success(`${selectedItems.length} data guru berhasil dihapus`);
        } else if (deleteId) {
            setTeachers(prev => prev.filter(t => t.id !== deleteId));
            toast.success('Data guru berhasil dihapus');
        }
        
        setIsDeleting(false);
        setDeleteId(null);
        setIsBulkDelete(false);
    };

    if (isLoading) return <TeacherListSkeleton />;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Data{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Guru & Staff
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <School className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Kelola data guru, kepala sekolah, staff, dan tenaga kependidikan lainnya.
                    </p>
                </div>
                <Button 
                    onClick={() => router.push('/admin/users/teachers/new')}
                    className="bg-blue-800 hover:bg-blue-900 text-white shadow-md hover:shadow-lg transition-all"
                >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Tambah Guru/Staff
                </Button>
            </div>

            {/* Main Content */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-primary flex-shrink-0">
                                <Users className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    Daftar Personil
                                </CardTitle>
                                <CardDescription>
                                    Data guru, kepala sekolah, dan staff terdaftar di sistem
                                </CardDescription>
                            </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">
                            {teachers.length} Data
                        </Badge>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari nama, NIP, atau NUPTK..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 w-full"
                            />
                        </div>

                        {/* Position Filter */}
                        <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Jabatan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Jabatan</SelectItem>
                                <SelectItem value="teacher">Guru</SelectItem>
                                <SelectItem value="staff">Staff / TU</SelectItem>
                                <SelectItem value="headmaster">Kepala Sekolah</SelectItem>
                                <SelectItem value="vice_curriculum">Waka Kurikulum</SelectItem>
                                <SelectItem value="vice_student_affairs">Waka Kesiswaan</SelectItem>
                                <SelectItem value="coord_piket_ikhwan">Koord. Piket Ikhwan</SelectItem>
                                <SelectItem value="coord_piket_akhwat">Koord. Piket Akhwat</SelectItem>
                                <SelectItem value="admin_dapodik">TU & OPS Dapodik</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Status Filter */}
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                <SelectItem value="active">Aktif</SelectItem>
                                <SelectItem value="inactive">Nonaktif</SelectItem>
                                <SelectItem value="leave">Cuti</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="border-t border-slate-200 overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                                <tr>
                                    <th className="pl-4 pr-0 py-4 font-medium text-sm w-[40px]">
                                        <Checkbox 
                                            checked={filteredTeachers.length > 0 && selectedItems.length === filteredTeachers.length}
                                            onCheckedChange={toggleSelectAll}
                                        />
                                    </th>
                                    <th className="pl-3 pr-6 py-4 font-medium text-sm text-left">Nama & NIP</th>
                                    <th className="px-6 py-4 font-medium text-sm text-left">Jabatan</th>
                                    <th className="px-6 py-4 font-medium text-sm text-left">Kontak</th>
                                    <th className="px-6 py-4 font-medium text-sm text-center">Status</th>
                                    <th className="px-6 py-4 font-medium text-sm text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTeachers.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                                                    {searchTerm || selectedPosition !== 'all' ? (
                                                        <FilterX className="h-8 w-8 text-slate-300" />
                                                    ) : (
                                                        <FileX className="h-8 w-8 text-slate-300" />
                                                    )}
                                                </div>
                                                <p className="text-slate-500 font-medium">Data tidak ditemukan</p>
                                                <p className="text-slate-400 text-sm mt-1">Coba sesuaikan filter pencarian Anda</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredTeachers.map((teacher) => (
                                        <tr key={teacher.id} className={cn(
                                            "group transition-colors border-b border-slate-50",
                                            selectedItems.includes(teacher.id) ? "bg-blue-50/50" : "hover:bg-slate-50/60"
                                        )}>
                                            <td className="pl-4 pr-0 py-4">
                                                <Checkbox 
                                                    checked={selectedItems.includes(teacher.id)}
                                                    onCheckedChange={() => toggleSelectItem(teacher.id)}
                                                />
                                            </td>
                                            <td className="pl-3 pr-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9 border border-blue-200">
                                                        <AvatarImage src={teacher.profilePicture} />
                                                        <AvatarFallback className="bg-blue-100 text-blue-800 text-xs font-medium">
                                                            {teacher.name.substring(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium text-slate-900">{teacher.name}</p>
                                                        <p className="text-xs text-slate-500 font-mono mt-0.5">
                                                            NIP: {teacher.nip || '-'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {/* Employment Type Badge */}
                                                    <Badge className="bg-blue-800 text-white">
                                                        {employmentLabels[teacher.employmentType]}
                                                    </Badge>
                                                    {/* Structural Positions Badges */}
                                                    {teacher.structuralPositions?.map(pos => (
                                                        <Badge 
                                                            key={pos}
                                                            className="bg-blue-800 text-white"
                                                        >
                                                            {structuralLabels[pos]}
                                                        </Badge>
                                                    ))}
                                                    {/* Wali Kelas Badge */}
                                                    {teacher.homeroomClass && (
                                                        <Badge className="bg-blue-800 text-white">
                                                            Wali Kelas {teacher.homeroomClass.className}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs text-slate-600">{teacher.email}</span>
                                                    <span className="text-xs text-slate-500">{teacher.phoneNumber}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Badge 
                                                    variant="outline"
                                                    className={cn("text-xs font-medium", statusStyles[teacher.status])}
                                                >
                                                    {teacher.status === 'active' ? 'Aktif' : teacher.status === 'inactive' ? 'Nonaktif' : 'Cuti'}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100">
                                                            <Settings className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-40">
                                                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem 
                                                            onClick={() => router.push(`/admin/users/teachers/${teacher.id}`)}
                                                            className="cursor-pointer"
                                                        >
                                                            <Eye className="mr-2 h-4 w-4 text-blue-600" /> 
                                                            Lihat Detail
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            onClick={() => router.push(`/admin/users/teachers/${teacher.id}/edit`)}
                                                            className="cursor-pointer"
                                                        >
                                                            <Edit className="mr-2 h-4 w-4 text-amber-600" /> 
                                                            Edit Data
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem 
                                                            onClick={() => setDeleteId(teacher.id)}
                                                            className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" /> 
                                                            Hapus Data
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

            {/* Bulk Action Bar */}
            {selectedItems.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4">
                    <div className="bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 border border-slate-800">
                        <div className="flex items-center gap-2 pr-6 border-r border-slate-700">
                            <span className="h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                                {selectedItems.length}
                            </span>
                            <span className="text-sm font-medium text-slate-300">Data dipilih</span>
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

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteId || isBulkDelete} onOpenChange={(open) => !open && (setDeleteId(null), setIsBulkDelete(false))}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Data Guru?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. {isBulkDelete ? `${selectedItems.length} data guru` : 'Data guru ini'} akan dihapus permanen dari sistem.
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
