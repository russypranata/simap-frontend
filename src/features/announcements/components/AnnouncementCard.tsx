"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Megaphone, Calendar, User } from "lucide-react";
import type { Announcement } from "../types/announcement";
import { getRoleBadgeClass } from "../utils/roleColors";

interface AnnouncementCardProps {
  announcement: Announcement;
  baseHref: string;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
  baseHref,
}) => {
  const isUnread = announcement.is_read === false;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Link href={`${baseHref}/${announcement.id}`}>
      <div className="group relative rounded-xl border bg-card overflow-hidden transition-colors duration-200 hover:bg-accent/40 cursor-pointer">
        <div className="px-5 py-5">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "mt-0.5 p-2.5 rounded-xl shrink-0",
                isUnread
                  ? "bg-blue-100 text-blue-700"
                  : "bg-slate-100 text-slate-500",
              )}
            >
              <Megaphone className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3
                  className={cn(
                    "text-[15px] leading-snug",
                    isUnread
                      ? "font-semibold text-foreground"
                      : "font-medium text-muted-foreground",
                  )}
                >
                  {announcement.title}
                </h3>
                {isUnread && (
                  <Badge className="shrink-0 bg-blue-100 text-blue-800 border-blue-200 font-semibold h-6 px-2.5 rounded-full text-[11px]">
                    Baru
                  </Badge>
                )}
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {announcement.content}
              </p>
              <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(
                    announcement.published_at ?? announcement.created_at,
                  )}
                </span>
                {announcement.author && (
                  <span className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    {announcement.author.name}
                  </span>
                )}
                <span
                  className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold shrink-0",
                    getRoleBadgeClass(announcement.target_role),
                  )}
                >
                  {announcement.target_role_label}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
