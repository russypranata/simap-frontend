import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getExtracurriculars,
    getExtracurricularDetail,
    getAttendanceSessions,
    getAttendanceSession,
    getTutorAttendance,
    getMembers,
    getMember,
    createMember,
    updateMember,
    deleteMember,
} from "../services/mutamayizinService";
import type {
    ExtracurricularParams,
    AttendanceSessionParams,
    TutorAttendanceParams,
    MemberParams,
} from "../services/mutamayizinService";

export const useMutamayizinExtracurriculars = (params?: ExtracurricularParams) => {
    return useQuery({
        queryKey: ["mutamayizin-extracurriculars", params],
        queryFn: () => getExtracurriculars(params),
        staleTime: 5 * 60 * 1000,
    });
};

export const useMutamayizinExtracurricularDetail = (tutorId: number) => {
    return useQuery({
        queryKey: ["mutamayizin-extracurricular", tutorId],
        queryFn: () => getExtracurricularDetail(tutorId),
        enabled: !!tutorId,
    });
};

export const useMutamayizinAttendanceSessions = (
    tutorId: number,
    params?: AttendanceSessionParams
) => {
    return useQuery({
        queryKey: ["mutamayizin-attendance", tutorId, params],
        queryFn: () => getAttendanceSessions(tutorId, params),
        enabled: !!tutorId,
    });
};

export const useMutamayizinAttendanceSession = (tutorId: number, sessionId: number) => {
    return useQuery({
        queryKey: ["mutamayizin-attendance-detail", tutorId, sessionId],
        queryFn: () => getAttendanceSession(tutorId, sessionId),
        enabled: !!tutorId && !!sessionId,
    });
};

export const useMutamayizinTutorAttendance = (params?: TutorAttendanceParams) => {
    return useQuery({
        queryKey: ["mutamayizin-tutor-attendance", params],
        queryFn: () => getTutorAttendance(params),
    });
};

export const useMutamayizinMembers = (params?: MemberParams) => {
    return useQuery({
        queryKey: ["mutamayizin-members", params],
        queryFn: () => getMembers(params),
    });
};

export const useMutamayizinMember = (id: number) => {
    return useQuery({
        queryKey: ["mutamayizin-member", id],
        queryFn: () => getMember(id),
        enabled: !!id,
    });
};

export const useCreateMember = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createMember,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mutamayizin-members"] });
        },
    });
};

export const useUpdateMember = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Parameters<typeof updateMember>[1] }) =>
            updateMember(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mutamayizin-members"] });
        },
    });
};

export const useDeleteMember = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteMember,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mutamayizin-members"] });
        },
    });
};
