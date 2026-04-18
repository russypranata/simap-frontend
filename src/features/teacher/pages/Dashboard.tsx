"use client";

import React from "react";
import { LayoutDashboard, Users, Calendar, ClipboardCheck, BookOpen, TrendingUp, Clock, Award } from "lucide-react";
import { PageHeader, StatCard, SkeletonPageHeader, SkeletonStatCard } from "@/features/shared/components";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTeacherData } from "../hooks/useTeacherData";

export const TeacherDashboard: React.FC = () => {
  const { loading, dashboardStats, classes, schedule } = useTeacherData();

  // Get today's schedule
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long' });
  const todaySchedule = schedule.filter(s => s.day === today);

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <SkeletonPageHeader />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-5 bg-muted rounded w-1/3"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="h-16 bg-muted rounded"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <PageHeader
        title="Dashboard"
        titleHighlight="Guru"
        icon={LayoutDashboard}
        description="Ringkasan aktivitas pembelajaran dan administrasi"
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Kelas"
          value={dashboardStats?.totalClasses ?? 0}
          subtitle="Kelas yang diampu"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Jadwal Hari Ini"
          value={dashboardStats?.todaySchedule ?? 0}
          subtitle="Jam pelajaran"
          icon={Calendar}
          color="purple"
        />
        <StatCard
          title="Kehadiran Hari Ini"
          value={`${dashboardStats?.attendanceStatus?.present ?? 0}/${dashboardStats?.attendanceStatus?.total ?? 0}`}
          subtitle="Siswa hadir"
          icon={ClipboardCheck}
          color="green"
        />
        <StatCard
          title="Rata-rata Kehadiran"
          value={dashboardStats?.attendanceStatus?.total 
            ? `${Math.round((dashboardStats.attendanceStatus.present / dashboardStats.attendanceStatus.total) * 100)}%`
            : '0%'}
          subtitle="Tingkat kehadiran"
          icon={TrendingUp}
          color="emerald"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Jadwal Hari Ini
                </CardTitle>
                <CardDescription>
                  {today}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </CardDescription>
              </div>
              <Badge variant="outline">{todaySchedule.length} Jam</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {todaySchedule.length > 0 ? (
              <div className="space-y-3">
                {todaySchedule.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
                        <span className="text-xs font-medium">Jam</span>
                        <span className="text-sm font-bold">{item.time.split(' - ')[0].substring(0, 5)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{item.subject}</p>
                        <p className="text-xs text-muted-foreground">{item.class} • {item.room}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {item.time}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">Tidak ada jadwal mengajar hari ini</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Classes Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Kelas yang Diampu
                </CardTitle>
                <CardDescription>
                  Daftar kelas yang Anda ajar
                </CardDescription>
              </div>
              <Badge variant="outline">{classes.length} Kelas</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {classes.length > 0 ? (
              <div className="space-y-3">
                {classes.slice(0, 5).map((cls) => (
                  <div
                    key={cls.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 text-blue-600">
                        <Users className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{cls.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {cls.studentCount} siswa • {cls.subjects?.length ?? 0} mapel
                        </p>
                      </div>
                    </div>
                    {cls.homeroomTeacher && (
                      <Badge variant="secondary" className="text-xs">
                        Wali Kelas
                      </Badge>
                    )}
                  </div>
                ))}
                {classes.length > 5 && (
                  <p className="text-xs text-center text-muted-foreground pt-2">
                    +{classes.length - 5} kelas lainnya
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">Belum ada kelas yang diampu</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Aksi Cepat
          </CardTitle>
          <CardDescription>
            Akses cepat ke fitur yang sering digunakan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <a
              href="/teacher/attendance"
              className="flex flex-col items-center justify-center p-4 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer group"
            >
              <ClipboardCheck className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-center">Presensi</span>
            </a>
            <a
              href="/teacher/grades"
              className="flex flex-col items-center justify-center p-4 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer group"
            >
              <Award className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-center">Nilai</span>
            </a>
            <a
              href="/teacher/schedule"
              className="flex flex-col items-center justify-center p-4 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer group"
            >
              <Calendar className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-center">Jadwal</span>
            </a>
            <a
              href="/teacher/classes"
              className="flex flex-col items-center justify-center p-4 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer group"
            >
              <Users className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-center">Kelas</span>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
