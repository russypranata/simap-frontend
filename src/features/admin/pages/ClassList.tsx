'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Plus,
    Search,
    MoreVertical,
    Edit,
    Trash2,
    Eye,
    School,
    Users,
    Calendar,
    FileX,
    FilterX,
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';

import { Class } from '../types/class';
import { AcademicYear } from '../types/academicYear';
import { classService } from '../services/classService';
import { academicYearService } from '../services/academicYearService';
import { ClassListSkeleton } from '../components/class';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export const ClassList: React.FC = () => {
    const router = useRouter();
    const [classes, setClasses] = useState<Class[]>([]);
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Filters
    const [selectedYear, setSelectedYear] = useState<string>(''); 
    const [selectedGrade, setSelectedGrade] = useState<string>('all');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Badge State
    const [activeYear, setActiveYear] = useState<string | null>(null);
    const [activeSemester, setActiveSemester] = useState<string | null>(null);

    // Selection State
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    
    // Delete Dialog State
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isBulkDelete, setIsBulkDelete] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setIsLoading(true);
                // Fetch classes and academic years in parallel
                const [classesData, yearsData] = await Promise.all([
                    classService.getClasses(),
                    academicYearService.getAcademicYears()
                ]);
                
                setClasses(classesData);
                setAcademicYears(yearsData);

                // Initialize Active Year Data
                const activeData = yearsData.find(y => y.isActive);
                if (activeData) {
                    setActiveYear(activeData.name);
                    const activeSem = activeData.semesters.find(s => s.isActive);
                    if (activeSem) {
                        setActiveSemester(activeSem.name);
                    }
                    
                    // Default filter to active year
                    setSelectedYear(activeData.id);
                } else if (yearsData.length > 0) {
                    setSelectedYear(yearsData[0].id); // Fallback
                }

            } catch (error) {
                console.error('Failed to fetch data:', error);
                toast.error('Gagal memuat data kelas');
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const handleDelete = async () => {
        if (!deleteId && !isBulkDelete) return;
        
        try {
            setIsDeleting(true);
            if (isBulkDelete) {
                await Promise.all(selectedItems.map(id => classService.deleteClass(id)));
                toast.success(`${selectedItems.length} kelas berhasil dihapus`);
                const classesData = await classService.getClasses();
                setClasses(classesData);
                setSelectedItems([]);
            } else if (deleteId) {
                await classService.deleteClass(deleteId);
                toast.success('Kelas berhasil dihapus');
                setClasses(prev => prev.filter(c => c.id !== deleteId));
                setSelectedItems(prev => prev.filter(id => id !== deleteId));
            }
        } catch (error) {
            console.error('Delete failed:', error);
            toast.error('Gagal menghapus data');
        } finally {
            setIsDeleting(false);
            setDeleteId(null);
            setIsBulkDelete(false);
        }
    };

    const toggleSelectAll = () => {
        if (selectedItems.length === filteredClasses.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(filteredClasses.map(c => c.id));
        }
    };

    const toggleSelectItem = (id: string) => {
        setSelectedItems(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleBulkDelete = () => {
        if (selectedItems.length === 0) return;
        setIsBulkDelete(true);
    };

    // Filter Logic
    const filteredClasses = classes.filter((cls) => {
        const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cls.homeroomTeacherName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGrade = selectedGrade === 'all' || cls.grade.toString() === selectedGrade;
        const matchesType = selectedType === 'all' || cls.type === selectedType;
        
        // Filter by Academic Year if one is selected
        const matchesYear = selectedYear ? cls.academicYearId === selectedYear : true;

        return matchesSearch && matchesGrade && matchesType && matchesYear;
    });

    if (isLoading) {
        return <ClassListSkeleton />;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Daftar{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Kelas
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <School className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Kelola data rombongan belajar dan wali kelas
                    </p>
                </div>
                <Button 
                    onClick={() => router.push('/admin/class/new')} 
                    className="bg-blue-800 hover:bg-blue-900 text-white shadow-md hover:shadow-lg transition-all"
                >
                    <Plus className="mr-2 h-4 w-4" /> Tambah Kelas
                </Button>
            </div>

            {/* Table Card */}
            <Card className="border-slate-200">
                <CardHeader className="pb-2">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-primary flex-shrink-0">
                                <School className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">Data Kelas</CardTitle>
                                <p className="text-sm text-muted-foreground">Total {filteredClasses.length} kelas ditampilkan</p>
                            </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Filter Academic Year */}
                            <Select
                                value={selectedYear}
                                onValueChange={setSelectedYear}
                            >
                                <SelectTrigger className="h-9 w-[180px]">
                                    <SelectValue placeholder="Tahun Ajaran" />
                                </SelectTrigger>
                                <SelectContent>
                                    {academicYears.map((year) => (
                                        <SelectItem key={year.id} value={year.id}>
                                            {year.name} {year.isActive && '(Aktif)'}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Filter Grade */}
                            <Select
                                value={selectedGrade}
                                onValueChange={setSelectedGrade}
                            >
                                <SelectTrigger className="h-9 w-[150px]">
                                    <SelectValue placeholder="Pilih Tingkat" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Tingkat</SelectItem>
                                    <SelectItem value="10">Kelas 10 (X)</SelectItem>
                                    <SelectItem value="11">Kelas 11 (XI)</SelectItem>
                                    <SelectItem value="12">Kelas 12 (XII)</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Filter Type */}
                            <Select
                                value={selectedType}
                                onValueChange={setSelectedType}
                            >
                                <SelectTrigger className="h-9 w-[150px]">
                                    <SelectValue placeholder="Tipe Kelas" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Tipe</SelectItem>
                                    <SelectItem value="REGULER">Reguler</SelectItem>
                                    <SelectItem value="PEMINATAN">Peminatan</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Search */}
                            <div className="relative w-full sm:w-[250px]">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Cari kelas..."
                                    className="pl-9 h-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider w-[50px]">
                                        <Checkbox 
                                            checked={filteredClasses.length > 0 && selectedItems.length === filteredClasses.length}
                                            onCheckedChange={toggleSelectAll}
                                        />
                                    </th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Nama Kelas</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-center">Tingkat</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-center">Tipe</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Wali Kelas</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Kapasitas</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 bg-white">
                                {filteredClasses.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                                                    {searchTerm ? (
                                                        <Search className="h-8 w-8 text-slate-300" />
                                                    ) : (
                                                        <FilterX className="h-8 w-8 text-slate-300" />
                                                    )}
                                                </div>
                                                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                                                    {searchTerm ? 'Tidak ada kelas ditemukan' : 'Belum ada data kelas'}
                                                </h3>
                                                <p className="text-slate-500 max-w-sm mx-auto mb-6">
                                                    {searchTerm 
                                                        ? `Tidak dapat menemukan kelas dengan kata kunci "${searchTerm}". Silakan coba kata kunci lain.`
                                                        : 'Belum ada data kelas yang ditambahkan untuk filter ini. Silakan buat kelas baru.'}
                                                </p>
                                                {searchTerm && (
                                                    <Button 
                                                        variant="outline" 
                                                        onClick={() => setSearchTerm('')}
                                                        className="text-slate-600 border-slate-200 hover:bg-slate-50"
                                                    >
                                                        Hapus Pencarian
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredClasses.map((item) => {
                                        const occupancyRate = (item.totalStudents / item.capacity) * 100;
                                        const isNearCapacity = occupancyRate >= 80 && occupancyRate < 100;
                                        const isFull = occupancyRate >= 100;

                                        return (
                                            <tr key={item.id} className={cn(
                                                "group transition-colors border-b border-slate-50",
                                                selectedItems.includes(item.id) ? "bg-blue-50/50" : "hover:bg-slate-50/60"
                                            )}>
                                                <td className="px-6 py-4">
                                                    <Checkbox 
                                                        checked={selectedItems.includes(item.id)}
                                                        onCheckedChange={() => toggleSelectItem(item.id)}
                                                    />
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <Badge variant="outline" className={cn(
                                                        "font-bold text-[10px] px-2 py-0 h-5",
                                                        item.type === 'REGULER' 
                                                            ? "bg-slate-50 text-slate-500 border-slate-200" 
                                                            : "bg-purple-50 text-purple-700 border-purple-200"
                                                    )}>
                                                        {item.type}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-semibold text-slate-900 text-base">{item.name}</p>
                                                            {item.type === 'PEMINATAN' && (
                                                                <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-100 px-2 py-0 h-5 text-[10px] font-bold uppercase tracking-tight">
                                                                    PEM {item.peminatanCategory}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 mt-0.5">
                                                            {item.type === 'PEMINATAN' && item.subjectName ? (
                                                                <span className="text-xs font-medium text-blue-600">Mapel: {item.subjectName}</span>
                                                            ) : (
                                                                <>
                                                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">ID:</span>
                                                                    <span className="text-xs text-slate-500 font-mono">{item.id}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <Badge variant="secondary" className="font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 border-0">
                                                        Kelas {item.grade}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.type === 'PEMINATAN' ? (
                                                        <span className="text-slate-300 font-mono">-</span>
                                                    ) : item.homeroomTeacherName ? (
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                                                                <Users className="h-4 w-4" />
                                                            </div>
                                                            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                                                                {item.homeroomTeacherName}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2 text-slate-400">
                                                            <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-200 border-dashed">
                                                                <Users className="h-4 w-4" />
                                                            </div>
                                                            <span className="text-sm italic">Belum diset</span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 min-w-[200px]">
                                                    <div className="space-y-1.5">
                                                        <div className="flex items-center justify-between text-xs">
                                                            <span className="font-medium text-slate-600">
                                                                {item.totalStudents} / {item.capacity} Siswa
                                                            </span>
                                                            <span className={cn(
                                                                "font-bold",
                                                                isFull ? "text-red-600" : isNearCapacity ? "text-amber-600" : "text-blue-600"
                                                            )}>
                                                                {Math.round(occupancyRate)}%
                                                            </span>
                                                        </div>
                                                        <Progress 
                                                            value={occupancyRate} 
                                                            className="h-1.5"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-[160px]">
                                                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => router.push(`/admin/class/${item.id}`)} className="cursor-pointer">
                                                                <Eye className="mr-2 h-4 w-4 text-blue-500" /> Detail
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => router.push(`/admin/class/${item.id}/edit`)} className="cursor-pointer">
                                                                <Edit className="mr-2 h-4 w-4 text-amber-500" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem 
                                                                onClick={() => setDeleteId(item.id)}
                                                                className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        );
                                    })
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
                            <span className="text-sm font-medium text-slate-300">Kelas dipilih</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-white hover:bg-slate-800 h-9"
                                onClick={handleBulkDelete}
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

            {/* Delete Confirmation Dialog */}
            <AlertDialog 
                open={!!deleteId || isBulkDelete} 
                onOpenChange={(open) => {
                    if (!open) {
                        setDeleteId(null);
                        setIsBulkDelete(false);
                    }
                }}
            >
                <AlertDialogContent className="max-w-[400px]">
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {isBulkDelete ? `Hapus ${selectedItems.length} Kelas?` : 'Hapus Data Kelas?'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Seluruh data terkait {isBulkDelete ? 'kelas-kelas terpilih' : 'kelas ini'} akan dihapus secara permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={(e) => {
                                e.preventDefault();
                                handleDelete();
                            }}
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
