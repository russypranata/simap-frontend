'use client';

import React from 'react';
import {
    ArrowUpCircle,
    CheckCircle2,
    AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export const PromotionWorkflow: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Kenaikan{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Kelas
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <ArrowUpCircle className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Workflow proses kenaikan kelas siswa secara massal.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-slate-200 shadow-sm md:col-span-2">
                    <CardHeader>
                        <CardTitle>Proses Kenaikan Kelas</CardTitle>
                        <CardDescription>
                            Pilih kelas asal dan kelas tujuan untuk memproses kenaikan.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                         <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50 border border-dashed border-slate-300 rounded-lg">
                            <ArrowUpCircle className="h-12 w-12 text-slate-300 mb-3" />
                            <h3 className="text-lg font-medium text-slate-900">Pilih Tingkat Kelas</h3>
                            <p className="text-slate-500 max-w-sm mt-1 mb-4">
                                Silakan pilih tingkat kelas yang akan diproses kenaikannya.
                            </p>
                            <Button>Mulai Proses</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle>Status Kenaikan</CardTitle>
                        <CardDescription>Ringkasan proses berjalan</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                            <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-green-900 text-sm">Kelas X Selesai</h4>
                                <p className="text-green-700 text-xs mt-0.5">Semua siswa kelas X telah diproses.</p>
                            </div>
                         </div>
                         <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-amber-900 text-sm">Kelas XI Pending</h4>
                                <p className="text-amber-700 text-xs mt-0.5">Menunggu konfirmasi wali kelas.</p>
                            </div>
                         </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
