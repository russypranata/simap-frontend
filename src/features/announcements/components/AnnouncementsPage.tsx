"use client";

import React, { useState } from "react";
import { AnnouncementList } from "@/features/announcements/components/AnnouncementList";
import {
  useAnnouncements,
  useUnreadCount,
} from "@/features/announcements/hooks/useAnnouncements";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Megaphone, Bell, BookOpen } from "lucide-react";
import {
  PageHeader,
  StatCard,
  SkeletonPageHeader,
  SkeletonStatCard,
  SkeletonCardHeader,
} from "@/features/shared/components";
import { Skeleton } from "@/components/ui/skeleton";

interface AnnouncementsPageProps {
  baseHref: string;
  title?: string;
}

export const AnnouncementsPage: React.FC<AnnouncementsPageProps> = ({
  baseHref,
}) => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useAnnouncements(page);
  const { data: unreadCount, isLoading: isLoadingUnread } = useUnreadCount();

  const totalCount = data?.meta?.total ?? 0;
  const unread = isLoadingUnread ? 0 : (unreadCount ?? 0);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <SkeletonPageHeader />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SkeletonStatCard />
          <SkeletonStatCard />
        </div>
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <SkeletonCardHeader />
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border bg-card overflow-hidden"
              >
                <div className="px-5 py-5">
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-10 w-10 rounded-xl shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full mt-2" />
                      <Skeleton className="h-4 w-2/3 mt-1.5" />
                      <div className="flex items-center gap-3 mt-3">
                        <Skeleton className="h-3.5 w-24 rounded-full" />
                        <Skeleton className="h-3.5 w-28 rounded-full" />
                        <Skeleton className="h-5 w-16 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Papan"
        titleHighlight="Pengumuman"
        icon={Megaphone}
        description="Lihat pengumuman terbaru dari sekolah"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          title="Total Pengumuman"
          value={totalCount}
          unit="pengumuman"
          subtitle="Pengumuman tersedia"
          icon={BookOpen}
          color="blue"
        />
        <StatCard
          title="Belum Dibaca"
          value={unread}
          unit="pengumuman"
          subtitle={unread > 0 ? "Perlu segera dibaca" : "Semua sudah dibaca"}
          icon={Bell}
          color={unread > 0 ? "red" : "green"}
        />
      </div>

      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 rounded-xl">
              <Megaphone className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-slate-800">
                Daftar Pengumuman
              </CardTitle>
              <CardDescription className="text-sm text-slate-600">
                Semua pengumuman yang tersedia untuk Anda
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <AnnouncementList
            data={data}
            isError={isError}
            baseHref={baseHref}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>
    </div>
  );
};
