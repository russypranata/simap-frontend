"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Search, CheckCircle, AlertCircle, Clock, XCircle, CheckCheck, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState, PaginationControls, SkeletonTableRow } from "@/features/shared/components";
import { type AdvisorMember } from "../../services/advisorMembersService";
import { type AttendanceStatus, type AttendanceRecord } from "../../hooks/useAdvisorAttendance";

export interface AttendanceTableProps {
    members: AdvisorMember[];
    paginatedMembers: AdvisorMember[];
    filteredMembers: AdvisorMember[];
    attendanceRecords: Map<number, AttendanceRecord>;
    isLoading: boolean;
    presentCount: number;
    currentSessionPercentage: number;
    searchTerm: string;
    statusFilter: "all" | AttendanceStatus;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    onSearchChange: (s: string) => void;
    onStatusFilterChange: (s: "all" | AttendanceStatus) => void;
    onStatusChange: (studentId: number, status: AttendanceStatus) => void;
    onMarkAllPresent: () => void;
    onPageChange: (p: number) => void;
    onItemsPerPageChange: (n: number) => void;
    onSave: () => void;
    getStatusBadgeClass: (status: AttendanceStatus) => string;
}

const STATUS_CONFIG: Record<AttendanceStatus, { label: string; icon: React.ElementType; activeClass: string; inactiveClass: string }> = {
    hadir: { label: "Hadir", icon: CheckCircle, activeClass: "bg-green-50 text-green-700 border-green-200 font-medium", inactiveClass: "text-green-600 border-green-200 hover:bg-green-50" },
    sakit: { label: "Sakit", icon: AlertCircle, activeClass: "bg-yellow-50 text-yellow-700 border-yellow-200 font-medium", inactiveClass: "text-yellow-600 border-yellow-200 hover:bg-yellow-50" },
    izin: { label: "Izin", icon: Clock, activeClass: "bg-sky-50 text-sky-700 border-sky-200 font-medium", inactiveClass: "text-sky-600 border-sky-200 hover:bg-sky-50" },
    alpa: { label: "Alpa", icon: XCircle, activeClass: "bg-red-50 text-red-700 border-red-200 font-medium", inactiveClass: "text-red-600 border-red-200 hover:bg-red-50" },
};

