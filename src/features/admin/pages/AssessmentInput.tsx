'use client';

import React from 'react';
import {
    ClipboardList,
    Search,
    Filter,
    ArrowRight,
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
import { Progress } from '@/components/ui/progress';
import { MOCK_ASSESSMENT_CLASSES } from '../data/mockAssessmentData';

const statusColors: Record<string, string> = {
    completed: 'text-green-600 bg-green-50 border-green-200',
    partial: 'text-amber-600 bg-amber-50 border-amber-200',
    pending: 'text-slate-600 bg-slate-100 border-slate-200',
};

const statusLabels: Record<string, string> = {
    completed: 'Selesai',
    partial: 'Sebagian',
    pending: 'Belum Mulai',
};

export const AssessmentInput: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Input{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Nilai
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                            <ClipboardList className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Monitoring dan input nilai siswa per mata pelajaran.
                    </p>
                </div>
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0">
                                <ClipboardList className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    Daftar Kelas & Mapel
                                </CardTitle>
                                <CardDescription>
                                    Pilih kelas untuk mulai mengisi nilai
                                </CardDescription>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari kelas, mapel, atau guru..."
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
                    <div className="overflow-x-auto border-t border-slate-200">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Kelas & Mapel</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Guru Pengampu</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Progress</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-center">Status</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {MOCK_ASSESSMENT_CLASSES.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 text-lg">{item.className}</span>
                                                <span className="text-blue-600 text-xs font-semibold bg-blue-50 px-2 py-0.5 rounded w-fit">{item.subjectName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                    {item.teacherName.substring(0, 2).toUpperCase()}
                                                </div>
                                                {item.teacherName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 min-w-[200px]">
                                            <div className="flex justify-between text-xs mb-1.5">
                                                <span className="text-slate-500">{item.gradedStudents}/{item.totalStudents} Siswa</span>
                                                <span className="font-bold text-slate-700">{Math.round((item.gradedStudents / item.totalStudents) * 100)}%</span>
                                            </div>
                                            <Progress value={(item.gradedStudents / item.totalStudents) * 100} className="h-2 bg-slate-100" indicatorClassName="bg-blue-600" />
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
                                            <Button size="sm" variant="ghost" className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-slate-200">
                                                Input Nilai <ArrowRight className="h-3 w-3 ml-1" />
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
