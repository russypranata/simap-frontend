import { AnnouncementForm } from "@/features/announcements/components/AnnouncementForm";

export default function NewAnnouncementPage() {
  return (
    <AnnouncementForm
      mode="create"
      backHref="/admin/announcements"
    />
  );
}
