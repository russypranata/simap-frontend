'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
    ArrowUpCircle,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    ChevronLeft,
    School,
    Users,
    ArrowRight,
    Check,
    Loader2,
    Info,
    GraduationCap,
    HelpCircle
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
    Select, 
    SelectContent, 
    SelectGroup,
    SelectItem, 
    SelectLabel,
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { academicYearService } from '../services/academicYearService';
import { classService } from '../services/classService';
import { studentService } from '../services/studentService';
import { AcademicYear } from '../types/academicYear';
import { Class } from '../types/class';
import { Student } from '../types/student';
import { PromotionAction, StudentPromotion, PromotionPayload } from '../types/promotion';

type Step = 1 | 2 | 3 | 4;

export const PromotionWorkflow: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<Step>(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Data State
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
    const [sourceClasses, setSourceClasses] = useState<Class[]>([]);
    const [targetClasses, setTargetClasses] = useState<Class[]>([]);
    
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
        return academicYears.filter(y => new Date(y.startDate) > new Date(sourceYear.startDate));
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

    // Reset selection and mapping when years change to avoid stale data
    useEffect(() => {
        setSelectedClassIds([]);
        setClassMapping({});
    }, [sourceYearId, targetYearId]);

    // Auto-select first available target year if nothing is selected
    useEffect(() => {
        if (sourceYearId && !targetYearId && filteredTargetYears.length > 0) {
            setTargetYearId(filteredTargetYears[0].id);
        }
    }, [sourceYearId, targetYearId, filteredTargetYears]);

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
        } catch (error) {
            toast.error('Gagal mengambil data tahun ajaran');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSourceClasses = async (yearId: string) => {
        try {
            setIsLoading(true);
            const allClasses = await classService.getClasses();
            setSourceClasses(allClasses.filter(c => c.academicYearId === yearId && c.type === 'REGULER'));
        } catch (error) {
            toast.error('Gagal mengambil data kelas asal');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTargetClasses = async (yearId: string) => {
        try {
            setIsLoading(true);
            const allClasses = await classService.getClasses();
            setTargetClasses(allClasses.filter(c => c.academicYearId === yearId && c.type === 'REGULER'));
        } catch (error) {
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
            
            // Validate mapping: All selected classes should have a target class if not Grade 12
            const unmappedClasses = selectedClassIds.filter(id => {
                const sourceClass = sourceClasses.find(c => c.id === id);
                return sourceClass?.grade !== 12 && !classMapping[id];
            });

            if (unmappedClasses.length > 0) {
                toast.error('Silakan tentukan kelas tujuan untuk semua kelas asal pilihan');
                return;
            }

            // Fetch students for all selected classes
            try {
                setIsLoading(true);
                const results = await Promise.all(
                    selectedClassIds.map(id => studentService.getStudentsByClass(id))
                );
                const allStudents = results.flat();
                
                if (allStudents.length === 0) {
                    toast.error('Tidak ada siswa di kelas terpilih');
                    setIsLoading(false);
                    return;
                }

                // Initialize promotion records
                const initialRecords: StudentPromotion[] = allStudents.map(s => {
                    const sClass = sourceClasses.find(c => c.id === s.classId);
                    const isGrade12 = sClass?.grade === 12;
                    
                    return {
                        studentId: s.id,
                        studentName: s.name,
                        nisn: s.nisn,
                        currentClassId: s.classId || '',
                        action: isGrade12 ? 'GRADUATE' : 'PROMOTE',
                        targetClassId: classMapping[s.classId || ''],
                    };
                });
                setPromotionRecords(initialRecords);
                setCurrentStep(3);
            } catch (error) {
                toast.error('Gagal mengambil data siswa');
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
            const payload: PromotionPayload = {
                sourceAcademicYearId: sourceYearId,
                targetAcademicYearId: targetYearId,
                promotions: promotionRecords,
            };
            await studentService.promoteStudents(payload);
            toast.success('Proses kenaikan kelas berhasil diselesaikan');
            
            // Reset state
            setCurrentStep(1);
            setSourceYearId('');
            setTargetYearId('');
            setSelectedClassIds([]);
            setPromotionRecords([]);
            setClassMapping({});
        } catch (error) {
            toast.error('Gagal memproses kenaikan kelas');
        } finally {
            setIsSubmitting(false);
        }
    };

    const updatePromotionAction = (studentId: string, action: PromotionAction) => {
        setPromotionRecords(prev => prev.map(r => 
            r.studentId === studentId ? { ...r, action } : r
        ));
    };

    // Helper to auto-suggest target class (e.g., X-A -> XI-A)
    const handleClassSelect = (sourceId: string) => {
        setSelectedClassIds(prev => {
            const isSelected = prev.includes(sourceId);
            const newSelection = isSelected 
                ? prev.filter(id => id !== sourceId) 
                : [...prev, sourceId];
            
            // Auto-map if possible
            if (!isSelected) {
                const source = sourceClasses.find(c => c.id === sourceId);
                if (source && source.grade < 12) {
                    // Look for a class in target year with same suffix and next grade
                    const sourceSuffix = source.name.includes('-') ? source.name.split('-')[1] : source.name.split(' ')[1] || '';
                    const target = targetClasses.find(tc => 
                        (tc.name.includes(sourceSuffix) || tc.name.endsWith(sourceSuffix)) && 
                        tc.grade === source.grade + 1
                    );
                    if (target) {
                        setClassMapping(cm => ({ ...cm, [sourceId]: target.id }));
                    }
                }
            } else {
                // Remove mapping if unselected
                const { [sourceId]: _, ...rest } = classMapping;
                setClassMapping(rest);
            }

            return newSelection;
        });
    };

    // Statistics for confirmation screen
    const stats = useMemo(() => {
        return {
            total: promotionRecords.length,
            promoted: promotionRecords.filter(r => r.action === 'PROMOTE').length,
            stayed: promotionRecords.filter(r => r.action === 'STAY').length,
            graduated: promotionRecords.filter(r => r.action === 'GRADUATE').length,
        };
    }, [promotionRecords]);

    return (
        <div className="space-y-6">
            {/* Header section */}
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
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <ArrowUpCircle className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Metode efisien untuk memindahkan data siswa antar tahun akademik.
                    </p>
                </div>
            </div>

            {/* Stepper */}
            <div className="flex items-center justify-between max-w-4xl mx-auto mb-10 overflow-x-auto pb-4 no-scrollbar">
                {[
                    { id: 1, label: 'Setup Periode' },
                    { id: 2, label: 'Pemetaan Kelas' },
                    { id: 3, label: 'Verifikasi Siswa' },
                    { id: 4, label: 'Eksekusi' }
                ].map((s) => (
                    <React.Fragment key={s.id}>
                        <div className="flex flex-col items-center gap-3 min-w-[100px]">
                            <div className={cn(
                                "h-12 w-12 rounded-full flex items-center justify-center font-bold transition-all border-4 shadow-sm",
                                currentStep === s.id ? "bg-primary text-white border-blue-100 scale-110 shadow-primary/20" :
                                currentStep > s.id ? "bg-green-500 text-white border-green-100" :
                                "bg-white text-slate-300 border-slate-50"
                            )}>
                                {currentStep > s.id ? <Check className="h-6 w-6 stroke-[3]" /> : s.id}
                            </div>
                            <span className={cn(
                                "text-[11px] font-bold uppercase tracking-widest",
                                currentStep === s.id ? "text-primary" : "text-slate-400"
                            )}>
                                {s.label}
                            </span>
                        </div>
                        {s.id < 4 && (
                            <div className={cn(
                                "h-1 flex-1 mx-2 rounded-full",
                                currentStep > s.id ? "bg-green-500/30" : "bg-slate-100"
                            )} />
                        )}
                    </React.Fragment>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="bg-white border-b border-slate-100 pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg font-bold text-slate-900">
                                        {currentStep === 1 && "Konfigurasi Tahun Akademik"}
                                        {currentStep === 2 && "Seleksi & Pemetaan Kelas"}
                                        {currentStep === 3 && "Review Data Individu Siswa"}
                                        {currentStep === 4 && "Finalisasi & Konfirmasi"}
                                    </CardTitle>
                                    <CardDescription className="text-slate-500 font-medium">
                                        Langkah {currentStep} dari 4
                                    </CardDescription>
                                </div>
                                <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <Info className="h-5 w-5" />
                                </div>
                            </div>
                        </CardHeader>
                        
                        <CardContent className="p-6 min-h-[400px]">
                            {isLoading ? (
                                <div className="space-y-6">
                                    {currentStep === 2 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                            {[1, 2, 3, 4, 5, 6].map(i => (
                                                <Skeleton key={i} className="h-32 w-full rounded-2xl" />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <Skeleton className="h-40 w-full rounded-2xl" />
                                            <Skeleton className="h-40 w-full rounded-2xl" />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    {currentStep === 1 && (
                                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-700">
                                                        Tahun Ajaran Asal (Aktif)
                                                    </label>
                                                    <Select value={sourceYearId} onValueChange={setSourceYearId}>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Pilih Tahun Asal" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {academicYears.map(y => (
                                                                <SelectItem key={y.id} value={y.id}>
                                                                    {y.name} {y.isActive && " • Aktif"}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-700">
                                                        Tahun Ajaran Tujuan
                                                    </label>
                                                    <Select value={targetYearId} onValueChange={setTargetYearId}>
                                                        <SelectTrigger 
                                                            disabled={!sourceYearId}
                                                            className="w-full"
                                                        >
                                                            <SelectValue placeholder={sourceYearId ? "Pilih Tahun Tujuan" : "Pilih Tahun Asal Dulu"} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {filteredTargetYears.length > 0 ? (
                                                                filteredTargetYears.map(y => (
                                                                    <SelectItem key={y.id} value={y.id}>
                                                                        {y.name}
                                                                    </SelectItem>
                                                                ))
                                                            ) : (
                                                                <div className="p-2 text-center text-xs text-muted-foreground">
                                                                    Tidak ada data
                                                                </div>
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            
                                            <Alert className="bg-blue-50 border-blue-100">
                                                <AlertCircle className="h-4 w-4 text-blue-600" />
                                                <AlertTitle className="text-blue-800 font-semibold">Peringatan Keamanan Data</AlertTitle>
                                                <AlertDescription className="text-blue-700">
                                                    Proses kenaikan kelas bersifat massal dan mempengaruhi basis data inti. Pastikan target tahun ajaran sudah memiliki struktur kelas yang sesuai.
                                                </AlertDescription>
                                            </Alert>
                                        </div>
                                    )}

                                    {currentStep === 2 && (
                                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                            <div className="border rounded-md overflow-hidden">
                                                <table className="w-full text-sm text-left">
                                                    <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                                                        <tr>
                                                            <th className="w-[50px] p-4 font-semibold text-xs uppercase tracking-wider text-center">
                                                                #
                                                            </th>
                                                            <th className="p-4 font-semibold text-xs uppercase tracking-wider">Kelas Asal</th>
                                                            <th className="p-4 font-semibold text-xs uppercase tracking-wider">Jumlah Siswa</th>
                                                            <th className="p-4 font-semibold text-xs uppercase tracking-wider">Target Kelas Tujuan</th>
                                                            <th className="p-4 font-semibold text-xs uppercase tracking-wider text-center">Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100">
                                                        {sourceClasses.length === 0 ? (
                                                            <tr>
                                                                <td colSpan={5} className="p-8 text-center text-slate-500">
                                                                    Tidak ada data kelas ditemukan.
                                                                </td>
                                                            </tr>
                                                        ) : (
                                                            sourceClasses.map(c => (
                                                                <tr key={c.id} className={cn(
                                                                    "hover:bg-slate-50 transition-colors",
                                                                    selectedClassIds.includes(c.id) && "bg-blue-50/30"
                                                                )}>
                                                                    <td className="p-4 text-center">
                                                                        <Checkbox
                                                                            checked={selectedClassIds.includes(c.id)}
                                                                            onCheckedChange={() => handleClassSelect(c.id)}
                                                                        />
                                                                    </td>
                                                                    <td className="p-4 font-medium text-slate-900">
                                                                        {c.name}
                                                                    </td>
                                                                    <td className="p-4 text-slate-600">
                                                                        <div className="flex items-center gap-2">
                                                                            <Users className="h-4 w-4 text-slate-400" />
                                                                            {c.totalStudents}
                                                                        </div>
                                                                    </td>
                                                                    <td className="p-4">
                                                                        {selectedClassIds.includes(c.id) ? (
                                                                            c.grade === 12 ? (
                                                                                <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                                                                                    <GraduationCap className="h-3 w-3 mr-1" />
                                                                                    Otomatis Lulus
                                                                                </Badge>
                                                                            ) : (
                                                                                <Select
                                                                                    value={classMapping[c.id]}
                                                                                    onValueChange={(val) => setClassMapping(prev => ({ ...prev, [c.id]: val }))}
                                                                                >
                                                                                    <SelectTrigger className="h-9 w-full min-w-[180px]">
                                                                                        <SelectValue placeholder="Pilih Tujuan..." />
                                                                                    </SelectTrigger>
                                                                                    <SelectContent>
                                                                                        {targetClasses.length > 0 ? (
                                                                                            [10, 11, 12].map(grade => {
                                                                                                const classesInGrade = targetClasses.filter(tc => tc.grade === grade);
                                                                                                if (classesInGrade.length === 0) return null;
                                                                                                return (
                                                                                                    <SelectGroup key={grade}>
                                                                                                        <SelectLabel className="text-xs font-bold text-slate-400">
                                                                                                            Tingkat {grade}
                                                                                                        </SelectLabel>
                                                                                                        {classesInGrade
                                                                                                            .sort((a, b) => a.name.localeCompare(b.name))
                                                                                                            .map(tc => (
                                                                                                                <SelectItem key={tc.id} value={tc.id}>
                                                                                                                    {tc.name}
                                                                                                                </SelectItem>
                                                                                                            ))
                                                                                                        }
                                                                                                    </SelectGroup>
                                                                                                );
                                                                                            })
                                                                                        ) : (
                                                                                            <div className="p-2 text-center text-xs text-muted-foreground">
                                                                                                Kosong
                                                                                            </div>
                                                                                        )}
                                                                                    </SelectContent>
                                                                                </Select>
                                                                            )
                                                                        ) : (
                                                                            <span className="text-slate-400 text-xs italic">Pilih kelas dulu</span>
                                                                        )}
                                                                    </td>
                                                                    <td className="p-4 text-center">
                                                                        {selectedClassIds.includes(c.id) && classMapping[c.id] && (
                                                                            (() => {
                                                                                const targetClass = targetClasses.find(tc => tc.id === classMapping[c.id]);
                                                                                if (!targetClass) return null;
                                                                                if (targetClass.grade === c.grade) {
                                                                                    return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Tinggal Kelas</Badge>;
                                                                                }
                                                                                if (targetClass.grade > c.grade + 1) {
                                                                                    return <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">Lompat</Badge>;
                                                                                }
                                                                                return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Promosi</Badge>;
                                                                            })()
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {currentStep === 3 && (
                                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                            <div className="border rounded-md overflow-hidden">
                                                <table className="w-full text-sm text-left">
                                                    <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                                                        <tr>
                                                            <th className="p-4 font-semibold text-xs uppercase tracking-wider">Informasi Siswa</th>
                                                            <th className="p-4 font-semibold text-xs uppercase tracking-wider text-right">Opsi Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100">
                                                        {promotionRecords.map((record) => (
                                                            <tr key={record.studentId} className="hover:bg-slate-50 transition-colors">
                                                                <td className="p-4">
                                                                    <div className="font-medium text-slate-900">{record.studentName}</div>
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        <Badge variant="outline" className="text-xs font-normal text-slate-500 border-slate-200">
                                                                            {record.nisn}
                                                                        </Badge>
                                                                        <ArrowRight className="h-3 w-3 text-slate-400" />
                                                                        <span className="text-xs text-slate-500">
                                                                            {sourceClasses.find(c => c.id === record.currentClassId)?.name}
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <td className="p-4 text-right">
                                                                    <div className="flex justify-end gap-2">
                                                                        {(['PROMOTE', 'STAY', 'GRADUATE'] as const).map(act => (
                                                                            <Button
                                                                                key={act}
                                                                                size="sm"
                                                                                variant={record.action === act ? "default" : "outline"}
                                                                                onClick={() => updatePromotionAction(record.studentId, act)}
                                                                                className={cn(
                                                                                    "h-8 text-xs font-semibold",
                                                                                    record.action === act && act === 'PROMOTE' && "bg-green-600 hover:bg-green-700",
                                                                                    record.action === act && act === 'STAY' && "bg-amber-600 hover:bg-amber-700",
                                                                                    record.action === act && act === 'GRADUATE' && "bg-blue-600 hover:bg-blue-700",
                                                                                )}
                                                                            >
                                                                                {act === 'PROMOTE' ? 'Naik' : act === 'STAY' ? 'Tinggal' : 'Lulus'}
                                                                            </Button>
                                                                        ))}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {currentStep === 4 && (
                                        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <Card className="bg-slate-50 border-slate-200 shadow-none">
                                                    <CardContent className="p-4">
                                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Periode Asal</div>
                                                        <div className="text-lg font-bold text-slate-900">
                                                            {academicYears.find(y => y.id === sourceYearId)?.name}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                                <Card className="bg-green-50 border-green-100 shadow-none">
                                                    <CardContent className="p-4">
                                                        <div className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">Periode Tujuan</div>
                                                        <div className="text-lg font-bold text-green-900">
                                                            {academicYears.find(y => y.id === targetYearId)?.name}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>

                                            <div className="space-y-4">
                                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Statistik Perubahan</h4>
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                    {[
                                                        { label: 'Total Siswa', val: stats.total, color: 'text-slate-900', bg: 'bg-white border-slate-200' },
                                                        { label: 'Naik Kelas', val: stats.promoted, color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
                                                        { label: 'Tinggal', val: stats.stayed, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
                                                        { label: 'Lulus', val: stats.graduated, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
                                                    ].map(s => (
                                                        <Card key={s.label} className={cn("border shadow-sm", s.bg)}>
                                                            <CardContent className="p-4 flex flex-col items-center justify-center gap-1">
                                                                <div className={cn("text-2xl font-bold", s.color)}>{s.val}</div>
                                                                <div className="text-xs text-slate-500 font-medium uppercase">{s.label}</div>
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 flex flex-col items-center text-center gap-4">
                                                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                    <CheckCircle2 className="h-6 w-6" />
                                                </div>
                                                <div className="max-w-md space-y-2">
                                                    <h4 className="text-lg font-bold text-blue-900">Konfirmasi Tahap Akhir</h4>
                                                    <p className="text-blue-700 text-sm">
                                                        Dengan menekan tombol eksekusi, sistem akan memproses data siswa ke tahun ajaran yang baru secara permanen. Tindakan ini tidak dapat dibatalkan melalui UI.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </CardContent>

                        <CardFooter className="bg-slate-50/50 border-t border-slate-100 flex justify-between p-6">
                            <Button 
                                variant="outline"
                                onClick={handleBack}
                                disabled={currentStep === 1 || isLoading || isSubmitting}
                                className="h-10"
                            >
                                <ChevronLeft className="h-4 w-4 mr-2" />
                                Kembali
                            </Button>
                            {currentStep < 4 ? (
                                <Button 
                                    onClick={handleNext} 
                                    disabled={isLoading}
                                    className="h-10 bg-blue-800 hover:bg-blue-900"
                                >
                                    Lanjut
                                    <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                            ) : (
                                <Button 
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="h-10 bg-green-600 hover:bg-green-700"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Memproses...
                                        </>
                                    ) : (
                                        <>
                                            Eksekusi Sekarang
                                            <ArrowUpCircle className="h-4 w-4 ml-2" />
                                        </>
                                    )}
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                </div>

                <div className="space-y-6">
                    {/* Status Highlights Card */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-3 pt-3">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Ringkasan Konfigurasi</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            {[
                                { label: 'Tahun Asal', val: academicYears.find(y => y.id === sourceYearId)?.name, active: !!sourceYearId },
                                { label: 'Tahun Tujuan', val: academicYears.find(y => y.id === targetYearId)?.name, active: !!targetYearId },
                                { label: 'Kelas Terpilih', val: `${selectedClassIds.length} Kelas`, active: selectedClassIds.length > 0 },
                                { label: 'Estimasi Siswa', val: `${promotionRecords.length} Siswa`, active: promotionRecords.length > 0 },
                            ].map((item, idx) => (
                                <div key={idx} className="flex justify-between items-start">
                                    <div className="text-xs font-medium text-slate-500">{item.label}</div>
                                    <div className={cn(
                                        "text-xs font-bold transition-all",
                                        item.active ? "text-blue-600" : "text-slate-300"
                                    )}>
                                        {item.val || '-'}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="bg-blue-600 border-blue-600 text-white shadow-md">
                        <CardHeader className="pb-2 pt-4">
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <HelpCircle className="h-4 w-4 text-blue-200" />
                                BANTUAN CEPAT
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-blue-100 leading-relaxed pb-4">
                            Sistem secara otomatis menyarankan <b>Target Kelas</b> (misal: X-A ke XI-A). Anda dapat mengubah saran ini di Langkah Pemetaan Kelas.
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
