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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

// Mock data untuk prestasi
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
];

export const MutamayizinAchievements: React.FC = () => {
    const router = useRouter();
    const [achievements] = useState<Achievement[]>(mockAchievements);
    const [searchQuery, setSearchQuery] = useState("");
    const [levelFilter, setLevelFilter] = useState("all");

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

    // Stats
    const totalAchievements = achievements.length;
    const nationalAchievements = achievements.filter((a) => a.level === "Nasional" || a.level === "Internasional").length;
    const firstPlaceCount = achievements.filter((a) => a.rank === "Juara 1").length;

    const handleAddNew = () => {
        router.push("/mutamayizin-coordinator/achievements/add");
    };

    const getLevelBadgeColor = (level: string) => {
        switch (level) {
            case "Internasional":
                return "bg-purple-100 text-purple-700 border-purple-200";
            case "Nasional":
                return "bg-red-100 text-red-700 border-red-200";
            case "Provinsi":
                return "bg-blue-100 text-blue-700 border-blue-200";
            case "Kabupaten":
                return "bg-green-100 text-green-700 border-green-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const getRankBadgeColor = (rank: string) => {
        switch (rank) {
            case "Juara 1":
                return "bg-yellow-100 text-yellow-800 border-yellow-300";
            case "Juara 2":
                return "bg-slate-100 text-slate-700 border-slate-300";
            case "Juara 3":
                return "bg-orange-100 text-orange-700 border-orange-300";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
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
                        Kelola data prestasi siswa Program Mutamayizin
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

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Total Prestasi</p>
                                <p className="text-2xl font-bold">{totalAchievements}</p>
                                <p className="text-xs text-muted-foreground">Tahun ini</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <Trophy className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Tingkat Nasional+</p>
                                <p className="text-2xl font-bold text-red-600">{nationalAchievements}</p>
                                <p className="text-xs text-muted-foreground">Nasional & Internasional</p>
                            </div>
                            <div className="p-3 bg-red-100 rounded-xl">
                                <Star className="h-6 w-6 text-red-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Juara 1</p>
                                <p className="text-2xl font-bold text-primary">{firstPlaceCount}</p>
                                <p className="text-xs text-muted-foreground">Peringkat tertinggi</p>
                            </div>
                            <div className="p-3 bg-primary/10 rounded-xl">
                                <TrendingUp className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Achievements Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Award className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold">Daftar Prestasi Siswa</CardTitle>
                            <CardDescription>Kelola dan pantau prestasi siswa</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {/* Toolbar */}
                    <div className="p-4 border-b">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari berdasarkan nama siswa, lomba, atau event..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <Select value={levelFilter} onValueChange={setLevelFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <Filter className="h-4 w-4 mr-2" />
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
                                    <th className="text-left p-4 font-medium text-sm min-w-[150px]">Nama Siswa</th>
                                    <th className="text-left p-4 font-medium text-sm min-w-[180px]">Nama Lomba</th>
                                    <th className="text-left p-4 font-medium text-sm w-32">Kategori</th>
                                    <th className="text-left p-4 font-medium text-sm w-32">Peringkat</th>
                                    <th className="text-left p-4 font-medium text-sm min-w-[200px]">Event</th>
                                    <th className="text-left p-4 font-medium text-sm min-w-[200px]">Penyelenggara</th>
                                    <th className="text-left p-4 font-medium text-sm w-32">Tingkat</th>
                                    <th className="text-left p-4 font-medium text-sm w-32">Tanggal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAchievements.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="p-12">
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
                                    filteredAchievements.map((achievement, index) => (
                                        <tr key={achievement.id} className="border-b hover:bg-muted/30 transition-colors">
                                            <td className="p-4 text-sm">{index + 1}</td>
                                            <td className="p-4">
                                                <div className="font-medium">{achievement.studentName}</div>
                                            </td>
                                            <td className="p-4 text-sm">{achievement.competitionName}</td>
                                            <td className="p-4 text-sm text-muted-foreground">{achievement.category || "-"}</td>
                                            <td className="p-4">
                                                <Badge variant="outline" className={getRankBadgeColor(achievement.rank)}>
                                                    <Star className="h-3 w-3 mr-1" />
                                                    {achievement.rank}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-sm">{achievement.eventName}</td>
                                            <td className="p-4 text-sm text-muted-foreground">{achievement.organizer}</td>
                                            <td className="p-4">
                                                <Badge variant="outline" className={getLevelBadgeColor(achievement.level)}>
                                                    <MapPin className="h-3 w-3 mr-1" />
                                                    {achievement.level}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-sm text-muted-foreground">
                                                {new Date(achievement.date).toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric"
                                                })}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer Info */}
                    <div className="p-4 border-t text-sm text-muted-foreground">
                        Menampilkan {filteredAchievements.length} dari {achievements.length} prestasi
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
