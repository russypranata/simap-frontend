/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const StudentCardSkeleton: React.FC = () => {
    return (
        <div className="flex items-center justify-between p-4 rounded-xl border bg-card animate-pulse">
            <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div className="space-y-2">
                    <div className="h-4 w-32 bg-muted rounded" />
                    <div className="h-3 w-24 bg-muted rounded" />
                </div>
            </div>
            <div className="h-8 w-8 rounded bg-muted" />
        </div>
    );
};

export const StudentListSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <StudentCardSkeleton key={i} />
            ))}
        </div>
    );
};

export const TableRowSkeleton: React.FC = () => {
    return (
        <tr className="border-b animate-pulse">
            <td className="p-4">
                <div className="space-y-2">
                    <div className="h-4 w-28 bg-muted rounded" />
                    <div className="h-5 w-16 bg-muted rounded" />
                </div>
            </td>
            <td className="p-4">
                <div className="h-4 w-20 bg-muted rounded" />
            </td>
            <td className="p-4">
                <div className="space-y-2">
                    <div className="h-4 w-32 bg-muted rounded" />
                    <div className="h-3 w-24 bg-muted rounded" />
                </div>
            </td>
            <td className="p-4">
                <div className="h-4 w-full max-w-md bg-muted rounded" />
            </td>
            <td className="p-4">
                <div className="h-4 w-full max-w-md bg-muted rounded" />
            </td>
            <td className="p-4 text-right">
                <div className="h-8 w-8 bg-muted rounded ml-auto" />
            </td>
        </tr>
    );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
    return (
        <div className="rounded-md border overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b bg-muted/50 text-left">
                        <th className="p-4 font-medium text-muted-foreground w-[150px]">Waktu & Lokasi</th>
                        <th className="p-4 font-medium text-muted-foreground w-[150px]">Guru Penemu</th>
                        <th className="p-4 font-medium text-muted-foreground w-[200px]">Siswa</th>
                        <th className="p-4 font-medium text-muted-foreground">Masalah / Pelanggaran</th>
                        <th className="p-4 font-medium text-muted-foreground">Tindak Lanjut</th>
                        <th className="p-4 font-medium text-muted-foreground text-right w-[50px]"></th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: rows }).map((_, i) => (
                        <TableRowSkeleton key={i} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export const FilterCardSkeleton: React.FC = () => {
    return (
        <Card className="mb-3 border-muted bg-muted/10 animate-pulse">
            <CardContent className="px-4 py-2">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="col-span-1 space-y-1">
                            <div className="h-4 w-20 bg-muted rounded" />
                            <div className="h-10 w-full bg-muted rounded" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
