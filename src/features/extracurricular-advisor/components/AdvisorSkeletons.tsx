import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const DashboardSkeleton: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex flex-col space-y-4">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                </div>
                <Skeleton className="h-5 w-48" />
                <div className="flex gap-3">
                    <Skeleton className="h-8 w-40 rounded-full" />
                    <Skeleton className="h-8 w-32" />
                </div>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-4 rounded-full" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-16 mb-2" />
                            <Skeleton className="h-3 w-32" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Content Grid Skeleton */}
            <div className="grid gap-4 list-none md:grid-cols-2 lg:grid-cols-7">
                {/* Main Content Area */}
                <Card className="col-span-4">
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center space-x-4">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[250px]" />
                                    <Skeleton className="h-4 w-[200px]" />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Sidebar Area */}
                <Card className="col-span-3">
                    <CardHeader>
                        <Skeleton className="h-6 w-24" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex items-center space-x-4 border-l-4 border-muted pl-4">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export const MembersSkeleton: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-4 w-64" />
            </div>

            <Card>
                <CardHeader className="gap-4">
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-9 w-24" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                                <div className="flex items-center gap-4">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                </div>
                                <Skeleton className="h-6 w-16 rounded-full" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export const AttendanceSkeleton: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-4 w-64" />
            </div>

            {/* Stats Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
            </div>

            {/* Tabs */}
            <Skeleton className="h-10 w-64 rounded-full" />

            <div className="grid md:grid-cols-2 gap-6">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-48 w-full rounded-xl" />
            </div>

            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center gap-4">
                                <Skeleton className="h-4 w-8" />
                                <Skeleton className="h-4 w-24" />
                                <div className="flex-1">
                                    <Skeleton className="h-4 w-full" />
                                </div>
                                <div className="flex gap-2">
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
export const AttendanceDetailSkeleton: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex flex-col space-y-4">
                <Skeleton className="h-6 w-32" />
                <div className="flex justify-between items-center">
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-64" />
                        <Skeleton className="h-5 w-96" />
                    </div>
                </div>
            </div>

            {/* Info Card Skeleton */}
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

            {/* List Skeleton */}
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
                                <Skeleton className="h-6 w-24" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
