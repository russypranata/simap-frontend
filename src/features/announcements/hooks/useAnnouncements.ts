import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { announcementService } from "../services/announcementService";
import type {
  CreateAnnouncementPayload,
  UpdateAnnouncementPayload,
} from "../types/announcement";

const ANNOUNCEMENT_KEY = "announcements";
const UNREAD_COUNT_KEY = "announcement-unread-count";

export function useAnnouncements(page = 1, perPage = 20) {
  return useQuery({
    queryKey: [ANNOUNCEMENT_KEY, { page, perPage }],
    queryFn: () => announcementService.getAnnouncements(page, perPage),
  });
}

export function useAnnouncement(id: number) {
  return useQuery({
    queryKey: [ANNOUNCEMENT_KEY, id],
    queryFn: () => announcementService.getAnnouncement(id),
    enabled: !!id,
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: [UNREAD_COUNT_KEY],
    queryFn: () => announcementService.getUnreadCount(),
    refetchInterval: 60000,
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAnnouncementPayload) =>
      announcementService.createAnnouncement(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ANNOUNCEMENT_KEY] });
      queryClient.invalidateQueries({ queryKey: [UNREAD_COUNT_KEY] });
    },
  });
}

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateAnnouncementPayload;
    }) => announcementService.updateAnnouncement(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ANNOUNCEMENT_KEY] });
    },
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => announcementService.deleteAnnouncement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ANNOUNCEMENT_KEY] });
      queryClient.invalidateQueries({ queryKey: [UNREAD_COUNT_KEY] });
    },
  });
}

interface AdminAnnouncementFilters {
  page?: number;
  perPage?: number;
  search?: string;
  targetRole?: string;
  status?: string;
}

export function useAdminAnnouncements(filters: AdminAnnouncementFilters = {}) {
  return useQuery({
    queryKey: [ANNOUNCEMENT_KEY, "admin", filters],
    queryFn: () => announcementService.adminGetAnnouncements(filters),
  });
}
