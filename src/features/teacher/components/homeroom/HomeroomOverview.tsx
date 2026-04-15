import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Users,
    Calendar,
    TrendingUp,
    AlertCircle,
    UserCheck,
    FileText,
    Award,
    Megaphone,
    Clock,
    CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatCard } from "@/features/shared/components";

export const HomeroomOverview = () => {
    const attentionList = [
        { name: "Budi Santoso", issue: "Kehadiran rendah (75%)", status: "Warning" },
        { name: "Siti Aminah", issue: "Nilai Matematika dibawah KKM", status: "Danger" },
        { name: "Rudi Hartono", issue: "Belum mengumpulkan tugas", status: "Info" },
    ];

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard title="Total Siswa" value="32" subtitle="Siswa aktif di kelas XII A" icon={Users} color="blue" />
                <StatCard title="Kehadiran Hari Ini" value="94%" subtitle="30 Hadir, 1 Sakit, 1 Izin" icon={UserCheck} color="green" />
                <StatCard title="Rata-rata Nilai" value="82.5" subtitle="Semester Ganjil 2024/2025" icon={Award} color="purple" />
                <StatCard title="Perlu Perhatian" value="3" subtitle="Siswa dengan kehadiran < 80%" icon={AlertCircle} color="amber" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Attendance Chart & Quick Actions */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Attendance Chart Placeholder */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <TrendingUp className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-semibold">Statistik Kehadiran Mingguan</CardTitle>
                                        <CardDescription>
                                            Grafik kehadiran siswa selama satu minggu terakhir
                                        </CardDescription>
                                    </div>
                                </div>
                                <Badge variant="outline">Minggu Ini</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[250px] flex items-center justify-center bg-muted/20 rounded-lg border border-dashed">
                                <p className="text-muted-foreground text-sm">
                                    Chart Area (Akan diimplementasikan dengan Recharts)
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-emerald-100 rounded-lg">
                                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-semibold">Aksi Cepat Wali Kelas</CardTitle>
                                    <CardDescription>
                                        Pintasan untuk tugas administratif wali kelas
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Button
                                    variant="outline"
                                    className="h-24 flex-col space-y-2 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                                >
                                    <FileText className="h-6 w-6" />
                                    <span className="text-xs font-medium text-center">
                                        Input Catatan
                                    </span>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-24 flex-col space-y-2 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                                >
                                    <Megaphone className="h-6 w-6" />
                                    <span className="text-xs font-medium text-center">
                                        Buat Pengumuman
                                    </span>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-24 flex-col space-y-2 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                                >
                                    <Calendar className="h-6 w-6" />
                                    <span className="text-xs font-medium text-center">
                                        Lihat Jadwal
                                    </span>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-24 flex-col space-y-2 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                                >
                                    <Users className="h-6 w-6" />
                                    <span className="text-xs font-medium text-center">
                                        Data Orang Tua
                                    </span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Attention List & Notifications */}
                <div className="space-y-6">
                    {/* Students Needing Attention */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-orange-100 rounded-lg">
                                        <AlertCircle className="h-5 w-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-semibold">Perlu Perhatian</CardTitle>
                                        <CardDescription>
                                            Siswa yang membutuhkan perhatian khusus
                                        </CardDescription>
                                    </div>
                                </div>
                                <Badge variant="destructive" className="text-xs">
                                    {attentionList.length} Siswa
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {attentionList.map((student, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                                    >
                                        <Avatar className="h-9 w-9 border-2 border-background">
                                            <AvatarImage
                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`}
                                            />
                                            <AvatarFallback>{student.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {student.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {student.issue}
                                            </p>
                                        </div>
                                        {student.status === "Warning" && (
                                            <div className="h-2 w-2 rounded-full bg-orange-500 mt-1.5" />
                                        )}
                                        {student.status === "Danger" && (
                                            <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5" />
                                        )}
                                        {student.status === "Info" && (
                                            <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5" />
                                        )}
                                    </div>
                                ))}
                            </div>
                            <Button
                                variant="ghost"
                                className="w-full mt-4 text-xs text-muted-foreground"
                            >
                                Lihat Semua
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Upcoming Events/Deadlines */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Clock className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-semibold">Agenda Terdekat</CardTitle>
                                    <CardDescription>
                                        Jadwal dan agenda penting mendatang
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-purple-100 text-purple-700">
                                        <span className="text-xs font-bold">DES</span>
                                        <span className="text-lg font-bold">15</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Pembagian Raport</p>
                                        <p className="text-xs text-muted-foreground">
                                            08:00 - 12:00 WIB
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-blue-100 text-blue-700">
                                        <span className="text-xs font-bold">DES</span>
                                        <span className="text-lg font-bold">20</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Libur Semester</p>
                                        <p className="text-xs text-muted-foreground">
                                            Mulai 20 Desember
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
