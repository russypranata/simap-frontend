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
import { Calendar as CalendarIcon, Filter, Search } from "lucide-react";
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
                <CardHeader className="pb-3">
                    <CardTitle>Filter Kegiatan</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 items-end md:items-center">
                        <div className="grid gap-2 flex-1">
                            <span className="text-sm font-medium">Tanggal</span>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full md:w-[240px] justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
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
                            <Select value={selectedExtra} onValueChange={setSelectedExtra}>
                                <SelectTrigger className="w-full md:w-[200px]">
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

                        <div className="grid gap-2 flex-1">
                            <span className="text-sm font-medium">Cari Siswa</span>
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Nama siswa..." className="pl-8 w-full md:w-[250px]" />
                            </div>
                        </div>

                        <Button variant="secondary">
                            <Filter className="mr-2 h-4 w-4" />
                            Terapkan
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Hadir Ekstrakurikuler</CardTitle>
                        <CardDescription>
                            Menampilkan data kehadiran siswa di berbagai kegiatan ekstrakurikuler.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama Siswa</TableHead>
                                    <TableHead>Ekstrakurikuler</TableHead>
                                    <TableHead>Waktu Hadir</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockExtraAttendance.map((student) => (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-medium">{student.name}</TableCell>
                                        <TableCell>{student.extra}</TableCell>
                                        <TableCell>{student.time}</TableCell>
                                        <TableCell>
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
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
