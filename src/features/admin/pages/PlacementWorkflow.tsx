'use client';

import React from 'react';
import {
    Users,
    ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export const PlacementWorkflow: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Penempatan{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Kelas
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Users className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Atur penempatan siswa ke dalam rombongan belajar (rombel).
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle>Siswa Belum Dapat Kelas</CardTitle>
                        <CardDescription>
                            Daftar siswa yang belum memiliki rombel aktif
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-lg">
                            <Users className="h-10 w-10 text-slate-300 mb-3" />
                            <p className="text-slate-500 text-sm">Tidak ada siswa tanpa kelas.</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle>Distribusi Kelas</CardTitle>
                        <CardDescription>
                            Pindahkan siswa antar kelas atau batch placement
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button className="w-full justify-between" variant="outline">
                            Distribusi Siswa Baru (PPDB) <ArrowRight className="h-4 w-4" />
                        </Button>
                        <Button className="w-full justify-between" variant="outline">
                            Pindah Kelas Manual <ArrowRight className="h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
