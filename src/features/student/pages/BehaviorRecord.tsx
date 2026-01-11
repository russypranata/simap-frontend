"use client";

import React, { useState, useMemo } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Calendar,
    AlertTriangle,
    Clock,
    MapPin,
    User,
    FileText,
    ClipboardList,
    Building,
    Home,
    AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface ViolationRecord {
    id: number;
    date: string;
    time: string;
    location: "sekolah" | "asrama";
    problem: string;
    followUp: string;
    reporterName: string;
    reporterGender: "L" | "P";
    reporterRole?: string;
    academicYear: string;
}



// Mock data
const mockViolations: ViolationRecord[] = [
    {
        id: 1,
        date: "2025-12-20",
        time: "07:15",
        location: "sekolah",
        problem: "Terlambat masuk kelas 15 menit",
        followUp: "Peringatan lisan dan catatan di buku pelanggaran",
        reporterName: "Hendra Wijaya",
        reporterGender: "L",
        reporterRole: "Guru Piket",
        academicYear: "2025/2026",
    },
    {
        id: 2,
        date: "2025-12-15",
        time: "08:00",
        location: "sekolah",
        problem: "Tidak memakai dasi saat upacara",
        followUp: "Peringatan dan wajib bawa dasi keesokan harinya",
        reporterName: "Linda Kusuma",
        reporterGender: "P",
        reporterRole: "Guru BK",
        academicYear: "2025/2026",
    },
    {
        id: 3,
        date: "2025-11-28",
        time: "21:30",
        location: "asrama",
        problem: "Keluar kamar setelah jam malam tanpa izin",
        followUp: "Teguran dari pembina asrama dan pemanggilan wali",
        reporterName: "Ahmad Zulfikar",
        reporterGender: "L",
        reporterRole: "Pembina Asrama",
        academicYear: "2025/2026",
    },
    {
        id: 4,
        date: "2025-03-10",
        time: "10:00",
        location: "sekolah",
        problem: "Tidak mengerjakan tugas",
        followUp: "Wajib mengumpulkan tugas dan tambahan tugas",
        reporterName: "Ahmad Hidayat",
        reporterGender: "L",
        reporterRole: "Guru Matematika",
        academicYear: "2024/2025",
    },
];

