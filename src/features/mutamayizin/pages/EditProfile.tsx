"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User } from "lucide-react";
import { mutamayizinService } from "../services/mutamayizinService";
import { MutamayizinProfileForm, MutamayizinProfileData } from "@/features/mutamayizin/components/profile/MutamayizinProfileForm";

export const EditMutamayizinProfile: React.FC = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<MutamayizinProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profile = await mutamayizinService.getProfileData();
                setFormData(profile);
            } catch (error) {
                console.error("Failed to fetch profile data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSave = async (data: MutamayizinProfileData) => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            router.push("/mutamayizin-coordinator/profile");
        }, 1000);
    };

    const handleCancel = () => {
        router.back();
    };

    if (loading || !formData) {
        return (
            <div className="space-y-6">
                <div className="text-center py-12">
                    <p className="text-muted-foreground">Memuat data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                    <div className="flex items-start gap-3">
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
                                    <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                        Edit{" "}
                                    </span>
                                    <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                        Profil
                                    </span>
                                </h1>
                                <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                                    <User className="h-5 w-5" />
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
            <MutamayizinProfileForm
                initialData={formData}
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
                                <li>NIP dan Program tidak dapat diubah</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
