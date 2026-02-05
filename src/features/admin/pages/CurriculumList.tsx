'use client';

import React, { useState } from 'react';
import {
    BookOpen,
    Search,
    Plus,
    Filter,
    MoreVertical,
    FileText,
} from 'lucide-react';
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
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MOCK_CURRICULUM } from '../data/mockCurriculumData';
import { Curriculum, CurriculumStatus } from '../types/curriculum';
import { CurriculumForm } from '../components/forms/CurriculumForm';
import { CurriculumFormValues } from '../schemas/curriculumSchema';
import { toast } from 'sonner';

const statusColors: Record<CurriculumStatus, string> = {
    active: 'bg-green-100 text-green-700 border-green-200',
    inactive: 'bg-slate-100 text-slate-700 border-slate-200',
    draft: 'bg-amber-100 text-amber-700 border-amber-200',
};

const statusLabels: Record<CurriculumStatus, string> = {
    active: 'Aktif',
    inactive: 'Tidak Aktif',
    draft: 'Draft',
};

export const CurriculumList: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState<Curriculum[]>(MOCK_CURRICULUM);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const filteredData = data.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreate = (values: CurriculumFormValues) => {
        const newItem: Curriculum = {
            id: `curr-${Date.now()}`,
            ...values,
            description: values.description || '',
            academicYearName: values.academicYearId === 'ay-2024-2025' ? '2024/2025' : '2025/2026',
            totalSubjects: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setData([newItem, ...data]);
        toast.success('Kurikulum berhasil ditambahkan');
    };

    const handleUpdate = (values: CurriculumFormValues) => {
        if (!editingId) return;
        setData(prev => prev.map(item =>
            item.id === editingId
                ? {
                    ...item,
                    ...values,
                    academicYearName: values.academicYearId === 'ay-2024-2025' ? '2024/2025' : '2025/2026',
                    updatedAt: new Date().toISOString()
                  }
                : item
        ));
        toast.success('Kurikulum berhasil diperbarui');
        setEditingId(null);
    };

    const handleDelete = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            setData(prev => prev.filter(item => item.id !== id));
            toast.success('Kurikulum berhasil dihapus');
        }
    };

    const openEdit = (item: Curriculum) => {
        setEditingId(item.id);
        setIsFormOpen(true);
    };

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
                                Kurikulum
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <BookOpen className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Kelola struktur kurikulum (K13/Merdeka) yang berlaku.
                    </p>
                </div>
                <Button
                    onClick={() => { setEditingId(null); setIsFormOpen(true); }}
                    className="bg-blue-800 hover:bg-blue-900 text-white shadow-md hover:shadow-lg transition-all"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Kurikulum
                </Button>
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-primary flex-shrink-0">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    Daftar Kurikulum
                                </CardTitle>
                                <CardDescription>
                                    Total {data.length} kurikulum terdaftar
                                </CardDescription>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari nama atau kode kurikulum..."
                                className="pl-9 w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" className="w-[100px]">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto border-t border-slate-200">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Nama Kurikulum</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Tahun Ajaran</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Total Mapel</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-center">Status</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                                                    <FileText className="h-8 w-8 text-slate-300" />
                                                </div>
                                                <p className="text-slate-500 font-medium">Data tidak ditemukan</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredData.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/60 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-900">{item.name}</div>
                                                <div className="text-xs text-slate-500 font-mono mt-0.5 bg-slate-100 w-fit px-1 rounded">{item.code}</div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {item.academicYearName}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                <span className="font-medium text-slate-900">{item.totalSubjects}</span> Mata Pelajaran
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Badge
                                                    variant="outline"
                                                    className={`uppercase text-[10px] tracking-wider font-semibold ${statusColors[item.status]}`}
                                                >
                                                    {statusLabels[item.status]}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreVertical className="h-4 w-4 text-slate-400" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => openEdit(item)}>Edit Struktur</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(item.id)}>Hapus</DropdownMenuItem>
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

            <CurriculumForm
                open={isFormOpen}
                onOpenChange={(open) => {
                    setIsFormOpen(open);
                    if (!open) setEditingId(null);
                }}
                initialData={editingId ? data.find(d => d.id === editingId) : null}
                onSubmit={editingId ? handleUpdate : handleCreate}
            />
        </div>
    );
};
