"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Edit,
    CheckCircle2,
    Users,
    AtSign,
    Briefcase,
} from 'lucide-react';

import { ParentProfileData } from '../data/mockParentData';
import { getParentProfile } from '../services/parentProfileService';
import { ProfileSkeleton } from '../components/profile/ProfileSkeleton';
import { toast } from 'sonner';

export const ParentProfile: React.FC = () => {
    const router = useRouter();
    const [profileData, setProfileData] = useState<ParentProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getParentProfile();
                setProfileData(data);
            } catch (error) {
                console.error('Failed to fetch profile:', error);
                toast.error('Gagal memuat data profil');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (isLoading) {
        return <ProfileSkeleton />;
    }

    if (!profileData) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
                <div className="p-4 bg-red-50 text-red-600 rounded-full">
                    <User className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-foreground">Gagal Memuat Profil</h2>
                    <p className="text-muted-foreground text-sm max-w-sm">
                        Terjadi kesalahan saat mengambil data profil Anda. Silakan muat ulang halaman atau coba lagi nanti.
                    </p>
                </div>
                <Button variant="outline" onClick={() => window.location.reload()}>
                    Muat Ulang
                </Button>
            </div>
        );
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
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Profil{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Saya
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <User className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Informasi data diri dan kontak Anda
                    </p>
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
                                    Informasi akun orang tua
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
                                onClick={() =>
                                    router.push('/parent/profile/edit')
                                }
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
                            <div className="relative">
                                <Avatar className="w-32 h-32 rounded-full border-4 border-primary/10">
                                    <AvatarFallback className="text-3xl font-semibold bg-blue-800 text-white rounded-full">
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
                                            <Users className="h-3.5 w-3.5 mr-1.5" />
                                            Orang Tua / Wali
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className="border-blue-200 text-blue-800 bg-blue-50 pl-2 pr-3 py-1"
                                        >
                                            <Briefcase className="h-3.5 w-3.5 mr-1.5" />
                                            {profileData.occupation}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="text-base font-medium text-foreground flex items-center gap-2">
                                <User className="h-4.5 w-4.5 text-primary" />
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
                                        <Calendar className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">
                                            Bergabung Sejak
                                        </p>
                                        <p className="text-sm font-medium">
                                            {new Date(profileData.joinDate).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric"
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-4 pt-6 border-t">
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
                                        <p className="text-sm font-medium font-mono">
                                            {profileData.phone}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 md:col-span-2">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <MapPin className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">
                                            Alamat
                                        </p>
                                        <p className="text-sm font-medium">
                                            {profileData.address}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Children */}
                         <div className="space-y-4 pt-6 border-t">
                            <h3 className="text-base font-medium text-foreground flex items-center gap-2">
                                <Users className="h-4.5 w-4.5 text-primary" />
                                Data Anak
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {profileData.children.map((child) => (
                                     <div key={child.id} className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50/50 border border-blue-100">
                                        <div className="p-2 rounded-full bg-blue-100 text-blue-700">
                                            <User className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-slate-900">{child.name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge className="text-xs bg-white text-blue-800 hover:bg-white border-transparent">
                                                    {child.class}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">NIS: <span className="font-mono">{child.nis}</span></span>
                                            </div>
                                        </div>
                                     </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
