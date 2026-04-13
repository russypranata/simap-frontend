'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const ScheduleListSkeleton: React.FC = () => {
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
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-32 rounded-lg" />
                    <Skeleton className="h-10 w-32 rounded-lg" />
                </div>
            </div>

            {/* Content Card */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-4 space-y-4">
                    {/* Card header row */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
                            <div className="space-y-1.5">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-4 w-56" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-9 w-20 rounded-lg" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                    </div>
                    {/* Search bar */}
                    <div className="pt-2 border-t border-slate-100">
                        <Skeleton className="h-10 w-full rounded-lg" />
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    {/* Day tabs */}
                    <div className="px-6 pt-4">
                        <Skeleton className="h-9 w-full rounded-md" />
                    </div>

                    {/* Timetable skeleton */}
                    <div className="overflow-x-auto mt-4">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-3 py-3 w-[100px] border-r border-slate-200">
                                        <Skeleton className="h-3 w-12 mx-auto" />
                                    </th>
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <th key={i} className="px-3 py-3 min-w-[120px] border-r border-slate-100">
                                            <Skeleton className="h-4 w-16 mx-auto" />
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <tr key={i} className="border-b border-slate-100">
                                        <td className="px-2 py-3 border-r border-slate-200">
                                            <div className="flex flex-col items-center gap-1">
                                                <Skeleton className="h-5 w-14 rounded-full" />
                                                <Skeleton className="h-4 w-10" />
                                                <Skeleton className="h-3 w-12" />
                                            </div>
                                        </td>
                                        {Array.from({ length: 5 }).map((_, j) => (
                                            <td key={j} className="px-2 py-2 border-r border-slate-100">
                                                {(i + j) % 3 === 0 ? (
                                                    <Skeleton className="h-14 w-full rounded-md" />
                                                ) : (
                                                    <div className="h-14 rounded-md border border-dashed border-slate-100" />
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
