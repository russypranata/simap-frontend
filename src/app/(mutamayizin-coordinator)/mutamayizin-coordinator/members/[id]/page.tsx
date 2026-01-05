"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Edit,
    ArrowLeft,
    Users,
    Award,
    Activity,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    ShieldCheck,
    ShieldAlert,
    GraduationCap,
    IdCard,
    History,
    Trophy,
    Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Detail Data
const mockMemberDetail = {
    id: 1,
    nis: "2023001",
    name: "Abdullah",
    class: "X A",
    email: "abdullah@student.sch.id",
    phone: "081234567890",
    address: "Jl. Merdeka No. 123, Pontianak",
    birthDate: "2008-05-15",
    gender: "Laki-laki",
    photo: null,
    status: "active",
    joinDate: "2023-07-15",
    ekstrakurikuler: [
        { name: "Pramuka", role: "Anggota", joinDate: "2023-07-15", attendance: 95 },
        { name: "Basket", role: "Anggota", joinDate: "2023-08-01", attendance: 85 }
    ],
    achievements: [
        { title: "Juara 1 Lomba Baris Berbaris", date: "2023-11-10", level: "Kota" }
    ],
    attendanceHistory: [
        { date: "2024-01-05", activity: "Latihan Rutin Pramuka", status: "hadir", time: "16:00" },
        { date: "2024-01-03", activity: "Latihan Fisik Basket", status: "sakit", time: "15:30" },
        { date: "2023-12-29", activity: "Persami", status: "hadir", time: "07:00" },
        { date: "2023-12-27", activity: "Technical Meeting Basket", status: "izin", time: "14:00" },
    ]
};

