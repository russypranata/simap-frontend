"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
    GraduationCap,
    TrendingUp,
    BookOpen,
    Award,
    BarChart3,
    Star,
    Target,
    FileText,
    Calendar,
    Check,
    Filter,
    RotateCcw,
    SlidersHorizontal,
    BookText,
    AlertCircle,
    Clock,
    Info,
    X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ==================== TYPES ====================

interface SubjectGrade {
    id: number;
    subject: string;
    teacher: string;
    sumatifScore: number;      // Nilai sumatif (harian)
    astsScore: number;         // ASTS (tengah semester)
    asasScore: number;         // ASAS (akhir semester)
    finalAverage: number;      // Rata-rata akhir (calculated)
    grade: string;
    kkm: number;
    academicYear: string;      // Format: "2025/2026"
    semester: "ganjil" | "genap";
    description?: string;      // Deskripsi kompetensi
    lastUpdated?: string;      // ISO date string
}

interface SemesterSummary {
    semester: string;
    academicYear: string;
    averageScore: number;
    rank: number;
    totalStudents: number;
}

interface ReportCardNote {
    category: string;
    note: string;
    icon: string;
}

interface AcademicPeriod {
    academicYear: string;
    semester: "ganjil" | "genap";
    startDate: string;
    endDate: string;
    isGradesReleased: boolean;
    gradesReleaseDate?: string;
}

interface PeriodStatus {
    isEnded: boolean;
    isGradesAvailable: boolean;
    status: "ongoing" | "released" | "pending";
}

interface GradeStats {
    totalAverage: number;
    highestSubject: SubjectGrade | null;
    lowestSubject: SubjectGrade | null;
    aboveKKM: number;
    totalSubjects: number;
    progressValue: number;
    needsRemedial: SubjectGrade[];
}

interface GradeStatus {
    status: "tuntas" | "remedial";
    label: string;
    variant: "success" | "warning";
    pointsNeeded?: number;
}

// ==================== CONSTANTS ====================

const GRADE_WEIGHTS = {
    sumatif: 0.3,  // 30%
    asts: 0.35,    // 35%
    asas: 0.35,    // 35%
};

const ACADEMIC_PERIODS: AcademicPeriod[] = [
    {
        academicYear: "2025/2026",
        semester: "ganjil",
        startDate: "2025-07-01",
        endDate: "2025-12-31",
        isGradesReleased: true,
        gradesReleaseDate: "2026-01-15",
    },
    {
        academicYear: "2025/2026",
        semester: "genap",
        startDate: "2026-01-01",
        endDate: "2026-06-30",
        isGradesReleased: false,
    },
    {
        academicYear: "2024/2025",
        semester: "genap",
        startDate: "2025-01-01",
        endDate: "2025-06-30",
        isGradesReleased: true,
        gradesReleaseDate: "2025-07-15",
    },
    {
        academicYear: "2024/2025",
        semester: "ganjil",
        startDate: "2024-07-01",
        endDate: "2024-12-31",
        isGradesReleased: true,
        gradesReleaseDate: "2025-01-15",
    },
];

// ==================== MOCK DATA ====================

const mockChildInfo = {
    name: "Ahmad Fauzan Ramadhan",
    nis: "0012345678",
    class: "XII IPA 1",
};

