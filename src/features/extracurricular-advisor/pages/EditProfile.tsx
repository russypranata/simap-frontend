"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Pencil, Lock, Key } from "lucide-react";
import { AdvisorProfileForm, AdvisorProfileData } from "@/features/extracurricular-advisor/components/profile/AdvisorProfileForm";
import { EditProfileSkeleton } from '@/features/extracurricular-advisor/components/profile';
import { ChangePasswordDialog } from "@/features/extracurricular-advisor/components/profile/ChangePasswordDialog";
import { 
    advisorService 
} from "@/features/extracurricular-advisor/services/advisorService";
import { toast } from "sonner";

export const EditExtracurricularAdvisorProfile: React.FC = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [profileData, setProfileData] = useState<AdvisorProfileData | null>(null);
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await advisorService.getProfile();
                setProfileData(data);
            } catch (error) {
                console.error("Failed to fetch profile:", error);
                toast.error("Gagal memuat data profil");
            } finally {
                setIsFetching(false);
            }
        };

        fetchData();
    }, []);

    const handleSave = async (data: AdvisorProfileData, file: File | null) => {
        setIsLoading(true);
        try {
            // 1. Update Profile Data
            const updatePayload = {
                name: data.name || "",
                username: data.username || "",
                email: data.email || "",
                phone: data.phone || "",
                address: data.address || "",
            };
            
            await advisorService.updateProfile(updatePayload);
            
            // 2. Upload Avatar if selected
            if (file) {
                 await advisorService.uploadAvatar(file);
            }

            toast.success("Profil berhasil diperbarui!");
            router.push("/extracurricular-advisor/profile");
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : "Gagal menyimpan perubahan";
            toast.error(errorMessage);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        router.push("/extracurricular-advisor/profile");
    };

    if (isFetching || !profileData) {
        return <EditProfileSkeleton />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                    <div className="flex items-start gap-3">
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold tracking-tight">
                                    <span className="bg-linear-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                        Edit{" "}
                                    </span>
                                    <span className="bg-linear-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
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
                </div>
            </div>

            {/* Edit Form */}
            <AdvisorProfileForm
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
                                    Pastikan data diri Anda (Nama, Email, No. Telepon) selalu valid dan aktif
                                </li>
                                <li>
                                    <strong>NIP</strong> dan{' '}
                                    <strong>Ekstrakurikuler</strong> tidak dapat diubah.
                                </li>
                                <li>
                                    Jaga keamanan akun Anda dengan tidak membagikan kata sandi kepada orang lain
                                </li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
