"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    User,
    FileText,
    AlertCircle,
    Bell,
    ChevronRight,
    Paperclip,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface Announcement {
    id: number;
    title: string;
    content: string;
    category: "academic" | "event" | "schedule" | "important" | "general";
    date: string;
    author: string;
    isRead: boolean;
    isPinned: boolean;
    attachments?: string[];
}

// Mock data
const mockAnnouncements: Announcement[] = [
    {
        id: 1,
        title: "Jadwal Ujian Akhir Semester Ganjil 2025/2026",
        content: "Diberitahukan kepada Bapak/Ibu Wali Murid bahwa Ujian Akhir Semester (UAS) Ganjil akan dilaksanakan pada tanggal 13-20 Januari 2026. Mohon membantu putra/putri Anda untuk mempersiapkan diri dengan baik.",
        category: "important",
        date: "2026-01-10",
        author: "Wakil Kepala Sekolah Bidang Kurikulum",
        isRead: false,
        isPinned: true,
        attachments: ["Jadwal_UAS_Ganjil.pdf"],
    },
    {
        id: 2,
        title: "Undangan Rapat Wali Murid",
        content: "Bapak/Ibu Wali Murid diundang untuk menghadiri rapat wali murid pada tanggal 25 Januari 2026 pukul 09:00 WIB di Aula Sekolah. Agenda: Pembagian Rapor dan Konsultasi Wali Kelas.",
        category: "event",
        date: "2026-01-09",
        author: "Kepala Sekolah",
        isRead: false,
        isPinned: true,
    },
    {
        id: 3,
        title: "Libur Semester Ganjil 2025/2026",
        content: "Diberitahukan bahwa libur semester ganjil akan berlangsung dari tanggal 21 Januari - 3 Februari 2026.",
        category: "schedule",
        date: "2026-01-08",
        author: "Tata Usaha",
        isRead: true,
        isPinned: false,
    },
    {
        id: 4,
        title: "Informasi Pembayaran SPP Januari 2026",
        content: "Mohon melakukan pembayaran SPP bulan Januari paling lambat tanggal 15 Januari 2026. Pembayaran dapat dilakukan melalui bank atau langsung ke bagian keuangan sekolah.",
        category: "general",
        date: "2026-01-05",
        author: "Bagian Keuangan",
        isRead: true,
        isPinned: false,
    },
];

const getCategoryConfig = (category: Announcement["category"]) => {
    const configs = {
        academic: { label: "Akademik", color: "bg-blue-100 text-blue-700 border-blue-200", icon: FileText },
        event: { label: "Kegiatan", color: "bg-purple-100 text-purple-700 border-purple-200", icon: Calendar },
        schedule: { label: "Jadwal", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Calendar },
        important: { label: "Penting", color: "bg-red-100 text-red-700 border-red-200", icon: AlertCircle },
        general: { label: "Umum", color: "bg-green-100 text-green-700 border-green-200", icon: Megaphone },
    };
    return configs[category];
};

export const ParentAnnouncements: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const filteredAnnouncements = useMemo(() => {
        return mockAnnouncements.filter((announcement) => {
            const matchesSearch = announcement.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = categoryFilter === "all" || announcement.category === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, categoryFilter]);

    const sortedAnnouncements = useMemo(() => {
        return [...filteredAnnouncements].sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
    }, [filteredAnnouncements]);

    const unreadCount = mockAnnouncements.filter(a => !a.isRead).length;

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
                            <Badge className="bg-red-500 text-white">{unreadCount} baru</Badge>
                        )}
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Informasi dan pengumuman dari sekolah untuk wali murid
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
                                <SelectItem value="important">Penting</SelectItem>
                                <SelectItem value="event">Kegiatan</SelectItem>
                                <SelectItem value="schedule">Jadwal</SelectItem>
                                <SelectItem value="general">Umum</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Announcements List */}
            <div className="space-y-4">
                {sortedAnnouncements.map((announcement) => {
                    const categoryConfig = getCategoryConfig(announcement.category);

                    return (
                        <Card
                            key={announcement.id}
                            className={cn(
                                "cursor-pointer transition-all",
                                announcement.isPinned && "ring-2 ring-red-200 bg-red-50/30",
                                !announcement.isRead && "bg-blue-50/50"
                            )}
                            onClick={() => {
                                setSelectedAnnouncement(announcement);
                                setIsDialogOpen(true);
                            }}
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
                                            <categoryConfig.icon className="h-5 w-5 text-primary" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            {announcement.isPinned && (
                                                <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">Penting</Badge>
                                            )}
                                            <Badge variant="outline" className={cn("text-xs", categoryConfig.color)}>
                                                {categoryConfig.label}
                                            </Badge>
                                            {!announcement.isRead && (
                                                <span className="w-2 h-2 bg-blue-500 rounded-full" />
                                            )}
                                        </div>
                                        <h3 className="font-semibold line-clamp-1">{announcement.title}</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{announcement.content}</p>
                                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {new Date(announcement.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <User className="h-3.5 w-3.5" />
                                                {announcement.author}
                                            </span>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Detail Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    {selectedAnnouncement && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline" className={getCategoryConfig(selectedAnnouncement.category).color}>
                                        {getCategoryConfig(selectedAnnouncement.category).label}
                                    </Badge>
                                </div>
                                <DialogTitle>{selectedAnnouncement.title}</DialogTitle>
                                <DialogDescription asChild>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            {new Date(selectedAnnouncement.date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <User className="h-4 w-4" />
                                            {selectedAnnouncement.author}
                                        </span>
                                    </div>
                                </DialogDescription>
                            </DialogHeader>

                            <div className="mt-4">
                                <p className="text-sm leading-relaxed">{selectedAnnouncement.content}</p>

                                {selectedAnnouncement.attachments && selectedAnnouncement.attachments.length > 0 && (
                                    <div className="mt-6 pt-4 border-t">
                                        <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                                            <Paperclip className="h-4 w-4" />
                                            Lampiran
                                        </h4>
                                        <div className="space-y-2">
                                            {selectedAnnouncement.attachments.map((file, index) => (
                                                <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer">
                                                    <FileText className="h-4 w-4 text-blue-600" />
                                                    <span className="text-sm">{file}</span>
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
