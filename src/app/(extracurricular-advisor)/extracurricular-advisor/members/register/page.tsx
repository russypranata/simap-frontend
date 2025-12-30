"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    UserPlus,
    ArrowLeft,
    Construction,
} from "lucide-react";

export default function RegisterMemberPage() {
    const router = useRouter();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Daftarkan </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Anggota Baru</span>
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Pilih siswa yang akan didaftarkan ke ekstrakurikuler Pramuka
                        </p>
                    </div>
                </div>
            </div>

            {/* Coming Soon Card */}
            <Card className="overflow-hidden p-0 gap-0">
                {/* Header */}
                <div className="bg-blue-800 p-4 rounded-t-lg relative overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full" />
                    <div className="absolute right-12 -bottom-6 w-16 h-16 bg-white/5 rounded-full" />

                    <div className="flex items-center gap-3 relative z-10">
                        <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-lg">
                            <UserPlus className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-white">Pendaftaran Anggota</h3>
                            <p className="text-blue-100 text-sm">Ekstrakurikuler Pramuka</p>
                        </div>
                    </div>
                </div>

                {/* Coming Soon Content */}
                <CardContent className="py-16">
                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                        <div className="p-6 bg-amber-50 rounded-full">
                            <Construction className="h-16 w-16 text-amber-500" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-gray-900">Fitur Dalam Pengembangan</h3>
                            <p className="text-muted-foreground max-w-md">
                                Fitur pendaftaran anggota baru sedang dalam tahap pengembangan.
                                Silakan kembali lagi nanti.
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => router.back()}
                            className="mt-4"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali ke Daftar Anggota
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
