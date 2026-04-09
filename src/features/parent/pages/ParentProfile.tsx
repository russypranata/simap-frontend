"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
    User, Mail, Phone, MapPin, Calendar, Edit, CheckCircle2,
    Users, AtSign, Briefcase, Camera, RefreshCw,
} from "lucide-react";
import { ProfileSkeleton } from "../components/profile/ProfileSkeleton";
import { ErrorState } from "@/features/shared/components";
import { useParentProfile } from "../hooks/useParentProfile";
import { PageHeader } from "@/features/shared/components";

export const ParentProfile: React.FC = () => {
    const router = useRouter();
    const { profile, isLoading, isFetching, error, refetch } = useParentProfile();
    const [isPhotoOpen, setIsPhotoOpen] = useState(false);

    if (isLoading) return <ProfileSkeleton />;
    if (error) return <ErrorState error={error} onRetry={refetch} />;
    if (!profile) return null;

    const initials = profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);
    const hasPhoto = Boolean(profile.profilePicture?.trim());

    return (
        <div className="space-y-6">
            <PageHeader
                title="Profil"
                titleHighlight="Saya"
                icon={User}
                description="Kelola informasi profil dan pengaturan akun Anda"
            >
                {isFetching && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        Memperbarui...
                    </div>
                )}
            </PageHeader>

            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <User className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Profil Saya</CardTitle>
                                <p className="text-sm text-muted-foreground mt-0.5 font-normal">
                                    Kelola informasi pribadi dan akun Anda
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 pl-2 pr-3 py-1 hidden sm:flex">
                                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                                Aktif
                            </Badge>
                            <Button
                                onClick={() => router.push("/parent/profile/edit")}
                                size="sm"
                                className="bg-blue-800 hover:bg-blue-900 text-white"
                            >
                                <Edit className="h-4 w-4 mr-1.5" />
                                <span className="hidden sm:inline">Edit Profil</span>
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {/* Avatar + Name */}
                        <div className="flex flex-col md:flex-row items-center md:items-center space-y-4 md:space-y-0 md:space-x-6">
                            <div
                                onClick={() => hasPhoto && setIsPhotoOpen(true)}
                                className={`relative group ${hasPhoto ? "cursor-pointer" : "cursor-default"}`}
                            >
                                <Avatar className="w-32 h-32 rounded-full border-4 border-primary/10 transition-transform duration-300 group-hover:scale-105">
                                    <AvatarImage src={profile.profilePicture} alt={profile.name} className="object-cover" />
                                    <AvatarFallback className="text-3xl font-semibold bg-blue-800 text-white rounded-full">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                {hasPhoto && (
                                    <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <div className="bg-white/90 p-2 rounded-full backdrop-blur-sm">
                                            <Camera className="h-5 w-5 text-gray-800" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 text-center md:text-left space-y-2">
                                <h2 className="text-2xl font-bold text-foreground">{profile.name}</h2>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                                    <Badge className="bg-blue-800 text-white pl-2 pr-3 py-1">
                                        <Users className="h-3.5 w-3.5 mr-1.5" />
                                        Orang Tua / Wali
                                    </Badge>
                                    {profile.occupation && (
                                        <Badge variant="outline" className="border-blue-200 text-blue-800 bg-blue-50 pl-2 pr-3 py-1">
                                            <Briefcase className="h-3.5 w-3.5 mr-1.5" />
                                            {profile.occupation}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Photo lightbox */}
                        {hasPhoto && (
                            <Dialog open={isPhotoOpen} onOpenChange={setIsPhotoOpen}>
                                <DialogContent className="max-w-sm p-4 gap-3">
                                    <DialogTitle className="text-sm font-medium text-muted-foreground">Foto Profil</DialogTitle>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={profile.profilePicture} alt={profile.name} className="w-full h-auto object-cover aspect-square rounded-xl" />
                                </DialogContent>
                            </Dialog>
                        )}

                        {/* Informasi Pribadi */}
                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="text-base font-medium text-foreground flex items-center gap-2">
                                <User className="h-4 w-4 text-primary" />
                                Informasi Pribadi
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                    <div className="p-2 rounded-full bg-primary/10"><AtSign className="h-5 w-5 text-primary" /></div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Username</p>
                                        <p className="text-sm font-medium">{profile.username}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                    <div className="p-2 rounded-full bg-primary/10"><Calendar className="h-5 w-5 text-primary" /></div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Bergabung Sejak</p>
                                        <p className="text-sm font-medium">
                                            {profile.joinDate
                                                ? new Date(profile.joinDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
                                                : "-"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Informasi Kontak */}
                        <div className="space-y-4 pt-6 border-t">
                            <h3 className="text-base font-medium text-foreground flex items-center gap-2">
                                <Phone className="h-4 w-4 text-primary" />
                                Informasi Kontak
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { icon: Mail, label: "Email", value: profile.email, className: "truncate" },
                                    { icon: Phone, label: "Telepon", value: profile.phone },
                                ].map(({ icon: Icon, label, value, className }) => (
                                    <div key={label} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                        <div className="p-2 rounded-full bg-primary/10"><Icon className="h-5 w-5 text-primary" /></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-muted-foreground">{label}</p>
                                            {value ? (
                                                <p className={`text-sm font-medium ${className ?? ""}`}>{value}</p>
                                            ) : (
                                                <p className="text-sm text-muted-foreground italic">Tidak ada isi</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 md:col-span-2">
                                    <div className="p-2 rounded-full bg-primary/10"><MapPin className="h-5 w-5 text-primary" /></div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Alamat</p>
                                        {profile.address ? (
                                            <p className="text-sm font-medium">{profile.address}</p>
                                        ) : (
                                            <p className="text-sm text-muted-foreground italic">Tidak ada isi</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Data Anak */}
                        {profile.children.length > 0 && (
                            <div className="space-y-4 pt-6 border-t">
                                <h3 className="text-base font-medium text-foreground flex items-center gap-2">
                                    <Users className="h-4 w-4 text-primary" />
                                    Data Anak
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {profile.children.map((child) => (
                                        <div key={child.id} className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50/50 border border-blue-100">
                                            <div className="p-2 rounded-full bg-blue-100 text-blue-700">
                                                <User className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-slate-900">{child.name}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge className="text-xs bg-white text-blue-800 hover:bg-white border-transparent">{child.class}</Badge>
                                                    <span className="text-xs text-muted-foreground">NIS: <span className="font-mono">{child.nis}</span></span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
