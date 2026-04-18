 
import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trash2, Edit, Eye, Download, Target, ArrowLeft, BookOpen } from "lucide-react";
import { Material, LearningObjective, ApprovalStatus, ACTIVE_ACADEMIC_YEAR, ACTIVE_SEMESTER, MOCK_SEMESTERS } from "./types";

interface LearningObjectiveHistoryViewProps {
    onBack: () => void;
    learningObjectives: LearningObjective[];
    materials: Material[]; // Needed to look up material name
    onDelete: (id: string) => void;
}

const getStatusBadge = (status: ApprovalStatus) => {
    switch (status) {
        case "DRAFT":
            return <Badge variant="secondary" className="bg-gray-200 text-gray-700 hover:bg-gray-300">Draft</Badge>;
        case "PENDING":
            return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Menunggu Persetujuan</Badge>;
        case "APPROVED":
            return <Badge variant="default" className="bg-green-600 hover:bg-green-700">Disetujui</Badge>;
        case "REJECTED":
            return <Badge variant="destructive">Ditolak</Badge>;
        default:
            return <Badge variant="outline">Unknown</Badge>;
    }
};

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

// ... previous imports

export const LearningObjectiveHistoryView: React.FC<LearningObjectiveHistoryViewProps> = ({
    onBack,
    learningObjectives,
    materials,
    onDelete,
}) => {
    const [selectedYear, setSelectedYear] = useState(ACTIVE_ACADEMIC_YEAR);
    const [selectedSemester, setSelectedSemester] = useState("All");
    const [selectedMaterialId, setSelectedMaterialId] = useState("All");
    const [selectedTP, setSelectedTP] = useState<LearningObjective | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    // Helper to get material name
    const getMaterialName = (id: string) => {
        return materials.find(m => m.id === id)?.name || "Materi dihapus";
    };

    const filteredTPs = learningObjectives.filter(tp => {
        const matchYear = tp.academicYear === selectedYear;
        const matchSemester = selectedSemester === "All" || tp.semester === selectedSemester;
        const matchMaterial = selectedMaterialId === "All" || tp.materialId === selectedMaterialId;
        return matchYear && matchSemester && matchMaterial;
    });

    const handleExport = () => {
        // Mock Export logic
        console.log("Exporting TPs to PDF/DOCX...");
        alert("Dokumen TP berhasil diexport!");
    };

    const handleViewDetail = (tp: LearningObjective) => {
        setSelectedTP(tp);
        setIsDetailOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* ... header ... */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start gap-4">
                    <Button variant="outline" size="icon" onClick={onBack} className="mt-1">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">
                            Riwayat <span className="text-primary">Tujuan Pembelajaran</span>
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola dan pantau status TP yang telah diinput
                        </p>
                        <div className="flex items-center gap-3 mt-4">
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                                <Target className="h-4 w-4" />
                                <span className="text-sm font-semibold">Tahun Ajaran {ACTIVE_ACADEMIC_YEAR}</span>
                            </div>
                            <div className="h-4 w-[1px] bg-border" />
                            <span className="text-muted-foreground text-sm font-medium text-primary">
                                Semester {ACTIVE_SEMESTER}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <Card>
                <CardHeader className="border-b pb-4">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 rounded-lg">
                                <Target className="h-5 w-5 text-slate-600" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Daftar Tujuan Pembelajaran</CardTitle>
                                <CardDescription>
                                    Total {filteredTPs.length} TP ditemukan
                                </CardDescription>
                            </div>
                        </div>
                        <Button variant="outline" onClick={handleExport} className="w-full md:w-auto">
                            <Download className="mr-2 h-4 w-4" />
                            Export Dokumen
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="grid gap-1.5 flex-1 md:max-w-xs">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tahun Ajaran</span>
                            <Select value={selectedYear} onValueChange={setSelectedYear}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Tahun Ajaran" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="2025/2026">2025/2026</SelectItem>
                                    <SelectItem value="2024/2025">2024/2025</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-1.5 flex-1 md:max-w-xs">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Semester</span>
                            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Semester" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">Semua</SelectItem>
                                    {MOCK_SEMESTERS.map(s => (
                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-1.5 flex-1 md:max-w-xs">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Materi</span>
                            <Select value={selectedMaterialId} onValueChange={setSelectedMaterialId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Materi" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">Semua Materi</SelectItem>
                                    {materials.map(m => (
                                        <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="border rounded-md overflow-hidden">
                        {filteredTPs.length === 0 ? (
                            <div className="text-center py-16 text-muted-foreground bg-muted/5">
                                Tidak ada TP data filter yang dipilih.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-slate-50 border-b border-slate-200">
                                        <TableRow>
                                            <TableHead className="w-[80px] p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Kode</TableHead>
                                            <TableHead className="p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Isi TP</TableHead>
                                            <TableHead className="w-[180px] p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Materi</TableHead>
                                            <TableHead className="w-[120px] p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Semester</TableHead>
                                            <TableHead className="w-[150px] p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</TableHead>
                                            <TableHead className="text-right w-[140px] p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredTPs.map((tp) => (
                                            <TableRow key={tp.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                                <TableCell className="p-4 text-sm font-medium">{tp.code || "-"}</TableCell>
                                                <TableCell className="p-4 text-sm max-w-[300px]">
                                                    <div className="font-semibold truncate text-foreground" title={tp.title}>{tp.title}</div>
                                                    <div className="text-xs text-muted-foreground truncate mt-0.5" title={tp.description}>{tp.description}</div>
                                                </TableCell>
                                                <TableCell className="p-4 text-sm max-w-[150px] truncate" title={getMaterialName(tp.materialId)}>
                                                    {getMaterialName(tp.materialId)}
                                                </TableCell>
                                                <TableCell className="p-4 text-sm">{tp.semester}</TableCell>
                                                <TableCell className="p-4 text-sm">{getStatusBadge(tp.status)}</TableCell>
                                                <TableCell className="text-right p-4 text-sm">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            className="h-8 w-8 p-0 bg-green-500 hover:bg-green-600 text-white border-0 shadow-sm"
                                                            title="Lihat Detail"
                                                            onClick={() => handleViewDetail(tp)}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        {(tp.status === "DRAFT" || tp.status === "REJECTED") && (
                                                            <Button
                                                                size="sm"
                                                                className="h-8 w-8 p-0 bg-blue-500 hover:bg-blue-600 text-white border-0 shadow-sm"
                                                                title="Edit"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                        {(tp.status === "DRAFT") && (
                                                            <Button
                                                                size="sm"
                                                                className="h-8 w-8 p-0 bg-red-500 hover:bg-red-600 text-white border-0 shadow-sm"
                                                                title="Hapus"
                                                                onClick={() => onDelete(tp.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Detail Tujuan Pembelajaran</DialogTitle>
                        <DialogDescription>
                            Informasi lengkap mengenai tujuan pembelajaran yang dipilih.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedTP && (
                        <div className="grid gap-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Kode TP</h4>
                                    <p className="text-base font-semibold">{selectedTP.code || "-"}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
                                    <div>{getStatusBadge(selectedTP.status)}</div>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Judul TP</h4>
                                <p className="text-base font-medium">{selectedTP.title}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Materi Induk</h4>
                                <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-md text-primary text-sm font-medium">
                                    <BookOpen className="h-4 w-4" />
                                    {getMaterialName(selectedTP.materialId)}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Isi Tujuan Pembelajaran</h4>
                                <div className="p-3 bg-muted/30 rounded-md text-sm leading-relaxed border">
                                    {selectedTP.description}
                                </div>
                            </div>
                            {selectedTP.indicators && (
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Indikator Pembelajaran</h4>
                                    <div className="p-3 bg-muted/30 rounded-md text-sm leading-relaxed border whitespace-pre-wrap">
                                        {selectedTP.indicators}
                                    </div>
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                                <div>
                                    <h4 className="text-xs font-medium text-muted-foreground mb-1">Tahun Ajaran</h4>
                                    <p className="text-sm">{selectedTP.academicYear}</p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-medium text-muted-foreground mb-1">Semester</h4>
                                    <p className="text-sm">{selectedTP.semester}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};
