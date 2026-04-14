'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const ScheduleListSkeleton: React.FC = () => {
    const COL_COUNT = 6;
    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: `110px repeat(${COL_COUNT}, minmax(140px, 1fr))`,
        gap: '8px',
    } as React.CSSProperties;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-9 w-56" />
                        <Skeleton className="h-9 w-9 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-72 mt-2" />
                </div>
                <Skeleton className="h-10 w-36 rounded-lg" />
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-xl bg-white shadow-sm p-5 space-y-3">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-11 w-11 rounded-xl shrink-0" />
                            <div className="space-y-1.5 flex-1">
                                <Skeleton className="h-3 w-24" />
                                <Skeleton className="h-6 w-16" />
                            </div>
                        </div>
                        <Skeleton className="h-5 w-32 rounded-md" />
                    </div>
                ))}
            </div>

            {/* Content Card */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
                            <div className="space-y-1.5">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-4 w-56" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-8 w-8 rounded-lg" />
                            <Skeleton className="h-8 w-8 rounded-lg" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                    </div>
                    <div className="pt-2 border-t border-slate-100">
                        <Skeleton className="h-10 w-full rounded-lg" />
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    {/* Day tabs */}
                    <div className="px-6 pt-4">
                        <Skeleton className="h-9 w-full rounded-md" />
                    </div>

                    {/* Timetable grid — matches actual CSS grid layout */}
                    <div className="overflow-x-auto p-4">
                        <div className="space-y-2" style={{ minWidth: `${110 + COL_COUNT * 140 + (COL_COUNT + 1) * 8}px` }}>
                            {/* Header row */}
                            <div style={gridStyle}>
                                <Skeleton className="h-9 rounded-lg" />
                                {Array.from({ length: COL_COUNT }).map((_, i) => (
                                    <Skeleton key={i} className="h-9 rounded-lg" />
                                ))}
                            </div>

                            {/* Break row */}
                            <div style={gridStyle}>
                                <Skeleton className="h-10 rounded-lg" />
                                <div
                                    className="h-10 rounded-lg bg-amber-50/60 border border-amber-100"
                                    style={{ gridColumn: `2 / -1` }}
                                />
                            </div>

                            {/* Lesson rows */}
                            {Array.from({ length: 7 }).map((_, row) => (
                                <div key={row} style={gridStyle}>
                                    <Skeleton className="h-[80px] rounded-lg" />
                                    {Array.from({ length: COL_COUNT }).map((_, col) => (
                                        (row + col) % 4 === 0
                                            ? <Skeleton key={col} className="h-[80px] rounded-lg" />
                                            : <div key={col} className="h-[80px] rounded-lg border border-dashed border-slate-200 bg-muted/20" />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
