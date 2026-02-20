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
    Calendar,
    Megaphone,
    Search,
    Filter,
    Clock,
    User,
    FileText,
    AlertCircle,
    Bell,
    ChevronRight,
    ChevronLeft,
    Eye,
    Paperclip,
    Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface Announcement {
    id: number;
    title: string;
    content: string;
    category: "academic" | "event" | "schedule" | "general" | "achievement";
    date: string;
    author: string;
    isRead: boolean;
    isPinned: boolean;
    attachments?: string[];
}

const ITEMS_PER_PAGE = 5;

// Mock data (same as student for now, or tailored)
const initialAnnouncements: Announcement[] = [
    {
        id: 1,
        title: "Undangan Rapat Orang Tua Wali Murid",
        content: "Mengundang Bapak/Ibu Wali Murid untuk menghadiri rapat pertemuan awal semester genap yang akan dilaksanakan pada hari Sabtu, 25 Januari 2026 pukul 09.00 WIB di Aula Sekolah.",
        category: "general",
        date: "2026-01-10",
        author: "Humas Sekolah",
        isRead: false,
        isPinned: true,
        attachments: ["Undangan_Rapat.pdf"],
    },
    {
        id: 2,
        title: "Konfirmasi Pembayaran SPP Januari 2026",
        content: "Diberitahukan kepada wali murid untuk segera melakukan pembayaran SPP bulan Januari 2026 paling lambat tanggal 10. Pembayaran dapat dilakukan melalui transfer bank atau loket TU.",
        category: "general",
        date: "2026-01-05",
        author: "Tata Usaha / Keuangan",
        isRead: false,
        isPinned: true,
    },
     {
        id: 3,
        title: "Jadwal Ujian Akhir Semester Ganjil 2025/2026",
        content: "Diberitahukan kepada seluruh siswa dan wali murid bahwa Ujian Akhir Semester (UAS) Ganjil akan dilaksanakan pada tanggal 13-20 Januari 2026. Mohon bimbingan belajar putra/putrinya di rumah.",
        category: "academic",
        date: "2026-01-10",
        author: "Kurikulum",
        isRead: true,
        isPinned: false,
        attachments: ["Jadwal_UAS_Ganjil_2025-2026.pdf"],
    },
];

// Category config
const getCategoryConfig = (category: Announcement["category"]) => {
    const configs = {
        academic: { label: "Akademik", color: "bg-sky-100 text-sky-700 border-sky-200", icon: FileText },
        event: { label: "Kegiatan", color: "bg-purple-100 text-purple-700 border-purple-200", icon: Calendar },
        schedule: { label: "Jadwal", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock },
        achievement: { label: "Prestasi", color: "bg-orange-100 text-orange-700 border-orange-200", icon: Trophy },
        general: { label: "Umum", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: Megaphone },
    };
    return configs[category];
};