export default function MemberDetailPage() {
    const router = useRouter();
    const params = useParams();

    // Helper Functions
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "hadir": return <Badge className="bg-green-100 text-green-700 border-green-200 gap-1"><CheckCircle className="h-3 w-3" /> Hadir</Badge>;
            case "sakit": return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 gap-1"><AlertCircle className="h-3 w-3" /> Sakit</Badge>;
            case "izin": return <Badge className="bg-sky-100 text-sky-700 border-sky-200 gap-1"><Clock className="h-3 w-3" /> Izin</Badge>;
            case "alpa": return <Badge className="bg-red-100 text-red-700 border-red-200 gap-1"><XCircle className="h-3 w-3" /> Alpa</Badge>;
            default: return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header - Styled like Profile & Achievements */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-start gap-4">
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
                                <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Detail </span>
                                <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Anggota</span>
                            </h1>
                            <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                                <User className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="text-muted-foreground mt-1">
                            Informasi lengkap siswa <span className="font-semibold text-foreground">{mockMemberDetail.name}</span> pada Program Mutamayizin
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 gap-2">
                        <ShieldAlert className="h-4 w-4" />
                        Non-aktifkan
                    </Button>
                    <Button className="bg-blue-800 hover:bg-blue-900 text-white gap-2">
                        <Edit className="h-4 w-4" />
                        Edit Data
                    </Button>
                </div>
            </div>

            {/* Profile Card - Styled like Profile.tsx */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                <User className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle>Profil Siswa</CardTitle>
                                <p className="text-sm text-muted-foreground mt-0.5 font-normal">Informasi pribadi dan kontak siswa</p>
                            </div>
                        </div>
                        <Badge className={cn(
                            "gap-1",
                            mockMemberDetail.status === "active" ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-700 border-gray-200"
                        )}>
                            {mockMemberDetail.status === "active" ? <ShieldCheck className="h-3 w-3" /> : <ShieldAlert className="h-3 w-3" />}
                            {mockMemberDetail.status === "active" ? "Aktif" : "Non-aktif"}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {/* Profile Picture and Basic Info */}
                        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                            <div className="relative group">
                                <Avatar className="h-32 w-32 border-4 border-primary/10">
                                    <AvatarImage
                                        src={mockMemberDetail.photo || undefined}
                                        alt={mockMemberDetail.name}
                                    />
                                    <AvatarFallback className="text-3xl font-semibold bg-blue-800 text-white">
                                        {getInitials(mockMemberDetail.name)}
                                    </AvatarFallback>
                                </Avatar>
                            </div>

                            <div className="flex-1 text-center md:text-left space-y-2">
                                <h2 className="text-2xl font-bold text-foreground">
                                    {mockMemberDetail.name}
                                </h2>
                                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                    <Badge className="bg-blue-800 text-white">
                                        Kelas {mockMemberDetail.class}
                                    </Badge>
                                    <Badge variant="outline">
                                        {mockMemberDetail.gender}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    NIS: <span className="font-mono font-semibold text-foreground">{mockMemberDetail.nis}</span>
                                </p>
                            </div>
                        </div>

                        {/* Contact Information - Grid Style like Profile.tsx */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                <div className="p-2 rounded-full bg-primary/10">
                                    <Mail className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground">Email</p>
                                    <p className="text-sm font-medium truncate">
                                        {mockMemberDetail.email}
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
                                        {mockMemberDetail.phone}
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
                                        {mockMemberDetail.address}
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
                                        {new Date(mockMemberDetail.joinDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                <div className="p-2 rounded-full bg-primary/10">
                                    <Calendar className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground">Tanggal Lahir</p>
                                    <p className="text-sm font-medium">
                                        {new Date(mockMemberDetail.birthDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Statistics Card - Styled like Profile.tsx */}
            <Card>
                <CardContent className="px-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                            <Activity className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Statistik Siswa</h3>
                            <p className="text-sm text-muted-foreground">Ringkasan partisipasi dan keaktifan</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                            <div className="p-2 rounded-full bg-blue-100">
                                <Users className="h-5 w-5 text-blue-800" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground">Total Ekskul</p>
                                <p className="text-lg font-semibold text-blue-800">
                                    {mockMemberDetail.ekstrakurikuler.length}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                            <div className="p-2 rounded-full bg-green-100">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground">Rata-rata Kehadiran</p>
                                <p className="text-lg font-semibold text-green-600">
                                    {Math.round(mockMemberDetail.ekstrakurikuler.reduce((acc, e) => acc + e.attendance, 0) / mockMemberDetail.ekstrakurikuler.length)}%
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                            <div className="p-2 rounded-full bg-yellow-100">
                                <Award className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground">Total Prestasi</p>
                                <p className="text-lg font-semibold">
                                    {mockMemberDetail.achievements.length}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                            <div className="p-2 rounded-full bg-purple-100">
                                <Star className="h-5 w-5 text-purple-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground">Status</p>
                                <p className="text-lg font-semibold text-green-600">
                                    Aktif
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs Section */}
            <Tabs defaultValue="ekskul" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1">
                    <TabsTrigger value="ekskul" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Ekstrakurikuler</TabsTrigger>
                    <TabsTrigger value="history" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Riwayat Presensi</TabsTrigger>
                    <TabsTrigger value="achievements" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Prestasi</TabsTrigger>
                </TabsList>

                {/* TAB 1: Ekstrakurikuler */}
                <TabsContent value="ekskul" className="mt-6">
                    <Card>
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                    <Users className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle>Ekstrakurikuler yang Diikuti</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-0.5 font-normal">Daftar aktivitas ekstrakurikuler siswa</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {mockMemberDetail.ekstrakurikuler.map((ekskul, idx) => (
                                <div key={idx} className="flex items-center space-x-4 p-4 rounded-lg bg-muted/30">
                                    <div className="p-3 rounded-full bg-blue-100 flex-shrink-0">
                                        <Users className="h-6 w-6 text-blue-800" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-semibold text-foreground">{ekskul.name}</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {ekskul.role} • Sejak {new Date(ekskul.joinDate).getFullYear()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-muted-foreground">Kehadiran</p>
                                                <p className={cn(
                                                    "text-lg font-bold",
                                                    ekskul.attendance >= 90 ? "text-green-600" :
                                                        ekskul.attendance >= 75 ? "text-blue-600" : "text-amber-600"
                                                )}>{ekskul.attendance}%</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TAB 2: Riwayat Presensi */}
                <TabsContent value="history" className="mt-6">
                    <Card>
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                    <History className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle>Riwayat Kehadiran</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-0.5 font-normal">Aktivitas kehadiran pertemuan terakhir</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <table className="w-full">
                                <thead className="bg-muted/50 text-xs text-muted-foreground uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4 text-left font-medium">Tanggal</th>
                                        <th className="p-4 text-left font-medium">Kegiatan</th>
                                        <th className="p-4 text-left font-medium">Waktu</th>
                                        <th className="p-4 text-center font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {mockMemberDetail.attendanceHistory.map((item, i) => (
                                        <tr key={i} className="hover:bg-muted/30 transition-colors">
                                            <td className="p-4 text-sm font-medium">
                                                {new Date(item.date).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="p-4 text-sm">
                                                {item.activity}
                                            </td>
                                            <td className="p-4 text-sm text-muted-foreground font-mono">
                                                {item.time} WIB
                                            </td>
                                            <td className="p-4 text-center">
                                                {getStatusBadge(item.status)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TAB 3: Prestasi */}
                <TabsContent value="achievements" className="mt-6">
                    <Card>
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                    <Trophy className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle>Daftar Prestasi</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-0.5 font-normal">Pencapaian siswa selama mengikuti ekskul</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {mockMemberDetail.achievements.length > 0 ? (
                                <div className="space-y-4">
                                    {mockMemberDetail.achievements.map((achievement, idx) => (
                                        <div key={idx} className="flex items-center space-x-4 p-4 rounded-lg bg-muted/30">
                                            <div className="p-3 rounded-full bg-amber-100 flex-shrink-0">
                                                <Trophy className="h-6 w-6 text-amber-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-foreground">{achievement.title}</h4>
                                                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                                    <Badge variant="outline" className="text-xs border-amber-200 text-amber-700 bg-amber-50">
                                                        Tingkat {achievement.level}
                                                    </Badge>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(achievement.date).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                                    <Award className="h-10 w-10 mx-auto mb-2 opacity-50" />
                                    <p>Belum ada data prestasi tercatat</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
