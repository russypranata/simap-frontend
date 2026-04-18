import React, { useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Target } from "lucide-react";
import { Material, LearningObjective, ACTIVE_ACADEMIC_YEAR, ACTIVE_SEMESTER } from "./types";

interface LearningObjectiveInputViewProps {
    onBack: () => void;
    onSave: (data: Omit<LearningObjective, "id" | "createdAt">) => void;
    materials: Material[];
}

export const LearningObjectiveInputView: React.FC<LearningObjectiveInputViewProps> = ({
    onBack,
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

    // Use active year/semester directly
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
            semester,
            academicYear,
            status: "DRAFT"
        });
        onBack();
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
                <Button variant="outline" size="icon" onClick={onBack} className="mt-1">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Input <span className="text-primary">Tujuan Pembelajaran (TP)</span>
                    </h1>
                    <p className="text-muted-foreground">
                        Turunkan TP dari materi yang sudah ada
                    </p>
                </div>
            </div>

            <Card className="border-t-4 border-t-primary/20">
                <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-slate-100 rounded-lg">
                            <Target className="h-5 w-5 text-slate-600" />
                        </div>
                        <CardTitle>Formulir Tujuan Pembelajaran</CardTitle>
                    </div>
                    <CardDescription>
                        Pastikan materi sudah diinput sebelum menambahkan TP.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="grid gap-2">
                            <Label>Tahun Ajaran</Label>
                            <div className="p-3 rounded-md bg-muted text-muted-foreground font-medium border text-sm">
                                {academicYear}
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Semester</Label>
                            <div className="p-3 rounded-md bg-muted text-muted-foreground font-medium border text-sm">
                                {semester}
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="material">Materi Pembelajaran (Aktif) <span className="text-destructive">*</span></Label>
                        <Select value={materialId} onValueChange={setMaterialId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Materi dari Semester Ini" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableMaterials.map((m) => (
                                    <SelectItem key={m.id} value={m.id}>
                                        {m.code ? `[${m.code}]` : ""} {m.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {availableMaterials.length === 0 && (
                            <p className="text-sm text-destructive mt-1">
                                Belum ada materi aktif. Silakan input materi terlebih dahulu.
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="col-span-1 grid gap-2">
                            <Label htmlFor="code">Kode TP <span className="text-destructive">*</span></Label>
                            <Input
                                id="code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="Contoh: TP 1.1"
                            />
                        </div>
                        <div className="col-span-1 md:col-span-3 grid gap-2">
                            <Label htmlFor="title">Judul TP <span className="text-destructive">*</span></Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Judul singkat..."
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Isi Tujuan Pembelajaran (Lengkap) <span className="text-destructive">*</span></Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Uraian lengkap tujuan pembelajaran..."
                            className="min-h-[100px]"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="indicators">Indikator Pembelajaran (Opsional)</Label>
                        <Textarea
                            id="indicators"
                            value={indicators}
                            onChange={(e) => setIndicators(e.target.value)}
                            placeholder="Indikator ketercapaian..."
                            className="min-h-[100px]"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button variant="outline" onClick={onBack}>
                            Batal
                        </Button>
                        <Button onClick={handleSave} disabled={!materialId || !title || !code}>
                            Simpan TP
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
