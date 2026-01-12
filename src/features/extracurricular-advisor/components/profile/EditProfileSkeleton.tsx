import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const EditProfileSkeleton = () => {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex items-center gap-4">
                <Skeleton className="h-9 w-9 rounded-md" /> {/* Back Button */}
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-48" /> {/* Title */}
                        <Skeleton className="h-8 w-8 rounded-full" /> {/* Icon */}
                    </div>
                    <Skeleton className="h-4 w-64" /> {/* Subtitle */}
                </div>
            </div>

            {/* Profile Form Card Skeleton */}
            <Card>
                <CardContent className="p-6">
                    <div className="space-y-8">
                        {/* Photo Upload Skeleton */}
                        <div className="flex items-center gap-6 pb-6 border-b">
                            <Skeleton className="h-24 w-24 rounded-full" />
                            <div className="space-y-3">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-48" />
                                </div>
                                <div className="flex gap-3">
                                    <Skeleton className="h-9 w-36 rounded-md" />
                                </div>
                            </div>
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
                        <div className="flex justify-end gap-4 pt-4 border-t">
                            <Skeleton className="h-10 w-24 rounded-md" />
                            <Skeleton className="h-10 w-24 rounded-md" />
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
