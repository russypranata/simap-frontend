"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Lock, Key, User } from 'lucide-react';
import { toast } from 'sonner';
import { ParentProfileForm } from '@/features/parent/components/profile/ParentProfileForm';
import { EditProfileSkeleton } from '@/features/parent/components/profile/EditProfileSkeleton';
import { ChangePasswordDialog } from '@/features/parent/components/profile/ChangePasswordDialog';
import { ParentProfileData } from '@/features/parent/data/mockParentData';
import {
    getParentProfile,
    updateParentProfile,
    uploadParentAvatar,
} from '@/features/parent/services/parentProfileService';

export const ParentEditProfile: React.FC = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [profileData, setProfileData] = useState<ParentProfileData | null>(
        null,
    );
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const data = await getParentProfile();
                setProfileData(data);
            } catch (error) {
                console.error('Failed to fetch profile:', error);
                toast.error('Gagal memuat data profil');
            } finally {
                setIsFetching(false);
            }
        };

        fetchProfileData();
    }, []);

    const handleSave = async (data: ParentProfileData, file: File | null) => {
        setIsLoading(true);
        try {
            await updateParentProfile(data);

            if (file) {
                try {
                    await uploadParentAvatar(file);
                } catch (avatarError) {
                    console.error('Avatar upload failed:', avatarError);
                    toast.error('Profil diperbarui, tetapi gagal mengunggah foto.');
                    setIsLoading(false);
                    return; // Don't redirect or show success toast if avatar failed
                }
            }

            // In real app, re-fetch to update context/state
            toast.success('Profil berhasil diperbarui!');
            router.push('/parent/settings/profile');
        } catch (error) {
            toast.error('Gagal menyimpan perubahan profil');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        router.push('/parent/settings/profile');
    };

    if (isFetching) {
        return <EditProfileSkeleton />;
    }

    if (!profileData) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50 rounded-xl border border-red-100">
                <p className="text-red-600 font-medium">Gagal memuat data formulir.</p>
                <Button variant="link" onClick={() => window.location.reload()} className="text-red-700 mt-2">
                    Coba Lagi
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Edit{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Profil
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Pencil className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Kelola data diri, kontak, dan pengaturan sandi Anda
                    </p>
                </div>
            </div>

            {/* Main Form */}
            <ParentProfileForm
                initialData={profileData}
                onSave={handleSave}
                onCancel={handleCancel}
                isLoading={isLoading}
            />

            {/* Account Security Card */}
            <Card className="overflow-hidden gap-3">
                <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <Lock className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">
                                Pengaturan Sandi
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-0.5 font-normal">
                                Kelola kata sandi dan akses akun
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="group relative flex items-center justify-between p-4 rounded-xl border border-border/60 bg-muted/30 hover:bg-muted/50 transition-all duration-300">
                        {/* Left side - Password info */}
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 rounded-full bg-yellow-100 text-yellow-600 border border-yellow-200 shrink-0">
                                <Key className="h-5 w-5" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-base font-semibold text-foreground">
                                    Kata Sandi
                                </h4>
                                <span className="text-sm font-medium text-muted-foreground tracking-widest">
                                    ********
                                </span>
                                <p className="text-xs text-muted-foreground">
                                    Diperbarui 3 bulan lalu
                                </p>
                            </div>
                        </div>

                        {/* Right side - Action button */}
                        <Button
                            size="sm"
                            onClick={() => setChangePasswordOpen(true)}
                            className="bg-blue-800 hover:bg-blue-900 text-white h-10 px-5 rounded-lg font-medium"
                        >
                            <Pencil className="h-3.5 w-3.5 mr-2" />
                            Ubah Kata Sandi
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <ChangePasswordDialog
                open={changePasswordOpen}
                onOpenChange={setChangePasswordOpen}
            />

            {/* Info Card */}
            <Card className="bg-blue-50 border-blue-800/20">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <User className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-semibold text-blue-800">
                                Informasi Penting
                            </p>
                            <ul className="text-sm text-blue-900 space-y-1.5 list-disc list-inside">
                                <li>
                                    Pastikan data diri Anda sesalu valid agar pihak sekolah mudah menghubungi Anda.
                                </li>
                                <li>
                                    Jika ada perubahan terkait data anak, silakan hubungi Tata Usaha.
                                </li>
                                <li>
                                    Jaga kerahasiaan kata sandi Anda.
                                </li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
