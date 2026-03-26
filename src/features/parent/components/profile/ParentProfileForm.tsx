"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Save,
    X,
    Camera,
    AtSign,
    Briefcase,
    Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
// Reuse components from student features as they are generic
import { PhotoRequirementsModal } from '@/features/student/components/profile/PhotoRequirementsModal';
import { ImageCropper } from '@/features/student/components/profile/ImageCropper';

import { ParentProfileData } from '../../data/mockParentData';

interface ParentProfileFormProps {
    initialData: ParentProfileData;
    onSave: (data: ParentProfileData, file: File | null) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export const ParentProfileForm: React.FC<ParentProfileFormProps> = ({
    initialData,
    onSave,
    onCancel,
    isLoading = false,
}) => {
    const [formData, setFormData] = useState<ParentProfileData>(initialData);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showRequirements, setShowRequirements] = useState(false);

    // Cropper State
    const [cropperOpen, setCropperOpen] = useState(false);
    const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        // Basic presence check
        if (!formData.name || !formData.email || !formData.username || !formData.phone) {
            toast.error('Silakan cek kembali input Anda', {
                description: 'Nama, Username, Email, dan Telepon wajib diisi.',
            });
            return;
        }

        // Email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error('Format email tidak valid', {
                description: 'Mohon masukkan alamat email yang benar.',
            });
            return;
        }

        // Phone numeric check
        const phoneRegex = /^[0-9+]+$/;
        if (!phoneRegex.test(formData.phone)) {
            toast.error('Format telepon tidak valid', {
                description: 'Nomor telepon hanya boleh berisi angka.',
            });
            return;
        }

        onSave(formData, selectedFile);
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleImageClick = () => {
        setShowRequirements(true);
    };

    const handleProceedToUpload = () => {
        setShowRequirements(false);
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 1. Validasi Format
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            toast.error(
                <span className="font-bold text-red-800">
                    Format File Tidak Valid
                </span>,
                {
                    description:
                        'Mohon unggah foto dengan format JPG atau PNG.',
                },
            );
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        // 2. Validasi Ukuran (Max 2MB)
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSize) {
            toast.error(
                <span className="font-bold text-red-800">
                    File Terlalu Besar
                </span>,
                {
                    description: `Ukuran file ${(file.size / (1024 * 1024)).toFixed(1)}MB melebihi batas maksimal 2MB.`,
                },
            );
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        // Read file as Data URL for cropping
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            setTempImageSrc(reader.result?.toString() || null);
            setCropperOpen(true);
        });
        reader.readAsDataURL(file);

        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleCropComplete = (croppedFile: File) => {
        const objectUrl = URL.createObjectURL(croppedFile);
        
        // Simple validation, assuming cropper enforces aspect ratio
        setFormData((prev) => ({ ...prev, profilePicture: objectUrl }));
        setSelectedFile(croppedFile);
        setCropperOpen(false);
        toast.success(
            <span className="font-bold text-green-800">
                Foto Berhasil Diperbarui
            </span>,
            {
                description: 'Jangan lupa simpan perubahan profil Anda.',
            },
        );
    };

    return (
        <>
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <User className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">
                                Informasi Profil
                            </CardTitle>
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
                            <Avatar className="w-32 h-32 rounded-full border-4 border-primary/10">
                                {selectedFile ? (
                                    <AvatarImage
                                        src={formData.profilePicture}
                                        alt={formData.name}
                                        className="object-cover"
                                    />
                                ) : null}
                                <AvatarFallback className="text-3xl font-semibold bg-blue-800 text-white rounded-full">
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
                            className="text-blue-800 hover:text-blue-900 border-transparent hover:border-transparent hover:bg-blue-50"
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
                            />
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
                            />
                        </div>

                         {/* Pekerjaan */}
                         <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-primary" />
                                <Label htmlFor="occupation" className="mb-0">
                                    Pekerjaan
                                </Label>
                            </div>
                            <Input
                                id="occupation"
                                name="occupation"
                                value={formData.occupation}
                                onChange={handleInputChange}
                                placeholder="Masukkan pekerjaan"
                            />
                        </div>

                        {/* Email & Telepon */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-primary" />
                                    <Label htmlFor="email" className="mb-0">
                                        Email
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </Label>
                                </div>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="email@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-primary" />
                                    <Label htmlFor="phone" className="mb-0">
                                        Nomor Telepon
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </Label>
                                </div>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="08xxxxxxxxxx"
                                    className="font-mono"
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
                                {isLoading ? (
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
                    </div>
                </CardContent>
            </Card>

            {/* Photo Requirements Modal */}
            <PhotoRequirementsModal
                open={showRequirements}
                onOpenChange={setShowRequirements}
                onProceed={handleProceedToUpload}
            />

            {/* Image Cropper Modal */}
            <ImageCropper
                open={cropperOpen}
                onClose={() => setCropperOpen(false)}
                imageSrc={tempImageSrc}
                onCropComplete={handleCropComplete}
            />
        </>
    );
};
