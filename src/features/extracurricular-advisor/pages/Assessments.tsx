"use client";

import React, { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, Users, CheckCircle, AlertCircle, ListPlus, Trash2, Save, Loader2, Settings } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader, StatCard, ErrorState, EmptyState, PaginationControls } from "@/features/shared/components";
import {
    advisorAssessmentService,
    type AssessmentMember,
    type SaveAssessmentItem,
} from "../services/advisorAssessmentService";

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const AssessmentsSkeleton: React.FC = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
        <div className="space-y-2">
            <Skeleton className="h-9 w-72" />
            <Skeleton className="h-4 w-52" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
        <div className="rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <div className="space-y-1.5">
                    <Skeleton className="h-5 w-36" />
                    <Skeleton className="h-4 w-48" />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead><tr>{Array.from({ length: 5 }).map((_, i) => <th key={i} className="p-4"><Skeleton className="h-4 w-20" /></th>)}</tr></thead>
                    <tbody>{Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i}>{Array.from({ length: 5 }).map((_, j) => <td key={j} className="p-4"><Skeleton className="h-8 w-full" /></td>)}</tr>
                    ))}</tbody>
                </table>
            </div>
        </div>
    </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
export const ExtracurricularAssessments: React.FC = () => {
    const queryClient = useQueryClient();
    const [pendingScores, setPendingScores] = useState<Record<string, string>>({});
    const [aspectDialogOpen, setAspectDialogOpen] = useState(false);
    const [newAspect, setNewAspect] = useState("");
    const [localAspects, setLocalAspects] = useState<string[] | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["advisor-assessments"],
        queryFn: () => advisorAssessmentService.getAssessments(),
        staleTime: 2 * 60 * 1000, // 2 menit
    });

    const saveMutation = useMutation({
        mutationFn: (items: SaveAssessmentItem[]) =>
            advisorAssessmentService.saveAssessments({ assessments: items }),
        onSuccess: (res) => {
            toast.success(`${res.saved} penilaian berhasil disimpan.`);
            queryClient.invalidateQueries({ queryKey: ["advisor-assessments"] });
            setPendingScores({});
            setLocalAspects(null); // reset ke server state setelah save
        },
        onError: () => toast.error("Gagal menyimpan penilaian."),
    });

    const aspects = React.useMemo(
        () => localAspects ?? data?.aspects ?? [],
        [localAspects, data?.aspects]
    );
    const members: AssessmentMember[] = data?.members ?? [];

    // Stats
    const totalMembers = members.length;
    const gradedMembers = members.filter((m) =>
        aspects.length > 0 && aspects.every((a) => m.scores[a] !== undefined)
    ).length;
    const avgScore = (() => {
        const allScores = members.flatMap((m) => Object.values(m.scores).map((s) => s.score));
        return allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0;
    })();

    const getKey = (membershipId: number, aspect: string) => `${membershipId}__${aspect}`;

    // Pagination
    const totalItems = members.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    const paginatedMembers = members.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

    const handleScoreChange = useCallback((membershipId: number, aspect: string, value: string) => {
        setPendingScores((prev) => ({ ...prev, [getKey(membershipId, aspect)]: value }));
    }, []);

    const getDisplayScore = (member: AssessmentMember, aspect: string): string => {
        const key = getKey(member.membershipId, aspect);
        if (key in pendingScores) return pendingScores[key];
        return member.scores[aspect]?.score !== undefined ? String(member.scores[aspect].score) : "";
    };

    const handleSaveAll = useCallback(() => {
        const items: SaveAssessmentItem[] = [];
        for (const [key, val] of Object.entries(pendingScores)) {
            const separatorIdx = key.indexOf("__");
            if (separatorIdx === -1) continue;
            const membershipIdStr = key.slice(0, separatorIdx);
            const aspect = key.slice(separatorIdx + 2);
            const score = parseFloat(val);
            if (!aspect || isNaN(score) || score < 0 || score > 100) continue;
            items.push({ membership_id: Number(membershipIdStr), aspect, score });
        }
        if (items.length === 0) { toast.info("Tidak ada perubahan nilai."); return; }
        saveMutation.mutate(items);
    }, [pendingScores, saveMutation]);

    const handleAddAspect = useCallback(() => {
        const trimmed = newAspect.trim();
        if (!trimmed) return;
        if (aspects.includes(trimmed)) { toast.error("Aspek sudah ada."); return; }
        setLocalAspects([...aspects, trimmed]);
        setNewAspect("");
    }, [newAspect, aspects]);

    const handleRemoveAspect = useCallback((aspect: string) => {
        setLocalAspects(aspects.filter((a) => a !== aspect));
    }, [aspects]);

    if (isLoading) return <AssessmentsSkeleton />;
    if (isError) return <ErrorState error={(error as Error)?.message ?? "Gagal memuat data penilaian."} onRetry={refetch} />;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Penilaian"
                titleHighlight="Ekstrakurikuler"
                icon={Star}
                description="Kelola penilaian anggota ekskul per aspek pada Tahun Ajaran aktif"
            >
                <Button
                    variant="outline"
                    onClick={() => setAspectDialogOpen(true)}
                    className="border-blue-200 text-blue-800 hover:bg-blue-50"
                >
                    <Settings className="h-4 w-4 mr-2" />
                    Kelola Aspek
                </Button>
                <Button
                    onClick={handleSaveAll}
                    disabled={saveMutation.isPending || Object.keys(pendingScores).length === 0}
                    className="bg-blue-800 hover:bg-blue-900 text-white"
                >
                    {saveMutation.isPending
                        ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Menyimpan...</>
                        : <><Save className="h-4 w-4 mr-2" />Simpan Semua</>
                    }
                </Button>
            </PageHeader>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard title="Total Anggota" value={totalMembers} subtitle="Anggota aktif" icon={Users} color="blue" />
                <StatCard title="Sudah Dinilai" value={gradedMembers} subtitle="Semua aspek terisi" icon={CheckCircle} color="green" />
                <StatCard title="Belum Dinilai" value={totalMembers - gradedMembers} subtitle="Masih ada nilai kosong" icon={AlertCircle} color="red" />
                <StatCard title="Rata-rata Nilai" value={avgScore} subtitle="Semua aspek" icon={Star} color="purple" />
            </div>

            {aspects.length === 0 ? (
                <Card>
                    <CardContent className="p-0">
                        <EmptyState
                            icon={Star}
                            title="Belum ada aspek penilaian"
                            description='Klik "Kelola Aspek" untuk menambahkan aspek penilaian'
                        >
                            <Button
                                variant="outline"
                                className="mt-4 border-blue-200 text-blue-800"
                                onClick={() => setAspectDialogOpen(true)}
                            >
                                <ListPlus className="h-4 w-4 mr-2" />
                                Tambah Aspek
                            </Button>
                        </EmptyState>
                    </CardContent>
                </Card>
            ) : (
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="pb-4 border-b border-slate-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Star className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-semibold">Tabel Penilaian</CardTitle>
                                    <CardDescription>Klik kolom nilai untuk mengedit langsung</CardDescription>
                                </div>
                            </div>
                            {Object.keys(pendingScores).length > 0 && (
                                <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                                    {Object.keys(pendingScores).length} perubahan belum disimpan
                                </Badge>
                            )}
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
                                        {aspects.map((aspect) => (
                                            <th key={aspect} className="text-center p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 min-w-[120px]">
                                                {aspect}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {members.length === 0 ? (
                                        <tr>
                                            <td colSpan={3 + aspects.length}>
                                                <EmptyState
                                                    icon={Users}
                                                    title="Belum ada anggota aktif"
                                                    description="Tambahkan anggota ekskul terlebih dahulu"
                                                    className="py-12"
                                                />
                                            </td>
                                        </tr>
                                    ) : paginatedMembers.map((member) => (
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
                                            {aspects.map((aspect) => {
                                                const displayVal = getDisplayScore(member, aspect);
                                                const key = getKey(member.membershipId, aspect);
                                                const isDirty = key in pendingScores;
                                                return (
                                                    <td key={aspect} className="p-4 text-center">
                                                        <Input
                                                            type="number"
                                                            min={0}
                                                            max={100}
                                                            step={0.5}
                                                            value={displayVal}
                                                            onChange={(e) => handleScoreChange(member.membershipId, aspect, e.target.value)}
                                                            className={`h-8 w-20 text-center mx-auto text-sm ${isDirty ? "border-amber-400 bg-amber-50" : ""}`}
                                                            placeholder="—"
                                                        />
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                    <PaginationControls
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        startIndex={startIndex}
                        endIndex={endIndex}
                        itemsPerPage={itemsPerPage}
                        itemLabel="anggota"
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
                    />
                </Card>
            )}

            {/* Dialog Kelola Aspek */}
            <Dialog open={aspectDialogOpen} onOpenChange={setAspectDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader className="pb-2 text-left">
                        <div className="flex items-start gap-3">
                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-50 text-blue-700 border border-blue-100 flex-shrink-0">
                                <Settings className="h-5 w-5" />
                            </div>
                            <div className="flex-1 space-y-0.5">
                                <DialogTitle className="text-lg font-semibold text-foreground">
                                    Kelola Aspek Penilaian
                                </DialogTitle>
                                <DialogDescription className="text-sm text-muted-foreground">
                                    Tambah atau hapus aspek penilaian ekskul
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Nama aspek, contoh: Keaktifan"
                                value={newAspect}
                                onChange={(e) => setNewAspect(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") handleAddAspect(); }}
                            />
                            <Button onClick={handleAddAspect} className="bg-blue-800 hover:bg-blue-900 text-white shrink-0">
                                <ListPlus className="h-4 w-4 mr-1.5" />
                                Tambah
                            </Button>
                        </div>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {aspects.length === 0 ? (
                                <p className="text-sm text-slate-400 text-center py-4">Belum ada aspek</p>
                            ) : aspects.map((aspect) => (
                                <div key={aspect} className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
                                    <span className="text-sm font-medium text-slate-700">{aspect}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50"
                                        onClick={() => handleRemoveAspect(aspect)}
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setAspectDialogOpen(false)} className="bg-blue-800 hover:bg-blue-900 text-white">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Selesai
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
