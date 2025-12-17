"use client";

import React, { useState, useMemo } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
    Search,
    Sun,
    Sunrise,
    CloudSun,
    Sunset,
    Moon,
    Check,
    X,
    ChevronLeft,
    ChevronRight,
    User,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// Prayer times
const PRAYER_TIMES = [
    { id: "subuh", name: "Subuh", icon: Sunrise, color: "purple" },
    { id: "dhuha", name: "Dhuha", icon: Sun, color: "yellow" },
    { id: "dzuhur", name: "Dzuhur", icon: CloudSun, color: "orange" },
    { id: "ashar", name: "Ashar", icon: Sun, color: "amber" },
    { id: "maghrib", name: "Maghrib", icon: Sunset, color: "red" },
    { id: "isya", name: "Isya", icon: Moon, color: "indigo" },
] as const;

type PrayerTimeId = typeof PRAYER_TIMES[number]["id"];

// Mock students data
const mockStudents = [
    { id: 1, name: "Ahmad Rizky", class: "XII A", nis: "2024101" },
    { id: 2, name: "Budi Santoso", class: "XII A", nis: "2024102" },
    { id: 3, name: "Citra Dewi", class: "XII A", nis: "2024103" },
    { id: 4, name: "Dewi Putri", class: "XII A", nis: "2024104" },
    { id: 5, name: "Eko Prasetyo", class: "XII B", nis: "2024105" },
    { id: 6, name: "Fani Rahmawati", class: "XII B", nis: "2024106" },
    { id: 7, name: "Gunawan", class: "XI A", nis: "2024107" },
    { id: 8, name: "Hesti", class: "XI A", nis: "2024108" },
];

interface PrayerRecord {
    studentId: number;
    prayerTime: PrayerTimeId;
    status: "hadir" | "tidak";
    note: string;
    recordedBy: string;
    recordedAt: string;
}

