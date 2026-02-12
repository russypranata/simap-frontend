'use client';

import React, { useState, useEffect } from 'react';
import { 
    ClipboardCheck, 
    Search, 
    TrendingUp, 
    TrendingDown,
    Calendar,
    ArrowRight,
    Filter,
    FileBarChart,
    Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { extracurricularAttendanceService } from '@/features/admin/services/extracurricularAttendanceService';
import { ExtracurricularAttendanceRecap } from '@/features/admin/types/extracurricular';
import { cn } from '@/lib/utils';
import { useAcademicYear } from '@/context/AcademicYearContext';
import { AttendanceRecapSkeleton } from '@/features/admin/components/extracurricular';

export default function AttendanceRecapPage() {
    const { academicYear: activeYearCtx } = useAcademicYear();
    const [recaps, setRecaps] = useState<ExtracurricularAttendanceRecap[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedYear, setSelectedYear] = useState(activeYearCtx.academicYear);
    const [selectedSemester, setSelectedSemester] = useState(activeYearCtx.semester);
    const router = useRouter();

    useEffect(() => {
        fetchRecaps();
    }, [selectedYear, selectedSemester]);

    const fetchRecaps = async () => {
        try {
            setIsLoading(true);
            const data = await extracurricularAttendanceService.getAttendanceRecap(selectedYear, selectedSemester);
            setRecaps(data);
        } catch (error) {
            console.error('Failed to fetch attendance recap:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredRecaps = recaps.filter(r => 
        r.extracurricularName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return <AttendanceRecapSkeleton />;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Rekap Presensi{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Ekstrakurikuler
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                            <ClipboardCheck className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Monitoring tingkat kehadiran dan keaktifan siswa di seluruh kegiatan ekskul.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="w-full sm:w-[160px] bg-white shadow-sm border-slate-200">
                            <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                            <SelectValue placeholder="Tahun Ajaran" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2025/2026">2025/2026</SelectItem>
                            <SelectItem value="2024/2025">2024/2025</SelectItem>
                            <SelectItem value="2023/2024">2023/2024</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                        <SelectTrigger className="w-full sm:w-[160px] bg-white shadow-sm border-slate-200">
                            <Filter className="h-4 w-4 mr-2 text-slate-400" />
                            <SelectValue placeholder="Semester" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">Semester Ganjil</SelectItem>
                            <SelectItem value="2">Semester Genap</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-slate-200 shadow-sm border-l-4 border-l-blue-600">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Rata-rata Kehadiran</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-slate-900">89.4%</span>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">
                                <TrendingUp className="h-3 w-3 mr-1" /> +2.1%
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 shadow-sm border-l-4 border-l-slate-400">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Sesi Pertemuan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <span className="text-3xl font-bold text-slate-900">142</span>
                        <p className="text-xs text-slate-500 mt-1">Seluruh ekskul di Semester Ganjil</p>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 shadow-sm border-l-4 border-l-amber-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Ekskul Teraktif</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <span className="text-xl font-bold text-slate-800 uppercase">PRAMUKA</span>
                        <p className="text-xs text-slate-500 mt-1">98% Kehadiran Rata-rata</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-slate-200 shadow-md">
                <CardHeader className="pb-3 border-b border-slate-100">
                    <div className="flex flex-col sm:flex-row gap-3 justify-between items-center text-center">
                        <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <FileBarChart className="h-5 w-5 text-blue-800" />
                            Statistik Per Kegiatan
                        </CardTitle>
                        <div className="relative w-full sm:w-[300px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari nama ekskul..."
                                className="pl-9 w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50 text-slate-700 border-b border-slate-200">
                                <TableRow>
                                    <TableHead className="w-[80px] px-6 py-4 font-semibold text-xs uppercase tracking-wider text-slate-700">Rank</TableHead>
                                    <TableHead className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-slate-700">Nama Ekstrakurikuler</TableHead>
                                    <TableHead className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-slate-700">Kategori</TableHead>
                                    <TableHead className="text-center px-6 py-4 font-semibold text-xs uppercase tracking-wider text-slate-700">Sesi</TableHead>
                                    <TableHead className="text-center px-6 py-4 font-semibold text-xs uppercase tracking-wider text-slate-700">Trend Presensi</TableHead>
                                    <TableHead className="text-right px-6 py-4 font-semibold text-xs uppercase tracking-wider text-slate-700">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRecaps.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                                            Tidak ada data ditemukan
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredRecaps.map((recap, index) => (
                                        <TableRow key={recap.extracurricularId} className="hover:bg-slate-50/60 transition-colors border-b border-slate-50">
                                            <TableCell className="font-medium text-slate-400 pl-6 py-4">#{(index + 1).toString().padStart(2, '0')}</TableCell>
                                            <TableCell className="py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-slate-900 text-sm uppercase tracking-tight">{recap.extracurricularName}</span>
                                                    <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 uppercase font-medium">
                                                        <Calendar className="h-3 w-3" />
                                                        Terakhir: {new Date(recap.lastActivity).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <Badge variant="outline" className="text-[10px] font-medium uppercase border-slate-200 bg-slate-50">
                                                    {recap.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center font-semibold text-slate-600 text-sm py-4">
                                                {recap.totalSessions}
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="flex flex-col items-center gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className={cn(
                                                            "text-sm font-bold",
                                                            recap.attendanceRate >= 90 ? "text-green-600" :
                                                            recap.attendanceRate >= 75 ? "text-blue-600" : "text-amber-600"
                                                        )}>
                                                            {recap.attendanceRate}%
                                                        </span>
                                                        {recap.attendanceRate >= 85 ? (
                                                            <TrendingUp className="h-4 w-4 text-green-500" />
                                                        ) : (
                                                            <TrendingDown className="h-4 w-4 text-amber-500" />
                                                        )}
                                                    </div>
                                                    <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                                                        <div 
                                                            className={cn(
                                                                "h-full",
                                                                recap.attendanceRate >= 90 ? "bg-green-500" :
                                                                recap.attendanceRate >= 75 ? "bg-blue-500" : "bg-amber-500"
                                                            )}
                                                            style={{ width: `${recap.attendanceRate}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="text-blue-800 hover:text-blue-900 hover:bg-blue-50 group font-bold"
                                                    onClick={() => router.push(`/admin/extracurricular/attendance/${recap.extracurricularId}`)}
                                                >
                                                    Detail 
                                                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
