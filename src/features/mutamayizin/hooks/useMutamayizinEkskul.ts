import { useQuery } from "@tanstack/react-query";
import {
    getExtracurriculars,
    getExtracurricularDetail,
    getAttendanceSessions,
    getAttendanceSession,
    getTutorAttendance,
} from "../services/mutamayizinService";
import type {
    ExtracurricularParams,
    AttendanceSessionParams,
    TutorAttendanceParams,
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
