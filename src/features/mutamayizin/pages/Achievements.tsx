"use client";

import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Award,
    Plus,
    Search,
    MapPin,
    Star,
    Filter,
    TrendingUp,
    Trophy,
    Edit,
    Trash2,
    User,
    Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    useMutamayizinAchievements,
    useCreateAchievement,
    useUpdateAchievement,
    useDeleteAchievement,
} from "../hooks/useMutamayizinAchievements";
import { getStudents, getAcademicYears, getAchievement } from "../services/mutamayizinService";
import type {
    Achievement,
    AchievementDetail,
    StudentOption,
    AcademicYear,
    CreateAchievementData,
} from "../services/mutamayizinService";
import { PaginationControls } from "@/features/shared/components/PaginationControls";
import { EmptyState } from "@/features/shared/components/EmptyState";
import { ErrorState } from "@/features/shared/components/ErrorState";
import { SkeletonTableRow } from "@/features/shared/components/SkeletonBlocks";

// ==================== HELPERS ====================

const getRankBadgeColor = (rank: string) => {
    switch (rank) {
        case "Juara 1":
            return "bg-emerald-100 text-emerald-700 border-emerald-300";
        case "Juara 2":
            return "bg-sky-100 text-sky-700 border-sky-300";
        case "Juara 3":
            return "bg-orange-100 text-orange-700 border-orange-300";
        default:
            return "bg-zinc-100 text-zinc-600 border-zinc-300";
    }
};

const getLevelBadgeColor = () => "bg-amber-100 text-amber-800 border-amber-300";

const LEVEL_OPTIONS = ["kabupaten", "provinsi", "nasional", "internasional"];
const SEMESTER_OPTIONS = [
    { value: "1", label: "Semester 1" },
    { value: "2", label: "Semester 2" },
];

// ==================== FORM MODAL ====================

interface AchievementFormData {
    student_profile_id: string;
    academic_year_id: string;
    competition_name: string;
    category: string;
    rank: string;
    level: string;
    date: string;
    semester: string;
}

const EMPTY_FORM: AchievementFormData = {
    student_profile_id: "",
    academic_year_id: "",
    competition_name: "",
    category: "",
    rank: "",
    level: "",
    date: "",
    semester: "",
};

interface AchievementFormModalProps {
    open: boolean;
    onClose: () => void;
    editData?: AchievementDetail | null;
    students: StudentOption[];
    academicYears: AcademicYear[];
    onSubmit: (data: CreateAchievementData) => void;
    isSubmitting: boolean;
}

