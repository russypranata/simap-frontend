'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const MembersPageSkeleton: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-48 mb-2" /> {/* Back button area */}
                    <Skeleton className="h-10 w-64" />
                </div>
                <Skeleton className="h-10 w-40" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Skeleton */}
                <Card className="lg:col-span-1 border-slate-200">
                    <CardHeader className="pb-3 pt-4 px-4 bg-slate-50 border-b border-slate-100 mb-2">
                        <Skeleton className="h-4 w-24" />
                    </CardHeader>
                    <CardContent className="p-2 space-y-2">
                        {[1, 2, 3, 4, 5].map(i => (
                            <Skeleton key={i} className="h-12 w-full rounded-md" />
                        ))}
                    </CardContent>
                </Card>

                {/* Main Content Skeleton */}
                <div className="lg:col-span-3 space-y-6">
                    <Card className="border-slate-200 overflow-hidden shadow-sm">
                        <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50/30">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-slate-900">
                                <div className="flex items-start gap-4">
                                    <Skeleton className="h-12 w-12 rounded-xl" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-8 w-48" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                </div>
                                <div className="space-y-2 flex flex-col items-end">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-2 w-32 rounded-full" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
                                <Skeleton className="h-10 flex-1" />
                                <Skeleton className="h-10 w-40" />
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between border-b border-slate-50 pb-4">
                                    <Skeleton className="h-4 w-10" />
                                    <Skeleton className="h-4 w-40" />
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-10" />
                                </div>
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="flex justify-between items-center py-2">
                                        <Skeleton className="h-4 w-6" />
                                        <Skeleton className="h-5 w-48" />
                                        <div className="space-y-1">
                                            <Skeleton className="h-4 w-20" />
                                            <Skeleton className="h-3 w-12" />
                                        </div>
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-8 w-8 rounded-full" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
