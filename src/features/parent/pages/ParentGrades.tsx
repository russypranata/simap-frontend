"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { mockParentProfile } from "@/features/parent/data/mockParentData";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    UserCheck,
    Users,
    Medal,
    ClipboardList,
    CalendarIcon,
    X,
    Trophy,
    Info,
    ChevronRight,
    Thermometer,
    AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";

// ==================== TYPES ====================

interface SubjectGrade {
    id: number;
    subject: string;
    teacher: string;
    ki3Scores: number[];
    ki3Average: number;
    ki3Predicate: string;
    ki3Description: string;
    ki4Scores: number[];
    ki4Average: number;
    ki4Predicate: string;
    ki4Description: string;
    finalAverage: number;
    finalGrade: string;
    kkm: number;
    academicYear: string;
    semester: "ganjil" | "genap";
    remedial?: {
        type: "remedial" | "pengayaan";
        date?: string;          // tanggal pelaksanaan RTL
        scoreAfter?: number;    // nilai setelah remedial
        material?: string;      // materi remedial
    };
}

interface AttitudeScore {
    spiritual: {
        score: "A" | "B" | "C";
        predicate: "Sangat Baik" | "Baik" | "Cukup";
        description: string;
    };
    social: {
        score: "A" | "B" | "C";
        predicate: "Sangat Baik" | "Baik" | "Cukup";
        description: string;
    };
}

interface Extracurricular {
    name: string;
    type: "Wajib" | "Pilihan";
    score: "A" | "B" | "C";
    predicate: "Sangat Baik" | "Baik" | "Cukup";
    description: string;
    instructor: string;
}

