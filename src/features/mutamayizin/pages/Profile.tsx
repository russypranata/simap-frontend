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
    Edit,
    Camera,
    Users,
    Award,
    Activity,
    Star,
    BarChart3,
    CheckCircle2,
    Briefcase,
    Building2,
} from "lucide-react";
import { useMutamayizinProfile } from "../hooks/useMutamayizinProfile";
import { useMutamayizinDashboard } from "../hooks/useMutamayizinDashboard";
import { ErrorState } from "@/features/shared/components/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";

const ProfileSkeleton: React.FC = () => (
    <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="space-y-2">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-4 w-64" />
            </div>
        </div>
        <Card>
            <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                    <Skeleton className="h-32 w-32 rounded-full" />
                    <div className="flex-1 space-y-3">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-40" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-16 rounded-lg" />
                    ))}
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-16 rounded-lg" />
                    ))}
                </div>
            </CardContent>
        </Card>
    </div>
);

export const MutamayizinProfile: React.FC = () => {
    const router = useRouter();
    const { data: profileData, isLoading: profileLoading, error: profileError, refetch: refetchProfile } = useMutamayizinProfile();
    const { stats, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useMutamayizinDashboard();

    const isLoading = profileLoading || statsLoading;
    const error = profileError || statsError;

    const handleEditProfile = () => {
        router.push("/mutamayizin-coordinator/profile/edit");
    };

    if (isLoading) return <ProfileSkeleton />;

    if (error) {
        return (
            <ErrorState
                error={(error as Error).message || "Gagal memuat data profil"}
                onRetry={() => { refetchProfile(); refetchStats(); }}
            />
        );
    }

    if (!profileData) return null;

    const initials = profileData.name
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
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Profil </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Saya</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <User className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Kelola informasi profil dan pengaturan akun Anda
                    </p>
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
                                <CardTitle className="text-lg">Profil Saya</CardTitle>
                                <p className="text-sm text-muted-foreground mt-0.5 font-normal">Kelola informasi pribadi dan akun Anda</p>
                            </div>
                        </div>
                        <Button
                            onClick={handleEditProfile}
                            size="sm"
                            className="flex items-center space-x-2 bg-blue-800 hover:bg-blue-900 text-white"
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
                                        src={profileData.avatar ?? undefined}
                                        alt={profileData.name}
                                    />
                                    <AvatarFallback className="text-3xl font-semibold bg-blue-800 text-white">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                                    <Camera className="h-8 w-8 text-white" />
                                </div>
                            </div>

                            <div className="flex-1 text-center md:text-left space-y-2">
                                <h2 className="text-2xl font-bold text-foreground">
                                    {profileData.name}
                                </h2>
                                <div className="space-y-2 mt-1">
                                    <div className="flex items-center justify-center md:justify-start gap-2">
                                        <Badge className="bg-blue-800 text-white">
                                            PJ Mutamayizin
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-center md:justify-start gap-2">
                                        <span className="text-xs text-muted-foreground font-medium">Status Akun:</span>
                                        <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 pl-2 pr-3 py-1">
                                            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                                            Aktif
                                        </Badge>
                                    </div>
                                </div>
                                {profileData.jobTitle && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {profileData.jobTitle}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-4 pt-6 border-t mt-2">
                            <h3 className="text-base font-medium text-foreground flex items-center gap-2">
                                <Phone className="h-4.5 w-4.5 text-primary" />
                                Informasi Kontak
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <Mail className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-muted-foreground">Email</p>
                                        <p className="text-sm font-medium truncate">
                                            {profileData.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <Phone className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Telepon</p>
                                        {profileData.phone ? (
                                            <p className="text-sm font-medium">{profileData.phone}</p>
                                        ) : (
                                            <p className="text-sm text-muted-foreground italic">Tidak ada isi</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 md:col-span-2">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <MapPin className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Alamat</p>
                                        {profileData.address ? (
                                            <p className="text-sm font-medium">{profileData.address}</p>
                                        ) : (
                                            <p className="text-sm text-muted-foreground italic">Tidak ada isi</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <Building2 className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Departemen</p>
                                        {profileData.department ? (
                                            <p className="text-sm font-medium">{profileData.department}</p>
                                        ) : (
                                            <p className="text-sm text-muted-foreground italic">Tidak ada isi</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <Briefcase className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Jabatan</p>
                                        {profileData.jobTitle ? (
                                            <p className="text-sm font-medium">{profileData.jobTitle}</p>
                                        ) : (
                                            <p className="text-sm text-muted-foreground italic">Tidak ada isi</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Program Statistics */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                            <BarChart3 className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Statistik Program Mutamayizin</CardTitle>
                            <p className="text-sm text-muted-foreground mt-0.5 font-normal">Ringkasan performa dan partisipasi siswa</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                            <div className="p-2 rounded-full bg-blue-100">
                                <Users className="h-5 w-5 text-blue-800" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground">Total Siswa</p>
                                <p className="text-lg font-semibold text-blue-800">
                                    {stats?.totalStudents ?? 0}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                            <div className="p-2 rounded-full bg-green-100">
                                <Activity className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground">Siswa Aktif</p>
                                <p className="text-lg font-semibold">
                                    {stats?.activeStudents ?? 0}
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
                                    {stats?.totalAchievements ?? 0}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                            <div className="p-2 rounded-full bg-purple-100">
                                <Star className="h-5 w-5 text-purple-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground">Ekstrakurikuler</p>
                                <p className="text-lg font-semibold">
                                    {stats?.totalEkskul ?? 0}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
