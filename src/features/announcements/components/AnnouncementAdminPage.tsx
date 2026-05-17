"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Megaphone,
  Plus,
  Pencil,
  Trash2,
  Search,
  Loader2,
  FileX,
} from "lucide-react";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";
import {
  PageHeader,
  PaginationControls,
  SkeletonPageHeader,
} from "@/features/shared/components";
import {
  useAdminAnnouncements,
  useDeleteAnnouncement,
} from "../hooks/useAnnouncements";
import type { Announcement } from "../types/announcement";

// ── Constants ─────────────────────────────────────────────────────────────────

const TARGET_ROLE_OPTIONS = [
  { value: "guru", label: "Guru" },
  { value: "siswa", label: "Siswa" },
  { value: "orang_tua", label: "Orang Tua" },
  { value: "tutor_ekskul", label: "Tutor Ekskul" },
  { value: "pembimbing_lomba", label: "Pembimbing Lomba" },
  { value: "pj_mutamayizin", label: "PJ Mutamayizin" },
  { value: "admin", label: "Administrator" },
];

// ── Skeleton ──────────────────────────────────────────────────────────────────

function AdminAnnouncementSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <SkeletonPageHeader withAction />
      <Card className="border-slate-200">
        <CardHeader>
          <div className="flex gap-3">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-44" />
            <Skeleton className="h-10 w-36" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-t border-slate-200">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-6 py-4 border-b border-slate-100"
              >
                <Skeleton className="h-4 w-6" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-5 w-20 rounded-md" />
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export const AnnouncementAdminPage: React.FC = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [searchInput, setSearchInput] = useState("");
  const [targetRole, setTargetRole] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const debouncedSearch = useDebounce(searchInput, 400);

  const { data, isLoading, isFetching, isError, refetch } =
    useAdminAnnouncements({
      page,
      perPage,
      search: debouncedSearch || undefined,
      targetRole: targetRole !== "all" ? targetRole : undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
    });

  const { mutate: deleteAnnouncement, isPending: isDeleting } =
    useDeleteAnnouncement();

  const handleDeleteConfirm = useCallback(() => {
    if (deleteId === null) return;
    deleteAnnouncement(deleteId, {
      onSuccess: () => {
        toast.success("Pengumuman berhasil dihapus.");
        setDeleteId(null);
        refetch();
      },
      onError: () => {
        toast.error("Gagal menghapus pengumuman.");
        setDeleteId(null);
      },
    });
  }, [deleteId, deleteAnnouncement, refetch]);

  const announcements = data?.items ?? [];
  const meta = data?.meta;

  if (isLoading) return <AdminAnnouncementSkeleton />;

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Kelola"
          titleHighlight="Pengumuman"
          icon={Megaphone}
          description="Buat, edit, dan kelola pengumuman untuk semua pengguna"
        >
          <Button
            onClick={() => router.push("/admin/announcements/new")}
            className="bg-blue-800 hover:bg-blue-900 text-white gap-2 shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="h-4 w-4" />
            Tambah Pengumuman
          </Button>
        </PageHeader>

        {/* Error banner */}
        {isError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 text-sm">
            Gagal memuat data pengumuman. Silakan coba lagi.
          </div>
        )}

        {/* Main Card */}
        <Card className="border-slate-200">
          <CardHeader className="pb-4">
            {/* Card title row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                  <Megaphone className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-900">
                    Daftar Pengumuman
                  </CardTitle>
                  <CardDescription>
                    {meta?.total ?? 0} pengumuman tersedia
                  </CardDescription>
                </div>
              </div>
              {isFetching && !isLoading && (
                <Loader2 className="h-4 w-4 text-slate-400 animate-spin" />
              )}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-slate-100">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari judul pengumuman..."
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setPage(1);
                  }}
                  className="pl-9"
                />
              </div>

              <Select
                value={targetRole}
                onValueChange={(v) => {
                  setTargetRole(v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Target Penerima" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Target</SelectItem>
                  {TARGET_ROLE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={statusFilter}
                onValueChange={(v) => {
                  setStatusFilter(v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="border-t border-slate-200 overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3.5 font-semibold text-xs text-slate-600 uppercase tracking-wider w-12">
                      No
                    </th>
                    <th className="px-6 py-3.5 font-semibold text-xs text-slate-600 uppercase tracking-wider">
                      Judul
                    </th>
                    <th className="px-6 py-3.5 font-semibold text-xs text-slate-600 uppercase tracking-wider">
                      Target
                    </th>
                    <th className="px-6 py-3.5 font-semibold text-xs text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3.5 font-semibold text-xs text-slate-600 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3.5 font-semibold text-xs text-slate-600 uppercase tracking-wider text-right">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {announcements.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <FileX className="h-8 w-8 text-slate-300" />
                          <p className="text-sm text-slate-500">
                            {debouncedSearch ||
                            targetRole !== "all" ||
                            statusFilter !== "all"
                              ? "Tidak ada pengumuman yang cocok dengan filter"
                              : "Belum ada pengumuman"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    announcements.map((ann, idx) => (
                      <AnnouncementRow
                        key={ann.id}
                        announcement={ann}
                        index={(page - 1) * perPage + idx + 1}
                        onEdit={() =>
                          router.push(`/admin/announcements/${ann.id}/edit`)
                        }
                        onDelete={() => setDeleteId(ann.id)}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {meta && meta.last_page > 1 && (
              <PaginationControls
                currentPage={meta.current_page}
                totalPages={meta.last_page}
                totalItems={meta.total}
                startIndex={(meta.current_page - 1) * meta.per_page + 1}
                endIndex={Math.min(
                  meta.current_page * meta.per_page,
                  meta.total,
                )}
                itemsPerPage={meta.per_page}
                itemLabel="pengumuman"
                onPageChange={setPage}
                onItemsPerPageChange={(val) => {
                  setPerPage(val);
                  setPage(1);
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-4 mb-1">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <AlertDialogTitle className="text-lg">
                  Hapus Pengumuman?
                </AlertDialogTitle>
                <AlertDialogDescription className="mt-0.5">
                  Pengumuman yang dihapus tidak dapat dipulihkan.
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Ya, Hapus"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

// ── Row Component ─────────────────────────────────────────────────────────────

interface AnnouncementRowProps {
  announcement: Announcement;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

const AnnouncementRow: React.FC<AnnouncementRowProps> = ({
  announcement,
  index,
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
      {/* No */}
      <td className="px-6 py-4 text-slate-500 text-sm">{index}</td>

      {/* Judul */}
      <td className="px-6 py-4">
        <p className="font-medium text-slate-800 line-clamp-1 max-w-sm">
          {announcement.title}
        </p>
        {announcement.author && (
          <p className="text-xs text-slate-400 mt-0.5">
            {announcement.author.name}
          </p>
        )}
      </td>

      {/* Target */}
      <td className="px-6 py-4">
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-800 text-white">
          {announcement.target_role_label}
        </span>
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
            announcement.is_active
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {announcement.is_active ? "Aktif" : "Tidak Aktif"}
        </span>
      </td>

      {/* Tanggal */}
      <td className="px-6 py-4 text-sm text-slate-500">
        {formatDate(announcement.published_at ?? announcement.created_at)}
      </td>

      {/* Aksi */}
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onEdit}
            className="h-8 w-8 rounded-lg border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 flex items-center justify-center transition-colors"
            title="Edit"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="h-8 w-8 rounded-lg border border-slate-200 bg-white hover:bg-red-50 hover:border-red-200 hover:text-red-600 flex items-center justify-center transition-colors"
            title="Hapus"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
};
