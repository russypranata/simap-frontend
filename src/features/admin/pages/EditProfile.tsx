'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Pencil, Lock, Key } from 'lucide-react';
import { AdminProfileData } from '../data/mockAdminData';
import { getAdminProfile } from '../services/adminProfileService';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { updateAdminProfile, uploadAdminAvatar } from '../services/adminProfileService';
import { 
    AdminProfileForm, 
    AdminProfileSkeleton,
    ChangePasswordDialog
} from '@/features/admin/components/profile';

export const EditAdminProfile: React.FC = () => {
    const router = useRouter();
    const [profileData, setProfileData] = useState<AdminProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);

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

    const handleSave = async (data: AdminProfileData, file: File | null) => {
        setSaving(true);
        try {
            // If file exists, upload it first
            if (file) {
                await uploadAdminAvatar(file);
            }
            
            // Update profile info
            await updateAdminProfile({
                name: data.name,
                username: data.username,
                email: data.email,
                phone: data.phone
            });
            
            toast.success('Profil berhasil diperbarui');
            router.push('/admin/profile');
            router.refresh();
        } catch (error) {
            toast.error((error as Error).message || 'Gagal memperbarui profil');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        router.back();
    };

    if (loading || !profileData) {
        return <AdminProfileSkeleton />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-linear-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Edit{' '}
                            </span>
                            <span className="bg-linear-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Profil
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                            <Pencil className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Kelola data diri, kontak, dan pengaturan sandi Anda
                    </p>
                </div>
            </div>

            {/* Main Form */}
            <AdminProfileForm 
                initialData={profileData} 
                onSave={handleSave}
                onCancel={handleCancel}
                isLoading={saving}
            />

            {/* Account Security Card */}
            <Card className="overflow-hidden gap-3">
                <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
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
                                    Terakhir diubah: {profileData.passwordLastChanged ? new Date(profileData.passwordLastChanged).toLocaleDateString('id-ID') : 'Belum pernah'}
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
                        <div className="p-2 bg-blue-100 rounded-full">
                            <User className="h-5 w-5 text-blue-700" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-semibold text-blue-800">
                                Informasi Penting
                            </p>
                            <ul className="text-sm text-blue-900 space-y-1.5 list-disc list-inside">
                                <li>
                                    Pastikan data diri Anda (Nama, Email, No.
                                    Telepon) selalu valid dan aktif.
                                </li>
                                <li>
                                    <strong>Role Sistem</strong> dan{' '}
                                    <strong>Departemen</strong> dikunci oleh sistem.
                                    Hubungi super admin jika terdapat kesalahan.
                                </li>
                                <li>
                                    Jaga keamanan akun Anda dengan tidak
                                    membagikan kata sandi kepada orang lain.
                                </li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
