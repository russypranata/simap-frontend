'use client';

import React, { useState } from 'react';
import {
    Award,
    Search,
    Filter,
    Download,
    GraduationCap,
    MoreVertical,
    Plus,
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
import { MOCK_ALUMNI } from '../data/mockAlumniData';
import { Alumni } from '../types/alumni';
import { AlumniForm } from '../components/forms/AlumniForm';
import { AlumniFormValues } from '../schemas/alumniSchema';
import { toast } from 'sonner';

export const AlumniList: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState<Alumni[]>(MOCK_ALUMNI);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const filteredData = data.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreate = (values: AlumniFormValues) => {
        const newItem: Alumni = {
            id: `alum-${Date.now()}`,
            ...values,
        };
        setData([newItem, ...data]);
        toast.success('Data alumni berhasil ditambahkan');
    };

    const handleUpdate = (values: AlumniFormValues) => {
        if (!editingId) return;
        setData(prev => prev.map(item => item.id === editingId ? { ...item, ...values } : item));
        toast.success('Data alumni diperbarui');
        setEditingId(null);
    };

    const handleDelete = (id: string) => {
        if (confirm('Hapus data alumni ini?')) {
            setData(prev => prev.filter(item => item.id !== id));
            toast.success('Data alumni dihapus');
        }
    };

    const openEdit = (item: Alumni) => {
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
                                Alumni
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Award className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Arsip data siswa yang telah lulus (Alumni).
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                    </Button>
                    <Button
                        onClick={() => { setEditingId(null); setIsFormOpen(true); }}
                        className="bg-blue-800 hover:bg-blue-900 text-white shadow-md hover:shadow-lg transition-all"
                    >
                         <Plus className="h-4 w-4 mr-2" />
                        Tambah Alumni
                    </Button>
                </div>
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-primary flex-shrink-0">
                                <GraduationCap className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    Daftar Alumni
                                </CardTitle>
                                <CardDescription>
                                    Total {data.length} alumni terdata
                                </CardDescription>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari nama alumni..."
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
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Nama & NISN</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Tahun Lulus</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Kelas Terakhir</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Karir / Studi Lanjut</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                                                    <GraduationCap className="h-8 w-8 text-slate-300" />
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
                                                <div className="text-xs text-slate-500 mt-0.5 bg-slate-100 w-fit px-1 rounded">{item.nisn}</div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                <Badge variant="outline" className="bg-white text-slate-700 font-normal">
                                                    {item.graduationYear}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {item.className}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 italic">
                                                {item.university || item.job || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => openEdit(item)}>Edit Data</DropdownMenuItem>
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

            <AlumniForm
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
