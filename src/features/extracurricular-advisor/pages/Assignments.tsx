"use client";

import React, { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    ClipboardList, FolderPlus, Trash2, Edit, Save, Loader2,
    Users, CheckCircle, Star, Clock, Calendar, X,
} from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader, StatCard, ErrorState, EmptyState, PaginationControls } from "@/features/shared/components";
import {
    advisorAssignmentService,
    type Assignment,
    type SubmissionMember,
    type SaveSubmissionItem,
    type RecapMember,
} from "../services/advisorAssignmentService";

// ─── Form Schema ──────────────────────────────────────────────────────────────
const assignmentSchema = z.object({
    title: z.string().min(1, "Judul wajib diisi").max(200),
    description: z.string().optional(),
    due_date: z.string().optional(),
});
type AssignmentFormValues = z.infer<typeof assignmentSchema>;

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const AssignmentsSkeleton: React.FC = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
            <div className="space-y-2">
                <Skeleton className="h-9 w-72" />
                <Skeleton className="h-4 w-52" />
            </div>
            <Skeleton className="h-9 w-32 rounded-lg" />
        </div>
        {/* Tabs skeleton */}
        <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-8 w-24 rounded-full" />)}
        </div>
        {/* Assignment info card skeleton */}
        <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200">
            <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-56" />
            </div>
            <div className="flex gap-2">
                <Skeleton className="h-8 w-16 rounded-lg" />
                <Skeleton className="h-8 w-16 rounded-lg" />
            </div>
        </div>
        {/* Stats skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
        {/* Table skeleton */}
        <div className="rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-lg" />
                    <div className="space-y-1.5">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-44" />
                    </div>
                </div>
                <Skeleton className="h-8 w-28 rounded-lg" />
            </div>
            <table className="w-full">
                <thead><tr>{Array.from({ length: 5 }).map((_, i) => <th key={i} className="p-4"><Skeleton className="h-4 w-20" /></th>)}</tr></thead>
                <tbody>{Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>{Array.from({ length: 5 }).map((_, j) => <td key={j} className="p-4"><Skeleton className="h-8 w-full" /></td>)}</tr>
                ))}</tbody>
            </table>
        </div>
    </div>
);

// ─── Status Badge ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
    belum:       { label: "Belum",       className: "bg-slate-100 text-slate-600 border-slate-200" },
    dikumpulkan: { label: "Dikumpulkan", className: "bg-blue-100 text-blue-700 border-blue-200" },
    dinilai:     { label: "Dinilai",     className: "bg-green-100 text-green-700 border-green-200" },
} as const;

