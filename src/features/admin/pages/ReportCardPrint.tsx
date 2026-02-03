'use client';

import React from 'react';
import {
    Printer,
    Search,
    Filter,
    Download,
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
import { MOCK_REPORT_CARDS } from '../data/mockAssessmentData';

const statusColors: Record<string, string> = {
    ready: 'text-green-600 bg-green-50 border-green-200',
    processing: 'text-amber-600 bg-amber-50 border-amber-200',
    pending: 'text-slate-600 bg-slate-100 border-slate-200',
};

const statusLabels: Record<string, string> = {
    ready: 'Siap Cetak',
    processing: 'Proses',
    pending: 'Belum Siap',
};

export const ReportCardPrint: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Cetak{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Rapor
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Printer className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Generate dan cetak laporan hasil belajar siswa (Rapor).
                    </p>
                </div>
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-primary flex-shrink-0">
                                <Printer className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    Daftar Kelas
                                </CardTitle>
                                <CardDescription>
                                    Pilih kelas untuk mencetak rapor
                                </CardDescription>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari kelas atau wali kelas..."
                                className="pl-9 w-full"
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
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Kelas</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Wali Kelas</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Periode</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Siap Cetak</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-center">Status</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {MOCK_REPORT_CARDS.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-lg text-slate-900">{item.className}</div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {item.homeroomTeacher}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {item.academicYear} - {item.semester}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            <span className="font-medium text-slate-900">{item.generatedReports}</span> / {item.totalStudents} Siswa
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
                                            <Button
                                                size="sm"
                                                className="bg-blue-800 hover:bg-blue-900 text-white"
                                                disabled={item.status === 'pending'}
                                            >
                                                <Download className="h-3 w-3 mr-2" />
                                                Unduh PDF
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
