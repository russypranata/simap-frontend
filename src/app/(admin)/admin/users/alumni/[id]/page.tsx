'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
    GraduationCap, ArrowLeft, Phone, Mail, MapPin,
    User, Award, Calendar, AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { alumniService } from '@/features/admin/services/alumniService';

const DetailSkeleton = () => (
    <div className="space-y-6">
        <div className="flex items-center gap-3"><Skeleton className="h-9 w-64" /></div>
        <Card><CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-6">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="space-y-2"><Skeleton className="h-7 w-48" /><Skeleton className="h-5 w-32" /></div>
            </div>
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
        </CardContent></Card>
    </div>
);

export default function AlumniDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = Number(params.id);

    const { data: alumni, isLoading, isError } = useQuery({
        queryKey: ['admin-alumni-detail', id],
        queryFn: () => alumniService.getAlumniById(id),
        enabled: !!id,
    });

    if (isLoading) return <DetailSkeleton />;

    if (isError || !alumni) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <AlertCircle className="h-12 w-12 text-red-400" />
                <p className="text-slate-600 font-medium">Data alumni tidak ditemukan</p>
                <Button variant="outline" onClick={() => router.push('/admin/users/alumni')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Kembali ke Daftar
                </Button>
            </div>
        );
    }

    const initials = alumni.name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Detail </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Alumni</span>
                        </h1>
                        <div className="p-2 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                            <GraduationCap className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">Informasi lengkap data alumni</p>
                </div>
                <Button variant="outline" onClick={() => router.push('/admin/users/alumni')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Kembali
                </Button>
            </div>

            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                            <User className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-lg">Data Diri Alumni</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Avatar & Nama */}
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <Avatar className="w-24 h-24 border-4 border-primary/10">
                            <AvatarImage src={alumni.avatar ?? undefined} alt={alumni.name} className="object-cover" />
                            <AvatarFallback className="text-2xl font-semibold bg-blue-800 text-white">{initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-center md:text-left space-y-2">
                            <h2 className="text-2xl font-bold text-foreground">{alumni.name}</h2>
                            <p className="text-sm text-muted-foreground font-mono">{alumni.admission_number}</p>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
                                {alumni.last_class_name && (
                                    <Badge className="bg-blue-800 text-white">
                                        <GraduationCap className="h-3.5 w-3.5 mr-1.5" />
                                        {alumni.last_class_name}
                                    </Badge>
                                )}
                                {alumni.graduation_year && (
                                    <Badge variant="outline" className="text-slate-600">
                                        <Award className="h-3.5 w-3.5 mr-1.5" />
                                        Lulus {alumni.graduation_year}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                        {alumni.email && (
                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                <div className="p-2 rounded-full bg-blue-100/60 shrink-0">
                                    <Mail className="h-4 w-4 text-blue-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Email</p>
                                    <p className="text-sm font-medium text-slate-800">{alumni.email}</p>
                                </div>
                            </div>
                        )}
                        {alumni.phone && (
                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                <div className="p-2 rounded-full bg-blue-100/60 shrink-0">
                                    <Phone className="h-4 w-4 text-blue-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">No. HP</p>
                                    <p className="text-sm font-medium text-slate-800">{alumni.phone}</p>
                                </div>
                            </div>
                        )}
                        {alumni.religion && (
                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                <div className="p-2 rounded-full bg-blue-100/60 shrink-0">
                                    <User className="h-4 w-4 text-blue-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Agama</p>
                                    <p className="text-sm font-medium text-slate-800">{alumni.religion}</p>
                                </div>
                            </div>
                        )}
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                            <div className="p-2 rounded-full bg-blue-100/60 shrink-0">
                                <Calendar className="h-4 w-4 text-blue-700" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Terdaftar</p>
                                <p className="text-sm font-medium text-slate-800">
                                    {new Date(alumni.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                        {alumni.address && (
                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 md:col-span-2">
                                <div className="p-2 rounded-full bg-blue-100/60 shrink-0">
                                    <MapPin className="h-4 w-4 text-blue-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Alamat</p>
                                    <p className="text-sm font-medium text-slate-800">{alumni.address}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
