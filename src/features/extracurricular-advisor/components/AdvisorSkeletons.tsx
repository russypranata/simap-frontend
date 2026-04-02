import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const AttendanceDetailSkeleton: React.FC = () => (
    <div className="space-y-6">
        <div className="flex flex-col space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-5 w-96" />
                </div>
            </div>
        </div>

        <Card className="overflow-hidden">
            <div className="h-20 bg-muted animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x border-b">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-4 space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-5 w-32" />
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-5 divide-x p-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-6 w-12" />
                        <Skeleton className="h-3 w-10" />
                    </div>
                ))}
            </div>
        </Card>

        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex gap-4 mb-6">
                        <Skeleton className="h-10 flex-1" />
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b last:border-0 gap-4">
                            <Skeleton className="h-4 w-8" />
                            <Skeleton className="h-4 w-24" />
                            <div className="flex-1 flex items-center gap-3">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <Skeleton className="h-6 w-24" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    </div>
);
