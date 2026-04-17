'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const HomeroomListSkeleton: React.FC = () => (
    <div className="space-y-6 animate-pulse">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <Skeleton className="h-9 w-48" />
                    <Skeleton className="h-9 w-9 rounded-full" />
                </div>
                <Skeleton className="h-4 w-72" />
            </div>
        </div>

        {/* StatCards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
                <div key={i} className="rounded-xl bg-white border border-slate-100 shadow-sm p-4 space-y-3">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-11 w-11 rounded-xl" />
                        <div className="space-y-1 flex-1">
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-7 w-16" />
                        </div>
                    </div>
                    <Skeleton className="h-6 w-full rounded-md" />
                </div>
            ))}
        </div>

        {/* Table Card */}
        <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <div>
                            <Skeleton className="h-5 w-40 mb-1" />
                            <Skeleton className="h-3 w-56" />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Skeleton className="h-9 w-[180px]" />
                        <Skeleton className="h-9 w-[220px]" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                {['Nama Kelas', 'Tahun Ajaran', 'Wali Kelas', 'Jumlah Siswa', 'Aksi'].map(h => (
                                    <th key={h} className="px-6 py-4">
                                        <Skeleton className="h-3 w-20" />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3, 4, 5].map(i => (
                                <tr key={i} className="border-b border-slate-50">
                                    <td className="px-6 py-4"><Skeleton className="h-5 w-20" /></td>
                                    <td className="px-6 py-4"><Skeleton className="h-5 w-24 rounded-full" /></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2.5">
                                            <Skeleton className="h-8 w-8 rounded-full" />
                                            <Skeleton className="h-4 w-36" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><Skeleton className="h-5 w-16 rounded-full" /></td>
                                    <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-16 ml-auto" /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    </div>
);
