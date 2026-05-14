"use client";

import { useParams } from "next/navigation";
import { AnnouncementForm } from "@/features/announcements/components/AnnouncementForm";
import { useAnnouncement } from "@/features/announcements/hooks/useAnnouncements";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  EmptyState,
  SkeletonPageHeader,
  SkeletonCardHeader,
} from "@/features/shared/components";
import { Skeleton } from "@/components/ui/skeleton";
import { Megaphone } from "lucide-react";

export default function EditAnnouncementPage() {
  const params = useParams();
  const id = Number(params?.id);
  const { data: announcement, isLoading, isError } = useAnnouncement(id);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* Page header skeleton — mirrors AnnouncementForm PageHeader + BackButton */}
        <SkeletonPageHeader withAction />

        {/* Info card skeleton — mirrors "Informasi Pengumuman" card */}
        <Card className="border-slate-200">
          <CardHeader className="pb-4">
            <SkeletonCardHeader />
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Title field */}
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            {/* Target role + published_at */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>
            {/* Is active toggle */}
            <Skeleton className="h-14 w-full rounded-xl" />
          </CardContent>
        </Card>

        {/* Content card skeleton — mirrors "Isi Pengumuman" card */}
        <Card className="border-slate-200">
          <CardHeader className="pb-4">
            <SkeletonCardHeader />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full rounded-xl" />
          </CardContent>
        </Card>

        {/* Actions skeleton */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 w-40 rounded-lg" />
        </div>
      </div>
    );
  }

  if (isError || !announcement) {
    return (
      <Card className="border-slate-200">
        <CardContent>
          <EmptyState
            icon={Megaphone}
            title="Pengumuman Tidak Ditemukan"
            description="Pengumuman tidak ditemukan atau terjadi kesalahan."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <AnnouncementForm
      mode="edit"
      announcement={announcement}
      backHref="/admin/announcements"
    />
  );
}
