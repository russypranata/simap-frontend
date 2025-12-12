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
import { Trash2, Edit, Eye, Download, BookOpen, ArrowLeft } from "lucide-react";
import { Material, MOCK_SEMESTERS, ACTIVE_ACADEMIC_YEAR, ACTIVE_SEMESTER, ApprovalStatus } from "./types";

interface MaterialHistoryViewProps {
    onBack: () => void;
    materials: Material[];
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

export const MaterialHistoryView: React.FC<MaterialHistoryViewProps> = ({
    onBack,
    materials,
    onDelete,
}) => {
    const [selectedYear, setSelectedYear] = useState(ACTIVE_ACADEMIC_YEAR);
    const [selectedSemester, setSelectedSemester] = useState("All");
    const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const filteredMaterials = materials.filter(m => {
        const matchYear = m.academicYear === selectedYear;
        const matchSemester = selectedSemester === "All" || m.semester === selectedSemester;
        return matchYear && matchSemester;
    });

    const handleExport = () => {
        // Mock Export logic
        console.log("Exporting materials to PDF/DOCX...");
        alert("Dokumen berhasil diexport!");
    };

    const handleViewDetail = (material: Material) => {
        setSelectedMaterial(material);
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
                            Riwayat <span className="text-primary">Materi</span>
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola dan pantau status materi yang telah diinput
                        </p>
                        <div className="flex items-center gap-3 mt-4">
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                                <BookOpen className="h-4 w-4" />
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
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <BookOpen className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Daftar Materi</CardTitle>
                                <CardDescription>
                                    Total {filteredMaterials.length} materi ditemukan
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
                    </div>

                    <div className="border rounded-md overflow-hidden">
                        {filteredMaterials.length === 0 ? (
                            <div className="text-center py-16 text-muted-foreground bg-muted/5">
                                Tidak ada data materi yang sesuai dengan filter.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-muted/50">
                                        <TableRow>
                                            <TableHead className="w-[80px] p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Kode</TableHead>
                                            <TableHead className="p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nama Materi</TableHead>
                                            <TableHead className="w-[120px] p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Semester</TableHead>
                                            <TableHead className="w-[150px] p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</TableHead>
                                            <TableHead className="text-right w-[140px] p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredMaterials.map((m) => (
                                            <TableRow key={m.id} className="border-b hover:bg-muted/30 transition-colors">
                                                <TableCell className="p-4 text-sm font-medium">{m.code || "-"}</TableCell>
                                                <TableCell className="p-4 text-sm">
                                                    <div className="font-semibold text-foreground">{m.name}</div>
                                                    <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5" title={m.description}>
                                                        {m.description}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="p-4 text-sm">{m.semester}</TableCell>
                                                <TableCell className="p-4 text-sm">{getStatusBadge(m.status)}</TableCell>
                                                <TableCell className="text-right p-4 text-sm">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            className="h-8 w-8 p-0 bg-green-500 hover:bg-green-600 text-white border-0 shadow-sm"
                                                            title="Lihat Detail"
                                                            onClick={() => handleViewDetail(m)}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        {(m.status === "DRAFT" || m.status === "REJECTED") && (
                                                            <Button
                                                                size="sm"
                                                                className="h-8 w-8 p-0 bg-blue-500 hover:bg-blue-600 text-white border-0 shadow-sm"
                                                                title="Edit"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                        {(m.status === "DRAFT") && (
                                                            <Button
                                                                size="sm"
                                                                className="h-8 w-8 p-0 bg-red-500 hover:bg-red-600 text-white border-0 shadow-sm"
                                                                title="Hapus"
                                                                onClick={() => onDelete(m.id)}
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
                        <DialogTitle>Detail Materi Pembelajaran</DialogTitle>
                        <DialogDescription>
                            Informasi lengkap mengenai materi yang dipilih.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedMaterial && (
                        <div className="grid gap-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Kode Materi</h4>
                                    <p className="text-base font-semibold">{selectedMaterial.code || "-"}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
                                    <div>{getStatusBadge(selectedMaterial.status)}</div>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Nama Materi</h4>
                                <p className="text-base font-medium">{selectedMaterial.name}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Mata Pelajaran</h4>
                                    <p className="text-base">{selectedMaterial.subject}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Tahun Ajaran</h4>
                                        <p className="text-base">{selectedMaterial.academicYear}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Semester</h4>
                                        <p className="text-base">{selectedMaterial.semester}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Deskripsi</h4>
                                <div className="p-3 bg-muted/30 rounded-md text-sm leading-relaxed border">
                                    {selectedMaterial.description || "Tidak ada deskripsi."}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};
