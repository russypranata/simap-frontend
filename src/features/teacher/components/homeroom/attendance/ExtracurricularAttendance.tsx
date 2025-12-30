import React, { useState, useMemo } from "react";
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
    History as HistoryIcon
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { StudentList, StudentBase } from "./shared/StudentList";
import { StudentExtracurricularDetail } from "./exschool-recap/StudentExtracurricularDetail";

// Mock Data Types
interface ExtracurricularRecap {
    totalHadir: number;
    totalPertemuan: number;
    nilai: string;
    catatanTutor: string;
    verified: boolean;
}

interface StudentExtracurricular extends StudentBase {
    eskul: string;
    status: string; // For daily history
    recap: ExtracurricularRecap; // For semester recap
    activeEskuls: { name: string; schedule: string; attendance: string }[]; // For detail view
}

export const ExtracurricularAttendance = () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [selectedEskul, setSelectedEskul] = useState<string>("Pramuka");
    const [searchTerm, setSearchTerm] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState("history");
    const [selectedStudent, setSelectedStudent] = useState<StudentExtracurricular | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [periodFilter, setPeriodFilter] = useState("harian"); // For Detail Sheet

    const [selectedMonth, setSelectedMonth] = useState<string>(new Date().getMonth().toString());
    const [selectedSemester, setSelectedSemester] = useState<string>("ganjil");
    const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
    const [statusFilter, setStatusFilter] = useState<string>("all");

    // Mock data generator
    const students: StudentExtracurricular[] = useMemo(() => {
        return Array.from({ length: 32 }).map((_, i) => ({
            id: i + 1,
            nama: `Siswa ${i + 1}`,
            nis: `2024${100 + i}`,
            kelas: "XII A",
            foto: undefined,
            eskul: selectedEskul,
            status: i % 5 === 0 ? "Sakit" : i % 7 === 0 ? "Izin" : i % 10 === 0 ? "Alpha" : "Hadir",
            recap: {
                totalHadir: Math.floor(Math.random() * 12) + 8,
                totalPertemuan: 20,
                nilai: i % 3 === 0 ? "A" : i % 3 === 1 ? "B" : "C",
                catatanTutor: "Siswa aktif dan disiplin dalam kegiatan.",
                verified: i % 2 === 0
            },
            activeEskuls: [
                { name: selectedEskul, schedule: "Senin, 15:30", attendance: "90" },
                { name: "Futsal", schedule: "Rabu, 16:00", attendance: "85" }
            ]
        }));
    }, [selectedEskul]);

    // Derived stats
    const stats = useMemo(() => {
        const initial = { Hadir: 0, Sakit: 0, Izin: 0, Alpha: 0 };
        return students.reduce((acc, curr) => {
            if (curr.status in acc) {
                acc[curr.status as keyof typeof initial]++;
            }
            return acc;
        }, initial);
    }, [students]);

    const attendancePercentage = useMemo(() => {
        const total = students.length;
        if (total === 0) return 0;
        return ((stats.Hadir / total) * 100).toFixed(1);
    }, [stats, students.length]);

    // Filtering and Pagination
    const filteredStudents = useMemo(() => {
        return students.filter(student => {
            const matchesSearch = student.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.nis.toLowerCase().includes(searchTerm.toLowerCase());

            // Only apply status filter strictly in History tab
            const matchesStatus = activeTab === 'history'
                ? (statusFilter === "all" || student.status === statusFilter)
                : true;

            return matchesSearch && matchesStatus;
        });
    }, [students, searchTerm, statusFilter, activeTab]);

    const paginatedStudents = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredStudents.slice(startIndex, endIndex);
    }, [filteredStudents, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

    const handleSelectStudent = (student: StudentExtracurricular) => {
        setSelectedStudent(student);
        setIsDetailOpen(true);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Hadir": return "bg-green-100 text-green-800 border-green-200";
            case "Sakit": return "bg-blue-100 text-blue-800 border-blue-200";
            case "Izin": return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "Alpha": return "bg-red-100 text-red-800 border-red-200";
            default: return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Hadir": return <CheckCircle className="h-3 w-3 mr-1" />;
            case "Sakit": return <AlertCircle className="h-3 w-3 mr-1" />;
            case "Izin": return <Clock className="h-3 w-3 mr-1" />;
            case "Alpha": return <XCircle className="h-3 w-3 mr-1" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col space-y-1">
                <h3 className="text-2xl font-bold tracking-tight">Presensi Ekstrakurikuler</h3>
                <p className="text-muted-foreground text-sm/relaxed max-w-2xl">
                    Kelola kehadiran dan penilaian ekstrakurikuler siswa.
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); setCurrentPage(1); }} className="w-full">
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
                            Rekap & Penilaian
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b pb-4 mb-4">
                    {/* Filters */}
                    <div className="flex flex-col md:flex-row items-end gap-3 w-full md:w-auto">
                        <div className="flex flex-col space-y-2 w-full md:w-auto">
                            <span className="text-sm font-medium text-muted-foreground ml-1">Ekstrakurikuler</span>
                            <Select value={selectedEskul} onValueChange={setSelectedEskul}>
                                <SelectTrigger className="w-full md:w-[180px] bg-background">
                                    <SelectValue placeholder="Pilih Ekstrakurikuler" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Pramuka">Pramuka</SelectItem>
                                    <SelectItem value="Futsal">Futsal</SelectItem>
                                    <SelectItem value="Basket">Basket</SelectItem>
                                    <SelectItem value="Rohis">Rohis</SelectItem>
                                    <SelectItem value="PMR">PMR</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {activeTab === 'history' && (
                            <div className="flex flex-col space-y-2 w-full md:w-auto">
                                <span className="text-sm font-medium text-muted-foreground ml-1">Tanggal</span>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full md:w-[180px] justify-start text-left font-normal bg-background",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "PPP", { locale: id }) : <span>Pilih Tanggal</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            initialFocus
                                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        )}

                        {activeTab === 'recap' && (
                            <div className="flex flex-col space-y-2 w-full md:w-auto">
                                <span className="text-sm font-medium text-muted-foreground ml-1">Periode</span>
                                <div className="flex items-center gap-2">
                                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                        <SelectTrigger className="w-full md:w-[140px] bg-background">
                                            <SelectValue placeholder="Bulan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.from({ length: 12 }, (_, i) => (
                                                <SelectItem key={i} value={i.toString()}>
                                                    {format(new Date(2024, i, 1), "MMMM", { locale: id })}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                                        <SelectTrigger className="w-[100px] bg-background">
                                            <SelectValue placeholder="Tahun" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="2024">2024</SelectItem>
                                            <SelectItem value="2023">2023</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col space-y-2 w-full md:w-auto flex-shrink-0 md:ml-4">
                        <span className="text-sm font-medium text-muted-foreground ml-1 invisible md:visible">Pencarian</span>
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1 md:w-64 -mt-7 md:mt-0">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari siswa..."
                                    className="pl-9 bg-background"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            {activeTab === 'recap' && (
                                <Button variant="outline" className="-mt-7 md:mt-0">
                                    <Download className="mr-2 h-4 w-4" /> Export
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Section only active in History for now, or adapted for Recap */}
                {activeTab === 'history' && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                        <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="text-2xl font-bold text-green-600">{stats.Hadir}</div>
                            <div className="text-xs text-green-600 font-medium uppercase mt-1">Hadir</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="text-2xl font-bold text-blue-600">{stats.Sakit}</div>
                            <div className="text-xs text-blue-600 font-medium uppercase mt-1">Sakit</div>
                        </div>
                        <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                            <div className="text-2xl font-bold text-yellow-600">{stats.Izin}</div>
                            <div className="text-xs text-yellow-600 font-medium uppercase mt-1">Izin</div>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                            <div className="text-2xl font-bold text-red-600">{stats.Alpha}</div>
                            <div className="text-xs text-red-600 font-medium uppercase mt-1">Alpha</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                            <div className="text-2xl font-bold text-purple-600">{attendancePercentage}%</div>
                            <div className="text-xs text-purple-600 font-medium uppercase mt-1">Kehadiran</div>
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="bg-card rounded-xl border shadow-sm">
                    <div className="p-6">
                        <div className="flex flex-col space-y-1.5 mb-6">
                            <h4 className="font-semibold text-lg flex items-center gap-2">
                                {activeTab === 'history' ? <Trophy className="h-5 w-5 text-primary" /> : <Award className="h-5 w-5 text-amber-500" />}
                                Daftar Siswa ({filteredStudents.length})
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                {activeTab === 'history'
                                    ? `Menampilkan status kehadiran untuk ${selectedEskul} pada ${date ? format(date, "dd MMMM yyyy", { locale: id }) : "-"}.`
                                    : `Menampilkan rekap nilai dan kehadiran ${selectedEskul} Semester ${selectedSemester === "ganjil" ? "Ganjil" : "Genap"}.`
                                }
                            </p>
                        </div>

                        <StudentList
                            students={paginatedStudents}
                            onSelect={handleSelectStudent}
                            renderSummary={(student) => (
                                activeTab === 'history' ? (
                                    <Badge variant="outline" className={cn("px-2.5 py-1 gap-1.5", getStatusColor(student.status))}>
                                        {getStatusIcon(student.status)}
                                        {student.status}
                                    </Badge>
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <div className="text-right hidden sm:block">
                                            <div className="text-xs text-muted-foreground">Kehadiran</div>
                                            <div className="font-semibold text-sm">
                                                {student.recap.totalHadir}/{student.recap.totalPertemuan}
                                            </div>
                                        </div>
                                        <Badge variant="secondary" className={cn(
                                            "w-8 h-8 rounded-full p-0 flex items-center justify-center font-bold text-sm border",
                                            student.recap.nilai === 'A' ? "bg-green-50 text-green-600 border-green-200" :
                                                student.recap.nilai === 'B' ? "bg-blue-50 text-blue-600 border-blue-200" :
                                                    "bg-yellow-50 text-yellow-600 border-yellow-200"
                                        )}>
                                            {student.recap.nilai}
                                        </Badge>
                                    </div>
                                )
                            )}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            itemsPerPage={itemsPerPage}
                            totalRecords={filteredStudents.length}
                            onPageChange={setCurrentPage}
                            onItemsPerPageChange={setItemsPerPage}
                        />
                    </div>
                </div>
            </Tabs>

            <StudentExtracurricularDetail
                student={selectedStudent}
                open={isDetailOpen}
                onOpenChange={setIsDetailOpen}
                periodFilter={periodFilter}
                onPeriodFilterChange={setPeriodFilter}
            />
        </div>
    );
};
