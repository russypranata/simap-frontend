'use client';

import React, { useState, useEffect } from 'react';
import { 
    Plus, 
    Search, 
    Award, 
    Users, 
    Calendar, 
    MapPin, 
    Settings,
    Edit, 
    Trash2,
    Filter,
    FileX,
    FilterX,
    MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
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
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { 
    Extracurricular, 
    ExtracurricularCategory 
} from '../types/extracurricular';
import { extracurricularService } from '../services/extracurricularService';
import { ExtracurricularForm } from '../components/forms/ExtracurricularForm';
import { ExtracurricularFormValues } from '../schemas/extracurricularSchema';
import { cn } from '@/lib/utils';
import { useAcademicYear } from '@/context/AcademicYearContext';
import { ExtracurricularListSkeleton } from '../components/extracurricular';

const categoryColors: Record<ExtracurricularCategory, { bg: string; text: string; border: string }> = {
    'Olahraga': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    'Seni': { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
    'Akademik': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    'Keagamaan': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    'Lainnya': { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
};

export const ExtracurricularList: React.FC = () => {
    const { academicYear: activeYearCtx } = useAcademicYear();
    const [extracurriculars, setExtracurriculars] = useState<Extracurricular[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [yearFilter, setYearFilter] = useState<string>(activeYearCtx.academicYear);
    const router = useRouter();

    // Form State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Extracurricular | undefined>(undefined);

    // Selection & Delete State
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isBulkDelete, setIsBulkDelete] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const data = await extracurricularService.getAll();
            setExtracurriculars(data);
        } catch (error) {
            toast.error('Gagal mengambil data ekstrakurikuler');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingItem(undefined);
        setIsFormOpen(true);
    };

    const handleEdit = (item: Extracurricular) => {
        setEditingItem(item);
        setIsFormOpen(true);
    };

    const handleFormSubmit = async (values: ExtracurricularFormValues) => {
        try {
            if (editingItem) {
                await extracurricularService.updateExtracurricular(editingItem.id, values);
                toast.success('Ekstrakurikuler berhasil diperbarui');
            } else {
                await extracurricularService.createExtracurricular(values);
                toast.success('Ekstrakurikuler berhasil ditambahkan');
            }
            fetchData();
        } catch (error) {
            toast.error('Gagal menyimpan data');
            throw error;
        }
    };

    const handleDelete = async () => {
        if (!deleteId && !isBulkDelete) return;

        try {
            setIsDeleting(true);
            if (isBulkDelete) {
                // Mock bulk delete as service doesn't have it yet, or use Promise.all
                await Promise.all(selectedItems.map(id => extracurricularService.delete(id)));
                toast.success(`${selectedItems.length} ekstrakurikuler berhasil dihapus`);
                setExtracurriculars(prev => prev.filter(e => !selectedItems.includes(e.id)));
                setSelectedItems([]);
            } else if (deleteId) {
                await extracurricularService.delete(deleteId);
                setExtracurriculars(prev => prev.filter(e => e.id !== deleteId));
                toast.success('Ekstrakurikuler berhasil dihapus');
            }
        } catch (error) {
            toast.error('Gagal menghapus data');
        } finally {
            setIsDeleting(false);
            setDeleteId(null);
            setIsBulkDelete(false);
        }
    };

    const toggleSelectAll = () => {
        if (selectedItems.length === filteredData.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(filteredData.map(s => s.id));
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

    const filteredData = extracurriculars.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.mentorName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
        const matchesYear = item.academicYearId === yearFilter;
        return matchesSearch && matchesCategory && matchesYear;
    });

    if (isLoading) {
        return <ExtracurricularListSkeleton />;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Daftar{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Ekstrakurikuler
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Award className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Kelola kegiatan ekstrakurikuler, pembina, dan jadwal pelaksanaannya.
                    </p>
                </div>
                <Button 
                    onClick={handleCreate}
                    className="bg-blue-800 hover:bg-blue-900 text-white shadow-md hover:shadow-lg transition-all"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Ekskul
                </Button>
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-4 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-primary flex-shrink-0">
                                <Award className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    Data Ekstrakurikuler
                                </CardTitle>
                                <CardDescription>
                                    Total {extracurriculars.length} kegiatan terdaftar
                                </CardDescription>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari nama ekskul atau pembina..."
                                className="pl-9 w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={yearFilter} onValueChange={setYearFilter}>
                            <SelectTrigger className="w-full sm:w-[150px]">
                                <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                                <SelectValue placeholder="Tahun Ajaran" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="2025/2026">2025/2026</SelectItem>
                                <SelectItem value="2024/2025">2024/2025</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <Filter className="h-4 w-4 mr-2 text-slate-400" />
                                <SelectValue placeholder="Semua Kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Kategori</SelectItem>
                                <SelectItem value="Olahraga">Olahraga</SelectItem>
                                <SelectItem value="Seni">Seni</SelectItem>
                                <SelectItem value="Akademik">Akademik</SelectItem>
                                <SelectItem value="Keagamaan">Keagamaan</SelectItem>
                                <SelectItem value="Lainnya">Lainnya</SelectItem>
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
                                            checked={filteredData.length > 0 && selectedItems.length === filteredData.length}
                                            onCheckedChange={toggleSelectAll}
                                        />
                                    </th>
                                    <th className="pl-3 pr-6 py-4 font-semibold text-xs uppercase tracking-wider">Ekstrakurikuler</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Pembina</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Jadwal</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Lokasi</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Kapasitas</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                                                    {searchTerm || categoryFilter !== 'all' ? (
                                                        <FilterX className="h-8 w-8 text-slate-300" />
                                                    ) : (
                                                        <FileX className="h-8 w-8 text-slate-300" />
                                                    )}
                                                </div>
                                                <p className="text-slate-500 font-medium">
                                                    {searchTerm || categoryFilter !== 'all'
                                                        ? 'Tidak ada hasil yang cocok'
                                                        : 'Belum ada data ekstrakurikuler'}
                                                </p>
                                                <p className="text-slate-400 text-sm mt-1">
                                                    {searchTerm || categoryFilter !== 'all'
                                                        ? 'Coba ubah filter pencarian'
                                                        : 'Klik tombol "Tambah Ekskul" untuk menambahkan'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredData.map((item) => {
                                        const colors = categoryColors[item.category] || categoryColors['Lainnya'];
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
                                                        <div className="flex items-center gap-1.5 mt-1">
                                                            <Badge
                                                                variant="outline"
                                                                className={cn(
                                                                    "text-[10px] px-1.5 py-0 font-medium border tracking-tight shadow-sm",
                                                                    colors.bg, colors.text, colors.border
                                                                )}
                                                            >
                                                                {item.category}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 border border-slate-200">
                                                            <Users className="h-3.5 w-3.5" />
                                                        </div>
                                                        <span className="text-sm font-medium text-slate-700">{item.mentorName}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col text-sm text-slate-600">
                                                        <span className="font-medium flex items-center gap-1.5">
                                                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                                            {item.day}
                                                        </span>
                                                        <span className="text-slate-500 text-xs ml-5">{item.time}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                                        <span className="truncate max-w-[150px]">{item.location || '-'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="w-[120px] space-y-1">
                                                        <div className="flex justify-between text-xs">
                                                            <span className="text-slate-500 font-medium">{item.currentCapacity} Siswa</span>
                                                            <span className="text-slate-400">/ {item.maxCapacity}</span>
                                                        </div>
                                                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                            <div
                                                                className={cn(
                                                                    "h-full rounded-full transition-all",
                                                                    (item.currentCapacity / item.maxCapacity) >= 1 ? "bg-red-500" :
                                                                    (item.currentCapacity / item.maxCapacity) >= 0.8 ? "bg-amber-500" : "bg-blue-600"
                                                                )}
                                                                style={{ width: `${Math.min((item.currentCapacity / item.maxCapacity) * 100, 100)}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors">
                                                                <Settings className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-[180px]">
                                                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => router.push(`/admin/extracurricular/members?id=${item.id}`)} className="cursor-pointer">
                                                                <Users className="mr-2 h-4 w-4 text-blue-500" /> Anggota
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleEdit(item)} className="cursor-pointer">
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
                            <span className="text-sm font-medium text-slate-300">Item dipilih</span>
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
                            {isBulkDelete ? `Hapus ${selectedItems.length} Ekstrakurikuler?` : 'Hapus Ekstrakurikuler?'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Seluruh data terkait {isBulkDelete ? 'item terpilih' : 'ekstrakurikuler ini'} akan dihapus secara permanen.
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

            {/* Form Dialog */}
            <ExtracurricularForm 
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                onSubmit={handleFormSubmit}
                initialData={editingItem}
                title={editingItem ? 'Edit Ekstrakurikuler' : 'Tambah Ekstrakurikuler'}
            />
        </div>
    );
};
