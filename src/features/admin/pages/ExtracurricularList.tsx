'use client';

import React, { useState, useEffect } from 'react';
import { 
    Plus, 
    Search, 
    Award, 
    Users, 
    Calendar, 
    MapPin, 
    MoreVertical, 
    Edit, 
    Trash2,
    Filter,
    Construction
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
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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

const categoryColors: Record<ExtracurricularCategory, string> = {
    'Olahraga': 'bg-orange-100 text-orange-700 border-orange-200',
    'Seni': 'bg-pink-100 text-pink-700 border-pink-200',
    'Akademik': 'bg-blue-100 text-blue-700 border-blue-200',
    'Keagamaan': 'bg-green-100 text-green-700 border-green-200',
    'Lainnya': 'bg-slate-100 text-slate-700 border-slate-200',
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

    const handleDelete = async (id: string) => {
        try {
            await extracurricularService.delete(id);
            setExtracurriculars(prev => prev.filter(e => e.id !== id));
            toast.success('Ekstrakurikuler berhasil dihapus');
        } catch (error) {
            toast.error('Gagal menghapus data');
        }
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
                                Data{' '}
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
                    className="bg-blue-800 hover:bg-blue-900 text-white shadow-md active:scale-95 transition-transform"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Ekskul
                </Button>
            </div>

            <Card className="border-slate-200">
                <CardHeader className="pb-3 pt-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari nama ekskul atau pembina..."
                                className="pl-9"
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
                <CardContent className="p-6">
                    {filteredData.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="bg-slate-100 p-4 rounded-full mb-4">
                                <Award className="h-10 w-10 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800">Tidak ada data ditemukan</h3>
                            <p className="text-slate-500 max-w-xs mx-auto mt-2">
                                Silakan gunakan kata kunci lain atau tambahkan data ekstrakurikuler baru.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredData.map((item) => (
                                <Card key={item.id} className="group hover:shadow-lg transition-all border-slate-200 overflow-hidden flex flex-col">
                                    <div className={cn(
                                        "h-2 w-full",
                                        item.category === 'Olahraga' ? "bg-orange-500" :
                                        item.category === 'Seni' ? "bg-pink-500" :
                                        item.category === 'Akademik' ? "bg-blue-500" :
                                        item.category === 'Keagamaan' ? "bg-green-500" : "bg-slate-400"
                                    )} />
                                    <CardHeader className="pb-2 relative">
                                        <div className="flex justify-between items-start">
                                            <Badge variant="outline" className={cn("mb-2 font-semibold", categoryColors[item.category])}>
                                                {item.category}
                                            </Badge>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                                                        <MoreVertical className="h-4 w-4 text-slate-400" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-40">
                                                    <DropdownMenuItem 
                                                        className="cursor-pointer"
                                                        onClick={() => handleEdit(item)}
                                                    >
                                                        <Edit className="h-4 w-4 mr-2 text-amber-500" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem 
                                                        className="text-red-600 cursor-pointer"
                                                        onClick={() => handleDelete(item.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" /> Hapus
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <CardTitle className="text-xl group-hover:text-blue-800 transition-colors uppercase tracking-tight">
                                            {item.name}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4 flex-grow">
                                        {/* Capacity Indicator */}
                                        <div className="space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-slate-500 font-medium tracking-tight uppercase">Siswa Terdaftar</span>
                                                <span className={cn(
                                                    "font-bold",
                                                    item.currentCapacity >= item.maxCapacity ? "text-red-600" : "text-blue-800"
                                                )}>
                                                    {item.currentCapacity} / {item.maxCapacity}
                                                </span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                                                <div 
                                                    className={cn(
                                                        "h-full transition-all duration-500",
                                                        (item.currentCapacity / item.maxCapacity) >= 1 ? "bg-red-500" :
                                                        (item.currentCapacity / item.maxCapacity) >= 0.8 ? "bg-amber-500" : "bg-blue-600"
                                                    )}
                                                    style={{ width: `${Math.min((item.currentCapacity / item.maxCapacity) * 100, 100)}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2.5">
                                            <div className="flex items-center gap-2.5 text-sm text-slate-600">
                                                <Users className="h-4 w-4 text-slate-400 shrink-0" />
                                                <span className="font-semibold">{item.mentorName}</span>
                                            </div>
                                            <div className="flex items-center gap-2.5 text-sm text-slate-500">
                                                <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                                                <span>{item.day}, {item.time}</span>
                                            </div>
                                            <div className="flex items-center gap-2.5 text-sm text-slate-500">
                                                <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                                                <span className="truncate">{item.location || 'Lokasi belum diatur'}</span>
                                            </div>
                                        </div>

                                        {item.description && (
                                            <p className="text-sm text-slate-500 line-clamp-2 italic bg-white p-2 rounded border border-slate-100">
                                                "{item.description}"
                                            </p>
                                        )}
                                    </CardContent>
                                    <CardFooter className="pt-0 border-t border-slate-50 bg-slate-50/50 mt-auto">
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="w-full text-blue-800 hover:text-blue-900 hover:bg-white font-semibold transition-all"
                                            onClick={() => router.push(`/admin/extracurricular/members?id=${item.id}`)}
                                        >
                                            Kelola Anggota
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

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
