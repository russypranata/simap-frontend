'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const ExtracurricularListSkeleton: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-4 w-80" />
                </div>
                <div className="flex gap-3">
                     <Skeleton className="h-10 w-40" />
                </div>
            </div>

            {/* Content Skeleton */}
            <Card className="border-slate-200">
                <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <Skeleton className="h-10 flex-1" />
                        <div className="flex gap-3">
                            <Skeleton className="h-10 w-36" />
                            <Skeleton className="h-10 w-48" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="border border-slate-100 rounded-xl p-5 space-y-4 shadow-sm">
                                <div className="flex justify-between items-start">
                                    <Skeleton className="h-12 w-12 rounded-lg" />
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                                <div className="pt-4 border-t border-slate-50 space-y-3">
                                    <div className="flex justify-between">
                                        <Skeleton className="h-3 w-16" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                    <div className="flex justify-between">
                                        <Skeleton className="h-3 w-20" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <Skeleton className="h-9 flex-1 rounded-md" />
                                    <Skeleton className="h-9 w-10 rounded-md" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
