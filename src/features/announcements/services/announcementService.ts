import { apiClient } from "@/lib/api-client";
import type {
  AnnouncementListResponse,
  AnnouncementMeta,
  Announcement,
  UnreadCountResponse,
  CreateAnnouncementPayload,
  UpdateAnnouncementPayload,
} from "../types/announcement";

export const announcementService = {
  getAnnouncements: async (
    page = 1,
    perPage = 20,
  ): Promise<AnnouncementListResponse> => {
    const response = await apiClient.getRaw<{
      success: boolean;
      message: string;
      data: Announcement[];
      meta: AnnouncementMeta;
    }>(`/announcements?page=${page}&per_page=${perPage}`);

    return {
      items: response.data || [],
      meta: response.meta,
    };
  },

  getAnnouncement: async (id: number): Promise<Announcement> => {
    const response = await apiClient.getRaw<{
      success: boolean;
      message: string;
      data: Announcement;
    }>(`/announcements/${id}`);
    return response.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient.getRaw<{
      success: boolean;
      message: string;
      data: UnreadCountResponse;
    }>("/announcements/unread-count");
    return response.data.unread_count;
  },

  createAnnouncement: async (
    payload: CreateAnnouncementPayload,
  ): Promise<Announcement> => {
    return apiClient.post<Announcement>("/announcements", payload);
  },

  updateAnnouncement: async (
    id: number,
    payload: UpdateAnnouncementPayload,
  ): Promise<Announcement> => {
    return apiClient.put<Announcement>(`/announcements/${id}`, payload);
  },

  deleteAnnouncement: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/announcements/${id}`);
  },

  adminGetAnnouncements: async (
    params: {
      page?: number;
      perPage?: number;
      search?: string;
      targetRole?: string;
      status?: string;
    } = {},
  ): Promise<AnnouncementListResponse> => {
    const qs = new URLSearchParams();
    if (params.page) qs.set("page", String(params.page));
    if (params.perPage) qs.set("per_page", String(params.perPage ?? 20));
    if (params.search) qs.set("search", params.search);
    if (params.targetRole && params.targetRole !== "all")
      qs.set("target_role", params.targetRole);
    if (params.status && params.status !== "all")
      qs.set("status", params.status);

    const response = await apiClient.getRaw<{
      success: boolean;
      message: string;
      data: Announcement[];
      meta: AnnouncementMeta;
    }>(`/admin/announcements?${qs.toString()}`);

    return {
      items: response.data || [],
      meta: response.meta,
    };
  },
};