export const ParentAnnouncements: React.FC = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Filter announcements
    const filteredAnnouncements = useMemo(() => {
        return announcements.filter((announcement) => {
            const matchesSearch =
                announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                announcement.content.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = categoryFilter === "all" || announcement.category === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [announcements, searchQuery, categoryFilter]);

    // Sort: pinned first, then by date
    const sortedAnnouncements = useMemo(() => {
        return [...filteredAnnouncements].sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
    }, [filteredAnnouncements]);

    // Pagination logic
    const totalPages = Math.ceil(sortedAnnouncements.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedAnnouncements = sortedAnnouncements.slice(startIndex, endIndex);

    const unreadCount = announcements.filter(a => !a.isRead).length;

    const handleViewDetail = (announcement: Announcement) => {
        if (!announcement.isRead) {
            setAnnouncements(prev => prev.map(a =>
                a.id === announcement.id ? { ...a, isRead: true } : a
            ));
        }

        setSelectedAnnouncement(announcement);
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Pengumuman </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Sekolah</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Megaphone className="h-5 w-5" />
                        </div>
                        {unreadCount > 0 && (
                            <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                                {unreadCount} baru
                            </Badge>
                        )}
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Informasi dan pengumuman terbaru untuk Orang Tua / Wali Murid
                    </p>
                </div>
            </div>

            {/* Search & Filter */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Cari pengumuman..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-[180px]">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Kategori</SelectItem>
                                <SelectItem value="academic">Akademik</SelectItem>
                                <SelectItem value="schedule">Jadwal</SelectItem>
                                <SelectItem value="event">Kegiatan</SelectItem>
                                <SelectItem value="achievement">Prestasi</SelectItem>
                                <SelectItem value="general">Umum</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Announcements List */}
            <div className="space-y-4">
                {paginatedAnnouncements.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                <Search className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold">Tidak Ada Pengumuman</h3>
                            <p className="text-muted-foreground mt-1">
                                {searchQuery
                                    ? `Tidak ada pengumuman yang cocok dengan "${searchQuery}"`
                                    : "Tidak ada pengumuman untuk ditampilkan"
                                }
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {paginatedAnnouncements.map((announcement) => {
                            const categoryConfig = getCategoryConfig(announcement.category);
                            const CategoryIcon = categoryConfig.icon;

                            return (
                                <Card
                                    key={announcement.id}
                                    className={cn(
                                        "cursor-pointer transition-all hover:bg-muted/50",
                                        announcement.isPinned && "ring-2 ring-red-200 bg-red-50/30",
                                        !announcement.isRead && "bg-blue-50/50"
                                    )}
                                    onClick={() => handleViewDetail(announcement)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-4">
                                            <div className={cn(
                                                "p-2.5 rounded-lg flex-shrink-0",
                                                announcement.isPinned ? "bg-red-100" : "bg-primary/10"
                                            )}>
                                                {announcement.isPinned ? (
                                                    <Bell className="h-5 w-5 text-red-600" />
                                                ) : (
                                                    <CategoryIcon className="h-5 w-5 text-primary" />
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            {announcement.isPinned && (
                                                                <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">
                                                                    Disematkan
                                                                </Badge>
                                                            )}
                                                            <Badge variant="outline" className={cn("text-xs", categoryConfig.color)}>
                                                                {categoryConfig.label}
                                                            </Badge>
                                                            {!announcement.isRead && (
                                                                <span className="w-2 h-2 bg-blue-500 rounded-full" />
                                                            )}
                                                        </div>
                                                        <h3 className="font-semibold text-foreground line-clamp-1">
                                                            {announcement.title}
                                                        </h3>
                                                    </div>
                                                    <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                                </div>

                                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                                    {announcement.content}
                                                </p>

                                                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        {new Date(announcement.date).toLocaleDateString("id-ID", {
                                                            day: "numeric",
                                                            month: "long",
                                                            year: "numeric"
                                                        })}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <User className="h-3.5 w-3.5" />
                                                        {announcement.author}
                                                    </span>
                                                    {announcement.attachments && announcement.attachments.length > 0 && (
                                                        <span className="flex items-center gap-1">
                                                            <Paperclip className="h-3.5 w-3.5" />
                                                            {announcement.attachments.length} lampiran
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}

                         {/* Pagination Controls */}
                         {totalPages > 1 && (
                            <div className="flex items-center justify-between pt-4">
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <span>Menampilkan</span>
                                    <span className="font-medium text-foreground">
                                        {startIndex + 1}
                                    </span>
                                    <span>-</span>
                                    <span className="font-medium text-foreground">
                                        {Math.min(endIndex, sortedAnnouncements.length)}
                                    </span>
                                    <span>dari</span>
                                    <span className="font-medium text-foreground">
                                        {sortedAnnouncements.length}
                                    </span>
                                    <span>pengumuman</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground mr-2">
                                        Hal {currentPage}/{totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <div className="flex items-center space-x-1">
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let pageNumber;
                                            if (totalPages <= 5) {
                                                pageNumber = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNumber = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNumber = totalPages - 4 + i;
                                            } else {
                                                pageNumber = currentPage - 2 + i;
                                            }

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
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Detail Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                    {selectedAnnouncement && (
                        <>
                            <DialogHeader className="pb-4 mb-4 border-b">
                                <div className="flex items-center gap-2 mb-2">
                                    {selectedAnnouncement.isPinned && (
                                        <Badge className="bg-red-100 text-red-700 border-red-200">
                                            Disematkan
                                        </Badge>
                                    )}
                                    <Badge variant="outline" className={getCategoryConfig(selectedAnnouncement.category).color}>
                                        {getCategoryConfig(selectedAnnouncement.category).label}
                                    </Badge>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Perihal</span>
                                    <DialogTitle className="text-xl font-bold leading-tight">
                                        {selectedAnnouncement.title}
                                    </DialogTitle>
                                </div>

                                <DialogDescription asChild>
                                    <div className="flex items-center gap-6 text-sm mt-1">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            <span>
                                                {new Date(selectedAnnouncement.date).toLocaleDateString("id-ID", {
                                                    weekday: "long",
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric"
                                                })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <User className="h-4 w-4" />
                                            <span>{selectedAnnouncement.author}</span>
                                        </div>
                                    </div>
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        Isi Pengumuman
                                    </h4>
                                    <div className="p-4 bg-muted/30 rounded-lg border">
                                        <div className="prose prose-sm max-w-none text-muted-foreground text-sm leading-relaxed">
                                            {selectedAnnouncement.content.split('\n').map((paragraph, index) => (
                                                <p key={index} className="mb-2 last:mb-0">{paragraph}</p>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {selectedAnnouncement.attachments && selectedAnnouncement.attachments.length > 0 && (
                                    <div className="pt-2">
                                        <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                                            <Paperclip className="h-4 w-4 text-muted-foreground" />
                                            Lampiran ({selectedAnnouncement.attachments.length})
                                        </h4>
                                        <div className="grid grid-cols-1 gap-2">
                                            {selectedAnnouncement.attachments.map((file, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer group"
                                                >
                                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-md group-hover:bg-blue-100 transition-colors">
                                                        <FileText className="h-4 w-4" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-foreground truncate">{file}</p>
                                                        <p className="text-xs text-muted-foreground">Klik untuk mengunduh</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};
