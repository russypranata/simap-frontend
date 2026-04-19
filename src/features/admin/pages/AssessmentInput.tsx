'use client';

import React, { useState, useCallback } from 'react';
import {
    ClipboardList,
    Search,
    ArrowRight,
    RefreshCw,
    FilterX,
    FileX,
    Plus,
    Trash2,
    X,
    Save,
    Loader2,
    BookOpen,
    ChevronLeft,
    ClipboardCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';
import { toast } from 'sonner';

import {
    useAssessmentClassSubjects,
    useAssessments,
    useAssessmentGrades,
} from '../hooks/useAdminAssessment';
import {
    AdminClassSubjectProgress,
    AdminAssessment,
    StudentGradeRow,
    CreateAssessmentPayload,
} from '../types/assessment';
import { ErrorState } from '@/features/shared/components/ErrorState';
import { PaginationControls } from '@/features/shared/components/PaginationControls';

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<string, string> = {
    completed: 'text-green-600 bg-green-50 border-green-200',
    partial:   'text-amber-600 bg-amber-50 border-amber-200',
    pending:   'text-slate-500 bg-slate-100 border-slate-200',
};
const STATUS_LABEL: Record<string, string> = {
    completed: 'Selesai',
    partial:   'Sebagian',
    pending:   'Belum Mulai',
};
const TYPE_LABEL: Record<string, string> = {
    daily:      'Harian',
    midterm:    'UTS',
    final:      'UAS',
    assignment: 'Tugas',
};
const TYPE_STYLE: Record<string, string> = {
    daily:      'bg-blue-50 text-blue-700 border-blue-200',
    midterm:    'bg-purple-50 text-purple-700 border-purple-200',
    final:      'bg-red-50 text-red-700 border-red-200',
    assignment: 'bg-amber-50 text-amber-700 border-amber-200',
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const PageSkeleton: React.FC = () => (
    <tr>
        <td colSpan={5} className="px-6 py-12">
            <div className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-4 w-52" />
                </div>
                <Card>
                    <CardHeader className="pb-4 space-y-4">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-lg" />
                            <div className="space-y-1">
                                <Skeleton className="h-5 w-48" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>
                        <Skeleton className="h-10 w-full" />
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="border-t">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-slate-50">
                                    <div className="flex-1 space-y-1.5">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-3 w-40" />
                                    </div>
                                    <Skeleton className="h-3 w-28" />
                                    <Skeleton className="h-2 w-32 rounded-full" />
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                    <Skeleton className="h-8 w-24 rounded-lg" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </td>
    </tr>
);

// ─── Dialog: Input Nilai ──────────────────────────────────────────────────────

interface GradeInputDialogProps {
    assessment: AdminAssessment;
    onClose: () => void;
}

const GradeInputDialog: React.FC<GradeInputDialogProps> = ({ assessment, onClose }) => {
    const { grades, isLoading, saveGrades, isSaving } = useAssessmentGrades(assessment.id);
    const [localScores, setLocalScores] = useState<Record<number, string>>({});
    const [initialized, setInitialized] = useState(false);

    // Initialize local scores dari data API
    React.useEffect(() => {
        if (!isLoading && !initialized && grades.length > 0) {
            const init: Record<number, string> = {};
            grades.forEach((g) => {
                init[g.student_id] = g.score !== null ? String(g.score) : '';
            });
            setLocalScores(init);
            setInitialized(true);
        }
    }, [isLoading, grades, initialized]);

    const handleSave = async () => {
        const payload = grades.map((g) => ({
            student_id: g.student_id,
            score: localScores[g.student_id] !== '' && localScores[g.student_id] !== undefined
                ? Number(localScores[g.student_id])
                : null,
        }));

        // Validate scores
        const invalid = payload.find(
            (p) => p.score !== null && (isNaN(p.score) || p.score < 0 || p.score > assessment.max_score)
        );
        if (invalid) {
            toast.error(`Nilai harus antara 0 – ${assessment.max_score}`);
            return;
        }

        await saveGrades(payload);
        onClose();
    };

    return (
        <div className="space-y-4">
            {/* Assessment info */}
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className={cn('px-2 py-1 rounded text-xs font-semibold border', TYPE_STYLE[assessment.type])}>
                    {TYPE_LABEL[assessment.type]}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-sm">{assessment.title}</p>
                    <p className="text-xs text-slate-500">Nilai maks: {assessment.max_score} · Bobot: {assessment.weight}%</p>
                </div>
            </div>

            {isLoading ? (
                <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full rounded-lg" />
                    ))}
                </div>
            ) : grades.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                    <ClipboardCheck className="h-8 w-8 text-slate-300 mb-2" />
                    <p className="text-slate-500 text-sm">Tidak ada siswa di kelas ini</p>
                </div>
            ) : (
                <div className="max-h-[55vh] overflow-y-auto space-y-1.5 pr-1">
                    {grades.map((g, idx) => (
                        <div key={g.student_id} className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-100 hover:border-slate-200 bg-white">
                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                                {idx + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-slate-800 text-sm truncate">{g.student_name ?? '—'}</p>
                                <p className="text-[11px] text-slate-500 font-mono">{g.admission_number ?? '—'}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <Input
                                    type="number"
                                    min={0}
                                    max={g.max_score}
                                    step="0.5"
                                    placeholder="—"
                                    value={localScores[g.student_id] ?? ''}
                                    onChange={(e) => setLocalScores((prev) => ({ ...prev, [g.student_id]: e.target.value }))}
                                    className="w-20 h-8 text-center text-sm font-semibold"
                                />
                                <span className="text-xs text-slate-400 w-8 text-center">/{assessment.max_score}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button variant="outline" onClick={onClose} disabled={isSaving}>
                    <X className="h-4 w-4 mr-1" /> Batal
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={isSaving || isLoading || grades.length === 0}
                    className="bg-blue-800 hover:bg-blue-900 text-white"
                >
                    {isSaving ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Menyimpan...</>
                    ) : (
                        <><Save className="h-4 w-4 mr-2" /> Simpan Nilai</>
                    )}
                </Button>
            </div>
        </div>
    );
};

// ─── View: Detail Assessment (Komponen Nilai) ──────────────────────────────────

interface AssessmentDetailViewProps {
    classSubject: AdminClassSubjectProgress;
    onBack: () => void;
}

const SEMESTER_OPTIONS = [
    { value: '1', label: 'Semester 1' },
    { value: '2', label: 'Semester 2' },
];

const AssessmentDetailView: React.FC<AssessmentDetailViewProps> = ({ classSubject, onBack }) => {
    const { assessments, isLoading, isError, createAssessment, deleteAssessment, isCreating, isDeleting } =
        useAssessments(classSubject.id);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [gradeTarget, setGradeTarget] = useState<AdminAssessment | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // Form state
    const [formTitle, setFormTitle] = useState('');
    const [formType, setFormType] = useState<CreateAssessmentPayload['type']>('daily');
    const [formMaxScore, setFormMaxScore] = useState('100');
    const [formWeight, setFormWeight] = useState('10');
    const [formSemesterId, setFormSemesterId] = useState('1');

    const resetForm = () => {
        setFormTitle('');
        setFormType('daily');
        setFormMaxScore('100');
        setFormWeight('10');
        setFormSemesterId('1');
    };

    const handleCreate = async () => {
        if (!formTitle.trim()) { toast.error('Nama komponen wajib diisi'); return; }
        await createAssessment({
            class_subject_id: classSubject.id,
            title: formTitle.trim(),
            type: formType,
            max_score: Number(formMaxScore),
            weight: Number(formWeight),
            semester_id: Number(formSemesterId),
        });
        resetForm();
        setIsFormOpen(false);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <Button variant="ghost" size="sm" onClick={onBack} className="mb-2 -ml-1 text-slate-500 hover:text-slate-800">
                        <ChevronLeft className="h-4 w-4 mr-1" /> Kembali ke Daftar
                    </Button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Input Nilai —{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                {classSubject.class_name}
                            </span>
                        </h1>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        {classSubject.subject_name} · {classSubject.teacher_name ?? 'Belum ada guru'} · {classSubject.total_students} Siswa
                    </p>
                </div>
                <Button
                    onClick={() => setIsFormOpen(true)}
                    className="bg-blue-800 hover:bg-blue-900 text-white shadow-md"
                >
                    <Plus className="h-4 w-4 mr-2" /> Tambah Komponen Nilai
                </Button>
            </div>

            {isError && <ErrorState error="Gagal memuat komponen penilaian." onRetry={() => {}} />}

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
                                <ClipboardList className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Komponen Penilaian</CardTitle>
                                <CardDescription>Klik "Input Nilai" untuk memasukkan nilai siswa</CardDescription>
                            </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">
                            {assessments.length} Komponen
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="border-t border-slate-200 overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Komponen</th>
                                    <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Tipe</th>
                                    <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Nilai Maks.</th>
                                    <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Bobot</th>
                                    <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Sudah Dinilai</th>
                                    <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    [...Array(3)].map((_, i) => (
                                        <tr key={i} className="border-b border-slate-50">
                                            <td className="px-6 py-4"><Skeleton className="h-4 w-36" /></td>
                                            <td className="px-6 py-4"><Skeleton className="h-6 w-16 rounded-full" /></td>
                                            <td className="px-6 py-4"><Skeleton className="h-4 w-12" /></td>
                                            <td className="px-6 py-4"><Skeleton className="h-4 w-10" /></td>
                                            <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                                            <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-24 ml-auto" /></td>
                                        </tr>
                                    ))
                                ) : assessments.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                                <FileX className="h-8 w-8 text-slate-300 mb-2" />
                                                <p className="text-sm text-slate-500">Belum ada komponen penilaian</p>
                                                <p className="text-xs text-slate-400 mt-1">Klik "Tambah Komponen Nilai" untuk memulai</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    assessments.map((a) => (
                                        <tr key={a.id} className="group border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-slate-900">{a.title}</p>
                                                <p className="text-xs text-slate-500 font-mono mt-0.5">{a.semester_name ?? `Semester ${a.semester_id}`}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="outline" className={cn('text-xs font-semibold', TYPE_STYLE[a.type])}>
                                                    {TYPE_LABEL[a.type]}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-slate-700">{a.max_score}</td>
                                            <td className="px-6 py-4 text-sm text-slate-700">{a.weight}%</td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm tabular-nums text-slate-700">
                                                    {a.total_grades} / {classSubject.total_students} siswa
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-blue-700 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                                                        onClick={() => setGradeTarget(a)}
                                                    >
                                                        Input Nilai <ArrowRight className="h-3 w-3 ml-1" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => setDeleteId(a.id)}
                                                        disabled={isDeleting}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
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

            {/* Dialog: Tambah Komponen */}
            <Dialog open={isFormOpen} onOpenChange={(o) => { if (!o) { resetForm(); } setIsFormOpen(o); }}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Tambah Komponen Penilaian</DialogTitle>
                        <DialogDescription>
                            Untuk {classSubject.subject_name} · {classSubject.class_name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">Nama Komponen *</label>
                            <Input
                                placeholder="cth: Ulangan Harian Bab 1"
                                value={formTitle}
                                onChange={(e) => setFormTitle(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Tipe *</label>
                                <Select value={formType} onValueChange={(v) => setFormType(v as CreateAssessmentPayload['type'])}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="daily">Harian</SelectItem>
                                        <SelectItem value="assignment">Tugas</SelectItem>
                                        <SelectItem value="midterm">UTS</SelectItem>
                                        <SelectItem value="final">UAS</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Semester *</label>
                                <Select value={formSemesterId} onValueChange={setFormSemesterId}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Semester 1</SelectItem>
                                        <SelectItem value="2">Semester 2</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Nilai Maks *</label>
                                <Input
                                    type="number"
                                    min={1}
                                    max={100}
                                    value={formMaxScore}
                                    onChange={(e) => setFormMaxScore(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Bobot (%) *</label>
                                <Input
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={formWeight}
                                    onChange={(e) => setFormWeight(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => { resetForm(); setIsFormOpen(false); }}>Batal</Button>
                        <Button
                            onClick={handleCreate}
                            disabled={isCreating}
                            className="bg-blue-800 hover:bg-blue-900 text-white"
                        >
                            {isCreating ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Menyimpan...</> : <><Plus className="h-4 w-4 mr-2" />Tambah</>}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Dialog: Input Nilai */}
            <Dialog open={!!gradeTarget} onOpenChange={(o) => { if (!o) setGradeTarget(null); }}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Input Nilai Siswa</DialogTitle>
                        <DialogDescription>
                            {classSubject.class_name} · {classSubject.subject_name}
                        </DialogDescription>
                    </DialogHeader>
                    {gradeTarget && (
                        <GradeInputDialog
                            assessment={gradeTarget}
                            onClose={() => setGradeTarget(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Hapus Assessment */}
            <AlertDialog open={deleteId !== null} onOpenChange={(o) => { if (!o) setDeleteId(null); }}>
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <div className="flex items-center gap-4 mb-1">
                            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                <Trash2 className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                                <AlertDialogTitle>Hapus Komponen Penilaian?</AlertDialogTitle>
                                <AlertDialogDescription className="mt-1">
                                    Komponen dan semua nilai yang sudah diinput akan terhapus permanen.
                                </AlertDialogDescription>
                            </div>
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => { if (deleteId) { deleteAssessment(deleteId); setDeleteId(null); } }}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Ya, Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export const AssessmentInput: React.FC = () => {
    const [searchInput, setSearchInput] = useState('');
    const [page, setPage] = useState(1);
    const [selectedCS, setSelectedCS] = useState<AdminClassSubjectProgress | null>(null);

    const debouncedSearch = useDebounce(searchInput, 400);

    const { data, isLoading, isFetching, isError, refetch } = useAssessmentClassSubjects({
        search: debouncedSearch || undefined,
        page,
        per_page: 15,
    });

    const items = data?.data ?? [];
    const meta  = data?.meta;

    if (selectedCS) {
        return <AssessmentDetailView classSubject={selectedCS} onBack={() => setSelectedCS(null)} />;
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Input{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Nilai
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                            <ClipboardList className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Kelola komponen penilaian dan input nilai siswa per mata pelajaran.
                    </p>
                </div>
            </div>

            {isError && <ErrorState error="Gagal memuat daftar mata pelajaran." onRetry={refetch} />}

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                                <ClipboardList className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">Daftar Kelas &amp; Mapel</CardTitle>
                                <CardDescription>Pilih kelas &amp; mapel untuk mengelola komponen nilai</CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {isFetching && !isLoading && <RefreshCw className="h-4 w-4 text-slate-400 animate-spin" />}
                            {meta && (
                                <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">
                                    {meta.total} Mapel
                                </Badge>
                            )}
                        </div>
                    </div>
                    <div className="pt-2 border-t border-slate-100">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari kelas, mapel, atau guru..."
                                value={searchInput}
                                onChange={(e) => { setSearchInput(e.target.value); setPage(1); }}
                                className="pl-9 w-full"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="border-t border-slate-200 overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Kelas &amp; Mapel</th>
                                    <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Guru Pengampu</th>
                                    <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Progress</th>
                                    <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider text-center">Status</th>
                                    <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <PageSkeleton />
                                ) : items.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                                {debouncedSearch ? <FilterX className="h-8 w-8 text-slate-300 mb-2" /> : <FileX className="h-8 w-8 text-slate-300 mb-2" />}
                                                <p className="text-sm text-slate-500">
                                                    {debouncedSearch ? 'Tidak ada hasil' : 'Belum ada data mata pelajaran'}
                                                </p>
                                                <p className="text-xs text-slate-400 mt-1">
                                                    {debouncedSearch ? 'Coba sesuaikan pencarian' : 'Tambahkan kelas dan mata pelajaran terlebih dahulu'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    items.map((item) => {
                                        const pct = item.total_students > 0
                                            ? Math.round((item.graded_students / item.total_students) * 100)
                                            : 0;
                                        return (
                                            <tr
                                                key={item.id}
                                                className="group border-b border-slate-50 hover:bg-slate-50/60 transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-slate-900">{item.class_name}</span>
                                                        <span className="text-xs text-slate-500 mt-0.5">{item.subject_name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                            {(item.teacher_name ?? '?').substring(0, 2).toUpperCase()}
                                                        </div>
                                                        <span className="text-sm text-slate-700 truncate max-w-[140px]">{item.teacher_name ?? '—'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 min-w-[180px]">
                                                    <div className="flex justify-between text-xs mb-1.5">
                                                        <span className="text-slate-500">
                                                            {item.graded_students}/{item.total_students} Siswa
                                                        </span>
                                                        <span className="font-bold text-slate-700">{pct}%</span>
                                                    </div>
                                                    <Progress value={pct} className="h-2 bg-slate-100" />
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <Badge
                                                        variant="outline"
                                                        className={cn('text-[10px] font-semibold tracking-wider uppercase', STATUS_STYLE[item.status])}
                                                    >
                                                        {STATUS_LABEL[item.status]}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-slate-200"
                                                        onClick={() => setSelectedCS(item)}
                                                    >
                                                        Kelola <ArrowRight className="h-3 w-3 ml-1" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {meta && meta.last_page > 1 && (
                        <PaginationControls
                            currentPage={meta.current_page}
                            totalPages={meta.last_page}
                            totalItems={meta.total}
                            startIndex={(meta.current_page - 1) * meta.per_page + 1}
                            endIndex={Math.min(meta.current_page * meta.per_page, meta.total)}
                            itemsPerPage={meta.per_page}
                            itemLabel="mapel"
                            onPageChange={setPage}
                            onItemsPerPageChange={(pp) => { setPage(1); }}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