const mockGrades: SubjectGrade[] = [
    { 
        id: 1, 
        subject: "Matematika", 
        teacher: "Ahmad Hidayat, S.Pd", 
        sumatifScore: 85, 
        astsScore: 82, 
        asasScore: 88, 
        finalAverage: 0, // Will be calculated
        grade: "A-", 
        kkm: 75,
        academicYear: "2025/2026",
        semester: "ganjil",
        description: "Menunjukkan pemahaman yang baik dalam aljabar dan geometri",
        lastUpdated: "2026-01-10T10:30:00Z",
    },
    { 
        id: 2, 
        subject: "Fisika", 
        teacher: "Sari Wahyuni, S.Pd", 
        sumatifScore: 78, 
        astsScore: 80, 
        asasScore: 82, 
        finalAverage: 0,
        grade: "B+", 
        kkm: 75,
        academicYear: "2025/2026",
        semester: "ganjil",
        description: "Perlu peningkatan dalam pemahaman konsep fisika modern",
        lastUpdated: "2026-01-10T11:00:00Z",
    },
    { 
        id: 3, 
        subject: "Kimia", 
        teacher: "Rudi Hartono, S.Pd", 
        sumatifScore: 82, 
        astsScore: 85, 
        asasScore: 84, 
        finalAverage: 0,
        grade: "A-", 
        kkm: 75,
        academicYear: "2025/2026",
        semester: "ganjil",
        lastUpdated: "2026-01-10T09:45:00Z",
    },
    { 
        id: 4, 
        subject: "Biologi", 
        teacher: "Ani Suryani, S.Pd", 
        sumatifScore: 88, 
        astsScore: 90, 
        asasScore: 92, 
        finalAverage: 0,
        grade: "A", 
        kkm: 75,
        academicYear: "2025/2026",
        semester: "ganjil",
        description: "Prestasi luar biasa dalam biologi molekuler",
        lastUpdated: "2026-01-10T14:20:00Z",
    },
    { 
        id: 5, 
        subject: "Bahasa Indonesia", 
        teacher: "Dewi Lestari, S.Pd", 
        sumatifScore: 80, 
        astsScore: 78, 
        asasScore: 82, 
        finalAverage: 0,
        grade: "B+", 
        kkm: 75,
        academicYear: "2025/2026",
        semester: "ganjil",
        lastUpdated: "2026-01-10T08:30:00Z",
    },
    { 
        id: 6, 
        subject: "Bahasa Inggris", 
        teacher: "Budi Santoso, S.Pd", 
        sumatifScore: 85, 
        astsScore: 88, 
        asasScore: 86, 
        finalAverage: 0,
        grade: "A-", 
        kkm: 75,
        academicYear: "2025/2026",
        semester: "ganjil",
        lastUpdated: "2026-01-10T13:15:00Z",
    },
    { 
        id: 7, 
        subject: "Sejarah", 
        teacher: "Hendra Gunawan, S.Pd", 
        sumatifScore: 78, 
        astsScore: 75, 
        asasScore: 80, 
        finalAverage: 0,
        grade: "B", 
        kkm: 75,
        academicYear: "2025/2026",
        semester: "ganjil",
        lastUpdated: "2026-01-10T10:00:00Z",
    },
    { 
        id: 8, 
        subject: "Pendidikan Agama Islam", 
        teacher: "Usman Abdullah, S.Pd.I", 
        sumatifScore: 92, 
        astsScore: 95, 
        asasScore: 93, 
        finalAverage: 0,
        grade: "A", 
        kkm: 75,
        academicYear: "2025/2026",
        semester: "ganjil",
        description: "Sangat baik dalam pemahaman fiqih dan akhlak",
        lastUpdated: "2026-01-10T07:45:00Z",
    },
    { 
        id: 9, 
        subject: "PKn", 
        teacher: "Rina Marlina, S.Pd", 
        sumatifScore: 82, 
        astsScore: 80, 
        asasScore: 84, 
        finalAverage: 0,
        grade: "B+", 
        kkm: 75,
        academicYear: "2025/2026",
        semester: "ganjil",
        lastUpdated: "2026-01-10T11:30:00Z",
    },
    { 
        id: 10, 
        subject: "Seni Budaya", 
        teacher: "Ratna Sari, S.Sn", 
        sumatifScore: 88, 
        astsScore: 85, 
        asasScore: 90, 
        finalAverage: 0,
        grade: "A-", 
        kkm: 75,
        academicYear: "2025/2026",
        semester: "ganjil",
        lastUpdated: "2026-01-10T15:00:00Z",
    },
    { 
        id: 11, 
        subject: "PJOK", 
        teacher: "Agus Prasetyo, S.Pd", 
        sumatifScore: 85, 
        astsScore: 87, 
        asasScore: 86, 
        finalAverage: 0,
        grade: "A-", 
        kkm: 75,
        academicYear: "2025/2026",
        semester: "ganjil",
        lastUpdated: "2026-01-10T16:00:00Z",
    },
    { 
        id: 12, 
        subject: "Prakarya", 
        teacher: "Fitri Handayani, S.Pd", 
        sumatifScore: 83, 
        astsScore: 85, 
        asasScore: 84, 
        finalAverage: 0,
        grade: "A-", 
        kkm: 75,
        academicYear: "2025/2026",
        semester: "ganjil",
        lastUpdated: "2026-01-10T14:45:00Z",
    },
];

