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
                    <Card className="border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden border-0">
                        <CardHeader className="bg-white border-b border-slate-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-bold text-slate-900">
                                        {currentStep === 1 && "Konfigurasi Tahun Akademik"}
                                        {currentStep === 2 && "Seleksi & Pemetaan Kelas"}
                                        {currentStep === 3 && "Review Data Individu Siswa"}
                                        {currentStep === 4 && "Finalisasi & Konfirmasi"}
                                    </CardTitle>
                                    <CardDescription className="text-slate-500 font-medium">
                                        Langkah {currentStep} dari 4
                                    </CardDescription>
                                </div>
                                <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <Info className="h-5 w-5" />
                                </div>
                            </div>
                        </CardHeader>
                        
                        <CardContent className="p-8 min-h-[400px]">
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
                                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                <div className="space-y-4 group">
                                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-1">
                                                        <div className="h-2 w-2 rounded-full bg-blue-600 shadow-sm" />
                                                        TAHUN AJARAN ASAL (AKTIF)
                                                    </label>
                                                    <Select value={sourceYearId} onValueChange={setSourceYearId}>
                                                        <SelectTrigger className="h-14 border-slate-200 focus:ring-primary rounded-2xl shadow-sm text-base font-semibold">
                                                            <SelectValue placeholder="Pilih Tahun Asal" />
                                                        </SelectTrigger>
                                                        <SelectContent className="rounded-xl border-slate-200">
                                                            {academicYears.map(y => (
                                                                <SelectItem key={y.id} value={y.id} className="focus:bg-blue-50 focus:text-blue-700">
                                                                    {y.name} {y.isActive && " • Aktif Sistem"}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-4 group">
                                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-1">
                                                        <div className="h-2 w-2 rounded-full bg-green-600 shadow-sm" />
                                                        TAHUN AJARAN TUJUAN
                                                    </label>
                                                    <Select value={targetYearId} onValueChange={setTargetYearId}>
                                                        <SelectTrigger 
                                                            disabled={!sourceYearId}
                                                            className="h-14 border-green-200 bg-green-50/20 focus:ring-green-500 rounded-2xl shadow-sm text-base font-semibold text-green-700 disabled:opacity-50"
                                                        >
                                                            <SelectValue placeholder={sourceYearId ? "Pilih Tahun Tujuan" : "Pilih Tahun Asal Dulu"} />
                                                        </SelectTrigger>
                                                        <SelectContent className="rounded-xl border-green-100">
                                                            {filteredTargetYears.length > 0 ? (
                                                                filteredTargetYears.map(y => (
                                                                    <SelectItem key={y.id} value={y.id} className="focus:bg-green-50 focus:text-green-700">
                                                                        {y.name}
                                                                    </SelectItem>
                                                                ))
                                                            ) : (
                                                                <div className="p-4 text-center text-xs font-bold text-slate-400">
                                                                    Tidak ada tahun ajaran masa depan
                                                                </div>
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            
                                            <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-blue-100/50 flex gap-4">
                                                <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                                                    <AlertCircle className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-blue-900 mb-1">Peringatan Keamanan Data</h4>
                                                    <p className="text-sm text-blue-800/80 leading-relaxed font-medium">
                                                        Proses kenaikan kelas bersifat massal dan mempengaruhi basis data inti. Pastikan target tahun ajaran sudah memiliki struktur kelas yang sesuai.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {currentStep === 2 && (
                                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                                                {sourceClasses.map(c => (
                                                    <div 
                                                        key={c.id}
                                                        className={cn(
                                                            "relative p-5 rounded-3xl border-2 transition-all duration-300 flex flex-col gap-4",
                                                            selectedClassIds.includes(c.id) 
                                                                ? "border-primary bg-primary/5 shadow-lg shadow-primary/10 ring-1 ring-primary/20" 
                                                                : "border-slate-100 hover:border-slate-300 hover:bg-slate-50 shadow-sm"
                                                        )}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className={cn(
                                                                "h-12 w-12 rounded-2xl flex items-center justify-center shadow-inner transition-all",
                                                                selectedClassIds.includes(c.id) ? "bg-primary text-white scale-110" : "bg-slate-100 text-slate-400"
                                                            )}>
                                                                <School className="h-6 w-6" />
                                                            </div>
                                                            <Checkbox 
                                                                checked={selectedClassIds.includes(c.id)} 
                                                                onCheckedChange={() => handleClassSelect(c.id)}
                                                                className="h-6 w-6 rounded-lg data-[state=checked]:bg-primary"
                                                            />
                                                        </div>
                                                        <div>
                                                            <div className="font-extrabold text-slate-900 text-lg uppercase">{c.name}</div>
                                                            <div className="text-xs font-bold text-slate-500 mt-0.5 flex items-center gap-1.5 grayscale opacity-70">
                                                                <Users className="h-3.5 w-3.5" />
                                                                {c.totalStudents} Siswa Terdeteksi
                                                            </div>
                                                        </div>

                                                        {/* Target Mapping UI */}
                                                        {selectedClassIds.includes(c.id) && (
                                                            <div className="mt-2 pt-4 border-t border-primary/10 space-y-2 animate-in zoom-in-95 duration-200">
                                                                <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Target Kelas Tujuan</label>
                                                                {c.grade === 12 ? (
                                                                    <Badge className="w-full justify-center py-1.5 bg-blue-600 text-white rounded-lg border-0 font-bold">
                                                                        <GraduationCap className="h-3.5 w-3.5 mr-1.5" />
                                                                        OTOMATIS LULUS
                                                                    </Badge>
                                                                ) : (
                                                                    <Select 
                                                                        key={`select-${c.id}-${targetYearId}`}
                                                                        value={classMapping[c.id]} 
                                                                        onValueChange={(val) => setClassMapping(prev => ({ ...prev, [c.id]: val }))}
                                                                    >
                                                                        <SelectTrigger className="h-10 bg-white border-primary/20 text-xs font-bold rounded-xl focus:ring-primary shadow-sm">
                                                                            <SelectValue placeholder="Pilih Tujuan..." />
                                                                        </SelectTrigger>
                                                                        <SelectContent className="rounded-xl border-slate-200">
                                                                            {targetClasses.length > 0 ? (
                                                                                [10, 11, 12].map(grade => {
                                                                                    const classesInGrade = targetClasses.filter(tc => tc.grade === grade);
                                                                                    if (classesInGrade.length === 0) return null;
                                                                                    return (
                                                                                        <SelectGroup key={grade}>
                                                                                            <SelectLabel className="px-2 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                                                                                Tingkat {grade}
                                                                                            </SelectLabel>
                                                                                            {classesInGrade
                                                                                                .sort((a, b) => a.name.localeCompare(b.name))
                                                                                                .map(tc => (
                                                                                                    <SelectItem key={tc.id} value={tc.id} className="text-xs font-bold">
                                                                                                        {tc.name} {tc.grade === c.grade + 1 && "⭐"}
                                                                                                    </SelectItem>
                                                                                                ))
                                                                                            }
                                                                                        </SelectGroup>
                                                                                    );
                                                                                })
                                                                            ) : (
                                                                                <div className="p-4 text-center text-[10px] font-bold text-slate-400">
                                                                                    Belum ada data kelas di tahun tujuan
                                                                                </div>
                                                                            )}
                                                                        </SelectContent>
                                                                    </Select>
                                                                )}

                                                                {/* Status Indicator Badge */}
                                                                {classMapping[c.id] && (
                                                                    <div className="mt-2 flex items-center justify-between">
                                                                        {(() => {
                                                                            const targetClass = targetClasses.find(tc => tc.id === classMapping[c.id]);
                                                                            if (!targetClass) return null;
                                                                            if (targetClass.grade === c.grade) {
                                                                                return <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-100 text-[9px] font-bold px-1.5 py-0 h-4">TINGGAL KELAS</Badge>;
                                                                            }
                                                                            if (targetClass.grade > c.grade + 1) {
                                                                                return <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-100 text-[9px] font-bold px-1.5 py-0 h-4">LOMPAT KELAS</Badge>;
                                                                            }
                                                                            return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-100 text-[9px] font-bold px-1.5 py-0 h-4">PROMOSI NORMAL</Badge>;
                                                                        })()}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            {sourceClasses.length === 0 && (
                                                <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-300">
                                                    <School className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                                    <p className="text-slate-500 font-bold text-lg">Tidak Ada Kelas Ditemukan</p>
                                                    <p className="text-slate-400 text-sm">Ganti tahun ajaran asal untuk mencari data lain.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {currentStep === 3 && (
                                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                            <div className="border border-slate-100 rounded-3xl overflow-hidden shadow-sm bg-white">
                                                <table className="w-full text-sm text-left">
                                                    <thead className="bg-slate-50/80 text-slate-400 border-b border-slate-100">
                                                        <tr>
                                                            <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest">Informasi Siswa</th>
                                                            <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-right">Opsi Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-50">
                                                        {promotionRecords.map((record) => (
                                                            <tr key={record.studentId} className="hover:bg-blue-50/30 transition-colors group">
                                                                <td className="px-6 py-5">
                                                                    <div className="font-extrabold text-slate-900 text-base">{record.studentName}</div>
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        <Badge variant="outline" className="text-[10px] font-bold px-1.5 py-0 rounded bg-slate-50 border-slate-200 text-slate-400">
                                                                            {record.nisn}
                                                                        </Badge>
                                                                        <ArrowRight className="h-3 w-3 text-slate-300" />
                                                                        <span className="text-[10px] font-bold text-primary/60 uppercase">
                                                                            {sourceClasses.find(c => c.id === record.currentClassId)?.name}
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-5 text-right">
                                                                    <div className="flex justify-end gap-1.5">
                                                                        {(['PROMOTE', 'STAY', 'GRADUATE'] as const).map(act => (
                                                                            <button
                                                                                key={act}
                                                                                onClick={() => updatePromotionAction(record.studentId, act)}
                                                                                className={cn(
                                                                                    "h-9 px-4 rounded-xl text-[10px] font-extrabold uppercase transition-all border-2",
                                                                                    record.action === act 
                                                                                        ? act === 'PROMOTE' ? "bg-green-600 text-white border-green-600 shadow-lg shadow-green-200" :
                                                                                          act === 'STAY' ? "bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-200" :
                                                                                          "bg-blue-800 text-white border-blue-800 shadow-lg shadow-blue-200"
                                                                                        : "bg-white text-slate-400 border-slate-100 hover:border-slate-200 hover:text-slate-600"
                                                                                )}
                                                                            >
                                                                                {act === 'PROMOTE' ? 'Naik' : act === 'STAY' ? 'Tinggal' : 'Lulus'}
                                                                            </button>
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
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-3xl">
                                                    <div className="text-[11px] text-slate-400 uppercase font-black tracking-widest mb-3 flex items-center gap-2">
                                                        <div className="h-3 w-3 rounded-full bg-slate-400" />
                                                        Periode Asal
                                                    </div>
                                                    <div className="text-2xl font-black text-slate-900 tracking-tight">
                                                        {academicYears.find(y => y.id === sourceYearId)?.name}
                                                    </div>
                                                </div>
                                                <div className="p-6 bg-green-50/50 border border-green-100 rounded-3xl">
                                                    <div className="text-[11px] text-green-600 uppercase font-black tracking-widest mb-3 flex items-center gap-2">
                                                        <div className="h-3 w-3 rounded-full bg-green-500" />
                                                        Periode Tujuan
                                                    </div>
                                                    <div className="text-2xl font-black text-green-900 tracking-tight">
                                                        {academicYears.find(y => y.id === targetYearId)?.name}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest px-1">Statistik Perubahan</h4>
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                    {[
                                                        { label: 'Total Siswa', val: stats.total, color: 'text-slate-900', bg: 'bg-white' },
                                                        { label: 'Naik Kelas', val: stats.promoted, color: 'text-green-600', bg: 'bg-green-50' },
                                                        { label: 'Tinggal', val: stats.stayed, color: 'text-amber-500', bg: 'bg-amber-50' },
                                                        { label: 'Lulus', val: stats.graduated, color: 'text-blue-600', bg: 'bg-blue-50' },
                                                    ].map(s => (
                                                        <div key={s.label} className={cn("p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-1", s.bg)}>
                                                            <div className={cn("text-3xl font-black tracking-tighter", s.color)}>{s.val}</div>
                                                            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{s.label}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="p-8 bg-blue-900 rounded-[2.5rem] text-white flex flex-col items-center text-center gap-6 shadow-2xl shadow-blue-900/40 relative overflow-hidden group">
                                                {/* Decorative background elements */}
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-500" />
                                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12 transition-transform group-hover:scale-125 duration-700" />
                                                
                                                <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md mb-2">
                                                    <CheckCircle2 className="h-8 w-8 text-white" />
                                                </div>
                                                <div className="relative z-10 max-w-md">
                                                    <h4 className="text-2xl font-black tracking-tight mb-2">Konfirmasi Tahap Akhir</h4>
                                                    <p className="text-blue-100/80 text-sm font-medium leading-relaxed">
                                                        Dengan menekan tombol eksekusi, sistem akan memproses data siswa ke tahun ajaran yang baru secara permanen. Tindakan ini tidak dapat dibatalkan melalui UI.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </CardContent>

                        <CardFooter className="bg-slate-50/80 border-t border-slate-100 flex justify-between p-8">
                            <Button 
                                variant="ghost" 
                                onClick={handleBack}
                                disabled={currentStep === 1 || isLoading || isSubmitting}
                                className="h-14 px-8 rounded-2xl font-bold text-slate-500 hover:bg-white hover:text-slate-900"
                            >
                                <ChevronLeft className="h-5 w-5 mr-3" />
                                Kembali
                            </Button>
                            {currentStep < 4 ? (
                                <Button 
                                    onClick={handleNext} 
                                    disabled={isLoading}
                                    className="h-14 px-10 bg-primary hover:bg-blue-800 text-white rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
                                >
                                    Lanjut
                                    <ChevronRight className="h-5 w-5 ml-3" />
                                </Button>
                            ) : (
                                <Button 
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="h-14 px-12 bg-green-600 hover:bg-green-700 text-white font-black rounded-2xl shadow-xl shadow-green-600/30 transition-all hover:scale-105 active:scale-95"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-5 w-5 mr-3 animate-spin stroke-[3]" />
                                            MEMPROSES DATA...
                                        </>
                                    ) : (
                                        <>
                                            EKSEKUSI SEKARANG
                                            <ArrowUpCircle className="h-5 w-5 ml-3" />
                                        </>
                                    )}
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                </div>

                <div className="space-y-6">
                    {/* Status Highlights Card */}
                    <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
                        <CardHeader className="bg-slate-50/50 pb-4">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500">Ringkasan Konfigurasi</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            {[
                                { label: 'Tahun Asal', val: academicYears.find(y => y.id === sourceYearId)?.name, active: !!sourceYearId },
                                { label: 'Tahun Tujuan', val: academicYears.find(y => y.id === targetYearId)?.name, active: !!targetYearId },
                                { label: 'Kelas Terpilih', val: `${selectedClassIds.length} Kelas`, active: selectedClassIds.length > 0 },
                                { label: 'Estimasi Siswa', val: `${promotionRecords.length} Siswa`, active: promotionRecords.length > 0 },
                            ].map((item, idx) => (
                                <div key={idx} className="flex justify-between items-start">
                                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</div>
                                    <div className={cn(
                                        "text-xs font-black transition-all",
                                        item.active ? "text-primary bg-primary/5 px-2 py-1 rounded-lg" : "text-slate-300"
                                    )}>
                                        {item.val || 'Pending'}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="border-0 bg-blue-600 rounded-3xl shadow-xl shadow-blue-600/20 text-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-black flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-xl">
                                    <HelpCircle className="h-5 w-5 text-white" />
                                </div>
                                BANTUAN CEPAT
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs font-semibold text-blue-100 leading-relaxed py-4 pt-0">
                            Sistem secara otomatis menyarankan <b>Target Kelas</b> (misal: X-A ke XI-A). Anda dapat mengubah saran ini di Langkah Pemetaan Kelas.
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
