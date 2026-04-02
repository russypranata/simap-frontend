"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

/** Skeleton untuk satu StatCard */
export const SkeletonStatCard: React.FC = () => (
    <div className="group relative overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="px-5 py-4 pl-6 flex items-center gap-4">
            <Skeleton className="w-11 h-11 rounded-xl flex-shrink-0" />
            <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-3 w-24" />
                <div className="flex items-baseline gap-2">
                    <Skeleton className="h-7 w-12" />
                    <Skeleton className="h-4 w-10" />
                </div>
                <Skeleton className="h-3 w-28" />
            </div>
        </div>
    </div>
);

/** Skeleton untuk header halaman (title + description) */
export const SkeletonPageHeader: React.FC<{ withAction?: boolean }> = ({ withAction }) => (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-48" />
        </div>
        {withAction && <Skeleton className="h-9 w-[220px]" />}
    </div>
);

/** Skeleton untuk card header (icon + title + description) */
export const SkeletonCardHeader: React.FC = () => (
    <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
        </div>
    </div>
);

/** Skeleton untuk satu baris list item */
export const SkeletonListItem: React.FC = () => (
    <div className="rounded-xl border bg-card p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
            <Skeleton className="h-5 w-20 rounded-full" />
            <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-16" />
            </div>
        </div>
        <Skeleton className="h-5 w-full max-w-md" />
        <Skeleton className="h-16 w-full rounded-lg" />
        <Skeleton className="h-4 w-48" />
    </div>
);

/** Skeleton untuk satu baris tabel */
export const SkeletonTableRow: React.FC<{ cols?: number }> = ({ cols = 5 }) => (
    <tr className="border-b border-slate-100">
        {Array.from({ length: cols }).map((_, i) => (
            <td key={i} className="p-3 align-middle">
                <Skeleton className="h-4 w-full" />
            </td>
        ))}
    </tr>
);
