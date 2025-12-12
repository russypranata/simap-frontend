import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
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
import { Trash2, Edit, Eye, Download, BookOpen } from "lucide-react";
import { Material, MOCK_SEMESTERS, ACTIVE_ACADEMIC_YEAR, ApprovalStatus } from "./types";

interface MaterialHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
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

export const MaterialHistoryModal: React.FC<MaterialHistoryModalProps> = ({
    isOpen,
    onClose,
    materials,
    onDelete,
}) => {
    const [selectedYear, setSelectedYear] = useState(ACTIVE_ACADEMIC_YEAR);
    const [selectedSemester, setSelectedSemester] = useState("All");

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

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[95vw] max-w-full max-h-[90vh] overflow-y-auto">
                <DialogHeader className="border-b pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary/10 rounded-lg">
                            <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl">Riwayat Materi Pembelajaran</DialogTitle>
                            <DialogDescription>
                                Kelola data materi yang telah diinputkan untuk tahun ajaran {ACTIVE_ACADEMIC_YEAR}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-end my-4">
                    <div className="flex flex-wrap gap-4">
                        <div className="grid gap-2">
                            <span className="text-sm font-medium">Tahun Ajaran</span>
                            <Select value={selectedYear} onValueChange={setSelectedYear}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Tahun Ajaran" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="2025/2026">2025/2026</SelectItem>
                                    <SelectItem value="2024/2025">2024/2025</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <span className="text-sm font-medium">Semester</span>
                            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                                <SelectTrigger className="w-[150px]">
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
                    <Button variant="outline" onClick={handleExport} className="w-full md:w-auto">
                        <Download className="mr-2 h-4 w-4" />
                        Export Dokumen
                    </Button>
                </div>

                <div className="mt-2 border rounded-md overflow-hidden">
                    {filteredMaterials.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground bg-muted/5">
                            Tidak ada data untuk filter yang dipilih.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead className="w-[80px] p-4 text-sm font-medium">Kode</TableHead>
                                        <TableHead className="p-4 text-sm font-medium">Nama Materi</TableHead>
                                        <TableHead className="w-[120px] p-4 text-sm font-medium">Semester</TableHead>
                                        <TableHead className="w-[150px] p-4 text-sm font-medium">Status</TableHead>
                                        <TableHead className="text-right w-[140px] p-4 text-sm font-medium">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredMaterials.map((m) => (
                                        <TableRow key={m.id} className="border-b hover:bg-muted/30 transition-colors">
                                            <TableCell className="p-4 text-sm font-medium">{m.code || "-"}</TableCell>
                                            <TableCell className="p-4 text-sm">
                                                <div className="font-medium text-foreground">{m.name}</div>
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
            </DialogContent>
        </Dialog>
    );
};