const mockSemesterHistory: SemesterSummary[] = [
    { semester: "Ganjil", academicYear: "2025/2026", averageScore: 85.2, rank: 5, totalStudents: 32 },
    { semester: "Genap", academicYear: "2024/2025", averageScore: 84.5, rank: 6, totalStudents: 32 },
    { semester: "Ganjil", academicYear: "2024/2025", averageScore: 83.8, rank: 8, totalStudents: 32 },
];

const mockReportCardNotes: ReportCardNote[] = [
    {
        category: "Prestasi Akademik",
        note: "Ananda menunjukkan peningkatan yang signifikan dalam mata pelajaran IPA, khususnya Biologi. Pertahankan semangat belajar dan tingkatkan pemahaman dalam Matematika.",
        icon: "🏆"
    },
    {
        category: "Sikap dan Perilaku",
        note: "Ananda aktif dalam kegiatan kelas dan menunjukkan sikap yang baik terhadap guru dan teman. Teruslah menjadi contoh yang baik dalam kedisiplinan.",
        icon: "⭐"
    },
    {
        category: "Ekstrakurikuler",
        note: "Ananda aktif mengikuti kegiatan Pramuka dan menunjukkan kepemimpinan yang baik. Pertahankan partisipasi dalam kegiatan ekstrakurikuler.",
        icon: "🎯"
    },
    {
        category: "Catatan Wali Kelas",
        note: "Secara keseluruhan, Ananda adalah siswa yang berprestasi dan menjadi kebanggaan kelas. Teruslah berusaha dan jangan mudah menyerah menghadapi tantangan.",
        icon: "📝"
    },
];

// ==================== HELPER FUNCTIONS ====================

const calculateFinalAverage = (sumatif: number, asts: number, asas: number): number => {
    const weighted = 
        sumatif * GRADE_WEIGHTS.sumatif +
        asts * GRADE_WEIGHTS.asts +
        asas * GRADE_WEIGHTS.asas;
    return Math.round(weighted * 10) / 10;
};

const getGradeBadgeColor = (grade: string): string => {
    if (grade.startsWith("A")) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (grade.startsWith("B")) return "bg-blue-50 text-blue-700 border-blue-200";
    if (grade.startsWith("C")) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-red-50 text-red-700 border-red-200";
};

const getScoreColor = (score: number, kkm: number): string => {
    if (score >= kkm + 15) return "text-emerald-600";
    if (score >= kkm) return "text-blue-600";
    return "text-red-600";
};

const getGradeStatus = (grade: SubjectGrade): GradeStatus => {
    if (grade.finalAverage >= grade.kkm) {
        return { status: "tuntas", label: "Tuntas", variant: "success" };
    }
    const remedialNeeded = grade.kkm - grade.finalAverage;
    return { 
        status: "remedial", 
        label: "Remedial", 
        variant: "warning",
        pointsNeeded: Math.ceil(remedialNeeded),
    };
};

const checkPeriodStatus = (academicYear: string, semester: "ganjil" | "genap"): PeriodStatus => {
    const period = ACADEMIC_PERIODS.find(
        p => p.academicYear === academicYear && p.semester === semester
    );
    
    if (!period) {
        return { isEnded: false, isGradesAvailable: false, status: "pending" };
    }
    
    const now = new Date();
    const endDate = new Date(period.endDate);
    const isEnded = now > endDate;
    const isGradesAvailable = isEnded && period.isGradesReleased;
    
    let status: PeriodStatus["status"] = "pending";
    if (!isEnded) status = "ongoing";
    else if (isGradesAvailable) status = "released";
    
    return { isEnded, isGradesAvailable, status };
};

const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