interface AttendanceSummary {
    sick: number;
    permission: number;
    alpha: number;
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

interface AcademicYear {
    id: string;
    year: string;
    semesters: {
        id: string;
        label: string;
        status: "completed" | "active" | "upcoming";
    }[];
}

// ==================== MOCK DATA ====================

const academicYears: AcademicYear[] = [
    {
        id: "2025-2026", year: "2025/2026",
        semesters: [
            { id: "ganjil", label: "Ganjil", status: "active" },
            { id: "genap", label: "Genap", status: "upcoming" },
        ],
    },
    {
        id: "2024-2025", year: "2024/2025",
        semesters: [
            { id: "genap", label: "Genap", status: "completed" },
            { id: "ganjil", label: "Ganjil", status: "completed" },
        ],
    },
];

const mockGrades: SubjectGrade[] = [
    {
        id: 1, subject: "Matematika", teacher: "Ahmad Hidayat, S.Pd",
        ki3Scores: [85, 88, 82, 86], ki3Average: 85, ki3Predicate: "A",
        ki3Description: "Menunjukkan pemahaman yang sangat baik dalam aljabar, geometri, dan kalkulus dasar.",
        ki4Scores: [88, 85, 90], ki4Average: 88, ki4Predicate: "A",
        ki4Description: "Terampil dalam menyelesaikan masalah matematika dan menyajikan solusi secara sistematis.",
        finalAverage: 86, finalGrade: "A", kkm: 75, academicYear: "2025/2026", semester: "ganjil",
    },
    {
        id: 2, subject: "Fisika", teacher: "Sari Wahyuni, S.Pd",
        ki3Scores: [78, 80, 82, 79], ki3Average: 80, ki3Predicate: "B",
        ki3Description: "Memahami konsep fisika dasar dengan baik. Perlu peningkatan dalam pemahaman fisika modern.",
        ki4Scores: [82, 85, 80], ki4Average: 82, ki4Predicate: "A",
        ki4Description: "Terampil dalam melakukan eksperimen dan analisis data.",
        finalAverage: 81, finalGrade: "B+", kkm: 75, academicYear: "2025/2026", semester: "ganjil",
        remedial: { type: "remedial", date: "2024-12-10", scoreAfter: 82, material: "Fisika Modern & Gelombang" },
    },
    {
        id: 3, subject: "Kimia", teacher: "Rudi Hartono, S.Pd",
        ki3Scores: [82, 85, 84, 86], ki3Average: 84, ki3Predicate: "A",
        ki3Description: "Penguasaan konsep kimia organik dan anorganik sangat baik.",
        ki4Scores: [85, 88, 86], ki4Average: 86, ki4Predicate: "A",
        ki4Description: "Terampil dalam praktikum laboratorium.",
        finalAverage: 85, finalGrade: "A", kkm: 75, academicYear: "2025/2026", semester: "ganjil",
    },
    {
        id: 4, subject: "Biologi", teacher: "Ani Suryani, S.Pd",
        ki3Scores: [88, 90, 92, 89], ki3Average: 90, ki3Predicate: "A",
        ki3Description: "Prestasi luar biasa dalam biologi molekuler dan genetika.",
        ki4Scores: [92, 90, 94], ki4Average: 92, ki4Predicate: "A",
        ki4Description: "Keterampilan observasi dan analisis data biologi sangat baik.",
        finalAverage: 91, finalGrade: "A", kkm: 75, academicYear: "2025/2026", semester: "ganjil",
        remedial: { type: "pengayaan" },
    },
    {
        id: 5, subject: "Bahasa Indonesia", teacher: "Dewi Lestari, S.Pd",
        ki3Scores: [80, 78, 82, 81], ki3Average: 80, ki3Predicate: "B",
        ki3Description: "Memahami kaidah bahasa Indonesia dengan baik.",
        ki4Scores: [82, 85, 83], ki4Average: 83, ki4Predicate: "A",
        ki4Description: "Terampil menulis berbagai jenis teks.",
        finalAverage: 81, finalGrade: "B+", kkm: 75, academicYear: "2025/2026", semester: "ganjil",
    },
    {
        id: 6, subject: "Bahasa Inggris", teacher: "Budi Santoso, S.Pd",
        ki3Scores: [85, 88, 86, 87], ki3Average: 86, ki3Predicate: "A",
        ki3Description: "Excellent understanding of English grammar and vocabulary.",
        ki4Scores: [88, 85, 90], ki4Average: 88, ki4Predicate: "A",
        ki4Description: "Fluent in speaking and writing.",
        finalAverage: 87, finalGrade: "A", kkm: 75, academicYear: "2025/2026", semester: "ganjil",
    },
];

const mockAttitude: AttitudeScore = {
    spiritual: {
        score: "A", predicate: "Sangat Baik",
        description: "Menunjukkan sikap spiritual yang sangat baik. Rajin beribadah, jujur, dan berakhlak mulia.",
    },
    social: {
        score: "A", predicate: "Sangat Baik",
        description: "Menunjukkan sikap sosial yang sangat baik. Peduli terhadap sesama dan aktif dalam kegiatan sosial.",
    },
};

const mockExtracurriculars: Extracurricular[] = [
    {
        name: "Pramuka", type: "Wajib", score: "A", predicate: "Sangat Baik",
        description: "Aktif dalam semua kegiatan pramuka. Menunjukkan keterampilan kepramukaan yang sangat baik.",
        instructor: "Kak Ahmad Fauzi, S.Pd",
    },
    {
        name: "Basket", type: "Pilihan", score: "A", predicate: "Sangat Baik",
        description: "Terampil dalam teknik dasar basket. Aktif dalam tim basket sekolah.",
        instructor: "Kak Rudi Hermawan, S.Pd",
    },
    {
        name: "KIR", type: "Pilihan", score: "B", predicate: "Baik",
        description: "Aktif dalam penelitian ilmiah. Karya ilmiah menunjukkan metodologi yang baik.",
        instructor: "Ibu Dr. Siti Aminah, M.Si",
    },
];

const mockAttendance: AttendanceSummary = { sick: 2, permission: 1, alpha: 0 };

const mockSemesterHistory: SemesterSummary[] = [
    { semester: "Genap", academicYear: "2024/2025", averageScore: 84.5, rank: 6, totalStudents: 32 },
    { semester: "Ganjil", academicYear: "2024/2025", averageScore: 83.8, rank: 8, totalStudents: 32 },
];

const mockReportCardNotes: ReportCardNote[] = [
    { category: "Prestasi Akademik", note: "Ananda menunjukkan peningkatan yang signifikan dalam mata pelajaran IPA, khususnya Biologi dan Kimia.", icon: "🏆" },
    { category: "Sikap dan Perilaku", note: "Ananda aktif dalam kegiatan kelas dan menunjukkan sikap yang baik terhadap guru dan teman.", icon: "⭐" },
    { category: "Ekstrakurikuler", note: "Ananda aktif mengikuti kegiatan Pramuka dan Basket. Menunjukkan kepemimpinan yang baik.", icon: "🎯" },
    { category: "Catatan Wali Kelas", note: "Secara keseluruhan, Ananda adalah siswa yang berprestasi dan menjadi kebanggaan kelas.", icon: "📝" },
];

// ==================== HELPER FUNCTIONS ====================

const getGradeColor = (grade: string): string => {
    if (grade === "A") return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (grade === "B") return "bg-blue-100 text-blue-700 border-blue-200";
    if (grade === "C") return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-red-100 text-red-700 border-red-200";
};

const getScoreColor = (score: number, kkm: number): string => {
    if (score >= kkm + 15) return "text-emerald-600";
    if (score >= kkm) return "text-blue-600";
    return "text-red-600";
};

// ==================== SKELETON ====================

const ParentGradesSkeleton: React.FC = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-56" />
                    <Skeleton className="h-9 w-9 rounded-full" />
                </div>
                <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-28" />
            </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 items-stretch">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="rounded-xl bg-white border border-slate-100 shadow-sm p-4">
                    <div className="flex items-center gap-3">
                        <Skeleton className="w-12 h-12 rounded-xl" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-6 w-14" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="p-4 space-y-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-slate-100">
                            <Skeleton className="h-4 w-6" />
                            <div className="flex-1 space-y-1">
                                <Skeleton className="h-4 w-36" />
                                <Skeleton className="h-3 w-28" />
                            </div>
                            <Skeleton className="h-8 w-16" />
                            <Skeleton className="h-8 w-16" />
                            <Skeleton className="h-8 w-12" />
                            <Skeleton className="h-6 w-10 rounded-full" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    </div>
);

// ==================== STAT CARD ====================

