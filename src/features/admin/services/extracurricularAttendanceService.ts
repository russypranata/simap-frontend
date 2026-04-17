import { apiClient } from '@/lib/api-client';
import { ExtracurricularSession, SessionMemberAttendance } from '../types/extracurricular';

export const extracurricularAttendanceService = {
    /**
     * Get all attendance sessions for a given extracurricular (by id).
     * Maps to GET /admin/extracurriculars/{id}/attendance
     */
    getSessions: (extracurricularId: string | number): Promise<ExtracurricularSession[]> =>
        apiClient.get<ExtracurricularSession[]>(
            `/admin/extracurriculars/${extracurricularId}/attendance`
        ),

    /**
     * Get attendance detail for a specific session.
     * Maps to GET /admin/extracurriculars/attendance/{sessionId}
     */
    getSessionDetail: (
        sessionId: number
    ): Promise<{ session: ExtracurricularSession; attendance: SessionMemberAttendance[] }> =>
        apiClient.get(
            `/admin/extracurriculars/attendance/${sessionId}`
        ),
};

export default extracurricularAttendanceService;
