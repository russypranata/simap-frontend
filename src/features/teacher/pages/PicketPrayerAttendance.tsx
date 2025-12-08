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
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, Check, X, Minus } from "lucide-react";
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
const mockPrayerAttendance = [
    { id: 1, name: "Ahmad Rizky", class: "X IPA 1", dzuhur: "Hadir", ashar: "Hadir" },
    { id: 2, name: "Budi Santoso", class: "X IPA 1", dzuhur: "Tidak Hadir", ashar: "Hadir" },
    { id: 3, name: "Citra Dewi", class: "X IPA 1", dzuhur: "Hadir", ashar: "Berhalangan" },
];

export default function PicketPrayerAttendance() {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
        <div className="space-y-6">

            <Card className="mb-6">
                <CardHeader className="pb-3">
                    <CardTitle>Filter Tanggal</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-[240px] justify-start text-left font-normal",
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
                </CardContent>
            </Card>

            <Tabs defaultValue="dzuhur" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="dzuhur">Sholat Dzuhur</TabsTrigger>
                    <TabsTrigger value="ashar">Sholat Ashar</TabsTrigger>
                </TabsList>
                <TabsContent value="dzuhur">
                    <Card>
                        <CardHeader>
                            <CardTitle>Kehadiran Sholat Dzuhur</CardTitle>
                            <CardDescription>
                                Data kehadiran siswa pada sholat Dzuhur hari ini.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama Siswa</TableHead>
                                        <TableHead>Kelas</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockPrayerAttendance.map((student) => (
                                        <TableRow key={student.id}>
                                            <TableCell className="font-medium">{student.name}</TableCell>
                                            <TableCell>{student.class}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        student.dzuhur === "Hadir"
                                                            ? "default"
                                                            : student.dzuhur === "Berhalangan"
                                                                ? "secondary"
                                                                : "destructive"
                                                    }
                                                    className={cn(
                                                        student.dzuhur === "Hadir" && "bg-green-600 hover:bg-green-700",
                                                    )}
                                                >
                                                    {student.dzuhur}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button size="icon" variant="outline" className="h-8 w-8 text-green-600">
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                                <Button size="icon" variant="outline" className="h-8 w-8 text-red-600">
                                                    <X className="h-4 w-4" />
                                                </Button>
                                                <Button size="icon" variant="outline" className="h-8 w-8 text-yellow-600">
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="ashar">
                    <Card>
                        <CardHeader>
                            <CardTitle>Kehadiran Sholat Ashar</CardTitle>
                            <CardDescription>
                                Data kehadiran siswa pada sholat Ashar hari ini.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama Siswa</TableHead>
                                        <TableHead>Kelas</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockPrayerAttendance.map((student) => (
                                        <TableRow key={student.id}>
                                            <TableCell className="font-medium">{student.name}</TableCell>
                                            <TableCell>{student.class}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        student.ashar === "Hadir"
                                                            ? "default"
                                                            : student.ashar === "Berhalangan"
                                                                ? "secondary"
                                                                : "destructive"
                                                    }
                                                    className={cn(
                                                        student.ashar === "Hadir" && "bg-green-600 hover:bg-green-700",
                                                    )}
                                                >
                                                    {student.ashar}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button size="icon" variant="outline" className="h-8 w-8 text-green-600">
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                                <Button size="icon" variant="outline" className="h-8 w-8 text-red-600">
                                                    <X className="h-4 w-4" />
                                                </Button>
                                                <Button size="icon" variant="outline" className="h-8 w-8 text-yellow-600">
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
