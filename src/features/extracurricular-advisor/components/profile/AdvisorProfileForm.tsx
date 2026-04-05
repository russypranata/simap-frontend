"use client";

import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdvisorPhotoRequirementsModal } from "./AdvisorPhotoRequirementsModal";
import { ImageCropper } from "@/components/ui/image-cropper";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Save,
    X,
    Camera,
    Star,
    AtSign,
} from "lucide-react";
import { toast } from "sonner";

export interface AdvisorProfileData {
    name: string;
    username: string;
    email: string;
    phone: string;
    role: string;
    profilePicture: string;
    address: string;
    nip?: string;
    extracurricular: string;
}

interface AdvisorProfileFormProps {
    initialData: AdvisorProfileData;
    onSave: (data: AdvisorProfileData, file: File | null) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export const AdvisorProfileForm: React.FC<AdvisorProfileFormProps> = ({
    initialData,
    onSave,
    onCancel,
    isLoading = false,
}) => {
    const [formData, setFormData] = useState<AdvisorProfileData>(initialData);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [isCropperOpen, setIsCropperOpen] = useState(false);
    const [showRequirements, setShowRequirements] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (!formData.name || !formData.email || !formData.username) {
            toast.error('Nama, Username, dan Email wajib diisi');
            return;
        }
        onSave(formData, selectedFile);
    };

    const handleImageClick = () => {
        setShowRequirements(true);
    };

    const handleProceedToUpload = () => {
        setShowRequirements(false);
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 1. Basic Format Validation
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            toast.error("Format File Tidak Valid", {
                description: 'Mohon unggah foto dengan format JPG atau PNG.',
            });
            return;
        }

        // 2. Read file to trigger cropper
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            setImageSrc(reader.result?.toString() || null);
            setIsCropperOpen(true);
        });
        reader.readAsDataURL(file);
        
        // Reset input value so same file can be selected again if needed
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleCropComplete = (croppedBlob: Blob) => {
        // Create URL for preview
        const objectUrl = URL.createObjectURL(croppedBlob);
        
        // Update form data with preview
        setFormData((prev) => ({ ...prev, profilePicture: objectUrl }));
        
        // Update selected file for upload
        const file = new File([croppedBlob], "profile_picture.jpg", { type: "image/jpeg" });
        setSelectedFile(file);
        
        toast.success("Foto Berhasil Diperbarui", {
            description: 'Jangan lupa tekan Simpan Perubahan.',
        });
    };

    const initials = formData.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);

    return (
        <Card>
            <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        <User className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">Informasi Profil</CardTitle>
                        <p className="text-sm text-muted-foreground mt-0.5 font-normal">
                            Perbarui detail identitas dan kontak Anda
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex flex-col items-center space-y-4 pb-6 border-b">
                        <div className="relative group">
                            <Avatar className="h-32 w-32 rounded-full border-4 border-primary/10 transition-transform duration-300 group-hover:scale-105">
                                <AvatarImage
                                    src={formData.profilePicture}
                                    alt={formData.name}
                                    className="object-cover"
                                />
                                <AvatarFallback className="text-3xl font-semibold bg-blue-800 text-white rounded-full">
                                    {initials}
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
                            onClick={handleImageClick}
                            className="text-blue-800 hover:text-blue-900 border-transparent hover:border-transparent hover:bg-blue-50"
                        >
                            <Camera className="h-4 w-4 mr-2" />
                            Ubah Foto Profil
                        </Button>
                    </div>

                    <AdvisorPhotoRequirementsModal
                        open={showRequirements}
                        onOpenChange={setShowRequirements}
                        onProceed={handleProceedToUpload}
                    />

                    <ImageCropper
                        open={isCropperOpen}
                        onOpenChange={setIsCropperOpen}
                        imageSrc={imageSrc}
                        onCropComplete={handleCropComplete}
                        aspect={1} // Square crop for round avatar
                    />

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                required
                            />
                        </div>

                        {/* NIP (Optional) */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-primary" />
                                <Label htmlFor="nip" className="mb-0">
                                    NIP <span className="text-muted-foreground font-normal text-xs">(Opsional)</span>
                                </Label>
                            </div>
                            <Input
                                id="nip"
                                name="nip"
                                value={formData.nip || "-"}
                                readOnly
                                disabled
                                className="bg-muted"
                            />
                            <p className="text-xs text-muted-foreground">NIP tidak dapat diubah</p>
                        </div>

                        {/* Username */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <AtSign className="h-4 w-4 text-primary" />
                                <Label htmlFor="username" className="mb-0">
                                    Username
                                    <span className="text-red-500 ml-1">*</span>
                                </Label>
                            </div>
                            <Input
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                placeholder="Masukkan username"
                                required
                            />
                        </div>



                        {/* Ekstrakurikuler */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-primary" />
                                <Label htmlFor="extracurricular" className="mb-0">
                                    Ekstrakurikuler
                                </Label>
                            </div>
                            <Input
                                id="extracurricular"
                                name="extracurricular"
                                value={formData.extracurricular}
                                readOnly
                                disabled
                                className="bg-muted"
                            />
                             <p className="text-xs text-muted-foreground">Ekstrakurikuler tidak dapat diubah</p>
                        </div>

                        {/* Email */}
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
                                placeholder="Masukkan email"
                                required
                            />
                        </div>

                        {/* Telepon */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-primary" />
                                <Label htmlFor="phone" className="mb-0">
                                    Telepon
                                    <span className="text-red-500 ml-1">*</span>
                                </Label>
                            </div>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Masukkan nomor telepon"
                                required
                            />
                        </div>

                        {/* Alamat */}
                        <div className="space-y-2 md:col-span-2">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary" />
                                <Label htmlFor="address" className="mb-0">
                                    Alamat
                                </Label>
                            </div>
                            <Textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Masukkan alamat lengkap"
                                rows={3}
                            />
                        </div>
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
    );
};
