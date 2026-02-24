'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const AttendanceRecapSkeleton: React.FC = () => {
    return (
        <div className="space-y-6 text-slate-900">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                     <Skeleton className="h-10 w-40" />
                     <Skeleton className="h-10 w-40" />
                </div>
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                    <Card key={i} className="border-slate-200">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-12 w-12 rounded-xl" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-8 w-16" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Table Skeleton */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-10 w-full sm:w-[300px]" />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="border-t border-slate-100">
                        <div className="bg-slate-50/50 px-6 py-4 flex items-center justify-between border-b border-slate-100">
                            <Skeleton className="h-4 w-10" />
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="px-6 py-4 flex items-center justify-between border-b border-slate-50">
                                <Skeleton className="h-4 w-6" />
                                <Skeleton className="h-5 w-48" />
                                <Skeleton className="h-5 w-24" />
                                <Skeleton className="h-5 w-16" />
                                <Skeleton className="h-5 w-24" />
                                <Skeleton className="h-8 w-24 rounded-full" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
