import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { competitionAdvisorService } from "../services/competitionAdvisorService";
import type {
  CreateAttendancePayload,
  SaveAssessmentPayload,
} from "../types/competitionAdvisor";

const ADVISOR_KEY = "competition-advisor";

export function useCompetitionAdvisorDashboard() {
  return useQuery({
    queryKey: [ADVISOR_KEY, "dashboard"],
    queryFn: () => competitionAdvisorService.getDashboard(),
  });
}

export function useCompetitionAdvisorExtracurriculars() {
  return useQuery({
    queryKey: [ADVISOR_KEY, "extracurriculars"],
    queryFn: () => competitionAdvisorService.getExtracurriculars(),
  });
}

export function useCompetitionAdvisorExtracurricular(id: number) {
  return useQuery({
    queryKey: [ADVISOR_KEY, "extracurricular", id],
    queryFn: () => competitionAdvisorService.getExtracurricular(id),
    enabled: !!id,
  });
}

export function useCompetitionAdvisorMembers(
  extracurricularId: number,
  params: {
    page?: number;
    perPage?: number;
    search?: string;
    status?: string;
  } = {},
) {
  return useQuery({
    queryKey: [ADVISOR_KEY, "members", extracurricularId, params],
    queryFn: () => competitionAdvisorService.getMembers(extracurricularId, params),
    enabled: !!extracurricularId,
  });
}

export function useAddCompetitionAdvisorMember(extracurricularId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { nis: string; join_date?: string }) =>
      competitionAdvisorService.addMember(extracurricularId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ADVISOR_KEY, "members", extracurricularId],
      });
      queryClient.invalidateQueries({
        queryKey: [ADVISOR_KEY, "dashboard"],
      });
    },
  });
}

export function useDeleteCompetitionAdvisorMember(extracurricularId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (studentId: number) =>
      competitionAdvisorService.deleteMember(extracurricularId, studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ADVISOR_KEY, "members", extracurricularId],
      });
      queryClient.invalidateQueries({
        queryKey: [ADVISOR_KEY, "dashboard"],
      });
    },
  });
}

export function useCompetitionAdvisorAttendance(
  extracurricularId: number,
  params: {
    startDate?: string;
    endDate?: string;
  } = {},
) {
  return useQuery({
    queryKey: [ADVISOR_KEY, "attendance", extracurricularId, params],
    queryFn: () => competitionAdvisorService.getAttendanceSessions(extracurricularId, params),
    enabled: !!extracurricularId,
  });
}

export function useCompetitionAdvisorAttendanceDetail(
  extracurricularId: number,
  sessionId: number,
) {
  return useQuery({
    queryKey: [ADVISOR_KEY, "attendance-detail", extracurricularId, sessionId],
    queryFn: () =>
      competitionAdvisorService.getAttendanceDetail(extracurricularId, sessionId),
    enabled: !!extracurricularId && !!sessionId,
  });
}

export function useCreateCompetitionAdvisorAttendance(extracurricularId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAttendancePayload) =>
      competitionAdvisorService.createAttendance(extracurricularId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ADVISOR_KEY, "attendance", extracurricularId],
      });
      queryClient.invalidateQueries({
        queryKey: [ADVISOR_KEY, "dashboard"],
      });
    },
  });
}

export function useCompetitionAdvisorAssessments(extracurricularId: number) {
  return useQuery({
    queryKey: [ADVISOR_KEY, "assessments", extracurricularId],
    queryFn: () => competitionAdvisorService.getAssessments(extracurricularId),
    enabled: !!extracurricularId,
  });
}

export function useSaveCompetitionAdvisorAssessments(extracurricularId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SaveAssessmentPayload) =>
      competitionAdvisorService.saveAssessments(extracurricularId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ADVISOR_KEY, "assessments", extracurricularId],
      });
    },
  });
}
