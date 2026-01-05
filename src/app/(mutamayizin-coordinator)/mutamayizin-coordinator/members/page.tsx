"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
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
    Users,
    Search,
    Filter,
    Download,
    UserPlus,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    ShieldAlert,
    Mail,
    Phone,
    Eye,
    Edit,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Interface
interface Member {
    id: number;
    nis: string;
    name: string;
    class: string;
    email: string;
    phone: string;
    ekstrakurikuler: string[];
    status: "active" | "inactive";
    photo: string | null;
    joinDate: string;
}

// Mock Data
const mockMembers: Member[] = [
    {
        id: 1,
        nis: "2023001",
        name: "Abdullah",
        class: "X A",
        email: "abdullah@student.sch.id",
        phone: "081234567890",
        ekstrakurikuler: ["Pramuka", "Basket"],
        status: "active",
        photo: null,
        joinDate: "2023-07-15",
    },
    {
        id: 2,
        nis: "2023002",
        name: "Siti Aminah",
        class: "XI B",
        email: "siti.aminah@student.sch.id",
        phone: "081234567891",
        ekstrakurikuler: ["PMR"],
        status: "active",
        photo: null,
        joinDate: "2022-07-15",
    },
    {
        id: 3,
        nis: "2023003",
        name: "Budi Santoso",
        class: "XII A",
        email: "budi.santoso@student.sch.id",
        phone: "081234567892",
        ekstrakurikuler: ["Paskibra", "Futsal"],
        status: "inactive",
        photo: null,
        joinDate: "2021-07-15",
    },
    {
        id: 4,
        nis: "2023004",
        name: "Dewi Lestari",
        class: "X B",
        email: "dewi.lestari@student.sch.id",
        phone: "081234567893",
        ekstrakurikuler: ["Pramuka"],
        status: "active",
        photo: null,
        joinDate: "2023-07-20",
    },
    {
        id: 5,
        nis: "2023005",
        name: "Eko Prasetyo",
        class: "XI A",
        email: "eko.prasetyo@student.sch.id",
        phone: "081234567894",
        ekstrakurikuler: ["Basket", "PMR"],
        status: "active",
        photo: null,
        joinDate: "2022-08-01",
    },
    {
        id: 6,
        nis: "2023006",
        name: "Fani Rahmawati",
        class: "XII B",
        email: "fani.rahma@student.sch.id",
        phone: "081234567895",
        ekstrakurikuler: ["Seni Tari"],
        status: "active",
        photo: null,
        joinDate: "2021-07-18",
    },
    {
        id: 7,
        nis: "2023007",
        name: "Gilang Ramadhan",
        class: "X A",
        email: "gilang.rama@student.sch.id",
        phone: "081234567896",
        ekstrakurikuler: ["Futsal"],
        status: "active",
        photo: null,
        joinDate: "2023-07-15",
    },
    {
        id: 8,
        nis: "2023008",
        name: "Haniifah",
        class: "XI B",
        email: "haniifah@student.sch.id",
        phone: "081234567897",
        ekstrakurikuler: ["Pramuka", "PMR"],
        status: "inactive",
        photo: null,
        joinDate: "2022-07-20",
    },
    {
        id: 9,
        nis: "2023009",
        name: "Iwan Setiawan",
        class: "XII A",
        email: "iwan.setiawan@student.sch.id",
        phone: "081234567898",
        ekstrakurikuler: ["Paskibra"],
        status: "active",
        photo: null,
        joinDate: "2021-08-05",
    },
    {
        id: 10,
        nis: "2023010",
        name: "Joko Susilo",
        class: "X B",
        email: "joko.susilo@student.sch.id",
        phone: "081234567899",
        ekstrakurikuler: ["Basket"],
        status: "active",
        photo: null,
        joinDate: "2023-07-25",
    },
    {
        id: 11,
        nis: "2023011",
        name: "Kartika Sari",
        class: "XI A",
        email: "kartika.sari@student.sch.id",
        phone: "081234567800",
        ekstrakurikuler: ["Seni Tari", "Pramuka"],
        status: "active",
        photo: null,
        joinDate: "2022-07-16",
    },
    {
        id: 12,
        nis: "2023012",
        name: "Lukman Hakim",
        class: "XII B",
        email: "lukman.hakim@student.sch.id",
        phone: "081234567801",
        ekstrakurikuler: ["Futsal"],
        status: "active",
        photo: null,
        joinDate: "2021-07-20",
    },
];

