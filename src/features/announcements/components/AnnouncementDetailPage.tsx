"use client";

import React from "react";
import { useParams } from "next/navigation";
import { AnnouncementDetail } from "@/features/announcements/components/AnnouncementDetail";
import { useAnnouncement } from "@/features/announcements/hooks/useAnnouncements";

interface AnnouncementDetailPageProps {
  backHref: string;
}

export const AnnouncementDetailPage: React.FC<AnnouncementDetailPageProps> = ({
  backHref,
}) => {
  const params = useParams();
  const id = Number(params?.id);

  const { data: announcement, isLoading, isError } = useAnnouncement(id);

  return (
    <AnnouncementDetail
      announcement={announcement}
      isLoading={isLoading}
      isError={isError}
      backHref={backHref}
    />
  );
};
