"use client";

import React, { useEffect } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTeacherData } from "../hooks/useTeacherData";
import {
  formatDate,
  formatTime,
  getDayName,
} from "@/features/shared/utils/dateFormatter";
import {
  Users,
  Calendar,
  BookOpen,
  CheckCircle,
  XCircle,
  FileText,
  Megaphone,
  Clock,
  TrendingUp,
  AlertCircle,
  Award,
  Target,
  Activity,
  BarChart3,
  UserCheck,
  FileCheck,
  Bell,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
} from "lucide-react";

// Stat Card Component
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
    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
      <CardHeader className="relative pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground pr-12">
          {title}
        </CardTitle>
        <div className={`absolute top-4 right-4 p-2 rounded-lg ${bgColor}`}>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-foreground">{value}</div>
          {trend && (
            <div
              className={`flex items-center text-xs ${trend.isUp ? "text-green-600" : "text-red-600"
                }`}
            >
              {trend.isUp ? (
                <ArrowUp className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 mr-1" />
              )}
              {trend.value}%
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
};

// Schedule Item Component
interface ScheduleItemProps {
  schedule: any;
  isCurrent?: boolean;
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({
  schedule,
  isCurrent = false,
}) => {
  const currentTime = formatTime(new Date());
  const scheduleTime = schedule.time.split("-")[0];
  const isPast = currentTime > scheduleTime && !isCurrent;

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${isCurrent
          ? "bg-primary/10 border-primary/30"
          : isPast
            ? "bg-muted/30 border-muted"
            : "bg-background hover:bg-muted/50"
        }`}
    >
      <div className="flex items-center space-x-4">
        <div
          className={`p-2 rounded-lg ${isCurrent ? "bg-primary/20" : "bg-muted"
            }`}
        >
          <Clock
            className={`h-4 w-4 ${isCurrent ? "text-primary" : "text-muted-foreground"
              }`}
          />
        </div>
        <div>
          <p className="font-medium text-sm">{schedule.subject}</p>
          <p className="text-xs text-muted-foreground">
            {schedule.class} • Ruang {schedule.room}
          </p>
        </div>
      </div>
      <div className="text-right">
        <Badge
          variant={isCurrent ? "default" : "secondary"}
          className="text-xs"
        >
          {schedule.time}
        </Badge>
        {isCurrent && (
          <p className="text-xs text-primary mt-1">Sedang Berlangsung</p>
        )}
      </div>
    </div>
  );
};

// Announcement Item Component
interface AnnouncementItemProps {
  announcement: any;
}

const AnnouncementItem: React.FC<AnnouncementItemProps> = ({
  announcement,
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Penting";
      case "medium":
        return "Sedang";
      default:
        return "Biasa";
    }
  };

  return (
    <div className="p-4 rounded-lg border bg-card hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded bg-muted">
            <Megaphone className="h-3 w-3 text-muted-foreground" />
          </div>
          <h4 className="font-medium text-sm line-clamp-1">
            {announcement.title}
          </h4>
        </div>
        <Badge className={`text-xs ${getPriorityColor(announcement.priority)}`}>
          {getPriorityLabel(announcement.priority)}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
        {announcement.content}
      </p>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{announcement.sender}</span>
        <span>{formatDate(announcement.timestamp, "dd MMM yyyy")}</span>
      </div>
    </div>
  );
};

// Recent Activity Component
interface ActivityItemProps {
  activity: {
    id: string;
    type: string;
    title: string;
    time: string;
    icon: React.ComponentType<{ className?: string }>;
  };
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const Icon = activity.icon;

  return (
    <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="p-2 rounded-full bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{activity.title}</p>
        <p className="text-xs text-muted-foreground">{activity.time}</p>
      </div>
    </div>
  );
};

export const TeacherDashboard: React.FC = () => {
  const {
    loading,
    error,
    dashboardStats,
    profile,
    schedule,
    announcements,
    clearError,
  } = useTeacherData();

  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [error, clearError]);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-8 w-8 bg-muted rounded"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-6 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-5 bg-muted rounded w-1/3"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-muted rounded"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Enhanced stat cards with trends
  const statCards: StatCardProps[] = [
    {
      title: "Jumlah Kelas",
      value: dashboardStats?.totalClasses || 0,
      description: "Kelas yang diampu",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: { value: 12, isUp: true },
    },
    {
      title: "Jadwal Hari Ini",
      value: dashboardStats?.todaySchedule || 0,
      description: "Jam mengajar",
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-50",
      trend: { value: 8, isUp: false },
    },
    {
      title: "Jurnal Mengajar",
      value: dashboardStats?.teachingJournals || 0,
      description: "Jurnal bulan ini",
      icon: BookOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      trend: { value: 25, isUp: true },
    },
    {
      title: "Status Absensi",
      value: `${dashboardStats?.attendanceStatus.present || 0}/${dashboardStats?.attendanceStatus.total || 0
        }`,
      description: "Siswa hadir hari ini",
      icon: UserCheck,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      trend: { value: 5, isUp: true },
    },
    {
      title: "Dokumen Terkirim",
      value: dashboardStats?.documentsSent || 0,
      description: "Dokumen disetujui",
      icon: FileCheck,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      trend: { value: 15, isUp: true },
    },
    {
      title: "Pengumuman Terbaru",
      value: dashboardStats?.latestAnnouncements || 0,
      description: "Pengumuman minggu ini",
      icon: Bell,
      color: "text-red-600",
      bgColor: "bg-red-50",
      trend: { value: 3, isUp: false },
    },
  ];

  const attendancePercentage = dashboardStats?.attendanceStatus.total
    ? (dashboardStats.attendanceStatus.present /
      dashboardStats.attendanceStatus.total) *
    100
    : 0;

  // Mock recent activities
  const recentActivities = [
    {
      id: "1",
      type: "attendance",
      title: "Presensi kelas XII IPA 1 berhasil disimpan",
      time: "10 menit yang lalu",
      icon: CheckCircle,
    },
    {
      id: "2",
      type: "journal",
      title: "Jurnal mengajar Matematika ditambahkan",
      time: "1 jam yang lalu",
      icon: BookOpen,
    },
    {
      id: "3",
      type: "document",
      title: "Dokumen CP Matematika diunggah",
      time: "2 jam yang lalu",
      icon: FileText,
    },
    {
      id: "4",
      type: "grade",
      title: "Nilai UTS Fisika diperbarui",
      time: "3 jam yang lalu",
      icon: Award,
    },
  ];

  // Get current schedule
  const currentSchedule = schedule?.find((s) => {
    const currentTime = formatTime(new Date());
    const [startTime, endTime] = s.time.split("-");
    return currentTime >= startTime && currentTime <= endTime;
  });

  const todaySchedule =
    schedule?.filter((s) => {
      const currentTime = formatTime(new Date());
      const scheduleTime = s.time.split("-")[0];
      return currentTime <= scheduleTime;
    }) || [];

  return (
    <div className="space-y-6">
      {/* Header without Profile */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Dashboard <span className="text-primary">Guru</span>
          </h1>
          <p className="text-muted-foreground">
            Ringkasan aktivitas pembelajaran dan administrasi
          </p>
          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-semibold">Tahun Ajaran 2025/2026</span>
            </div>
            <div className="h-4 w-[1px] bg-border" />
            <span className="text-muted-foreground text-sm font-medium text-primary">Semester Ganjil</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Schedule and Attendance */}
        <div className="lg:col-span-2 space-y-6">
          {/* Attendance Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <UserCheck className="h-5 w-5 text-emerald-600" />
                  <span>Overview Absensi Hari Ini</span>
                </CardTitle>
                <Badge variant="outline" className="text-xs">
                  {formatDate(new Date(), "dd MMMM yyyy")}
                </Badge>
              </div>
              <CardDescription>
                Persentase kehadiran siswa pada jadwal mengajar hari ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Kehadiran</span>
                  <span className="text-sm text-muted-foreground">
                    {dashboardStats?.attendanceStatus.present || 0} dari{" "}
                    {dashboardStats?.attendanceStatus.total || 0} siswa
                  </span>
                </div>
                <Progress value={attendancePercentage} className="h-3" />
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      {dashboardStats?.attendanceStatus.present || 0}
                    </div>
                    <div className="text-xs text-green-600">Hadir</div>
                  </div>
                  <div className="p-2 bg-red-50 rounded-lg">
                    <div className="text-lg font-bold text-red-600">
                      {dashboardStats?.attendanceStatus.absent || 0}
                    </div>
                    <div className="text-xs text-red-600">Tidak Hadir</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span>Jadwal Hari Ini</span>
                </CardTitle>
                <Button variant="outline" size="sm">
                  Lihat Semua
                </Button>
              </div>
              <CardDescription>
                {getDayName(new Date())}, {formatDate(new Date())}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentSchedule && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-primary mb-2">
                      Sedang Berlangsung
                    </p>
                    <ScheduleItem schedule={currentSchedule} isCurrent={true} />
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    {currentSchedule ? "Jadwal Berikutnya" : "Jadwal Hari Ini"}
                  </p>
                  {todaySchedule.length > 0 ? (
                    todaySchedule
                      .slice(0, 3)
                      .map((schedule, index) => (
                        <ScheduleItem
                          key={index}
                          schedule={schedule}
                          isCurrent={false}
                        />
                      ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">Tidak ada jadwal hari ini</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Announcements and Activity */}
        <div className="space-y-6">
          {/* Latest Announcements */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Megaphone className="h-5 w-5 text-red-600" />
                  <span>Pengumuman Terbaru</span>
                </CardTitle>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>Pengumuman terkini dari sekolah</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {announcements && announcements.length > 0 ? (
                  announcements
                    .slice(0, 3)
                    .map((announcement, index) => (
                      <AnnouncementItem
                        key={index}
                        announcement={announcement}
                      />
                    ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Megaphone className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Tidak ada pengumuman baru</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-purple-600" />
                <span>Aktivitas Terkini</span>
              </CardTitle>
              <CardDescription>Aktivitas terbaru Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentActivities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-purple-600" />
            <span>Aksi Cepat</span>
          </CardTitle>
          <CardDescription>
            Akses cepat ke fitur yang sering digunakan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              onClick={() => (window.location.hash = "/teacher/attendance")}
            >
              <Users className="h-6 w-6" />
              <span className="text-xs font-medium">Presensi</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              onClick={() => (window.location.hash = "/teacher/journal")}
            >
              <BookOpen className="h-6 w-6" />
              <span className="text-xs font-medium">Jurnal</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              onClick={() => (window.location.hash = "/teacher/grades")}
            >
              <Award className="h-6 w-6" />
              <span className="text-xs font-medium">Nilai</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              onClick={() => (window.location.hash = "/teacher/schedule")}
            >
              <Calendar className="h-6 w-6" />
              <span className="text-xs font-medium">Jadwal</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              onClick={() =>
                (window.location.hash = "/teacher/upload-documents")
              }
            >
              <FileText className="h-6 w-6" />
              <span className="text-xs font-medium">Upload</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              onClick={() => (window.location.hash = "/teacher/announcements")}
            >
              <Megaphone className="h-6 w-6" />
              <span className="text-xs font-medium">Pengumuman</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              <span>Performa Mingguan</span>
            </CardTitle>
            <CardDescription>
              Statistik performa mengajar minggu ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Tingkat Kehadiran</span>
                <span className="text-sm font-medium">92%</span>
              </div>
              <Progress value={92} className="h-2" />

              <div className="flex items-center justify-between">
                <span className="text-sm">Jurnal Selesai</span>
                <span className="text-sm font-medium">85%</span>
              </div>
              <Progress value={85} className="h-2" />

              <div className="flex items-center justify-between">
                <span className="text-sm">Dokumen Terupload</span>
                <span className="text-sm font-medium">78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <span>Tugas Pending</span>
            </CardTitle>
            <CardDescription>Tugas yang perlu diselesaikan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <div>
                    <p className="text-sm font-medium">Nilai UTS XII IPA 1</p>
                    <p className="text-xs text-muted-foreground">
                      Deadline: 2 hari lagi
                    </p>
                  </div>
                </div>
                <Badge variant="destructive" className="text-xs">
                  Penting
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium">Upload CP Matematika</p>
                    <p className="text-xs text-muted-foreground">
                      Deadline: 5 hari lagi
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  Sedang
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
