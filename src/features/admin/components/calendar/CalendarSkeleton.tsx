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
                    <Skeleton className="h-9 w-56" />
                    <Skeleton className="h-4 w-72" />
                    <div className="flex items-center gap-3 mt-4">
                        <Skeleton className="h-7 w-36 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>
                <Skeleton className="h-10 w-40" />
            </div>

            {/* Calendar Skeleton */}
            <Card className="border-slate-200 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 bg-white rounded-lg border border-slate-200 p-1">
                            <Skeleton className="h-7 w-7 rounded" />
                            <Skeleton className="h-7 w-7 rounded" />
                        </div>
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-7 w-40" />
                            <Skeleton className="h-7 w-16 rounded" />
                        </div>
                    </div>
                    <div className="hidden lg:flex items-center gap-5">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <Skeleton className="h-2.5 w-2.5 rounded-sm" />
                                <Skeleton className="h-3 w-12" />
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Day Headers */}
                <div className="grid grid-cols-7 bg-slate-50/70">
                    {[...Array(7)].map((_, i) => (
                        <div 
                            key={i} 
                            className={`flex justify-center py-2.5 border-b border-slate-200 ${i < 6 ? 'border-r border-slate-100' : ''}`}
                        >
                            <Skeleton className="h-3 w-6" />
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7">
                    {[...Array(42)].map((_, i) => {
                        const isLastInRow = (i + 1) % 7 === 0;
                        const isLastRow = Math.floor(i / 7) === 5;
                        return (
                            <div 
                                key={i} 
                                className={`min-h-[110px] p-1.5 ${!isLastInRow ? 'border-r border-slate-100' : ''} ${!isLastRow ? 'border-b border-slate-100' : ''}`}
                            >
                                <div className="flex justify-end mb-1.5 pr-0.5">
                                    <Skeleton className="h-7 w-7 rounded-full" />
                                </div>
                                {i % 5 === 0 && (
                                    <div className="space-y-1 px-0.5">
                                        <Skeleton className="h-5 w-full rounded-md" />
                                    </div>
                                )}
                                {i % 7 === 2 && (
                                    <div className="space-y-1 px-0.5">
                                        <Skeleton className="h-5 w-full rounded-md" />
                                        <Skeleton className="h-5 w-4/5 rounded-md" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </Card>

            {/* Event List Skeleton */}
            <Card className="border-slate-200">
                <div className="px-4 py-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-lg" />
                            <div className="space-y-1.5">
                                <Skeleton className="h-5 w-40" />
                                <Skeleton className="h-3 w-56" />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100">
                        <Skeleton className="h-10 flex-1" />
                        <Skeleton className="h-10 w-72" />
                    </div>
                </div>
                <div className="border-t border-slate-100">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="px-4 py-3 border-b border-slate-100 last:border-b-0">
                            <div className="flex items-center justify-between">
                                <div className="flex gap-3 items-center">
                                    <Skeleton className="w-10 h-10 rounded" />
                                    <div className="space-y-1.5">
                                        <Skeleton className="h-4 w-48" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                </div>
                                <Skeleton className="h-5 w-16 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};
