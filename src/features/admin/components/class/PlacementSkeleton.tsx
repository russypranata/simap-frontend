'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const PlacementSkeleton: React.FC = () => (
    <div className="space-y-6 animate-pulse">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <Skeleton className="h-9 w-52" />
                    <Skeleton className="h-9 w-9 rounded-full" />
                </div>
                <Skeleton className="h-4 w-80" />
            </div>
        </div>

        {/* 2-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left panel */}
            <Card className="md:col-span-7 border-slate-200 shadow-sm">
                <CardHeader className="pb-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-lg" />
                            <div>
                                <Skeleton className="h-5 w-32 mb-1" />
                                <Skeleton className="h-3 w-48" />
                            </div>
                        </div>
                        <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-slate-100">
                        <Skeleton className="h-9 flex-1" />
                        <Skeleton className="h-9 w-[180px]" />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="border-t border-slate-200">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-slate-50">
                                <Skeleton className="h-4 w-4" />
                                <div className="flex-1 space-y-1">
                                    <Skeleton className="h-4 w-40" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Right panel */}
            <Card className="md:col-span-5 border-slate-200 shadow-sm">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <div>
                            <Skeleton className="h-5 w-32 mb-1" />
                            <Skeleton className="h-3 w-48" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-24 w-full rounded-xl" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        </div>
    </div>
);
