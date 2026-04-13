'use client';

import React, { useState } from 'react';
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
    RefreshCw,
    CalendarClock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate } from '@/features/shared/utils/dateFormatter';
import { StatCard } from '@/features/shared/components';

import { AcademicYear } from '../types/academicYear';
import { AcademicYearListSkeleton } from '../components/academic-year';
import { SemesterBadge, StatusBadge } from '../components/academic-year';
import { useAcademicYearList } from '../hooks/useAcademicYearList';
import { useBreadcrumbAction } from '@/context/BreadcrumbActionContext';

export const AcademicYearList: React.FC = () => {
    const router = useRouter();
    const { setAction, clearAction } = useBreadcrumbAction();

    const {
        academicYears,
        stats,
        isLoading,
        isFetching,
        isActionLoading,
        activateYear,
    } = useAcademicYearList();

    const [isActivateDialogOpen, setIsActivateDialogOpen] = useState(false);
    const [selectedYear, setSelectedYear] = useState<AcademicYear | null>(null);

    React.useEffect(() => {
        if (isFetching) {
            setAction(
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span className="hidden sm:inline">Memperbarui...</span>
                </div>
            );
        } else {
            clearAction();
        }
        return () => clearAction();
    }, [isFetching, setAction, clearAction]);

    const handleActivate = async () => {
        if (!selectedYear) return;
        await activateYear(selectedYear.id);
        setIsActivateDialogOpen(false);
        setSelectedYear(null);
    };

    const openActivateDialog = (year: AcademicYear) => {
        setSelectedYear(year);
        setIsActivateDialogOpen(true);
    };

    const getActiveSemesterName = (year: AcademicYear): string | null =>
        year.semesters.find(s => s.isActive)?.name || null;

    if (isLoading) return <AcademicYearListSkeleton />;

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
                    <CalendarClock className="h-4 w-4 mr-2" />
                    Tambah Tahun Ajaran
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    title="Total Tahun Ajaran"
                    value={stats.totalAcademicYears}
                    subtitle="Data terdaftar"
                    icon={CalendarDays}
                    color="blue"
                />
                <StatCard
                    title="Tahun Ajaran Aktif"
                    value={stats.activeAcademicYear ?? '-'}
                    subtitle="Periode berjalan"
                    icon={CalendarCheck}
                    color="emerald"
                    size="sm"
                />
                <StatCard
                    title="Semester Aktif"
                    value={stats.activeSemester ?? '-'}
                    subtitle="Semester berjalan"
                    icon={CheckCircle2}
                    color="indigo"
                    size="sm"
                />
            </div>

            {/* Table Card */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-blue-100 rounded-xl">
                                <Calendar className="h-5 w-5 text-blue-700" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-slate-800">Daftar Tahun Ajaran</CardTitle>
                                <CardDescription className="text-sm text-slate-600">
                                    Semua tahun ajaran yang terdaftar dalam sistem
                                </CardDescription>
                            </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            {academicYears.length} Data
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="text-center p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider w-12">No</th>
                                    <th className="text-left p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider min-w-[180px]">Tahun Ajaran</th>
                                    <th className="text-left p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Periode</th>
                                    <th className="text-center p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Semester Aktif</th>
                                    <th className="text-center p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Status</th>
                                    <th className="text-center p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {academicYears.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-12">
                                            <div className="flex flex-col items-center justify-center text-center space-y-4">
                                                <div className="w-14 h-14 rounded-full bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center">
                                                    <Calendar className="h-7 w-7 text-slate-400" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-slate-800">Belum ada tahun ajaran</h3>
                                                    <p className="text-sm text-slate-500 mt-1">
                                                        Tambahkan tahun ajaran pertama untuk memulai
                                                    </p>
                                                </div>
                                                <Button
                                                    onClick={() => router.push('/admin/academic-year/new')}
                                                    className="mt-2"
                                                >
                                                    <CalendarClock className="h-4 w-4 mr-2" />
                                                    Tambah Tahun Ajaran
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    academicYears.map((year, index) => (
                                        <tr
                                            key={year.id}
                                            className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                                        >
                                            <td className="p-4 text-sm text-center text-slate-600 font-medium">{index + 1}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0",
                                                        year.isActive ? "bg-emerald-100" : "bg-slate-100"
                                                    )}>
                                                        <Calendar className={cn(
                                                            "h-5 w-5",
                                                            year.isActive ? "text-emerald-600" : "text-slate-500"
                                                        )} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-800">{year.name}</p>
                                                        <p className="text-xs text-slate-400">ID: {year.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-sm">
                                                    <p className="font-medium text-slate-800">
                                                        {formatDate(new Date(year.startDate), 'dd MMM yyyy')}
                                                    </p>
                                                    <p className="text-slate-500">
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
                                                    <span className="text-sm text-slate-400">-</span>
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
                                                        className="h-8 w-8 p-0 text-blue-700 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:text-blue-800 rounded-lg transition-colors"
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
                                                            className="h-8 w-8 p-0 text-emerald-600 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-700 rounded-lg transition-colors"
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
                            className="bg-emerald-600 hover:bg-emerald-700"
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
