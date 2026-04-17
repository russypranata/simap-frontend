'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    User,
    Mail,
    Phone,
    Save,
    X,
    Camera,
    Shield,
    Building2,
    AtSign,
} from 'lucide-react';
import { toast } from 'sonner';
import { AdminPhotoRequirementsModal } from './AdminPhotoRequirementsModal';
import { AdminProfileData } from '../../data/mockAdminData';

interface AdminProfileFormProps {
    initialData: AdminProfileData;
    onSave: (data: AdminProfileData, file: File | null) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export const AdminProfileForm: React.FC<AdminProfileFormProps> = ({
    initialData,
    onSave,
    onCancel,
    isLoading = false,
}) => {
    const [formData, setFormData] = useState<AdminProfileData>(initialData);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showRequirements, setShowRequirements] = useState(false);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
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

        // Validation
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            toast.error('Format File Tidak Valid', {
                description: 'Mohon unggah foto dengan format JPG atau PNG.',
            });
            return;
        }

        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSize) {
            toast.error('File Terlalu Besar', {
                description: `Ukuran file ${(file.size / (1024 * 1024)).toFixed(1)}MB melebihi batas maksimal 2MB.`,
            });
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        setFormData((prev) => ({ ...prev, profilePicture: objectUrl }));
        setSelectedFile(file);
        toast.success('Foto Berhasil Dipilih', {
            description: 'Jangan lupa simpan perubahan profil Anda.',
        });
    };

    return (
        <>
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                            <User className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">
                                Informasi Profil Administrator
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-0.5 font-normal">
                                Perbarui detail identitas dan kontak sistem
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center space-y-4 pb-6 border-b">
                        <div className="relative group">
                            <Avatar className="w-32 h-auto aspect-3/4 rounded-xl border-4 border-primary/10">
                                <AvatarImage
                                    src={formData.profilePicture}
                                    alt={formData.name}
                                    className="object-cover"
                                />
                                <AvatarFallback className="text-3xl font-semibold bg-blue-800 text-white rounded-xl">
                                    {getInitials(formData.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div
                                onClick={handleImageClick}
                                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl cursor-pointer"
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
                                <User className="h-4 w-4 text-blue-700" />
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
                                <AtSign className="h-4 w-4 text-blue-700" />
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

                        {/* Role & Department (Read Only) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-blue-700" />
                                    <Label htmlFor="role" className="mb-0">
                                        Role Sistem
                                    </Label>
                                </div>
                                <Input
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    disabled
                                    className="bg-muted"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Role sistem tidak dapat diubah
                                </p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-blue-700" />
                                    <Label htmlFor="department" className="mb-0">
                                        Departemen / Unit
                                    </Label>
                                </div>
                                <Input
                                    id="department"
                                    name="department"
                                    value={formData.department}
                                    disabled
                                    className="bg-muted"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Departemen tidak dapat diubah
                                </p>
                            </div>
                        </div>

                        {/* Email & Telepon */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-blue-700" />
                                    <Label htmlFor="email" className="mb-0">
                                        Email Resmi
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
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-blue-700" />
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
                                {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <AdminPhotoRequirementsModal
                open={showRequirements}
                onOpenChange={setShowRequirements}
                onProceed={handleProceedToUpload}
            />
        </>
    );
};
