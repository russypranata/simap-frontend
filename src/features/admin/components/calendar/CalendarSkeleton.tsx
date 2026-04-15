'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const CalendarSkeleton: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-9 w-56" />
                        <Skeleton className="h-9 w-9 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-72" />
                    <div className="flex items-center gap-3 mt-4">
                        <Skeleton className="h-7 w-36 rounded-full" />
                        <Skeleton className="h-4 w-1 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-44" />
                    <Skeleton className="h-10 w-40" />
                </div>
            </div>

            {/* Filter Bar Skeleton */}
            <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-10" />
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-7 w-20 rounded-full" />
                ))}
            </div>

            {/* Calendar Card Skeleton */}
            <Card className="border-slate-200 overflow-hidden">
                {/* Calendar Nav Header */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <div className="flex items-center gap-2 min-w-[180px] justify-center">
                        <Skeleton className="h-5 w-5 rounded" />
                        <Skeleton className="h-6 w-40" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-8 w-20 rounded-lg" />
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 mb-2">
                    {[...Array(7)].map((_, i) => (
                        <div key={i} className="flex justify-center py-2">
                            <Skeleton className="h-4 w-6" />
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 p-2">
                    {[...Array(42)].map((_, i) => (
                        <div key={i} className="h-[120px] p-2 rounded-xl border border-slate-100 bg-white flex flex-col">
                            <div className="flex items-center justify-between mb-1.5">
                                <Skeleton className="h-4 w-4 rounded" />
                                <Skeleton className="h-6 w-6 rounded-full" />
                            </div>
                            {/* Randomly show event bars on some cells */}
                            {i % 4 === 0 && <Skeleton className="h-5 w-full rounded-md mt-1" />}
                            {i % 7 === 2 && (
                                <>
                                    <Skeleton className="h-5 w-full rounded-md mt-1" />
                                    <Skeleton className="h-5 w-4/5 rounded-md mt-1" />
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </Card>

            {/* Legend Skeleton */}
            <div className="flex items-center gap-4 px-1">
                <Skeleton className="h-3 w-16" />
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                        <Skeleton className="h-3 w-3 rounded-sm" />
                        <Skeleton className="h-3 w-12" />
                    </div>
                ))}
            </div>
        </div>
    );
};
