'use client';

import React, { useState } from 'react';
import {
    ArrowLeftRight,
    Search,
    Filter,
    ArrowRightCircle,
    ArrowLeftCircle,
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
import { MOCK_MUTATIONS } from '../data/mockMutationData';
import { MutationType, MutationStatus, StudentMutation } from '../types/mutation';
import { MutationForm } from '../components/forms/MutationForm';
import { MutationFormValues } from '../schemas/mutationSchema';
import { toast } from 'sonner';

const typeIcons: Record<MutationType, React.ReactNode> = {
    in: <ArrowRightCircle className="h-4 w-4 text-green-600" />,
    out: <ArrowLeftCircle className="h-4 w-4 text-red-600" />,
};

const typeLabels: Record<MutationType, string> = {
    in: 'Masuk',
    out: 'Keluar',
};

const statusColors: Record<MutationStatus, string> = {
    approved: 'bg-green-100 text-green-700 border-green-200',
    pending: 'bg-slate-100 text-slate-700 border-slate-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
};

export const MutationList: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState<StudentMutation[]>(MOCK_MUTATIONS);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const filteredData = data.filter((item) =>
        item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nisn.includes(searchTerm)
    );

    const handleCreate = (values: MutationFormValues) => {
        const newItem: StudentMutation = {
            id: `mut-${Date.now()}`,
            ...values,
        };
        setData([newItem, ...data]);
        toast.success('Data mutasi berhasil ditambahkan');
        setIsFormOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('Hapus data mutasi ini?')) {
            setData(prev => prev.filter(item => item.id !== id));
            toast.success('Data mutasi dihapus');
        }
    };

    const handleApprove = (id: string) => {
        setData(prev => prev.map(item => item.id === id ? { ...item, status: 'approved' } : item));
        toast.success('Mutasi disetujui');
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Mutasi{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Siswa
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <ArrowLeftRight className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Riwayat perpindahan siswa masuk dan keluar (Mutasi).
                    </p>
                </div>
                <Button
                    onClick={() => setIsFormOpen(true)}
                    className="bg-blue-800 hover:bg-blue-900 text-white shadow-md hover:shadow-lg transition-all"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Input Mutasi Baru
                </Button>
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-primary flex-shrink-0">
                                <ArrowLeftRight className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    Daftar Mutasi
                                </CardTitle>
                                <CardDescription>
                                    Total {data.length} data mutasi
                                </CardDescription>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari siswa atau NISN..."
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
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Siswa</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Jenis Mutasi</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Asal / Tujuan</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Tanggal</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-center">Status</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                                                    <ArrowLeftRight className="h-8 w-8 text-slate-300" />
                                                </div>
                                                <p className="text-slate-500 font-medium">Data tidak ditemukan</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredData.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/60 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-900">{item.studentName}</div>
                                                <div className="text-xs text-slate-500 mt-0.5 bg-slate-100 w-fit px-1 rounded">{item.nisn}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {typeIcons[item.type]}
                                                    <span className="font-medium capitalize text-slate-700">
                                                        {typeLabels[item.type]}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {item.type === 'in' ? (
                                                    <span className="text-xs">Dari: <span className="font-medium text-slate-900">{item.schoolOrigin}</span></span>
                                                ) : (
                                                    <span className="text-xs">Ke: <span className="font-medium text-slate-900">{item.schoolDestination || '-'}</span></span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {new Date(item.date).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Badge
                                                    variant="outline"
                                                    className={`uppercase text-[10px] tracking-wider font-semibold ${statusColors[item.status]}`}
                                                >
                                                    {item.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        {item.status === 'pending' && (
                                                            <DropdownMenuItem onClick={() => handleApprove(item.id)} className="text-green-600">
                                                                Setujui Mutasi
                                                            </DropdownMenuItem>
                                                        )}
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

            <MutationForm
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                onSubmit={handleCreate}
            />
        </div>
    );
};
