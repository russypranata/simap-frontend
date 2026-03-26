"use client";

import React from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    GraduationCap,
    User,
    Users,
    Trophy,
} from "lucide-react";

// Mock data
const mockChildProfile = {
    name: "Ahmad Fauzan Ramadhan",
    nis: "0012345678",
    nisn: "0098765432",
    class: "XII IPA 1",
    gender: "Laki-laki",
    birthPlace: "Tangerang",
    birthDate: "2007-05-15",
    religion: "Islam",
    address: "Jl. Merdeka No. 10, RT 05/RW 02, Kel. Sukamaju, Kec. Cikupa, Kab. Tangerang",
    phone: "08123456789",
    email: "ahmad.fauzan@student.sman1.sch.id",
    avatar: "",
    waliKelas: "Pak Hendra Wijaya, S.Pd",
    entryYear: "2023",
    status: "Aktif",
};

const mockStats = {
    averageScore: 85.2,
    rank: 5,
    totalStudents: 32,
    attendanceRate: 96,
    ekstrakurikuler: ["Pramuka", "Basket"],
};

const mockParentInfo = {
    fatherName: "Budi Santoso",
    fatherPhone: "081234567890",
    fatherJob: "Pegawai Swasta",
    motherName: "Siti Aminah",
    motherPhone: "081234567891",
    motherJob: "Ibu Rumah Tangga",
};

export const ChildProfile: React.FC = () => {
    const getInitials = (name: string) => {
        return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Profil </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Anak</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <User className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Informasi lengkap data anak Anda
                    </p>
                </div>
            </div>

            {/* Profile Card */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        {/* Avatar */}
                        <Avatar className="h-24 w-24 border-4 border-blue-100">
                            <AvatarImage src={mockChildProfile.avatar} alt={mockChildProfile.name} />
                            <AvatarFallback className="bg-blue-100 text-blue-800 text-2xl font-bold">
                                {getInitials(mockChildProfile.name)}
                            </AvatarFallback>
                        </Avatar>

                        {/* Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-2xl font-bold">{mockChildProfile.name}</h2>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
                                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                    <GraduationCap className="h-3.5 w-3.5 mr-1" />
                                    {mockChildProfile.class}
                                </Badge>
                                <Badge className="bg-green-100 text-green-700 border-green-200">
                                    {mockChildProfile.status}
                                </Badge>
                            </div>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3 text-sm text-muted-foreground">
                                <span>NIS: <span className="tabular-nums font-medium">{mockChildProfile.nis}</span></span>
                                <span>NISN: <span className="tabular-nums font-medium">{mockChildProfile.nisn}</span></span>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <p className="text-xl font-bold text-blue-800 tabular-nums">{mockStats.averageScore}</p>
                                <p className="text-xs text-muted-foreground">Rata-rata</p>
                            </div>
                            <div className="p-3 bg-amber-50 rounded-lg">
                                <p className="text-xl font-bold text-amber-600 tabular-nums">#{mockStats.rank}</p>
                                <p className="text-xs text-muted-foreground">Peringkat</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg">
                                <p className="text-xl font-bold text-green-600 tabular-nums">{mockStats.attendanceRate}%</p>
                                <p className="text-xs text-muted-foreground">Kehadiran</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Info */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <User className="h-5 w-5 text-primary" />
                            </div>
                            <CardTitle className="text-lg">Data Pribadi</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Jenis Kelamin</p>
                                    <p className="font-medium">{mockChildProfile.gender}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Agama</p>
                                    <p className="font-medium">{mockChildProfile.religion}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Tempat, Tanggal Lahir</p>
                                <p className="font-medium">
                                    {mockChildProfile.birthPlace}, {new Date(mockChildProfile.birthDate).toLocaleDateString("id-ID", {
                                        day: "numeric", month: "long", year: "numeric"
                                    })}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Alamat</p>
                                <p className="font-medium">{mockChildProfile.address}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Telepon</p>
                                    <p className="tabular-nums font-medium">{mockChildProfile.phone}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-medium text-sm">{mockChildProfile.email}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Academic Info */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <GraduationCap className="h-5 w-5 text-primary" />
                            </div>
                            <CardTitle className="text-lg">Data Akademik</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Kelas</p>
                                    <p className="font-medium">{mockChildProfile.class}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Tahun Masuk</p>
                                    <p className="font-medium">{mockChildProfile.entryYear}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Wali Kelas</p>
                                <p className="font-medium">{mockChildProfile.waliKelas}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Ekstrakurikuler</p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {mockStats.ekstrakurikuler.map((ekskul) => (
                                        <Badge key={ekskul} variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                            <Trophy className="h-3 w-3 mr-1" />
                                            {ekskul}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Peringkat di Kelas</span>
                                    <span className="font-bold text-blue-800">#{mockStats.rank} dari {mockStats.totalStudents}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Parent Info */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Users className="h-5 w-5 text-primary" />
                            </div>
                            <CardTitle className="text-lg">Data Orang Tua/Wali</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Father */}
                            <div className="p-4 bg-muted/30 rounded-lg">
                                <h4 className="font-semibold mb-3">Ayah</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Nama</span>
                                        <span className="font-medium">{mockParentInfo.fatherName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Pekerjaan</span>
                                        <span className="font-medium">{mockParentInfo.fatherJob}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Telepon</span>
                                        <span className="tabular-nums font-medium">{mockParentInfo.fatherPhone}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Mother */}
                            <div className="p-4 bg-muted/30 rounded-lg">
                                <h4 className="font-semibold mb-3">Ibu</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Nama</span>
                                        <span className="font-medium">{mockParentInfo.motherName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Pekerjaan</span>
                                        <span className="font-medium">{mockParentInfo.motherJob}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Telepon</span>
                                        <span className="tabular-nums font-medium">{mockParentInfo.motherPhone}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