// ==================== COMPONENTS ====================

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ElementType;
    color: "blue" | "green" | "amber" | "emerald";
    progressValue?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon: Icon, color, progressValue }) => {
    const colorConfig = {
        blue: {
            bg: "bg-blue-100/80",
            ring: "ring-blue-200/50",
            text: "text-blue-600",
            valueColor: "text-blue-600",
        },
        green: {
            bg: "bg-green-100/80",
            ring: "ring-green-200/50",
            text: "text-green-600",
            valueColor: "text-green-600",
        },
        amber: {
            bg: "bg-amber-100/80",
            ring: "ring-amber-200/50",
            text: "text-amber-600",
            valueColor: "text-amber-600",
        },
        emerald: {
            bg: "bg-emerald-100/80",
            ring: "ring-emerald-200/50",
            text: "text-emerald-600",
            valueColor: "text-emerald-600",
        },
    };

    const config = colorConfig[color];

    return (
        <div className="group relative overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 border border-slate-200">
            <div className="px-5 py-4 flex items-center gap-4">
                <div className="relative flex-shrink-0">
                    <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center ring-2 transition-transform duration-300 group-hover:scale-105",
                        config.bg,
                        config.ring
                    )}>
                        <Icon className={cn("h-6 w-6", config.text)} />
                    </div>
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{title}</p>
                    <div className="flex items-baseline gap-2 mt-1">
                        <p className={cn("text-2xl font-bold leading-none tabular-nums", config.valueColor)}>{value}</p>
                        {subtitle && <p className="text-xs text-muted-foreground font-medium truncate">{subtitle}</p>}
                    </div>
                    {progressValue !== undefined && (
                        <Progress value={progressValue} className="mt-2 h-1.5 rounded-full" />
                    )}
                </div>
            </div>
        </div>
    );
};

interface EmptyStateProps {
    hasActiveFilters: boolean;
    onResetFilters: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ hasActiveFilters, onResetFilters }) => (
    <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <FileText className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Tidak Ada Data Nilai</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md mt-2">
                {hasActiveFilters 
                    ? "Tidak ada data nilai untuk filter yang dipilih. Coba ubah filter atau reset pilihan."
                    : "Belum ada data nilai yang tersedia untuk anak Anda."}
            </p>
            {hasActiveFilters && (
                <Button 
                    variant="outline" 
                    className="mt-4 gap-2"
                    onClick={onResetFilters}
                >
                    <RotateCcw className="h-4 w-4" />
                    Reset Filter
                </Button>
            )}
        </CardContent>
    </Card>
);

interface LoadingStateProps {
    showStats?: boolean;
}

const LoadingState: React.FC<LoadingStateProps> = ({ showStats = true }) => (
    <div className="space-y-6">
        <Skeleton className="h-32 w-full rounded-xl" />
        {showStats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-28 w-full rounded-xl" />
                ))}
            </div>
        )}
        <Skeleton className="h-96 w-full rounded-xl" />
    </div>
);

interface PeriodAlertProps {
    periodStatus: PeriodStatus;
    academicYear: string;
    semester: string;
}

const PeriodAlert: React.FC<PeriodAlertProps> = ({ periodStatus, academicYear, semester }) => {
    if (periodStatus.status === "ongoing") {
        return (
            <Alert className="border-blue-200 bg-blue-50">
                <Clock className="h-5 w-5 text-blue-600" />
                <AlertTitle className="text-blue-800">Periode Masih Berlangsung</AlertTitle>
                <AlertDescription className="text-blue-700">
                    Semester {semester} Tahun Ajaran {academicYear} masih berjalan. Nilai yang ditampilkan 
                    adalah nilai sementara dan dapat berubah hingga periode berakhir.
                </AlertDescription>
            </Alert>
        );
    }
    
    if (periodStatus.status === "pending") {
        return (
            <Alert className="border-amber-200 bg-amber-50">
                <Info className="h-5 w-5 text-amber-600" />
                <AlertTitle className="text-amber-800">Nilai Belum Dirilis</AlertTitle>
                <AlertDescription className="text-amber-700">
                    Nilai untuk Semester {semester} Tahun Ajaran {academicYear} sedang diproses 
                    oleh guru dan akan segera tersedia.
                </AlertDescription>
            </Alert>
        );
    }
    
    return null;
};

// ==================== MAIN COMPONENT ====================

