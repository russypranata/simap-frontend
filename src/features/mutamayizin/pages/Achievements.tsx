"use client";

import React, { useState } from "react";
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Search,
    Filter,
    Plus,
    MoreVertical,
    FileText,
    Trash2,
    Calendar,
    Award,
    Trophy,
    MapPin,
    Image as ImageIcon,
    Download,
    Upload
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";

// Mock Data Types
type AchievementLevel = "Sekolah" | "Kecamatan" | "Kabupaten/Kota" | "Provinsi" | "Nasional" | "Internasional";
type AchievementCategory = "Akademik" | "Al-Qur'an" | "Bahasa" | "Olahraga" | "Seni" | "Riset" | "Lainnya";

interface Achievement {
    id: string;
    studentName: string;
    studentClass: string;
    competitionName: string;
    category: AchievementCategory;
    rank: string;
    eventName: string;
    level: AchievementLevel;
    date: string;
    photoUrl?: string;
}

// Mock Data
const mockAchievements: Achievement[] = [
    {
        id: "1",
        studentName: "Ahmad Fulan",
        studentClass: "XI IPA 1",
        competitionName: "Olimpiade Matematika Tingkat Kota",
        category: "Akademik",
        rank: "Juara 1",
        eventName: "OSN Kota Pontianak 2025",
        level: "Kabupaten/Kota",
        date: "2025-02-15",
    },
    {
        id: "2",
        studentName: "Siti Aminah",
        studentClass: "X IPS 2",
        competitionName: "MHQ 5 Juz",
        category: "Al-Qur'an",
        rank: "Juara 2",
        eventName: "Festival Anak Sholeh",
        level: "Provinsi",
        date: "2025-01-20",
    },
    {
        id: "3",
        studentName: "Budi Santoso",
        studentClass: "XI IPA 2",
        competitionName: "Lomba Pidato Bahasa Arab",
        category: "Bahasa",
        rank: "Harapan 1",
        eventName: "Pekan Bahasa Arab Nasional",
        level: "Nasional",
        date: "2024-12-10",
    },
];

