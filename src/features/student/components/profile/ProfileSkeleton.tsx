import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const ProfileSkeleton = () => {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="space-y-2 w-full max-w-lg">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-64" />
                    <div className="flex items-center gap-3 mt-4">
                        <Skeleton className="h-6 w-32 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>
            </div>

            {/* Profile Card Skeleton */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-lg" />
                            <div className="space-y-1">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-3 w-48" />
                            </div>
                        </div>
                        <Skeleton className="h-9 w-28" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {/* Avatar & Main Info */}
                        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                            <Skeleton className="h-32 w-32 rounded-full border-4 border-muted" />

                            <div className="flex-1 text-center md:text-left space-y-3 w-full">
                                <Skeleton className="h-8 w-64 mx-auto md:mx-0" />
                                <div className="flex items-center justify-center md:justify-start gap-2">
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                    <Skeleton className="h-6 w-24 rounded-full" />
                                </div>
                                <Skeleton className="h-4 w-32 mx-auto md:mx-0" />
                            </div>
                        </div>

                        {/* Personal Info Grid Skeleton */}
                        <div className="space-y-3 pt-4 border-t">
                            <Skeleton className="h-5 w-40 mb-3" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                        <Skeleton className="h-9 w-9 rounded-full" />
                                        <div className="space-y-2 flex-1">
                                            <Skeleton className="h-3 w-16" />
                                            <Skeleton className="h-4 w-32" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Contact Info Grid Skeleton */}
                        <div className="space-y-3 pt-4 border-t">
                            <Skeleton className="h-5 w-40 mb-3" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                        <Skeleton className="h-9 w-9 rounded-full" />
                                        <div className="space-y-2 flex-1">
                                            <Skeleton className="h-3 w-16" />
                                            <Skeleton className="h-4 w-40" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Card Skeleton */}
            <Card>
                <CardContent className="px-6 py-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <div className="space-y-1">
                            <Skeleton className="h-5 w-48" />
                            <Skeleton className="h-3 w-64" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                <Skeleton className="h-9 w-9 rounded-full" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-3 w-20" />
                                    <Skeleton className="h-5 w-12" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
