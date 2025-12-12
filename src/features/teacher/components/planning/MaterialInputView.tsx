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
import { ArrowLeft, BookOpen } from "lucide-react";
import { MOCK_SUBJECTS, Material, ACTIVE_ACADEMIC_YEAR, ACTIVE_SEMESTER } from "./types";

interface MaterialInputViewProps {
    onBack: () => void;
    onSave: (data: Omit<Material, "id" | "createdAt">) => void;
}

export const MaterialInputView: React.FC<MaterialInputViewProps> = ({
    onBack,
    onSave,
}) => {
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [description, setDescription] = useState("");
    const [subject, setSubject] = useState("");

    // Automatically set to active semester/year
    const semester = ACTIVE_SEMESTER;
    const academicYear = ACTIVE_ACADEMIC_YEAR;

    const handleSave = () => {
        onSave({
            name,
            code,
            description,
            subject,
            semester,
            academicYear,
            status: "DRAFT",
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
                        Input <span className="text-primary">Materi Baru</span>
                    </h1>
                    <p className="text-muted-foreground">
                        Tambahkan materi pembelajaran untuk semester ini
                    </p>
                </div>
            </div>

            <Card className="border-t-4 border-t-primary/20">
                <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle>Formulir Materi</CardTitle>
                    </div>
                    <CardDescription>
                        Lengkapi detail materi di bawah ini. Status awal materi adalah DRAFT.
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="col-span-1 grid gap-2">
                            <Label htmlFor="code">Kode / Urutan <span className="text-destructive">*</span></Label>
                            <Input
                                id="code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="Contoh: M1"
                            />
                        </div>
                        <div className="col-span-1 md:col-span-2 grid gap-2">
                            <Label htmlFor="name">Nama Materi <span className="text-destructive">*</span></Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Contoh: Aljabar Linear"
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="subject">Mata Pelajaran <span className="text-destructive">*</span></Label>
                        <Select value={subject} onValueChange={setSubject}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Mata Pelajaran" />
                            </SelectTrigger>
                            <SelectContent>
                                {MOCK_SUBJECTS.map((s) => (
                                    <SelectItem key={s} value={s}>
                                        {s}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Deskripsi (Opsional)</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Deskripsi singkat materi..."
                            className="min-h-[120px]"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button variant="outline" onClick={onBack}>
                            Batal
                        </Button>
                        <Button onClick={handleSave} disabled={!name || !subject || !code}>
                            Simpan Materi
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