export const AttendanceTable: React.FC<AttendanceTableProps> = ({
    members, paginatedMembers, filteredMembers, attendanceRecords, isLoading,
    presentCount, currentSessionPercentage, searchTerm, statusFilter,
    currentPage, totalPages, itemsPerPage,
    onSearchChange, onStatusFilterChange, onStatusChange, onMarkAllPresent,
    onPageChange, onItemsPerPageChange, onSave, getStatusBadgeClass,
}) => (
    <Card>
        <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        <Users className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-semibold">Daftar Anggota</CardTitle>
                        <CardDescription>Catat status kehadiran untuk setiap anggota</CardDescription>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge className="bg-blue-50 text-blue-800 border-blue-200">{filteredMembers.length} Anggota</Badge>
                    <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-lg border">
                        <span className="text-sm font-medium">
                            <span className="text-green-600 font-semibold">{presentCount}</span>
                            <span className="text-muted-foreground mx-1">/</span>
                            <span className="font-semibold">{members.length}</span>
                            <span className="text-muted-foreground ml-1">hadir</span>
                        </span>
                        <div className="h-4 w-px bg-border" />
                        <Badge variant="outline" className={cn(
                            "font-semibold",
                            currentSessionPercentage >= 90 ? "bg-green-50 text-green-700 border-green-200"
                                : currentSessionPercentage >= 75 ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                : "bg-red-50 text-red-700 border-red-200"
                        )}>
                            {currentSessionPercentage}%
                        </Badge>
                    </div>
                </div>
            </div>
        </CardHeader>

        <div className="px-6 py-4 border-b">
            <div className="flex flex-col lg:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Cari nama, NIS, atau kelas..." value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} className="pl-10" />
                </div>
                <Select value={statusFilter} onValueChange={(v: "all" | AttendanceStatus) => onStatusFilterChange(v)}>
                    <SelectTrigger className="w-full lg:w-40 bg-white border-slate-200 shadow-sm">
                        <SelectValue placeholder="Semua Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        {(Object.keys(STATUS_CONFIG) as AttendanceStatus[]).map((s) => (
                            <SelectItem key={s} value={s}>{STATUS_CONFIG[s].label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button
                    variant="outline"
                    onClick={onMarkAllPresent}
                    disabled={filteredMembers.length === 0}
                    className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800 w-full lg:w-auto"
                >
                    <CheckCheck className="h-4 w-4 mr-2" />
                    Tandai {filteredMembers.length > 0 ? filteredMembers.length : ""} Siswa Hadir
                </Button>
            </div>
        </div>

        <CardContent className="p-0">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 w-12">No</th>
                            <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 w-24">NIS</th>
                            <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Nama Siswa</th>
                            <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 w-24">Kelas</th>
                            <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Status Kehadiran</th>
                            <th className="text-center p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 w-28">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => <SkeletonTableRow key={i} cols={6} />)
                        ) : paginatedMembers.length === 0 ? (
                            <tr>
                                <td colSpan={6}>
                                    <EmptyState
                                        icon={Search}
                                        title="Tidak ada data ditemukan"
                                        description={searchTerm ? `Tidak ada anggota yang cocok dengan "${searchTerm}"` : "Tidak ada data anggota tersedia."}
                                    />
                                </td>
                            </tr>
                        ) : (
                            paginatedMembers.map((member, index) => {
                                const record = attendanceRecords.get(member.id);
                                const status = record?.status;
                                const globalIndex = (currentPage - 1) * itemsPerPage + index + 1;
                                return (
                                    <tr key={member.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4 text-sm text-slate-500">{globalIndex}</td>
                                        <td className="p-4 text-sm font-mono text-slate-600">{member.nis}</td>
                                        <td className="p-4 text-sm font-medium text-slate-800">{member.name}</td>
                                        <td className="p-4">
                                            <Badge className="bg-blue-50 text-blue-800 border-blue-200">{member.class}</Badge>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1 flex-wrap">
                                                {(Object.keys(STATUS_CONFIG) as AttendanceStatus[]).map((s) => {
                                                    const { label, icon: Icon, activeClass, inactiveClass } = STATUS_CONFIG[s];
                                                    const isActive = status === s;
                                                    return (
                                                        <Button key={s} variant="outline" size="sm"
                                                            onClick={() => onStatusChange(member.id, s)}
                                                            className={cn("h-8 px-2 text-xs transition-all", isActive ? activeClass : inactiveClass)}
                                                        >
                                                            <Icon className="h-3 w-3 mr-1.5" />
                                                            {label}
                                                        </Button>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            {status ? (
                                                <Badge className={getStatusBadgeClass(status)}>
                                                    {STATUS_CONFIG[status].label}
                                                </Badge>
                                            ) : (
                                                <span className="text-muted-foreground text-sm italic">Belum diisi</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 border-t border-slate-100">
                <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filteredMembers.length}
                    startIndex={filteredMembers.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
                    endIndex={Math.min(currentPage * itemsPerPage, filteredMembers.length)}
                    itemsPerPage={itemsPerPage}
                    itemLabel="anggota"
                    onPageChange={onPageChange}
                    onItemsPerPageChange={(val) => { onItemsPerPageChange(val); onPageChange(1); }}
                />
                <Button onClick={onSave} className="bg-blue-800 text-white hover:bg-blue-900 w-full lg:w-auto">
                    <Save className="h-4 w-4 mr-2" />
                    Simpan Presensi
                </Button>
            </div>
        </CardContent>
    </Card>
);
