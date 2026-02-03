'use client';

import React, { useState } from 'react';
import {
    Users,
    Search,
    Filter,
    MoreVertical,
    Phone,
    Mail,
    UserCircle,
    Download,
    Eye,
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
import { MOCK_PARENTS } from '../data/mockParentData';
import { Parent } from '../types/parent';
import { ParentForm } from '../components/forms/ParentForm';
import { ParentFormValues } from '../schemas/parentSchema';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-700 border-green-200',
    inactive: 'bg-slate-100 text-slate-700 border-slate-200',
};

const statusLabels: Record<string, string> = {
    active: 'Aktif',
    inactive: 'Tidak Aktif',
};

export const ParentList: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState<Parent[]>(MOCK_PARENTS);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const filteredData = data.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.children.some(child => child.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleCreate = (values: ParentFormValues) => {
        const newItem: Parent = {
            id: `par-${Date.now()}`,
            ...values,
            children: [], // Defaults to no children, needs linking logic separately
        };
        setData([newItem, ...data]);
        toast.success('Wali murid berhasil ditambahkan');
    };

    const handleUpdate = (values: ParentFormValues) => {
        if (!editingId) return;
        setData(prev => prev.map(item => item.id === editingId ? { ...item, ...values } : item));
        toast.success('Data wali murid diperbarui');
        setEditingId(null);
    };

    const handleDelete = (id: string) => {
        if (confirm('Hapus data wali murid ini?')) {
            setData(prev => prev.filter(item => item.id !== id));
            toast.success('Wali murid dihapus');
        }
    };

    const openEdit = (item: Parent) => {
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
                                Wali Murid
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Users className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Kelola akun dan data orang tua / wali murid.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                    <Button
                        onClick={() => { setEditingId(null); setIsFormOpen(true); }}
                        className="bg-blue-800 hover:bg-blue-900 text-white shadow-md hover:shadow-lg transition-all"
                    >
                        Tambah Wali Murid
                    </Button>
                </div>
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-primary flex-shrink-0">
                                <UserCircle className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    Daftar Wali Murid
                                </CardTitle>
                                <CardDescription>
                                    Total {data.length} orang tua terdaftar
                                </CardDescription>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari nama orang tua atau siswa..."
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
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Nama Orang Tua</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Siswa (Anak)</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Kontak</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Pekerjaan</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-center">Status Akun</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                            Data tidak ditemukan
                                        </td>
                                    </tr>
                                ) : (
                                    filteredData.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-900">{item.name}</div>
                                                <div className="text-xs text-slate-500 mt-0.5 max-w-[200px] truncate">{item.address}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    {item.children.length > 0 ? item.children.map((child) => (
                                                        <div key={child.id} className="flex items-center gap-1.5">
                                                            <div className="h-1.5 w-1.5 rounded-full bg-blue-400"></div>
                                                            <span className="text-slate-700 font-medium text-xs">
                                                                {child.name}
                                                            </span>
                                                            <Badge variant="outline" className="text-[10px] h-4 px-1 py-0 border-slate-200 text-slate-500">
                                                                {child.className}
                                                            </Badge>
                                                        </div>
                                                    )) : (
                                                        <span className="text-xs text-slate-400 italic">Belum ada siswa</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1 text-slate-600 text-xs">
                                                    <div className="flex items-center gap-1.5">
                                                        <Mail className="h-3 w-3 text-slate-400" />
                                                        {item.email}
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Phone className="h-3 w-3 text-slate-400" />
                                                        {item.phone}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {item.occupation}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Badge
                                                    variant="outline"
                                                    className={`uppercase text-[10px] tracking-wider font-semibold ${statusColors[item.status]}`}
                                                >
                                                    {statusLabels[item.status]}
                                                </Badge>
                                                {item.lastLogin && (
                                                    <div className="text-[10px] text-slate-400 mt-1">
                                                        Login: {new Date(item.lastLogin).toLocaleDateString('id-ID')}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => openEdit(item)}>
                                                            Edit Profil
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(item.id)}>Nonaktifkan Akun</DropdownMenuItem>
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

            <ParentForm
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
