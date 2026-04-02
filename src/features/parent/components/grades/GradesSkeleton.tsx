"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const GradesSkeleton: React.FC = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-56" />
                    <Skeleton className="h-9 w-9 rounded-full" />
                </div>
                <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-28" />
            </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 items-stretch">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="rounded-xl bg-white border border-slate-100 shadow-sm p-4">
                    <div className="flex items-center gap-3">
                        <Skeleton className="w-12 h-12 rounded-xl" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-6 w-14" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="p-4 space-y-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-slate-100">
                            <Skeleton className="h-4 w-6" />
                            <div className="flex-1 space-y-1">
                                <Skeleton className="h-4 w-36" />
                                <Skeleton className="h-3 w-28" />
                            </div>
                            <Skeleton className="h-8 w-16" />
                            <Skeleton className="h-8 w-16" />
                            <Skeleton className="h-8 w-12" />
                            <Skeleton className="h-6 w-10 rounded-full" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    </div>
);
