"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    User,
    Pencil,
    Mail,
    Phone,
    MapPin,
    Save,
    X,
    Camera,
    Briefcase,
    Building2,
} from "lucide-react";
import { useMutamayizinProfile, useUpdateMutamayizinProfile } from "../hooks/useMutamayizinProfile";
import { ErrorState } from "@/features/shared/components/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import type { UpdateProfileData } from "../services/mutamayizinService";

const EditProfileSkeleton: React.FC = () => (
    <div className="space-y-6">
        <div className="space-y-2">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-4 w-64" />
        </div>
        <Card>
            <CardContent className="pt-6 space-y-6">
                <div className="flex flex-col items-center space-y-4">
                    <Skeleton className="h-32 w-32 rounded-full" />
                    <Skeleton className="h-9 w-40" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className={`space-y-2 ${i >= 4 ? "md:col-span-2" : ""}`}>
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    </div>
);

export const EditMutamayizinProfile: React.FC = () => {
    const router = useRouter();
    const { data: profileData, isLoading, error, refetch } = useMutamayizinProfile();
    const updateMutation = useUpdateMutamayizinProfile();

    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        const payload: UpdateProfileData = {
            name: formData.get("name") as string,
            phone: formData.get("phone") as string,
            address: formData.get("address") as string,
            department: formData.get("department") as string,
            job_title: formData.get("job_title") as string,
        };

        updateMutation.mutate(payload, {
            onSuccess: () => {
                setSuccessMessage("Profil berhasil diperbarui.");
                setTimeout(() => {
                    router.push("/mutamayizin-coordinator/profile");
                }, 1000);
            },
        });
    };

    const handleCancel = () => {
        router.back();
    };

    if (isLoading) return <EditProfileSkeleton />;

    if (error) {
        return (
            <ErrorState
                error={(error as Error).message || "Gagal memuat data profil"}
                onRetry={refetch}
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

            {/* Success message */}
            {successMessage && (
                <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                    {successMessage}
                </div>
            )}

            {/* Error message from mutation */}
            {updateMutation.error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {(updateMutation.error as Error).message || "Gagal memperbarui profil. Silakan coba lagi."}
                </div>
            )}

            {/* Edit Form */}
            <Card>
                <CardContent className="pt-6">
                    <form onSubmit={handleSave}>
                        <div className="space-y-6">
                            {/* Profile Picture */}
                            <div className="flex flex-col items-center space-y-4">
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
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="text-blue-800 hover:text-blue-900 border-blue-800/30 hover:border-blue-800"
                                >
                                    <Camera className="h-4 w-4 mr-2" />
                                    Ubah Foto Profil
                                </Button>
                            </div>

                            {/* Form Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Nama Lengkap */}
                                <div className="space-y-2 md:col-span-2">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-primary" />
                                        <Label htmlFor="name" className="mb-0">
                                            Nama Lengkap
                                            <span className="text-red-500 ml-1">*</span>
                                        </Label>
                                    </div>
                                    <Input
                                        id="name"
                                        name="name"
                                        defaultValue={profileData.name}
                                        placeholder="Masukkan nama lengkap"
                                        required
                                    />
                                </div>

                                {/* Email (read-only) */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-primary" />
                                        <Label htmlFor="email" className="mb-0">
                                            Email
                                        </Label>
                                    </div>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        defaultValue={profileData.email}
                                        readOnly
                                        className="bg-muted/50 cursor-not-allowed"
                                    />
                                </div>

                                {/* Telepon */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-primary" />
                                        <Label htmlFor="phone" className="mb-0">
                                            Telepon
                                        </Label>
                                    </div>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        defaultValue={profileData.phone ?? ""}
                                        placeholder="Masukkan nomor telepon"
                                    />
                                </div>

                                {/* Departemen */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Building2 className="h-4 w-4 text-primary" />
                                        <Label htmlFor="department" className="mb-0">
                                            Departemen
                                        </Label>
                                    </div>
                                    <Input
                                        id="department"
                                        name="department"
                                        defaultValue={profileData.department ?? ""}
                                        placeholder="Masukkan departemen"
                                    />
                                </div>

                                {/* Jabatan */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="h-4 w-4 text-primary" />
                                        <Label htmlFor="job_title" className="mb-0">
                                            Jabatan
                                        </Label>
                                    </div>
                                    <Input
                                        id="job_title"
                                        name="job_title"
                                        defaultValue={profileData.jobTitle ?? ""}
                                        placeholder="Masukkan jabatan"
                                    />
                                </div>

                                {/* Alamat */}
                                <div className="space-y-2 md:col-span-2">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-primary" />
                                        <Label htmlFor="address" className="mb-0">
                                            Alamat
                                        </Label>
                                    </div>
                                    <Textarea
                                        id="address"
                                        name="address"
                                        defaultValue={profileData.address ?? ""}
                                        placeholder="Masukkan alamat lengkap"
                                        rows={3}
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={updateMutation.isPending}
                                    className="flex-1 sm:flex-none"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={updateMutation.isPending}
                                    className="flex-1 sm:flex-none bg-blue-800 hover:bg-blue-900 text-white"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    {updateMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>

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
                                <li>Email tidak dapat diubah melalui halaman ini</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