export default function PicketPrayerAttendanceToday() {
    const [selectedPrayer, setSelectedPrayer] = useState<PrayerTimeId>("dzuhur");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedClass, setSelectedClass] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [prayerRecords, setPrayerRecords] = useState<PrayerRecord[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<number[]>([]);

    // Dialog states
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState<"single" | "bulk">("single");
    const [dialogStatus, setDialogStatus] = useState<"hadir" | "tidak">("hadir");
    const [dialogNote, setDialogNote] = useState("");
    const [dialogStudentId, setDialogStudentId] = useState<number | null>(null);

    // Filter students
    const filteredStudents = useMemo(() => {
        return mockStudents.filter((student) => {
            const matchSearch =
                !searchQuery ||
                student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.nis.includes(searchQuery);
            const matchClass = selectedClass === "all" || student.class === selectedClass;

            // Filter out students who already have record for selected prayer
            const hasRecord = prayerRecords.some(
                (r) => r.studentId === student.id && r.prayerTime === selectedPrayer
            );

            return matchSearch && matchClass && !hasRecord;
        });
    }, [searchQuery, selectedClass, selectedPrayer, prayerRecords]);

    // Pagination
    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

    // Get records for selected prayer
    const currentPrayerRecords = useMemo(() => {
        return prayerRecords.filter((r) => r.prayerTime === selectedPrayer);
    }, [prayerRecords, selectedPrayer]);

    // Statistics
    const stats = useMemo(() => {
        const total = currentPrayerRecords.length;
        const hadir = currentPrayerRecords.filter((r) => r.status === "hadir").length;
        const tidak = currentPrayerRecords.filter((r) => r.status === "tidak").length;
        return { total, hadir, tidak };
    }, [currentPrayerRecords]);

    // Handlers
    const handleToggleStudent = (studentId: number) => {
        setSelectedStudents((prev) =>
            prev.includes(studentId)
                ? prev.filter((id) => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleToggleAll = () => {
        if (selectedStudents.length === paginatedStudents.length) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(paginatedStudents.map((s) => s.id));
        }
    };

    const openDialog = (type: "single" | "bulk", status: "hadir" | "tidak", studentId?: number) => {
        setDialogType(type);
        setDialogStatus(status);
        setDialogStudentId(studentId || null);
        setDialogNote("");
        setIsDialogOpen(true);
    };

    const handleConfirmDialog = () => {
        if (dialogType === "single" && dialogStudentId) {
            const newRecord: PrayerRecord = {
                studentId: dialogStudentId,
                prayerTime: selectedPrayer,
                status: dialogStatus,
                note: dialogNote,
                recordedBy: "Pak Budi Santoso",
                recordedAt: new Date().toISOString(),
            };
            setPrayerRecords([...prayerRecords, newRecord]);

            const student = mockStudents.find(s => s.id === dialogStudentId);
            toast.success(
                `${student?.name} berhasil dicatat sebagai ${dialogStatus === "hadir" ? "Hadir" : "Tidak Hadir"}`
            );
        } else if (dialogType === "bulk") {
            const newRecords: PrayerRecord[] = selectedStudents.map((studentId) => ({
                studentId,
                prayerTime: selectedPrayer,
                status: dialogStatus,
                note: dialogNote,
                recordedBy: "Pak Budi Santoso",
                recordedAt: new Date().toISOString(),
            }));
            setPrayerRecords([...prayerRecords, ...newRecords]);
            setSelectedStudents([]);

            toast.success(
                `${newRecords.length} siswa berhasil dicatat sebagai ${dialogStatus === "hadir" ? "Hadir" : "Tidak Hadir"}`
            );
        }

        setIsDialogOpen(false);
        setDialogNote("");
    };

    const handleDeleteRecord = (studentId: number) => {
        const student = mockStudents.find(s => s.id === studentId);
        setPrayerRecords(
            prayerRecords.filter(
                (r) => !(r.studentId === studentId && r.prayerTime === selectedPrayer)
            )
        );

        toast.success(`Catatan ${student?.name} berhasil dihapus`);
    };

    // Get selected prayer info
    const selectedPrayerInfo = PRAYER_TIMES.find((p) => p.id === selectedPrayer);
    const PrayerIcon = selectedPrayerInfo?.icon || Sun;

    return (
        <div className="space-y-6">
            {/* Prayer Time Selector */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Moon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold">Pilih Waktu Sholat</CardTitle>
                                <CardDescription>
                                    {format(new Date(), "EEEE, dd MMMM yyyy", { locale: id })}
                                </CardDescription>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        {PRAYER_TIMES.map((prayer) => {
                            const Icon = prayer.icon;
                            const isSelected = selectedPrayer === prayer.id;
                            return (
                                <button
                                    key={prayer.id}
                                    onClick={() => setSelectedPrayer(prayer.id)}
                                    className={`
                                        relative p-4 rounded-lg border-2 transition-all
                                        ${isSelected
                                            ? "border-primary bg-primary/5 shadow-sm"
                                            : "border-muted hover:border-primary/50 hover:bg-muted/50"
                                        }
                                    `}
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <Icon
                                            className={`h-6 w-6 ${isSelected ? "text-primary" : "text-muted-foreground"}`}
                                        />
                                        <span
                                            className={`text-sm font-medium ${isSelected ? "text-primary" : "text-foreground"}`}
                                        >
                                            {prayer.name}
                                        </span>
                                    </div>
                                    {isSelected && (
                                        <div className="absolute top-2 right-2">
                                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Tercatat</CardTitle>
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <PrayerIcon className="h-4 w-4 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">{stats.total}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Siswa untuk {selectedPrayerInfo?.name}
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-green-50 border-green-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Hadir</CardTitle>
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Check className="h-4 w-4 text-green-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.hadir}</div>
                        <p className="text-xs text-muted-foreground mt-1">Siswa hadir sholat</p>
                    </CardContent>
                </Card>

                <Card className="bg-red-50 border-red-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tidak Hadir</CardTitle>
                        <div className="p-2 bg-red-100 rounded-lg">
                            <X className="h-4 w-4 text-red-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{stats.tidak}</div>
                        <p className="text-xs text-muted-foreground mt-1">Siswa tidak hadir</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* LEFT: Student List */}
                <Card className="lg:col-span-7 flex flex-col">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Search className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-semibold">Daftar Siswa</CardTitle>
                                    <CardDescription>
                                        Pilih siswa untuk dicatat kehadirannya
                                    </CardDescription>
                                </div>
                            </div>
                            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                                <User className="h-3 w-3 mr-1" />
                                {filteredStudents.length} Siswa
                            </Badge>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-col gap-3 mt-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari nama atau NIS siswa..."
                                    className="pl-9 bg-muted/30"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-2">
                                <Select value={selectedClass} onValueChange={setSelectedClass}>
                                    <SelectTrigger className="bg-muted/30 flex-1">
                                        <SelectValue placeholder="Pilih Kelas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Kelas</SelectItem>
                                        <SelectItem value="XII A">XII A</SelectItem>
                                        <SelectItem value="XII B">XII B</SelectItem>
                                        <SelectItem value="XI A">XI A</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={itemsPerPage === 999999 ? "all" : String(itemsPerPage)}
                                    onValueChange={(value) => {
                                        setItemsPerPage(value === "all" ? 999999 : Number(value));
                                        setCurrentPage(1);
                                    }}
                                >
                                    <SelectTrigger className="bg-muted/30 w-[130px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="10">Tampil 10</SelectItem>
                                        <SelectItem value="20">Tampil 20</SelectItem>
                                        <SelectItem value="50">Tampil 50</SelectItem>
                                        <SelectItem value="all">Semua</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="flex-1 overflow-hidden flex flex-col pt-2">
                        {/* Bulk Actions */}
                        {paginatedStudents.length > 0 && (
                            <div className="mb-3 pb-3 border-b">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            checked={
                                                selectedStudents.length === paginatedStudents.length &&
                                                paginatedStudents.length > 0
                                            }
                                            onCheckedChange={handleToggleAll}
                                            id="select-all"
                                            className="border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                        />
                                        <label
                                            htmlFor="select-all"
                                            className="text-sm text-muted-foreground cursor-pointer"
                                        >
                                            Pilih Semua{" "}
                                            {selectedStudents.length > 0 &&
                                                `(${selectedStudents.length} terpilih)`}
                                        </label>
                                    </div>
                                    {selectedStudents.length > 0 && (
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => openDialog("bulk", "hadir")}
                                                size="sm"
                                                className="bg-green-600 hover:bg-green-700"
                                            >
                                                <Check className="h-4 w-4 mr-2" />
                                                Hadir ({selectedStudents.length})
                                            </Button>
                                            <Button
                                                onClick={() => openDialog("bulk", "tidak")}
                                                size="sm"
                                                variant="destructive"
                                            >
                                                <X className="h-4 w-4 mr-2" />
                                                Tidak ({selectedStudents.length})
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Student List */}
                        <div className="space-y-2 flex-1 overflow-y-auto">
                            {paginatedStudents.map((student) => (
                                <div
                                    key={student.id}
                                    className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                                >
                                    <Checkbox
                                        checked={selectedStudents.includes(student.id)}
                                        onCheckedChange={() => handleToggleStudent(student.id)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                    />
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                            {student.class.substring(0, 3)}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{student.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                <span className="font-mono">{student.nis}</span> •{" "}
                                                {student.class}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button
                                            size="sm"
                                            onClick={() => openDialog("single", "hadir", student.id)}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            <Check className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() => openDialog("single", "tidak", student.id)}
                                            variant="destructive"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            {filteredStudents.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                                    <Search className="h-10 w-10 mb-2 opacity-20" />
                                    <p className="text-sm">Semua siswa sudah dicatat</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between pt-4 border-t mt-4">
                                <div className="text-sm text-muted-foreground">
                                    Menampilkan {startIndex + 1}-
                                    {Math.min(endIndex, filteredStudents.length)} dari{" "}
                                    {filteredStudents.length} siswa
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <div className="text-sm font-medium">
                                        Halaman {currentPage} dari {totalPages}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* RIGHT: Recorded Students */}
                <Card className="lg:col-span-5 flex flex-col">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Check className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-semibold">
                                        Sudah Dicatat
                                    </CardTitle>
                                    <CardDescription>
                                        Siswa yang sudah dicatat untuk {selectedPrayerInfo?.name}
                                    </CardDescription>
                                </div>
                            </div>
                            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                                <User className="h-3 w-3 mr-1" />
                                {currentPrayerRecords.length} Siswa
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent className="flex-1 overflow-hidden flex flex-col pt-0">
                        <div className="space-y-2 flex-1 overflow-y-auto">
                            {currentPrayerRecords.map((record) => {
                                const student = mockStudents.find((s) => s.id === record.studentId);
                                if (!student) return null;

                                return (
                                    <div
                                        key={`${record.studentId}-${record.prayerTime}`}
                                        className="flex items-center gap-3 p-3 rounded-lg border bg-card"
                                    >
                                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                            {student.class.substring(0, 3)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm">{student.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                <span className="font-mono">{student.nis}</span> •{" "}
                                                {student.class}
                                            </p>
                                            {record.note && (
                                                <p className="text-xs text-muted-foreground italic mt-1 line-clamp-1">
                                                    "{record.note}"
                                                </p>
                                            )}
                                        </div>
                                        <Badge
                                            className={
                                                record.status === "hadir"
                                                    ? "bg-green-100 text-green-700 border-green-200"
                                                    : "bg-red-100 text-red-700 border-red-200"
                                            }
                                        >
                                            {record.status === "hadir" ? (
                                                <Check className="h-3 w-3 mr-1" />
                                            ) : (
                                                <X className="h-3 w-3 mr-1" />
                                            )}
                                            {record.status === "hadir" ? "Hadir" : "Tidak"}
                                        </Badge>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                            onClick={() => handleDeleteRecord(student.id)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                );
                            })}

                            {currentPrayerRecords.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                                    <PrayerIcon className="h-10 w-10 mb-2 opacity-20" />
                                    <p className="text-sm">Belum ada siswa yang dicatat</p>
                                    <p className="text-xs mt-1">
                                        Pilih siswa di sebelah kiri untuk mencatat
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Dialog for Notes */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Catat Kehadiran - {dialogStatus === "hadir" ? "Hadir" : "Tidak Hadir"}
                        </DialogTitle>
                        <DialogDescription>
                            {dialogType === "single"
                                ? `Menandai ${mockStudents.find(s => s.id === dialogStudentId)?.name}`
                                : `Menandai ${selectedStudents.length} siswa`
                            } sebagai {dialogStatus === "hadir" ? "hadir" : "tidak hadir"} untuk sholat {selectedPrayerInfo?.name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="note">Keterangan (Opsional)</Label>
                            <Textarea
                                id="note"
                                placeholder="Contoh: Tepat waktu, Sakit, Izin, Terlambat datang..."
                                value={dialogNote}
                                onChange={(e) => setDialogNote(e.target.value)}
                                rows={3}
                                className="resize-none"
                            />
                            <p className="text-xs text-muted-foreground">
                                Tambahkan catatan untuk informasi tambahan
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Batal
                        </Button>
                        <Button
                            onClick={handleConfirmDialog}
                            className={dialogStatus === "hadir" ? "bg-green-600 hover:bg-green-700" : ""}
                            variant={dialogStatus === "tidak" ? "destructive" : "default"}
                        >
                            {dialogStatus === "hadir" ? <Check className="h-4 w-4 mr-2" /> : <X className="h-4 w-4 mr-2" />}
                            Simpan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
