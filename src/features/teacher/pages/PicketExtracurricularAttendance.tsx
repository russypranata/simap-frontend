"use client";

import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Calendar as CalendarIcon, Filter, Search, Activity, Trophy } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Mock data
const mockExtraAttendance = [
    { id: 1, name: "Ahmad Rizky", extra: "Pramuka", status: "Hadir", time: "16:00" },
    { id: 2, name: "Budi Santoso", extra: "Futsal", status: "Hadir", time: "16:05" },
    { id: 3, name: "Citra Dewi", extra: "PMR", status: "Izin", time: "-" },
    { id: 4, name: "Dewi Putri", extra: "Tari", status: "Sakit", time: "-" },
];

export default function PicketExtracurricularAttendance() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [selectedExtra, setSelectedExtra] = useState<string>("all");

    return (
        <div className="space-y-6">

            <Card>
                <CardHeader>
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Filter className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold">Filter Kegiatan</CardTitle>
                            <CardDescription>
                                Filter daftar siswa berdasarkan kegiatan ekstrakurikuler
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 items-end md:items-center">
                        <div className="grid gap-2 flex-1 relative">
                            <span className="text-sm font-medium">Tanggal</span>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal pl-3",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                                        {date ? format(date, "PPP", { locale: id }) : <span>Pilih Tanggal</span>}
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

                        <div className="grid gap-2 flex-1">
                            <span className="text-sm font-medium">Ekstrakurikuler</span>
                            <div className="relative">
                                <Activity className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                                <Select value={selectedExtra} onValueChange={setSelectedExtra}>
                                    <SelectTrigger className="w-full pl-9">
                                        <SelectValue placeholder="Pilih Ekstra" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Ekstra</SelectItem>
                                        <SelectItem value="Pramuka">Pramuka</SelectItem>
                                        <SelectItem value="Futsal">Futsal</SelectItem>
                                        <SelectItem value="PMR">PMR</SelectItem>
                                        <SelectItem value="Tari">Tari</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid gap-2 flex-1">
                            <span className="text-sm font-medium">Cari Siswa</span>
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Nama siswa..." className="pl-9 w-full" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Trophy className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold">Daftar Hadir Ekstrakurikuler</CardTitle>
                                <CardDescription>
                                    Menampilkan data kehadiran siswa di berbagai kegiatan ekstrakurikuler.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border overflow-hidden">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow className="hover:bg-transparent border-b">
                                        <TableHead className="w-[50px] p-4 text-center font-medium text-sm text-foreground">No</TableHead>
                                        <TableHead className="w-[200px] p-4 font-medium text-sm text-foreground">Nama Siswa</TableHead>
                                        <TableHead className="w-[150px] p-4 font-medium text-sm text-foreground">Ekstrakurikuler</TableHead>
                                        <TableHead className="p-4 font-medium text-sm text-foreground">Waktu Hadir</TableHead>
                                        <TableHead className="w-[120px] p-4 font-medium text-sm text-foreground text-center">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockExtraAttendance.map((student, index) => (
                                        <TableRow key={student.id} className="hover:bg-muted/50 transition-colors border-b">
                                            <TableCell className="p-4 text-center text-sm font-medium">{index + 1}</TableCell>
                                            <TableCell className="font-medium p-4">{student.name}</TableCell>
                                            <TableCell className="p-4 text-muted-foreground">{student.extra}</TableCell>
                                            <TableCell className="p-4 text-sm font-medium text-muted-foreground">{student.time}</TableCell>
                                            <TableCell className="p-4 text-center">
                                                <Badge
                                                    variant={
                                                        student.status === "Hadir"
                                                            ? "default"
                                                            : student.status === "Sakit"
                                                                ? "secondary"
                                                                : student.status === "Izin"
                                                                    ? "outline"
                                                                    : "destructive"
                                                    }
                                                    className={cn(
                                                        "font-normal",
                                                        student.status === "Hadir" && "bg-green-600 hover:bg-green-700",
                                                        student.status === "Sakit" && "bg-yellow-500 hover:bg-yellow-600 text-white",
                                                        student.status === "Izin" && "bg-blue-500 hover:bg-blue-600 text-white",
                                                    )}
                                                >
                                                    {student.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {mockExtraAttendance.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <div className="p-3 bg-muted rounded-full">
                                                        <Search className="h-6 w-6 text-muted-foreground" />
                                                    </div>
                                                    <p className="font-medium">Data siswa tidak ditemukan</p>
                                                    <p className="text-sm">Coba ubah filter atau kata kunci pencarian Anda.</p>
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
