'use client';

import React, { useState } from 'react';
import {
    ArrowLeftRight,
    Search,
    Filter,
    ArrowRightCircle,
    ArrowLeftCircle,
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
import { MOCK_MUTATIONS } from '../data/mockMutationData';
import { MutationType, MutationStatus } from '../types/mutation';

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

    const filteredData = MOCK_MUTATIONS.filter((item) =>
        item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nisn.includes(searchTerm)
    );

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
                <Button className="bg-blue-800 hover:bg-blue-900 text-white shadow-md hover:shadow-lg transition-all">
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
                                    Total {MOCK_MUTATIONS.length} data mutasi
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
                    <div className="overflow-x-auto">
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
                                            Data tidak ditemukan
                                        </td>
                                    </tr>
                                ) : (
                                    filteredData.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-900">{item.studentName}</div>
                                                <div className="text-xs text-slate-500">{item.nisn}</div>
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
                                                    <span className="text-xs">Dari: <span className="font-medium">{item.schoolOrigin}</span></span>
                                                ) : (
                                                    <span className="text-xs">Ke: <span className="font-medium">{item.schoolDestination || '-'}</span></span>
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
                                                <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                                                    Detail
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
