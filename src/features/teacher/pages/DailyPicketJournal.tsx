"use client";

import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Plus, Search, Edit, History as HistoryIcon } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

// Mock data for journal entries
const mockJournals = [
    {
        id: 1,
        date: new Date(),
        activity: "Pengawasan Pagi",
        description: "Siswa datang tepat waktu, berpakaian rapi.",
        location: "Gerbang Depan",
        status: "Normal",
    },
    {
        id: 2,
        date: new Date(),
        activity: "Patroli Istirahat",
        description: "Ditemukan sampah berserakan di kantin.",
        location: "Kantin",
        status: "Perlu Tindakan",
    },
    {
        id: 3,
        date: new Date(new Date().setDate(new Date().getDate() - 1)),
        activity: "Pengawasan Sholat",
        description: "Pelaksanaan sholat Dzuhur berjalan khidmat.",
        location: "Masjid",
        status: "Normal",
    },
];

export default function DailyPicketJournal() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [journals, setJournals] = useState(mockJournals);
    const [newEntry, setNewEntry] = useState({
        activity: "",
        description: "",
        location: "",
        status: "Normal",
    });

    const handleAddEntry = () => {
        if (!date) return;

        const entry = {
            id: journals.length + 1,
            date: date,
            ...newEntry,
        };

        setJournals([entry, ...journals]);
        setNewEntry({
            activity: "",
            description: "",
            location: "",
            status: "Normal",
        });
    };

    return (
        <div className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Input Form Section */}
                <Card className="md:col-span-1 h-fit">
                    <CardHeader>
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Edit className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold">Catat Aktivitas</CardTitle>
                                <CardDescription>
                                    Isi formulir untuk menambahkan catatan piket baru.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Tanggal</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? (
                                            format(date, "PPP", { locale: id })
                                        ) : (
                                            <span>Pilih Tanggal</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label>Jenis Kegiatan</Label>
                            <Select
                                value={newEntry.activity}
                                onValueChange={(val) => setNewEntry({ ...newEntry, activity: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih kegiatan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Pengawasan Pagi">Pengawasan Pagi</SelectItem>
                                    <SelectItem value="Patroli Lingkungan">Patroli Lingkungan</SelectItem>
                                    <SelectItem value="Pengawasan Istirahat">Pengawasan Istirahat</SelectItem>
                                    <SelectItem value="Pengawasan Sholat">Pengawasan Sholat</SelectItem>
                                    <SelectItem value="Patroli Pulang">Patroli Pulang</SelectItem>
                                    <SelectItem value="Kejadian Khusus">Kejadian Khusus</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Lokasi</Label>
                            <Input
                                placeholder="Contoh: Gerbang, Kantin, Kelas..."
                                value={newEntry.location}
                                onChange={(e) => setNewEntry({ ...newEntry, location: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select
                                value={newEntry.status}
                                onValueChange={(val) => setNewEntry({ ...newEntry, status: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Normal">Normal</SelectItem>
                                    <SelectItem value="Perlu Tindakan">Perlu Tindakan</SelectItem>
                                    <SelectItem value="Darurat">Darurat</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Deskripsi / Catatan</Label>
                            <Textarea
                                placeholder="Ceritakan detail kegiatan atau kejadian..."
                                className="min-h-[100px]"
                                value={newEntry.description}
                                onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                            />
                        </div>

                        <Button className="w-full" onClick={handleAddEntry}>
                            <Plus className="mr-2 h-4 w-4" />
                            Simpan Jurnal
                        </Button>
                    </CardContent>
                </Card>

                {/* List Section */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <HistoryIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold">Riwayat Jurnal Piket</CardTitle>
                                <CardDescription>
                                    Daftar catatan aktivitas piket yang telah dimasukkan.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-2 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Cari catatan..." className="pl-9" />
                            </div>
                        </div>

                        <div className="rounded-md border overflow-hidden">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow className="hover:bg-transparent border-b">
                                        <TableHead className="w-[50px] p-4 text-center font-medium text-sm text-foreground">No</TableHead>
                                        <TableHead className="w-[120px] p-4 font-medium text-sm text-foreground">Waktu</TableHead>
                                        <TableHead className="w-[180px] p-4 font-medium text-sm text-foreground">Kegiatan</TableHead>
                                        <TableHead className="w-[150px] p-4 font-medium text-sm text-foreground">Lokasi</TableHead>
                                        <TableHead className="p-4 font-medium text-sm text-foreground">Catatan</TableHead>
                                        <TableHead className="w-[120px] p-4 font-medium text-sm text-foreground text-center">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {journals.map((journal, index) => (
                                        <TableRow key={journal.id} className="hover:bg-muted/50 transition-colors border-b">
                                            <TableCell className="p-4 text-center font-medium text-sm">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell className="p-4 font-medium whitespace-nowrap text-sm">
                                                {format(journal.date, "dd MMM yyyy", { locale: id })}
                                            </TableCell>
                                            <TableCell className="p-4 text-sm font-medium">{journal.activity}</TableCell>
                                            <TableCell className="p-4 text-sm text-muted-foreground">{journal.location}</TableCell>
                                            <TableCell className="p-4 text-sm text-muted-foreground max-w-[300px] truncate">
                                                {journal.description}
                                            </TableCell>
                                            <TableCell className="p-4 text-center">
                                                <Badge
                                                    variant={
                                                        journal.status === "Use Action" || journal.status === "Perlu Tindakan"
                                                            ? "destructive"
                                                            : journal.status === "Darurat"
                                                                ? "destructive"
                                                                : "secondary"
                                                    }
                                                    className="font-normal"
                                                >
                                                    {journal.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {journals.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <div className="p-3 bg-muted rounded-full">
                                                        <Search className="h-6 w-6 text-muted-foreground" />
                                                    </div>
                                                    <p className="font-medium">Belum ada data jurnal hari ini</p>
                                                    <p className="text-sm">Silakan tambahkan catatan aktivitas piket baru.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
