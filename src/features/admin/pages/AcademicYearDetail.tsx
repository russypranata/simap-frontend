'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
    ArrowLeft,
    Edit,
    Edit2,
    CheckCircle2,
    AlertTriangle,
    CalendarDays,
    Clock,
    Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate } from '@/features/shared/utils/dateFormatter';

import { AcademicYear, Semester } from '../types/academicYear';
import { academicYearService } from '../services/academicYearService';
import { AcademicYearDetailSkeleton, EditSemesterDialog } from '../components/academic-year';
import { StatusBadge } from '../components/academic-year';

interface AcademicYearDetailProps {
    id: string;
}

export const AcademicYearDetail: React.FC<AcademicYearDetailProps> = ({ id }) => {
    const router = useRouter();
    const [academicYear, setAcademicYear] = useState<AcademicYear | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Dialog states
    const [isActivateSemesterDialogOpen, setIsActivateSemesterDialogOpen] = useState(false);
    const [selectedSemesterId, setSelectedSemesterId] = useState<string | null>(null);
    const [isActionLoading, setIsActionLoading] = useState(false);

    // Edit semester states
    const [isEditSemesterDialogOpen, setIsEditSemesterDialogOpen] = useState(false);
    const [selectedSemesterForEdit, setSelectedSemesterForEdit] = useState<Semester | null>(null);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const data = await academicYearService.getAcademicYearById(id);
            setAcademicYear(data);
        } catch (error) {
            console.error('Failed to fetch academic year:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleActivateSemester = async () => {
        if (!academicYear || !selectedSemesterId) return;

        try {
            setIsActionLoading(true);
            await academicYearService.activateSemester(academicYear.id, selectedSemesterId);
            await fetchData();
            setIsActivateSemesterDialogOpen(false);
        } catch (error) {
            console.error('Failed to activate semester:', error);
        } finally {
            setIsActionLoading(false);
            setSelectedSemesterId(null);
        }
    };

    const openActivateSemesterDialog = (semesterId: string) => {
        setSelectedSemesterId(semesterId);
        setIsActivateSemesterDialogOpen(true);
    };

    const getSelectedSemesterName = (): string => {
        if (!academicYear || !selectedSemesterId) return '';
        const sem = academicYear.semesters.find(s => s.id === selectedSemesterId);
        return sem?.name || '';
    };

    const openEditSemesterDialog = (semester: Semester) => {
        setSelectedSemesterForEdit(semester);
        setIsEditSemesterDialogOpen(true);
    };

    const handleUpdateSemester = async (semesterId: string, startDate: string, endDate: string) => {
        if (!academicYear) return;

        try {
            await academicYearService.updateSemester(academicYear.id, semesterId, startDate, endDate);
            await fetchData();
            toast.success('Periode semester berhasil diperbarui');
        } catch (error) {
            console.error('Failed to update semester:', error);
            toast.error('Gagal memperbarui periode semester');
            throw error;
        }
    };


    if (isLoading) {
        return <AcademicYearDetailSkeleton />;
    }

    if (!academicYear) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="p-4 bg-muted rounded-full">
                    <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="text-center">
                    <h3 className="font-semibold text-lg">Tahun ajaran tidak ditemukan</h3>
                    <p className="text-muted-foreground">ID: {id}</p>
                </div>
                <Button 
                    variant="outline" 
                    className="text-blue-800 border-blue-300 bg-blue-100 hover:bg-blue-200 hover:text-blue-900"
                    onClick={() => router.push('/admin/academic-year')}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Kembali
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-2">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Tahun Ajaran{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                {academicYear.name}
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                            <Calendar className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Detail informasi, status, dan pengelolaan semester untuk periode akademik ini.
                    </p>
                </div>
                <Button
                    className="bg-blue-800 hover:bg-blue-900 text-white"
                    onClick={() => router.push(`/admin/academic-year/${id}/edit`)}
                >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Tahun Ajaran
                </Button>
            </div>

            {/* Combined Card with Horizontal Layout */}
            <Card className="border-slate-200">
                <div className="flex flex-col lg:flex-row">
                    {/* Info Section */}
                    <div className="flex-1">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <CalendarDays className="h-5 w-5 text-blue-700" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-semibold text-gray-900">Informasi Tahun Ajaran</CardTitle>
                                    <CardDescription className="text-sm text-muted-foreground">Periode, status, dan data tahun ajaran</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-sm text-muted-foreground">Nama</span>
                                <span className="text-sm font-semibold">{academicYear.name}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-sm text-muted-foreground">Tanggal Mulai</span>
                                <span className="text-sm font-medium">
                                    {formatDate(new Date(academicYear.startDate), 'dd MMMM yyyy')}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-sm text-muted-foreground">Tanggal Selesai</span>
                                <span className="text-sm font-medium">
                                    {formatDate(new Date(academicYear.endDate), 'dd MMMM yyyy')}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-sm text-muted-foreground">Status</span>
                                <StatusBadge isActive={academicYear.isActive} />
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-sm text-muted-foreground">Terakhir Diperbarui</span>
                                <span className="text-sm font-medium">
                                    {formatDate(new Date(academicYear.updatedAt), 'dd MMM yyyy, HH:mm')}
                                </span>
                            </div>
                        </CardContent>
                    </div>

                    {/* Vertical Divider */}
                    <div className="hidden lg:block w-px bg-slate-200"></div>

                    {/* Semesters Section */}
                    <div className="flex-1">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <Clock className="h-5 w-5 text-blue-700" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-semibold text-gray-900">Semester</CardTitle>
                                    <CardDescription className="text-sm text-muted-foreground">Kelola dan aktifkan semester</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {academicYear.semesters.map((semester) => (
                                <div
                                    key={semester.id}
                                    className={cn(
                                        "p-4 border rounded-lg transition-colors",
                                        semester.isActive
                                            ? "border-green-200 bg-green-50"
                                            : "border-slate-200 bg-slate-50/50"
                                    )}
                                >
                                    <div className="space-y-3">
                                        {/* Header & Status */}
                                        <div className="flex justify-between items-start pb-2 border-b border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-gray-900">
                                                    Semester {semester.name}
                                                </span>
                                            </div>
                                            <StatusBadge isActive={semester.isActive} />
                                        </div>
                                        
                                        {/* Details */}
                                        <div className="space-y-2 text-sm pt-1">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Mulai</span>
                                                <span className="font-medium">
                                                    {formatDate(new Date(semester.startDate), 'dd MMMM yyyy')}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Selesai</span>
                                                <span className="font-medium">
                                                    {formatDate(new Date(semester.endDate), 'dd MMMM yyyy')}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center pt-2 mt-2 border-t border-dashed border-gray-200">
                                                <span className="text-muted-foreground">Terakhir Diperbarui</span>
                                                <span className="font-medium">
                                                    {semester.updatedAt 
                                                        ? formatDate(new Date(semester.updatedAt), 'dd MMM yyyy, HH:mm') 
                                                        : '-'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Edit Semester Button */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-3 w-full text-blue-800 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:text-blue-900"
                                        onClick={() => openEditSemesterDialog(semester)}
                                    >
                                        <Edit2 className="h-4 w-4 mr-2" />
                                        Edit Periode Semester
                                    </Button>

                                    {academicYear.isActive && !semester.isActive && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mt-2 w-full text-green-600 border-green-200 bg-green-50 hover:bg-green-100 hover:text-green-700"
                                            onClick={() => openActivateSemesterDialog(semester.id)}
                                        >
                                            <CheckCircle2 className="h-4 w-4 mr-2" />
                                            Aktifkan Semester Ini
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </div>
                </div>
            </Card>

            {/* Activate Semester Dialog */}
            <Dialog open={isActivateSemesterDialogOpen} onOpenChange={setIsActivateSemesterDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 rounded-lg">
                                <AlertTriangle className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <DialogTitle>Aktifkan Semester</DialogTitle>
                                <DialogDescription>
                                    Konfirmasi untuk mengaktifkan semester ini
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="py-4">
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                            <p className="text-sm text-amber-800">
                                Apakah Anda yakin ingin mengaktifkan semester{' '}
                                <strong>{getSelectedSemesterName()}</strong>?
                            </p>
                            <p className="mt-2 text-sm text-amber-700">
                                Semester yang sedang aktif akan dinonaktifkan.
                            </p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsActivateSemesterDialogOpen(false)}
                            disabled={isActionLoading}
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleActivateSemester}
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

            {/* Edit Semester Dialog */}
            {academicYear && (
                <EditSemesterDialog
                    semester={selectedSemesterForEdit}
                    academicYearId={academicYear.id}
                    academicYearStartDate={academicYear.startDate}
                    academicYearEndDate={academicYear.endDate}
                    isOpen={isEditSemesterDialogOpen}
                    onClose={() => {
                        setIsEditSemesterDialogOpen(false);
                        setSelectedSemesterForEdit(null);
                    }}
                    onUpdate={handleUpdateSemester}
                />
            )}
        </div>
    );
};
