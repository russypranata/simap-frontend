"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Search, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/features/shared/utils/dateFormatter";
import { EmptyState, PaginationControls, SkeletonTableRow } from "@/features/shared/components";
import { type AdvisorMember } from "../../services/advisorMembersService";

interface MembersTableProps {
    members: AdvisorMember[];
    isLoading: boolean;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    startIndex: number;
    endIndex: number;
    searchQuery: string;
    classFilter: string;
    onSearchChange: (q: string) => void;
    onClassFilterChange: (c: string) => void;
    onPageChange: (p: number) => void;
    onItemsPerPageChange: (n: number) => void;
    onViewDetail: (member: AdvisorMember) => void;
}

export const MembersTable: React.FC<MembersTableProps> = ({
    members,
    isLoading,
    totalItems,
    currentPage,
    totalPages,
    itemsPerPage,
    startIndex,
    endIndex,
    searchQuery,
    classFilter,
    onSearchChange,
    onClassFilterChange,
    onPageChange,
    onItemsPerPageChange,
    onViewDetail,
}) => (
    <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-semibold">Daftar Anggota Terdaftar</CardTitle>
                        <CardDescription>Anggota aktif pada Tahun Ajaran aktif</CardDescription>
                    </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">{totalItems} Anggota</Badge>
            </div>
        </CardHeader>
        <CardContent className="p-0">
            {/* Toolbar */}
            <div className="p-4 border-b">
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari nama atau NIS anggota..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Select value={classFilter} onValueChange={onClassFilterChange}>
                        <SelectTrigger className="w-full md:w-[180px] bg-white border-slate-200 shadow-sm">
                            <SelectValue placeholder="Semua Kelas" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Kelas</SelectItem>
                            <SelectItem value="X A">X A</SelectItem>
                            <SelectItem value="X B">X B</SelectItem>
                            <SelectItem value="XI A">XI A</SelectItem>
                            <SelectItem value="XI B">XI B</SelectItem>
                            <SelectItem value="XII A">XII A</SelectItem>
                            <SelectItem value="XII B">XII B</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 w-12">No</th>
                            <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 w-24">NIS</th>
                            <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Nama Siswa</th>
                            <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 w-28">Kelas</th>
                            <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 w-36">Tgl Bergabung</th>
                            <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 w-36">Kehadiran</th>
                            <th className="text-center p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 w-24">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, idx) => <SkeletonTableRow key={idx} cols={7} />)
                        ) : members.length === 0 ? (
                            <tr>
                                <td colSpan={7}>
                                    <EmptyState
                                        icon={Search}
                                        title="Tidak ada anggota ditemukan"
                                        description="Coba ubah kata kunci pencarian atau filter kelas"
                                    />
                                </td>
                            </tr>
                        ) : (
                            members.map((member, index) => (
                                <tr
                                    key={member.id}
                                    className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                                >
                                    <td className="p-4 text-sm text-slate-500">{startIndex + index}</td>
                                    <td className="p-4 text-sm font-mono text-slate-600">{member.nis}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                <span className="text-xs font-medium text-blue-800">
                                                    {member.name
                                                        .split(" ")
                                                        .map((n: string) => n[0])
                                                        .join("")
                                                        .substring(0, 2)
                                                        .toUpperCase()}
                                                </span>
                                            </div>
                                            <span className="text-sm font-medium text-slate-800">{member.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <Badge variant="secondary" className="bg-blue-50 text-blue-800 border-blue-200">
                                            {member.class}
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-sm font-mono text-slate-500">
                                        {formatDate(new Date(member.joinDate), "dd MMM yyyy")}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col gap-1.5 w-full max-w-[140px]">
                                            <div className="flex justify-between text-xs">
                                                <span className="font-medium text-slate-700">{member.attendance}%</span>
                                                <span className="text-slate-400">Hadir</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full transition-all duration-500",
                                                        member.attendance >= 90
                                                            ? "bg-emerald-500"
                                                            : member.attendance >= 75
                                                            ? "bg-amber-500"
                                                            : "bg-red-500"
                                                    )}
                                                    style={{ width: `${member.attendance}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 px-3 bg-blue-50 hover:bg-blue-100 text-blue-800 hover:text-blue-900 rounded-lg"
                                            onClick={() => onViewDetail(member)}
                                        >
                                            <Eye className="h-4 w-4 mr-1.5" />
                                            Detail
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                startIndex={startIndex}
                endIndex={endIndex}
                itemsPerPage={itemsPerPage}
                itemLabel="anggota"
                onPageChange={onPageChange}
                onItemsPerPageChange={(val) => {
                    onItemsPerPageChange(val);
                    onPageChange(1);
                }}
            />
        </CardContent>
    </Card>
);
