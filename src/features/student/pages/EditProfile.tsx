"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User } from "lucide-react";
import { toast } from "sonner";
import { StudentProfileForm } from "@/features/student/components/profile/StudentProfileForm";
import { EditProfileSkeleton } from "@/features/student/components/profile";
import { StudentProfileData } from "@/features/student/data/mockStudentData";
import { getStudentProfile, updateStudentProfile } from "@/features/student/services/studentProfileService";

export const EditStudentProfile: React.FC = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false); // For saving state
    const [isFetching, setIsFetching] = useState(true); // For initial data load
    const [profileData, setProfileData] = useState<StudentProfileData | null>(null);

    // Simulate API Fetching for Initial Data
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                // Simulated API Call
                const data = await getStudentProfile();
                setProfileData(data);
            } catch (error) {
                console.error("Failed to fetch profile:", error);
                toast.error("Gagal memuat data profil");
            } finally {
                setIsFetching(false);
            }
        };

        fetchProfileData();
    }, []);

    const handleSave = async (data: StudentProfileData) => {
        setIsLoading(true);
        try {
            await updateStudentProfile(data);
            toast.success("Profil berhasil diperbarui!");
            router.push("/student/profile");
        } catch (error) {
            toast.error("Gagal menyimpan perubahan");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        router.push("/student/profile");
    };

    if (isFetching || !profileData) {
        return <EditProfileSkeleton />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCancel}
                    className="h-9 w-9"
                >
                    <ArrowLeft className="h-5 w-5" />
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

            {/* Main Form */}
            <StudentProfileForm
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
                                <li>NIS dan Kelas tidak dapat diubah</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
