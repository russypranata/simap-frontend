 
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
import { Trash2, Edit, Eye, Download, Target } from "lucide-react";
import { Material, LearningObjective, ApprovalStatus, ACTIVE_ACADEMIC_YEAR, MOCK_SEMESTERS } from "./types";

interface LearningObjectiveHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
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

export const LearningObjectiveHistoryModal: React.FC<LearningObjectiveHistoryModalProps> = ({
    isOpen,
    onClose,
    learningObjectives,
    materials,
    onDelete,
}) => {
    const [selectedYear, setSelectedYear] = useState(ACTIVE_ACADEMIC_YEAR);
    const [selectedSemester, setSelectedSemester] = useState("All");
    const [selectedMaterialId, setSelectedMaterialId] = useState("All");

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

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[95vw] max-w-full max-h-[90vh] overflow-y-auto">
                <DialogHeader className="border-b pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-slate-100 rounded-lg">
                            <Target className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl">Riwayat Tujuan Pembelajaran</DialogTitle>
                            <DialogDescription>
                                Kelola data TP yang telah diinputkan untuk tahun ajaran {ACTIVE_ACADEMIC_YEAR}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex flex-col md:flex-row gap-4 justify-between items-end my-4">
                    <div className="flex flex-wrap gap-2">
                        <div className="grid gap-1">
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
                        <div className="grid gap-1">
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
                        <div className="grid gap-1">
                            <span className="text-sm font-medium">Materi</span>
                            <Select value={selectedMaterialId} onValueChange={setSelectedMaterialId}>
                                <SelectTrigger className="w-[200px]">
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
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Export Dokumen
                    </Button>
                </div>

                <div className="mt-2 border rounded-md overflow-hidden">
                    {filteredTPs.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground bg-muted/5">
                            Tidak ada TP data filter yang dipilih.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-slate-50 border-b border-slate-200">
                                    <TableRow>
                                        <TableHead className="w-[80px] p-4 text-sm font-medium">Kode</TableHead>
                                        <TableHead className="p-4 text-sm font-medium">Isi TP</TableHead>
                                        <TableHead className="w-[180px] p-4 text-sm font-medium">Materi</TableHead>
                                        <TableHead className="w-[120px] p-4 text-sm font-medium">Semester</TableHead>
                                        <TableHead className="w-[150px] p-4 text-sm font-medium">Status</TableHead>
                                        <TableHead className="text-right w-[140px] p-4 text-sm font-medium">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredTPs.map((tp) => (
                                        <TableRow key={tp.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                            <TableCell className="p-4 text-sm font-medium">{tp.code || "-"}</TableCell>
                                            <TableCell className="p-4 text-sm max-w-[300px]">
                                                <div className="font-medium truncate text-foreground" title={tp.title}>{tp.title}</div>
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
            </DialogContent>
        </Dialog>
    );
};
