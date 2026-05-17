"use client";

import React from "react";
import { CheckCircle, Eye, Plus, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useParams, useRouter } from "next/navigation";
import {
  PageHeader,
  EmptyState,
  ErrorState,
  SkeletonPageHeader,
  SkeletonTableRow,
} from "@/features/shared/components";
import { useCompetitionAdvisorAttendance } from "@/features/competition-advisor/hooks/useCompetitionAdvisor";

export default function CompetitionAdvisorPresensiPage() {
  const params = useParams();
  const router = useRouter();
  const extracurricularId = Number(params?.id);

  const { data: sessions, isLoading, error, refetch } = useCompetitionAdvisorAttendance(
    extracurricularId,
  );

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <SkeletonPageHeader />
        <Card>
          <CardContent className="p-0">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonTableRow key={i} cols={5} />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) return <ErrorState error={error.message} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Presensi"
        titleHighlight="Latihan Lomba"
        icon={CheckCircle}
        description="Riwayat sesi latihan dan kehadiran anggota tim"
      >
        <Button
          className="bg-amber-800 hover:bg-amber-900 text-white"
          onClick={() => alert("Tambah presensi baru - form input sesi latihan")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Sesi Baru
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ClipboardList className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">Riwayat Sesi Latihan</CardTitle>
                <CardDescription>Semua sesi latihan yang telah dilakukan</CardDescription>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              {sessions?.length ?? 0} Sesi
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 w-12">No</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Tanggal</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Topik</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 w-40">Kehadiran</th>
                  <th className="text-center p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 w-24">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {!sessions || sessions.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <EmptyState
                        icon={ClipboardList}
                        title="Belum ada sesi latihan"
                        description="Buat sesi latihan baru dengan klik tombol di atas"
                      />
                    </td>
                  </tr>
                ) : (
                  sessions.map((session, index) => (
                    <tr
                      key={session.id}
                      className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="p-4 text-sm text-slate-500">{index + 1}</td>
                      <td className="p-4 text-sm font-medium text-slate-800">
                        {session.date}
                        <p className="text-xs text-slate-400">
                          {session.start_time} - {session.end_time}
                        </p>
                      </td>
                      <td className="p-4 text-sm text-slate-700">{session.topic}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 transition-all duration-500"
                              style={{ width: `${session.student_stats.percentage}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-slate-600">
                            {session.student_stats.present}/{session.student_stats.total}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-3 bg-blue-50 hover:bg-blue-100 text-blue-800 hover:text-blue-900 rounded-lg"
                          onClick={() => router.push(`/competition-advisor/lomba/${extracurricularId}/presensi/${session.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-1.5" />
                          Detail
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