// ─── Main ─────────────────────────────────────────────────────────────────────
export const ExtracurricularAssignments: React.FC = () => {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<string>("");
    const [formOpen, setFormOpen] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [pendingSubmissions, setPendingSubmissions] = useState<Record<string, { score: string; status: SubmissionMember["status"] }>>({});
    const [subPage, setSubPage] = useState(1);
    const [subPerPage, setSubPerPage] = useState(10);

    const form = useForm<AssignmentFormValues>({
        resolver: zodResolver(assignmentSchema),
        defaultValues: { title: "", description: "", due_date: "" },
    });

    // ── Queries ──
    const { data: assignments = [], isLoading, isError, error, refetch } = useQuery({
        queryKey: ["advisor-assignments"],
        queryFn: () => advisorAssignmentService.getAssignments(),
        select: (data) => data.sort((a, b) => a.order - b.order),
        staleTime: 2 * 60 * 1000,
    });

    // Resolve active assignment id: prefer explicit tab selection, fallback to first
    const activeAssignmentId = React.useMemo(() => {
        if (activeTab) return Number(activeTab);
        return assignments[0]?.id ?? null;
    }, [activeTab, assignments]);

    const { data: submissionData, isLoading: isSubmissionsLoading } = useQuery({
        queryKey: ["advisor-submissions", activeAssignmentId],
        queryFn: () => advisorAssignmentService.getSubmissions(activeAssignmentId!),
        enabled: !!activeAssignmentId,
        staleTime: 1 * 60 * 1000,
    });

    const { data: recapData, isLoading: isRecapLoading } = useQuery({
        queryKey: ["advisor-assignments-recap"],
        queryFn: () => advisorAssignmentService.getRecap(),
        enabled: assignments.length > 0,
        staleTime: 2 * 60 * 1000,
    });

    // ── Mutations ──
    const createMutation = useMutation({
        mutationFn: advisorAssignmentService.createAssignment,
        onSuccess: (newAssignment) => {
            toast.success("Tugas berhasil dibuat.");
            queryClient.invalidateQueries({ queryKey: ["advisor-assignments"] });
            setActiveTab(String(newAssignment.id));
            setFormOpen(false);
            form.reset();
        },
        onError: () => toast.error("Gagal membuat tugas."),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: AssignmentFormValues }) =>
            advisorAssignmentService.updateAssignment(id, data),
        onSuccess: () => {
            toast.success("Tugas berhasil diperbarui.");
            queryClient.invalidateQueries({ queryKey: ["advisor-assignments"] });
            setFormOpen(false);
            setEditingAssignment(null);
            form.reset();
        },
        onError: () => toast.error("Gagal memperbarui tugas."),
    });

    const deleteMutation = useMutation({
        mutationFn: advisorAssignmentService.deleteAssignment,
        onSuccess: () => {
            toast.success("Tugas berhasil dihapus.");
            queryClient.invalidateQueries({ queryKey: ["advisor-assignments"] });
            setDeleteId(null);
            setActiveTab("");
        },
        onError: () => toast.error("Gagal menghapus tugas."),
    });

    const saveSubmissionsMutation = useMutation({
        mutationFn: ({ id, items }: { id: number; items: SaveSubmissionItem[] }) =>
            advisorAssignmentService.saveSubmissions(id, items),
        onSuccess: (res) => {
            toast.success(`${res.saved} nilai berhasil disimpan.`);
            queryClient.invalidateQueries({ queryKey: ["advisor-submissions", activeAssignmentId] });
            setPendingSubmissions({});
        },
        onError: () => toast.error("Gagal menyimpan nilai."),
    });

    // ── Handlers ──
    const openCreate = useCallback(() => {
        setEditingAssignment(null);
        form.reset({ title: `Tugas ${assignments.length + 1}`, description: "", due_date: "" });
        setFormOpen(true);
    }, [assignments.length, form]);

    const openEdit = useCallback((assignment: Assignment) => {
        setEditingAssignment(assignment);
        form.reset({
            title: assignment.title,
            description: assignment.description ?? "",
            due_date: assignment.dueDate ?? "",
        });
        setFormOpen(true);
    }, [form]);

    const onSubmit = useCallback((values: AssignmentFormValues) => {
        const clean = (v?: string) => v === "" ? undefined : v;
        const data = { ...values, description: clean(values.description), due_date: clean(values.due_date) };
        if (editingAssignment) {
            updateMutation.mutate({ id: editingAssignment.id, data });
        } else {
            createMutation.mutate(data);
        }
    }, [editingAssignment, createMutation, updateMutation]);

    const getSubKey = (membershipId: number) => String(membershipId);

    const handleScoreChange = useCallback((membershipId: number, score: string) => {
        setPendingSubmissions((prev) => ({
            ...prev,
            [getSubKey(membershipId)]: { ...prev[getSubKey(membershipId)], score },
        }));
    }, []);

    const handleStatusChange = useCallback((membershipId: number, status: SubmissionMember["status"]) => {
        setPendingSubmissions((prev) => ({
            ...prev,
            [getSubKey(membershipId)]: { ...prev[getSubKey(membershipId)], status },
        }));
    }, []);

    const getDisplayScore = (member: SubmissionMember): string => {
        const key = getSubKey(member.membershipId);
        if (key in pendingSubmissions && pendingSubmissions[key].score !== undefined) return pendingSubmissions[key].score;
        return member.score !== null ? String(member.score) : "";
    };

    const getDisplayStatus = (member: SubmissionMember): SubmissionMember["status"] => {
        const key = getSubKey(member.membershipId);
        if (key in pendingSubmissions && pendingSubmissions[key].status) return pendingSubmissions[key].status;
        return member.status;
    };

    const handleSaveSubmissions = useCallback(() => {
        if (!activeAssignmentId) return;
        if (Object.keys(pendingSubmissions).length === 0) {
            toast.info("Tidak ada perubahan nilai.");
            return;
        }
        const submissions = submissionData?.submissions ?? [];
        const items: SaveSubmissionItem[] = submissions.map((m) => {
            const key = getSubKey(m.membershipId);
            const pending = pendingSubmissions[key];
            const score = pending?.score !== undefined ? parseFloat(pending.score) : m.score;
            const status = pending?.status ?? m.status;
            return {
                membership_id: m.membershipId,
                score: isNaN(score as number) ? null : score,
                status,
            };
        });
        saveSubmissionsMutation.mutate({ id: activeAssignmentId, items });
    }, [activeAssignmentId, submissionData, pendingSubmissions, saveSubmissionsMutation]);

    if (isLoading) return <AssignmentsSkeleton />;
    if (isError) return <ErrorState error={(error as Error)?.message ?? "Gagal memuat data tugas."} onRetry={refetch} />;

    const submissions = submissionData?.submissions ?? [];
    const currentAssignment = assignments.find((a) => a.id === activeAssignmentId);
    const stats = currentAssignment?.submissionStats;

    // Pagination submissions
    const subTotal = submissions.length;
    const subTotalPages = Math.max(1, Math.ceil(subTotal / subPerPage));
    const paginatedSubmissions = submissions.slice((subPage - 1) * subPerPage, subPage * subPerPage);
    const subStart = subTotal === 0 ? 0 : (subPage - 1) * subPerPage + 1;
    const subEnd = Math.min(subPage * subPerPage, subTotal);

    return (
        <div className="space-y-6">
            <PageHeader
                title="Tugas"
                titleHighlight="Ekstrakurikuler"
                icon={ClipboardList}
                description="Kelola tugas dan nilai anggota ekskul"
            >
                <Button onClick={openCreate} className="bg-blue-800 hover:bg-blue-900 text-white">
                    <FolderPlus className="h-4 w-4 mr-2" />
                    Tambah Tugas
                </Button>
            </PageHeader>

            {assignments.length === 0 ? (
                <Card>
                    <CardContent className="p-0">
                        <EmptyState
                            icon={ClipboardList}
                            title="Belum ada tugas"
                            description='Klik "Tambah Tugas" untuk membuat tugas pertama'
                        >
                            <Button
                                onClick={openCreate}
                                className="mt-4 bg-blue-800 hover:bg-blue-900 text-white"
                            >
                                <FolderPlus className="h-4 w-4 mr-2" />
                                Tambah Tugas
                            </Button>
                        </EmptyState>
                    </CardContent>
                </Card>
            ) : (
                <Tabs
                    value={activeTab || String(assignments[0]?.id)}
                    onValueChange={(v) => { setActiveTab(v); setPendingSubmissions({}); setSubPage(1); }}
                >
                    <div className="flex items-center gap-3 flex-wrap">
                        <TabsList className="inline-flex h-auto items-center rounded-full bg-muted/50 p-1.5 gap-1 flex-wrap">
                            {assignments.map((a) => (
                                <TabsTrigger
                                    key={a.id}
                                    value={String(a.id)}
                                    className="inline-flex items-center whitespace-nowrap rounded-full px-4 h-8 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=inactive]:text-muted-foreground"
                                >
                                    <ClipboardList className="h-3.5 w-3.5 mr-1.5" />
                                    {a.title}
                                </TabsTrigger>
                            ))}
                            <TabsTrigger
                                value="recap"
                                className="inline-flex items-center whitespace-nowrap rounded-full px-4 h-8 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=inactive]:text-muted-foreground"
                            >
                                <Star className="h-3.5 w-3.5 mr-1.5" />
                                Rekap Nilai
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {assignments.map((assignment) => (
                        <TabsContent key={assignment.id} value={String(assignment.id)} className="space-y-4 mt-4">
                            {/* Assignment info */}
                            <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <ClipboardList className="h-5 w-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-base font-semibold text-slate-900">{assignment.title}</p>
                                    {assignment.description && (
                                        <p className="text-sm text-slate-500 mt-0.5">{assignment.description}</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    {assignment.dueDate && (
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
                                            <Calendar className="h-3.5 w-3.5 text-slate-500" />
                                            <span className="text-xs font-medium text-slate-600">
                                                {new Date(assignment.dueDate + "T00:00:00").toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                                            </span>
                                        </div>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => openEdit(assignment)}
                                        className="h-8 bg-blue-50 text-blue-700 hover:bg-blue-100"
                                    >
                                        <Edit className="h-3.5 w-3.5 mr-1.5" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setDeleteId(assignment.id)}
                                        className="h-8 bg-red-50 text-red-500 hover:bg-red-100"
                                    >
                                        <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                                        Hapus
                                    </Button>
                                </div>
                            </div>

                            {/* Stats */}
                            {stats && (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <StatCard title="Total Anggota" value={stats.total} subtitle="Anggota aktif" icon={Users} color="blue" />
                                    <StatCard title="Dikumpulkan" value={stats.submitted} subtitle="Sudah mengumpulkan" icon={CheckCircle} color="green" />
                                    <StatCard title="Dinilai" value={stats.graded} subtitle="Sudah diberi nilai" icon={Star} color="purple" />
                                    <StatCard title="Belum" value={stats.total - stats.submitted} subtitle="Belum mengumpulkan" icon={Clock} color="red" />
                                </div>
                            )}

                            {/* Submissions table */}
                            <Card className="border-slate-200 shadow-sm">
                                <CardHeader className="pb-4 border-b border-slate-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <Users className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg font-semibold">Nilai Anggota</CardTitle>
                                                <CardDescription>Input nilai dan status pengumpulan per siswa</CardDescription>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {Object.keys(pendingSubmissions).length > 0 && (
                                                <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                                                    {Object.keys(pendingSubmissions).length} perubahan
                                                </Badge>
                                            )}
                                            <Button
                                                size="sm"
                                                onClick={handleSaveSubmissions}
                                                disabled={saveSubmissionsMutation.isPending}
                                                className="bg-blue-800 hover:bg-blue-900 text-white h-8"
                                            >
                                                {saveSubmissionsMutation.isPending
                                                    ? <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />Menyimpan...</>
                                                    : <><Save className="h-3.5 w-3.5 mr-1.5" />Simpan Nilai</>
                                                }
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-slate-50 border-b border-slate-200">
                                                <tr>
                                                    <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Nama Siswa</th>
                                                    <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">NIS</th>
                                                    <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Kelas</th>
                                                    <th className="text-center p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                                                    <th className="text-center p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Nilai</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {isSubmissionsLoading ? (
                                                    Array.from({ length: 5 }).map((_, i) => (
                                                        <tr key={i} className="border-b border-slate-100">
                                                            {Array.from({ length: 5 }).map((_, j) => (
                                                                <td key={j} className="p-4"><Skeleton className="h-8 w-full" /></td>
                                                            ))}
                                                        </tr>
                                                    ))
                                                ) : submissions.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={5}>
                                                            <EmptyState
                                                                icon={Users}
                                                                title="Belum ada anggota aktif"
                                                                description="Tambahkan anggota ekskul terlebih dahulu"
                                                                className="py-12"
                                                            />
                                                        </td>
                                                    </tr>
                                                ) : paginatedSubmissions.map((member) => {
                                                    const displayStatus = getDisplayStatus(member);
                                                    const statusConfig = STATUS_CONFIG[displayStatus];
                                                    return (
                                                        <tr key={member.membershipId} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                                            <td className="p-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                                                        <span className="text-xs font-semibold text-blue-800">
                                                                            {member.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()}
                                                                        </span>
                                                                    </div>
                                                                    <span className="text-sm font-medium text-slate-800">{member.name}</span>
                                                                </div>
                                                            </td>
                                                            <td className="p-4 text-sm font-mono text-slate-500">{member.nis}</td>
                                                            <td className="p-4">
                                                                <Badge variant="secondary" className="bg-blue-50 text-blue-800 border-blue-200">{member.class}</Badge>
                                                            </td>
                                                            <td className="p-4 text-center">
                                                                <Select
                                                                    value={displayStatus}
                                                                    onValueChange={(v) => handleStatusChange(member.membershipId, v as SubmissionMember["status"])}
                                                                >
                                                                    <SelectTrigger className={`h-8 w-36 mx-auto text-sm border ${statusConfig.className}`}>
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="belum" className="text-sm">Belum</SelectItem>
                                                                        <SelectItem value="dikumpulkan" className="text-sm">Dikumpulkan</SelectItem>
                                                                        <SelectItem value="dinilai" className="text-sm">Dinilai</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </td>
                                                            <td className="p-4 text-center">
                                                                <Input
                                                                    type="number"
                                                                    min={0}
                                                                    max={100}
                                                                    step={0.5}
                                                                    value={getDisplayScore(member)}
                                                                    onChange={(e) => handleScoreChange(member.membershipId, e.target.value)}
                                                                    className={`h-8 w-20 text-center mx-auto text-sm ${getSubKey(member.membershipId) in pendingSubmissions ? "border-amber-400 bg-amber-50" : ""}`}
                                                                    placeholder="—"
                                                                />
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                                <PaginationControls
                                    currentPage={subPage}
                                    totalPages={subTotalPages}
                                    totalItems={subTotal}
                                    startIndex={subStart}
                                    endIndex={subEnd}
                                    itemsPerPage={subPerPage}
                                    itemLabel="anggota"
                                    onPageChange={setSubPage}
                                    onItemsPerPageChange={(val) => { setSubPerPage(val); setSubPage(1); }}
                                />
                            </Card>
                        </TabsContent>
                    ))}

                    {/* Tab Rekap Nilai */}
                    <TabsContent value="recap" className="space-y-4 mt-4">
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="pb-4 border-b border-slate-200">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Star className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-semibold">Rekap Nilai Tugas</CardTitle>
                                        <CardDescription>Ringkasan nilai semua tugas per anggota</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-slate-50 border-b border-slate-200">
                                            <tr>
                                                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 sticky left-0 bg-slate-50">Nama Siswa</th>
                                                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">NIS</th>
                                                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Kelas</th>
                                                {(recapData?.assignments ?? []).map((a) => (
                                                    <th key={a.id} className="text-center p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 min-w-[100px]">
                                                        {a.title}
                                                    </th>
                                                ))}
                                                <th className="text-center p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 min-w-[90px] bg-amber-50">
                                                    Rata-rata
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {isRecapLoading ? (
                                                Array.from({ length: 5 }).map((_, i) => (
                                                    <tr key={i} className="border-b border-slate-100">
                                                        {Array.from({ length: 7 }).map((_, j) => (
                                                            <td key={j} className="p-4"><Skeleton className="h-6 w-full" /></td>
                                                        ))}
                                                    </tr>
                                                ))
                                            ) : !recapData || recapData.members.length === 0 ? (
                                                <tr>
                                                    <td colSpan={(recapData?.assignments.length ?? 0) + 4}>
                                                        <EmptyState
                                                            icon={Users}
                                                            title="Belum ada data rekap"
                                                            description="Buat tugas dan isi nilai anggota terlebih dahulu"
                                                            className="py-12"
                                                        />
                                                    </td>
                                                </tr>
                                            ) : recapData.members.map((member: RecapMember) => (
                                                <tr key={member.membershipId} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                                    <td className="p-4 sticky left-0 bg-white">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                                                <span className="text-xs font-semibold text-blue-800">
                                                                    {member.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()}
                                                                </span>
                                                            </div>
                                                            <span className="text-sm font-medium text-slate-800">{member.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-sm font-mono text-slate-500">{member.nis}</td>
                                                    <td className="p-4">
                                                        <Badge variant="secondary" className="bg-blue-50 text-blue-800 border-blue-200">{member.class}</Badge>
                                                    </td>
                                                    {(recapData.assignments).map((a) => {
                                                        const s = member.scores[a.id];
                                                        return (
                                                            <td key={a.id} className="p-4 text-center">
                                                                {s?.score !== null && s?.score !== undefined ? (
                                                                    <span className={`text-sm font-semibold ${s.score >= 75 ? "text-green-700" : "text-red-600"}`}>
                                                                        {s.score}
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-xs text-slate-400">—</span>
                                                                )}
                                                            </td>
                                                        );
                                                    })}
                                                    <td className="p-4 text-center bg-amber-50/50">
                                                        {member.average !== null ? (
                                                            <Badge className={`font-semibold ${member.average >= 75 ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"}`}>
                                                                {member.average}
                                                            </Badge>
                                                        ) : (
                                                            <span className="text-xs text-slate-400">—</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            )}

            {/* Form Dialog */}
            <Dialog open={formOpen} onOpenChange={(open) => { if (!open) { setFormOpen(false); setEditingAssignment(null); form.reset(); } }}>
                <DialogContent className="max-w-md">
                    <DialogHeader className="pb-2 text-left">
                        <div className="flex items-start gap-3">
                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-50 text-blue-700 border border-blue-100 flex-shrink-0">
                                <ClipboardList className="h-5 w-5" />
                            </div>
                            <div className="flex-1 space-y-0.5">
                                <DialogTitle className="text-lg font-semibold text-foreground">
                                    {editingAssignment ? "Edit Tugas" : "Tambah Tugas Baru"}
                                </DialogTitle>
                                <DialogDescription className="text-sm text-muted-foreground">
                                    {editingAssignment ? "Perbarui informasi tugas." : "Buat tugas baru untuk anggota ekskul."}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField control={form.control} name="title" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Judul Tugas <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Contoh: Tugas 1, Laporan Kegiatan, dll." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="description" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Deskripsi</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Deskripsi tugas (opsional)" className="resize-none h-20" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="due_date" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tanggal Tenggat</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                                    <X className="h-4 w-4 mr-2" />
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-blue-800 hover:bg-blue-900 text-white"
                                    disabled={createMutation.isPending || updateMutation.isPending}
                                >
                                    {(createMutation.isPending || updateMutation.isPending)
                                        ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Menyimpan...</>
                                        : editingAssignment
                                            ? <><Save className="h-4 w-4 mr-2" />Simpan Perubahan</>
                                            : <><ClipboardList className="h-4 w-4 mr-2" />Buat Tugas</>
                                    }
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={deleteId !== null} onOpenChange={(open) => { if (!open) setDeleteId(null); }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <div className="flex items-start gap-3">
                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-red-50 text-red-600 border border-red-100 flex-shrink-0">
                                <Trash2 className="h-5 w-5" />
                            </div>
                            <div className="flex-1 space-y-0.5">
                                <AlertDialogTitle className="text-lg font-semibold">Hapus Tugas?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Semua data nilai dan pengumpulan tugas ini akan ikut terhapus permanen.
                                </AlertDialogDescription>
                            </div>
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteMutation.isPending}>
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteId && deleteMutation.mutate(deleteId)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending
                                ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Menghapus...</>
                                : <><Trash2 className="h-4 w-4 mr-2" />Ya, Hapus</>
                            }
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