export const Achievements: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<Achievement>>({
        studentName: "",
        competitionName: "",
        category: "Akademik",
        rank: "",
        eventName: "",
        level: "Sekolah",
        date: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Logic to save data would go here
        console.log("Saving data:", formData);
        setIsAddDialogOpen(false);
        // Reset form
        setFormData({
            studentName: "",
            competitionName: "",
            category: "Akademik",
            rank: "",
            eventName: "",
            level: "Sekolah",
            date: "",
        });
    };

    const getLevelBadgeColor = (level: AchievementLevel) => {
        switch (level) {
            case "Internasional": return "bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200";
            case "Nasional": return "bg-red-100 text-red-700 hover:bg-red-100 border-red-200";
            case "Provinsi": return "bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200";
            case "Kabupaten/Kota": return "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200";
            case "Kecamatan": return "bg-cyan-100 text-cyan-700 hover:bg-cyan-100 border-cyan-200";
            default: return "bg-slate-100 text-slate-700 hover:bg-slate-100 border-slate-200";
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
                    Data Prestasi Siswa
                </h1>
                <p className="text-muted-foreground mt-1">
                    Kelola data pencapaian dan prestasi siswa program Mutamayizin
                </p>
            </div>

            {/* Actions & Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari siswa atau lomba..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" />
                        Filter
                    </Button>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                                <Plus className="h-4 w-4" />
                                Tambah Prestasi
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Input Data Prestasi</DialogTitle>
                                <DialogDescription>
                                    Masukkan detail prestasi yang diraih oleh siswa.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 py-2">
                                {/* Nama Siswa */}
                                <div className="space-y-2">
                                    <Label htmlFor="studentName">Nama Siswa <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="studentName"
                                        name="studentName"
                                        placeholder="Cth: Ahmad Fulan"
                                        value={formData.studentName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Nama Lomba */}
                                    <div className="space-y-2">
                                        <Label htmlFor="competitionName">Nama Lomba <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="competitionName"
                                            name="competitionName"
                                            placeholder="Cth: Olimpiade Matematika"
                                            value={formData.competitionName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    {/* Kategori Lomba */}
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Kategori <span className="text-red-500">*</span></Label>
                                        <Select
                                            onValueChange={(val) => handleSelectChange("category", val)}
                                            defaultValue={formData.category}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Kategori" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Akademik">Akademik</SelectItem>
                                                <SelectItem value="Al-Qur'an">Al-Qur'an</SelectItem>
                                                <SelectItem value="Bahasa">Bahasa</SelectItem>
                                                <SelectItem value="Olahraga">Olahraga</SelectItem>
                                                <SelectItem value="Seni">Seni</SelectItem>
                                                <SelectItem value="Riset">Riset</SelectItem>
                                                <SelectItem value="Lainnya">Lainnya</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Juara Ke */}
                                    <div className="space-y-2">
                                        <Label htmlFor="rank">Juara Ke <span className="text-red-500">*</span></Label>
                                        <Select
                                            onValueChange={(val) => handleSelectChange("rank", val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Peringkat" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Juara 1">Juara 1</SelectItem>
                                                <SelectItem value="Juara 2">Juara 2</SelectItem>
                                                <SelectItem value="Juara 3">Juara 3</SelectItem>
                                                <SelectItem value="Harapan 1">Harapan 1</SelectItem>
                                                <SelectItem value="Harapan 2">Harapan 2</SelectItem>
                                                <SelectItem value="Harapan 3">Harapan 3</SelectItem>
                                                <SelectItem value="Finalis">Finalis</SelectItem>
                                                <SelectItem value="Partisipan">Partisipan</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Tingkat */}
                                    <div className="space-y-2">
                                        <Label htmlFor="level">Tingkat <span className="text-red-500">*</span></Label>
                                        <Select
                                            onValueChange={(val) => handleSelectChange("level", val)}
                                            defaultValue={formData.level}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Tingkat" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Sekolah">Sekolah</SelectItem>
                                                <SelectItem value="Kecamatan">Kecamatan</SelectItem>
                                                <SelectItem value="Kabupaten/Kota">Kabupaten/Kota</SelectItem>
                                                <SelectItem value="Provinsi">Provinsi</SelectItem>
                                                <SelectItem value="Nasional">Nasional</SelectItem>
                                                <SelectItem value="Internasional">Internasional</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Nama Event */}
                                <div className="space-y-2">
                                    <Label htmlFor="eventName">Nama Event/Penyelenggara <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="eventName"
                                        name="eventName"
                                        placeholder="Cth: Pekan Raya Pontianak"
                                        value={formData.eventName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                {/* Tanggal Kegiatan */}
                                <div className="space-y-2">
                                    <Label htmlFor="date">Tanggal Kegiatan/Lomba <span className="text-red-500">*</span></Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="date"
                                            id="date"
                                            name="date"
                                            className="pl-9 block w-full"
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Foto Dokumentasi */}
                                <div className="space-y-2">
                                    <Label>Foto Dokumentasi/Sertifikat</Label>
                                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer">
                                        <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                                            <Upload className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <p className="text-sm font-medium text-slate-700">Klik untuk upload foto</p>
                                        <p className="text-xs text-slate-500 mt-1">PNG, JPG, max 5MB</p>
                                    </div>
                                </div>

                                <DialogFooter className="pt-4">
                                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                        Batal
                                    </Button>
                                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                        Simpan Prestasi
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Content List */}
            <div className="grid grid-cols-1 gap-4">
                {mockAchievements.map((item) => (
                    <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardContent className="p-0">
                            <div className="flex flex-col sm:flex-row">
                                {/* Photo Placeholder Section */}
                                <div className="sm:w-48 bg-slate-100 flex items-center justify-center min-h-[160px] sm:min-h-full border-b sm:border-b-0 sm:border-r border-slate-200">
                                    <div className="text-center p-4">
                                        <ImageIcon className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                                        <span className="text-xs text-slate-500">No Image</span>
                                    </div>
                                </div>

                                {/* Details Section */}
                                <div className="flex-1 p-5">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant="outline" className={getLevelBadgeColor(item.level)}>
                                                    {item.level}
                                                </Badge>
                                                <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                                                    {item.category}
                                                </Badge>
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700">
                                                {item.competitionName}
                                            </h3>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>
                                                    <FileText className="mr-2 h-4 w-4" /> Detail
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Download className="mr-2 h-4 w-4" /> Unduh Sertifikat
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600">
                                                    <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm mt-3">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Trophy className="h-4 w-4 text-yellow-500" />
                                            <span className="font-semibold text-slate-900">{item.rank}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Calendar className="h-4 w-4 text-slate-400" />
                                            <span>{item.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Award className="h-4 w-4 text-blue-500" />
                                            <span>{item.eventName}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <MapPin className="h-4 w-4 text-slate-400" />
                                            <span>{item.level}</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                                                {item.studentName.charAt(0)}
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-slate-900">{item.studentName}</span>
                                                <span className="text-xs text-slate-500 ml-2">({item.studentClass})</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
