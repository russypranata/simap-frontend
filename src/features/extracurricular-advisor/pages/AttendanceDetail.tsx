"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, CheckCircle, Clock, Users, Search, XCircle, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDate } from "@/features/shared/utils/dateFormatter";
import { cn } from "@/lib/utils";
import { AttendanceDetailSkeleton } from "../components/AdvisorSkeletons";
import { useAdvisorAttendanceDetail } from "../hooks/useAdvisorAttendanceDetail";

const STATUS_BADGE: Record<string, string> = {
    hadir: "bg-green-100 text-green-700 border-green-200",
    sakit: "bg-yellow-100 text-yellow-700 border-yellow-200",
    izin: "bg-sky-100 text-sky-700 border-sky-200",
    alpa: "bg-red-100 text-red-700 border-red-200",
};

const STATUS_ICON: Record<string, React.ReactNode> = {
    hadir: <CheckCircle className="h-3 w-3" />,
    sakit: <AlertCircle className="h-3 w-3" />,
    izin: <Clock className="h-3 w-3" />,
    alpa: <XCircle className="h-3 w-3" />,
};

export const AttendanceDetailPage: React.FC = () => {
    const params = useParams();
    const id = Number(params.id);

    const {
        detail, stats, isLoading,
        searchTerm, setSearchTerm,
        statusFilter, setStatusFilter,
        classFilter, setClassFilter,
        uniqueClasses,
        currentPage, setCurrentPage, itemsPerPage,
        filteredStudents, paginatedStudents, totalPages,
    } = useAdvisorAttendanceDetail(id);

    if (isLoading) return <AttendanceDetailSkeleton />;

    if (!detail) return (
        <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-lg font-semibold">Data Tidak Ditemukan</h2>
            <p className="text-muted-foreground">Detail presensi tidak dapat ditemukan.</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">Coba Lagi</Button>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold tracking-tight">
                        <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Detail Riwayat </span>
                        <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Presensi</span>
                    </h1>
                    <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                        <CheckCircle className="h-5 w-5" />
                    </div>
                </div>
                <p className="text-muted-foreground mt-1">Rincian lengkap data kehadiran siswa pada pertemuan ekstrakurikuler</p>
            </div>

            {/* Activity Info Card */}
            <Card className="overflow-hidden p-0 gap-0">
                <div className="bg-blue-800 p-4 rounded-t-lg relative overflow-hidden">
                    <div className="absolute -right-6 -bottom-6 text-white/10 transform rotate-12">
                        <Calendar className="w-32 h-32" />
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-lg">
                                <Calendar className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-white">{detail.topic || "Kegiatan Rutin"}</h3>
                                <p className="text-blue-100 text-sm">Ekstrakurikuler Pramuka</p>
                            </div>
                        </div>
                        <Badge className="bg-green-500 text-white border-0 gap-1 px-2.5 py-1 text-xs font-medium w-fit">
                            <CheckCircle className="h-3.5 w-3.5" />
                            Presensi Lengkap
                        </Badge>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x border-b">
                    {[
                        { icon: Calendar, color: "blue", label: "Tanggal", value: formatDate(detail.date, "dd MMMM yyyy") },
                        { icon: Clock, color: "purple", label: "Waktu", value: `${detail.advisorStats.startTime} - ${detail.advisorStats.endTime} WIB` },
                        { icon: Users, color: "green", label: "Tutor", value: detail.advisorStats.tutorName },
                        {
                            icon: CheckCircle, color: stats.percentage >= 90 ? "green" : stats.percentage >= 75 ? "amber" : "red",
                            label: "Kehadiran", value: `${stats.present}/${stats.total} (${stats.percentage}%)`
                        },
                    ].map(({ icon: Icon, color, label, value }) => (
                        <div key={label} className="px-3 py-4 flex items-center gap-3">
                            <div className={`p-1.5 bg-${color}-50 rounded-lg`}>
                                <Icon className={`h-4 w-4 text-${color}-600`} />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">{label}</p>
                                <p className={`text-sm font-semibold text-${color}-700`}>{value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-5 divide-x">
                    {[
                        { icon: Users, color: "blue", label: "Total", value: stats.total },
                        { icon: CheckCircle, color: "green", label: "Hadir", value: stats.present },
                        { icon: AlertCircle, color: "yellow", label: "Sakit", value: stats.sick },
                        { icon: Clock, color: "sky", label: "Izin", value: stats.permit },
                        { icon: XCircle, color: "red", label: "Alpa", value: stats.absent },
                    ].map(({ icon: Icon, color, label, value }) => (
                        <div key={label} className="p-3 text-center">
                            <div className={`inline-flex p-2 bg-${color}-100 rounded-full mb-1.5`}>
                                <Icon className={`h-4 w-4 text-${color}-600`} />
                            </div>
                            <p className={`text-xl font-bold text-${color}-600`}>{value}</p>
                            <p className="text-xs text-muted-foreground">{label}</p>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Student List */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold">Daftar Kehadiran Siswa</CardTitle>
                            <CardDescription>Data kehadiran setiap siswa pada kegiatan ini</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="p-4 border-b">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Cari nama atau NIS..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 pr-9" />
                                {searchTerm && (
                                    <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                        <XCircle className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <Label className="text-sm whitespace-nowrap">Kelas:</Label>
                                <Select value={classFilter} onValueChange={setClassFilter}>
                                    <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua</SelectItem>
                                        {uniqueClasses.map((cls) => <SelectItem key={cls} value={cls}>{cls}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <Label className="text-sm whitespace-nowrap">Status:</Label>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua</SelectItem>
                                        <SelectItem value="hadir">Hadir</SelectItem>
                                        <SelectItem value="sakit">Sakit</SelectItem>
                                        <SelectItem value="izin">Izin</SelectItem>
                                        <SelectItem value="alpa">Alpa</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        {(searchTerm || statusFilter !== "all" || classFilter !== "all") && (
                            <div className="flex justify-end mt-4">
                                <Button variant="ghost" size="sm" className="text-muted-foreground"
                                    onClick={() => { setSearchTerm(""); setStatusFilter("all"); setClassFilter("all"); }}>
                                    Reset Filter
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="text-left p-4 font-medium text-sm w-12">No</th>
                                    <th className="text-left p-4 font-medium text-sm w-24">NIS</th>
                                    <th className="text-left p-4 font-medium text-sm min-w-48">Nama Siswa</th>
                                    <th className="text-left p-4 font-medium text-sm w-24">Kelas</th>
                                    <th className="text-center p-4 font-medium text-sm w-32">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="rounded-full bg-muted p-6">
                                                    <Search className="h-12 w-12 text-muted-foreground" />
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {searchTerm ? `Tidak ada siswa yang cocok dengan "${searchTerm}"` : "Tidak ada data sesuai filter."}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedStudents.map((student, index) => (
                                        <tr key={student.id} className="border-b hover:bg-muted/30 transition-colors">
                                            <td className="p-4 text-sm">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                            <td className="p-4 text-sm font-mono">{student.nis}</td>
                                            <td className="p-4 text-sm font-medium">{student.name}</td>
                                            <td className="p-4">
                                                <Badge className="bg-blue-50 text-blue-800 border-blue-200">{student.class}</Badge>
                                            </td>
                                            <td className="p-4 text-center">
                                                <Badge className={cn("gap-1", STATUS_BADGE[student.status] || "bg-gray-100 text-gray-700")}>
                                                    {STATUS_ICON[student.status]}
                                                    {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 border-t bg-muted/20">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan <span className="font-medium text-foreground">{filteredStudents.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span>
                            {" "}-{" "}<span className="font-medium text-foreground">{Math.min(currentPage * itemsPerPage, filteredStudents.length)}</span>
                            {" "}dari <span className="font-medium text-foreground">{filteredStudents.length}</span> data
                        </p>
                        {totalPages > 1 && (
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="h-8 w-8 p-0">
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    const p = totalPages <= 5 ? i + 1 : currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i;
                                    return (
                                        <Button key={p} variant={currentPage === p ? "default" : "outline"} size="sm"
                                            onClick={() => setCurrentPage(p)}
                                            className={cn("w-8 h-8 p-0", currentPage === p && "bg-blue-800 hover:bg-blue-900 text-white")}>
                                            {p}
                                        </Button>
                                    );
                                })}
                                <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="h-8 w-8 p-0">
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
