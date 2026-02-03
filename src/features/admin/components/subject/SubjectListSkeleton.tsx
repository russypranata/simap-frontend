'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const SubjectListSkeleton: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-10 w-40" />
            </div>

            {/* Filters Skeleton */}
            <Card className="border-slate-200">
                <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <Skeleton className="h-10 flex-1" />
                        <Skeleton className="h-10 w-40" />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {/* Table Header Skeleton */}
                    <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
                        <div className="flex gap-4">
                            <Skeleton className="h-4 w-8" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>
                    {/* Table Rows Skeleton */}
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="border-t border-slate-100 px-6 py-4">
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-4 w-4" />
                                <div className="flex-1 flex items-center gap-4">
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-5 w-40" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                    <Skeleton className="h-6 w-20" />
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
};
