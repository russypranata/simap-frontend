import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const EditProfileSkeleton = () => {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-48 sm:w-64" />
                    <Skeleton className="h-9 w-9 rounded-full" />
                </div>
                <Skeleton className="h-4 w-64" />
            </div>

            {/* Profile Form Card Skeleton */}
            <Card>
                <CardContent className="p-6">
                    <div className="space-y-8">
                        {/* Photo Upload Skeleton */}
                        <div className="flex flex-col items-center gap-4 pb-6 border-b">
                            <Skeleton className="h-32 w-32 rounded-full" />
                            <Skeleton className="h-9 w-36 rounded-md" />
                        </div>

                        {/* Form Fields Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-10 w-full rounded-md" />
                                </div>
                            ))}
                            <div className="md:col-span-2 space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-24 w-full rounded-md" />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t">
                            <Skeleton className="h-10 w-full sm:w-24 rounded-md" />
                            <Skeleton className="h-10 w-full sm:w-36 rounded-md" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Info Card Skeleton */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-3/4" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