export const ParentGrades: React.FC = () => {
    // Filter dialog states
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [tempAcademicYear, setTempAcademicYear] = useState("all");
    const [tempSemester, setTempSemester] = useState("all");
    const [selectedAcademicYear, setSelectedAcademicYear] = useState("all");
    const [selectedSemester, setSelectedSemester] = useState("all");
    
    // Data states
    const [grades, setGrades] = useState<SubjectGrade[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Calculate final averages for all grades
    useEffect(() => {
        const processedGrades = mockGrades.map(grade => ({
            ...grade,
            finalAverage: calculateFinalAverage(grade.sumatifScore, grade.astsScore, grade.asasScore),
        }));
        setGrades(processedGrades);
        setIsLoading(false);
    }, []);

    // Filter grades based on selected filters
    const filteredGrades = useMemo(() => {
        return grades.filter(grade => {
            const yearMatch = selectedAcademicYear === "all" ||
                grade.academicYear.includes(selectedAcademicYear);
            const semesterMatch = selectedSemester === "all" ||
                grade.semester === selectedSemester;
            return yearMatch && semesterMatch;
        });
    }, [grades, selectedAcademicYear, selectedSemester]);

    // Get current period status
    const currentPeriodStatus = useMemo(() => {
        if (selectedAcademicYear === "all" || selectedSemester === "all") {
            return checkPeriodStatus("2025/2026", "ganjil");
        }
        return checkPeriodStatus(
            selectedAcademicYear === "2025" ? "2025/2026" : "2024/2025",
            selectedSemester as "ganjil" | "genap"
        );
    }, [selectedAcademicYear, selectedSemester]);

    // Calculate stats with edge case handling
    const stats: GradeStats = useMemo(() => {
        if (filteredGrades.length === 0) {
            return {
                totalAverage: 0,
                highestSubject: null,
                lowestSubject: null,
                aboveKKM: 0,
                totalSubjects: 0,
                progressValue: 0,
                needsRemedial: [],
            };
        }

        const totalAverage = filteredGrades.reduce((sum, g) => sum + g.finalAverage, 0) / filteredGrades.length;
        
        const highestSubject = filteredGrades.reduce((prev, current) =>
            prev.finalAverage > current.finalAverage ? prev : current
        );
        
        const lowestSubject = filteredGrades.reduce((prev, current) =>
            prev.finalAverage < current.finalAverage ? prev : current
        );

        const aboveKKM = filteredGrades.filter(g => g.finalAverage >= g.kkm).length;
        const needsRemedial = filteredGrades.filter(g => g.finalAverage < g.kkm);

        return {
            totalAverage: Math.round(totalAverage * 10) / 10,
            highestSubject,
            lowestSubject,
            aboveKKM,
            totalSubjects: filteredGrades.length,
            progressValue: Math.round((aboveKKM / filteredGrades.length) * 100),
            needsRemedial,
        };
    }, [filteredGrades]);

    const currentSemester = mockSemesterHistory[0];
    const hasActiveFilters = selectedAcademicYear !== "all" || selectedSemester !== "all";

    const handleResetFilters = () => {
        setTempAcademicYear("all");
        setTempSemester("all");
        setSelectedAcademicYear("all");
        setSelectedSemester("all");
    };

    const handleApplyFilters = () => {
        setSelectedAcademicYear(tempAcademicYear);
        setSelectedSemester(tempSemester);
        setIsFilterOpen(false);
    };

    // Get display academic year and semester
    const displayAcademicYear = selectedAcademicYear === "all"
        ? "2025/2026"
        : selectedAcademicYear === "2025"
            ? "2025/2026"
            : "2024/2025";
    
    const displaySemester = selectedSemester === "all" ? "Ganjil" :
        selectedSemester === "ganjil" ? "Ganjil" : "Genap";

    // Loading state
    if (isLoading) {
        return <LoadingState showStats={true} />;
    }

    // Error state
    if (error) {
        return (
            <div className="space-y-6">
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <AlertTitle className="text-red-800">Gagal Memuat Data</AlertTitle>
                    <AlertDescription className="text-red-700">
                        {error}
                    </AlertDescription>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                            setIsLoading(true);
                            setError(null);
                            const processedGrades = mockGrades.map(grade => ({
                                ...grade,
                                finalAverage: calculateFinalAverage(grade.sumatifScore, grade.astsScore, grade.asasScore),
                            }));
                            setGrades(processedGrades);
                            setIsLoading(false);
                        }}
                        className="mt-2 gap-2"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Coba Lagi
                    </Button>
                </Alert>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Nilai & </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Rapor Anak</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <GraduationCap className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Monitoring hasil belajar dan pencapaian akademik anak
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 w-full lg:w-auto mt-4 lg:mt-0">
                    <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="h-9 gap-2 bg-white text-slate-700 border-slate-200 shadow-sm font-medium">
                                <Filter className="h-4 w-4 text-slate-500" />
                                <span className="hidden sm:inline">Filter</span>
                                {hasActiveFilters && (
                                    <Badge className="ml-0.5 h-5 w-5 min-w-[20px] px-0 bg-blue-800 text-white text-[10px] flex items-center justify-center border-0 rounded-full">
                                        {(selectedAcademicYear !== "all" ? 1 : 0) + (selectedSemester !== "all" ? 1 : 0)}
                                    </Badge>
                                )}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] rounded-2xl">
                            <DialogHeader className="flex-row items-center gap-4">
                                <div className="p-2.5 bg-blue-100 rounded-xl">
                                    <Filter className="h-5 w-5 text-blue-700" />
                                </div>
                                <div>
                                    <DialogTitle className="text-lg font-semibold text-slate-900">Filter Nilai</DialogTitle>
                                    <DialogDescription className="text-slate-500">
                                        Sesuaikan tahun ajaran dan semester
                                    </DialogDescription>
                                </div>
                            </DialogHeader>
                            
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-slate-400" />
                                            Tahun Ajaran
                                        </label>
                                        <Select value={tempAcademicYear} onValueChange={setTempAcademicYear}>
                                            <SelectTrigger className="w-full bg-slate-50/50 border-slate-200">
                                                <SelectValue placeholder="Tahun" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Semua Tahun</SelectItem>
                                                <SelectItem value="2025">TA. 2025/2026</SelectItem>
                                                <SelectItem value="2024">TA. 2024/2025</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                            <BookText className="h-4 w-4 text-slate-400" />
                                            Semester
                                        </label>
                                        <Select value={tempSemester} onValueChange={setTempSemester}>
                                            <SelectTrigger className="w-full bg-slate-50/50 border-slate-200">
                                                <SelectValue placeholder="Semester" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Semua</SelectItem>
                                                <SelectItem value="ganjil">Ganjil</SelectItem>
                                                <SelectItem value="genap">Genap</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <DialogFooter className="sm:justify-between gap-2 border-t pt-4">
                                <Button
                                    variant="ghost"
                                    onClick={handleResetFilters}
                                    className="text-slate-500 hover:text-red-500 hover:bg-red-50 gap-2"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                    Reset Pilihan
                                </Button>
                                <Button
                                    className="bg-blue-800 hover:bg-blue-900 text-white px-8 gap-2"
                                    onClick={handleApplyFilters}
                                >
                                    <Check className="h-4 w-4" />
                                    Terapkan
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Active Global Filters */}
            {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2 px-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                        <SlidersHorizontal className="h-3 w-3" />
                        <span>Filter Aktif:</span>
                    </div>
                    
                    {selectedAcademicYear !== "all" && (
                        <Badge variant="secondary" className="gap-2 bg-blue-800 text-white border-none px-3 py-1 rounded-lg text-xs font-medium">
                            <Calendar className="h-3.5 w-3.5" />
                            TA. {selectedAcademicYear === "2025" ? "2025/2026" : "2024/2025"}
                            <button
                                onClick={() => setSelectedAcademicYear("all")}
                                className="inline-flex items-center justify-center h-4 w-4 hover:text-white/70 transition-colors -mr-1"
                                aria-label="Hapus filter tahun ajaran"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </Badge>
                    )}

                    {selectedSemester !== "all" && (
                        <Badge variant="secondary" className="gap-2 bg-blue-800 text-white border-none px-3 py-1 rounded-lg text-xs font-medium">
                            <BookText className="h-3.5 w-3.5" />
                            {selectedSemester === "ganjil" ? "Ganjil" : "Genap"}
                            <button
                                onClick={() => setSelectedSemester("all")}
                                className="inline-flex items-center justify-center h-4 w-4 hover:text-white/70 transition-colors -mr-1"
                                aria-label="Hapus filter semester"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </Badge>
                    )}

                    {(selectedAcademicYear !== "all" ? 1 : 0) + (selectedSemester !== "all" ? 1 : 0) > 1 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-[11px] text-red-500 hover:text-red-600 hover:bg-red-50 gap-1.5 ml-1"
                            onClick={handleResetFilters}
                        >
                            <RotateCcw className="h-3 w-3" />
                            Hapus Semua
                        </Button>
                    )}
                </div>
            )}

            {/* Period Alert */}
            <PeriodAlert
                periodStatus={currentPeriodStatus}
                academicYear={displayAcademicYear}
                semester={displaySemester}
            />

            {/* Child Info Card */}
            <Card className="border-blue-200 shadow-sm">
                <CardContent className="p-6">
                    <div className="flex items-center gap-5">
                        <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-800 font-bold text-xl ring-2 ring-blue-200/50">
                            {mockChildInfo.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-800 text-lg">{mockChildInfo.name}</h3>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1 flex-wrap">
                                <span>NIS: {mockChildInfo.nis}</span>
                                <Badge className="bg-blue-100 text-blue-800 border-blue-200 font-medium rounded-full">
                                    {mockChildInfo.class}
                                </Badge>
                            </div>
                        </div>
                        <div className="text-right pl-4 border-l border-slate-200">
                            <p className="text-sm text-muted-foreground font-medium">Peringkat Kelas</p>
                            <p className="text-3xl font-bold text-amber-600 mt-0.5">#{currentSemester.rank}</p>
                            <p className="text-xs text-muted-foreground">dari {currentSemester.totalStudents} siswa</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Summary Statistics */}
            {filteredGrades.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Rata-rata Nilai"
                        value={stats.totalAverage}
                        icon={BarChart3}
                        color="blue"
                    />
                    <StatCard
                        title="Nilai Tertinggi"
                        value={stats.highestSubject?.finalAverage || "-"}
                        subtitle={stats.highestSubject?.subject || ""}
                        icon={Star}
                        color="emerald"
                    />
                    <StatCard
                        title="Perlu Perhatian"
                        value={stats.lowestSubject?.finalAverage || "-"}
                        subtitle={stats.lowestSubject?.subject || ""}
                        icon={Target}
                        color="amber"
                    />
                    <StatCard
                        title="Tuntas KKM"
                        value={`${stats.aboveKKM}/${stats.totalSubjects}`}
                        icon={Award}
                        color="green"
                        progressValue={stats.progressValue}
                    />
                </div>
            )}

            {/* Tabs - Nilai & Catatan Rapor */}
            <Tabs defaultValue="nilai" className="space-y-4">
                <TabsList className="grid w-full max-w-md grid-cols-2 h-10 bg-slate-100 rounded-lg p-1">
                    <TabsTrigger value="nilai" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all text-sm font-medium">
                        <BookOpen className="h-4 w-4" />
                        Nilai Akademik
                    </TabsTrigger>
                    <TabsTrigger value="catatan" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all text-sm font-medium">
                        <FileText className="h-4 w-4" />
                        Catatan Rapor
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="nilai" className="space-y-4">
                    {/* Grades Table */}
                    {filteredGrades.length === 0 ? (
                        <EmptyState hasActiveFilters={hasActiveFilters} onResetFilters={handleResetFilters} />
                    ) : (
                        <Card className="border-blue-200 shadow-sm">
                            <CardHeader className="pb-3">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-blue-100 rounded-xl">
                                            <BookOpen className="h-5 w-5 text-blue-700" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg font-semibold text-slate-800">Nilai Per Mata Pelajaran</CardTitle>
                                            <CardDescription className="text-sm text-slate-600">
                                                Semester {displaySemester} TA. {displayAcademicYear}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 font-semibold h-7 px-3 rounded-full text-xs self-start sm:self-center">
                                        {filteredGrades.length} Mata Pelajaran
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                                                <th className="text-left p-4 w-[50px] font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle">No</th>
                                                <th className="text-left p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle min-w-[200px]">Mata Pelajaran</th>
                                                <th className="text-center p-4 w-[90px] font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle">Sumatif</th>
                                                <th className="text-center p-4 w-[90px] font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle">ASTS</th>
                                                <th className="text-center p-4 w-[90px] font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle">ASAS</th>
                                                <th className="text-center p-4 w-[100px] font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle">Rata-rata</th>
                                                <th className="text-center p-4 w-[100px] font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle">Predikat</th>
                                                <th className="text-center p-4 w-[90px] font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredGrades.map((grade, index) => {
                                                const gradeStatus = getGradeStatus(grade);
                                                return (
                                                    <tr key={grade.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/80 transition-colors">
                                                        <td className="p-4 align-middle">
                                                            <span className="text-sm text-slate-500 font-medium">{index + 1}</span>
                                                        </td>
                                                        <td className="p-4 align-middle">
                                                            <div className="flex flex-col gap-0.5">
                                                                <span className="text-sm text-slate-800 font-semibold">{grade.subject}</span>
                                                                <span className="text-xs text-slate-500">{grade.teacher}</span>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 align-middle text-center">
                                                            <span className={cn("text-sm font-semibold", getScoreColor(grade.sumatifScore, grade.kkm))}>
                                                                {grade.sumatifScore}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 align-middle text-center">
                                                            <span className={cn("text-sm font-semibold", getScoreColor(grade.astsScore, grade.kkm))}>
                                                                {grade.astsScore}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 align-middle text-center">
                                                            <span className={cn("text-sm font-semibold", getScoreColor(grade.asasScore, grade.kkm))}>
                                                                {grade.asasScore}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 align-middle text-center">
                                                            <span className={cn("text-base font-bold", getScoreColor(grade.finalAverage, grade.kkm))}>
                                                                {grade.finalAverage}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 align-middle text-center">
                                                            <Badge variant="outline" className={cn(
                                                                "inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium border rounded-full",
                                                                getGradeBadgeColor(grade.grade)
                                                            )}>
                                                                {grade.grade}
                                                            </Badge>
                                                        </td>
                                                        <td className="p-4 align-middle text-center">
                                                            {gradeStatus.status === "tuntas" ? (
                                                                <Badge className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium bg-green-50 text-green-700 border-green-200 rounded-full">
                                                                    <Check className="h-3.5 w-3.5" />
                                                                    Tuntas
                                                                </Badge>
                                                            ) : (
                                                                <Badge className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium bg-amber-50 text-amber-700 border-amber-200 rounded-full">
                                                                    <AlertCircle className="h-3.5 w-3.5" />
                                                                    Remedial
                                                                </Badge>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="catatan" className="space-y-4">
                    {/* Catatan Rapor */}
                    <Card className="border-blue-200 shadow-sm">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-blue-100 rounded-xl">
                                    <FileText className="h-5 w-5 text-blue-700" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-semibold text-slate-800">Catatan Rapor</CardTitle>
                                    <CardDescription className="text-sm text-slate-600">
                                        Semester {displaySemester} TA. {displayAcademicYear}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {mockReportCardNotes.map((item, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "p-4 rounded-xl border bg-gradient-to-r from-slate-50/50 to-white hover:shadow-sm hover:border-slate-300 transition-all",
                                        index === 0 ? "border-amber-200" :
                                        index === 1 ? "border-blue-200" :
                                        index === 2 ? "border-emerald-200" : "border-purple-200"
                                    )}
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl flex-shrink-0">{item.icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-slate-800 mb-1.5 text-sm">{item.category}</h4>
                                            <p className="text-sm text-slate-600 leading-relaxed">{item.note}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Semester History */}
            <Card className="border-blue-200 shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-100 rounded-xl">
                            <TrendingUp className="h-5 w-5 text-blue-700" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold text-slate-800">Riwayat Nilai</CardTitle>
                            <CardDescription className="text-sm text-slate-600">Perbandingan nilai antar semester</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {mockSemesterHistory.map((semester, index) => (
                            <div
                                key={`${semester.academicYear}-${semester.semester}`}
                                className={cn(
                                    "p-5 rounded-xl border transition-all hover:shadow-md",
                                    index === 0 ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200" : "bg-slate-50 border-slate-200"
                                )}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <Badge variant={index === 0 ? "default" : "outline"} className={cn("rounded-full px-3 py-0.5 text-xs font-semibold", index === 0 ? "bg-blue-800" : "")}>
                                        {semester.semester}
                                    </Badge>
                                    {index === 0 && (
                                        <Badge className="bg-green-50 text-green-700 border-green-200 rounded-full px-2.5 py-0.5 text-[10px] font-medium">
                                            Aktif
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground font-medium mb-3">{semester.academicYear}</p>
                                <div className="space-y-2.5">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground font-medium">Rata-rata</span>
                                        <span className={cn("font-bold text-lg", getScoreColor(semester.averageScore, 75))}>
                                            {semester.averageScore}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2.5 border-t border-slate-200/60">
                                        <span className="text-sm text-muted-foreground font-medium">Peringkat</span>
                                        <span className="font-bold text-lg text-slate-700">#{semester.rank}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
