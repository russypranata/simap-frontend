"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    User,
    Phone,
    MapPin,
    Mail,
    Award,
    FileText,
    AlertCircle,
    Clock,
    CheckCircle2,
    BookOpen,
    Download,
    Eye,
    ArrowLeft,
    Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = React.use(params);

    // Mock data based on ID
    const student = {
        id: id,
        name: "Budi Santoso",
        nis: "2024101",
        gender: "L",
        status: "Hadir",
        grade: 85,
        attendance: 95,
        email: "budi.santoso@student.sch.id",
        phone: "0812-3456-7890",
        address: "Jl. Merpati No. 12, Jakarta Selatan",
        joinDate: "12 Juli 2022"
    };

    const initials = student.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.back()}
                            className="h-auto p-0 hover:bg-transparent hover:text-primary transition-colors text-muted-foreground"
                        >
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Kembali
                        </Button>
                    </div>
                    <h1 className="text-3xl font-bold text-foreground">Detail Siswa</h1>
                    <p className="text-muted-foreground">
                        Informasi lengkap data siswa dan akademik
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                    </Button>
                    <Button>
                        <FileText className="h-4 w-4 mr-2" />
                        Laporan Wali Kelas
                    </Button>
                </div>
            </div>

            {/* Student Profile Card (Matching Teacher ProfileCard style) */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle>Profil Siswa</CardTitle>
                        <Badge variant={student.status === "Hadir" ? "default" : "destructive"}>
                            Status: {student.status}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {/* Profile Picture and Basic Info */}
                        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                            <div className="relative group">
                                <Avatar className="h-32 w-32 border-4 border-primary/10">
                                    <AvatarImage src="" alt={student.name} />
                                    <AvatarFallback className="text-3xl font-semibold bg-primary text-primary-foreground">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                            </div>

                            <div className="flex-1 text-center md:text-left space-y-2">
                                <h2 className="text-2xl font-bold text-foreground">{student.name}</h2>
                                <div className="flex items-center justify-center md:justify-start gap-2">
                                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                                        {student.nis}
                                    </Badge>
                                    <Badge variant="outline">Kelas XII IPA 1</Badge>
                                    <Badge variant="outline">{student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground pt-1">
                                    Tahun Masuk: 2022 • Semester 5
                                </p>
                            </div>
                        </div>

                        {/* Contact Information Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                <div className="p-2 rounded-full bg-primary/10">
                                    <Mail className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground">Email Sekolah</p>
                                    <p className="text-sm font-medium truncate">{student.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                <div className="p-2 rounded-full bg-primary/10">
                                    <Phone className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground">Telepon Orang Tua</p>
                                    <p className="text-sm font-medium">{student.phone}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 md:col-span-2">
                                <div className="p-2 rounded-full bg-primary/10">
                                    <MapPin className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground">Alamat</p>
                                    <p className="text-sm font-medium">{student.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Detailed Info Tabs (Replacing Additional Info Card) */}
            <Card>
                <CardContent className="p-6">
                    <Tabs defaultValue="academic" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-auto">
                            <TabsTrigger value="academic">Akademik</TabsTrigger>
                            <TabsTrigger value="attendance">Presensi</TabsTrigger>
                            <TabsTrigger value="behavior">Perilaku</TabsTrigger>
                            <TabsTrigger value="documents">Dokumen</TabsTrigger>
                        </TabsList>

                        <TabsContent value="academic" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-center space-x-3 p-4 rounded-lg bg-blue-50 border border-blue-100">
                                    <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                                        <BookOpen className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-blue-600 font-medium">Rata-rata Nilai</p>
                                        <p className="text-2xl font-bold text-blue-700">{student.grade}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-4 rounded-lg bg-emerald-50 border border-emerald-100">
                                    <div className="p-2 rounded-full bg-emerald-100 text-emerald-600">
                                        <Award className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-emerald-600 font-medium">Prestasi</p>
                                        <p className="text-2xl font-bold text-emerald-700">2</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-4 rounded-lg bg-purple-50 border border-purple-100">
                                    <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                                        <CheckCircle2 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-purple-600 font-medium">Predikat</p>
                                        <p className="text-2xl font-bold text-purple-700">Baik</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border rounded-lg overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/50">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Mata Pelajaran</th>
                                            <th className="px-4 py-3 text-center font-medium text-muted-foreground">Nilai</th>
                                            <th className="px-4 py-3 text-center font-medium text-muted-foreground">Predikat</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        <tr>
                                            <td className="px-4 py-3">Matematika</td>
                                            <td className="px-4 py-3 text-center">85</td>
                                            <td className="px-4 py-3 text-center font-bold text-emerald-600">A</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3">Bahasa Indonesia</td>
                                            <td className="px-4 py-3 text-center">90</td>
                                            <td className="px-4 py-3 text-center font-bold text-emerald-600">A</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3">Fisika</td>
                                            <td className="px-4 py-3 text-center">78</td>
                                            <td className="px-4 py-3 text-center font-bold text-blue-600">B</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </TabsContent>

                        <TabsContent value="attendance" className="space-y-6">
                            <div className="flex items-center space-x-4 p-4 rounded-lg bg-muted/30 border">
                                <div className="p-3 rounded-full bg-primary/10">
                                    <Clock className="h-6 w-6 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="font-medium">Total Kehadiran</p>
                                        <span className="font-bold text-primary">{student.attendance}%</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div className="bg-primary h-2 rounded-full" style={{ width: `${student.attendance}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="behavior">
                            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg bg-muted/10">
                                <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-4" />
                                <h3 className="font-semibold text-lg">Tidak Ada Pelanggaran</h3>
                                <p className="text-muted-foreground text-sm">Siswa ini berkelakuan baik semester ini.</p>
                            </div>
                        </TabsContent>

                        <TabsContent value="documents">
                            <div className="space-y-4">
                                {[
                                    { name: "Kartu Keluarga", type: "PDF", size: "1.2 MB" },
                                    { name: "Akte Kelahiran", type: "PDF", size: "850 KB" },
                                    { name: "Ijazah SMP", type: "PDF", size: "2.4 MB" }
                                ].map((doc, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{doc.name}</p>
                                                <p className="text-xs text-muted-foreground">{doc.type} • {doc.size}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
