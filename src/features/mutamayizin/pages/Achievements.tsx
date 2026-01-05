"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
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
    Award,
    Calendar,
    Plus,
    Search,
    MapPin,
    Star,
    Filter,
    TrendingUp,
    Trophy,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    Eye,
    Edit,
    Trash2,
    User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Achievement interface
interface Achievement {
    id: number;
    studentName: string;
    competitionName: string;
    category: string;
    rank: string;
    eventName: string;
    organizer: string;
    level: string;
    date: string;
    photo: string | null;
}

// Mock data untuk prestasi (15 items for pagination testing)
const mockAchievements: Achievement[] = [
    {
        id: 1,
        studentName: "Ahmad Rizki",
        competitionName: "Olimpiade Matematika",
        category: "Akademik",
        rank: "Juara 1",
        eventName: "OSN Tingkat Provinsi",
        organizer: "Dinas Pendidikan Provinsi Kalimantan Barat",
        level: "Provinsi",
        date: "2024-11-15",
        photo: null,
    },
    {
        id: 101,
        studentName: "Ahmad Rizki",
        competitionName: "Kompetisi Sains Madrasah",
        category: "Akademik",
        rank: "Juara 3",
        eventName: "KSM Kabupaten",
        organizer: "Kemenag Kabupaten",
        level: "Kabupaten",
        date: "2024-08-10",
        photo: null,
    },
    {
        id: 102,
        studentName: "Ahmad Rizki",
        competitionName: "Lomba Cerdas Cermat",
        category: "Akademik",
        rank: "Juara 1",
        eventName: "LCC Sekolah",
        organizer: "OSIS SMA",
        level: "Sekolah",
        date: "2024-05-02",
        photo: null,
    },
    {
        id: 103,
        studentName: "Ahmad Rizki",
        competitionName: "Olimpiade Matematika Nasional",
        category: "Akademik",
        rank: "Juara 2",
        eventName: "OSN Nasional",
        organizer: "Puspresnas",
        level: "Nasional",
        date: "2023-11-15",
        photo: null,
    },
    {
        id: 104,
        studentName: "Ahmad Rizki",
        competitionName: "Lomba Pidato Bahasa Arab",
        category: "Bahasa",
        rank: "Juara 1",
        eventName: "Festival Bahasa Arab",
        organizer: "MGMP Bahasa Arab",
        level: "Provinsi",
        date: "2023-08-20",
        photo: null,
    },
    {
        id: 105,
        studentName: "Ahmad Rizki",
        competitionName: "Musabaqah Tilawatil Quran",
        category: "Keagamaan",
        rank: "Harapan 1",
        eventName: "MTQ Kabupaten",
        organizer: "LPTQ Kabupaten",
        level: "Kabupaten",
        date: "2023-05-10",
        photo: null,
    },
    {
        id: 106,
        studentName: "Ahmad Rizki",
        competitionName: "Lomba Kaligrafi Islam",
        category: "Seni",
        rank: "Juara 3",
        eventName: "Pekan Seni Islami",
        organizer: "Yayasan Al-Fityan",
        level: "Sekolah",
        date: "2023-03-05",
        photo: null,
    },
    {
        id: 107,
        studentName: "Ahmad Rizki",
        competitionName: "Science Fair Project",
        category: "Sains",
        rank: "Juara 2",
        eventName: "Expo Pendidikan",
        organizer: "Dinas Pendidikan Kota",
        level: "Kecamatan",
        date: "2023-01-20",
        photo: null,
    },
    {
        id: 2,
        studentName: "Siti Nabila",
        competitionName: "Lomba Pidato Bahasa Inggris",
        category: "Non-Akademik",
        rank: "Juara 2",
        eventName: "English Speech Competition",
        organizer: "Dinas Pendidikan Kabupaten Kubu Raya",
        level: "Kabupaten",
        date: "2024-10-20",
        photo: null,
    },
    {
        id: 3,
        studentName: "Muhammad Fajar",
        competitionName: "Kompetisi Robotika",
        category: "Teknologi",
        rank: "Juara 1",
        eventName: "National Robotics Competition",
        organizer: "Kementerian Pendidikan dan Kebudayaan RI",
        level: "Nasional",
        date: "2024-09-10",
        photo: null,
    },
    {
        id: 4,
        studentName: "Rina Amelia",
        competitionName: "Lomba Karya Tulis Ilmiah",
        category: "Akademik",
        rank: "Juara 3",
        eventName: "LKTI Nasional",
        organizer: "Universitas Tanjungpura",
        level: "Nasional",
        date: "2024-08-25",
        photo: null,
    },
    {
        id: 5,
        studentName: "Budi Santoso",
        competitionName: "Lomba Futsal",
        category: "Olahraga",
        rank: "Juara 1",
        eventName: "Turnamen Futsal Pelajar",
        organizer: "KONI Kalimantan Barat",
        level: "Provinsi",
        date: "2024-07-18",
        photo: null,
    },
    {
        id: 6,
        studentName: "Dewi Lestari",
        competitionName: "Lomba Menyanyi",
        category: "Seni",
        rank: "Juara 2",
        eventName: "Festival Seni Pelajar",
        organizer: "Dinas Kebudayaan Kalbar",
        level: "Provinsi",
        date: "2024-06-30",
        photo: null,
    },
    {
        id: 7,
        studentName: "Arif Hidayat",
        competitionName: "Olimpiade Fisika",
        category: "Akademik",
        rank: "Juara 3",
        eventName: "OSN Kabupaten",
        organizer: "Dinas Pendidikan Kabupaten Kubu Raya",
        level: "Kabupaten",
        date: "2024-05-12",
        photo: null,
    },
    {
        id: 8,
        studentName: "Indah Permata",
        competitionName: "Lomba Desain Grafis",
        category: "Teknologi",
        rank: "Juara 1",
        eventName: "Creative Design Competition",
        organizer: "Politeknik Negeri Pontianak",
        level: "Provinsi",
        date: "2024-04-22",
        photo: null,
    },
    {
        id: 9,
        studentName: "Dimas Pratama",
        competitionName: "Olimpiade Kimia",
        category: "Akademik",
        rank: "Juara 2",
        eventName: "OSN Tingkat Nasional",
        organizer: "Kemendikbud RI",
        level: "Nasional",
        date: "2024-03-15",
        photo: null,
    },
    {
        id: 10,
        studentName: "Ayu Kartika",
        competitionName: "Lomba Tari Tradisional",
        category: "Seni",
        rank: "Juara 1",
        eventName: "Festival Budaya Nusantara",
        organizer: "Kemendikbud RI",
        level: "Nasional",
        date: "2024-02-28",
        photo: null,
    },
    {
        id: 11,
        studentName: "Reza Maulana",
        competitionName: "Lomba Catur",
        category: "Olahraga",
        rank: "Juara 3",
        eventName: "Championship Catur Pelajar",
        organizer: "Percasi Kalbar",
        level: "Provinsi",
        date: "2024-01-20",
        photo: null,
    },
    {
        id: 12,
        studentName: "Fitri Handayani",
        competitionName: "Olimpiade Biologi",
        category: "Akademik",
        rank: "Juara 1",
        eventName: "OSN Provinsi",
        organizer: "Dinas Pendidikan Provinsi Kalbar",
        level: "Provinsi",
        date: "2023-12-10",
        photo: null,
    },
    {
        id: 13,
        studentName: "Hendra Gunawan",
        competitionName: "Lomba Fotografi",
        category: "Seni",
        rank: "Juara 2",
        eventName: "Photography Contest",
        organizer: "Komunitas Fotografer Pontianak",
        level: "Kabupaten",
        date: "2023-11-25",
        photo: null,
    },
    {
        id: 14,
        studentName: "Lina Marlina",
        competitionName: "Lomba Debat Bahasa Indonesia",
        category: "Non-Akademik",
        rank: "Juara 1",
        eventName: "National Debate Championship",
        organizer: "Kemendikbud RI",
        level: "Nasional",
        date: "2023-10-15",
        photo: null,
    },
    {
        id: 15,
        studentName: "Yoga Pratama",
        competitionName: "Lomba Robotik",
        category: "Teknologi",
        rank: "Juara 3",
        eventName: "World Robot Olympiad",
        organizer: "WRO Indonesia",
        level: "Internasional",
        date: "2023-09-05",
        photo: null,
    },
];

