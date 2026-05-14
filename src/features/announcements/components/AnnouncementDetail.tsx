"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

import { Megaphone, Calendar, Clock, User as UserIcon } from "lucide-react";
import { EmptyState } from "@/features/shared/components";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Announcement } from "../types/announcement";
import { getRoleBadgeClass } from "../utils/roleColors";

interface AnnouncementDetailProps {
  announcement?: Announcement;
  isLoading: boolean;
  isError: boolean;
  backHref: string; // kept for prop compatibility
}

export const AnnouncementDetail: React.FC<AnnouncementDetailProps> = ({
  announcement,
  isLoading,
  isError,
}) => {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return "";
    return (
      new Date(dateStr).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }) + " WIB"
    );
  };

  if (isLoading) return <AnnouncementDetailSkeleton />;

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

  const dateStr = announcement.published_at ?? announcement.created_at;

  return (
    <div>
      <Card className="border-slate-200 overflow-hidden">
        {/* ── Header Banner ───────────────────────────── */}
        <div className="bg-gradient-to-br from-blue-50 via-slate-50 to-white border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 rounded-xl shrink-0">
              <Megaphone className="h-5 w-5 text-blue-700" />
            </div>
            <div className="min-w-0 flex-1">
              {/* Badge + Title */}
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span
                  className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold",
                    getRoleBadgeClass(announcement.target_role),
                  )}
                >
                  {announcement.target_role_label}
                </span>
                {announcement.is_read === false && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-100 text-blue-800">
                    Belum Dibaca
                  </span>
                )}
              </div>
              <h1 className="text-lg font-bold text-slate-900 leading-snug">
                {announcement.title}
              </h1>
              {/* Meta: date · time · author */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] text-slate-500 mt-1.5">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  {formatDate(dateStr)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  {formatTime(dateStr)}
                </span>
                {announcement.author && (
                  <span className="flex items-center gap-1.5">
                    <UserIcon className="h-3.5 w-3.5 shrink-0" />
                    {announcement.author.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Body ────────────────────────────────────── */}
        <CardContent className="px-6 py-6">
          <AnnouncementContent content={announcement.content} />
        </CardContent>
      </Card>
    </div>
  );
};

// ─── Content Renderer ────────────────────────────────────────────────────────

function AnnouncementContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => (
          <h1 className="text-lg font-bold text-slate-900 mt-5 mb-2">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-base font-bold text-slate-800 mt-4 mb-1.5">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-sm font-semibold text-slate-800 mt-3 mb-1">
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="text-[14px] leading-relaxed text-slate-600 mb-3">
            {children}
          </p>
        ),
        ul: ({ children }) => (
          <ul className="space-y-1 mb-3 pl-1">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="space-y-1 mb-3 pl-1 list-decimal list-inside">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="flex gap-2.5 text-[14px] text-slate-600 leading-relaxed">
            <span className="text-blue-400 shrink-0 mt-0.5 select-none">•</span>
            <span>{children}</span>
          </li>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-slate-800">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic text-slate-600">{children}</em>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-blue-200 pl-4 py-1 my-3 text-slate-500 italic bg-blue-50/50 rounded-r-lg">
            {children}
          </blockquote>
        ),
        hr: () => <hr className="border-slate-200 my-4" />,
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 underline hover:text-blue-900"
          >
            {children}
          </a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function AnnouncementDetailSkeleton() {
  return (
    <div className="animate-in fade-in duration-500">
      <Card className="border-slate-200 overflow-hidden">
        {/* Header banner skeleton */}
        <div className="bg-gradient-to-br from-blue-50 via-slate-50 to-white border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
            <div className="min-w-0 flex-1">
              <Skeleton className="h-4 w-14 rounded-md mb-1.5" />
              <Skeleton className="h-6 w-3/4 mb-1.5" />
              <div className="flex flex-wrap gap-3">
                <Skeleton className="h-3.5 w-40" />
                <Skeleton className="h-3.5 w-16" />
                <Skeleton className="h-3.5 w-28" />
              </div>
            </div>
          </div>
        </div>

        {/* Body skeleton */}
        <CardContent className="px-6 py-6 space-y-5">
          {/* Plain paragraph */}
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          {/* Section with bullets */}
          <div className="space-y-2">
            <Skeleton className="h-3 w-28 rounded-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          {/* Another section */}
          <div className="space-y-2">
            <Skeleton className="h-3 w-20 rounded-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          {/* Footer line */}
          <Skeleton className="h-4 w-40" />
        </CardContent>
      </Card>
    </div>
  );
}
