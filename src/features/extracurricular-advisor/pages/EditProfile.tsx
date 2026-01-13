"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Pencil } from "lucide-react";
import { AdvisorProfileForm, AdvisorProfileData } from "@/features/extracurricular-advisor/components/profile/AdvisorProfileForm";

// Mock data untuk Extracurricular Advisor
const mockProfileData: AdvisorProfileData = {
    name: "Ahmad Fauzi, S.Pd",
    email: "ahmad.fauzi@alfityan.sch.id",
    phone: "+62 812-3456-7890",
    role: "Tutor Ekstrakurikuler",
    profilePicture: "",
    address: "Jl. Pendidikan No. 123, Gowa, Sulawesi Selatan",
    nip: "198505152010011001",
    extracurricular: "Pramuka",
};

import { EditProfileSkeleton } from '@/features/extracurricular-advisor/components/profile';

export const EditExtracurricularAdvisorProfile: React.FC = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [profileData, setProfileData] = useState<AdvisorProfileData | null>(null);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setProfileData(mockProfileData);
            setIsFetching(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const handleSave = async (data: AdvisorProfileData) => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            router.push("/extracurricular-advisor/profile");
        }, 1000);
    };

    const handleCancel = () => {
        router.back();
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
                                    <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                        Edit{" "}
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
                                Kelola dan ubah informasi data diri Anda
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
                            <ul className="text-sm text-blue-900 space-y-1 list-disc list-inside">
                                <li>Pastikan informasi yang Anda masukkan benar dan akurat</li>
                                <li>NIP dan Ekstrakurikuler tidak dapat diubah</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
