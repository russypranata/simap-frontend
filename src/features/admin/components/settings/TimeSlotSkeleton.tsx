import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export const TimeSlotSkeleton = () => {
    return (
        <div>
             {/* Header Skeleton */}
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 border-b border-slate-100 bg-slate-50/30">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                     <Skeleton className="h-9 w-32" />
                     <Skeleton className="h-9 w-24" />
                </div>
            </div>

            <div className="overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50 border-b border-slate-200">
                        <TableRow>
                            <TableHead className="w-[200px] py-3 pl-6"><Skeleton className="h-4 w-20" /></TableHead>
                            <TableHead className="w-[150px] py-3"><Skeleton className="h-4 w-16" /></TableHead>
                            <TableHead className="w-[150px] py-3"><Skeleton className="h-4 w-16" /></TableHead>
                            <TableHead className="w-[150px] py-3"><Skeleton className="h-4 w-16" /></TableHead>
                            <TableHead className="w-[100px] py-3 pr-6"><Skeleton className="h-4 w-12 mx-auto" /></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <TableRow key={i} className="border-b border-slate-100">
                                <TableCell className="py-3 pl-6">
                                    <Skeleton className="h-9 w-full" />
                                </TableCell>
                                <TableCell className="py-3">
                                    <Skeleton className="h-9 w-full" />
                                </TableCell>
                                <TableCell className="py-3">
                                    <Skeleton className="h-9 w-full" />
                                </TableCell>
                                <TableCell className="py-3">
                                    <Skeleton className="h-9 w-full" />
                                </TableCell>
                                <TableCell className="py-3 pr-6 text-center">
                                    <Skeleton className="h-9 w-9 mx-auto rounded-md" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export const TimeSlotPageSkeleton = () => {
    return (
        <div className="space-y-6">
            {/* Page Header Skeleton */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-9 w-9 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-96 mt-2" />
                </div>
            </div>

            {/* Card Skeleton */}
            <div className="rounded-xl border border-slate-200 shadow-sm bg-white">
                <div className="p-6 pb-0 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-lg" />
                            <div>
                                <Skeleton className="h-6 w-40 mb-1" />
                                <Skeleton className="h-4 w-64" />
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Tabs Skeleton */}
                <div className="px-6 pt-6 pb-2">
                    <Skeleton className="h-9 w-full rounded-md" />
                </div>

                {/* Content Skeleton */}
                <TimeSlotSkeleton />
            </div>
        </div>
    );
};
