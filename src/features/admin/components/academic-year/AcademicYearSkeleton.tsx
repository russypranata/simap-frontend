'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const AcademicYearListSkeleton: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-96 mt-2" />
                </div>
                <Skeleton className="h-10 w-48" />
            </div>

            {/* Stats Skeleton */}
            <div className="bg-white border border-slate-200 rounded-lg">
                <div className="flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-slate-200">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex-1 w-full px-5 py-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-8 w-12" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                                <Skeleton className="h-10 w-10 rounded-lg" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Table Skeleton */}
            <Card className="border-slate-200">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-lg" />
                            <div>
                                <Skeleton className="h-6 w-40 mb-1" />
                                <Skeleton className="h-4 w-56" />
                            </div>
                        </div>
                        <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    {['No', 'Tahun Ajaran', 'Periode', 'Semester Aktif', 'Status', 'Aksi'].map((header, i) => (
                                        <th key={i} className="text-left p-4">
                                            <Skeleton className="h-4 w-20" />
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <tr key={i} className="border-b">
                                        <td className="p-4 text-center"><Skeleton className="h-4 w-6 mx-auto" /></td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <Skeleton className="h-10 w-10 rounded-lg" />
                                                <div className="space-y-1">
                                                    <Skeleton className="h-5 w-24" />
                                                    <Skeleton className="h-3 w-16" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="space-y-1">
                                                <Skeleton className="h-4 w-32" />
                                                <Skeleton className="h-3 w-24" />
                                            </div>
                                        </td>
                                        <td className="p-4 text-center"><Skeleton className="h-6 w-20 rounded-full mx-auto" /></td>
                                        <td className="p-4 text-center"><Skeleton className="h-6 w-20 rounded-full mx-auto" /></td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <Skeleton className="h-8 w-8 rounded-lg" />
                                                <Skeleton className="h-8 w-8 rounded-lg" />
                                                <Skeleton className="h-8 w-8 rounded-lg" />
                                            </div>
                                        </td>
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

export const AcademicYearDetailSkeleton: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>

            {/* Combined Card Skeleton */}
            <Card className="border-slate-200">
                <div className="flex flex-col lg:flex-row">
                    {/* Info Section */}
                    <div className="flex-1">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-lg" />
                                <div>
                                    <Skeleton className="h-6 w-32 mb-1" />
                                    <Skeleton className="h-4 w-48" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex justify-between items-center py-2 border-b last:border-0 pl-1">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            ))}
                        </CardContent>
                    </div>

                    {/* Divider */}
                    <div className="hidden lg:block w-px bg-slate-200"></div>

                    {/* Semesters Section */}
                    <div className="flex-1">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-lg" />
                                <div>
                                    <Skeleton className="h-6 w-32 mb-1" />
                                    <Skeleton className="h-4 w-48" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="p-4 border border-slate-200 rounded-lg">
                                    <div className="flex justify-between items-start pb-2 border-b border-gray-100 mb-3">
                                        <Skeleton className="h-5 w-32" />
                                        <Skeleton className="h-6 w-16 rounded-full" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <Skeleton className="h-4 w-16" />
                                            <Skeleton className="h-4 w-24" />
                                        </div>
                                        <div className="flex justify-between">
                                            <Skeleton className="h-4 w-16" />
                                            <Skeleton className="h-4 w-24" />
                                        </div>
                                        <div className="flex justify-between pt-2 border-t border-dashed">
                                            <Skeleton className="h-3 w-20" />
                                            <Skeleton className="h-3 w-24" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-9 w-full mt-3 rounded-md" />
                                </div>
                            ))}
                        </CardContent>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export const AcademicYearFormSkeleton: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <Skeleton className="h-4 w-96" />
            </div>

            {/* Form Card */}
            <Card>
                <CardHeader>
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="space-y-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full rounded-lg" />
                        </div>
                    ))}
                    <div className="flex gap-3 pt-4">
                        <Skeleton className="h-10 w-24 rounded-lg" />
                        <Skeleton className="h-10 w-24 rounded-lg" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
