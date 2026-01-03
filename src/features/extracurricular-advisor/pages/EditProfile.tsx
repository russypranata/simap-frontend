"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
    ArrowLeft,
    IdCard,
    Flag,
} from "lucide-react";

// Mock data untuk Extracurricular Advisor
const mockProfileData = {
    name: "Ahmad Fauzi, S.Pd",
    email: "ahmad.fauzi@alfityan.sch.id",
    phone: "+62 812-3456-7890",
    role: "Tutor Ekstrakurikuler",
    profilePicture: "",
    address: "Jl. Pendidikan No. 123, Gowa, Sulawesi Selatan",
    nip: "198505152010011001",
    extracurricular: "Pramuka",
};

export const EditExtracurricularAdvisorProfile: React.FC = () => {
    const router = useRouter();
    const [formData, setFormData] = useState(mockProfileData);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            router.push("/extracurricular-advisor/profile");
        }, 1000);
    };

    const handleCancel = () => {
        router.back();
    };

    const initials = formData.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                    <div className="flex items-start gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.back()}
                            className="h-8 w-8 p-0 mt-1.5"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold tracking-tight">
                                    <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Edit </span>
                                    <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Profil</span>
                                </h1>
                                <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                                    <User className="h-5 w-5" />
                                </div>
                            </div>
                            <p className="text-muted-foreground mt-1">
                                Perbarui informasi profil dan data pribadi Anda
                            </p>

                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Form */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                            <User className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle>Informasi Profil</CardTitle>
                            <p className="text-sm text-muted-foreground mt-0.5 font-normal">Perbarui detail identitas dan kontak</p>
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
                                className="text-primary hover:text-primary"
                            >
                                <Camera className="h-4 w-4 mr-2" />
                                Ubah Foto Profil
                            </Button>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nama Lengkap */}
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="name" className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-primary" />
                                    Nama Lengkap
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Masukkan nama lengkap"
                                    required
                                />
                            </div>

                            {/* NIP */}
                            <div className="space-y-2">
                                <Label htmlFor="nip" className="flex items-center gap-2">
                                    <IdCard className="h-4 w-4 text-primary" />
                                    NIP
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="nip"
                                    name="nip"
                                    value={formData.nip}
                                    onChange={handleInputChange}
                                    placeholder="Masukkan NIP"
                                    required
                                    readOnly
                                />
                            </div>

                            {/* Ekstrakurikuler */}
                            <div className="space-y-2">
                                <Label htmlFor="extracurricular" className="flex items-center gap-2">
                                    <Flag className="h-4 w-4 text-primary" />
                                    Ekstrakurikuler
                                </Label>
                                <Input
                                    id="extracurricular"
                                    name="extracurricular"
                                    value={formData.extracurricular}
                                    readOnly
                                />
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-primary" />
                                    Email
                                    <span className="text-red-500">*</span>
                                </Label>
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
                                <Label htmlFor="phone" className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-primary" />
                                    Telepon
                                    <span className="text-red-500">*</span>
                                </Label>
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
                                <Label htmlFor="address" className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    Alamat
                                </Label>
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
                                onClick={handleCancel}
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

            {/* Info Card */}
            <Card className="bg-blue-50 border-blue-800/20">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-800/10 rounded-full">
                            <User className="h-5 w-5 text-blue-800" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-semibold text-blue-800">Informasi Penting</p>
                            <ul className="text-sm text-blue-900 space-y-1 list-disc list-inside">
                                <li>Pastikan informasi yang Anda masukkan benar dan akurat</li>
                                <li>NIP dan Ekstrakurikuler tidak dapat diubah</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
