'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
    ArrowRight,
    Loader2,
    Info,
    Calendar,
    Users,
    UserCheck,
    CheckCircle2,
    AlertCircle,
    Save,
    ChevronRight,
    ArrowUpCircle,
    ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { academicYearService } from '../services/academicYearService';
import { classService } from '../services/classService';
import { studentService } from '../services/studentService';
import { AcademicYear } from '../types/academicYear';
import { ClassRoom } from '../types/class';
import { PromotionAction, StudentPromotion } from '../types/promotion';

type Step = 1 | 2 | 3 | 4;

export const PromotionWorkflow: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<Step>(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Data State
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
    const [sourceClasses, setSourceClasses] = useState<ClassRoom[]>([]);
    const [targetClasses, setTargetClasses] = useState<ClassRoom[]>([]);

    // Form State
    const [sourceYearId, setSourceYearId] = useState<string>('');
    const [targetYearId, setTargetYearId] = useState<string>('');
    const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
    const [classMapping, setClassMapping] = useState<Record<string, string>>({}); // sourceClassId -> targetClassId
    const [promotionRecords, setPromotionRecords] = useState<StudentPromotion[]>([]);

    // Filter target years to only show years AFTER source year
    const filteredTargetYears = useMemo(() => {
        const sourceYear = academicYears.find(y => y.id === sourceYearId);
        if (!sourceYear) return [];
        return academicYears.filter(y => y.id !== sourceYearId && new Date(y.startDate) > new Date(sourceYear.startDate));
    }, [academicYears, sourceYearId]);

    // Reset target year if it's no longer valid when source changes
    useEffect(() => {
        if (sourceYearId && targetYearId) {
            const sourceYear = academicYears.find(y => y.id === sourceYearId);
            const targetYear = academicYears.find(y => y.id === targetYearId);
            if (sourceYear && targetYear && new Date(targetYear.startDate) <= new Date(sourceYear.startDate)) {
                setTargetYearId('');
            }
        }
    }, [sourceYearId, targetYearId, academicYears]);

    // Reset selection and mapping when years change
    useEffect(() => {
        setSelectedClassIds([]);
        setClassMapping({});
    }, [sourceYearId, targetYearId]);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setIsLoading(true);
            const years = await academicYearService.getAcademicYears();
            setAcademicYears(years);

            const activeYear = years.find(y => y.isActive);
            if (activeYear) {
                setSourceYearId(activeYear.id);
            }
        } catch {
            toast.error('Gagal mengambil data tahun ajaran');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSourceClasses = async (yearId: string) => {
        try {
            setIsLoading(true);
            const allClasses = await classService.getClasses({ academic_year_id: yearId });
            setSourceClasses(allClasses);
        } catch {
            toast.error('Gagal mengambil data kelas asal');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTargetClasses = async (yearId: string) => {
        try {
            setIsLoading(true);
            const allClasses = await classService.getClasses({ academic_year_id: yearId });
            setTargetClasses(allClasses);
        } catch {
            toast.error('Gagal mengambil data kelas tujuan');
        } finally {
            setIsLoading(false);
        }
    };

    const handleNext = async () => {
        if (currentStep === 1) {
            if (!sourceYearId || !targetYearId) {
                toast.error('Pilih tahun ajaran asal dan tujuan');
                return;
            }
            if (sourceYearId === targetYearId) {
                toast.error('Tahun ajaran asal dan tujuan tidak boleh sama');
                return;
            }
            await fetchSourceClasses(sourceYearId);
            await fetchTargetClasses(targetYearId);
            setCurrentStep(2);
        } else if (currentStep === 2) {
            if (selectedClassIds.length === 0) {
                toast.error('Pilih minimal satu kelas asal');
                return;
            }

            const unmappedClasses = selectedClassIds.filter(id => {
                return !classMapping[id];
            });

            if (unmappedClasses.length > 0) {
                toast.error('Silakan tentukan kelas tujuan untuk semua kelas asal pilihan');
                return;
            }

            try {
                setIsLoading(true);
                const results = await Promise.all(
                    selectedClassIds.map(id => studentService.getStudentsByClass(id))
                );
                const allEnrollments = results.flat();

                if (allEnrollments.length === 0) {
                    toast.error('Tidak ada siswa di kelas terpilih');
                    setIsLoading(false);
                    return;
                }

                const initialRecords: StudentPromotion[] = allEnrollments.map(e => ({
                    studentId:      String(e.student_id),
                    studentName:    e.student_name ?? `Siswa #${e.student_id}`,
                    nisn:           `—`,
                    currentClassId: String(e.class_id),
                    action:         'PROMOTE' as PromotionAction,
                    targetClassId:  classMapping[String(e.class_id)],
                }));
                setPromotionRecords(initialRecords);
                setCurrentStep(3);
            } catch (error) {
                toast.error('Gagal mengambil data siswa');
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        } else if (currentStep === 3) {
            setCurrentStep(4);
        }
    };

    const handleBack = () => {
        setCurrentStep((prev) => (prev - 1) as Step);
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            await studentService.promoteStudents({
                source_academic_year_id: Number(sourceYearId),
                target_academic_year_id: Number(targetYearId),
                promotions: promotionRecords.map(r => ({
                    student_id:      Number(r.studentId),
                    action:          r.action,
                    target_class_id: r.targetClassId ? Number(r.targetClassId) : undefined,
                })),
            });
            toast.success('Proses kenaikan kelas berhasil diselesaikan');

            setCurrentStep(1);
            setSourceYearId('');
            setTargetYearId('');
            setSelectedClassIds([]);
            setPromotionRecords([]);
            setClassMapping({});
        } catch (error) {
            toast.error('Gagal memproses kenaikan kelas');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const updatePromotionAction = (studentId: string, action: PromotionAction) => {
        setPromotionRecords(prev => prev.map(r =>
            r.studentId === studentId ? { ...r, action } : r
        ));
    };

    const handleClassSelect = (sourceId: string) => {
        setSelectedClassIds(prev => {
            const isSelected = prev.includes(sourceId);
            const newSelection = isSelected
                ? prev.filter(id => id !== sourceId)
                : [...prev, sourceId];

            if (!isSelected) {
                // No auto-mapping: ClassRoom does not have a 'grade' field.
                // Admin must manually select target class from dropdown.
            } else {
                const { [sourceId]: _removed, ...rest } = classMapping;
                void _removed;
                setClassMapping(rest);
            }

            return newSelection;
        });
    };

    const stats = useMemo(() => {
        return {
            total: promotionRecords.length,
            promoted: promotionRecords.filter(r => r.action === 'PROMOTE').length,
            stayed: promotionRecords.filter(r => r.action === 'STAY').length,
            graduated: promotionRecords.filter(r => r.action === 'GRADUATE').length,
        };
    }, [promotionRecords]);

    const steps = [
        { id: 1, label: 'Konfigurasi Periode' },
        { id: 2, label: 'Pemetaan Kelas' },
        { id: 3, label: 'Verifikasi Siswa' },
        { id: 4, label: 'Eksekusi' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                     <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Kenaikan{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Kelas
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                            <ArrowUpCircle className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Atur perpindahan siswa ke tingkat selanjutnya.
                    </p>
                </div>
            </div>

            {/* Step Indicator - Refined Style */}
            <div className="border-b border-slate-200 bg-white sticky top-0 z-10">
                <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                    {steps.map((step) => (
                        <div
                            key={step.id}
                            className={cn(
                                "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all flex items-center gap-2",
                                currentStep === step.id
                                    ? "border-blue-600 text-blue-700"
                                    : currentStep > step.id
                                    ? "border-transparent text-slate-500 hover:text-slate-900 group cursor-pointer" 
                                    : "border-transparent text-slate-400 cursor-not-allowed"
                            )}
                            onClick={() => currentStep > step.id && setCurrentStep(step.id as Step)}
                        >
                            <span className={cn(
                                "inline-flex items-center justify-center w-6 h-6 rounded-full text-xs box-border border",
                                currentStep === step.id ? "bg-blue-50 border-blue-200 text-blue-700" : 
                                currentStep > step.id ? "bg-green-50 border-green-200 text-green-700" : "bg-slate-50 border-slate-200 text-slate-400"
                            )}>
                                {currentStep > step.id ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.id}
                            </span>
                            {step.label}
                        </div>
                    ))}
                </nav>
            </div>

            <Card className="border shadow-sm bg-white">
                <CardHeader className="pb-0">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0">
                            {currentStep === 1 && <Calendar className="h-5 w-5" />}
                            {currentStep === 2 && <Users className="h-5 w-5" />}
                            {currentStep === 3 && <UserCheck className="h-5 w-5" />}
                            {currentStep === 4 && <CheckCircle2 className="h-5 w-5" />}
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold text-gray-900">
                                {currentStep === 1 && 'Pilih Tahun Ajaran'}
                                {currentStep === 2 && 'Petakan Kelas Asal ke Tujuan'}
                                {currentStep === 3 && 'Verifikasi Status Siswa'}
                                {currentStep === 4 && 'Konfirmasi Akhir'}
                            </CardTitle>
                            <CardDescription className="mt-1">
                                {currentStep === 1 && 'Tentukan periode akademik untuk proses kenaikan kelas.'}
                                {currentStep === 2 && 'Pilih kelas asal dan pasangkan dengan kelas tujuan yang sesuai.'}
                                {currentStep === 3 && 'Periksa daftar siswa dan sesuaikan status kenaikan jika diperlukan.'}
                                {currentStep === 4 && 'Tinjau kembali ringkasan sebelum menyimpan perubahan.'}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-6 pt-2">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                            <Loader2 className="h-10 w-10 animate-spin mb-4 text-blue-600" />
                            <p className="font-medium">Memuat data...</p>
                        </div>
                    ) : (
                        <>
                            {/* STEP 1: CONFIGURATION */}
                            {currentStep === 1 && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-700">
                                                    Tahun Ajaran Asal
                                                </label>
                                                <Select value={sourceYearId} onValueChange={setSourceYearId}>
                                                    <SelectTrigger className="h-10 bg-white border-slate-300 focus:ring-blue-500">
                                                        <SelectValue placeholder="Pilih tahun..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {academicYears.map(y => (
                                                            <SelectItem key={y.id} value={y.id}>{y.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <p className="text-[13px] text-muted-foreground leading-snug">
                                                    Tahun akademik di mana siswa saat ini berada (Sumber Data).
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-700">
                                                    Tahun Ajaran Tujuan
                                                </label>
                                                <Select value={targetYearId} onValueChange={setTargetYearId}>
                                                    <SelectTrigger disabled={!sourceYearId} className="h-10 bg-white border-slate-300 focus:ring-blue-500">
                                                        <SelectValue placeholder="Pilih tahun..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {filteredTargetYears.map(y => (
                                                            <SelectItem key={y.id} value={y.id}>{y.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <p className="text-[13px] text-muted-foreground leading-snug">
                                                    Tahun akademik baru tujuan promosi siswa.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <Alert className="bg-blue-50 text-blue-900 border-blue-100 flex items-start gap-3 p-4">
                                        <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                        <div>
                                            <AlertTitle className="font-semibold text-blue-800 mb-1">Informasi</AlertTitle>
                                            <AlertDescription className="text-blue-700/90 leading-relaxed">
                                                Sistem akan memuat semua kelas reguler dari tahun ajaran asal yang dipilih. Pastikan Data Kelas Tujuan (Tingkat Lanjut) sudah dibuat sebelum melanjutkan.
                                            </AlertDescription>
                                        </div>
                                    </Alert>
                                </div>
                            )}

                            {/* STEP 2: MAPPING */}
                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between bg-slate-50/50 p-4 rounded-lg border border-slate-100">
                                        <div className="text-sm text-slate-600">
                                            Ditemukan <strong>{sourceClasses.length}</strong> kelas asal.
                                        </div>
                                        {selectedClassIds.length > 0 && (
                                            <Badge variant="secondary" className="bg-blue-50 text-blue-800 border border-blue-200 text-xs font-medium">
                                                {selectedClassIds.length} Kelas Dipilih
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                        {sourceClasses.map(c => {
                                            const classIdStr = String(c.id);
                                            const isSelected = selectedClassIds.includes(classIdStr);
                                            const targetId = classMapping[classIdStr];
                                            
                                            return (
                                                <div 
                                                    key={c.id}
                                                    className={cn(
                                                        "group rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden",
                                                        isSelected 
                                                            ? "border-blue-400 ring-2 ring-blue-100 shadow-md bg-white" 
                                                            : "border-slate-200 hover:border-slate-300 hover:shadow-sm bg-white"
                                                    )}
                                                    onClick={() => handleClassSelect(classIdStr)}
                                                >
                                                    <div className={cn(
                                                        "p-4 border-b flex items-start justify-between",
                                                        isSelected ? "bg-blue-50/30 border-blue-100" : "bg-slate-50/30 border-slate-100"
                                                    )}>
                                                        <div>
                                                            <div className="font-bold text-slate-800 flex items-center gap-2 text-base">
                                                                {c.name}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1.5 font-medium">
                                                                <Users className="h-3.5 w-3.5" />
                                                                {c.total_students} Siswa
                                                            </div>
                                                        </div>
                                                        <Checkbox 
                                                            checked={isSelected} 
                                                            className="data-[state=checked]:bg-blue-700 data-[state=checked]:border-blue-700 h-5 w-5 rounded-md border-slate-300" 
                                                        />
                                                    </div>

                                                    {isSelected && (
                                                        <div className="p-4 bg-white animate-in slide-in-from-top-2 duration-200" onClick={e => e.stopPropagation()}>
                                                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                                                                <ArrowRight className="h-3 w-3" />
                                                                Target Kelas
                                                            </div>
                                                            <Select 
                                                                value={targetId || ''} 
                                                                onValueChange={(val) => setClassMapping(prev => ({ ...prev, [classIdStr]: val }))}
                                                            >
                                                                <SelectTrigger className="h-10 w-full border-slate-300 focus:ring-blue-500">
                                                                    <SelectValue placeholder="Pilih Target..." />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {targetClasses
                                                                        .filter(tc => tc.id !== c.id)
                                                                        .sort((a, b) => a.name.localeCompare(b.name))
                                                                        .map(tc => (
                                                                            <SelectItem key={tc.id} value={String(tc.id)}>
                                                                                {tc.name}
                                                                            </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    
                                    {sourceClasses.length === 0 && (
                                        <div className="flex flex-col items-center justify-center py-16 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/30">
                                            <Info className="h-10 w-10 mb-3 text-slate-300" />
                                            <p className="font-medium">Tidak ada kelas reguler ditemukan</p>
                                            <p className="text-sm mt-1">Pastikan tahun ajaran asal memiliki data kelas.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* STEP 3: VERIFICATION */}
                            {currentStep === 3 && (
                                <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                                    <Table>
                                        <TableHeader className="bg-slate-50 border-b border-slate-200">
                                            <TableRow className="hover:bg-slate-50 border-0">
                                                <TableHead className="w-[30%] py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Siswa</TableHead>
                                                <TableHead className="w-[20%] py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Kelas Asal</TableHead>
                                                <TableHead className="w-[30%] py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Status & Target</TableHead>
                                                <TableHead className="w-[20%] py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Aksi Manual</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {promotionRecords.map((record) => {
                                                const sourceClassName = sourceClasses.find(c => String(c.id) === record.currentClassId)?.name;
                                                const targetClassName = targetClasses.find(c => String(c.id) === record.targetClassId)?.name;

                                                return (
                                                    <TableRow key={record.studentId} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100">
                                                        <TableCell className="font-medium align-top py-3">
                                                            <div className="font-semibold text-slate-900">{record.studentName}</div>
                                                            <div className="text-xs text-slate-500 font-mono mt-0.5 bg-slate-100 inline-block px-1.5 py-0.5 rounded border border-slate-200">
                                                                {record.nisn}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="align-top py-3">
                                                            <Badge variant="outline" className="font-medium text-slate-600 border-slate-300">
                                                                {sourceClassName}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="align-top py-3">
                                                            <div className="flex flex-col gap-2">
                                                                {record.action === 'PROMOTE' && (
                                                                    <div className="flex items-center gap-2 text-sm bg-green-50 p-2 rounded-md border border-green-100 w-fit">
                                                                        <Badge variant="outline" className="text-green-700 bg-white border-green-200 shadow-sm">Naik</Badge>
                                                                        <ArrowRight className="h-3 w-3 text-green-400" />
                                                                        <span className="font-semibold text-green-800">{targetClassName || '-'}</span>
                                                                    </div>
                                                                )}
                                                                {record.action === 'STAY' && (
                                                                    <div className="bg-amber-50 p-2 rounded-md border border-amber-100 w-fit">
                                                                         <Badge variant="outline" className="text-amber-700 bg-white border-amber-200 shadow-sm">Tinggal Kelas</Badge>
                                                                    </div>
                                                                   
                                                                )}
                                                                {record.action === 'GRADUATE' && (
                                                                    <div className="bg-purple-50 p-2 rounded-md border border-purple-100 w-fit">
                                                                        <Badge variant="outline" className="text-purple-700 bg-white border-purple-200 shadow-sm">Lulus</Badge>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right align-top py-3">
                                                            <Select 
                                                                value={record.action} 
                                                                onValueChange={(val: PromotionAction) => updatePromotionAction(record.studentId, val)}
                                                            >
                                                                <SelectTrigger className="w-[140px] h-9 text-xs ml-auto border-slate-300 focus:ring-blue-500">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent align="end">
                                                                    <SelectItem value="PROMOTE" className="text-xs">Naik Kelas</SelectItem>
                                                                    <SelectItem value="STAY" className="text-xs">Tinggal Kelas</SelectItem>
                                                                    <SelectItem value="GRADUATE" className="text-xs">Lulus</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}

                            {/* STEP 4: CONFIRMATION */}
                            {currentStep === 4 && (
                                <div className="space-y-8 max-w-3xl mx-auto py-8">
                                    <div className="grid grid-cols-3 gap-6">
                                        <Card className="bg-gradient-to-br from-green-50 to-white border-green-200 shadow-sm hover:shadow-md transition-shadow">
                                            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                                                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-3 border border-green-200">
                                                    <ArrowUpCircle className="h-6 w-6 text-green-600" />
                                                </div>
                                                <div className="text-3xl font-bold text-green-700">{stats.promoted}</div>
                                                <div className="text-xs font-bold text-green-600 uppercase tracking-wider mt-1">Siswa Naik</div>
                                            </CardContent>
                                        </Card>
                                        <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-200 shadow-sm hover:shadow-md transition-shadow">
                                            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                                                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-3 border border-amber-200">
                                                    <AlertCircle className="h-6 w-6 text-amber-600" />
                                                </div>
                                                <div className="text-3xl font-bold text-amber-700">{stats.stayed}</div>
                                                <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mt-1">Tinggal Kelas</div>
                                            </CardContent>
                                        </Card>
                                        <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                                            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                                                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-3 border border-purple-200">
                                                    <CheckCircle2 className="h-6 w-6 text-purple-600" />
                                                </div>
                                                <div className="text-3xl font-bold text-purple-700">{stats.graduated}</div>
                                                <div className="text-xs font-bold text-purple-600 uppercase tracking-wider mt-1">Lulus</div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <div className="rounded-lg border border-red-200 bg-red-50 p-6 flex flex-col items-center text-center">
                                        <div className="bg-white p-3 rounded-full shadow-sm mb-4">
                                            <AlertCircle className="h-8 w-8 text-red-600" />
                                        </div>
                                        <h3 className="text-lg font-bold text-red-900 mb-2">Konfirmasi Tindakan Permanen</h3>
                                        <p className="text-red-700/80 max-w-lg leading-relaxed">
                                            Proses ini akan memperbarui data siswa secara permanen dan tidak dapat dibatalkan.
                                            Pastikan semua pemetaan dan status sudah benar sebelum melanjutkan.
                                        </p>
                                    </div>

                                    {stats.graduated > 0 && (
                                        <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 flex items-start gap-3">
                                            <AlertCircle className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-semibold text-purple-900">
                                                    {stats.graduated} siswa akan ditandai sebagai Lulus (Alumni)
                                                </p>
                                                <p className="text-xs text-purple-700 mt-1 leading-relaxed">
                                                    Siswa yang lulus akan dipindahkan ke daftar alumni dan tidak lagi terdaftar sebagai siswa aktif.
                                                    Tindakan ini tidak dapat dibalik secara otomatis.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </CardContent>

                <CardFooter className="flex justify-between border-t bg-slate-50/50 p-6">
                    <Button 
                        variant="outline" 
                        onClick={handleBack}
                        disabled={currentStep === 1 || isSubmitting}
                        className="bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-sm"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Kembali
                    </Button>

                    {currentStep < 4 ? (
                        <Button 
                            onClick={handleNext}
                            className="bg-blue-800 hover:bg-blue-900 text-white shadow-md hover:shadow-lg transition-all font-semibold px-6"
                        >
                            Lanjut
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button 
                            onClick={handleSubmit} 
                            disabled={isSubmitting}
                            className="bg-blue-800 hover:bg-blue-900 text-white shadow-md hover:shadow-lg transition-all font-semibold px-6"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Memproses...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Simpan Perubahan
                                </>
                            )}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
};
