"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Award,
    Calendar,
    ArrowLeft,
    User,
    Trophy,
    MapPin,
    Star,
    Building2,
    Edit,
    GraduationCap,
    IdCard,
    ChevronRight,
    ChevronLeft,
    Maximize2,
    X,
    History,
} from "lucide-react";

// Mock data - in real app, fetch based on ID
// Unified Mock Data Source
const ALL_ACHIEVEMENTS_DATA = [
    {
        id: 1,
        studentName: "Ahmad Rizki",
        studentNIS: "2024001",
        studentClass: "X A",
        studentPhoto: null,
        competitionName: "Olimpiade Matematika",
        category: "Akademik",
        rank: "Juara 1",
        eventName: "OSN Tingkat Provinsi",
        organizer: "Dinas Pendidikan Provinsi Kalimantan Barat",
        level: "Provinsi",
        date: "2024-11-15",
        photos: [
            "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&q=80&w=1000", /* Trophy */
            "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=1000", /* Student Success */
            "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=1000", /* Conference/Event */
        ],
    },
    {
        id: 101,
        studentName: "Ahmad Rizki",
        studentNIS: "2024001",
        studentClass: "X A",
        studentPhoto: null,
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
        studentNIS: "2024001",
        studentClass: "X A",
        studentPhoto: null,
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
        studentNIS: "2024001",
        studentClass: "X A",
        studentPhoto: null,
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
        studentNIS: "2024001",
        studentClass: "X A",
        studentPhoto: null,
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
        studentNIS: "2024001",
        studentClass: "X A",
        studentPhoto: null,
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
        studentNIS: "2024001",
        studentClass: "X A",
        studentPhoto: null,
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
        studentNIS: "2024001",
        studentClass: "X A",
        studentPhoto: null,
        competitionName: "Science Fair Project",
        category: "Sains",
        rank: "Juara 2",
        eventName: "Expo Pendidikan",
        organizer: "Dinas Pendidikan Kota",
        level: "Kecamatan",
        date: "2023-01-15",
        photo: null,
    },
];