export default function MembersPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [ekskulFilter, setEkskulFilter] = useState("all");
    const [classFilter, setClassFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Filter Logic
    const filteredMembers = useMemo(() => {
        return mockMembers.filter((member) => {
            const matchesSearch =
                member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                member.nis.includes(searchQuery) ||
                member.email.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesEkskul = ekskulFilter === "all" || member.ekstrakurikuler.includes(ekskulFilter);
            const matchesClass = classFilter === "all" || member.class.startsWith(classFilter); // Simplified class filter

            return matchesSearch && matchesEkskul && matchesClass;
        });
    }, [searchQuery, ekskulFilter, classFilter]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
    const paginatedMembers = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredMembers.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredMembers, currentPage, itemsPerPage]);

    // Stats
    const totalMembers = mockMembers.length;
    const activeMembers = mockMembers.filter(m => m.status === "active").length;
    const multiEkskulMembers = mockMembers.filter(m => m.ekstrakurikuler.length > 1).length;

    // Helper functions
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    const uniqueEkskul = Array.from(new Set(mockMembers.flatMap(m => m.ekstrakurikuler))).sort();

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Data </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Anggota Ekskul</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                            <Users className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Kelola data siswa yang terdaftar dalam program ekstrakurikuler
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button className="bg-blue-800 text-white hover:bg-blue-900 gap-2">
                        <UserPlus className="h-4 w-4" />
                        Tambah Anggota
                    </Button>
                </div>
            </div>

            {/* Stats Cards (Blue Theme like Achievements) */}
            <Card className="overflow-hidden p-0">
                <div className="bg-blue-800 p-4 relative overflow-hidden">
                    {/* Decorative Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-40 h-40 border-[20px] border-white rounded-full -translate-y-1/2 translate-x-1/4" />
                        <div className="absolute bottom-0 right-1/3 w-20 h-20 border-[8px] border-white rounded-full translate-y-1/2" />
                    </div>

                    <div className="flex items-center gap-3 relative z-10">
                        <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                            <Users className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Statistik Keanggotaan</h2>
                            <p className="text-blue-100 text-sm">Overview partisipasi siswa</p>
                        </div>
                    </div>
                </div>

                <CardContent className="p-0">
                    <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x">
                        {/* Total Members */}
                        <div className="p-2.5 text-center">
                            <div className="inline-flex p-2 bg-blue-100 rounded-full mb-1.5">
                                <Users className="h-4 w-4 text-blue-800" />
                            </div>
                            <p className="text-2xl font-bold text-blue-800">{totalMembers}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Total Siswa Terdaftar</p>
                        </div>

                        {/* Active Members */}
                        <div className="p-2.5 text-center">
                            <div className="inline-flex p-2 bg-green-100 rounded-full mb-1.5">
                                <ShieldCheck className="h-4 w-4 text-green-600" />
                            </div>
                            <p className="text-2xl font-bold text-green-600">{activeMembers}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Status Aktif</p>
                        </div>

                        {/* Multi Ekskul */}
                        <div className="p-2.5 text-center">
                            <div className="inline-flex p-2 bg-purple-100 rounded-full mb-1.5">
                                <Users className="h-4 w-4 text-purple-600" />
                            </div>
                            <p className="text-2xl font-bold text-purple-600">{multiEkskulMembers}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Ikut &gt; 1 Ekskul</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Table Card */}
            <Card>
                <CardHeader className="pb-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Users className="h-5 w-5 text-blue-800" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold">Daftar Anggota</CardTitle>
                            <CardDescription>Data lengkap siswa beserta keaktifan ekstrakurikuler</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {/* Toolbar */}
                    <div className="px-4 pb-4 pt-2 border-b">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    placeholder="Cari nama, NIS, atau email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 h-11"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Select value={ekskulFilter} onValueChange={setEkskulFilter}>
                                    <SelectTrigger className="w-[240px] h-11">
                                        <Filter className="h-4 w-4 mr-2" />
                                        <SelectValue placeholder="Ekstrakurikuler" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Ekskul</SelectItem>
                                        {uniqueEkskul.map(ekskul => (
                                            <SelectItem key={ekskul} value={ekskul}>{ekskul}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={classFilter} onValueChange={setClassFilter}>
                                    <SelectTrigger className="w-[180px] h-11">
                                        <Filter className="h-4 w-4 mr-2" />
                                        <SelectValue placeholder="Kelas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Kelas</SelectItem>
                                        <SelectItem value="X">Kelas X</SelectItem>
                                        <SelectItem value="XI">Kelas XI</SelectItem>
                                        <SelectItem value="XII">Kelas XII</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button className="bg-blue-800 hover:bg-blue-900 text-white">
                                    <Download className="h-4 w-4 mr-2" />
                                    Export
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="text-left p-4 font-medium text-sm w-12">No</th>
                                    <th className="text-left p-4 font-medium text-sm w-24">NIS</th>
                                    <th className="text-left p-4 font-medium text-sm min-w-64">Nama Siswa</th>
                                    <th className="text-left p-4 font-medium text-sm w-24">Kelas</th>
                                    <th className="text-left p-4 font-medium text-sm">Ekstrakurikuler</th>
                                    <th className="text-left p-4 font-medium text-sm w-32">Status</th>
                                    <th className="text-right p-4 font-medium text-sm w-16">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedMembers.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-12 text-center text-muted-foreground">
                                            Tidak ada data anggota yang ditemukan.
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedMembers.map((member, index) => {
                                        const globalIndex = (currentPage - 1) * itemsPerPage + index + 1;
                                        return (
                                            <tr key={member.id} className="border-b hover:bg-muted/30 transition-colors">
                                                <td className="p-4 text-sm">{globalIndex}</td>
                                                <td className="p-4 text-sm font-mono">{member.nis}</td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        {member.photo ? (
                                                            <img
                                                                src={member.photo}
                                                                alt={member.name}
                                                                className="h-10 w-10 rounded-full object-cover border border-slate-200"
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200/50">
                                                                <span className="text-sm font-bold text-blue-800">
                                                                    {getInitials(member.name)}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-gray-900">{member.name}</span>
                                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                                <Mail className="h-3 w-3" />
                                                                {member.email}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <Badge className="bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100">
                                                        {member.class}
                                                    </Badge>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {member.ekstrakurikuler.map((ekskul, i) => (
                                                            <Badge key={i} className="bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100">
                                                                {ekskul}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <Badge
                                                        variant={member.status === "active" ? "default" : "secondary"}
                                                        className={cn(
                                                            "pl-2 pr-3 py-1 rounded-full border shadow-none font-medium", // Common styles
                                                            member.status === "active"
                                                                ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-100" // Active styles
                                                                : "bg-red-100 text-red-700 border-red-200 hover:bg-red-100" // Inactive styles
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "mr-1.5 flex items-center justify-center rounded-full w-4 h-4",
                                                            member.status === "active" ? "bg-green-600/20 text-green-600" : "bg-red-600/20 text-red-600"
                                                        )}>
                                                            {member.status === "active" ? (
                                                                <ShieldCheck className="h-3 w-3" />
                                                            ) : (
                                                                <ShieldAlert className="h-3 w-3" />
                                                            )}
                                                        </div>
                                                        {member.status === "active" ? "Aktif" : "Tidak Aktif"}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-8 px-3 bg-blue-100 hover:bg-blue-200 text-blue-800 hover:text-blue-900 border-blue-200"
                                                            >
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48">
                                                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                            <DropdownMenuItem onClick={() => router.push(`/mutamayizin-coordinator/members/${member.id}`)} className="focus:bg-blue-50">
                                                                <div className="p-1.5 bg-blue-100 rounded-md mr-2">
                                                                    <Eye className="h-3.5 w-3.5 text-blue-800" />
                                                                </div>
                                                                <span className="text-blue-800">Lihat Detail</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="focus:bg-amber-50">
                                                                <div className="p-1.5 bg-amber-100 rounded-md mr-2">
                                                                    <Edit className="h-3.5 w-3.5 text-amber-600" />
                                                                </div>
                                                                <span className="text-foreground">Edit Data</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="focus:bg-red-50">
                                                                <div className="p-1.5 bg-red-100 rounded-md mr-2">
                                                                    <ShieldAlert className="h-3.5 w-3.5 text-red-600" />
                                                                </div>
                                                                <span className="text-red-600">Non-aktifkan</span>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer / Pagination */}
                    <div className="border-t p-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50">
                        <div className="text-sm text-muted-foreground order-2 sm:order-1">
                            Menampilkan <span className="font-medium text-gray-900">
                                {Math.min((currentPage - 1) * itemsPerPage + 1, filteredMembers.length)}
                            </span> - <span className="font-medium text-gray-900">
                                {Math.min(currentPage * itemsPerPage, filteredMembers.length)}
                            </span> dari <span className="font-medium text-gray-900">{filteredMembers.length}</span> data
                        </div>

                        <div className="flex items-center gap-2 order-1 sm:order-2">
                            <Select
                                value={itemsPerPage.toString()}
                                onValueChange={(value) => {
                                    setItemsPerPage(Number(value));
                                    setCurrentPage(1);
                                }}
                            >
                                <SelectTrigger className="w-[110px] h-9">
                                    <SelectValue placeholder="10 / hal" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5 / hal</SelectItem>
                                    <SelectItem value="10">10 / hal</SelectItem>
                                    <SelectItem value="20">20 / hal</SelectItem>
                                    <SelectItem value="50">50 / hal</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="flex items-center gap-1">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-9 w-9"
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                    let pageNumber = i + 1;
                                    // Simple logic to show window around current page could be added
                                    return (
                                        <Button
                                            key={pageNumber}
                                            variant={currentPage === pageNumber ? "default" : "outline"}
                                            size="icon"
                                            className={cn(
                                                "h-9 w-9",
                                                currentPage === pageNumber && "bg-blue-800 hover:bg-blue-900 text-white"
                                            )}
                                            onClick={() => setCurrentPage(pageNumber)}
                                        >
                                            {pageNumber}
                                        </Button>
                                    );
                                })}
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-9 w-9"
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div >
    );
}
