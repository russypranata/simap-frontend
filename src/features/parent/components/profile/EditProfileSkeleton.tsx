import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const EditProfileSkeleton = () => {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex items-center gap-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-36" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-72" />
                </div>
            </div>

            {/* Profile Form Card Skeleton */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <div className="space-y-1">
                            <Skeleton className="h-5 w-36" />
                            <Skeleton className="h-3 w-52" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center space-y-4 pb-6 border-b">
                        <Skeleton className="h-32 w-32 rounded-full" />
                        <Skeleton className="h-9 w-36 rounded-md" />
                    </div>

                    {/* Form Fields */}
                    <div className="grid gap-6">
                        {/* Name */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-10 w-full rounded-md" />
                        </div>
                        {/* Username */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full rounded-md" />
                        </div>
                        {/* Occupation */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full rounded-md" />
                        </div>
                        {/* Email & Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-10 w-full rounded-md" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-28" />
                                <Skeleton className="h-10 w-full rounded-md" />
                            </div>
                        </div>
                        {/* Address */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-20 w-full rounded-md" />
                        </div>
                        {/* Buttons */}
                        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t">
                            <Skeleton className="h-10 w-24 rounded-md" />
                            <Skeleton className="h-10 w-36 rounded-md" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Password Card Skeleton */}
            <Card>
                <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <div className="space-y-1">
                            <Skeleton className="h-5 w-36" />
                            <Skeleton className="h-3 w-52" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-border/60 bg-muted/30">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                        </div>
                        <Skeleton className="h-10 w-36 rounded-lg" />
                    </div>
                </CardContent>
            </Card>

            {/* Info Card Skeleton */}
            <Card className="bg-blue-50 border-blue-800/20">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-36" />
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-4/5" />
                            <Skeleton className="h-3 w-3/5" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
