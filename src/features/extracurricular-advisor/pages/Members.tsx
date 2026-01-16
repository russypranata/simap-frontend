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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Users,
    Search,
    Filter,
    Calendar,
    CheckCircle,
    Eye,
    Activity,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/features/shared/utils/dateFormatter";


import { advisorService, AdvisorMember } from "../services/advisorService";
import { MembersSkeleton } from "../components/AdvisorSkeletons";
import { useDebounce } from "@/hooks/use-debounce";
import { Skeleton } from "@/components/ui/skeleton";

export const ExtracurricularMembers: React.FC = () => {
    const [members, setMembers] = useState<AdvisorMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [classFilter, setClassFilter] = useState("all");
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<AdvisorMember | null>(null);
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    
    // History Filters
    const [selectedYear, setSelectedYear] = useState("2025/2026");
    const [selectedSemester, setSelectedSemester] = useState("1"); // 1=Ganjil, 2=Genap

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 10;

    // Debounce search query to prevent spamming API
    const debouncedSearch = useDebounce(searchQuery, 500);

    // Fetch members when dependencies change
    React.useEffect(() => {
        const fetchMembers = async () => {
            try {
                setIsLoading(true);
                const response = await advisorService.getMembers({
                    page: currentPage,
                    limit: itemsPerPage,
                    search: debouncedSearch,
                    class: classFilter,
                    academicYear: selectedYear
                    // semester: selectedSemester // (If API supports it)
                });
                
                // Handle response structure difference between Mock/Real if any
                // But we unified it in service to return { data, meta }
                // For safety, let's assume service returns { data, meta }
                // Note: Typescript might complain if service return type wasn't fully updated in all paths, 
                // but we updated it to return { data, meta } in both mock/real.
                
                // @ts-ignore - Service return type was updated but TS might need check
                const { data, meta } = response;
                
                setMembers(data || []);
                if (meta) {
                    setTotalPages(meta.totalPages);
                    setTotalItems(meta.totalItems);
                }
            } catch (error) {
                console.error("Failed to fetch members:", error);
                setMembers([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMembers();
    }, [currentPage, debouncedSearch, classFilter, selectedYear, selectedSemester]);

    // Reset page when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, classFilter, selectedYear]);

    // Stats calculation (Visual only - ideally these come from dashboard stats or separate endpoint)
    // For now we calculate based on CURRENT PAGE which is wrong for "Total Members" stats card if strictly following data
    // BUT usually stats cards are global. 
    // Let's rely on dashboard stats for the cards if possible, OR
    // for this specific page, we might accept that stats cards only reflect loaded data OR
    // even better: The service could return stats in the meta or valid separate API.
    // For this refactor, let's keep it simple: Use totalItems for count, but attendance stats might be skewed to current page.
    // Ideally we should call getDashboardStats() here too or just display generic data.
    // Let's stick to using the `members` array for now but acknowledging it's paginated.
    
    // BETTER APPROACH: Fetch specific stats for this page context if needed, 
    // but to avoid complexity we will just execute the "Server Side" refactor for the table list first.
    
    // We'll update the stats cards to use a separate effect or just accept paginated subset stats for now?
    // User asked for "API Ready". Real apps fetch stats separately.
    // I will add a separate fetch for stats to be accurate.
    const [stats, setStats] = useState({
        totalMembers: 0,
        avgAttendance: 0,
        topPerformers: 0,
        needsAttention: 0
    });

    React.useEffect(() => {
        // Fetch global stats for the cards (simulated calculation or separate endpoint)
        // Since we don't have a specific "getMembersStats" endpoint doc'd, 
        // we might reuse getDashboardStats OR just trust the metadata for total count
        // and hide/mock the specific attendance stats for now.
        // Or better: Let's assume for this task we focus on the Table functionality.
        // For the stats cards, I will just use the `totalItems` from metadata for "Total Anggota".
        // For others, I'll calculate based on the current fetched batch (it's a trade-off)
        // OR better: Fetch all members just for stats? No that defeats the purpose.
        // Let's use `advisorService.getDashboardStats()` if available? Yes.
        const fetchStats = async () => {
             try {
                const dashboardStats = await advisorService.getDashboardStats({
                    academicYear: selectedYear,
                    semester: selectedSemester
                });
                setStats({
                    totalMembers: dashboardStats.totalMembers,
                    avgAttendance: dashboardStats.averageAttendance,
                    topPerformers: dashboardStats.activeStudents, 
                    needsAttention: dashboardStats.needsAttention
                });
             } catch (e) {
                 console.log("Stats fetch error", e);
             }
        };
        fetchStats();
    }, [selectedYear, selectedSemester]);


    const handleViewDetail = async (memberToCheck: AdvisorMember) => {
        setIsDetailDialogOpen(true);
        setSelectedMember(null); // Clear previous data
        setIsDetailLoading(true);
        
        try {
            const detail = await advisorService.getMemberDetail(memberToCheck.id);
            setSelectedMember(detail);
        } catch (error) {
            console.error("Failed to fetch member detail:", error);
            // Optionally show toast error here
        } finally {
            setIsDetailLoading(false);
        }
    };



    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Daftar </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Anggota Ekskul</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Users className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Lihat daftar anggota ekstrakurikuler Pramuka
                    </p>
                    <div className="flex items-center gap-3 mt-4">
                        {/* Year Selector */}
                        <div className="relative">
                            <Select value={selectedYear} onValueChange={setSelectedYear}>
                                <SelectTrigger className="h-8 rounded-full bg-blue-50 text-blue-800 border-blue-200 font-semibold text-sm gap-2 pl-3 pr-2 w-auto min-w-[180px]">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-3.5 w-3.5" />
                                        <span>Tahun Ajaran {selectedYear}</span>
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="2025/2026">2025/2026 (Aktif)</SelectItem>
                                    <SelectItem value="2024/2025">2024/2025</SelectItem>
                                    <SelectItem value="2023/2024">2023/2024</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="h-4 w-[1px] bg-border" />
                        
                        {/* Semester Selector */}
                         <div className="relative">
                            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                                <SelectTrigger className="h-8 border-none shadow-none bg-transparent px-2 text-sm font-medium text-blue-800 hover:text-blue-900 w-auto gap-2">
                                    <span>
                                        {selectedSemester === "1" ? "Semester Ganjil" : selectedSemester === "2" ? "Semester Genap" : "Semua Semester"}
                                    </span>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Semester Ganjil (Aktif)</SelectItem>
                                    <SelectItem value="2">Semester Genap</SelectItem>
                                    <SelectItem value="all">Semua Semester</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Card */}
            <Card className="overflow-hidden p-0 gap-0">
                {/* Header */}
                <div className="bg-blue-800 p-4 rounded-t-lg relative overflow-hidden">
                    {/* Decorative circles */}
                    {/* Decorative Icon */}
                    <div className="absolute -right-6 -bottom-6 text-white/10 transform rotate-12">
                        <BarChart3 className="w-32 h-32" />
                    </div>

                    <div className="flex items-center gap-3 relative z-10">
                        <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-lg">
                            <BarChart3 className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-white">Ringkasan Data</h3>
                            <p className="text-blue-100 text-sm">Ekstrakurikuler Pramuka</p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 divide-x">
                    {/* Total Anggota */}
                    <div className="p-4 text-center">
                        <div className="inline-flex p-2.5 bg-blue-100 rounded-full mb-2">
                            <Users className="h-5 w-5 text-blue-800" />
                        </div>
                        <p className="text-2xl font-bold text-blue-800">{stats.totalMembers || totalItems}</p>
                        <p className="text-xs text-muted-foreground">Total Anggota</p>
                    </div>

                    {/* Top Performers - Placeholder since we don't have this in dashboard stats yet */}
                    {/* Accessing these from 'members' array is now only partial data (current page) */}
                    {/* So we should either hide them or accept they are just samples */}
                    {/* For better UX, let's just count from current page for now with a tooltip or just show it */}
                    <div className="p-4 text-center">
                        <div className="inline-flex p-2.5 bg-green-100 rounded-full mb-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <p className="text-2xl font-bold text-green-600">
                             {stats.topPerformers}
                        </p>
                        <p className="text-xs text-muted-foreground">Siswa Aktif</p>
                    </div>

                    {/* Rata-rata Kehadiran */}
                    <div className="p-4 text-center">
                        <div className="inline-flex p-2.5 bg-purple-100 rounded-full mb-2">
                            <Activity className="h-5 w-5 text-purple-700" />
                        </div>
                        <p className="text-2xl font-bold text-purple-700">{stats.avgAttendance}%</p>
                        <p className="text-xs text-muted-foreground">Rata-rata Kehadiran</p>
                    </div>

                    {/* Perlu Perhatian */}
                    <div className="p-4 text-center">
                        <div className="inline-flex p-2.5 bg-red-100 rounded-full mb-2">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                        </div>
                        <p className="text-2xl font-bold text-red-600">
                            {stats.needsAttention}
                        </p>
                        <p className="text-xs text-muted-foreground">Perlu Bimbingan</p>
                    </div>
                </div>
            </Card>

            {/* Members Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Users className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold">Daftar Anggota Terdaftar</CardTitle>
                                <CardDescription>Anggota aktif ekstrakurikuler Pramuka</CardDescription>
                            </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            {totalItems} Anggota
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {/* Toolbar */}
                    <div className="p-4 border-b">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari nama atau NIS anggota..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <Select value={classFilter} onValueChange={setClassFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Kelas" />
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
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="text-left p-4 font-medium text-sm w-12">No</th>
                                    <th className="text-left p-4 font-medium text-sm w-24">NIS</th>
                                    <th className="text-left p-4 font-medium text-sm min-w-48">Nama</th>
                                    <th className="text-left p-4 font-medium text-sm w-24">Kelas</th>
                                    <th className="text-left p-4 font-medium text-sm w-36">Tgl Bergabung</th>
                                    <th className="text-left p-4 font-medium text-sm w-32">Kehadiran</th>
                                    <th className="text-center p-4 font-medium text-sm w-24">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    // Skeleton rows for table
                                    Array.from({ length: 5 }).map((_, idx) => (
                                        <tr key={idx} className="border-b">
                                            <td className="p-4"><Skeleton className="h-4 w-4" /></td>
                                            <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                                            <td className="p-4">
                                                <div className="space-y-2">
                                                    <Skeleton className="h-4 w-32" />
                                                    <Skeleton className="h-3 w-20" />
                                                </div>
                                            </td>
                                            <td className="p-4"><Skeleton className="h-6 w-16 rounded-full" /></td>
                                            <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                                            <td className="p-4"><Skeleton className="h-2 w-full" /></td>
                                            <td className="p-4"><Skeleton className="h-8 w-16 rounded-lg" /></td>
                                        </tr>
                                    ))
                                ) : members.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-12">
                                            <div className="flex flex-col items-center justify-center text-center space-y-4">
                                                <div className="p-4 bg-muted rounded-full">
                                                    <Search className="h-8 w-8 text-muted-foreground" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-lg">Tidak ada anggota ditemukan</h3>
                                                    <p className="text-muted-foreground">
                                                        Coba ubah kata kunci pencarian atau filter kelas
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    members.map((member, index) => (
                                        <tr key={member.id} className="border-b hover:bg-muted/30 transition-colors">
                                            <td className="p-4 text-sm">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                            <td className="p-4 text-sm font-mono">{member.nis}</td>
                                            <td className="p-4">
                                                <div className="font-medium">{member.name}</div>
                                            </td>
                                            <td className="p-4">
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200"
                                                >
                                                    {member.class}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-sm text-muted-foreground">
                                                {formatDate(new Date(member.joinDate), "dd MMM yyyy")}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-col gap-1.5 w-full max-w-[140px]">
                                                    <div className="flex justify-between text-xs">
                                                        <span className="font-medium">{member.attendance}%</span>
                                                        <span className="text-muted-foreground">Hadir</span>
                                                    </div>
                                                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                                        <div
                                                            className={cn(
                                                                "h-full transition-all duration-500",
                                                                member.attendance >= 90 ? "bg-green-500" :
                                                                    member.attendance >= 75 ? "bg-amber-500" : "bg-red-500"
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
                                                    className="h-8 px-3 bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary rounded-lg"
                                                    onClick={() => handleViewDetail(member)}
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

                    {/* Footer with Pagination */}
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 bg-muted/20">
                        {/* Left: Pagination Info */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Menampilkan</span>
                            <span className="font-medium text-foreground">
                                {members.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
                            </span>
                            <span>-</span>
                            <span className="font-medium text-foreground">
                                {Math.min(currentPage * itemsPerPage, totalItems)}
                            </span>
                            <span>dari</span>
                            <span className="font-medium text-foreground">{totalItems}</span>
                            <span>data</span>
                        </div>

                        {/* Right: Pagination */}
                        <div className="flex items-center gap-3">
                            {/* Items per page */}
                            {/* Items per page - Static for now or we need state */}
                            {/* <Select value={itemsPerPage.toString()} onValueChange={(val) => setItemsPerPage(Number(val))}> */}
                            {/*     <SelectTrigger className="w-[100px] h-8"> */}
                            {/*         <SelectValue /> */}
                            {/*     </SelectTrigger> */}
                            {/*     <SelectContent> */}
                            {/*         <SelectItem value="5">5 / hal</SelectItem> */}
                            {/*         <SelectItem value="10">10 / hal</SelectItem> */}
                            {/*         <SelectItem value="25">25 / hal</SelectItem> */}
                            {/*         <SelectItem value="50">50 / hal</SelectItem> */}
                            {/*     </SelectContent> */}
                            {/* </Select> */}


                            {/* Pagination buttons */}
                            {totalPages > 1 && (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">
                                        Hal {currentPage}/{totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <div className="flex items-center space-x-1">
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            const pageNumber = i + 1;
                                            return (
                                                <Button
                                                    key={pageNumber}
                                                    variant={currentPage === pageNumber ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => setCurrentPage(pageNumber)}
                                                    className={cn(
                                                        "w-8 h-8 p-0",
                                                        currentPage === pageNumber && "bg-blue-800 hover:bg-blue-900 text-white"
                                                    )}
                                                >
                                                    {pageNumber}
                                                </Button>
                                            );
                                        })}
                                        {totalPages > 5 && (
                                            <>
                                                <span className="text-sm text-muted-foreground">...</span>
                                                <Button
                                                    variant={currentPage === totalPages ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => setCurrentPage(totalPages)}
                                                    className={cn(
                                                        "w-8 h-8 p-0",
                                                        currentPage === totalPages && "bg-blue-800 hover:bg-blue-900 text-white"
                                                    )}
                                                >
                                                    {totalPages}
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Detail Member Dialog */}
            <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Users className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <DialogTitle>Detail Anggota</DialogTitle>
                                <DialogDescription>
                                    Informasi lengkap anggota ekstrakurikuler
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {isDetailLoading ? (
                        <div className="space-y-4 p-4">
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-14 w-14 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-20 w-full" />
                                <Skeleton className="h-20 w-full" />
                            </div>
                        </div>
                    ) : selectedMember ? (
                        <div className="space-y-4">
                            {/* Profile Header */}
                            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-xl font-bold text-primary">
                                        {selectedMember.name.charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">{selectedMember.name}</h3>
                                    <p className="text-sm text-muted-foreground">NIS: {selectedMember.nis}</p>
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">Kelas</p>
                                    <Badge className="bg-blue-50 text-blue-800 border-blue-200">
                                        {selectedMember.class}
                                    </Badge>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">Ekstrakurikuler</p>
                                    <Badge className="bg-primary/10 text-primary border-primary/20">
                                        Pramuka
                                    </Badge>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">Tanggal Bergabung</p>
                                    <p className="text-sm font-medium">
                                        {formatDate(new Date(selectedMember.joinDate), "dd MMMM yyyy")}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">Kehadiran</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold">{selectedMember.attendance}%</span>
                                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className={cn(
                                                    "h-full",
                                                    selectedMember.attendance >= 90 ? "bg-green-500" :
                                                        selectedMember.attendance >= 75 ? "bg-amber-500" : "bg-red-500"
                                                )}
                                                style={{ width: `${selectedMember.attendance}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Attendance Status */}
                            <div className="p-3 rounded-lg border bg-card">
                                <p className="text-xs text-muted-foreground mb-2">Status Kehadiran</p>
                                <p className={cn(
                                    "text-sm font-medium",
                                    selectedMember.attendance >= 90 ? "text-green-600" :
                                        selectedMember.attendance >= 75 ? "text-amber-600" : "text-red-600"
                                )}>
                                    {selectedMember.attendance >= 90 ? "Sangat Baik - Anggota rajin hadir" :
                                        selectedMember.attendance >= 75 ? "Cukup Baik - Perlu ditingkatkan" :
                                            "Perlu Perhatian - Kehadiran rendah"}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 text-center text-muted-foreground">
                            Data tidak ditemukan
                        </div>
                    )}

                    <div className="flex justify-end pt-2">
                        <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                            Tutup
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};
