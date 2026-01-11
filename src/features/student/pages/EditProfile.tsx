"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
    GraduationCap,
} from "lucide-react";
import { toast } from "sonner";

// Mock student data
interface StudentProfile {
    name: string;
    nis: string;
    email: string;
    phone: string;
    address: string;
    birthDate: string;
    birthPlace: string;
    class: string;
    avatar?: string;
}

const mockProfile: StudentProfile = {
    name: "Ahmad Fauzan Ramadhan",
    nis: "0012345678",
    email: "ahmad.fauzan@student.sman1.sch.id",
    phone: "08123456789",
    address: "Jl. Merdeka No. 10, RT 05/RW 02, Kel. Sukamaju, Kec. Cikupa",
    birthDate: "2007-05-15",
    birthPlace: "Tangerang",
    class: "XII IPA 1",
    avatar: "",
};

export const EditStudentProfile: React.FC = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<StudentProfile>(mockProfile);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsLoading(false);
        toast.success("Profil berhasil diperbarui!");
        router.push("/student/profile");
    };

    const handleCancel = () => {
        router.push("/student/profile");
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
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setFormData((prev) => ({ ...prev, avatar: imageUrl }));
            toast.success("Foto profil berhasil dipilih");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCancel}
                    className="h-9 w-9"
                >
                    <ArrowLeft className="h-5 w-5" />
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
                        Perbarui informasi profil Anda
                    </p>
                </div>
            </div>

            {/* Main Card */}
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
                <CardContent className="space-y-6">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center space-y-4 pb-6 border-b">
                        <div className="relative group">
                            <Avatar className="h-32 w-32 border-4 border-primary/10">
                                <AvatarImage src={formData.avatar} alt={formData.name} className="object-cover" />
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
                            className="text-primary hover:text-primary"
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
                            />
                        </div>

                        {/* NIS & Kelas (Read Only) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="nis" className="flex items-center gap-2">
                                    <IdCard className="h-4 w-4 text-primary" />
                                    NIS
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="nis"
                                    name="nis"
                                    value={formData.nis}
                                    disabled
                                    className="bg-muted"
                                />
                                <p className="text-xs text-muted-foreground">NIS tidak dapat diubah</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="class" className="flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4 text-primary" />
                                    Kelas
                                </Label>
                                <Input
                                    id="class"
                                    name="class"
                                    value={formData.class}
                                    disabled
                                    className="bg-muted"
                                />
                                <p className="text-xs text-muted-foreground">Kelas tidak dapat diubah</p>
                            </div>
                        </div>

                        {/* Email & Telepon */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    placeholder="email@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-primary" />
                                    Nomor Telepon
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="08xxxxxxxxxx"
                                />
                            </div>
                        </div>

                        {/* Tempat & Tanggal Lahir */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="birthPlace" className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    Tempat Lahir
                                </Label>
                                <Input
                                    id="birthPlace"
                                    name="birthPlace"
                                    value={formData.birthPlace}
                                    onChange={handleInputChange}
                                    placeholder="Kota tempat lahir"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="birthDate" className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    Tanggal Lahir
                                </Label>
                                <Input
                                    id="birthDate"
                                    name="birthDate"
                                    type="date"
                                    value={formData.birthDate}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {/* Alamat */}
                        <div className="space-y-2">
                            <Label htmlFor="address" className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary" />
                                Alamat Lengkap
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
                                <li>NIS dan Kelas tidak dapat diubah</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
