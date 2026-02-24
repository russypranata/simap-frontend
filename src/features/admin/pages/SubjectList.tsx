'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Plus,
    Search,
    Settings,
    Edit,
    Trash2,
    Eye,
    BookOpen,
    FileX,
    FilterX,
    Users,
    Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

import { Subject, SubjectCategory } from '../types/subject';
import { subjectService } from '../services/subjectService';
import { academicYearService } from '../services/academicYearService';
import { SubjectListSkeleton } from '../components/subject';
import { AcademicYear } from '../types/academicYear';

// Category badge color mapping
const categoryColors: Record<SubjectCategory, { bg: string; text: string; border: string }> = {
    UMUM: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
    AGAMA: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
    KEJURUAN: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
    EKSKUL: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
};

// Helper to format category for display
const formatCategory = (cat: SubjectCategory) => {
    const mapping: Record<SubjectCategory, string> = {
        UMUM: 'Umum',
        AGAMA: 'Agama',
        KEJURUAN: 'Kejuruan',
        EKSKUL: 'Muatan Lokal'
    };
    return mapping[cat] || cat;
};

export const SubjectList: React.FC = () => {
    const router = useRouter();
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [selectedGrade, setSelectedGrade] = useState<string>('all');

    // State for Header Badges
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
                const [subjectsData, yearsData] = await Promise.all([
                    subjectService.getSubjects(),
                    academicYearService.getAcademicYears()
                ]);
                
                setSubjects(subjectsData);
                
                // Set Header Badge Data
                const activeData = yearsData.find((y: AcademicYear) => y.isActive);
                if (activeData) {
                    setActiveYear(activeData.name);
                    const activeSem = activeData.semesters.find((s: any) => s.isActive);
                    if (activeSem) {
                        setActiveSemester(activeSem.name);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
                toast.error('Gagal memuat data');
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
                await Promise.all(selectedItems.map(id => subjectService.deleteSubject(id)));
                toast.success(`${selectedItems.length} mata pelajaran berhasil dihapus`);
                const data = await subjectService.getSubjects();
                setSubjects(data);
                setSelectedItems([]);
            } else if (deleteId) {
                await subjectService.deleteSubject(deleteId);
                toast.success('Mata pelajaran berhasil dihapus');
                setSubjects(prev => prev.filter(s => s.id !== deleteId));
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
        if (selectedItems.length === filteredSubjects.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(filteredSubjects.map(s => s.id));
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
    const filteredSubjects = subjects.filter(subject => {
        const matchesSearch = 
            subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            subject.code.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || subject.category === selectedCategory;
        const matchesType = selectedType === 'all' || subject.type === selectedType;
        const matchesGrade = selectedGrade === 'all' || (subject.gradeLevel && subject.gradeLevel.includes(selectedGrade));
        
        return matchesSearch && matchesCategory && matchesType && matchesGrade;
    });

    if (isLoading) {
        return <SubjectListSkeleton />;
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Daftar{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Mata Pelajaran
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <BookOpen className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Kelola kurikulum dan pembagian guru pengampu
                    </p>
                </div>
                <Button 
                    onClick={() => router.push('/admin/subject/new')}
                    className="bg-blue-800 hover:bg-blue-900 text-white shadow-md hover:shadow-lg transition-all"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Mapel
                </Button>
            </div>

            {/* Content Card */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-4 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-primary flex-shrink-0">
                                <BookOpen className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    Data Mata Pelajaran
                                </CardTitle>
                                <CardDescription>
                                    Total {subjects.length} mata pelajaran terdaftar
                                </CardDescription>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari nama atau kode..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 w-full"
                            />
                        </div>

                        {/* Filters Container */}
                        <div className="flex flex-wrap gap-3">
                            {/* Type Filter */}
                            <Select value={selectedType} onValueChange={setSelectedType}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Tipe" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Tipe</SelectItem>
                                    <SelectItem value="WAJIB">Wajib</SelectItem>
                                    <SelectItem value="PEMINATAN">Peminatan</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Grade Filter */}
                            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Tingkat" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Kelas</SelectItem>
                                    <SelectItem value="10">Kelas 10</SelectItem>
                                    <SelectItem value="11">Kelas 11</SelectItem>
                                    <SelectItem value="12">Kelas 12</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Category Filter */}
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Kategori</SelectItem>
                                    <SelectItem value="UMUM">Wajib</SelectItem>
                                    <SelectItem value="AGAMA">Agama</SelectItem>
                                    <SelectItem value="KEJURUAN">Kejuruan</SelectItem>
                                    <SelectItem value="EKSKUL">Ekstrakurikuler</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="border-t border-slate-200 overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                                <tr>
                                    <th className="pl-4 pr-0 py-4 font-semibold text-xs uppercase tracking-wider w-[40px]">
                                        <Checkbox 
                                            checked={filteredSubjects.length > 0 && selectedItems.length === filteredSubjects.length}
                                            onCheckedChange={toggleSelectAll}
                                        />
                                    </th>
                                    <th className="pl-3 pr-6 py-4 font-semibold text-xs uppercase tracking-wider">Mata Pelajaran</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-center">Tipe</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Tingkat</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-center">Kategori</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Pengampu</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSubjects.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                                                    {searchTerm || selectedCategory !== 'all' ? (
                                                        <FilterX className="h-8 w-8 text-slate-300" />
                                                    ) : (
                                                        <FileX className="h-8 w-8 text-slate-300" />
                                                    )}
                                                </div>
                                                <p className="text-slate-500 font-medium">
                                                    {searchTerm || selectedCategory !== 'all'
                                                        ? 'Tidak ada hasil yang cocok'
                                                        : 'Belum ada mata pelajaran'}
                                                </p>
                                                <p className="text-slate-400 text-sm mt-1">
                                                    {searchTerm || selectedCategory !== 'all'
                                                        ? 'Coba ubah filter pencarian'
                                                        : 'Klik tombol "Tambah Mapel" untuk menambahkan'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredSubjects.map((item) => {
                                        const colors = categoryColors[item.category];
                                        return (
                                            <tr key={item.id} className={cn(
                                                "group transition-colors border-b border-slate-50",
                                                selectedItems.includes(item.id) ? "bg-blue-50/50" : "hover:bg-slate-50/60"
                                            )}>
                                                <td className="pl-4 pr-0 py-4">
                                                    <Checkbox 
                                                        checked={selectedItems.includes(item.id)}
                                                        onCheckedChange={() => toggleSelectItem(item.id)}
                                                    />
                                                </td>
                                                <td className="pl-3 pr-6 py-4">
                                                    <div className="flex flex-col">
                                                        <p className="font-semibold text-slate-900 text-sm">{item.name}</p>
                                                        <div className="flex items-center gap-1.5 mt-0.5">
                                                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">KODE:</span>
                                                            <span className="text-xs text-slate-500 font-mono">{item.code}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex flex-col items-center gap-1">
                                                        <Badge 
                                                            variant="outline" 
                                                            className={cn(
                                                                "text-[11px] px-2.5 py-0.5 font-medium border tracking-tight shadow-sm",
                                                                item.type === 'WAJIB' 
                                                                    ? "bg-blue-50 text-blue-800 border-blue-200" 
                                                                    : "bg-amber-50 text-amber-600 border-amber-200"
                                                            )}
                                                        >
                                                            {item.type === 'WAJIB' ? 'Wajib' : 'Peminatan'}
                                                        </Badge>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-1 flex-wrap">
                                                        {item.gradeLevel && item.gradeLevel.length > 0 ? (
                                                            item.gradeLevel.sort().map(level => (
                                                                <Badge key={level} variant="outline" className="text-[10px] h-5 px-1.5 bg-slate-50 text-slate-600 border-slate-200">
                                                                    {level}
                                                                </Badge>
                                                            ))
                                                        ) : (
                                                            <span className="text-xs text-slate-400 italic">-</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <p className="font-medium text-slate-600 text-xs">
                                                        {formatCategory(item.category)}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.teacherNames && item.teacherNames.length > 0 ? (
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                                                                <Users className="h-4 w-4" />
                                                            </div>
                                                            <span className="text-sm font-semibold text-slate-900">
                                                                {item.teacherNames.join(', ')}
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
                                                <td className="px-6 py-4 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors">
                                                                <Settings className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-[160px]">
                                                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => router.push(`/admin/subject/${item.id}`)} className="cursor-pointer">
                                                                <Eye className="mr-2 h-4 w-4 text-blue-500" /> Detail
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => router.push(`/admin/subject/${item.id}/edit`)} className="cursor-pointer">
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
                            <span className="text-sm font-medium text-slate-300">Mapel dipilih</span>
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
                            {isBulkDelete ? `Hapus ${selectedItems.length} Mata Pelajaran?` : 'Hapus Mata Pelajaran?'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Seluruh data terkait {isBulkDelete ? 'mata pelajaran terpilih' : 'mata pelajaran ini'} akan dihapus secara permanen.
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
