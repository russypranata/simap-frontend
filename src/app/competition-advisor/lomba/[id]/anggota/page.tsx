"use client";

import React, { useState } from "react";
import { Users, Search, Eye, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useParams } from "next/navigation";
import {
  PageHeader,
  EmptyState,
  ErrorState,
  SkeletonPageHeader,
  SkeletonTableRow,
  PaginationControls,
} from "@/features/shared/components";
import { useCompetitionAdvisorMembers, useDeleteCompetitionAdvisorMember } from "@/features/competition-advisor/hooks/useCompetitionAdvisor";
import { cn } from "@/lib/utils";

export default function CompetitionAdvisorAnggotaPage() {
  const params = useParams();
  const extracurricularId = Number(params?.id);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const { data, isLoading, error, refetch } = useCompetitionAdvisorMembers(extracurricularId, {
    page,
    perPage,
    search: search || undefined,
  });

  const deleteMutation = useDeleteCompetitionAdvisorMember(extracurricularId);

  const handleDelete = (studentId: number) => {
    if (confirm("Yakin ingin menghapus anggota ini?")) {
      deleteMutation.mutate(studentId);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <SkeletonPageHeader />
        <Card>
          <CardContent className="p-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonTableRow key={i} cols={6} />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) return <ErrorState error={error.message} onRetry={refetch} />;

  const members = data?.items || [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daftar"
        titleHighlight="Anggota Tim"
        icon={Users}
        description="Kelola anggota tim lomba ini"
      >
        <Button
          className="bg-amber-800 hover:bg-amber-900 text-white"
          onClick={() => alert("Tambah anggota - fitur ini akan membuka modal input NIS")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Anggota
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">Anggota Terdaftar</CardTitle>
                <CardDescription>Anggota aktif pada lomba ini</CardDescription>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              {meta?.total ?? 0} Anggota
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4 border-b">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama atau NIS..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 w-12">No</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 w-24">NIS</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Nama Siswa</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 w-28">Kelas</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 w-36">Kehadiran</th>
                  <th className="text-center p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 w-24">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {members.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <EmptyState
                        icon={Users}
                        title="Belum ada anggota"
                        description="Tambahkan anggota tim dengan klik tombol di atas"
                      />
                    </td>
                  </tr>
                ) : (
                  members.map((member, index) => (
                    <tr
                      key={member.id}
                      className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="p-4 text-sm text-slate-500">
                        {((meta?.current_page ?? 1) - 1) * (meta?.per_page ?? 20) + index + 1}
                      </td>
                      <td className="p-4 text-sm font-mono text-slate-600">{member.nis}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-medium text-blue-800">
                              {member.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")
                                .substring(0, 2)
                                .toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-slate-800">{member.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary" className="bg-blue-50 text-blue-800 border-blue-200">
                          {member.class}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1.5 w-full max-w-[140px]">
                          <div className="flex justify-between text-xs">
                            <span className="font-medium text-slate-700">{member.attendance}%</span>
                            <span className="text-slate-400">Hadir</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full transition-all duration-500",
                                member.attendance >= 90
                                  ? "bg-emerald-500"
                                  : member.attendance >= 75
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                              )}
                              style={{ width: `${member.attendance}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg"
                            onClick={() => alert(`Detail anggota: ${member.name}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 bg-red-50 hover:bg-red-100 text-red-800 rounded-lg"
                            onClick={() => handleDelete(member.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {meta && meta.total > 0 && (
            <PaginationControls
              currentPage={meta.current_page}
              totalPages={meta.last_page}
              totalItems={meta.total}
              startIndex={((meta.current_page - 1) * meta.per_page) + 1}
              endIndex={Math.min(meta.current_page * meta.per_page, meta.total)}
              itemsPerPage={meta.per_page}
              itemLabel="anggota"
              onPageChange={setPage}
              onItemsPerPageChange={(val) => { setPerPage(val); setPage(1); }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
