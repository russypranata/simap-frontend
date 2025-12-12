import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Material, LearningObjective, ACTIVE_ACADEMIC_YEAR, ACTIVE_SEMESTER } from "./types";

interface LearningObjectiveInputModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<LearningObjective, "id" | "createdAt">) => void;
    materials: Material[];
}

export const LearningObjectiveInputModal: React.FC<LearningObjectiveInputModalProps> = ({
    isOpen,
    onClose,
    onSave,
    materials,
}) => {
    const [materialId, setMaterialId] = useState("");
    const [code, setCode] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [indicators, setIndicators] = useState("");

    // Filter materials for active year/semester
    const availableMaterials = materials.filter(m =>
        m.academicYear === ACTIVE_ACADEMIC_YEAR &&
        m.semester === ACTIVE_SEMESTER
    );

    // Use active year/semester directly since we only allow input for active period
    const semester = ACTIVE_SEMESTER;
    const academicYear = ACTIVE_ACADEMIC_YEAR;

    const handleSave = () => {
        if (!materialId) return;

        onSave({
            materialId,
            code,
            title,
            description,
            indicators,
            semester, // Auto-filled from material
            academicYear, // Auto-filled from material
            status: "DRAFT"
        });
        onClose();
        // Reset
        setMaterialId("");
        setCode("");
        setTitle("");
        setDescription("");
        setIndicators("");
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Tambah Tujuan Pembelajaran (TP)</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Tahun Ajaran</Label>
                            <Input
                                disabled
                                value={academicYear || "-"}
                                className="bg-muted text-muted-foreground"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Semester</Label>
                            <Input
                                disabled
                                value={semester || "-"}
                                className="bg-muted text-muted-foreground"
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="material">Materi Pembelajaran (Aktif)</Label>
                        <Select value={materialId} onValueChange={setMaterialId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Materi" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableMaterials.map((m) => (
                                    <SelectItem key={m.id} value={m.id}>
                                        {m.code ? `[${m.code}]` : ""} {m.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-1 grid gap-2">
                            <Label htmlFor="code">Kode TP</Label>
                            <Input
                                id="code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="Contoh: TP 1.1"
                            />
                        </div>
                        <div className="col-span-3 grid gap-2">
                            <Label htmlFor="title">Judul TP</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Judul singkat..."
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Isi Tujuan Pembelajaran</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Uraian lengkap tujuan pembelajaran..."
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="indicators">Indikator Pembelajaran (Opsional)</Label>
                        <Textarea
                            id="indicators"
                            value={indicators}
                            onChange={(e) => setIndicators(e.target.value)}
                            placeholder="Indikator ketercapaian..."
                        />
                    </div>

                    <p className="text-[0.8rem] text-muted-foreground">
                        Tahun Ajaran dan Semester otomatis mengikuti Materi.
                    </p>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Batal
                    </Button>
                    <Button onClick={handleSave} disabled={!materialId || !title}>
                        Simpan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