const AchievementFormModal: React.FC<AchievementFormModalProps> = ({
    open,
    onClose,
    editData,
    students,
    academicYears,
    onSubmit,
    isSubmitting,
}) => {
    const [form, setForm] = useState<AchievementFormData>(EMPTY_FORM);

    useEffect(() => {
        if (editData) {
            setForm({
                student_profile_id: String(editData.studentProfileId ?? ""),
                academic_year_id: String(editData.academicYearId ?? ""),
                competition_name: editData.competitionName,
                category: editData.category ?? "",
                rank: editData.rank,
                level: editData.level,
                date: editData.date,
                semester: String(editData.semester ?? ""),
            });
        } else {
            setForm(EMPTY_FORM);
        }
    }, [editData, open]);

    const handleChange = (field: keyof AchievementFormData, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            student_profile_id: Number(form.student_profile_id),
            academic_year_id: Number(form.academic_year_id),
            competition_name: form.competition_name,
            category: form.category || undefined,
            rank: form.rank,
            level: form.level,
            date: form.date,
            semester: form.semester ? Number(form.semester) : undefined,
        });
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{editData ? "Edit Prestasi" : "Tambah Prestasi"}</DialogTitle>
                    <DialogDescription>
                        {editData ? "Perbarui data prestasi siswa." : "Isi data prestasi siswa baru."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Siswa */}
                    <div className="space-y-1.5">
                        <Label htmlFor="student">Siswa <span className="text-red-500">*</span></Label>
                        <Select
                            value={form.student_profile_id}
                            onValueChange={(v) => handleChange("student_profile_id", v)}
                            required
                        >
                            <SelectTrigger id="student">
                                <SelectValue placeholder="Pilih siswa..." />
                            </SelectTrigger>
                            <SelectContent>
                                {students.map((s) => (
                                    <SelectItem key={s.id} value={String(s.id)}>
                                        {s.name} — {s.class}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Tahun Ajaran */}
                    <div className="space-y-1.5">
                        <Label htmlFor="academic_year">Tahun Ajaran <span className="text-red-500">*</span></Label>
                        <Select
                            value={form.academic_year_id}
                            onValueChange={(v) => handleChange("academic_year_id", v)}
                            required
                        >
                            <SelectTrigger id="academic_year">
                                <SelectValue placeholder="Pilih tahun ajaran..." />
                            </SelectTrigger>
                            <SelectContent>
                                {academicYears.map((ay) => (
                                    <SelectItem key={ay.id} value={String(ay.id)}>
                                        {ay.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Semester */}
                    <div className="space-y-1.5">
                        <Label htmlFor="semester">Semester</Label>
                        <Select
                            value={form.semester}
                            onValueChange={(v) => handleChange("semester", v)}
                        >
                            <SelectTrigger id="semester">
                                <SelectValue placeholder="Pilih semester..." />
                            </SelectTrigger>
                            <SelectContent>
                                {SEMESTER_OPTIONS.map((s) => (
                                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Nama Kompetisi */}
                    <div className="space-y-1.5">
                        <Label htmlFor="competition_name">Nama Kompetisi <span className="text-red-500">*</span></Label>
                        <Input
                            id="competition_name"
                            value={form.competition_name}
                            onChange={(e) => handleChange("competition_name", e.target.value)}
                            placeholder="Contoh: Olimpiade Matematika"
                            required
                        />
                    </div>

                    {/* Kategori */}
                    <div className="space-y-1.5">
                        <Label htmlFor="category">Kategori</Label>
                        <Input
                            id="category"
                            value={form.category}
                            onChange={(e) => handleChange("category", e.target.value)}
                            placeholder="Contoh: Akademik, Olahraga, Seni"
                        />
                    </div>

                    {/* Peringkat */}
                    <div className="space-y-1.5">
                        <Label htmlFor="rank">Peringkat <span className="text-red-500">*</span></Label>
                        <Input
                            id="rank"
                            value={form.rank}
                            onChange={(e) => handleChange("rank", e.target.value)}
                            placeholder="Contoh: Juara 1, Juara 2, Harapan 1"
                            required
                        />
                    </div>

                    {/* Level */}
                    <div className="space-y-1.5">
                        <Label htmlFor="level">Level <span className="text-red-500">*</span></Label>
                        <Select
                            value={form.level}
                            onValueChange={(v) => handleChange("level", v)}
                            required
                        >
                            <SelectTrigger id="level">
                                <SelectValue placeholder="Pilih level..." />
                            </SelectTrigger>
                            <SelectContent>
                                {LEVEL_OPTIONS.map((l) => (
                                    <SelectItem key={l} value={l}>
                                        {l.charAt(0).toUpperCase() + l.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Tanggal */}
                    <div className="space-y-1.5">
                        <Label htmlFor="date">Tanggal <span className="text-red-500">*</span></Label>
                        <Input
                            id="date"
                            type="date"
                            value={form.date}
                            onChange={(e) => handleChange("date", e.target.value)}
                            required
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="bg-blue-800 hover:bg-blue-900 text-white"
                            disabled={isSubmitting}
                        >
                            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            {editData ? "Simpan Perubahan" : "Tambah Prestasi"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

// ==================== MAIN PAGE ====================

export const MutamayizinAchievements: React.FC = () => {
    // Pagination state
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(15);

    // Filter state
    const [search, setSearch] = useState("");
    const [academicYearId, setAcademicYearId] = useState<string>("all");
    const [semester, setSemester] = useState<string>("all");
    const [levelFilter, setLevelFilter] = useState<string>("all");

    // Debounced search
    const [debouncedSearch, setDebouncedSearch] = useState("");
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(t);
    }, [search]);

    // Reset page when filters change
    useEffect(() => { setPage(1); }, [debouncedSearch, academicYearId, semester, levelFilter]);

    // Hooks
    const { achievements, isLoading, error, meta, refetch } = useMutamayizinAchievements({
        page,
        per_page: perPage,
        search: debouncedSearch || undefined,
        academic_year_id: academicYearId !== "all" ? academicYearId : undefined,
        semester: semester !== "all" ? semester : undefined,
        level: levelFilter !== "all" ? levelFilter : undefined,
    });

    const createMutation = useCreateAchievement();
    const updateMutation = useUpdateAchievement();
    const deleteMutation = useDeleteAchievement();

    // Dropdown data
    const [students, setStudents] = useState<StudentOption[]>([]);
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
    useEffect(() => {
        getStudents().then(setStudents).catch(() => {});
        getAcademicYears().then(setAcademicYears).catch(() => {});
    }, []);

    // Modal state
    const [formOpen, setFormOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<AchievementDetail | null>(null);
    const [editLoading, setEditLoading] = useState(false);

    // Delete dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Achievement | null>(null);

    // Handlers
    const handleAddNew = () => {
        setEditTarget(null);
        setFormOpen(true);
    };

    const handleEdit = (achievement: Achievement) => {
        setEditLoading(true);
        getAchievement(achievement.id)
            .then((detail) => {
                setEditTarget(detail);
                setFormOpen(true);
            })
            .catch(() => {
                // fallback: open with partial data
                setEditTarget(null);
                setFormOpen(true);
            })
            .finally(() => setEditLoading(false));
    };

    const handleDeleteClick = (achievement: Achievement) => {
        setDeleteTarget(achievement);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!deleteTarget) return;
        deleteMutation.mutate(deleteTarget.id, {
            onSuccess: () => {
                setDeleteDialogOpen(false);
                setDeleteTarget(null);
            },
        });
    };

    const handleFormSubmit = (data: CreateAchievementData) => {
        if (editTarget) {
            updateMutation.mutate(
                { id: editTarget.id, data },
                { onSuccess: () => setFormOpen(false) }
            );
        } else {
            createMutation.mutate(data, {
                onSuccess: () => setFormOpen(false),
            });
        }
    };

    const isSubmitting = createMutation.isPending || updateMutation.isPending || editLoading;

    // Pagination values
    const totalItems = meta?.total ?? 0;
    const totalPages = meta?.last_page ?? 1;
    const startIndex = totalItems === 0 ? 0 : (page - 1) * perPage + 1;
    const endIndex = Math.min(page * perPage, totalItems);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Data </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Prestasi</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Award className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Kelola data dan riwayat prestasi siswa Program Mutamayizin
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleAddNew}
                        className="bg-blue-800 text-white hover:bg-blue-900 px-6 py-2.5"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Prestasi
                    </Button>
                </div>
            </div>

            {/* Stats Card */}
            <Card className="overflow-hidden p-0">
                <div className="bg-blue-800 p-4 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-40 h-40 border-[20px] border-white rounded-full -translate-y-1/2 translate-x-1/4" />
                        <div className="absolute bottom-0 right-1/3 w-20 h-20 border-[8px] border-white rounded-full translate-y-1/2" />
                    </div>
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                            <Award className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Statistik Prestasi</h2>
                            <p className="text-blue-100 text-sm">Program Mutamayizin Alfityan</p>
                        </div>
                    </div>
                </div>
                <CardContent className="p-0">
                    <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x">
                        <div className="p-2.5 text-center">
                            <div className="inline-flex p-2 bg-blue-100 rounded-full mb-1.5">
                                <Trophy className="h-4 w-4 text-blue-800" />
                            </div>
                            <p className="text-2xl font-bold text-slate-900">{totalItems}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Total Prestasi</p>
                        </div>
                        <div className="p-2.5 text-center">
                            <div className="inline-flex p-2 bg-red-100 rounded-full mb-1.5">
                                <Star className="h-4 w-4 text-red-600" />
                            </div>
                            <p className="text-2xl font-bold text-slate-900">
                                {achievements.filter((a) =>
                                    ["nasional", "internasional"].includes(a.level?.toLowerCase() ?? "")
                                ).length}
                            </p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Nasional &amp; Internasional</p>
                        </div>
                        <div className="p-2.5 text-center">
                            <div className="inline-flex p-2 bg-emerald-100 rounded-full mb-1.5">
                                <TrendingUp className="h-4 w-4 text-emerald-600" />
                            </div>
                            <p className="text-2xl font-bold text-emerald-600">
                                {achievements.filter((a) => a.rank === "Juara 1").length}
                            </p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Juara 1</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Table Card */}
            <Card>
                <CardHeader className="pb-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Award className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold">Daftar Prestasi Siswa</CardTitle>
                                <CardDescription>Daftar pencapaian dan kompetisi siswa Program Mutamayizin</CardDescription>
                            </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            {totalItems} Prestasi
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {/* Toolbar */}
                    <div className="px-4 pb-4 pt-2 border-b">
                        <div className="flex flex-col md:flex-row gap-3">
                            {/* Search */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    placeholder="Cari nama siswa atau kompetisi..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10 h-11"
                                />
                            </div>

                            {/* Tahun Ajaran */}
                            <Select value={academicYearId} onValueChange={setAcademicYearId}>
                                <SelectTrigger className="w-[180px] h-11">
                                    <SelectValue placeholder="Tahun Ajaran" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Tahun</SelectItem>
                                    {academicYears.map((ay) => (
                                        <SelectItem key={ay.id} value={String(ay.id)}>{ay.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Semester */}
                            <Select value={semester} onValueChange={setSemester}>
                                <SelectTrigger className="w-[160px] h-11">
                                    <SelectValue placeholder="Semester" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Semester</SelectItem>
                                    {SEMESTER_OPTIONS.map((s) => (
                                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Level */}
                            <Select value={levelFilter} onValueChange={setLevelFilter}>
                                <SelectTrigger className="w-[160px] h-11">
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Level</SelectItem>
                                    {LEVEL_OPTIONS.map((l) => (
                                        <SelectItem key={l} value={l}>
                                            {l.charAt(0).toUpperCase() + l.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Error State */}
                    {error && !isLoading && (
                        <div className="p-4">
                            <ErrorState
                                error={(error as Error).message ?? "Gagal memuat data prestasi."}
                                onRetry={refetch}
                            />
                        </div>
                    )}

                    {/* Table */}
                    {!error && (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="text-left p-4 font-medium text-sm w-12">No</th>
                                        <th className="text-left p-4 font-medium text-sm min-w-[160px]">Nama Siswa</th>
                                        <th className="text-left p-4 font-medium text-sm w-28">Kelas</th>
                                        <th className="text-left p-4 font-medium text-sm min-w-[200px]">Nama Kompetisi</th>
                                        <th className="text-left p-4 font-medium text-sm w-32">Kategori</th>
                                        <th className="text-left p-4 font-medium text-sm w-32">Peringkat</th>
                                        <th className="text-left p-4 font-medium text-sm w-32">Level</th>
                                        <th className="text-left p-4 font-medium text-sm w-32">Tanggal</th>
                                        <th className="text-center p-4 font-medium text-sm w-24">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        Array.from({ length: perPage > 10 ? 10 : perPage }).map((_, i) => (
                                            <SkeletonTableRow key={i} cols={9} />
                                        ))
                                    ) : achievements.length === 0 ? (
                                        <tr>
                                            <td colSpan={9} className="p-0">
                                                <EmptyState
                                                    icon={Award}
                                                    title="Belum Ada Prestasi"
                                                    description={
                                                        debouncedSearch
                                                            ? `Tidak ada prestasi yang cocok dengan pencarian "${debouncedSearch}"`
                                                            : "Belum ada data prestasi untuk filter yang dipilih."
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    ) : (
                                        achievements.map((achievement, index) => (
                                            <tr
                                                key={achievement.id}
                                                className="border-b hover:bg-muted/50 transition-all duration-150"
                                            >
                                                <td className="p-4">
                                                    <span className="text-sm font-medium text-muted-foreground">
                                                        {(page - 1) * perPage + index + 1}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                            <User className="h-4 w-4 text-blue-800" />
                                                        </div>
                                                        <span className="text-foreground text-sm">{achievement.studentName}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="text-sm text-muted-foreground">{achievement.className}</span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="space-y-0.5">
                                                        <div className="text-sm text-foreground leading-tight">{achievement.competitionName}</div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="text-sm text-muted-foreground">{achievement.category}</span>
                                                </td>
                                                <td className="p-4">
                                                    <Badge
                                                        variant="outline"
                                                        className={`${getRankBadgeColor(achievement.rank)} font-medium px-2.5 py-1 text-xs`}
                                                    >
                                                        <Star className="h-3.5 w-3.5 mr-1.5" />
                                                        {achievement.rank}
                                                    </Badge>
                                                </td>
                                                <td className="p-4">
                                                    <Badge
                                                        variant="outline"
                                                        className={`${getLevelBadgeColor()} font-medium px-2.5 py-1 text-xs`}
                                                    >
                                                        <MapPin className="h-3.5 w-3.5 mr-1.5" />
                                                        {achievement.level
                                                            ? achievement.level.charAt(0).toUpperCase() + achievement.level.slice(1)
                                                            : "-"}
                                                    </Badge>
                                                </td>
                                                <td className="p-4">
                                                    <span className="text-sm text-muted-foreground">
                                                        {new Date(achievement.date).toLocaleDateString("id-ID", {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        })}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 bg-amber-50 hover:bg-amber-100 text-amber-600 border-amber-200"
                                                            onClick={() => handleEdit(achievement)}
                                                            title="Edit"
                                                        >
                                                            <Edit className="h-3.5 w-3.5" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                                                            onClick={() => handleDeleteClick(achievement)}
                                                            title="Hapus"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {!error && !isLoading && totalItems > 0 && (
                        <PaginationControls
                            currentPage={page}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            startIndex={startIndex}
                            endIndex={endIndex}
                            itemsPerPage={perPage}
                            itemLabel="prestasi"
                            onPageChange={setPage}
                            onItemsPerPageChange={(v) => { setPerPage(v); setPage(1); }}
                            itemsPerPageOptions={[10, 15, 20, 50]}
                        />
                    )}
                </CardContent>
            </Card>

            {/* Form Modal */}
            <AchievementFormModal
                open={formOpen}
                onClose={() => setFormOpen(false)}
                editData={editTarget}
                students={students}
                academicYears={academicYears}
                onSubmit={handleFormSubmit}
                isSubmitting={isSubmitting}
            />

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Prestasi</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus prestasi{" "}
                            <strong>{deleteTarget?.competitionName}</strong> milik{" "}
                            <strong>{deleteTarget?.studentName}</strong>? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteMutation.isPending}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            disabled={deleteMutation.isPending}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {deleteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
