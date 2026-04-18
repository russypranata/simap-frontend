/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
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
import { MOCK_SUBJECTS, Material, ACTIVE_ACADEMIC_YEAR, ACTIVE_SEMESTER } from "./types";

interface MaterialInputModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<Material, "id" | "createdAt">) => void;
}

export const MaterialInputModal: React.FC<MaterialInputModalProps> = ({
    isOpen,
    onClose,
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
        onClose();
        // Reset form
        setName("");
        setCode("");
        setDescription("");
        setSubject("");
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Tambah Materi</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Tahun Ajaran</Label>
                            <Input
                                disabled
                                value={academicYear}
                                className="bg-muted text-muted-foreground"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Semester</Label>
                            <Input
                                disabled
                                value={semester}
                                className="bg-muted text-muted-foreground"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1 grid gap-2">
                            <Label htmlFor="code">Kode</Label>
                            <Input
                                id="code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="Contoh: M1"
                            />
                        </div>
                        <div className="col-span-2 grid gap-2">
                            <Label htmlFor="name">Nama Materi</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Contoh: Aljabar Linear"
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Deskripsi (Opsional)</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Deskripsi singkat materi..."
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="subject">Mapel</Label>
                        <Select value={subject} onValueChange={setSubject}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Mapel" />
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
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Batal
                    </Button>
                    <Button onClick={handleSave} disabled={!name || !subject}>
                        Simpan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