export const ViewAchievement: React.FC = () => {
    const router = useRouter();
    const params = useParams();

    // State for Carousel & Lightbox
    const [currentPhotoIndex, setCurrentPhotoIndex] = React.useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);

    // Simulate fetching data based on ID
    const achievementId = params?.id ? Number(params.id) : 1;
    const mockAchievementData = ALL_ACHIEVEMENTS_DATA.find((a) => a.id === achievementId) || ALL_ACHIEVEMENTS_DATA[0];

    // Normalize photos logic
    // @ts-ignore
    const photos = mockAchievementData.photos || (mockAchievementData.photo ? [mockAchievementData.photo] : []);
    const hasPhotos = photos.length > 0;

    const nextPhoto = (e?: any) => {
        e?.stopPropagation();
        if (hasPhotos) setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
    };

    const prevPhoto = (e?: any) => {
        e?.stopPropagation();
        if (hasPhotos) setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
    };

    // Keyboard navigation for Lightbox
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isLightboxOpen) return;
            if (e.key === "ArrowRight") nextPhoto();
            if (e.key === "ArrowLeft") prevPhoto();
            if (e.key === "Escape") setIsLightboxOpen(false);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isLightboxOpen, photos.length]);

    const otherAchievements = ALL_ACHIEVEMENTS_DATA.filter((a) => a.id !== mockAchievementData.id);

    const handleBack = () => {
        router.push("/mutamayizin-coordinator/achievements");
    };

    const handleEdit = () => {
        router.push(`/mutamayizin-coordinator/achievements/${mockAchievementData.id}/edit`);
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

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start space-x-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBack}
                    className="h-8 w-8 p-0 mt-1.5"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Detail </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Prestasi</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Award className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Informasi lengkap prestasi <span className="font-semibold text-foreground">{mockAchievementData.studentName}</span> pada Program Mutamayizin
                    </p>
                </div>
                <Button
                    onClick={handleEdit}
                    className="bg-blue-800 hover:bg-blue-900 text-white"
                >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Prestasi
                </Button>
            </div>

            {/* Details Card */}
            <Card className="overflow-hidden p-0">
                {/* Decorative Header */}
                <div className="bg-blue-800 p-5 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-40 h-40 border-[20px] border-white rounded-full -translate-y-1/2 translate-x-1/4" />
                        <div className="absolute bottom-0 right-1/3 w-20 h-20 border-[8px] border-white rounded-full translate-y-1/2" />
                    </div>

                    <div className="flex items-center gap-4 relative z-10">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                            <Trophy className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">{mockAchievementData.competitionName}</h2>
                            <p className="text-blue-100 text-sm">{mockAchievementData.category}</p>
                        </div>
                    </div>
                </div>

                <CardContent className="p-6 pt-2 space-y-6">
                    {/* Student Info Section */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                <User className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Informasi Siswa</h3>
                                <p className="text-sm text-muted-foreground">Data diri siswa peraih prestasi</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-xl">
                            {/* Avatar */}
                            <div className="w-14 h-14 rounded-full bg-blue-800 flex items-center justify-center flex-shrink-0 ring-4 ring-primary/10 overflow-hidden">
                                {mockAchievementData.studentPhoto ? (
                                    <img src={mockAchievementData.studentPhoto} alt={mockAchievementData.studentName} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <span className="text-lg font-semibold text-white">
                                        {getInitials(mockAchievementData.studentName)}
                                    </span>
                                )}
                            </div>
                            {/* Info */}
                            <div className="flex-1">
                                <p className="text-lg font-bold text-foreground">{mockAchievementData.studentName}</p>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                        <IdCard className="h-3.5 w-3.5" />
                                        <span>NIS: <span className="font-mono font-semibold text-foreground">{mockAchievementData.studentNIS}</span></span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                        <GraduationCap className="h-3.5 w-3.5" />
                                        <span>Kelas <span className="font-semibold text-foreground">{mockAchievementData.studentClass}</span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-dashed" />

                    {/* Achievement Details Section */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                <Trophy className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Detail Prestasi</h3>
                                <p className="text-sm text-muted-foreground">Rincian kompetisi dan capaian juara</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {/* Nama Lomba - Full Width for emphasis */}
                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 w-full">
                                <div className="p-2 rounded-full bg-primary/10 flex-shrink-0">
                                    <Trophy className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground">Nama Lomba / Kompetisi</p>
                                    <p className="text-sm font-semibold">{mockAchievementData.competitionName}</p>
                                </div>
                            </div>

                            {/* Horizontal Flow Layout (Flex Wrap) */}
                            <div className="flex flex-wrap gap-4">

                                {/* Peringkat */}
                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 flex-1 min-w-[240px]">
                                    <div className="p-2 rounded-full bg-primary/10 flex-shrink-0">
                                        <Star className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground mb-1">Peringkat</p>
                                        <Badge variant="outline" className={`${getRankBadgeColor(mockAchievementData.rank)} text-xs px-2 py-0.5 font-medium border-none`}>
                                            {mockAchievementData.rank}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Tingkat */}
                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 flex-1 min-w-[240px]">
                                    <div className="p-2 rounded-full bg-primary/10 flex-shrink-0">
                                        <MapPin className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground mb-1">Tingkat</p>
                                        <Badge variant="outline" className={`${getLevelBadgeColor()} text-xs px-2 py-0.5 font-medium border-none`}>
                                            {mockAchievementData.level}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Kategori */}
                                {mockAchievementData.category && (
                                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 flex-1 min-w-[240px]">
                                        <div className="p-2 rounded-full bg-primary/10 flex-shrink-0">
                                            <Award className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-muted-foreground">Kategori</p>
                                            <p className="text-sm font-semibold">{mockAchievementData.category}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Tanggal */}
                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 flex-1 min-w-[240px]">
                                    <div className="p-2 rounded-full bg-primary/10 flex-shrink-0">
                                        <Calendar className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Tanggal</p>
                                        <p className="text-sm font-semibold">
                                            {new Date(mockAchievementData.date).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric"
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {/* Penyelenggara */}
                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 flex-1 min-w-[240px]">
                                    <div className="p-2 rounded-full bg-primary/10 flex-shrink-0">
                                        <Building2 className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Penyelenggara</p>
                                        <p className="text-sm font-semibold">{mockAchievementData.organizer}</p>
                                    </div>
                                </div>

                                {/* Nama Event */}
                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 flex-1 min-w-[240px]">
                                    <div className="p-2 rounded-full bg-primary/10 flex-shrink-0">
                                        <Award className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Event</p>
                                        <p className="text-sm font-semibold">{mockAchievementData.eventName}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-dashed" />

                    {/* Documentation Photo Section */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                <IdCard className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Foto Dokumentasi</h3>
                                <p className="text-sm text-muted-foreground">Bukti sertifikat atau dokumentasi kegiatan</p>
                            </div>
                        </div>
                        {hasPhotos ? (
                            <div className="space-y-3">
                                {/* Main Carousel Container - Smaller Size */}
                                <div className="relative rounded-xl border bg-muted/30 overflow-hidden shadow-sm aspect-video max-w-md group">
                                    {/* Image */}
                                    <div
                                        className="w-full h-full cursor-pointer relative"
                                        onClick={() => setIsLightboxOpen(true)}
                                    >
                                        <img
                                            src={photos[currentPhotoIndex]}
                                            alt={`Dokumentasi ${currentPhotoIndex + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />

                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                            <div className="flex items-center gap-2 text-white bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                                <Maximize2 className="h-4 w-4" />
                                                <span className="text-sm font-medium">Buka Galeri</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Navigation Arrows (Only if multiple photos) */}
                                    {photos.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevPhoto}
                                                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0 cursor-pointer z-10"
                                            >
                                                <ChevronLeft className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={nextPhoto}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0 cursor-pointer z-10"
                                            >
                                                <ChevronRight className="h-5 w-5" />
                                            </button>
                                        </>
                                    )}

                                    {/* Counter Badge */}
                                    <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 text-white text-xs rounded-md backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                                        {currentPhotoIndex + 1} / {photos.length}
                                    </div>
                                </div>

                                {/* Dot Pagination */}
                                {photos.length > 1 && (
                                    <div className="flex justify-start gap-2 max-w-md px-1">
                                        {photos.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentPhotoIndex(idx)}
                                                className={`w-2 h-2 rounded-full transition-all ${currentPhotoIndex === idx
                                                    ? "bg-primary w-6"
                                                    : "bg-muted-foreground/30 hover:bg-primary/50"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="rounded-xl border bg-muted/30 aspect-video max-w-md flex flex-col items-center justify-center text-muted-foreground gap-2 p-4 text-center">
                                <div className="p-4 rounded-full bg-muted/50">
                                    <IdCard className="h-8 w-8 opacity-50" />
                                </div>
                                <p className="text-sm">Tidak ada dokumentasi</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Lightbox Modal */}
            {isLightboxOpen && hasPhotos && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-200">
                    {/* Close Button */}
                    <button
                        onClick={() => setIsLightboxOpen(false)}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
                    >
                        <X className="h-6 w-6" />
                    </button>

                    {/* Main Image */}
                    <div className="relative w-full max-w-5xl max-h-[85vh] px-4 flex items-center justify-center">
                        <img
                            src={photos[currentPhotoIndex]}
                            alt="Full Preview"
                            className="max-w-full max-h-[85vh] object-contain rounded-md shadow-2xl"
                        />
                    </div>

                    {/* Navigation Buttons (Lightbox) */}
                    {photos.length > 1 && (
                        <>
                            <button
                                onClick={prevPhoto}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
                            >
                                <ChevronLeft className="h-8 w-8" />
                            </button>
                            <button
                                onClick={nextPhoto}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
                            >
                                <ChevronRight className="h-8 w-8" />
                            </button>

                            {/* Bottom Dots (Lightbox) */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-50">
                                {photos.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentPhotoIndex(idx)}
                                        className={`w-2 h-2 rounded-full transition-all ${currentPhotoIndex === idx
                                            ? "bg-white w-6"
                                            : "bg-white/30 hover:bg-white/50"
                                            }`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Other Achievements Card */}
            <Card className="overflow-hidden p-0">
                {/* Decorative Header */}
                <div className="bg-blue-800 p-5 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-40 h-40 border-[20px] border-white rounded-full -translate-y-1/2 translate-x-1/4" />
                        <div className="absolute bottom-0 right-1/3 w-20 h-20 border-[8px] border-white rounded-full translate-y-1/2" />
                    </div>

                    <div className="flex items-center justify-between relative z-10 w-full">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                <History className="h-7 w-7 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Prestasi Lainnya</h2>
                                <p className="text-blue-100 text-sm">Riwayat pencapaian {mockAchievementData.studentName} lainnya</p>
                            </div>
                        </div>
                        <Badge className="bg-white/20 hover:bg-white/30 text-white border-none px-3 py-1.5 backdrop-blur-md hidden sm:flex items-center gap-2">
                            <Trophy className="h-4 w-4" />
                            <span className="font-semibold">{otherAchievements.length} Prestasi Lainnya</span>
                        </Badge>
                    </div>
                </div>

                <CardContent className="p-6 pt-2">

                    <div className="grid gap-3 max-h-[320px] overflow-y-auto pr-2">
                        {otherAchievements.map((achievement, index) => (
                            <div
                                key={achievement.id}
                                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border bg-card hover:bg-muted/50 hover:border-primary/20 transition-all cursor-pointer"
                                onClick={() => router.push(`/mutamayizin-coordinator/achievements/${achievement.id}`)}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-800 font-semibold text-sm mt-0.5 border border-blue-200">
                                        {index + 1}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                                {achievement.competitionName}
                                            </h4>
                                            <Badge variant="outline" className={`${getRankBadgeColor(achievement.rank)} text-xs px-2 py-0.5 font-medium`}>
                                                <Star className="h-3 w-3 mr-1" />
                                                {achievement.rank}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-3.5 w-3.5" />
                                                {achievement.level}
                                            </div>
                                            <div className="w-1 h-1 rounded-full bg-border" />
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {new Date(achievement.date).toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric"
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Button size="sm" variant="ghost" className="self-start sm:self-center bg-blue-100 hover:bg-blue-200 text-blue-800 hover:text-blue-900 border-blue-200">
                                    Detail
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
