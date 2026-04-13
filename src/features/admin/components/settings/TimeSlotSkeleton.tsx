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

/**
 * Skeleton untuk konten TimeSlotList per hari.
 * Dipakai saat useTimeSlots isLoading = true.
 */
export const TimeSlotSkeleton: React.FC = () => (
    <div>
        {/* Sub-header skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 border-b border-slate-100 bg-slate-50/30">
            <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
                <div className="space-y-1.5">
                    <Skeleton className="h-5 w-44" />
                    <Skeleton className="h-3.5 w-32" />
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-32 rounded-lg" />
                <Skeleton className="h-9 w-24 rounded-lg" />
            </div>
        </div>

        {/* Table skeleton */}
        <div className="overflow-hidden">
            <Table>
                <TableHeader className="bg-slate-50 border-b border-slate-200">
                    <TableRow>
                        <TableHead className="py-3 pl-6 w-[200px]"><Skeleton className="h-3 w-12" /></TableHead>
                        <TableHead className="py-3 w-[140px]"><Skeleton className="h-3 w-10" /></TableHead>
                        <TableHead className="py-3 w-[140px]"><Skeleton className="h-3 w-12" /></TableHead>
                        <TableHead className="py-3 w-[150px]"><Skeleton className="h-3 w-8" /></TableHead>
                        <TableHead className="py-3 pr-6 w-[80px]"><Skeleton className="h-3 w-8 mx-auto" /></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: 8 }).map((_, i) => (
                        <TableRow key={i} className="border-b border-slate-100">
                            <TableCell className="py-3 pl-6"><Skeleton className="h-9 w-full rounded-md" /></TableCell>
                            <TableCell className="py-3"><Skeleton className="h-9 w-full rounded-md" /></TableCell>
                            <TableCell className="py-3"><Skeleton className="h-9 w-full rounded-md" /></TableCell>
                            <TableCell className="py-3"><Skeleton className="h-9 w-full rounded-md" /></TableCell>
                            <TableCell className="py-3 pr-6 text-center"><Skeleton className="h-8 w-8 mx-auto rounded-lg" /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>

        <div className="py-3 border-t border-slate-100">
            <Skeleton className="h-3 w-64 mx-auto" />
        </div>
    </div>
);
