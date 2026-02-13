'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowUpCircle,
    Check,
    ChevronRight,
    Users,
    ArrowRightLeft,
    Save,
    Calendar,
    AlertCircle,
    ArrowRight,
    Search,
    Wand2,
    GraduationCap,
    UserX,
    TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

import { PromotionStep, PromotionWizardState, ClassMapping, StudentPromotion, PromotionAction, PromotionPayload } from '../types/promotion';
import { AcademicYear } from '../types/academicYear';
import { Class } from '../types/class';
import { promotionService } from '../services/promotionService';

// Steps configuration
const STEPS = [
    { id: 1, title: 'Konfigurasi Periode', icon: Calendar },
    { id: 2, title: 'Pemetaan Kelas', icon: ArrowRightLeft },
    { id: 3, title: 'Verifikasi Siswa', icon: Users },
    { id: 4, title: 'Eksekusi & Finalisasi', icon: Save },
];

export const PromotionWorkflow: React.FC = () => {
    const router = useRouter();

    // State
    const [currentStep, setCurrentStep] = useState<PromotionStep>(1);
    const [isLoading, setIsLoading] = useState(false);
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);

    // Wizard Data State
    const [sourceYearId, setSourceYearId] = useState<string>('');
    const [targetYearId, setTargetYearId] = useState<string>('');

    // Step 2 Data
    const [sourceClasses, setSourceClasses] = useState<Class[]>([]);
    const [targetClasses, setTargetClasses] = useState<Class[]>([]);
    const [mappings, setMappings] = useState<ClassMapping[]>([]);
    const [classSearch, setClassSearch] = useState('');

    // Step 3 Data
    const [students, setStudents] = useState<StudentPromotion[]>([]);
    const [studentSearch, setStudentSearch] = useState('');

    // Fetch initial data
    useEffect(() => {
        const fetchYears = async () => {
            setIsLoading(true);
            try {
                const years = await promotionService.getAcademicYears();
                setAcademicYears(years);
            } catch (error) {
                console.error("Failed to fetch years", error);
                toast.error("Gagal memuat data tahun ajaran");
            } finally {
                setIsLoading(false);
            }
        };
        fetchYears();
    }, []);

    // Fetch Classes for Step 2
    useEffect(() => {
        if (currentStep === 2 && sourceYearId && targetYearId) {
            const fetchData = async () => {
                setIsLoading(true);
                // Only fetch if we haven't already (or simple cache check)
                if (sourceClasses.length > 0 && sourceClasses[0].academicYearId === sourceYearId) return;

                try {
                    const [sClasses, tClasses] = await Promise.all([
                        promotionService.getClasses(sourceYearId),
                        promotionService.getClasses(targetYearId)
                    ]);

                    const sortedSource = sClasses.sort((a, b) => a.name.localeCompare(b.name));
                    const sortedTarget = tClasses.sort((a, b) => a.name.localeCompare(b.name));

                    setSourceClasses(sortedSource);
                    setTargetClasses(sortedTarget);

                    const newMappings = sortedSource.map(sc => ({
                        sourceClassId: sc.id,
                        sourceClassName: sc.name,
                        sourceGrade: sc.grade,
                        targetClassId: sc.grade === 12 ? 'GRADUATE' : 'IGNORE' as const,
                        targetClassName: sc.grade === 12 ? 'Lulus (Alumni)' : undefined
                    }));
                    setMappings(newMappings);

                } catch (err) {
                    console.error(err);
                    toast.error("Gagal memuat data kelas");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        }
    }, [currentStep, sourceYearId, targetYearId]);

    // Fetch Students for Step 3
    useEffect(() => {
        if (currentStep === 3) {
            const fetchStudents = async () => {
                setIsLoading(true);

                const activeMappings = mappings.filter(m => m.targetClassId !== 'IGNORE');
                const sourceIds = activeMappings.map(m => m.sourceClassId);

                if (sourceIds.length === 0) {
                    setStudents([]);
                    setIsLoading(false);
                    return;
                }

                try {
                    const rawStudents = await promotionService.getStudentsByClass(sourceIds);

                    const processedStudents = rawStudents.map(s => {
                        const mapping = activeMappings.find(m => m.sourceClassId === s.currentClassId);
                        let action: PromotionAction = 'PROMOTE';
                        let targetClassId = mapping?.targetClassId as string;
                        let targetClassName = mapping?.targetClassName;

                        if (mapping?.targetClassId === 'GRADUATE') {
                            action = 'GRADUATE';
                            targetClassId = undefined;
                            targetClassName = 'Lulus (Alumni)';
                        } else {
                            action = 'PROMOTE';
                        }

                        return {
                            ...s,
                            action,
                            targetClassId: action === 'PROMOTE' ? targetClassId : undefined,
                            targetClassName
                        };
                    });

                    setStudents(processedStudents);
                } catch (err) {
                    toast.error("Gagal memuat data siswa");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchStudents();
        }
    }, [currentStep]);

    const handleAutoMap = async () => {
        setIsLoading(true);
        try {
            const newMappings = await promotionService.autoMapClasses(sourceClasses, targetClasses);
            setMappings(newMappings);
            toast.success("Pemetaan otomatis berhasil diterapkan");
        } catch (e) {
            toast.error("Gagal melakukan pemetaan otomatis");
        } finally {
            setIsLoading(false);
        }
    };

    const updateMapping = (sourceId: string, targetId: string) => {
        setMappings(prev => prev.map(m => {
            if (m.sourceClassId === sourceId) {
                let targetName: string | undefined = undefined;
                if (targetId === 'GRADUATE') targetName = 'Lulus (Alumni)';
                else if (targetId === 'IGNORE') targetName = undefined;
                else targetName = targetClasses.find(c => c.id === targetId)?.name;

                return {
                    ...m,
                    targetClassId: targetId as string | 'GRADUATE' | 'IGNORE',
                    targetClassName: targetName
                };
            }
            return m;
        }));
    };

    const updateStudentStatus = (studentId: string, action: PromotionAction) => {
        setStudents(prev => prev.map(s => {
            if (s.studentId === studentId) {
                let targetClassId = s.targetClassId;
                let targetClassName = s.targetClassName;

                if (action === 'PROMOTE') {
                    const mapping = mappings.find(m => m.sourceClassId === s.currentClassId);
                    if (mapping && mapping.targetClassId !== 'IGNORE' && mapping.targetClassId !== 'GRADUATE') {
                        targetClassId = mapping.targetClassId;
                        targetClassName = mapping.targetClassName;
                    }
                } else if (action === 'STAY') {
                     targetClassName = 'Tinggal Kelas (Stay)';
                } else if (action === 'GRADUATE') {
                    targetClassName = 'Lulus (Alumni)';
                }

                return { ...s, action, targetClassName };
            }
            return s;
        }));
    };

    const validateStep1 = (): boolean => {
        if (!sourceYearId || !targetYearId) {
            toast.error("Harap pilih Tahun Ajaran Asal dan Tujuan");
            return false;
        }
        if (sourceYearId === targetYearId) {
            toast.error("Tahun Ajaran Asal dan Tujuan tidak boleh sama");
            return false;
        }

        const source = academicYears.find(y => y.id === sourceYearId);
        const target = academicYears.find(y => y.id === targetYearId);

        if (source && target) {
            if (new Date(source.startDate) >= new Date(target.startDate)) {
                toast.error("Tahun Ajaran Tujuan harus lebih baru dari Tahun Ajaran Asal");
                return false;
            }
        }

        return true;
    };

    const validateStep2 = (): boolean => {
        const mappedCount = mappings.filter(m => m.targetClassId !== 'IGNORE').length;
        if (mappedCount === 0) {
            toast.error("Harap petakan setidaknya satu kelas");
            return false;
        }
        return true;
    };

    const handleNext = async () => {
        if (currentStep === 1) {
            if (!validateStep1()) return;
        }
        if (currentStep === 2) {
            if (!validateStep2()) return;
        }

        if (currentStep === 4) {
             setIsLoading(true);
             try {
                 const payload: PromotionPayload = {
                     sourceAcademicYearId: sourceYearId,
                     targetAcademicYearId: targetYearId,
                     promotions: students
                 };
                 await promotionService.executePromotion(payload);
                 toast.success("Proses kenaikan kelas berhasil diselesaikan!");
                 // Redirect to class list after a delay
                 setTimeout(() => {
                     router.push('/admin/class');
                 }, 1500);
             } catch (e) {
                 toast.error("Gagal memproses kenaikan kelas");
                 setIsLoading(false);
             }
             return;
        }

        if (currentStep < 4) {
            setCurrentStep((prev) => (prev + 1) as PromotionStep);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => (prev - 1) as PromotionStep);
        }
    };

    // --- RENDER STEPS ---

    const renderStep1 = () => (
        <div className="max-w-2xl mx-auto py-8">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Konfigurasi Periode Kenaikan</h2>
                <p className="text-slate-500 mt-2">
                    Tentukan tahun ajaran asal dan tahun ajaran tujuan untuk proses kenaikan kelas.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Source Year */}
                <Card className={cn("border-2 transition-all", sourceYearId ? "border-blue-200 bg-blue-50/30" : "border-slate-200")}>
                    <CardHeader>
                        <CardTitle className="text-base text-slate-500 uppercase tracking-wider font-semibold">Dari Tahun Ajaran</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Select value={sourceYearId} onValueChange={setSourceYearId}>
                            <SelectTrigger className="h-12 text-lg">
                                <SelectValue placeholder="Pilih Tahun Asal" />
                            </SelectTrigger>
                            <SelectContent>
                                {academicYears.map((year) => (
                                    <SelectItem key={year.id} value={year.id}>
                                        {year.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-slate-400 mt-2">
                            Pilih tahun ajaran yang sedang aktif atau yang akan ditinggalkan.
                        </p>
                    </CardContent>
                </Card>

                {/* Arrow Indicator (Desktop) */}
                <div className="hidden md:flex flex-col items-center justify-center -mx-4 z-10">
                    <div className="bg-slate-100 p-2 rounded-full border border-slate-200">
                        <ChevronRight className="h-6 w-6 text-slate-400" />
                    </div>
                </div>

                {/* Target Year */}
                <Card className={cn("border-2 transition-all", targetYearId ? "border-green-200 bg-green-50/30" : "border-slate-200")}>
                    <CardHeader>
                        <CardTitle className="text-base text-slate-500 uppercase tracking-wider font-semibold">Ke Tahun Ajaran</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Select value={targetYearId} onValueChange={setTargetYearId}>
                            <SelectTrigger className="h-12 text-lg">
                                <SelectValue placeholder="Pilih Tahun Tujuan" />
                            </SelectTrigger>
                            <SelectContent>
                                {academicYears
                                    .filter(y => sourceYearId ? y.id !== sourceYearId : true)
                                    .map((year) => (
                                    <SelectItem key={year.id} value={year.id}>
                                        {year.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-slate-400 mt-2">
                            Pilih tahun ajaran masa depan tempat siswa akan ditempatkan.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {sourceYearId && targetYearId && (
                 <Alert className="mt-8 bg-blue-50 border-blue-200 text-blue-800">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Konfirmasi Periode</AlertTitle>
                    <AlertDescription>
                        Anda akan memproses kenaikan kelas dari <strong>{academicYears.find(y => y.id === sourceYearId)?.name}</strong> ke <strong>{academicYears.find(y => y.id === targetYearId)?.name}</strong>.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );

    const renderStep2 = () => {
        const filteredMappings = mappings.filter(m =>
            m.sourceClassName.toLowerCase().includes(classSearch.toLowerCase())
        );

        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Pemetaan Kelas</h2>
                        <p className="text-slate-500 text-sm">
                            Pasangkan kelas asal dengan kelas tujuan di tahun ajaran baru.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                         <div className="relative w-full sm:w-[250px]">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Cari kelas..."
                                className="pl-9 h-9"
                                value={classSearch}
                                onChange={(e) => setClassSearch(e.target.value)}
                            />
                        </div>
                        <Button
                            variant="outline"
                            className="h-9 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                            onClick={handleAutoMap}
                            disabled={isLoading}
                        >
                            <Wand2 className="h-4 w-4 mr-2" />
                            Auto Map
                        </Button>
                    </div>
                </div>

                <div className="border rounded-md overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider w-[40%]">Kelas Asal</th>
                                <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider w-[10%] text-center"></th>
                                <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider w-[50%]">Kelas Tujuan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {filteredMappings.map((mapping) => (
                                <tr key={mapping.sourceClassId} className="group hover:bg-slate-50/50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200 font-bold text-xs">
                                                {mapping.sourceGrade}
                                            </div>
                                            <span className="font-semibold text-slate-900">{mapping.sourceClassName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <ArrowRight className="h-5 w-5 text-slate-300 mx-auto" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <Select
                                            value={mapping.targetClassId}
                                            onValueChange={(val) => updateMapping(mapping.sourceClassId, val)}
                                        >
                                            <SelectTrigger className={cn(
                                                "w-full max-w-sm",
                                                mapping.targetClassId === 'IGNORE' && "text-slate-400 border-dashed",
                                                mapping.targetClassId === 'GRADUATE' && "border-green-200 bg-green-50 text-green-700 font-medium"
                                            )}>
                                                <SelectValue placeholder="Pilih Tujuan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="IGNORE" className="text-slate-400">
                                                    -- Tidak Diproses (Abaikan) --
                                                </SelectItem>
                                                {mapping.sourceGrade === 12 && (
                                                    <SelectItem value="GRADUATE" className="text-green-600 font-semibold">
                                                        <span className="flex items-center gap-2">
                                                            <Check className="h-4 w-4" /> LULUS (Alumni)
                                                        </span>
                                                    </SelectItem>
                                                )}
                                                {targetClasses.map(tc => (
                                                    <SelectItem key={tc.id} value={tc.id}>
                                                        {tc.name} (Grade {tc.grade})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {mapping.targetClassId === 'IGNORE' && (
                                            <p className="text-[10px] text-slate-400 mt-1 ml-1">Siswa di kelas ini tidak akan diproses.</p>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredMappings.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                                        Tidak ada kelas yang ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const renderStep3 = () => {
        const filteredStudents = students.filter(s =>
            s.studentName.toLowerCase().includes(studentSearch.toLowerCase()) ||
            s.currentClassName.toLowerCase().includes(studentSearch.toLowerCase())
        );

        return (
            <div className="space-y-6">
                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Verifikasi Siswa</h2>
                        <p className="text-slate-500 text-sm">
                            Tinjau dan sesuaikan status kenaikan kelas untuk setiap siswa.
                        </p>
                    </div>
                     <div className="relative w-full sm:w-[250px]">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Cari siswa atau kelas..."
                            className="pl-9 h-9"
                            value={studentSearch}
                            onChange={(e) => setStudentSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="border rounded-md overflow-hidden max-h-[500px] overflow-y-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider">Nama Siswa</th>
                                <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider">Kelas Saat Ini</th>
                                <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider">Status Kenaikan</th>
                                <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider">Kelas Tujuan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {filteredStudents.map((student) => (
                                <tr key={student.studentId} className="group hover:bg-slate-50/50">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-slate-900">{student.studentName}</div>
                                        <div className="text-xs text-slate-400">{student.nisn}</div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {student.currentClassName}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-1">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className={cn(
                                                    "h-8 text-xs",
                                                    student.action === 'PROMOTE' && "bg-blue-50 text-blue-700 border-blue-200 font-semibold"
                                                )}
                                                onClick={() => updateStudentStatus(student.studentId, 'PROMOTE')}
                                            >
                                                Naik
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className={cn(
                                                    "h-8 text-xs",
                                                    student.action === 'STAY' && "bg-amber-50 text-amber-700 border-amber-200 font-semibold"
                                                )}
                                                onClick={() => updateStudentStatus(student.studentId, 'STAY')}
                                            >
                                                Tinggal
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className={cn(
                                                    "h-8 text-xs",
                                                    student.action === 'GRADUATE' && "bg-green-50 text-green-700 border-green-200 font-semibold"
                                                )}
                                                onClick={() => updateStudentStatus(student.studentId, 'GRADUATE')}
                                            >
                                                Lulus
                                            </Button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {student.action === 'PROMOTE' && student.targetClassName && (
                                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                <ArrowRight className="h-3 w-3 mr-1" /> {student.targetClassName}
                                            </Badge>
                                        )}
                                        {student.action === 'STAY' && (
                                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                                <UserX className="h-3 w-3 mr-1" /> Tinggal Kelas
                                            </Badge>
                                        )}
                                        {student.action === 'GRADUATE' && (
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                <GraduationCap className="h-3 w-3 mr-1" /> Lulus
                                            </Badge>
                                        )}
                                        {student.action === 'PROMOTE' && !student.targetClassName && (
                                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                                Belum ada tujuan
                                            </Badge>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const renderStep4 = () => {
        const stats = {
            promoted: students.filter(s => s.action === 'PROMOTE').length,
            stayed: students.filter(s => s.action === 'STAY').length,
            graduated: students.filter(s => s.action === 'GRADUATE').length,
            total: students.length
        };

        return (
            <div className="space-y-8 max-w-4xl mx-auto py-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900">Ringkasan Kenaikan Kelas</h2>
                    <p className="text-slate-500 mt-2">
                        Periksa kembali ringkasan data sebelum melakukan eksekusi final.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Promoted */}
                    <Card className="border-blue-100 bg-blue-50/30">
                        <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center border border-blue-200 shadow-sm">
                                <TrendingUp className="h-8 w-8" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-slate-900">{stats.promoted}</h3>
                                <p className="text-sm font-medium text-blue-700 uppercase tracking-wide mt-1">Siswa Naik Kelas</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stayed */}
                    <Card className="border-amber-100 bg-amber-50/30">
                        <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center border border-amber-200 shadow-sm">
                                <UserX className="h-8 w-8" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-slate-900">{stats.stayed}</h3>
                                <p className="text-sm font-medium text-amber-700 uppercase tracking-wide mt-1">Siswa Tinggal Kelas</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Graduated */}
                    <Card className="border-green-100 bg-green-50/30">
                        <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center border border-green-200 shadow-sm">
                                <GraduationCap className="h-8 w-8" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-slate-900">{stats.graduated}</h3>
                                <p className="text-sm font-medium text-green-700 uppercase tracking-wide mt-1">Siswa Lulus</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Alert className="bg-slate-50 border-slate-200">
                    <AlertCircle className="h-4 w-4 text-slate-600" />
                    <AlertTitle>Perhatian</AlertTitle>
                    <AlertDescription className="text-slate-600">
                        Total <strong>{stats.total}</strong> siswa akan diproses. Pastikan data sudah benar karena perubahan ini akan langsung diterapkan ke database.
                    </AlertDescription>
                </Alert>
            </div>
        );
    };

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
            <div className="relative py-4">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10 transform -translate-y-1/2" />
                <div className="flex justify-between items-center w-full max-w-3xl mx-auto px-4">
                    {STEPS.map((step) => {
                        const isActive = step.id === currentStep;
                        const isCompleted = step.id < currentStep;

                        return (
                            <div key={step.id} className="flex flex-col items-center gap-2 bg-white px-2">
                                <div
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                                        isActive
                                            ? "border-blue-600 bg-blue-50 text-blue-600 shadow-md scale-110"
                                            : isCompleted
                                            ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                                            : "border-slate-200 bg-white text-slate-300"
                                    )}
                                >
                                    {isCompleted ? (
                                        <Check className="w-5 h-5" />
                                    ) : (
                                        <step.icon className="w-5 h-5" />
                                    )}
                                </div>
                                <span
                                    className={cn(
                                        "text-xs font-bold whitespace-nowrap uppercase tracking-wider",
                                        isActive
                                            ? "text-blue-700"
                                            : isCompleted
                                            ? "text-emerald-600"
                                            : "text-slate-400"
                                    )}
                                >
                                    {step.title}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Content Area */}
            <Card className="min-h-[400px] shadow-sm border-slate-200">
                <CardContent className="p-6">
                    {currentStep === 1 && renderStep1()}
                    {currentStep === 2 && renderStep2()}
                    {currentStep === 3 && renderStep3()}
                    {currentStep === 4 && renderStep4()}
                </CardContent>
                <CardFooter className="flex justify-between border-t p-6 bg-slate-50/50">
                    <Button
                        variant="outline"
                        onClick={handleBack}
                        disabled={currentStep === 1 || isLoading}
                        className="bg-white"
                    >
                        Kembali
                    </Button>
                    <Button
                        onClick={handleNext}
                        className={cn(
                            "min-w-[120px]",
                            currentStep === 4 ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700"
                        )}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Memproses...' : (currentStep === 4 ? 'Eksekusi' : 'Lanjut')}
                        {!isLoading && <ChevronRight className="ml-2 h-4 w-4" />}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};
