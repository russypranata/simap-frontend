"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Edit,
    Camera,
    Users,
    Award,
    Activity,
    Star,
} from "lucide-react";

// Mock data untuk Extracurricular Advisor
const mockProfileData = {
    name: "Budi Santoso, S.Pd",
    email: "budi.santoso@alfityan.sch.id",
    phone: "+62 812-3456-7890",
    role: "Pembina Ekstrakurikuler",
    profilePicture: "",
    address: "Jl. Pendidikan No. 123, Gowa, Sulawesi Selatan",
    joinDate: "15 Juli 2020",
    nip: "198505152010011001",
    extracurricular: "Paskibra",
    totalMembers: 45,
    activeMembers: 42,
    achievements: 12,
    attendanceRate: 92,
};

export const ExtracurricularAdvisorProfile: React.FC = () => {
    const router = useRouter();

    const handleEditProfile = () => {
        router.push("/extracurricular-advisor/profile/edit");
    };

    const initials = mockProfileData.name
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
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">
                        Profil <span className="text-primary">Saya</span>
                    </h1>
                    <p className="text-muted-foreground">
                        Kelola informasi profil dan pengaturan akun Anda
                    </p>
                    <div className="flex items-center gap-3 mt-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm font-semibold">
                                Tahun Ajaran 2025/2026
                            </span>
                        </div>
                        <div className="h-4 w-[1px] bg-border" />
                        <span className="text-muted-foreground text-sm font-medium text-primary">
                            Semester Ganjil
                        </span>
                    </div>
                </div>
            </div>

            {/* Profile Card */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle>Profil Saya</CardTitle>
                        <Button
                            onClick={handleEditProfile}
                            size="sm"
                            className="flex items-center space-x-2"
                        >
                            <Edit className="h-4 w-4" />
                            <span>Edit Profil</span>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {/* Profile Picture and Basic Info */}
                        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                            <div className="relative group">
                                <Avatar className="h-32 w-32 border-4 border-primary/10">
                                    <AvatarImage
                                        src={mockProfileData.profilePicture}
                                        alt={mockProfileData.name}
                                    />
                                    <AvatarFallback className="text-3xl font-semibold bg-primary text-primary-foreground">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                                    <Camera className="h-8 w-8 text-white" />
                                </div>
                            </div>

                            <div className="flex-1 text-center md:text-left space-y-2">
                                <h2 className="text-2xl font-bold text-foreground">
                                    {mockProfileData.name}
                                </h2>
                                <Badge className="bg-primary text-primary-foreground">
                                    {mockProfileData.role}
                                </Badge>
                                <p className="text-sm text-muted-foreground">
                                    NIP: {mockProfileData.nip}
                                </p>
                                <p className="text-sm font-medium text-primary">
                                    Ekstrakurikuler: {mockProfileData.extracurricular}
                                </p>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                <div className="p-2 rounded-full bg-primary/10">
                                    <Mail className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground">Email</p>
                                    <p className="text-sm font-medium truncate">
                                        {mockProfileData.email}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                <div className="p-2 rounded-full bg-primary/10">
                                    <Phone className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground">Telepon</p>
                                    <p className="text-sm font-medium">
                                        {mockProfileData.phone}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 md:col-span-2">
                                <div className="p-2 rounded-full bg-primary/10">
                                    <MapPin className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground">Alamat</p>
                                    <p className="text-sm font-medium">
                                        {mockProfileData.address}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                <div className="p-2 rounded-full bg-primary/10">
                                    <Calendar className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground">
                                        Bergabung Sejak
                                    </p>
                                    <p className="text-sm font-medium">
                                        {mockProfileData.joinDate}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                <div className="p-2 rounded-full bg-primary/10">
                                    <User className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground">Status</p>
                                    <p className="text-sm font-medium text-green-600">Aktif</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Extracurricular Statistics */}
            <Card>
                <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Statistik Ekstrakurikuler</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                            <div className="p-2 rounded-full bg-blue-100">
                                <Users className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground">Total Anggota</p>
                                <p className="text-lg font-semibold">
                                    {mockProfileData.totalMembers}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                            <div className="p-2 rounded-full bg-green-100">
                                <Activity className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground">Anggota Aktif</p>
                                <p className="text-lg font-semibold">
                                    {mockProfileData.activeMembers}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                            <div className="p-2 rounded-full bg-yellow-100">
                                <Award className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground">Prestasi</p>
                                <p className="text-lg font-semibold">
                                    {mockProfileData.achievements}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                            <div className="p-2 rounded-full bg-purple-100">
                                <Star className="h-5 w-5 text-purple-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground">Tingkat Kehadiran</p>
                                <p className="text-lg font-semibold">
                                    {mockProfileData.attendanceRate}%
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
