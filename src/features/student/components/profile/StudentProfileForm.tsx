"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Save,
    X,
    Camera,
    IdCard,
    GraduationCap,
} from "lucide-react";
import { toast } from "sonner";
import { PhotoRequirementsModal } from "./PhotoRequirementsModal";

import { StudentProfileData } from "../../data/mockStudentData";

interface StudentProfileFormProps {
    initialData: StudentProfileData;
    onSave: (data: StudentProfileData) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export const StudentProfileForm: React.FC<StudentProfileFormProps> = ({
    initialData,
    onSave,
    onCancel,
    isLoading = false,
}) => {
    const [formData, setFormData] = useState<StudentProfileData>(initialData);
    const [showRequirements, setShowRequirements] = useState(false);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (!formData.name || !formData.email) {
            toast.error("Nama dan email wajib diisi");
            return;
        }
        onSave(formData);
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
    };

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleImageClick = () => {
        // Show requirements modal first
        setShowRequirements(true);
    };

    const handleProceedToUpload = () => {
        // Close modal and open file picker
        setShowRequirements(false);
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 1. Validasi Format
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            toast.error(<span className="font-bold text-red-800">Format File Tidak Valid</span>, {
                description: "Mohon unggah foto dengan format JPG atau PNG.",
            });
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        // 2. Validasi Ukuran (Max 2MB)
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSize) {
            toast.error(<span className="font-bold text-red-800">File Terlalu Besar</span>, {
                description: `Ukuran file ${(file.size / (1024 * 1024)).toFixed(1)}MB melebihi batas maksimal 2MB.`,
            });
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        // 3. Validasi Dimensi & Rasio
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
            const width = img.width;
            const height = img.height;
            const ratio = width / height;

            // Validasi Resolusi Minimal (300x400)
            if (width < 300 || height < 400) {
                toast.error(<span className="font-bold text-red-800">Resolusi Terlalu Rendah</span>, {
                    description: `Dimensi foto ${width}x${height}px kurang dari minimal 300x400px.`,
                });
                URL.revokeObjectURL(objectUrl);
                if (fileInputRef.current) fileInputRef.current.value = "";
                return;
            }

            // Validasi Rasio (Target 3:4 = 0.75)
            // Toleransi: 0.65 - 0.85
            if (ratio < 0.65 || ratio > 0.85) {
                toast.error(<span className="font-bold text-red-800">Proporsi Tidak Sesuai</span>, {
                    description: "Foto harus berorientasi Portrait dengan rasio 3:4.",
                });
                URL.revokeObjectURL(objectUrl);
                if (fileInputRef.current) fileInputRef.current.value = "";
                return;
            }

            // Semua Validasi Lolos
            setFormData((prev) => ({ ...prev, avatar: objectUrl }));
            toast.success(<span className="font-bold text-green-800">Foto Berhasil Dipilih</span>, {
                description: "Jangan lupa simpan perubahan profil Anda.",
            });
        };

        img.onerror = () => {
            toast.error(<span className="font-bold text-red-800">Gagal Memproses File</span>, {
                description: "Terjadi kesalahan saat membaca file gambar.",
            });
            URL.revokeObjectURL(objectUrl);
        };

        img.src = objectUrl;
    };

    return (
        <>
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                            <User className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle>Informasi Profil</CardTitle>
                            <p className="text-sm text-muted-foreground mt-0.5 font-normal">
                                Perbarui detail identitas dan kontak
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center space-y-4 pb-6 border-b">
                        <div className="relative group">
                            <Avatar className="h-32 w-32 border-4 border-primary/10">
                                <AvatarImage
                                    src={formData.avatar}
                                    alt={formData.name}
                                    className="object-cover"
                                />
                                <AvatarFallback className="text-3xl font-semibold bg-blue-800 text-white">
                                    {getInitials(formData.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div
                                onClick={handleImageClick}
                                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer"
                            >
                                <Camera className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-800 hover:text-blue-900 border-blue-800/30 hover:border-blue-800"
                            onClick={handleImageClick}
                        >
                            <Camera className="h-4 w-4 mr-2" />
                            Ubah Foto Profil
                        </Button>
                    </div>

                    {/* Form Fields */}
                    <div className="grid gap-6">
                        {/* Nama Lengkap */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-primary" />
                                <Label htmlFor="name" className="mb-0">
                                    Nama Lengkap
                                    <span className="text-red-500 ml-1">*</span>
                                </Label>
                            </div>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Masukkan nama lengkap"
                                className=""
                            />
                        </div>

                        {/* NIS & Kelas (Read Only) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <IdCard className="h-4 w-4 text-primary" />
                                    <Label htmlFor="nis" className="mb-0">
                                        NIS
                                        <span className="text-red-500 ml-1">*</span>
                                    </Label>
                                </div>
                                <Input
                                    id="nis"
                                    name="nis"
                                    value={formData.nis}
                                    disabled
                                    className="bg-muted"
                                />
                                <p className="text-xs text-muted-foreground">
                                    NIS tidak dapat diubah
                                </p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4 text-primary" />
                                    <Label htmlFor="class" className="mb-0">
                                        Kelas
                                    </Label>
                                </div>
                                <Input
                                    id="class"
                                    name="class"
                                    value={formData.class}
                                    disabled
                                    className="bg-muted"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Kelas tidak dapat diubah
                                </p>
                            </div>
                        </div>

                        {/* Email & Telepon */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-primary" />
                                    <Label htmlFor="email" className="mb-0">
                                        Email
                                        <span className="text-red-500 ml-1">*</span>
                                    </Label>
                                </div>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="email@example.com"
                                    className=""
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-primary" />
                                    <Label htmlFor="phone" className="mb-0">
                                        Nomor Telepon
                                        <span className="text-red-500 ml-1">*</span>
                                    </Label>
                                </div>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="08xxxxxxxxxx"
                                    className=""
                                />
                            </div>
                        </div>

                        {/* Tempat & Tanggal Lahir */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    <Label htmlFor="birthPlace" className="mb-0">
                                        Tempat Lahir
                                    </Label>
                                </div>
                                <Input
                                    id="birthPlace"
                                    name="birthPlace"
                                    value={formData.birthPlace}
                                    onChange={handleInputChange}
                                    placeholder="Kota tempat lahir"
                                    className=""
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    <Label htmlFor="birthDate" className="mb-0">
                                        Tanggal Lahir
                                    </Label>
                                </div>
                                <Input
                                    id="birthDate"
                                    name="birthDate"
                                    type="date"
                                    value={formData.birthDate}
                                    onChange={handleInputChange}
                                    className=""
                                />
                            </div>
                        </div>

                        {/* Alamat */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary" />
                                <Label htmlFor="address" className="mb-0">
                                    Alamat Lengkap
                                </Label>
                            </div>
                            <Textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Masukkan alamat lengkap"
                                rows={3}
                                className=""
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t">
                            <Button
                                variant="outline"
                                onClick={onCancel}
                                disabled={isLoading}
                                className="flex-1 sm:flex-none"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Batal
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={isLoading}
                                className="flex-1 sm:flex-none bg-blue-800 hover:bg-blue-900 text-white"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Photo Requirements Modal */}
            <PhotoRequirementsModal
                open={showRequirements}
                onOpenChange={setShowRequirements}
                onProceed={handleProceedToUpload}
            />
        </>
    );
};
