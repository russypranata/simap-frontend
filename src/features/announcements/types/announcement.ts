export type TargetRole =
  | 'all'
  | 'admin'
  | 'guru'
  | 'siswa'
  | 'orang_tua'
  | 'tutor_ekskul'
  | 'pj_mutamayizin';

export interface AnnouncementAuthor {
  id: number;
  name: string;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  target_role: TargetRole;
  target_role_label: string;
  is_active: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  author?: AnnouncementAuthor;
  is_read?: boolean;
}

export interface AnnouncementMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface AnnouncementListResponse {
  items: Announcement[];
  meta: AnnouncementMeta;
}

export interface UnreadCountResponse {
  unread_count: number;
}

export interface CreateAnnouncementPayload {
  title: string;
  content: string;
  target_role: TargetRole;
  is_active?: boolean;
  published_at?: string | null;
}

export interface UpdateAnnouncementPayload {
  title?: string;
  content?: string;
  target_role?: TargetRole;
  is_active?: boolean;
  published_at?: string | null;
}
