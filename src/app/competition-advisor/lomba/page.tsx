"use client";

import React, { useState } from "react";
import { Trophy, Search, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import {
  PageHeader,
  EmptyState,
  ErrorState,
  SkeletonPageHeader,
  SkeletonTableRow,
} from "@/features/shared/components";
import { useCompetitionAdvisorExtracurriculars } from "@/features/competition-advisor/hooks/useCompetitionAdvisor";

export default function CompetitionAdvisorLombaPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { data: extracurriculars, isLoading, error, refetch } = useCompetitionAdvisorExtracurriculars();

  const filtered = extracurriculars?.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    (e.category && e.category.toLowerCase().includes(search.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <SkeletonPageHeader />
        <Card>
          <CardHeader>
            <div className="h-6 w-40 bg-slate-100 rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonTableRow key={i} cols={4} />
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
        title="Daftar"
        titleHighlight="Lomba & Kompetisi"
        icon={Trophy}
        description="Semua lomba dan kompetisi yang Anda bimbing"
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">Lomba yang Dibimbing</CardTitle>
                <CardDescription>Klik untuk melihat detail anggota, presensi, dan penilaian</CardDescription>
              </div>
            </div>
            <Badge className="bg-amber-100 text-amber-800 border-amber-200">
              {filtered?.length ?? 0} Lomba
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4 border-b">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama atau kategori lomba..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 w-12">No</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Nama Lomba</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Kategori</th>
                  <th className="text-center p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 w-28">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {!filtered || filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4}>
                      <EmptyState
                        icon={Trophy}
                        title="Belum ada lomba"
                        description="Hubungi admin untuk ditambahkan sebagai pembimbing lomba"
                      />
                    </td>
                  </tr>
                ) : (
                  filtered.map((lomba, index) => (
                    <tr
                      key={lomba.id}
                      className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="p-4 text-sm text-slate-500">{index + 1}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                            <Trophy className="h-4 w-4 text-amber-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800">{lomba.name}</p>
                            {lomba.description && (
                              <p className="text-xs text-slate-500 line-clamp-1">{lomba.description}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {lomba.category ? (
                          <Badge variant="secondary" className="bg-blue-50 text-blue-800 border-blue-200">
                            {lomba.category}
                          </Badge>
                        ) : (
                          <span className="text-sm text-slate-400">-</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 hover:text-amber-900 rounded-lg"
                          onClick={() => router.push(`/competition-advisor/lomba/${lomba.id}/anggota`)}
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