export const StudentBehaviorRecord: React.FC = () => {
    const [locationFilter, setLocationFilter] = useState("all");

    // Filter records by location
    const filteredRecords = useMemo(() => {
        return mockViolations.filter(r => {
            const matchesLocation = locationFilter === "all" || r.location === locationFilter;
            return matchesLocation;
        });
    }, [locationFilter]);

    // Sort by date (newest first)
    const sortedRecords = useMemo(() => {
        return [...filteredRecords].sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    }, [filteredRecords]);

    // Stats for filtered records
    const totalViolations = filteredRecords.length;
    const schoolViolations = filteredRecords.filter(r => r.location === "sekolah").length;
    const dormViolations = filteredRecords.filter(r => r.location === "asrama").length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Catatan </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Perilaku</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <ClipboardList className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Catatan pelanggaran selama di sekolah dan asrama
                    </p>
                    <div className="flex items-center gap-3 mt-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm font-semibold">Tahun Ajaran 2025/2026</span>
                        </div>
                        <div className="h-4 w-[1px] bg-border" />
                        <span className="text-sm font-medium text-blue-800">Semester Ganjil</span>
                    </div>
                </div>
            </div>



            {/* Stats Card - Combined Style (Mutamayizin Grid + Teacher Layout) */}
            <Card className="overflow-hidden p-0">
                {/* Header - Mutamayizin Style */}
                <div className="bg-blue-800 p-4 relative overflow-hidden">
                    {/* Decorative Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-40 h-40 border-[20px] border-white rounded-full -translate-y-1/2 translate-x-1/4" />
                        <div className="absolute bottom-0 right-1/3 w-20 h-20 border-[8px] border-white rounded-full translate-y-1/2" />
                    </div>

                    <div className="flex items-center gap-3 relative z-10">
                        <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                            <ClipboardList className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Ringkasan Catatan</h2>
                            <p className="text-blue-100 text-sm">Ringkasan seluruh catatan pelanggaran</p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid - Original Divider Layout with Teacher Pattern */}
                <CardContent className="p-0">
                    <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x">
                        {/* Total Pelanggaran */}
                        <div className="pt-3 pb-4 px-5 relative">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide pr-10">Total Pelanggaran</p>
                            <div className="absolute top-3 right-5 p-2.5 rounded-lg bg-red-50">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                            </div>
                            <div className="text-2xl font-bold text-foreground mt-2">{totalViolations}</div>
                            <p className="text-xs text-muted-foreground mt-1">Sepanjang waktu</p>
                        </div>

                        {/* Di Sekolah */}
                        <div className="pt-3 pb-4 px-5 relative">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide pr-10">Di Sekolah</p>
                            <div className="absolute top-3 right-5 p-2.5 rounded-lg bg-blue-50">
                                <Building className="h-5 w-5 text-blue-800" />
                            </div>
                            <div className="text-2xl font-bold text-foreground mt-2">{schoolViolations}</div>
                            <p className="text-xs text-muted-foreground mt-1">Pelanggaran di sekolah</p>
                        </div>

                        {/* Di Asrama */}
                        <div className="pt-3 pb-4 px-5 relative">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide pr-10">Di Asrama</p>
                            <div className="absolute top-3 right-5 p-2.5 rounded-lg bg-amber-50">
                                <Home className="h-5 w-5 text-amber-600" />
                            </div>
                            <div className="text-2xl font-bold text-foreground mt-2">{dormViolations}</div>
                            <p className="text-xs text-muted-foreground mt-1">Pelanggaran di asrama</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Record List */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <ClipboardList className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Riwayat Pelanggaran</CardTitle>
                                <CardDescription>Catatan pelanggaran yang pernah dilakukan</CardDescription>
                            </div>
                        </div>
                        <Select value={locationFilter} onValueChange={setLocationFilter}>
                            <SelectTrigger className="w-[130px]">
                                <MapPin className="h-4 w-4 mr-2" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua</SelectItem>
                                <SelectItem value="sekolah">Sekolah</SelectItem>
                                <SelectItem value="asrama">Asrama</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>

                <CardContent>
                    {sortedRecords.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="inline-flex p-4 bg-green-100 rounded-full mb-4">
                                <AlertCircle className="h-10 w-10 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-lg text-foreground">Tidak Ada Catatan</h3>
                            <p className="text-muted-foreground mt-1">Tidak ada catatan pelanggaran untuk periode ini</p>
                            <p className="text-sm text-green-600 mt-2 font-medium">Pertahankan perilaku baikmu! 👏</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {sortedRecords.map((record, index) => (
                                <div
                                    key={record.id}
                                    className="group p-4 rounded-lg border border-red-200 bg-card hover:bg-muted/30 transition-colors"
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Number Badge - Red Accent */}
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-xs font-semibold text-red-700">
                                            {index + 1}
                                        </div>

                                        <div className="flex-1 min-w-0 space-y-2">
                                            {/* Header Row */}
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <div className="flex items-center gap-2">
                                                    <Badge
                                                        variant="outline"
                                                        className={cn(
                                                            "text-xs",
                                                            record.location === "sekolah"
                                                                ? "bg-blue-50 text-blue-800 border-blue-200"
                                                                : "bg-amber-50 text-amber-700 border-amber-200"
                                                        )}
                                                    >
                                                        {record.location === "sekolah" ? (
                                                            <><Building className="h-3 w-3 mr-1" /> Sekolah</>
                                                        ) : (
                                                            <><Home className="h-3 w-3 mr-1" /> Asrama</>
                                                        )}
                                                    </Badge>
                                                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(record.date).toLocaleDateString("id-ID", {
                                                            weekday: "long",
                                                            day: "numeric",
                                                            month: "long",
                                                            year: "numeric"
                                                        })}
                                                    </span>
                                                </div>
                                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Clock className="h-3 w-3" />
                                                    {record.time}
                                                </span>
                                            </div>

                                            {/* Problem */}
                                            <h4 className="font-medium text-foreground leading-snug">
                                                {record.problem}
                                            </h4>

                                            {/* Follow Up */}
                                            <div className="pt-2">
                                                <span className="text-xs font-medium text-muted-foreground block mb-1">Tindak Lanjut</span>
                                                <p className="text-sm text-foreground/80 leading-relaxed">
                                                    {record.followUp}
                                                </p>
                                            </div>

                                            {/* Reporter */}
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                                                <User className="h-3 w-3" />
                                                <span>
                                                    Dilaporkan oleh <span className="font-semibold text-foreground">{record.reporterGender === "L" ? "Pak" : "Bu"} {record.reporterName}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="h-5 w-5 text-blue-800" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-blue-900">Informasi</h3>
                            <p className="text-sm text-blue-800 mt-1">
                                Catatan pelanggaran ini dilaporkan oleh guru yang melihat kejadian pelanggaran.
                                Jika memiliki pertanyaan atau sanggahan, silakan hubungi guru yang bersangkutan.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card >
        </div >
    );
};
