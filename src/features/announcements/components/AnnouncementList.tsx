"use client";

import React from "react";
import { AnnouncementCard } from "./AnnouncementCard";
import { Megaphone } from "lucide-react";
import { EmptyState, PaginationControls } from "@/features/shared/components";
import type { AnnouncementListResponse } from "../types/announcement";

interface AnnouncementListProps {
  data?: AnnouncementListResponse;
  isError: boolean;
  baseHref: string;
  onPageChange: (page: number) => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

export const AnnouncementList: React.FC<AnnouncementListProps> = ({
  data,
  isError,
  baseHref,
  onPageChange,
  emptyTitle = "Tidak Ada Pengumuman",
  emptyDescription = "Belum ada pengumuman yang tersedia untuk Anda saat ini.",
}) => {
  if (isError) {
    return (
      <EmptyState
        icon={Megaphone}
        title="Gagal Memuat Pengumuman"
        description="Terjadi kesalahan saat memuat pengumuman. Silakan coba lagi."
      />
    );
  }

  const announcements = data?.items ?? [];
  const meta = data?.meta;

  if (announcements.length === 0) {
    return (
      <EmptyState
        icon={Megaphone}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {announcements.map((announcement) => (
          <AnnouncementCard
            key={announcement.id}
            announcement={announcement}
            baseHref={baseHref}
          />
        ))}
      </div>

      {/* Muncul otomatis hanya kalau total data melebihi per_page */}
      {meta && meta.last_page > 1 && (
        <PaginationControls
          currentPage={meta.current_page}
          totalPages={meta.last_page}
          totalItems={meta.total}
          startIndex={(meta.current_page - 1) * meta.per_page + 1}
          endIndex={Math.min(meta.current_page * meta.per_page, meta.total)}
          itemsPerPage={meta.per_page}
          itemLabel="pengumuman"
          showPerPageSelect={false}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
};
