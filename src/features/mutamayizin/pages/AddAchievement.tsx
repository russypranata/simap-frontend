"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Award,
    Calendar,
    ArrowLeft,
    Upload,
    User,
    Trophy,
    Image as ImageIcon,
    Save,
    Loader2,
} from "lucide-react";
import { toast } from "sonner";

export const AddAchievement: React.FC = () => {
    const router = useRouter();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [isCustomRank, setIsCustomRank] = useState(false);
    const [customRank, setCustomRank] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        studentName: "",
        competitionName: "",
        category: "",
        rank: "",
        eventName: "",
        organizer: "",
        level: "",
        date: "",
    });

    const handleRankChange = (value: string) => {
        if (value === "Lainnya") {
            setIsCustomRank(true);
            setFormData({ ...formData, rank: "" });
            setCustomRank("");
        } else {
            setIsCustomRank(false);
            setCustomRank("");
            setFormData({ ...formData, rank: value });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!validTypes.includes(file.type)) {
            toast.error("Format file tidak valid! Gunakan JPG, PNG, atau WebP");
            return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            toast.error("Ukuran file terlalu besar! Maksimal 5MB");
            return;
        }

        setSelectedImage(file);
    };

    const validateForm = (): boolean => {
        // Validate custom rank
        if (isCustomRank && !customRank.trim()) {
            toast.error("Silakan masukkan peringkat!");
            return false;
        }

        // Validate required text fields
        const requiredFields = [
            { value: formData.studentName, name: "Nama Siswa" },
            { value: formData.competitionName, name: "Nama Lomba" },
            { value: formData.eventName, name: "Nama Event" },
            { value: formData.organizer, name: "Penyelenggara Kegiatan" },
        ];

        for (const field of requiredFields) {
            if (!field.value.trim()) {
                toast.error(`${field.name} tidak boleh kosong!`);
                return false;
            }
        }

        // Validate dropdowns
        if (!isCustomRank && !formData.rank) {
            toast.error("Silakan pilih peringkat!");
            return false;
        }

        if (!formData.level) {
            toast.error("Silakan pilih tingkat lomba!");
            return false;
        }

        if (!formData.date) {
            toast.error("Silakan pilih tanggal kegiatan!");
            return false;
        }

        if (!selectedImage) {
            toast.error("Silakan upload foto!");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Use custom rank if "Lainnya" is selected
            const finalRank = isCustomRank ? customRank.trim() : formData.rank;

            // Sanitize form data (trim whitespace)
            const sanitizedData = {
                studentName: formData.studentName.trim(),
                competitionName: formData.competitionName.trim(),
                category: formData.category.trim(),
                rank: finalRank,
                eventName: formData.eventName.trim(),
                organizer: formData.organizer.trim(),
                level: formData.level,
                date: formData.date,
            };

            // TODO: Save to API/Service
            console.log("Form submitted:", sanitizedData, selectedImage);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast.success("Prestasi berhasil ditambahkan!");

            // Redirect back to list
            router.push("/mutamayizin-coordinator/achievements");
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("Gagal menambahkan prestasi. Silakan coba lagi!");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        // Check if form has unsaved changes
        const hasChanges = formData.studentName || formData.competitionName ||
            formData.category || formData.rank || formData.eventName ||
            formData.organizer || formData.level || formData.date || selectedImage;

        if (hasChanges) {
            const confirmLeave = window.confirm("Anda memiliki perubahan yang belum disimpan. Yakin ingin keluar?");
            if (!confirmLeave) return;
        }

        router.push("/mutamayizin-coordinator/achievements");
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start space-x-4">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="mt-1.5"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Tambah </span>
                        <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Prestasi</span>
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Isi formulir di bawah untuk menambahkan data prestasi siswa Program Mutamayizin
                    </p>
                </div>
            </div>

            {/* Form Card with Decorative Header */}
            <Card className="overflow-hidden p-0">
                {/* Decorative Header Section */}
                <div className="bg-blue-800 p-5 relative overflow-hidden">
                    {/* Decorative Geometric Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-40 h-40 border-[20px] border-white rounded-full -translate-y-1/2 translate-x-1/4" />
                        <div className="absolute bottom-0 right-1/3 w-20 h-20 border-[8px] border-white rounded-full translate-y-1/2" />
                    </div>

                    <div className="flex items-center gap-4 relative z-10">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                            <Trophy className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Form Input Prestasi</h2>
                            <p className="text-blue-100 text-sm">Lengkapi semua field yang ditandai dengan tanda bintang (*)</p>
                        </div>
                    </div>
                </div>

                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nama Siswa */}
                            <div className="space-y-2">
                                <Label htmlFor="studentName" className="text-sm font-medium">
                                    Nama Siswa <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="studentName"
                                        placeholder="Masukkan nama lengkap siswa"
                                        className="pl-10"
                                        value={formData.studentName}
                                        onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                                        required
                                        disabled={isSubmitting}
                                        aria-label="Nama siswa"
                                    />
                                </div>
                            </div>

                            {/* Nama Lomba */}
                            <div className="space-y-2">
                                <Label htmlFor="competitionName" className="text-sm font-medium">
                                    Nama Lomba <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Trophy className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="competitionName"
                                        placeholder="Contoh: Olimpiade Matematika"
                                        className="pl-10"
                                        value={formData.competitionName}
                                        onChange={(e) => setFormData({ ...formData, competitionName: e.target.value })}
                                        required
                                        disabled={isSubmitting}
                                        aria-label="Nama lomba"
                                    />
                                </div>
                            </div>

                            {/* Kategori Lomba */}
                            <div className="space-y-2">
                                <Label htmlFor="category" className="text-sm font-medium">
                                    Kategori Lomba
                                </Label>
                                <Input
                                    id="category"
                                    placeholder="Contoh: Akademik, Non-Akademik, Olahraga"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    disabled={isSubmitting}
                                    aria-label="Kategori lomba"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Optional - Isi jika relevan
                                </p>
                            </div>

                            {/* Juara Ke */}
                            <div className="space-y-2">
                                <Label htmlFor="rank" className="text-sm font-medium">
                                    Juara Ke <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={isCustomRank ? "Lainnya" : formData.rank}
                                    onValueChange={handleRankChange}
                                    required
                                    disabled={isSubmitting}
                                >
                                    <SelectTrigger id="rank">
                                        <SelectValue placeholder="Pilih peringkat" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Juara 1">Juara 1</SelectItem>
                                        <SelectItem value="Juara 2">Juara 2</SelectItem>
                                        <SelectItem value="Juara 3">Juara 3</SelectItem>
                                        <SelectItem value="Lainnya">Lainnya (Input Manual)</SelectItem>
                                    </SelectContent>
                                </Select>
                                {isCustomRank && (
                                    <div className="space-y-1">
                                        <Input
                                            placeholder="Contoh: Juara Harapan 1, Finalis, Juara Favorit"
                                            value={customRank}
                                            onChange={(e) => setCustomRank(e.target.value)}
                                            required
                                            disabled={isSubmitting}
                                            aria-label="Peringkat custom"
                                            aria-describedby="rank-help"
                                        />
                                        <p id="rank-help" className="text-xs text-muted-foreground">
                                            Masukkan peringkat yang diterima (wajib diisi)
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Nama Event */}
                            <div className="space-y-2">
                                <Label htmlFor="eventName" className="text-sm font-medium">
                                    Nama Event <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="eventName"
                                    placeholder="Contoh: OSN Tingkat Provinsi 2024"
                                    value={formData.eventName}
                                    onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                                    required
                                    disabled={isSubmitting}
                                    aria-label="Nama event"
                                />
                            </div>

                            {/* Penyelenggara Kegiatan */}
                            <div className="space-y-2">
                                <Label htmlFor="organizer" className="text-sm font-medium">
                                    Penyelenggara Kegiatan <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="organizer"
                                    placeholder="Contoh: Dinas Pendidikan Provinsi Kalbar"
                                    value={formData.organizer}
                                    onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                                    required
                                    disabled={isSubmitting}
                                    aria-label="Penyelenggara kegiatan"
                                />
                            </div>

                            {/* Tingkat */}
                            <div className="space-y-2">
                                <Label htmlFor="level" className="text-sm font-medium">
                                    Tingkat <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={formData.level}
                                    onValueChange={(value) => setFormData({ ...formData, level: value })}
                                    required
                                    disabled={isSubmitting}
                                >
                                    <SelectTrigger id="level">
                                        <SelectValue placeholder="Pilih tingkat lomba" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Sekolah">Sekolah</SelectItem>
                                        <SelectItem value="Kecamatan">Kecamatan</SelectItem>
                                        <SelectItem value="Kabupaten">Kabupaten</SelectItem>
                                        <SelectItem value="Provinsi">Provinsi</SelectItem>
                                        <SelectItem value="Nasional">Nasional</SelectItem>
                                        <SelectItem value="Internasional">Internasional</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Tanggal Kegiatan */}
                            <div className="space-y-2">
                                <Label htmlFor="date" className="text-sm font-medium">
                                    Tanggal Kegiatan <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="date"
                                        type="date"
                                        className="pl-10"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        required
                                        disabled={isSubmitting}
                                        aria-label="Tanggal kegiatan"
                                        max={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Tanggal pelaksanaan lomba/kegiatan
                                </p>
                            </div>

                            {/* Upload Foto - Full width */}
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="photo" className="text-sm font-medium">
                                    Foto <span className="text-red-500">*</span>
                                </Label>
                                <div className="space-y-2">
                                    <Input
                                        id="photo"
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        required={!selectedImage}
                                        disabled={isSubmitting}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => document.getElementById("photo")?.click()}
                                        className="w-full max-w-md"
                                        disabled={isSubmitting}
                                    >
                                        <Upload className="h-4 w-4 mr-2" />
                                        {selectedImage ? selectedImage.name : "Pilih Foto"}
                                    </Button>
                                    {selectedImage ? (
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <ImageIcon className="h-3 w-3" />
                                            File terpilih: {selectedImage.name} ({(selectedImage.size / 1024).toFixed(1)} KB)
                                        </p>
                                    ) : (
                                        <p className="text-xs text-muted-foreground">
                                            Format: JPG, PNG, WebP. Maksimal 5MB
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-3 pt-6 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                disabled={isSubmitting}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                className="bg-blue-800 hover:bg-blue-900"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Simpan Prestasi
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
