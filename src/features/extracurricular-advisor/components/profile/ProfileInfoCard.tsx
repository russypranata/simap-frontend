"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
    User, Mail, Phone, MapPin, Calendar, Edit, Camera, Award, Star, CheckCircle2,
} from "lucide-react";
import { type AdvisorProfileData } from "../../services/advisorProfileService";

interface ProfileInfoCardProps {
    profile: AdvisorProfileData;
    onEditProfile: () => void;
}

export const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({ profile, onEditProfile }) => {
    const [isPhotoOpen, setIsPhotoOpen] = useState(false);

    const initials = profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);

    return (
        <Card>
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                            <User className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Profil Saya</CardTitle>
                            <p className="text-sm text-muted-foreground mt-0.5 font-normal">Kelola informasi pribadi dan akun Anda</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 pl-2 pr-3 py-1 hidden sm:flex">
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                            Aktif
                        </Badge>
                        <Button
                            onClick={onEditProfile}
                            size="sm"
                            className="flex items-center space-x-2 bg-blue-800 hover:bg-blue-900 text-white"
                        >
                            <Edit className="h-4 w-4" />
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
                            onClick={() => profile.profilePicture && setIsPhotoOpen(true)}
                            className={`relative group ${profile.profilePicture ? "cursor-pointer" : "cursor-default"}`}
                        >
                            <Avatar className="w-32 h-32 rounded-full border-4 border-primary/10 transition-transform duration-300 group-hover:scale-105">
                                <AvatarImage src={profile.profilePicture} alt={profile.name} className="object-cover" />
                                <AvatarFallback className="text-3xl font-semibold bg-blue-800 text-white rounded-full">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            {profile.profilePicture && (
                                <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <div className="bg-white/90 p-2 rounded-full shadow-sm backdrop-blur-sm">
                                        <Camera className="h-5 w-5 text-gray-800" />
                                    </div>
                                </div>
                            )}
                        </div>

                        <Dialog open={isPhotoOpen} onOpenChange={setIsPhotoOpen}>
                            <DialogContent className="max-w-md md:max-w-lg p-1 bg-transparent border-none shadow-none text-transparent">
                                <div className="relative rounded-lg overflow-hidden bg-white shadow-2xl">
                                    {profile.profilePicture && (
                                        /* eslint-disable-next-line @next/next/no-img-element */
                                        <img
                                            src={profile.profilePicture}
                                            alt={`Foto Profil ${profile.name}`}
                                            className="w-full h-auto object-contain max-h-[80vh] rounded-lg"
                                        />
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>

                        <div className="flex-1 text-center md:text-left space-y-2">
                            <h2 className="text-2xl font-bold text-foreground">{profile.name}</h2>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                                <Badge className="bg-blue-800 text-white pl-2 pr-3 py-1">
                                    <Award className="h-3.5 w-3.5 mr-1.5" />
                                    {profile.role}
                                </Badge>
                                <Badge variant="outline" className="border-blue-200 text-blue-800 bg-blue-50 pl-2 pr-3 py-1">
                                    <Star className="h-3.5 w-3.5 mr-1.5" />
                                    {profile.extracurricular}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Personal Info */}
                    <div className="space-y-4 pt-4 border-t">
                        <h3 className="text-base font-medium text-foreground flex items-center gap-2">
                            <User className="h-4 w-4 text-primary" />
                            Informasi Pribadi
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                <div className="p-2 rounded-full bg-primary/10">
                                    <User className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground">Username</p>
                                    <p className="text-sm font-medium">{profile.username}</p>
                                </div>
                            </div>
                            {profile.nip && (
                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <User className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">NIP</p>
                                        <p className="text-sm font-medium">{profile.nip}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Contact Info */}
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
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <Icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-muted-foreground">{label}</p>
                                        <p className={`text-sm font-medium ${className ?? ""}`}>{value}</p>
                                    </div>
                                </div>
                            ))}
                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 md:col-span-2">
                                <div className="p-2 rounded-full bg-primary/10">
                                    <MapPin className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground">Alamat</p>
                                    <p className="text-sm font-medium">{profile.address}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                <div className="p-2 rounded-full bg-primary/10">
                                    <Calendar className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground">Bergabung Sejak</p>
                                    <p className="text-sm font-medium">{profile.joinDate}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
