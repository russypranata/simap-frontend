'use client';

import React, { useState } from 'react';
import {
    UserCheck,
    Search,
    Edit,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MOCK_HOMEROOM_CLASSES } from '../data/mockHomeroomData';

export const HomeroomList: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = MOCK_HOMEROOM_CLASSES.filter((item) =>
        item.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.homeroomTeacherName && item.homeroomTeacherName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Wali{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Kelas
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <UserCheck className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Atur penugasan wali kelas untuk setiap rombongan belajar.
                    </p>
                </div>
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-primary flex-shrink-0">
                                <UserCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    Daftar Wali Kelas
                                </CardTitle>
                                <CardDescription>
                                    Tahun Ajaran 2024/2025
                                </CardDescription>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari kelas atau nama guru..."
                                className="pl-9 w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto border-t border-slate-200">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Kelas</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Wali Kelas</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Total Siswa</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                                                    <UserCheck className="h-8 w-8 text-slate-300" />
                                                </div>
                                                <p className="text-slate-500 font-medium">Data tidak ditemukan</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredData.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/60 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-lg text-slate-900 bg-slate-100 w-12 h-12 flex items-center justify-center rounded-lg border border-slate-200">
                                                    {item.className}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.homeroomTeacherName ? (
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                                                            {item.homeroomTeacherName.substring(0, 2).toUpperCase()}
                                                        </div>
                                                        <span className="font-medium text-slate-700">{item.homeroomTeacherName}</span>
                                                    </div>
                                                ) : (
                                                    <Badge variant="outline" className="text-red-600 bg-red-50 border-red-200 font-normal">
                                                        Belum Ditentukan
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                <Badge variant="secondary" className="font-normal">
                                                    {item.totalStudents} Siswa
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button variant="ghost" size="sm" className="hover:bg-slate-100 text-slate-600">
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Ubah
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
