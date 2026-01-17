'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    User,
    Mail,
    Phone,
    Calendar,
    Edit,
    Shield,
    CheckCircle2,
    AtSign,
    Building2,
    Megaphone,
    Users,
    FileText,
} from 'lucide-react';

import { AdminProfileData } from '../data/mockAdminData';
import { getAdminProfile } from '../services/adminProfileService';

// Skeleton component for loading state
const ProfileSkeleton = () => (
    <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-muted rounded w-1/3" />
        <Card>
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-32 h-40 bg-muted rounded-xl" />
                    <div className="flex-1 space-y-3">
                        <div className="h-6 bg-muted rounded w-1/2" />
                        <div className="h-4 bg-muted rounded w-1/3" />
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
);

export const AdminProfile: React.FC = () => {
    const router = useRouter();
    const [profileData, setProfileData] = useState<AdminProfileData | null>(null);
    const [loading, setLoading] = useState(true);

    // Mock stats for admin profile
    const [stats] = useState({
        announcementsCreated: 24,
        usersManaged: 156,
        reportsGenerated: 18,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profile = await getAdminProfile();
                setProfileData(profile);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading || !profileData) {
        return <ProfileSkeleton />;
    }

    const initials = profileData.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-linear-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Profil{' '}
                            </span>
                            <span className="bg-linear-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Admin
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <User className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Lihat dan kelola informasi profil administrator Anda
                    </p>
                    <div className="flex items-center gap-3 mt-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm font-semibold">
                                Tahun Ajaran 2025/2026
                            </span>
                        </div>
                        <div className="h-4 w-px bg-border" />
                        <span className="text-sm font-medium text-blue-800">
                            Semester Ganjil
                        </span>
                    </div>
                </div>
            </div>

            {/* Profile Card */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <User className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">
                                    Data Diri
                                </CardTitle>
                                <p className="text-sm text-muted-foreground mt-0.5 font-normal">
                                    Informasi lengkap administrator
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-700 border-green-200 pl-2 pr-3 py-1 hidden sm:flex"
                            >
                                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                                Aktif
                            </Badge>
                            <Button
                                onClick={() => router.push('/admin/profile/edit')}
                                size="sm"
                                className="flex items-center space-x-2 bg-blue-800 hover:bg-blue-900 text-white"
                            >
                                <Edit className="h-4 w-4" />
                                <span>Edit Profil</span>
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {/* Profile Picture and Basic Info */}
                        <div className="flex flex-col md:flex-row items-center md:items-center space-y-4 md:space-y-0 md:space-x-6">
                            <div className="relative group">
                                <Avatar className="w-32 h-auto aspect-3/4 rounded-xl border-4 border-primary/10">
                                    <AvatarImage
                                        src={profileData.profilePicture}
                                        alt={profileData.name}
                                        className="object-cover"
                                    />
                                    <AvatarFallback className="text-3xl font-semibold bg-blue-800 text-white rounded-xl">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                            </div>

                            <div className="flex-1 text-center md:text-left space-y-2">
                                <h2 className="text-2xl font-bold text-foreground">
                                    {profileData.name}
                                </h2>
                                <div className="space-y-2 mt-1">
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                                        <Badge className="bg-blue-800 text-white pl-2 pr-3 py-1">
                                            <Shield className="h-3.5 w-3.5 mr-1.5" />
                                            {profileData.role}
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className="border-blue-200 text-blue-800 bg-blue-50 pl-2 pr-3 py-1"
                                        >
                                            <Building2 className="h-3.5 w-3.5 mr-1.5" />
                                            {profileData.department}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="text-base font-medium text-foreground flex items-center gap-2">
                                <Shield className="h-4.5 w-4.5 text-primary" />
                                Informasi Pribadi
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <AtSign className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">
                                            Username
                                        </p>
                                        <p className="text-sm font-medium">
                                            {profileData.username}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <Mail className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-muted-foreground">
                                            Email
                                        </p>
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
                                        <p className="text-xs text-muted-foreground">
                                            Telepon
                                        </p>
                                        <p className="text-sm font-medium">
                                            {profileData.phone}
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
                                            {profileData.joinDate}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="gap-0">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <FileText className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">
                                Statistik Aktivitas
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-0.5 font-normal">
                                Ringkasan aktivitas Anda sebagai administrator
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                            <div className="p-2 rounded-full bg-blue-100">
                                <Megaphone className="h-5 w-5 text-blue-800" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground">
                                    Pengumuman Dibuat
                                </p>
                                <p className="text-lg font-semibold text-blue-800">
                                    {stats.announcementsCreated}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                            <div className="p-2 rounded-full bg-green-100">
                                <Users className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground">
                                    Pengguna Dikelola
                                </p>
                                <p className="text-lg font-semibold">
                                    {stats.usersManaged}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                            <div className="p-2 rounded-full bg-purple-100">
                                <FileText className="h-5 w-5 text-purple-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground">
                                    Laporan Dibuat
                                </p>
                                <p className="text-lg font-semibold">
                                    {stats.reportsGenerated}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
