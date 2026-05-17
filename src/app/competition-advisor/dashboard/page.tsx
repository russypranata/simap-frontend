"use client";

import React, { useState } from "react";
import { Trophy, Users, ClipboardList, TrendingUp, Award, Calendar, Megaphone, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import {
  PageHeader,
  StatCard,
  SkeletonPageHeader,
  SkeletonStatCard,
  ErrorState,
  EmptyState,
} from "@/features/shared/components";
import { useCompetitionAdvisorDashboard } from "@/features/competition-advisor/hooks/useCompetitionAdvisor";

const ScheduleCardSkeleton = () => (
  <Card>
    <div className="p-6 pb-3">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-slate-100 animate-pulse" />
        <div className="space-y-1.5">
          <div className="h-5 w-32 bg-slate-100 rounded animate-pulse" />
          <div className="h-4 w-44 bg-slate-100 rounded animate-pulse" />
        </div>
      </div>
    </div>
    <CardContent className="space-y-4">
      <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
      <div className="h-14 w-full rounded-lg bg-slate-100 animate-pulse" />
      <div className="h-4 w-28 bg-slate-100 rounded animate-pulse" />
      <div className="h-14 w-full rounded-lg bg-slate-100 animate-pulse" />
    </CardContent>
  </Card>
);

const ActivitiesSkeleton = () => (
  <Card>
    <div className="p-6 pb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-slate-100 animate-pulse" />
          <div className="space-y-1.5">
            <div className="h-5 w-28 bg-slate-100 rounded animate-pulse" />
            <div className="h-4 w-40 bg-slate-100 rounded animate-pulse" />
          </div>
        </div>
        <div className="h-8 w-24 bg-slate-100 rounded animate-pulse" />
      </div>
    </div>
    <CardContent className="space-y-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-14 w-full rounded-lg bg-slate-100 animate-pulse" />
      ))}
    </CardContent>
  </Card>
);

export default function CompetitionAdvisorDashboardPage() {
  const router = useRouter();
  const [selectedLomba, setSelectedLomba] = useState<string>("");
  const { data, isLoading, error, refetch } = useCompetitionAdvisorDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <SkeletonPageHeader withAction />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ScheduleCardSkeleton />
          <ActivitiesSkeleton />
        </div>
      </div>
    );
  }

  if (error) return <ErrorState error={error.message} onRetry={refetch} />;

  const dashboard = data;
  const hasExtracurriculars = dashboard && dashboard.extracurriculars && dashboard.extracurriculars.length > 0;

  const attendanceColor: "green" | "amber" | "red" =
    (dashboard?.averageAttendance ?? 0) >= 90
      ? "green"
      : (dashboard?.averageAttendance ?? 0) >= 75
      ? "amber"
      : "red";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        titleHighlight="Pembimbing Lomba"
        icon={Award}
        description="Kelola dan pantau semua tim lomba & kompetisi"
      >
        {hasExtracurriculars && (
          <Select value={selectedLomba} onValueChange={(val) => {
            setSelectedLomba(val);
            if (val) router.push(`/competition-advisor/lomba/${val}`);
          }}>
            <SelectTrigger className="w-[220px] bg-white border-slate-200 shadow-sm">
              <Trophy className="h-4 w-4 mr-2 text-amber-600" />
              <SelectValue placeholder="Pilih Lomba" />
            </SelectTrigger>
            <SelectContent>
              {dashboard.extracurriculars.map((e) => (
                <SelectItem key={e.id} value={String(e.id)}>
                  {e.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </PageHeader>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Lomba"
          value={dashboard?.totalExtracurriculars ?? 0}
          subtitle="Lomba yang dibimbing"
          icon={Trophy}
          color="amber"
        />
        <StatCard
          title="Total Anggota"
          value={dashboard?.totalMembers ?? 0}
          subtitle="Anggota aktif"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Rata-rata Kehadiran"
          value={`${dashboard?.averageAttendance ?? 0}%`}
          subtitle="Semua lomba"
          icon={TrendingUp}
          color={attendanceColor as "green" | "amber" | "red"}
        />
        <StatCard
          title="Total Sesi Latihan"
          value={dashboard?.totalMeetings ?? 0}
          subtitle="Kegiatan tercatat"
          icon={Calendar}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jadwal Latihan */}
        <Card>
          <div className="p-6 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100/80 rounded-lg ring-2 ring-amber-200/50">
                <Calendar className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Jadwal Latihan</h3>
                <p className="text-sm text-muted-foreground">Jadwal reguler semua lomba</p>
              </div>
            </div>
          </div>
          <CardContent className="space-y-3">
            {dashboard?.upcomingSchedules && dashboard.upcomingSchedules.length > 0 ? (
              dashboard.upcomingSchedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                      <Star className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{schedule.extracurricularName}</p>
                      <p className="text-xs text-slate-500">{schedule.day}</p>
                    </div>
                  </div>
                  <span className="text-sm font-mono text-slate-600">
                    {schedule.time_start} - {schedule.time_end}
                  </span>
                </div>
              ))
            ) : (
              <EmptyState
                icon={Calendar}
                title="Belum ada jadwal"
                description="Jadwal latihan akan muncul di sini"
              />
            )}
          </CardContent>
        </Card>

        {/* Aktivitas Terbaru */}
        <Card>
          <div className="p-6 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100/80 rounded-lg ring-2 ring-blue-200/50">
                  <ClipboardList className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Aktivitas Terbaru</h3>
                  <p className="text-sm text-muted-foreground">5 kegiatan terakhir</p>
                </div>
              </div>
            </div>
          </div>
          <CardContent className="space-y-2">
            {dashboard?.recentActivities && dashboard.recentActivities.length > 0 ? (
              dashboard.recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Megaphone className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{activity.title}</p>
                      <p className="text-xs text-slate-500">
                        {activity.date} · {activity.topic}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-500">
                    {activity.totalMembers} hadir
                  </span>
                </div>
              ))
            ) : (
              <EmptyState
                icon={ClipboardList}
                title="Belum ada aktivitas"
                description="Aktivitas akan muncul setelah sesi latihan"
              />
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-amber-50 border-amber-800/20">
        <CardContent className="p-3">
          <div className="flex items-start gap-3">
            <Trophy className="h-5 w-5 text-amber-800 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-amber-800">Tips untuk Pembimbing Lomba</p>
              <ul className="text-sm text-amber-900 space-y-1 list-disc list-inside">
                <li>Pilih lomba dari dropdown di atas untuk melihat detail anggota</li>
                <li>Isi presensi setiap sesi latihan untuk memantau kehadiran tim</li>
                <li>Tambahkan penilaian di menu Penilaian untuk setiap anggota tim</li>
                <li>Pantau perkembangan tim melalui statistik kehadiran</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
