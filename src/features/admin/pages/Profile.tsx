'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
} from '@/components/ui/dialog';
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
    Camera,
} from 'lucide-react';

import { AdminProfileData } from '../services/adminProfileService';
import { 
    getAdminProfile,
} from '../services/adminProfileService';
import { 
    AdminPhotoRequirementsModal,
    AdminProfileSkeleton 
} from '@/features/admin/components/profile';

export const AdminProfile: React.FC = () => {
    const router = useRouter();
    const [profileData, setProfileData] = useState<AdminProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isPhotoOpen, setIsPhotoOpen] = useState(false);
    const [isReqModalOpen, setIsReqModalOpen] = useState(false);
    const [uploading] = useState(false);

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

    const handleAvatarClick = () => {
        if (profileData?.profilePicture) {
            setIsPhotoOpen(true);
        }
    };

    if (loading || !profileData) {
        return <AdminProfileSkeleton />;
    }

    const initials = profileData.name
        .split(' ')
        .map((n: string) => n[0])
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
                                Saya
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                            <Shield className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Informasi lengkap akun administrator Anda
                    </p>
                    <div className="flex items-center gap-3 mt-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm font-semibold">Tahun Ajaran 2025/2026</span>
                        </div>
                        <div className="h-4 w-px bg-border" />
                        <span className="text-sm font-medium text-blue-800">Semester Ganjil</span>
                    </div>
                </div>
            </div>

            {/* Profile Card */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                                <User className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Data Diri</CardTitle>
                                <p className="text-sm text-muted-foreground mt-0.5 font-normal">Informasi lengkap administrator</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 pl-2 pr-3 py-1 hidden sm:flex">
                                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Aktif
                            </Badge>
                            <Button onClick={() => router.push('/admin/profile/edit')} size="sm" className="flex items-center space-x-2 bg-blue-800 hover:bg-blue-900 text-white">
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
                            <div 
                                onClick={handleAvatarClick}
                                className={`relative group ${profileData.profilePicture ? 'cursor-pointer' : 'cursor-default'}`}
                            >
                                <Avatar className="w-32 h-auto aspect-3/4 rounded-xl border-4 border-primary/10 transition-transform duration-300 group-hover:scale-105">
                                    <AvatarImage src={profileData.profilePicture} alt={profileData.name} className="object-cover" />
                                    <AvatarFallback className="text-3xl font-semibold bg-blue-800 text-white rounded-xl">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                {profileData.profilePicture && (
                                    <div className="absolute inset-0 bg-black/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <div className="bg-white/90 p-2 rounded-full shadow-sm backdrop-blur-sm">
                                            <Camera className="h-5 w-5 text-slate-800" />
                                        </div>
                                    </div>
                                )}
                                {uploading && (
                                    <div className="absolute inset-0 z-30 bg-white/60 backdrop-blur-[1px] rounded-xl flex items-center justify-center">
                                        <div className="h-8 w-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 text-center md:text-left space-y-2">
                                <h2 className="text-2xl font-bold text-foreground">{profileData.name}</h2>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                                    <Badge className="bg-blue-800 text-white pl-2 pr-3 py-1">
                                        <Shield className="h-3.5 w-3.5 mr-1.5" /> {profileData.role}
                                    </Badge>
                                    <Badge variant="outline" className="border-blue-200 text-blue-800 bg-blue-50 pl-2 pr-3 py-1">
                                        <Building2 className="h-3.5 w-3.5 mr-1.5" /> {profileData.department}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Info Grid */}
                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="text-base font-medium text-foreground flex items-center gap-2">
                                <User className="h-4.5 w-4.5 text-blue-700" /> Informasi Akun
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                    <div className="p-2 rounded-full bg-blue-100"><AtSign className="h-5 w-5 text-blue-700" /></div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Username</p>
                                        <p className="text-sm font-medium">{profileData.username}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                    <div className="p-2 rounded-full bg-blue-100"><Mail className="h-5 w-5 text-blue-700" /></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-muted-foreground">Email Resmi</p>
                                        <p className="text-sm font-medium truncate">{profileData.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                    <div className="p-2 rounded-full bg-blue-100"><Phone className="h-5 w-5 text-blue-700" /></div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Nomor Telepon</p>
                                        <p className="text-sm font-medium">{profileData.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                    <div className="p-2 rounded-full bg-blue-100"><Calendar className="h-5 w-5 text-blue-700" /></div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Bergabung Sejak</p>
                                        <p className="text-sm font-medium">{profileData.joinDate}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Dialogs */}
            <Dialog open={isPhotoOpen} onOpenChange={setIsPhotoOpen}>
                <DialogContent className="max-w-md md:max-w-lg p-1 bg-transparent border-none shadow-none text-transparent">
                    <div className="relative rounded-xl overflow-hidden bg-white shadow-2xl">
                        {profileData.profilePicture && (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={profileData.profilePicture} alt={`Foto Profil ${profileData.name}`} className="w-full h-auto object-contain max-h-[80vh]" />
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <AdminPhotoRequirementsModal 
                open={isReqModalOpen} 
                onOpenChange={setIsReqModalOpen} 
                onProceed={() => {
                    setIsReqModalOpen(false);
                    router.push('/admin/profile/edit');
                }}
            />
        </div>
    );
};
