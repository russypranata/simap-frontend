"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
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
    ShieldCheck,
    ShieldAlert,
    History,
    Trophy,
    Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getMember } from "@/features/mutamayizin/services/mutamayizinService";

interface MemberDetail {
    id: number;
    nis: string;
    name: string;
    class: string;
    email: string;
    phone: string;
    ekstrakurikuler: Array<{ id: number; name: string }>;
    status: "active" | "inactive";
    photo: string | null;
    joinDate: string;
    academicYears: Array<{ id: number; name: string; joinDate: string }>;
}

export default function MemberDetailPage() {
    const router = useRouter();
    const params = useParams();
    const memberId = params.id as string;

    const { data: member, isLoading, error } = useQuery<MemberDetail>({
        queryKey: ["mutamayizin-member", memberId],
        queryFn: () => getMember(Number(memberId)),
        enabled: !!memberId,
    });

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-800" />
            </div>
        );
    }

    if (error || !member) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground mb-4">Gagal memuat data anggota</p>
                <Button onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Kembali
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
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
                            Informasi lengkap siswa <span className="font-semibold text-foreground">{member.name}</span> pada Program Mutamayizin
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

            {/* Profile Card */}
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
                            member.status === "active" ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-700 border-gray-200"
                        )}>
                            {member.status === "active" ? <ShieldCheck className="h-3 w-3" /> : <ShieldAlert className="h-3 w-3" />}
                            {member.status === "active" ? "Aktif" : "Non-aktif"}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                            <div className="relative group">
                                <Avatar className="h-32 w-32 border-4 border-primary/10">
                                    <AvatarImage
                                        src={member.photo || undefined}
                                        alt={member.name}
                                    />
                                    <AvatarFallback className="text-3xl font-semibold bg-blue-800 text-white">
                                        {getInitials(member.name)}
                                    </AvatarFallback>
                                </Avatar>
                            </div>

                            <div className="flex-1 text-center md:text-left space-y-2">
                                <h2 className="text-2xl font-bold text-foreground">
                                    {member.name}
                                </h2>
                                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                    <Badge className="bg-blue-800 text-white">
                                        Kelas {member.class}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    NIS: <span className="font-mono font-semibold text-foreground">{member.nis}</span>
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                <div className="p-2 rounded-full bg-primary/10">
                                    <Mail className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground">Email</p>
                                    <p className="text-sm font-medium truncate">
                                        {member.email || "-"}
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
                                        {member.phone || "-"}
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
                                        {member.joinDate ? new Date(member.joinDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' }) : "-"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Statistics Card */}
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
                                    {member.ekstrakurikuler?.length || 0}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-100">
                            <div className="p-2 rounded-full bg-green-200">
                                <ShieldCheck className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground">Status</p>
                                <p className="text-lg font-semibold text-green-600">
                                    {member.status === "active" ? "Aktif" : "Non-aktif"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-yellow-100">
                            <div className="p-2 rounded-full bg-yellow-200">
                                <Award className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground">Tahun Ajaran</p>
                                <p className="text-lg font-semibold">
                                    {member.academicYears?.length || 0}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-purple-100">
                            <div className="p-2 rounded-full bg-purple-200">
                                <Star className="h-5 w-5 text-purple-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground">Prestasi</p>
                                <p className="text-lg font-semibold text-purple-600">-</p>
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
                            {member.ekstrakurikuler && member.ekstrakurikuler.length > 0 ? (
                                member.ekstrakurikuler.map((ekskul, idx) => (
                                    <div key={idx} className="flex items-center space-x-4 p-4 rounded-lg bg-muted/30">
                                        <div className="p-3 rounded-full bg-blue-100 flex-shrink-0">
                                            <Users className="h-6 w-6 text-blue-800" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-foreground">{ekskul.name}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Anggota
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Users className="h-10 w-10 mx-auto mb-2 opacity-50" />
                                    <p>Tidak ada data ekstrakurikuler</p>
                                </div>
                            )}
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
                        <CardContent>
                            <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                                <History className="h-10 w-10 mx-auto mb-2 opacity-50" />
                                <p>Riwayat presensi tidak tersedia untuk saat ini</p>
                            </div>
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
                            <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                                <Award className="h-10 w-10 mx-auto mb-2 opacity-50" />
                                <p>Belum ada data prestasi tercatat</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