const StatCard: React.FC<{
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ElementType;
    color: "blue" | "green" | "amber" | "emerald" | "purple";
}> = ({ title, value, subtitle, icon: Icon, color }) => {
    const colorConfig = {
        blue: { bg: "bg-blue-100", text: "text-blue-600", ring: "ring-blue-200/50" },
        green: { bg: "bg-green-100", text: "text-green-600", ring: "ring-green-200/50" },
        amber: { bg: "bg-amber-100", text: "text-amber-600", ring: "ring-amber-200/50" },
        emerald: { bg: "bg-emerald-100", text: "text-emerald-600", ring: "ring-emerald-200/50" },
        purple: { bg: "bg-purple-100", text: "text-purple-600", ring: "ring-purple-200/50" },
    };
    const config = colorConfig[color];
    return (
        <div className="group relative overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 h-full">
            <div className="p-4 flex flex-col justify-between h-full min-h-[88px]">
                <div className="flex items-start gap-3">
                    <div className={cn(
                        "w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ring-2 transition-transform duration-300 group-hover:scale-105",
                        config.bg, config.ring
                    )}>
                        <Icon className={cn("h-5 w-5", config.text)} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold leading-tight truncate">{title}</p>
                        <p className="text-2xl font-bold text-slate-800 leading-none tabular-nums mt-1">{value}</p>
                        <p className="text-[11px] text-muted-foreground mt-1 truncate">{subtitle ?? "\u00A0"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==================== FILTER DIALOG ====================

const GradesFilterDialog: React.FC<{
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedYearId: string;
    selectedSemester: string;
    academicYears: AcademicYear[];
    onApply: (yearId: string, semester: string) => void;
}> = ({ open, onOpenChange, selectedYearId, selectedSemester, academicYears, onApply }) => {
    const [tempYearId, setTempYearId] = useState(selectedYearId);
    const [tempSemester, setTempSemester] = useState(selectedSemester);

    React.useEffect(() => {
        if (open) {
            setTempYearId(selectedYearId);
            setTempSemester(selectedSemester);
        }
    }, [open, selectedYearId, selectedSemester]);

    // handleYearChange: auto-select first available (non-upcoming) semester when year changes
    const handleYearChange = (yearId: string) => {
        setTempYearId(yearId);
        const year = academicYears.find(y => y.id === yearId);
        const firstAvailable = year?.semesters.find(s => s.status !== "upcoming");
        if (firstAvailable) setTempSemester(firstAvailable.id);
    };

    const handleApply = () => {
        onApply(tempYearId, tempSemester);
        onOpenChange(false);
    };

    const handleReset = () => {
        // Reset to first year with a completed semester
        for (const year of academicYears) {
            const completed = year.semesters.find(s => s.status === "completed");
            if (completed) {
                setTempYearId(year.id);
                setTempSemester(completed.id);
                return;
            }
        }
        setTempYearId(academicYears[0]?.id);
        setTempSemester(academicYears[0]?.semesters[0]?.id ?? "ganjil");
    };

    // Default = first year with completed semester + that semester
    const defaultYearId = (() => {
        for (const year of academicYears) {
            if (year.semesters.some(s => s.status === "completed")) return year.id;
        }
        return academicYears[0]?.id;
    })();
    const defaultSemesterId = academicYears.find(y => y.id === defaultYearId)?.semesters.find(s => s.status === "completed")?.id ?? "";

    const activeFilterCount = 2; // TA dan Semester selalu aktif sebagai filter
    const tempYearSemesters = academicYears.find(y => y.id === tempYearId)?.semesters ?? [];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" className="h-9 gap-2 bg-white text-slate-700 border-slate-200 shadow-sm font-medium">
                    <Filter className="h-4 w-4 text-slate-500" />
                    <span className="hidden sm:inline">Filter</span>
                    {activeFilterCount > 0 && (
                        <Badge className="ml-0.5 h-5 w-5 min-w-[20px] px-0 bg-blue-800 text-white text-[10px] flex items-center justify-center border-0 rounded-full">
                            {activeFilterCount}
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
                        <DialogDescription className="text-slate-500">Sesuaikan tahun ajaran dan semester</DialogDescription>
                    </div>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-slate-400" />
                            Tahun Ajaran
                        </label>
                        <Select value={tempYearId} onValueChange={handleYearChange}>
                            <SelectTrigger className="w-full bg-slate-50/50 border-slate-200">
                                <SelectValue placeholder="Tahun" />
                            </SelectTrigger>
                            <SelectContent>
                                {academicYears.map(year => (
                                    <SelectItem key={year.id} value={year.id}>TA {year.year}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            Semester
                        </label>
                        <Select value={tempSemester} onValueChange={setTempSemester}>
                            <SelectTrigger className="w-full bg-slate-50/50 border-slate-200">
                                <SelectValue placeholder="Semester" />
                            </SelectTrigger>
                            <SelectContent>
                                {tempYearSemesters.map(sem => (
                                    <SelectItem key={sem.id} value={sem.id} disabled={sem.status === "upcoming"}>
                                        <div className="flex items-center gap-2">
                                            <span>Semester {sem.label}</span>
                                            {sem.status === "active" && (
                                                <Badge className="text-[9px] px-1.5 py-0 bg-blue-100 text-blue-700 border-blue-200 font-semibold">Berlangsung</Badge>
                                            )}
                                            {sem.status === "upcoming" && (
                                                <Badge className="text-[9px] px-1.5 py-0 bg-slate-100 text-slate-400 border-slate-200 font-semibold">Belum Dimulai</Badge>
                                            )}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter className="sm:justify-between gap-2 border-t pt-4">
                    <Button variant="ghost" onClick={handleReset} className="text-slate-500 hover:text-red-500 hover:bg-red-50 gap-2">
                        <RotateCcw className="h-4 w-4" />
                        Reset Pilihan
                    </Button>
                    <Button className="bg-blue-800 hover:bg-blue-900 text-white px-8 gap-2" onClick={handleApply}>
                        <Check className="h-4 w-4" />
                        Terapkan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// ==================== FILTER BADGES ====================

const GradesFilterBadges: React.FC<{
    selectedYearId: string;
    selectedSemester: string;
    academicYears: AcademicYear[];
    onClearYear: () => void;
    onClearSemester: () => void;
}> = ({ selectedYearId, selectedSemester, academicYears, onClearYear, onClearSemester }) => {
    const selectedYear = academicYears.find(y => y.id === selectedYearId);
    if (!selectedYear) return null;

    return (
        <div className="flex flex-wrap items-center gap-2 px-1 no-print">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                <SlidersHorizontal className="h-3 w-3" />
                <span>Filter Aktif:</span>
            </div>
            <Badge variant="secondary" className="gap-2 bg-blue-800 text-white border-none px-3 py-1 rounded-lg text-xs font-medium">
                <CalendarIcon className="h-3.5 w-3.5" />
                TA {selectedYear.year}
                {academicYears.length > 1 && (
                    <button onClick={onClearYear} className="inline-flex items-center justify-center h-4 w-4 hover:text-white/70 transition-colors -mr-1" aria-label="Hapus filter tahun ajaran">
                        <X className="h-3.5 w-3.5" />
                    </button>
                )}
            </Badge>
            <Badge variant="secondary" className="gap-2 bg-blue-800 text-white border-none px-3 py-1 rounded-lg text-xs font-medium">
                <BookOpen className="h-3.5 w-3.5" />
                Semester {selectedSemester === "ganjil" ? "Ganjil" : "Genap"}
                <button onClick={onClearSemester} className="inline-flex items-center justify-center h-4 w-4 hover:text-white/70 transition-colors -mr-1" aria-label="Hapus filter semester">
                    <X className="h-3.5 w-3.5" />
                </button>
            </Badge>
        </div>
    );
};

// ==================== ATTITUDE SECTION ====================

const AttitudeSection: React.FC<{ attitude: AttitudeScore }> = ({ attitude }) => (
    <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 rounded-xl">
                    <UserCheck className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                    <CardTitle className="text-lg font-semibold text-slate-800">Nilai Sikap</CardTitle>
                    <CardDescription className="text-sm text-slate-600">Penilaian sikap spiritual dan sosial</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                            <Star className="h-4 w-4 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-800">Sikap Spiritual</p>
                            <Badge className="bg-amber-100 text-amber-800 border-amber-200">{attitude.spiritual.score}</Badge>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-slate-700 mb-2">{attitude.spiritual.predicate}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{attitude.spiritual.description}</p>
                </div>
                <div className="p-4 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-800">Sikap Sosial</p>
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">{attitude.social.score}</Badge>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-slate-700 mb-2">{attitude.social.predicate}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{attitude.social.description}</p>
                </div>
            </div>
        </CardContent>
    </Card>
);

// ==================== ATTENDANCE SECTION ====================

const AttendanceSection: React.FC<{ attendance: AttendanceSummary }> = ({ attendance }) => (
    <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-red-100 rounded-xl">
                        <ClipboardList className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-semibold text-slate-800">Ketidakhadiran</CardTitle>
                        <CardDescription className="text-sm text-slate-600">Rekap presensi harian semester ini</CardDescription>
                    </div>
                </div>
                <Link href="/parent/attendance/daily">
                    <Button variant="ghost" size="sm" className="gap-1 text-blue-700 hover:text-blue-800 hover:bg-blue-50 text-xs">
                        Lihat Detail
                        <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                </Link>
            </div>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-3 gap-3">
                {/* Sakit */}
                <div className="relative overflow-hidden p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                            <Thermometer className="h-4 w-4 text-amber-600" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Hari</span>
                    </div>
                    <p className="text-3xl font-bold text-amber-600 tabular-nums leading-none">{attendance.sick}</p>
                    <p className="text-xs font-semibold text-amber-700 mt-1.5">Sakit</p>
                </div>

                {/* Izin */}
                <div className="relative overflow-hidden p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                            <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Hari</span>
                    </div>
                    <p className="text-3xl font-bold text-blue-600 tabular-nums leading-none">{attendance.permission}</p>
                    <p className="text-xs font-semibold text-blue-700 mt-1.5">Izin</p>
                </div>

                {/* Alpha */}
                <div className="relative overflow-hidden p-4 rounded-xl bg-gradient-to-br from-red-50 to-rose-50 border border-red-200">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">Hari</span>
                    </div>
                    <p className="text-3xl font-bold text-red-600 tabular-nums leading-none">{attendance.alpha}</p>
                    <p className="text-xs font-semibold text-red-700 mt-1.5">Alpha</p>
                    {attendance.alpha > 0 && (
                        <div className="absolute top-2 right-2">
                            <span className="flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </CardContent>
    </Card>
);

// ==================== EXTRACURRICULAR SECTION ====================

const ExtracurricularSection: React.FC<{ extracurriculars: Extracurricular[] }> = ({ extracurriculars }) => (
    <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-100 rounded-xl">
                    <Medal className="h-5 w-5 text-purple-700" />
                </div>
                <div>
                    <CardTitle className="text-lg font-semibold text-slate-800">Ekstrakurikuler</CardTitle>
                    <CardDescription className="text-sm text-slate-600">Prestasi dan partisipasi ekstrakurikuler</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <div className="space-y-3">
                {extracurriculars.map((ekskul, index) => (
                    <div key={index} className="p-4 rounded-xl border border-slate-200 hover:border-purple-200 hover:bg-purple-50/30 transition-all">
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                                    <Medal className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-800">{ekskul.name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="outline" className="text-xs bg-slate-50">{ekskul.type}</Badge>
                                        <Badge className={cn("text-xs", getGradeColor(ekskul.score))}>{ekskul.score} - {ekskul.predicate}</Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{ekskul.description}</p>
                        <p className="text-xs text-slate-500">Pembina: {ekskul.instructor}</p>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
);

// ==================== GRADE DETAIL DIALOG ====================

const GradeDetailDialog: React.FC<{ grade: SubjectGrade | null; onClose: () => void }> = ({ grade, onClose }) => {
    if (!grade) return null;
    return (
        <Dialog open={!!grade} onOpenChange={(open) => { if (!open) onClose(); }}>
            <DialogContent className="sm:max-w-[520px] max-h-[85vh] flex flex-col rounded-2xl">
                <DialogHeader className="flex-row items-center gap-4 flex-shrink-0">
                    <div className="p-2.5 bg-blue-100 rounded-xl">
                        <BookText className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                        <DialogTitle className="text-lg font-semibold text-slate-900">{grade.subject}</DialogTitle>
                        <DialogDescription className="text-slate-500">{grade.teacher}</DialogDescription>
                    </div>
                </DialogHeader>
                <div className="space-y-4 py-2 overflow-y-auto flex-1 pr-1">
                    {/* KKM Info */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-sm font-semibold text-slate-600">KKM (Kriteria Ketuntasan Minimal)</span>
                        <Badge variant="outline" className="font-bold text-slate-700 border-slate-300">{grade.kkm}</Badge>
                    </div>

                    {/* KI-3 */}
                    <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                                </div>
                                <span className="text-sm font-semibold text-slate-800">KI-3 (Pengetahuan)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={cn("text-lg font-bold", getScoreColor(grade.ki3Average, grade.kkm))}>{grade.ki3Average}</span>
                                <Badge className={cn("text-xs", getGradeColor(grade.ki3Predicate))}>{grade.ki3Predicate}</Badge>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {grade.ki3Scores.map((s, i) => (
                                <span key={i} className={cn("text-xs font-semibold px-2 py-0.5 rounded-md border", getScoreColor(s, grade.kkm), "bg-white border-slate-200")}>
                                    {s}
                                </span>
                            ))}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed italic">"{grade.ki3Description}"</p>
                    </div>

                    {/* KI-4 */}
                    <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                                    <Award className="h-3.5 w-3.5 text-emerald-600" />
                                </div>
                                <span className="text-sm font-semibold text-slate-800">KI-4 (Keterampilan)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={cn("text-lg font-bold", getScoreColor(grade.ki4Average, grade.kkm))}>{grade.ki4Average}</span>
                                <Badge className={cn("text-xs", getGradeColor(grade.ki4Predicate))}>{grade.ki4Predicate}</Badge>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {grade.ki4Scores.map((s, i) => (
                                <span key={i} className={cn("text-xs font-semibold px-2 py-0.5 rounded-md border", getScoreColor(s, grade.kkm), "bg-white border-slate-200")}>
                                    {s}
                                </span>
                            ))}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed italic">"{grade.ki4Description}"</p>
                    </div>

                    {/* Final */}
                    <div className={cn("flex items-center justify-between p-4 rounded-xl border-2",
                        grade.finalAverage >= grade.kkm ? "bg-emerald-50 border-emerald-300" : "bg-red-50 border-red-300"
                    )}>
                        <div>
                            <p className="text-sm font-semibold text-slate-700">Nilai Akhir</p>
                            <p className="text-xs text-slate-500 mt-0.5">
                                {grade.finalAverage >= grade.kkm ? "✓ Tuntas KKM" : "✗ Belum Tuntas KKM"}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={cn("text-3xl font-bold", getScoreColor(grade.finalAverage, grade.kkm))}>{grade.finalAverage}</span>
                            <Badge variant="outline" className={cn("text-sm font-bold px-3 py-1", getGradeColor(grade.finalGrade))}>{grade.finalGrade}</Badge>
                        </div>
                    </div>

                    {/* Remedial / Pengayaan */}
                    {grade.remedial && (
                        <div className={cn("p-4 rounded-xl border space-y-2",
                            grade.remedial.type === "remedial"
                                ? "border-amber-200 bg-amber-50/40"
                                : "border-purple-200 bg-purple-50/40"
                        )}>
                            <div className="flex items-center gap-2">
                                <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center",
                                    grade.remedial.type === "remedial" ? "bg-amber-100" : "bg-purple-100"
                                )}>
                                    {grade.remedial.type === "remedial"
                                        ? <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                                        : <Star className="h-3.5 w-3.5 text-purple-600" />
                                    }
                                </div>
                                <span className={cn("text-sm font-semibold",
                                    grade.remedial.type === "remedial" ? "text-amber-800" : "text-purple-800"
                                )}>
                                    {grade.remedial.type === "remedial" ? "Remedial (RTL)" : "Pengayaan"}
                                </span>
                            </div>
                            {grade.remedial.type === "remedial" && (
                                <div className="grid grid-cols-2 gap-2 pt-1">
                                    {grade.remedial.date && (
                                        <div className="text-xs text-slate-600">
                                            <span className="font-semibold text-slate-700">Tanggal: </span>
                                            {new Date(grade.remedial.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                                        </div>
                                    )}
                                    {grade.remedial.scoreAfter !== undefined && (
                                        <div className="text-xs text-slate-600">
                                            <span className="font-semibold text-slate-700">Nilai Setelah: </span>
                                            <span className={cn("font-bold", getScoreColor(grade.remedial.scoreAfter, grade.kkm))}>
                                                {grade.remedial.scoreAfter}
                                            </span>
                                        </div>
                                    )}
                                    {grade.remedial.material && (
                                        <div className="text-xs text-slate-600 col-span-2">
                                            <span className="font-semibold text-slate-700">Materi: </span>
                                            {grade.remedial.material}
                                        </div>
                                    )}
                                </div>
                            )}
                            {grade.remedial.type === "pengayaan" && (
                                <p className="text-xs text-purple-700">Siswa telah mencapai nilai di atas KKM dan mengikuti program pengayaan.</p>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

// ==================== TREND CHART ====================

const TrendChart: React.FC<{ history: SemesterSummary[] }> = ({ history }) => {
    // Reverse so oldest is on the left
    const chartData = [...history].reverse().map(h => ({
        name: `${h.semester.slice(0, 3)} ${h.academicYear.slice(-4)}`,
        nilai: h.averageScore,
        peringkat: h.rank,
    }));

    return (
        <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis domain={[70, 100]} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <ReferenceLine y={75} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: "KKM", position: "right", fontSize: 10, fill: "#f59e0b" }} />
                <RechartsTooltip
                    contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: 12 }}
                    formatter={(value: number) => [`${value}`, "Rata-rata"]}
                />
                <Line
                    type="monotone"
                    dataKey="nilai"
                    stroke="#1d4ed8"
                    strokeWidth={2.5}
                    dot={{ fill: "#1d4ed8", r: 5, strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 7 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

// ==================== MAIN COMPONENT ====================

export const ParentGrades: React.FC = () => {
    const [selectedSemester, setSelectedSemester] = useState(() => {
        // Default to first completed semester of the first year that has one
        for (const year of academicYears) {
            const completed = year.semesters.find(s => s.status === "completed");
            if (completed) return completed.id;
        }
        return "ganjil";
    });
    const [selectedYearId, setSelectedYearId] = useState(() => {
        // Default to first year that has a completed semester
        for (const year of academicYears) {
            if (year.semesters.some(s => s.status === "completed")) return year.id;
        }
        return academicYears[0]?.id ?? "2025-2026";
    });
    const [selectedTab, setSelectedTab] = useState("nilai");
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedGrade, setSelectedGrade] = useState<SubjectGrade | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedChildId, setSelectedChildId] = useState(mockParentProfile.children[0]?.id ?? "");

    const children = mockParentProfile.children;
    const selectedChild = children.find(c => c.id === selectedChildId);

    const activeYear = academicYears.find(y => y.id === selectedYearId);
    const displaySemester = selectedSemester === "ganjil" ? "Ganjil" : "Genap";

    // Determine current semester status
    const currentSemesterStatus = activeYear?.semesters.find(s => s.id === selectedSemester)?.status ?? "completed";
    const isReportAvailable = currentSemesterStatus === "completed";

    const stats = useMemo(() => {
        const totalAverage = mockGrades.reduce((sum, g) => sum + g.finalAverage, 0) / mockGrades.length;
        const highestSubject = mockGrades.reduce((prev, current) => prev.finalAverage > current.finalAverage ? prev : current);
        const lowestSubject = mockGrades.reduce((prev, current) => prev.finalAverage < current.finalAverage ? prev : current);
        const aboveKKM = mockGrades.filter(g => g.finalAverage >= g.kkm).length;
        const currentRank = mockSemesterHistory[0]?.rank ?? "-";
        const totalStudents = mockSemesterHistory[0]?.totalStudents ?? "-";
        return {
            totalAverage: Math.round(totalAverage * 10) / 10,
            highestSubject,
            lowestSubject,
            aboveKKM,
            totalSubjects: mockGrades.length,
            currentRank,
            totalStudents,
        };
    }, []);

    const handleApplyFilter = (yearId: string, semester: string) => {
        setIsLoading(true);
        setSelectedYearId(yearId);
        setSelectedSemester(semester);
        setTimeout(() => setIsLoading(false), 600);
    };

    if (isLoading) return <ParentGradesSkeleton />;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Nilai & </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Rapor</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <GraduationCap className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Laporan hasil belajar akademik
                        {selectedChild && (
                            <span className="font-medium text-slate-700"> · {selectedChild.name} <span className="text-slate-400">·</span> {selectedChild.class}</span>
                        )}
                    </p>
                </div>
                <div className="flex items-center gap-3 no-print">
                    {children.length > 1 && (
                        <Select value={selectedChildId} onValueChange={setSelectedChildId}>
                            <SelectTrigger className="w-auto h-9 bg-white shadow-sm border-slate-200 gap-2 px-3">
                                <Users className="w-4 h-4 text-muted-foreground shrink-0" />
                                <span className="text-sm text-slate-700 font-medium">Ganti Anak</span>
                            </SelectTrigger>
                            <SelectContent>
                                {children.map(child => (
                                    <SelectItem key={child.id} value={child.id}>
                                        {child.name} — {child.class}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                    <GradesFilterDialog
                        open={filterOpen}
                        onOpenChange={setFilterOpen}
                        selectedYearId={selectedYearId}
                        selectedSemester={selectedSemester}
                        academicYears={academicYears}
                        onApply={handleApplyFilter}
                    />
                </div>
            </div>

            {/* Active Filter Badges */}
            <GradesFilterBadges
                selectedYearId={selectedYearId}
                selectedSemester={selectedSemester}
                academicYears={academicYears}
                onClearYear={() => handleApplyFilter(academicYears[0]?.id, selectedSemester)}
                onClearSemester={() => {
                    const firstCompleted = academicYears.find(y => y.id === selectedYearId)?.semesters.find(s => s.status === "completed");
                    handleApplyFilter(selectedYearId, firstCompleted?.id ?? academicYears[0]?.semesters.find(s => s.status === "completed")?.id ?? "ganjil");
                }}
            />

            {/* Stats Cards + Rapor content — only when semester is completed */}
            {!isReportAvailable ? (
                <Card className={cn("border-dashed shadow-sm", currentSemesterStatus === "active" ? "border-blue-200 bg-blue-50/30" : "border-slate-200 bg-slate-50/30")}>
                    <CardContent className="flex flex-col items-center justify-center py-20 text-center px-4">
                        <div className={cn("w-16 h-16 rounded-full border border-dashed flex items-center justify-center mb-4",
                            currentSemesterStatus === "active" ? "bg-blue-50 border-blue-200" : "bg-slate-50 border-slate-200"
                        )}>
                            <FileText className={cn("h-8 w-8", currentSemesterStatus === "active" ? "text-blue-400" : "text-slate-400")} />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">
                            {currentSemesterStatus === "active" ? "Rapor Belum Tersedia" : "Semester Belum Dimulai"}
                        </h3>
                        <p className="text-sm text-slate-500 max-w-md">
                            {currentSemesterStatus === "active"
                                ? `Semester ${displaySemester} sedang berlangsung. Rapor akan tersedia setelah semester berakhir dan nilai difinalisasi oleh guru.`
                                : `Semester ${displaySemester} belum dimulai. Rapor akan tersedia setelah semester selesai.`
                            }
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 items-stretch print:hidden">
                        <StatCard title="Rata-rata Nilai" value={stats.totalAverage} subtitle="Semua mapel" icon={BarChart3} color="blue" />
                        <StatCard title="Nilai Tertinggi" value={stats.highestSubject.finalAverage} subtitle={stats.highestSubject.subject} icon={TrendingUp} color="emerald" />
                        <StatCard title="Nilai Terendah" value={stats.lowestSubject.finalAverage} subtitle={stats.lowestSubject.subject} icon={Target} color="amber" />
                        <StatCard title="Tuntas KKM" value={`${stats.aboveKKM}/${stats.totalSubjects}`} subtitle="Mata pelajaran" icon={Check} color="green" />
                        <StatCard title="Peringkat Kelas" value={`#${stats.currentRank}`} subtitle={`dari ${stats.totalStudents} siswa`} icon={Trophy} color="purple" />
                    </div>

                    {/* Ketidakhadiran — per semester */}
                    <AttendanceSection attendance={mockAttendance} />

                    {/* Main Tabs — Nilai & Catatan Rapor */}
                    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="print:hidden">
                        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid lg:grid-cols-2">
                            <TabsTrigger value="nilai">
                                <BookOpen className="h-4 w-4 mr-2" />
                                Nilai Akademik
                            </TabsTrigger>
                            <TabsTrigger value="catatan">
                                <FileText className="h-4 w-4 mr-2" />
                                Catatan Rapor
                            </TabsTrigger>
                        </TabsList>

                        {/* Nilai Tab */}
                        <TabsContent value="nilai" className="space-y-4 mt-4">
                            <Card className="border-slate-200 shadow-sm">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 bg-blue-100 rounded-xl">
                                                <BookText className="h-5 w-5 text-blue-700" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg font-semibold text-slate-800">Nilai Mata Pelajaran</CardTitle>
                                                <CardDescription className="text-sm text-slate-600">
                                                    Semester {displaySemester} TA. {activeYear?.year} — klik baris untuk detail & deskripsi
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
                                            <Info className="h-3.5 w-3.5" />
                                            <span className="hidden sm:inline">KKM = 75</span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-slate-50 border-b border-slate-200">
                                                    <th className="text-left p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle w-[40px]">No</th>
                                                    <th className="text-left p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle min-w-[180px]">Mata Pelajaran</th>
                                                    <th className="text-center p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle w-[70px]">KKM</th>
                                                    <th className="text-center p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle w-[80px]">KI-3</th>
                                                    <th className="text-center p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle w-[80px]">KI-4</th>
                                                    <th className="text-center p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle w-[80px]">Akhir</th>
                                                    <th className="text-center p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle w-[70px]">Predikat</th>
                                                    <th className="text-center p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle w-[80px]">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {mockGrades.map((grade, index) => (
                                                    <tr
                                                        key={grade.id}
                                                        className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors cursor-pointer group"
                                                        onClick={() => setSelectedGrade(grade)}
                                                    >
                                                        <td className="p-4 align-middle text-center">
                                                            <span className="text-sm text-slate-600 font-medium">{index + 1}</span>
                                                        </td>
                                                        <td className="p-4 align-middle">
                                                            <div className="flex flex-col gap-0.5">
                                                                <span className="text-[15px] text-slate-800 font-semibold group-hover:text-blue-700 transition-colors">{grade.subject}</span>
                                                                <span className="text-[13px] text-slate-500 font-medium">{grade.teacher}</span>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 align-middle text-center">
                                                            <span className="text-sm font-semibold text-slate-500">{grade.kkm}</span>
                                                        </td>
                                                        <td className="p-4 align-middle text-center">
                                                            <div className="flex flex-col items-center gap-1">
                                                                <span className={cn("text-sm font-bold", getScoreColor(grade.ki3Average, grade.kkm))}>{grade.ki3Average}</span>
                                                                <Badge variant="outline" className={cn("text-xs", getGradeColor(grade.ki3Predicate))}>{grade.ki3Predicate}</Badge>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 align-middle text-center">
                                                            <div className="flex flex-col items-center gap-1">
                                                                <span className={cn("text-sm font-bold", getScoreColor(grade.ki4Average, grade.kkm))}>{grade.ki4Average}</span>
                                                                <Badge variant="outline" className={cn("text-xs", getGradeColor(grade.ki4Predicate))}>{grade.ki4Predicate}</Badge>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 align-middle text-center">
                                                            <span className={cn("text-base font-bold", getScoreColor(grade.finalAverage, grade.kkm))}>{grade.finalAverage}</span>
                                                        </td>
                                                        <td className="p-4 align-middle text-center">
                                                            <Badge variant="outline" className={cn("inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium border rounded-full", getGradeColor(grade.finalGrade))}>
                                                                {grade.finalGrade}
                                                            </Badge>
                                                        </td>
                                                        <td className="p-4 align-middle text-center">
                                                            {grade.finalAverage >= grade.kkm ? (
                                                                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px] font-semibold">Tuntas</Badge>
                                                            ) : (
                                                                <Badge className="bg-red-100 text-red-700 border-red-200 text-[10px] font-semibold">Belum</Badge>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50 flex items-center gap-1.5 text-xs text-slate-400">
                                        <Info className="h-3.5 w-3.5" />
                                        Klik baris untuk melihat deskripsi capaian kompetensi dan skor detail
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Catatan Tab */}
                        <TabsContent value="catatan" className="space-y-4 mt-4">
                            <Card className="border-blue-200 shadow-sm">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-blue-100 rounded-xl">
                                            <FileText className="h-5 w-5 text-blue-700" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg font-semibold text-slate-800">Catatan Rapor</CardTitle>
                                            <CardDescription className="text-sm text-slate-600">Semester {displaySemester} TA. {activeYear?.year}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {mockReportCardNotes.map((item, index) => (
                                        <div
                                            key={index}
                                            className={cn(
                                                "p-4 rounded-xl border bg-gradient-to-r from-slate-50/50 to-white",
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

                    {/* Grade Detail Dialog */}
                    <GradeDetailDialog grade={selectedGrade} onClose={() => setSelectedGrade(null)} />

                    {/* Nilai Sikap — per semester */}
                    <AttitudeSection attitude={mockAttitude} />

                    {/* Ekstrakurikuler — per semester */}
                    <ExtracurricularSection extracurriculars={mockExtracurriculars} />
                </div>
            )}

            {/* Tren Nilai — selalu tampil sebagai konteks historis lintas semester */}
            <Card className="border-blue-200 shadow-sm print:hidden">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-100 rounded-xl">
                            <TrendingUp className="h-5 w-5 text-blue-700" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold text-slate-800">Tren Nilai</CardTitle>
                            <CardDescription className="text-sm text-slate-600">Perkembangan rata-rata nilai antar semester</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-200">
                        <TrendChart history={mockSemesterHistory} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
