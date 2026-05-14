"use client";

import React, { useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Megaphone,
  Save,
  Loader2,
  FileText,
  Users,
  Calendar as CalendarIcon,
  ToggleLeft,
} from "lucide-react";
import { PageHeader, BackButton } from "@/features/shared/components";
import { ForwardRefEditor } from "./ForwardRefEditor";
import {
  useCreateAnnouncement,
  useUpdateAnnouncement,
} from "../hooks/useAnnouncements";
import type { Announcement, TargetRole } from "../types/announcement";
import type { MDXEditorMethods } from "@mdxeditor/editor";

// ── Zod Schema ────────────────────────────────────────────────────────────────

const schema = z.object({
  title: z
    .string()
    .min(3, "Judul minimal 3 karakter")
    .max(255, "Judul maksimal 255 karakter"),
  content: z.string().min(10, "Isi pengumuman wajib diisi"),
  target_role: z.enum([
    "all",
    "admin",
    "guru",
    "siswa",
    "orang_tua",
    "tutor_ekskul",
    "pj_mutamayizin",
  ] as const),
  is_active: z.boolean(),
  published_at: z.string().nullable().optional(),
});

type FormValues = z.infer<typeof schema>;

// ── Target role options ───────────────────────────────────────────────────────

const TARGET_ROLE_OPTIONS: { value: TargetRole; label: string }[] = [
  { value: "all", label: "Semua Pengguna" },
  { value: "guru", label: "Guru" },
  { value: "siswa", label: "Siswa" },
  { value: "orang_tua", label: "Orang Tua / Wali Murid" },
  { value: "tutor_ekskul", label: "Tutor Ekskul" },
  { value: "pj_mutamayizin", label: "PJ Mutamayizin" },
  { value: "admin", label: "Administrator" },
];

// ── Props ─────────────────────────────────────────────────────────────────────

interface AnnouncementFormProps {
  mode: "create" | "edit";
  announcement?: Announcement; // required in edit mode
  backHref: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export const AnnouncementForm: React.FC<AnnouncementFormProps> = ({
  mode,
  announcement,
  backHref,
}) => {
  const router = useRouter();
  const editorRef = useRef<MDXEditorMethods>(null);

  const { mutate: createAnnouncement, isPending: isCreating } =
    useCreateAnnouncement();
  const { mutate: updateAnnouncement, isPending: isUpdating } =
    useUpdateAnnouncement();
  const isPending = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: announcement?.title ?? "",
      content: announcement?.content ?? "",
      target_role: announcement?.target_role ?? "all",
      is_active: announcement?.is_active ?? true,
      published_at: announcement?.published_at
        ? new Date(announcement.published_at).toISOString().slice(0, 16)
        : new Date().toISOString().slice(0, 16),
    },
  });

  // Sync content from MDXEditor → RHF on change
  const handleEditorChange = (markdown: string) => {
    setValue("content", markdown, { shouldValidate: true });
  };

  const onSubmit = (values: FormValues) => {
    const payload = {
      ...values,
      published_at: values.published_at
        ? new Date(values.published_at).toISOString()
        : null,
    };

    if (mode === "create") {
      createAnnouncement(payload, {
        onSuccess: () => {
          toast.success("Pengumuman berhasil dibuat!");
          router.push(backHref);
        },
        onError: () => toast.error("Gagal membuat pengumuman. Coba lagi."),
      });
    } else {
      updateAnnouncement(
        { id: announcement!.id, payload },
        {
          onSuccess: () => {
            toast.success("Pengumuman berhasil diperbarui!");
            router.push(backHref);
          },
          onError: () =>
            toast.error("Gagal memperbarui pengumuman. Coba lagi."),
        }
      );
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={mode === "create" ? "Buat" : "Edit"}
        titleHighlight="Pengumuman"
        icon={Megaphone}
        description={
          mode === "create"
            ? "Buat pengumuman baru untuk dikirim ke pengguna"
            : "Perbarui isi dan pengaturan pengumuman"
        }
      >
        <BackButton />
      </PageHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* ── Settings Card ── */}
        <Card className="border-slate-200">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 rounded-xl">
                <FileText className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-slate-800">
                  Informasi Pengumuman
                </CardTitle>
                <CardDescription className="text-sm text-slate-600">
                  Judul, target penerima, dan pengaturan publikasi
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Title */}
            <div className="space-y-1.5">
              <Label
                htmlFor="title"
                className="text-sm font-semibold text-slate-700"
              >
                Judul Pengumuman <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Masukkan judul pengumuman..."
                className={
                  errors.title ? "border-red-400 focus-visible:ring-red-400" : ""
                }
                {...register("title")}
              />
              {errors.title && (
                <p className="text-xs text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Target Role */}
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-slate-400" />
                  Target Penerima <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="target_role"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih target..." />
                      </SelectTrigger>
                      <SelectContent>
                        {TARGET_ROLE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Published At */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="published_at"
                  className="text-sm font-semibold text-slate-700 flex items-center gap-1.5"
                >
                  <CalendarIcon className="h-3.5 w-3.5 text-slate-400" />
                  Tanggal Publikasi
                </Label>
                <Input
                  id="published_at"
                  type="datetime-local"
                  className="text-slate-700"
                  {...register("published_at")}
                />
              </div>
            </div>

            {/* Is Active */}
            <div className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <ToggleLeft className="h-4 w-4 text-slate-500" />
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Status Aktif
                  </p>
                  <p className="text-xs text-slate-500">
                    Pengumuman hanya terlihat jika aktif
                  </p>
                </div>
              </div>
              <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* ── Content Card ── */}
        <Card className="border-slate-200">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 rounded-xl">
                <Megaphone className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-slate-800">
                  Isi Pengumuman
                </CardTitle>
                <CardDescription className="text-sm text-slate-600">
                  Tulis isi pengumuman menggunakan editor di bawah
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div
              className={`rounded-xl border overflow-hidden ${
                errors.content ? "border-red-400" : "border-slate-200"
              }`}
            >
              <ForwardRefEditor
                ref={editorRef}
                markdown={announcement?.content ?? ""}
                onChange={handleEditorChange}
                className="min-h-[300px]"
                contentEditableClassName="prose prose-slate max-w-none px-4 py-3 min-h-[280px] focus:outline-none text-sm"
              />
            </div>
            {errors.content && (
              <p className="text-xs text-red-500 mt-1.5">
                {errors.content.message}
              </p>
            )}
          </CardContent>
        </Card>

        {/* ── Actions ── */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <BackButton />
          <Button
            type="submit"
            disabled={isPending}
            className="bg-blue-800 hover:bg-blue-900 text-white px-6 gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {mode === "create" ? "Buat Pengumuman" : "Simpan Perubahan"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