export const MutamayizinAchievements: React.FC = () => {
    const router = useRouter();
    const [achievements] = useState<Achievement[]>(mockAchievements);
    const [searchQuery, setSearchQuery] = useState("");
    const [levelFilter, setLevelFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

    // Filter achievements
    const filteredAchievements = useMemo(() => {
        return achievements.filter((achievement) => {
            const matchesSearch =
                achievement.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                achievement.competitionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                achievement.eventName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesLevel = levelFilter === "all" || achievement.level === levelFilter;
            return matchesSearch && matchesLevel;
        });
    }, [achievements, searchQuery, levelFilter]);

    // Pagination
    const totalPages = Math.ceil(filteredAchievements.length / itemsPerPage);
    const paginatedAchievements = filteredAchievements.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset to page 1 when filters change
    useMemo(() => {
        setCurrentPage(1);
    }, [searchQuery, levelFilter]);

    // Stats
    const totalAchievements = achievements.length;
    const nationalAchievements = achievements.filter((a) => a.level === "Nasional" || a.level === "Internasional").length;
    const firstPlaceCount = achievements.filter((a) => a.rank === "Juara 1").length;

    const handleAddNew = () => {
        router.push("/mutamayizin-coordinator/achievements/add");
    };

    const handleViewDetail = (achievement: Achievement) => {
        router.push(`/mutamayizin-coordinator/achievements/${achievement.id}`);
    };

    const handleEdit = (achievement: Achievement) => {
        router.push(`/mutamayizin-coordinator/achievements/${achievement.id}/edit`);
    };

    const handleDeleteClick = (achievement: Achievement) => {
        setSelectedAchievement(achievement);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (selectedAchievement) {
            // TODO: API call to delete
            console.log("Deleting achievement:", selectedAchievement.id);
            // Show success toast
            setDeleteDialogOpen(false);
            setSelectedAchievement(null);
        }
    };

    const getLevelBadgeColor = () => {
        return "bg-amber-100 text-amber-800 border-amber-300";
    };

    const getRankBadgeColor = (rank: string) => {
        switch (rank) {
            case "Juara 1":
                return "bg-emerald-100 text-emerald-700 border-emerald-300";
            case "Juara 2":
                return "bg-sky-100 text-sky-700 border-sky-300";
            case "Juara 3":
                return "bg-orange-100 text-orange-700 border-orange-300";
            default:
                return "bg-zinc-100 text-zinc-600 border-zinc-300";
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Data </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Prestasi</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Award className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Kelola data dan riwayat prestasi siswa Program Mutamayizin
                    </p>
                    <div className="flex items-center gap-3 mt-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm font-semibold">Tahun Ajaran 2025/2026</span>
                        </div>
                        <div className="h-4 w-[1px] bg-border" />
                        <span className="text-sm font-medium text-blue-800">
                            Semester Ganjil
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleAddNew}
                        className="bg-blue-800 text-white hover:bg-blue-900 px-6 py-2.5"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Prestasi
                    </Button>
                </div>
            </div>

            {/* Stats Card with Decorative Header */}
            <Card className="overflow-hidden p-0">
                {/* Decorative Header Section */}
                <div className="bg-blue-800 p-4 relative overflow-hidden">
                    {/* Decorative Geometric Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-40 h-40 border-[20px] border-white rounded-full -translate-y-1/2 translate-x-1/4" />
                        <div className="absolute bottom-0 right-1/3 w-20 h-20 border-[8px] border-white rounded-full translate-y-1/2" />
                    </div>

                    <div className="flex items-center gap-3 relative z-10">
                        <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                            <Award className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Statistik Prestasi</h2>
                            <p className="text-blue-100 text-sm">Program Mutamayizin Alfityan</p>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <CardContent className="p-0">
                    <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x">
                        {/* Total Prestasi */}
                        <div className="p-2.5 text-center">
                            <div className="inline-flex p-2 bg-blue-100 rounded-full mb-1.5">
                                <Trophy className="h-4 w-4 text-blue-800" />
                            </div>
                            <p className="text-2xl font-bold text-blue-800">{totalAchievements}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Total Prestasi</p>
                        </div>

                        {/* Tingkat Nasional+ */}
                        <div className="p-2.5 text-center">
                            <div className="inline-flex p-2 bg-red-100 rounded-full mb-1.5">
                                <Star className="h-4 w-4 text-red-600" />
                            </div>
                            <p className="text-2xl font-bold text-red-600">{nationalAchievements}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Nasional & Internasional</p>
                        </div>

                        {/* Juara 1 */}
                        <div className="p-2.5 text-center">
                            <div className="inline-flex p-2 bg-emerald-100 rounded-full mb-1.5">
                                <TrendingUp className="h-4 w-4 text-emerald-600" />
                            </div>
                            <p className="text-2xl font-bold text-emerald-600">{firstPlaceCount}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Juara 1</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Achievements Table */}
            <Card>
                <CardHeader className="pb-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Award className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold">Daftar Prestasi Siswa</CardTitle>
                                <CardDescription>Daftar pencapaian dan kompetisi siswa Program Mutamayizin</CardDescription>
                            </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            {filteredAchievements.length} Prestasi
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {/* Toolbar */}
                    <div className="px-4 pb-4 pt-2 border-b">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    placeholder="Cari berdasarkan nama siswa, lomba, atau event..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 h-11"
                                />
                            </div>
                            <Select value={levelFilter} onValueChange={setLevelFilter}>
                                <SelectTrigger className="w-[180px] h-11">
                                    <Filter className="h-5 w-5 mr-2" />
                                    <SelectValue placeholder="Tingkat" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Tingkat</SelectItem>
                                    <SelectItem value="Sekolah">Sekolah</SelectItem>
                                    <SelectItem value="Kecamatan">Kecamatan</SelectItem>
                                    <SelectItem value="Kabupaten">Kabupaten</SelectItem>
                                    <SelectItem value="Provinsi">Provinsi</SelectItem>
                                    <SelectItem value="Nasional">Nasional</SelectItem>
                                    <SelectItem value="Internasional">Internasional</SelectItem>
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
                                    <th className="text-left p-4 font-medium text-sm min-w-[180px]">Nama Siswa</th>
                                    <th className="text-left p-4 font-medium text-sm min-w-[200px]">Nama Lomba</th>
                                    <th className="text-left p-4 font-medium text-sm w-32">Peringkat</th>
                                    <th className="text-left p-4 font-medium text-sm w-32">Tingkat</th>
                                    <th className="text-left p-4 font-medium text-sm w-32">Tanggal</th>
                                    <th className="text-center p-4 font-medium text-sm w-24">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAchievements.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-12">
                                            <div className="flex flex-col items-center justify-center text-center space-y-4">
                                                <div className="rounded-full bg-muted p-6">
                                                    <Search className="h-12 w-12 text-muted-foreground" />
                                                </div>
                                                <div className="space-y-2">
                                                    <h3 className="text-lg font-semibold">Tidak Ada Data</h3>
                                                    <p className="text-sm text-muted-foreground max-w-md">
                                                        {searchQuery
                                                            ? `Tidak ada prestasi yang cocok dengan pencarian "${searchQuery}"`
                                                            : "Tidak ada data prestasi."}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedAchievements.map((achievement, index) => (
                                        <tr key={achievement.id} className="border-b hover:bg-muted/50 transition-all duration-150 group">
                                            <td className="p-4">
                                                <div className="text-sm font-medium text-muted-foreground">{(currentPage - 1) * itemsPerPage + index + 1}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                        <User className="h-4 w-4 text-blue-800" />
                                                    </div>
                                                    <div className="text-foreground">{achievement.studentName}</div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="space-y-1">
                                                    <div className="text-foreground leading-tight">{achievement.competitionName}</div>
                                                    {achievement.category && (
                                                        <div className="text-xs text-muted-foreground">{achievement.category}</div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <Badge variant="outline" className={`${getRankBadgeColor(achievement.rank)} font-medium px-2.5 py-1 text-xs`}>
                                                    <Star className="h-3.5 w-3.5 mr-1.5" />
                                                    {achievement.rank}
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                <Badge variant="outline" className={`${getLevelBadgeColor()} font-medium px-2.5 py-1 text-xs`}>
                                                    <MapPin className="h-3.5 w-3.5 mr-1.5" />
                                                    {achievement.level}
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-sm text-muted-foreground">
                                                    {new Date(achievement.date).toLocaleDateString("id-ID", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric"
                                                    })}
                                                </div>
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
                                                        <DropdownMenuItem onClick={() => handleViewDetail(achievement)} className="focus:bg-blue-50">
                                                            <div className="p-1.5 bg-blue-100 rounded-md mr-2">
                                                                <Eye className="h-3.5 w-3.5 text-blue-800" />
                                                            </div>
                                                            <span className="text-blue-800">Lihat Detail</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleEdit(achievement)} className="focus:bg-amber-50">
                                                            <div className="p-1.5 bg-amber-100 rounded-md mr-2">
                                                                <Edit className="h-3.5 w-3.5 text-amber-600" />
                                                            </div>
                                                            <span className="text-foreground">Edit</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleDeleteClick(achievement)}
                                                            className="focus:bg-red-50"
                                                        >
                                                            <div className="p-1.5 bg-red-100 rounded-md mr-2">
                                                                <Trash2 className="h-3.5 w-3.5 text-red-600" />
                                                            </div>
                                                            <span className="text-red-600">Hapus</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
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
                                {filteredAchievements.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
                            </span>
                            <span>-</span>
                            <span className="font-medium text-foreground">
                                {Math.min(currentPage * itemsPerPage, filteredAchievements.length)}
                            </span>
                            <span>dari</span>
                            <span className="font-medium text-foreground">{filteredAchievements.length}</span>
                            <span>prestasi</span>
                        </div>

                        {/* Right: Pagination */}
                        <div className="flex items-center gap-3">
                            {/* Items per page */}
                            <Select value={itemsPerPage.toString()} onValueChange={(val) => setItemsPerPage(Number(val))}>
                                <SelectTrigger className="w-[100px] h-8">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5 / hal</SelectItem>
                                    <SelectItem value="10">10 / hal</SelectItem>
                                    <SelectItem value="25">25 / hal</SelectItem>
                                </SelectContent>
                            </Select>

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
        </div>
    );
};
