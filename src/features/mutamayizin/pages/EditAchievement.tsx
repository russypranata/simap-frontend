"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
    Save,
    Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { updateAchievement, uploadAchievementPhoto, deleteAchievementPhoto, getAchievement } from "../services/mutamayizinService";

export const EditAchievement: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const achievementId = Number(params.id);

    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [existingPhotos, setExistingPhotos] = useState<{ id: number; url: string }[]>([]);
    const [deletingPhotoId, setDeletingPhotoId] = useState<number | null>(null);
    const [isCustomRank, setIsCustomRank] = useState(false);
    const [customRank, setCustomRank] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

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

    // Load existing achievement data
    useEffect(() => {
        const loadAchievement = async () => {
            try {
                const data = await getAchievement(achievementId);
                setFormData({
                    studentName: data.studentName,
                    competitionName: data.competitionName,
                    category: data.category || "",
                    rank: data.rank,
                    eventName: data.eventName || "",
                    organizer: data.organizer || "",
                    level: data.level ? data.level.charAt(0).toUpperCase() + data.level.slice(1) : "",
                    date: data.date,
                });
                setExistingPhotos(data.photos || []);
            } catch (error) {
                console.error("Failed to load achievement:", error);
                toast.error("Gagal memuat data prestasi");
                router.push("/mutamayizin-coordinator/achievements");
            } finally {
                setIsLoading(false);
            }
        };
        loadAchievement();
    }, [achievementId, router]);

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
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // Validate each file
        const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        const maxSize = 5 * 1024 * 1024; // 5MB
        const maxFiles = 5 - existingPhotos.length - selectedImages.length;

        if (files.length > maxFiles) {
            toast.error(`Maksimal ${maxFiles} foto lagi yang bisa ditambahkan`);
            return;
        }

        for (const file of files) {
            if (!validTypes.includes(file.type)) {
                toast.error("Format file tidak valid! Gunakan JPG, PNG, atau WebP");
                return;
            }
            if (file.size > maxSize) {
                toast.error("Ukuran file terlalu besar! Maksimal 5MB");
                return;
            }
        }

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setSelectedImages(prev => [...prev, ...files]);
        setImagePreviews(prev => [...prev, ...newPreviews]);

        // Reset input
        e.target.value = '';
    };

    const handleDeleteExistingPhoto = async (photoId: number) => {
        const confirmDelete = window.confirm("Yakin ingin menghapus foto ini?");
        if (!confirmDelete) return;

        setDeletingPhotoId(photoId);
        try {
            await deleteAchievementPhoto(photoId);
            setExistingPhotos(prev => prev.filter(p => p.id !== photoId));
            toast.success("Foto berhasil dihapus");
        } catch (error) {
            console.error("Error deleting photo:", error);
            toast.error("Gagal menghapus foto");
        } finally {
            setDeletingPhotoId(null);
        }
    };

    const handleRemoveSelectedImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
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

        // Photo is optional on edit - user can keep existing photo
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Use custom rank if "Lainnya" is selected
            const finalRank = isCustomRank ? customRank.trim() : formData.rank;

            // Update achievement data (without photo first)
            const updateData = {
                competition_name: formData.competitionName.trim(),
                category: formData.category.trim(),
                rank: finalRank,
                event_name: formData.eventName.trim(),
                organizer: formData.organizer.trim(),
                level: formData.level,
                date: formData.date,
            };

            await updateAchievement(achievementId, updateData);

            // If new images selected, upload them
            for (const image of selectedImages) {
                await uploadAchievementPhoto(achievementId, image);
            }

            toast.success("Prestasi berhasil diperbarui!");
            // Reload to get updated photos
            const updatedData = await getAchievement(achievementId);
            setExistingPhotos(updatedData.photos || []);
            setSelectedImages([]);
            setImagePreviews([]);
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error(error instanceof Error ? error.message : "Gagal memperbarui prestasi. Silakan coba lagi!");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        // Check if form has unsaved changes
        const hasChanges = formData.studentName || formData.competitionName ||
            formData.category || formData.rank || formData.eventName ||
            formData.organizer || formData.level || formData.date || selectedImages.length > 0;

        if (hasChanges) {
            const confirmLeave = window.confirm("Anda memiliki perubahan yang belum disimpan. Yakin ingin keluar?");
            if (!confirmLeave) return;
        }

        router.push("/mutamayizin-coordinator/achievements");
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                            className="h-8 w-8 p-0"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Edit </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Prestasi</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Award className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Perbarui informasi prestasi siswa Program Mutamayizin
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
                                        disabled={isSubmitting || isLoading}
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
                                        disabled={isSubmitting || isLoading}
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
                                    disabled={isSubmitting || isLoading}
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
                                    disabled={isSubmitting || isLoading}
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
                                            disabled={isSubmitting || isLoading}
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
                                    disabled={isSubmitting || isLoading}
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
                                    disabled={isSubmitting || isLoading}
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
                                    disabled={isSubmitting || isLoading}
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
                                        disabled={isSubmitting || isLoading}
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
                                    Foto (Bisa lebih dari 1)
                                </Label>

                                {/* Existing Photos */}
                                {existingPhotos.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-xs text-muted-foreground">Foto saat ini:</p>
                                        <div className="flex flex-wrap gap-3">
                                            {existingPhotos.map((photo) => (
                                                <div key={photo.id} className="relative">
                                                    <img
                                                        src={photo.url}
                                                        alt="Foto prestasi"
                                                        className="max-w-xs max-h-48 rounded-lg border object-cover"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDeleteExistingPhoto(photo.id)}
                                                        disabled={deletingPhotoId === photo.id || isSubmitting}
                                                        className="absolute -top-2 -right-2 h-8 w-8 p-0 rounded-full"
                                                    >
                                                        {deletingPhotoId === photo.id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <span className="text-xs">✕</span>
                                                        )}
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* New Image Previews */}
                                {imagePreviews.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-xs text-muted-foreground">Foto baru yang akan diupload:</p>
                                        <div className="flex flex-wrap gap-3">
                                            {imagePreviews.map((preview, index) => (
                                                <div key={index} className="relative">
                                                    <img
                                                        src={preview}
                                                        alt={`Preview ${index + 1}`}
                                                        className="max-w-xs max-h-48 rounded-lg border object-cover"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleRemoveSelectedImage(index)}
                                                        disabled={isSubmitting}
                                                        className="absolute -top-2 -right-2 h-8 w-8 p-0 rounded-full bg-white"
                                                    >
                                                        <span className="text-xs">✕</span>
                                                    </Button>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {selectedImages[index]?.name} ({((selectedImages[index]?.size ?? 0) / 1024).toFixed(1)} KB)
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Input
                                        id="photo"
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        disabled={isSubmitting || isLoading}
                                        multiple
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => document.getElementById("photo")?.click()}
                                        className="w-full max-w-md"
                                        disabled={isSubmitting || isLoading || existingPhotos.length + selectedImages.length >= 5}
                                    >
                                        <Upload className="h-4 w-4 mr-2" />
                                        {existingPhotos.length + selectedImages.length > 0 ? "Tambah Foto" : "Pilih Foto"}
                                    </Button>
                                    <p className="text-xs text-muted-foreground">
                                        Format: JPG, PNG, WebP. Maksimal 5MB per foto. Maksimal 5 foto.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-3 pt-6 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                disabled={isSubmitting || isLoading}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                className="bg-blue-800 hover:bg-blue-900"
                                disabled={isSubmitting || isLoading}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Simpan Perubahan
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
