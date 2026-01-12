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
    Save,
    X,
    Camera,
    IdCard,
    Flag,
} from "lucide-react";

export interface AdvisorProfileData {
    name: string;
    email: string;
    phone: string;
    role: string;
    profilePicture: string;
    address: string;
    nip: string;
    extracurricular: string;
}

interface AdvisorProfileFormProps {
    initialData: AdvisorProfileData;
    onSave: (data: AdvisorProfileData) => void;
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

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onSave(formData);
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
                        <CardTitle>Informasi Profil</CardTitle>
                        <p className="text-sm text-muted-foreground mt-0.5 font-normal">
                            Perbarui detail identitas dan kontak
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative group">
                            <Avatar className="h-32 w-32 border-4 border-primary/10">
                                <AvatarImage
                                    src={formData.profilePicture}
                                    alt={formData.name}
                                />
                                <AvatarFallback className="text-3xl font-semibold bg-blue-800 text-white">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                                <Camera className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-800 hover:text-blue-900 border-blue-800/30 hover:border-blue-800"
                        >
                            <Camera className="h-4 w-4 mr-2" />
                            Ubah Foto Profil
                        </Button>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nama Lengkap */}
                        <div className="space-y-2 md:col-span-2">
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
                                className=""
                            />
                        </div>

                        {/* NIP */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <IdCard className="h-4 w-4 text-primary" />
                                <Label htmlFor="nip" className="mb-0">
                                    NIP
                                    <span className="text-red-500 ml-1">*</span>
                                </Label>
                            </div>
                            <Input
                                id="nip"
                                name="nip"
                                value={formData.nip}
                                onChange={handleInputChange}
                                placeholder="Masukkan NIP"
                                required
                                readOnly
                                className=""
                            />
                        </div>

                        {/* Ekstrakurikuler */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Flag className="h-4 w-4 text-primary" />
                                <Label htmlFor="extracurricular" className="mb-0">
                                    Ekstrakurikuler
                                </Label>
                            </div>
                            <Input
                                id="extracurricular"
                                name="extracurricular"
                                value={formData.extracurricular}
                                readOnly
                                className=""
                            />
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
                                className=""
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
                                className=""
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
                                className=""
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
