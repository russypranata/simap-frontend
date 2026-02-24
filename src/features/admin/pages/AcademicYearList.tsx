'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Calendar,
    CalendarPlus,
    Eye,
    Edit,
    CheckCircle2,
    AlertTriangle,
    CalendarDays,
    CalendarCheck,
    Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate } from '@/features/shared/utils/dateFormatter';

import { AcademicYear, AcademicYearStats } from '../types/academicYear';
import { academicYearService } from '../services/academicYearService';
import { AcademicYearListSkeleton } from '../components/academic-year';
import { SemesterBadge, StatusBadge } from '../components/academic-year';

export const AcademicYearList: React.FC = () => {
    const router = useRouter();
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
    const [stats, setStats] = useState<AcademicYearStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isStatsLoading, setIsStatsLoading] = useState(true);

    // Dialog states
    const [isActivateDialogOpen, setIsActivateDialogOpen] = useState(false);
    const [selectedYear, setSelectedYear] = useState<AcademicYear | null>(null);
    const [isActionLoading, setIsActionLoading] = useState(false);

    // Fetch data
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setIsStatsLoading(true);

            const [yearsData, statsData] = await Promise.all([
                academicYearService.getAcademicYears(),
                academicYearService.getAcademicYearStats(),
            ]);

            setAcademicYears(yearsData);
            setStats(statsData);
        } catch (error) {
            console.error('Failed to fetch academic years:', error);
        } finally {
            setIsLoading(false);
            setIsStatsLoading(false);
        }
    };

    // Handlers
    const handleActivate = async () => {
        if (!selectedYear) return;

        try {
            setIsActionLoading(true);
            await academicYearService.activateAcademicYear(selectedYear.id);
            await fetchData();
            setIsActivateDialogOpen(false);
        } catch (error) {
            console.error('Failed to activate academic year:', error);
        } finally {
            setIsActionLoading(false);
            setSelectedYear(null);
        }
    };

    const openActivateDialog = (year: AcademicYear) => {
        setSelectedYear(year);
        setIsActivateDialogOpen(true);
    };

    // Get active semester name from year
    const getActiveSemesterName = (year: AcademicYear): string | null => {
        const activeSem = year.semesters.find(s => s.isActive);
        return activeSem?.name || null;
    };

    if (isLoading) {
        return <AcademicYearListSkeleton />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Manajemen{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Tahun Ajaran
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Calendar className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Kelola tahun ajaran dan semester aktif untuk sistem akademik
                    </p>
                    
                </div>
                <Button
                    onClick={() => router.push('/admin/academic-year/new')}
                    className="bg-blue-800 hover:bg-blue-900 text-white"
                >
                    <CalendarPlus className="h-4 w-4 mr-2" />
                    Tambah Tahun Ajaran
                </Button>
            </div>

            {/* Stats - Borderless with Dividers Only */}
            <div className="bg-white border-x border-slate-200 border-t-0 border-b-0">
                <div className="flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-slate-200">
                    {/* Total Tahun Ajaran */}
                    <div className="flex-1 w-full px-5 py-6">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-xs font-medium text-blue-600 mb-2">Total Tahun Ajaran</p>
                                {isStatsLoading ? (
                                    <p className="text-xl font-bold text-blue-600 animate-pulse">...</p>
                                ) : (
                                    <p className="text-xl font-bold text-blue-600">{stats?.totalAcademicYears || 0}</p>
                                )}
                                <p className="text-xs text-slate-400 mt-1">Data terdaftar</p>
                            </div>
                            <div className="p-2.5 bg-blue-50 rounded-lg">
                                <CalendarDays className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    {/* Tahun Ajaran Aktif */}
                    <div className="flex-1 w-full px-5 py-6">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-xs font-medium text-emerald-600 mb-2">Tahun Ajaran Aktif</p>
                                {isStatsLoading ? (
                                    <p className="text-xl font-bold text-emerald-600 animate-pulse">...</p>
                                ) : (
                                    <p className="text-xl font-bold text-emerald-600">
                                        {stats?.activeAcademicYear || '-'}
                                    </p>
                                )}
                                <p className="text-xs text-slate-400 mt-1">Periode berjalan</p>
                            </div>
                            <div className="p-2.5 bg-emerald-50 rounded-lg">
                                <CalendarCheck className="h-5 w-5 text-emerald-600" />
                            </div>
                        </div>
                    </div>

                    {/* Semester Aktif */}
                    <div className="flex-1 w-full px-5 py-6">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-xs font-medium text-indigo-600 mb-2">Semester Aktif</p>
                                {isStatsLoading ? (
                                    <p className="text-xl font-bold text-indigo-600 animate-pulse">...</p>
                                ) : (
                                    <p className="text-xl font-bold text-indigo-600">
                                        {stats?.activeSemester || '-'}
                                    </p>
                                )}
                                <p className="text-xs text-slate-400 mt-1">Semester berjalan</p>
                            </div>
                            <div className="p-2.5 bg-indigo-50 rounded-lg">
                                <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Academic Years Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                <Calendar className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">Daftar Tahun Ajaran</CardTitle>
                                <CardDescription className="text-sm text-muted-foreground">Semua tahun ajaran yang terdaftar dalam sistem</CardDescription>
                            </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            {academicYears.length} Data
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                                <tr>
                                    <th className="text-center p-4 font-medium text-sm w-12">No</th>
                                    <th className="text-left p-4 font-medium text-sm">Tahun Ajaran</th>
                                    <th className="text-left p-4 font-medium text-sm">Periode</th>
                                    <th className="text-center p-4 font-medium text-sm">Semester Aktif</th>
                                    <th className="text-center p-4 font-medium text-sm">Status</th>
                                    <th className="text-center p-4 font-medium text-sm">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {academicYears.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-12">
                                            <div className="flex flex-col items-center justify-center text-center space-y-4">
                                                <div className="p-4 bg-muted rounded-full">
                                                    <Calendar className="h-8 w-8 text-muted-foreground" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-lg">Belum ada tahun ajaran</h3>
                                                    <p className="text-muted-foreground">
                                                        Tambahkan tahun ajaran pertama untuk memulai
                                                    </p>
                                                </div>
                                                <Button
                                                    onClick={() => router.push('/admin/academic-year/new')}
                                                    className="mt-2"
                                                >
                                                    <CalendarPlus className="h-4 w-4 mr-2" />
                                                    Tambah Tahun Ajaran
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    academicYears.map((year, index) => (
                                        <tr key={year.id} className="border-b hover:bg-muted/30 transition-colors">
                                            <td className="p-4 text-sm text-center">{index + 1}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "h-10 w-10 rounded-lg flex items-center justify-center",
                                                        year.isActive
                                                            ? "bg-green-100"
                                                            : "bg-slate-100"
                                                    )}>
                                                        <Calendar className={cn(
                                                            "h-5 w-5",
                                                            year.isActive
                                                                ? "text-green-600"
                                                                : "text-slate-500"
                                                        )} />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold">{year.name}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            ID: {year.id}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-sm">
                                                    <p className="font-medium">
                                                        {formatDate(new Date(year.startDate), 'dd MMM yyyy')}
                                                    </p>
                                                    <p className="text-muted-foreground">
                                                        s/d {formatDate(new Date(year.endDate), 'dd MMM yyyy')}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">
                                                {year.isActive ? (
                                                    <SemesterBadge
                                                        name={getActiveSemesterName(year) || '-'}
                                                        isActive={true}
                                                    />
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">-</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-center">
                                                <StatusBadge isActive={year.isActive} />
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-blue-800 border-blue-300 bg-blue-100 hover:bg-blue-200 hover:text-blue-900 rounded-lg transition-colors"
                                                        onClick={() => router.push(`/admin/academic-year/${year.id}`)}
                                                        title="Detail"
                                                    >
                                                        <Eye className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-amber-600 border-amber-200 bg-amber-50 hover:bg-amber-100 hover:text-amber-700 rounded-lg transition-colors"
                                                        onClick={() => router.push(`/admin/academic-year/${year.id}/edit`)}
                                                        title="Edit"
                                                    >
                                                        <Edit className="h-3.5 w-3.5" />
                                                    </Button>
                                                    {!year.isActive && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 text-green-600 border-green-200 bg-green-50 hover:bg-green-100 hover:text-green-700 rounded-lg transition-colors"
                                                            onClick={() => openActivateDialog(year)}
                                                            title="Aktifkan"
                                                        >
                                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Activate Confirmation Dialog */}
            <Dialog open={isActivateDialogOpen} onOpenChange={setIsActivateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 rounded-lg">
                                <AlertTriangle className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <DialogTitle>Aktifkan Tahun Ajaran</DialogTitle>
                                <DialogDescription>
                                    Konfirmasi untuk mengaktifkan tahun ajaran ini
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="py-4">
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                            <p className="text-sm text-amber-800">
                                <strong>Perhatian:</strong> Mengaktifkan tahun ajaran{' '}
                                <strong>{selectedYear?.name}</strong> akan:
                            </p>
                            <ul className="mt-2 text-sm text-amber-700 list-disc list-inside space-y-1">
                                <li>Menonaktifkan tahun ajaran yang sedang aktif</li>
                                <li>Mengatur semester Ganjil sebagai semester aktif</li>
                                <li>Mempengaruhi semua transaksi akademik</li>
                            </ul>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsActivateDialogOpen(false)}
                            disabled={isActionLoading}
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleActivate}
                            disabled={isActionLoading}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {isActionLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Mengaktifkan...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Ya, Aktifkan
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
