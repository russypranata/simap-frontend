/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useMemo, useEffect } from "react";
import {
    Calendar as CalendarIcon,
    Trophy,
    Search,
    XCircle,
    AlertCircle,
    CheckCircle,
    Clock,
    Award,
    Download,
    LayoutGrid,
    History as HistoryIcon,
    Loader2,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";

// ─── Types ───────────────────────────────────────────────────────────────────

interface AttendanceRecord {
    date: string;
    eskul: string;
    status: string;
    topic?: string;
}

interface AttendanceStudent {
    id: number;
    nama: string;
    nis: string;
    kelas: string;
    records: AttendanceRecord[];
}

interface GradesStudent {
    id: number;
    nama: string;
    nis: string;
    eskul: string;
    membership_id: number;
    total_hadir: number;
    total_pertemuan: number;
    attendance_rate: number;
    scores: Record<string, number>;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const ExtracurricularAttendance = () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [selectedEskul, setSelectedEskul] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState("history");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    // API state
    const [attendanceData, setAttendanceData] = useState<{
        students: AttendanceStudent[];
        ekskul_list: string[];
    } | null>(null);
    const [gradesData, setGradesData] = useState<{
        students: GradesStudent[];
        ekskul_list: string[];
    } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    // Derive ekskul list from whichever data is available
    const ekskulList: string[] = useMemo(() => {
        if (activeTab === "history" && attendanceData?.ekskul_list?.length) {
            return attendanceData.ekskul_list;
        }
        if (activeTab === "recap" && gradesData?.ekskul_list?.length) {
            return gradesData.ekskul_list;
        }
        return [];
    }, [activeTab, attendanceData, gradesData]);

    // Auto-select first ekskul when list changes
    useEffect(() => {
        if (ekskulList.length > 0 && !ekskulList.includes(selectedEskul)) {
            setSelectedEskul(ekskulList[0]);
        }
    }, [ekskulList, selectedEskul]);

    // ─── Data Fetching ────────────────────────────────────────────────────────

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                if (activeTab === "history") {
                    const params = new URLSearchParams();
                    if (selectedEskul) params.set("ekskul_name", selectedEskul);
                    if (date) params.set("date", format(date, "yyyy-MM-dd"));
                    const data = await apiClient.get<{
                        students: AttendanceStudent[];
                        ekskul_list: string[];
                    }>(`/teacher/homeroom/extracurricular-attendance?${params.toString()}`);
                    setAttendanceData(data);
                } else {
                    const data = await apiClient.get<{
                        students: GradesStudent[];
                        ekskul_list: string[];
                    }>("/teacher/homeroom/extracurricular-grades");
                    setGradesData(data);
                }
            } catch {
                // silently ignore — empty state will be shown
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [activeTab, selectedEskul, date]);

    // ─── Export ───────────────────────────────────────────────────────────────

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const token = localStorage.getItem("authToken");
            const apiUrl =
                process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
            const response = await fetch(
                `${apiUrl}/teacher/homeroom/extracurricular-grades/export`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "text/csv",
                    },
                }
            );
            if (!response.ok) throw new Error("Export gagal");
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "nilai-ekskul.csv";
            a.click();
            URL.revokeObjectURL(url);
        } catch {
            // silently ignore
        } finally {
            setIsExporting(false);
        }
    };

    // ─── Derived Data ─────────────────────────────────────────────────────────

    // Flatten attendance records for history tab: one row per record per student
    const historyRows = useMemo(() => {
        if (!attendanceData) return [];
        const rows: Array<{
            id: string;
            studentId: number;
            nama: string;
            nis: string;
            kelas: string;
            eskul: string;
            date: string;
            status: string;
            topic?: string;
        }> = [];
        attendanceData.students.forEach((student) => {
            if (student.records.length === 0) {
                // Show student even if no records on this date
                rows.push({
                    id: `${student.id}-empty`,
                    studentId: student.id,
                    nama: student.nama,
                    nis: student.nis,
                    kelas: student.kelas,
                    eskul: "-",
                    date: "-",
                    status: "-",
                    topic: undefined,
                });
            } else {
                student.records.forEach((rec, idx) => {
                    rows.push({
                        id: `${student.id}-${idx}`,
                        studentId: student.id,
                        nama: student.nama,
                        nis: student.nis,
                        kelas: student.kelas,
                        eskul: rec.eskul,
                        date: rec.date,
                        status: rec.status,
                        topic: rec.topic,
                    });
                });
            }
        });
        return rows;
    }, [attendanceData]);

    // Stats for history tab
    const stats = useMemo(() => {
        const initial = { Hadir: 0, Sakit: 0, Izin: 0, Alpha: 0 };
        historyRows.forEach((row) => {
            if (row.status in initial) {
                initial[row.status as keyof typeof initial]++;
            }
        });
        return initial;
    }, [historyRows]);

    const attendancePercentage = useMemo(() => {
        const total = historyRows.length;
        if (total === 0) return "0.0";
        return ((stats.Hadir / total) * 100).toFixed(1);
    }, [stats, historyRows.length]);

    // Filtered history rows
    const filteredHistoryRows = useMemo(() => {
        return historyRows.filter((row) => {
            const matchesSearch =
                row.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                row.nis.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus =
                statusFilter === "all" || row.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [historyRows, searchTerm, statusFilter]);

    // Filtered grades rows
    const filteredGradesRows = useMemo(() => {
        if (!gradesData) return [];
        return gradesData.students.filter((student) => {
            return (
                student.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.nis.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
    }, [gradesData, searchTerm]);

    // Pagination
    const activeRows =
        activeTab === "history" ? filteredHistoryRows : filteredGradesRows;
    const totalPages = Math.ceil(activeRows.length / itemsPerPage);
    const paginatedRows = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return activeRows.slice(start, start + itemsPerPage);
    }, [activeRows, currentPage, itemsPerPage]);

    // Dynamic score columns for recap tab
    const scoreColumns = useMemo(() => {
        if (!gradesData || gradesData.students.length === 0) return [];
        const keys = new Set<string>();
        gradesData.students.forEach((s) => {
            Object.keys(s.scores).forEach((k) => keys.add(k));
        });
        return Array.from(keys);
    }, [gradesData]);

    // ─── Helpers ──────────────────────────────────────────────────────────────

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Hadir":
                return "bg-green-100 text-green-800 border-green-200";
            case "Sakit":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "Izin":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "Alpha":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Hadir":
                return <CheckCircle className="h-3 w-3 mr-1" />;
            case "Sakit":
                return <AlertCircle className="h-3 w-3 mr-1" />;
            case "Izin":
                return <Clock className="h-3 w-3 mr-1" />;
            case "Alpha":
                return <XCircle className="h-3 w-3 mr-1" />;
            default:
                return null;
        }
    };

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <div className="space-y-6">
            <div className="flex flex-col space-y-1">
                <h3 className="text-2xl font-bold tracking-tight">
                    Presensi Ekstrakurikuler
                </h3>
                <p className="text-muted-foreground text-sm/relaxed max-w-2xl">
                    Kelola kehadiran dan penilaian ekstrakurikuler siswa.
                </p>
            </div>

            <Tabs
                value={activeTab}
                onValueChange={(val) => {
                    setActiveTab(val);
                    setCurrentPage(1);
                    setSearchTerm("");
                }}
                className="w-full"
            >
                {/* Tab switcher */}
                <div className="flex flex-col space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <LayoutGrid className="h-4 w-4" />
                        <span className="text-sm font-medium">Mode Tampilan</span>
                    </div>
                    <TabsList className="bg-transparent p-0 h-auto gap-3 justify-start">
                        <TabsTrigger
                            value="history"
                            className="rounded-full border border-muted-foreground/30 px-3 py-1.5 font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-primary/5 data-[state=active]:shadow-sm hover:border-primary/50 hover:text-primary transition-all flex items-center gap-2"
                        >
                            <HistoryIcon className="h-4 w-4" />
                            Riwayat Pertemuan
                        </TabsTrigger>
                        <TabsTrigger
                            value="recap"
                            className="rounded-full border border-muted-foreground/30 px-3 py-1.5 font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-primary/5 data-[state=active]:shadow-sm hover:border-primary/50 hover:text-primary transition-all flex items-center gap-2"
                        >
                            <Award className="h-4 w-4" />
                            Rekap &amp; Penilaian
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* Filters bar */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b pb-4 mb-4">
                    <div className="flex flex-col md:flex-row items-end gap-3 w-full md:w-auto">
                        {/* Ekskul dropdown — populated from API */}
                        {activeTab === "history" && (
                            <div className="flex flex-col space-y-2 w-full md:w-auto">
                                <span className="text-sm font-medium text-muted-foreground ml-1">
                                    Ekstrakurikuler
                                </span>
                                <Select
                                    value={selectedEskul}
                                    onValueChange={(v) => {
                                        setSelectedEskul(v);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <SelectTrigger className="w-full md:w-[180px] bg-background">
                                        <SelectValue placeholder="Pilih Ekstrakurikuler" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ekskulList.length > 0 ? (
                                            ekskulList.map((e) => (
                                                <SelectItem key={e} value={e}>
                                                    {e}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value="" disabled>
                                                Tidak ada data
                                            </SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Date picker — history tab only */}
                        {activeTab === "history" && (
                            <div className="flex flex-col space-y-2 w-full md:w-auto">
                                <span className="text-sm font-medium text-muted-foreground ml-1">
                                    Tanggal
                                </span>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full md:w-[180px] justify-start text-left font-normal bg-background",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? (
                                                format(date, "PPP", { locale: id })
                                            ) : (
                                                <span>Pilih Tanggal</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={(d) => {
                                                setDate(d);
                                                setCurrentPage(1);
                                            }}
                                            initialFocus
                                            disabled={(d) =>
                                                d > new Date() ||
                                                d < new Date("1900-01-01")
                                            }
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        )}
                    </div>

                    {/* Search + Export */}
                    <div className="flex flex-col space-y-2 w-full md:w-auto flex-shrink-0 md:ml-4">
                        <span className="text-sm font-medium text-muted-foreground ml-1 invisible md:visible">
                            Pencarian
                        </span>
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1 md:w-64 -mt-7 md:mt-0">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari siswa..."
                                    className="pl-9 bg-background"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>
                            {activeTab === "recap" && (
                                <Button
                                    variant="outline"
                                    className="-mt-7 md:mt-0"
                                    onClick={handleExport}
                                    disabled={isExporting}
                                >
                                    {isExporting ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Download className="mr-2 h-4 w-4" />
                                    )}
                                    Export
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats — history tab */}
                {activeTab === "history" && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                        <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="text-2xl font-bold text-green-600">
                                {stats.Hadir}
                            </div>
                            <div className="text-xs text-green-600 font-medium uppercase mt-1">
                                Hadir
                            </div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="text-2xl font-bold text-blue-600">
                                {stats.Sakit}
                            </div>
                            <div className="text-xs text-blue-600 font-medium uppercase mt-1">
                                Sakit
                            </div>
                        </div>
                        <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                            <div className="text-2xl font-bold text-yellow-600">
                                {stats.Izin}
                            </div>
                            <div className="text-xs text-yellow-600 font-medium uppercase mt-1">
                                Izin
                            </div>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                            <div className="text-2xl font-bold text-red-600">
                                {stats.Alpha}
                            </div>
                            <div className="text-xs text-red-600 font-medium uppercase mt-1">
                                Alpha
                            </div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                            <div className="text-2xl font-bold text-purple-600">
                                {attendancePercentage}%
                            </div>
                            <div className="text-xs text-purple-600 font-medium uppercase mt-1">
                                Kehadiran
                            </div>
                        </div>
                    </div>
                )}

                {/* Main content card */}
                <div className="bg-card rounded-xl border shadow-sm">
                    <div className="p-6">
                        <div className="flex flex-col space-y-1.5 mb-6">
                            <h4 className="font-semibold text-lg flex items-center gap-2">
                                {activeTab === "history" ? (
                                    <Trophy className="h-5 w-5 text-primary" />
                                ) : (
                                    <Award className="h-5 w-5 text-amber-500" />
                                )}
                                Daftar Siswa ({activeRows.length})
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                {activeTab === "history"
                                    ? `Menampilkan riwayat presensi ekskul${selectedEskul ? ` ${selectedEskul}` : ""} pada ${date ? format(date, "dd MMMM yyyy", { locale: id }) : "-"}.`
                                    : "Menampilkan rekap kehadiran dan nilai ekskul siswa di kelas wali."}
                            </p>
                        </div>

                        {/* Loading state */}
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
                                <p className="text-sm text-muted-foreground">Memuat data...</p>
                            </div>
                        )}

                        {/* History table */}
                        {!isLoading && activeTab === "history" && (
                            <>
                                {filteredHistoryRows.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-xl bg-accent/5">
                                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                                            <HistoryIcon className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <p className="font-medium text-foreground">
                                            Tidak ada data presensi
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Coba ubah filter ekskul atau tanggal.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b bg-muted/30">
                                                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                                                        Nama
                                                    </th>
                                                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                                                        NIS
                                                    </th>
                                                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                                                        Ekskul
                                                    </th>
                                                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                                                        Tanggal
                                                    </th>
                                                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                                                        Status
                                                    </th>
                                                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                                                        Topik
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(paginatedRows as typeof filteredHistoryRows).map((row) => (
                                                    <tr
                                                        key={row.id}
                                                        className="border-b last:border-0 hover:bg-muted/20 transition-colors"
                                                    >
                                                        <td className="py-3 px-4 font-medium">
                                                            {row.nama}
                                                        </td>
                                                        <td className="py-3 px-4 font-mono text-xs text-muted-foreground">
                                                            {row.nis}
                                                        </td>
                                                        <td className="py-3 px-4 text-muted-foreground">
                                                            {row.eskul}
                                                        </td>
                                                        <td className="py-3 px-4 text-muted-foreground">
                                                            {row.date !== "-"
                                                                ? format(
                                                                      new Date(row.date),
                                                                      "dd MMM yyyy",
                                                                      { locale: id }
                                                                  )
                                                                : "-"}
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            {row.status !== "-" ? (
                                                                <Badge
                                                                    variant="outline"
                                                                    className={cn(
                                                                        "px-2.5 py-1 gap-1.5 flex items-center w-fit",
                                                                        getStatusColor(row.status)
                                                                    )}
                                                                >
                                                                    {getStatusIcon(row.status)}
                                                                    {row.status}
                                                                </Badge>
                                                            ) : (
                                                                <span className="text-muted-foreground">-</span>
                                                            )}
                                                        </td>
                                                        <td className="py-3 px-4 text-muted-foreground">
                                                            {row.topic || "-"}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Recap table */}
                        {!isLoading && activeTab === "recap" && (
                            <>
                                {filteredGradesRows.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-xl bg-accent/5">
                                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                                            <Award className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <p className="font-medium text-foreground">
                                            Tidak ada data rekap nilai
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Coba ubah filter atau kata kunci pencarian.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b bg-muted/30">
                                                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                                                        Nama
                                                    </th>
                                                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                                                        NIS
                                                    </th>
                                                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                                                        Ekskul
                                                    </th>
                                                    <th className="text-center py-3 px-4 font-semibold text-muted-foreground">
                                                        Total Hadir
                                                    </th>
                                                    <th className="text-center py-3 px-4 font-semibold text-muted-foreground">
                                                        Total Pertemuan
                                                    </th>
                                                    <th className="text-center py-3 px-4 font-semibold text-muted-foreground">
                                                        Kehadiran %
                                                    </th>
                                                    {scoreColumns.map((col) => (
                                                        <th
                                                            key={col}
                                                            className="text-center py-3 px-4 font-semibold text-muted-foreground capitalize"
                                                        >
                                                            {col}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(paginatedRows as GradesStudent[]).map((student) => (
                                                    <tr
                                                        key={`${student.id}-${student.membership_id}`}
                                                        className="border-b last:border-0 hover:bg-muted/20 transition-colors"
                                                    >
                                                        <td className="py-3 px-4 font-medium">
                                                            {student.nama}
                                                        </td>
                                                        <td className="py-3 px-4 font-mono text-xs text-muted-foreground">
                                                            {student.nis}
                                                        </td>
                                                        <td className="py-3 px-4 text-muted-foreground">
                                                            {student.eskul}
                                                        </td>
                                                        <td className="py-3 px-4 text-center font-semibold text-green-600">
                                                            {student.total_hadir}
                                                        </td>
                                                        <td className="py-3 px-4 text-center text-muted-foreground">
                                                            {student.total_pertemuan}
                                                        </td>
                                                        <td className="py-3 px-4 text-center">
                                                            <Badge
                                                                variant="outline"
                                                                className={cn(
                                                                    "font-semibold",
                                                                    student.attendance_rate >= 80
                                                                        ? "bg-green-50 text-green-700 border-green-200"
                                                                        : student.attendance_rate >= 60
                                                                        ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                                                        : "bg-red-50 text-red-700 border-red-200"
                                                                )}
                                                            >
                                                                {student.attendance_rate.toFixed(1)}%
                                                            </Badge>
                                                        </td>
                                                        {scoreColumns.map((col) => (
                                                            <td
                                                                key={col}
                                                                className="py-3 px-4 text-center text-muted-foreground"
                                                            >
                                                                {student.scores[col] ?? "-"}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Pagination */}
                        {!isLoading && activeRows.length > 0 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t mt-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>Show</span>
                                    <Select
                                        value={itemsPerPage.toString()}
                                        onValueChange={(val) => {
                                            setItemsPerPage(Number(val));
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <SelectTrigger className="h-8 w-[70px]">
                                            <SelectValue placeholder={itemsPerPage} />
                                        </SelectTrigger>
                                        <SelectContent side="top">
                                            {[5, 10, 20, 50].map((size) => (
                                                <SelectItem key={size} value={size.toString()}>
                                                    {size}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <span>of {activeRows.length} entries</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(1)}
                                        disabled={currentPage === 1}
                                    >
                                        &laquo;
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        &lsaquo;
                                    </Button>
                                    <span className="text-sm font-medium mx-2">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setCurrentPage((p) => Math.min(totalPages, p + 1))
                                        }
                                        disabled={currentPage === totalPages}
                                    >
                                        &rsaquo;
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(totalPages)}
                                        disabled={currentPage === totalPages}
                                    >
                                        &raquo;
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Tabs>
        </div>
    );
};
