"use client";

import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { cn } from "@/lib/utils";

// Mock data
const mockAttendance = [
    { id: 1, name: "Ahmad Rizky", class: "X A", status: "Hadir", time: "07:05" },
    { id: 2, name: "Budi Santoso", class: "X A", status: "Sakit", time: "-" },
    { id: 3, name: "Citra Dewi", class: "X A", status: "Izin", time: "-" },
    { id: 4, name: "Dewi Putri", class: "X A", status: "Alpa", time: "-" },
    { id: 5, name: "Eko Prasetyo", class: "X A", status: "Hadir", time: "07:10" },
];

export default function PicketStudentAttendance() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [selectedClass, setSelectedClass] = useState<string>("all");

    return (
        <div className="space-y-6">

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>Filter Data</CardTitle>
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
                            <span className="text-sm font-medium">Kelas</span>
                            <Select value={selectedClass} onValueChange={setSelectedClass}>
                                <SelectTrigger className="w-full md:w-[200px]">
                                    <SelectValue placeholder="Pilih Kelas" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Kelas</SelectItem>
                                    <SelectItem value="X A">X A</SelectItem>
                                    <SelectItem value="X B">X B</SelectItem>
                                    <SelectItem value="XI A">XI A</SelectItem>
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

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">No</TableHead>
                                <TableHead>Nama Siswa</TableHead>
                                <TableHead>Kelas</TableHead>
                                <TableHead>Status Kehadiran</TableHead>
                                <TableHead>Jam Masuk</TableHead>
                                <TableHead>Keterangan</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockAttendance.map((student, index) => (
                                <TableRow key={student.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className="font-medium">{student.name}</TableCell>
                                    <TableCell>{student.class}</TableCell>
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
                                    <TableCell>{student.time}</TableCell>
                                    <TableCell>-</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
