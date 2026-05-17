import { apiClient } from "@/lib/api-client";
import type {
  DashboardData,
  Extracurricular,
  MemberListResponse,
  AttendanceSession,
  AttendanceDetail,
  CreateAttendancePayload,
  AssessmentData,
  SaveAssessmentPayload,
} from "../types/competitionAdvisor";

export const competitionAdvisorService = {
  // Dashboard
  getDashboard: async (): Promise<DashboardData> => {
    const response = await apiClient.getRaw<{
      success: boolean;
      data: DashboardData;
    }>("/competition-advisor/dashboard");
    return response.data;
  },

  // Extracurriculars (Lomba)
  getExtracurriculars: async (): Promise<Extracurricular[]> => {
    const response = await apiClient.getRaw<{
      success: boolean;
      data: Extracurricular[];
    }>("/competition-advisor/extracurriculars");
    return response.data || [];
  },

  getExtracurricular: async (id: number): Promise<Extracurricular> => {
    const response = await apiClient.getRaw<{
      success: boolean;
      data: Extracurricular;
    }>(`/competition-advisor/extracurriculars/${id}`);
    return response.data;
  },

  // Members
  getMembers: async (
    extracurricularId: number,
    params: {
      page?: number;
      perPage?: number;
      search?: string;
      status?: string;
    } = {},
  ): Promise<MemberListResponse> => {
    const qs = new URLSearchParams();
    if (params.page) qs.set("page", String(params.page));
    if (params.perPage) qs.set("per_page", String(params.perPage ?? 20));
    if (params.search) qs.set("search", params.search);
    if (params.status && params.status !== "all") qs.set("status", params.status);

    const response = await apiClient.getRaw<{
      success: boolean;
      data: MemberListResponse["items"];
      meta: MemberListResponse["meta"];
    }>(`/competition-advisor/extracurriculars/${extracurricularId}/members?${qs.toString()}`);

    return {
      items: response.data || [],
      meta: response.meta,
    };
  },

  addMember: async (
    extracurricularId: number,
    payload: { nis: string; join_date?: string },
  ): Promise<void> => {
    await apiClient.post(`/competition-advisor/extracurriculars/${extracurricularId}/members`, payload);
  },

  deleteMember: async (
    extracurricularId: number,
    studentId: number,
  ): Promise<void> => {
    await apiClient.delete(
      `/competition-advisor/extracurriculars/${extracurricularId}/members/${studentId}`,
    );
  },

  // Attendance
  getAttendanceSessions: async (
    extracurricularId: number,
    params: {
      startDate?: string;
      endDate?: string;
    } = {},
  ): Promise<AttendanceSession[]> => {
    const qs = new URLSearchParams();
    if (params.startDate) qs.set("start_date", params.startDate);
    if (params.endDate) qs.set("end_date", params.endDate);

    const url = `/competition-advisor/extracurriculars/${extracurricularId}/attendance${qs.toString() ? `?${qs.toString()}` : ""}`;
    const response = await apiClient.getRaw<{
      success: boolean;
      data: AttendanceSession[];
    }>(url);
    return response.data || [];
  },

  getAttendanceDetail: async (
    extracurricularId: number,
    sessionId: number,
  ): Promise<AttendanceDetail> => {
    const response = await apiClient.getRaw<{
      success: boolean;
      data: AttendanceDetail;
    }>(`/competition-advisor/extracurriculars/${extracurricularId}/attendance/${sessionId}`);
    return response.data;
  },

  createAttendance: async (
    extracurricularId: number,
    payload: CreateAttendancePayload,
  ): Promise<{ id: number }> => {
    return apiClient.post<{ id: number }>(
      `/competition-advisor/extracurriculars/${extracurricularId}/attendance`,
      payload,
    );
  },

  // Assessments
  getAssessments: async (extracurricularId: number): Promise<AssessmentData> => {
    const response = await apiClient.getRaw<{
      success: boolean;
      data: AssessmentData;
    }>(`/competition-advisor/extracurriculars/${extracurricularId}/assessments`);
    return response.data;
  },

  saveAssessments: async (
    extracurricularId: number,
    payload: SaveAssessmentPayload,
  ): Promise<{ saved: number }> => {
    return apiClient.post<{ saved: number }>(
      `/competition-advisor/extracurriculars/${extracurricularId}/assessments`,
      payload,
    );
  },
};
