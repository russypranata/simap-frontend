'use client';

import React, { useState } from 'react';
import {
    UserPlus,
    Search,
    Filter,
    CheckCircle,
    XCircle,
    Clock,
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
import { MOCK_PPDB } from '../data/mockPPDBData';
import { PPDBStatus } from '../types/ppdb';

const statusColors: Record<PPDBStatus, string> = {
    pending: 'bg-slate-100 text-slate-700 border-slate-200',
    interview: 'bg-blue-100 text-blue-700 border-blue-200',
    accepted: 'bg-green-100 text-green-700 border-green-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
};

const statusLabels: Record<PPDBStatus, string> = {
    pending: 'Menunggu Verifikasi',
    interview: 'Wawancara',
    accepted: 'Diterima',
    rejected: 'Ditolak',
};

export const PPDBList: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = MOCK_PPDB.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.registrationNumber.includes(searchTerm)
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Penerimaan{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Siswa Baru
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <UserPlus className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Kelola pendaftaran siswa baru (PPDB) tahun ajaran mendatang.
                    </p>
                </div>
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-primary flex-shrink-0">
                                <UserPlus className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    Daftar Calon Siswa
                                </CardTitle>
                                <CardDescription>
                                    Total {MOCK_PPDB.length} pendaftar masuk
                                </CardDescription>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari nama atau No. Registrasi..."
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
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Nama & No. Reg</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Asal Sekolah</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Nilai Rata-rata</th>
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
                                                    <UserPlus className="h-8 w-8 text-slate-300" />
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
                                                <div className="text-xs text-slate-500 font-mono mt-0.5 bg-slate-100 w-fit px-1 rounded">{item.registrationNumber}</div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {item.previousSchool}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="outline" className="bg-white text-slate-700 font-medium border-slate-300">
                                                    {item.averageGrade}
                                                </Badge>
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
                                                <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 hover:text-blue-700">
                                                    Proses
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
