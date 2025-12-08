
import React, { useState, useMemo } from "react";
import {
    Calendar as CalendarIcon,
    Moon,
    XCircle,
    CheckCircle,
    Sun,
    Sunset,
    FileText,
    BarChart3,
    CalendarDays,
    Search,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { StudentList, StudentBase } from "./shared/StudentList";
import { StudentPrayerDetail } from "./prayer-recap/StudentPrayerDetail";

// Mock Data Type
interface StudentPrayer extends StudentBase {
    prayers: {
        dhuha: boolean;
        dhuhur: boolean;
        ashar: boolean;
    };
}

export const PrayerAttendance = () => {
    const [periodFilter, setPeriodFilter] = useState("harian");
    const [searchTerm, setSearchTerm] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedStudent, setSelectedStudent] = useState<StudentPrayer | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [currentWeekStart, setCurrentWeekStart] = useState(new Date());

    // Mock data
    const students: StudentPrayer[] = useMemo(() => {
        return Array.from({ length: 32 }).map((_, i) => ({
            id: i + 1,
            nama: `Siswa ${i + 1} `,
            nis: `2024${100 + i} `,
            kelas: "XII A",
            foto: undefined,
            prayers: {
                dhuha: i % 2 === 0,
                dhuhur: true,
                ashar: i % 3 !== 0,
            }
        }));
    }, []);

    const filteredStudents = useMemo(() => {
        return students.filter(student =>
            student.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.nis.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [students, searchTerm]);

    const paginatedStudents = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredStudents.slice(startIndex, endIndex);
    }, [filteredStudents, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

    const handleSelectStudent = (student: StudentPrayer) => {
        setSelectedStudent(student);
        setIsDetailOpen(true);
    };

    const getDescription = (filter: string) => {
        const today = new Date();
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

        switch (filter) {
            case "harian":
                return `Menampilkan data presensi sholat untuk kelas XII A pada hari ${today.toLocaleDateString('id-ID', options)}.`;
            case "mingguan":
                return "Menampilkan rekap presensi sholat mingguan untuk kelas XII A.";
            case "bulanan":
                return `Menampilkan rekap presensi sholat bulanan untuk kelas XII A periode ${today.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}.`;
            case "semester":
                return "Menampilkan rekap presensi sholat semester ini untuk kelas XII A.";
            default:
                return "Rekap presensi sholat seluruh siswa.";
        }
    };

    const PrayerIcon = ({ type }: { type: string }) => {
        switch (type) {
            case 'dhuha': return <Sun className="h-4 w-4" />;
            case 'dhuhur': return <Sun className="h-4 w-4" />;
            case 'ashar': return <Sunset className="h-4 w-4" />;
            default: return <Moon className="h-4 w-4" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col space-y-1">
                <h3 className="text-2xl font-bold tracking-tight">Presensi Sholat</h3>
                <p className="text-muted-foreground text-sm/relaxed max-w-2xl">
                    {getDescription(periodFilter)}
                </p>
            </div>

            <div className="flex flex-col space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
                    <Tabs value={periodFilter} onValueChange={setPeriodFilter} className="w-full md:w-auto">
                        <div className="flex flex-col space-y-2">
                            <span className="text-sm font-medium text-muted-foreground ml-1">Filter Periode</span>
                            <TabsList className="bg-muted/50 p-1 h-auto gap-2 justify-start w-fit rounded-lg">
                                <TabsTrigger
                                    value="harian"
                                    className="rounded-md px-3 py-1.5 text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all flex items-center gap-2"
                                >
                                    <CalendarIcon className="h-3.5 w-3.5" />
                                    Harian
                                </TabsTrigger>
                                <TabsTrigger
                                    value="mingguan"
                                    className="rounded-md px-3 py-1.5 text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all flex items-center gap-2"
                                >
                                    <CalendarDays className="h-3.5 w-3.5" />
                                    Mingguan
                                </TabsTrigger>
                                <TabsTrigger
                                    value="bulanan"
                                    className="rounded-md px-3 py-1.5 text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all flex items-center gap-2"
                                >
                                    <FileText className="h-3.5 w-3.5" />
                                    Bulanan
                                </TabsTrigger>
                                <TabsTrigger
                                    value="semester"
                                    className="rounded-md px-3 py-1.5 text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all flex items-center gap-2"
                                >
                                    <BarChart3 className="h-3.5 w-3.5" />
                                    Semester
                                </TabsTrigger>
                            </TabsList>
                        </div>
                    </Tabs>

                    {/* Active Filter Input */}
                    <div className="flex items-end gap-2 w-full md:w-auto">
                        <div className="flex-1 w-full md:w-auto">
                            {periodFilter === "harian" && (
                                <div className="flex flex-col space-y-2">
                                    <span className="text-sm font-medium text-muted-foreground ml-1">Tanggal</span>
                                    <Input
                                        type="date"
                                        className="h-10 w-full md:w-[180px] bg-background"
                                        value={new Date().toISOString().split('T')[0]}
                                        onChange={() => { }}
                                    />
                                </div>
                            )}

                            {periodFilter === "mingguan" && (
                                <div className="flex flex-col space-y-2">
                                    <span className="text-sm font-medium text-muted-foreground ml-1">Rentang Minggu</span>
                                    <div className="flex items-center gap-1 bg-background border rounded-md p-1 h-10 w-full md:w-auto">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted" onClick={() => {
                                            const newDate = new Date(currentWeekStart);
                                            newDate.setDate(newDate.getDate() - 7);
                                            setCurrentWeekStart(newDate);
                                        }}>
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <div className="text-sm font-medium px-2 min-w-[130px] text-center whitespace-nowrap">
                                            {(() => {
                                                const endOfWeek = new Date(currentWeekStart);
                                                endOfWeek.setDate(endOfWeek.getDate() + 6);
                                                const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
                                                const startStr = currentWeekStart.toLocaleDateString('id-ID', options);
                                                const endStr = endOfWeek.toLocaleDateString('id-ID', { ...options, year: 'numeric' });
                                                return `${startStr} - ${endStr}`;
                                            })()}
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted" onClick={() => {
                                            const newDate = new Date(currentWeekStart);
                                            newDate.setDate(newDate.getDate() + 7);
                                            setCurrentWeekStart(newDate);
                                        }}>
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {periodFilter === "bulanan" && (
                                <div className="flex flex-col space-y-2">
                                    <span className="text-sm font-medium text-muted-foreground ml-1">Bulan & Tahun</span>
                                    <div className="flex items-center gap-2">
                                        <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring w-[140px]">
                                            <option value="0">Januari</option>
                                            <option value="1">Februari</option>
                                            <option value="2">Maret</option>
                                            <option value="3">April</option>
                                            <option value="4">Mei</option>
                                            <option value="5">Juni</option>
                                            <option value="6">Juli</option>
                                            <option value="7">Agustus</option>
                                            <option value="8">September</option>
                                            <option value="9">Oktober</option>
                                            <option value="10">November</option>
                                            <option value="11">Desember</option>
                                        </select>
                                        <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring w-[100px]">
                                            <option value="2024">2024</option>
                                            <option value="2023">2023</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {periodFilter === "semester" && (
                                <div className="flex flex-col space-y-2">
                                    <span className="text-sm font-medium text-muted-foreground ml-1">Semester & Tahun Ajar</span>
                                    <div className="flex items-center gap-2">
                                        <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring w-[160px]">
                                            <option value="ganjil">Semester Ganjil</option>
                                            <option value="genap">Semester Genap</option>
                                        </select>
                                        <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring w-[120px]">
                                            <option value="2024/2025">2024/2025</option>
                                            <option value="2023/2024">2023/2024</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col space-y-2 flex-shrink-0 md:ml-4">
                            <span className="text-sm font-medium text-muted-foreground ml-1 invisible md:visible">Pencarian</span>
                            <div className="relative w-full md:w-[250px] -mt-7 md:mt-0">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari siswa..."
                                    className="pl-9 bg-background h-10 w-full"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-card rounded-xl border shadow-sm">
                <div className="p-6">
                    <div className="flex flex-col space-y-1.5 mb-6">
                        <h4 className="font-semibold text-lg flex items-center gap-2">
                            <Moon className="h-5 w-5 text-primary" />
                            Daftar Siswa ({filteredStudents.length})
                        </h4>
                        <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
                            {getDescription(periodFilter)}
                        </p>
                    </div>

                    <StudentList
                        students={paginatedStudents}
                        onSelect={handleSelectStudent}
                        renderSummary={(student) => (
                            <div className="flex gap-2">
                                {['dhuha', 'dhuhur', 'ashar'].map((prayer) => (
                                    <Badge
                                        key={prayer}
                                        variant="outline"
                                        className={cn(
                                            "flex items-center gap-1.5 px-2 py-1 text-xs font-medium uppercase",
                                            student.prayers[prayer as keyof typeof student.prayers]
                                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                : "bg-red-50 text-red-700 border-red-200 bg-opacity-50"
                                        )}
                                    >
                                        <PrayerIcon type={prayer} />
                                        {student.prayers[prayer as keyof typeof student.prayers] ? (
                                            <CheckCircle className="h-3 w-3" />
                                        ) : (
                                            <XCircle className="h-3 w-3" />
                                        )}
                                        <span className="hidden sm:inline">{prayer}</span>
                                    </Badge>
                                ))}
                            </div>
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

            <StudentPrayerDetail
                student={selectedStudent}
                open={isDetailOpen}
                onOpenChange={setIsDetailOpen}
                periodFilter={periodFilter}
                onPeriodFilterChange={setPeriodFilter}
            />
        </div>
    );
};

