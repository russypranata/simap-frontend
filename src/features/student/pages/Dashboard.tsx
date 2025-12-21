"use client";

import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
    Calendar,
    BookOpen,
    Clock,
    TrendingUp,
    AlertCircle,
    Award,
    CheckCircle,
    Bell,
    ArrowUp,
    FileText,
    MoreHorizontal,
    GraduationCap,
    Book,
    MapPin,
    User
} from "lucide-react";
import { formatDate } from "@/features/shared/utils/dateFormatter"; // Assuming this utility exists based on TeacherDashboard

// ----------------------------------------------------------------------
// Interfaces
// ----------------------------------------------------------------------

interface StatCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
    trend?: {
        value: number;
        isUp: boolean;
    };
}

// ----------------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------------

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    description,
    icon: Icon,
    color,
    bgColor,
    trend,
}) => {
    return (
        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-none shadow-sm bg-white">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
                    </div>
                    <div className={`p-3 rounded-xl ${bgColor}`}>
                        <Icon className={`h-5 w-5 ${color}`} />
                    </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                    {trend ? (
                        <div className={`flex items-center text-xs font-medium ${trend.isUp ? "text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full" : "text-red-600 bg-red-50 px-2 py-1 rounded-full"}`}>
                            <TrendingUp className={`h-3 w-3 mr-1 ${!trend.isUp && "rotate-180"}`} />
                            {trend.value}% dari bulan lalu
                        </div>
                    ) : (
                        <div className="text-xs text-slate-400">Update terbaru</div>
                    )}
                </div>
                <p className="text-xs text-slate-400 mt-2">{description}</p>
            </CardContent>
        </Card>
    );
};

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export const StudentDashboard: React.FC = () => {

    // --- Mock Data ---

    const studentInfo = {
        name: "Ahmad Rizky",
        class: "XII A",
        nis: "2023001",
        semester: "Ganjil 2025/2026"
    };

    const stats = [
        {
            title: "Kehadiran",
            value: "95%",
            description: "Sangat Baik",
            icon: CheckCircle,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
            trend: { value: 2, isUp: true }
        },
        {
            title: "Poin Pelanggaran",
            value: "0",
            description: "Bersih",
            icon: AlertCircle,
            color: "text-blue-600",
            bgColor: "bg-blue-50", // Changed from red to blue/green if 0
        },
        {
            title: "Tugas Pending",
            value: "3",
            description: "Perlu dikerjakan",
            icon: FileText,
            color: "text-amber-600",
            bgColor: "bg-amber-50",
        },
        {
            title: "Rata-rata Nilai",
            value: "88.5",
            description: "Predikat A",
            icon: Award,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            trend: { value: 1.5, isUp: true }
        }
    ];

    const todaySchedule = [
        { time: "07:00 - 08:30", subject: "Matematika Wajib", teacher: "Pak Budi", room: "XII-A", status: "finished" },
        { time: "08:30 - 10:00", subject: "Bahasa Inggris", teacher: "Ms. Sarah", room: "Lab Bahasa", status: "ongoing" },
        { time: "10:15 - 11:45", subject: "Fisika", teacher: "Bu Rini", room: "Lab Fisika", status: "upcoming" },
        { time: "13:00 - 14:30", subject: "Olahraga", teacher: "Pak Joko", room: "Lapangan", status: "upcoming" },
    ];

    const assignments = [
        { id: 1, subject: "Matematika", title: "Latihan Soal Integral", deadline: "Besok, 23:59", priority: "high" },
        { id: 2, subject: "Biologi", title: "Laporan Praktikum", deadline: "3 hari lagi", priority: "medium" },
        { id: 3, subject: "Sejarah", title: "Makalah Revolusi", deadline: "Minggu depan", priority: "low" },
    ];

    const announcements = [
        { id: 1, title: "Persiapan Ujian Tengah Semester", date: "20 Des 2025", category: "Akademik" },
        { id: 2, title: "Jadwal Libur Awal Ramadhan", date: "18 Des 2025", category: "Umum" },
    ];

    return (
        <div className="space-y-8 pb-8">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                        Halo, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">{studentInfo.name}</span> 👋
                    </h1>
                    <p className="text-slate-500 mt-1 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        {studentInfo.class} • NIS: {studentInfo.nis}
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                    <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {studentInfo.semester}
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <StatCard key={idx} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Content (2/3) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Today's Schedule */}
                    <Card className="border-none shadow-sm bg-white overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Clock className="w-5 h-5 text-blue-600" />
                                    Jadwal Hari Ini
                                </CardTitle>
                                <Badge variant="outline" className="bg-white">
                                    {formatDate(new Date(), "dd MMMM yyyy")}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100">
                                {todaySchedule.map((item, idx) => (
                                    <div key={idx} className={`p-4 hover:bg-slate-50 transition-colors flex items-center justify-between ${item.status === 'ongoing' ? 'bg-blue-50/50' : ''}`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-xl ${item.status === 'ongoing' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                                                <Book className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className={`font-bold ${item.status === 'ongoing' ? 'text-blue-900' : 'text-slate-800'}`}>{item.subject}</h4>
                                                <p className="text-sm text-slate-500 flex items-center gap-2 mt-0.5">
                                                    <User className="w-3 h-3" /> {item.teacher}
                                                    <span className="text-slate-300">•</span>
                                                    <MapPin className="w-3 h-3" /> {item.room}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-mono text-sm font-semibold text-slate-700">{item.time}</p>
                                            <Badge
                                                className={`mt-1 ${item.status === 'finished' ? 'bg-slate-100 text-slate-500 hover:bg-slate-100' :
                                                    item.status === 'ongoing' ? 'bg-blue-500 hover:bg-blue-600' :
                                                        'bg-amber-100 text-amber-700 hover:bg-amber-100'
                                                    }`}
                                            >
                                                {item.status === 'finished' ? 'Selesai' : item.status === 'ongoing' ? 'Sedang Berlangsung' : 'Akan Datang'}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Assignments */}
                    <Card className="border-none shadow-sm bg-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <FileText className="w-5 h-5 text-amber-500" />
                                Tugas & PR
                            </CardTitle>
                            <CardDescription>
                                Jangan lupa kerjakan tugasmu tepat waktu!
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {assignments.map((task) => (
                                    <div key={task.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-amber-200 hover:bg-amber-50/30 transition-all group">
                                        <div className="flex items-start gap-4">
                                            <div className="mt-1">
                                                <div className={`w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-slate-800 group-hover:text-amber-700 transition-colors">{task.title}</h4>
                                                <p className="text-sm text-slate-500">{task.subject}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-xs font-semibold ${task.priority === 'high' ? 'text-red-500' : 'text-slate-500'}`}>
                                                {task.deadline}
                                            </p>
                                            <Button size="sm" variant="ghost" className="h-8 mt-1 text-slate-400 hover:text-amber-600">
                                                Detail <MoreHorizontal className="w-3 h-3 ml-1" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* Right Content (Sidebar) */}
                <div className="space-y-6">

                    {/* Announcements Widget */}
                    <Card className="border-none shadow-sm bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg flex items-center gap-2 text-white">
                                    <Bell className="w-5 h-5" /> Info Sekolah
                                </CardTitle>
                                <Badge className="bg-white/20 hover:bg-white/30 text-white border-none">Baru</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {announcements.map((info) => (
                                <div key={info.id} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                                    <div className="flex justify-between items-start mb-1">
                                        <Badge className="bg-indigo-500/50 hover:bg-indigo-500 text-[10px] h-5">{info.category}</Badge>
                                        <span className="text-xs text-indigo-100">{info.date}</span>
                                    </div>
                                    <h4 className="font-semibold text-sm leading-snug">{info.title}</h4>
                                </div>
                            ))}
                            <Button className="w-full bg-white text-indigo-700 hover:bg-indigo-50 font-bold">
                                Lihat Semua Pengumuman
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Quick Access Grid */}
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base text-slate-700">Akses Cepat</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-3">
                                <Button variant="outline" className="h-20 flex flex-col gap-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-all">
                                    <BookOpen className="w-6 h-6" />
                                    <span className="text-xs">E-Library</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex flex-col gap-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 transition-all">
                                    <Award className="w-6 h-6" />
                                    <span className="text-xs">Raport</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex flex-col gap-2 border-slate-200 hover:border-amber-500 hover:bg-amber-50 hover:text-amber-600 transition-all">
                                    <Clock className="w-6 h-6" />
                                    <span className="text-xs">Riwayat Absen</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex flex-col gap-2 border-slate-200 hover:border-purple-500 hover:bg-purple-50 hover:text-purple-600 transition-all">
                                    <User className="w-6 h-6" />
                                    <span className="text-xs">Profil</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
};
