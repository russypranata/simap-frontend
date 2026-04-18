import { TEACHER_API_URL, getAuthHeaders, handleApiError } from './teacherApiClient';

export interface TeacherGradeAssignment {
    name: string;
    score: number;
    maxScore: number;
}

export interface TeacherGradeRecord {
    id: string;
    studentId: string;
    studentName: string;
    nis: string;
    class: string;
    classId: string;
    subject: string;
    subjectId: string;
    assignments: TeacherGradeAssignment[];
    midTerm: number;
    finalExam: number;
    average: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'E';
    description: string;
}

export interface ClassSubjectOption {
    id: string;
    classId: string;
    className: string;
    subjectId: string;
    subject: string;
}

export interface SaveGradePayload {
    class_subject_id: number;
    semester_id: number;
    assessment_type: 'quiz' | 'exam' | 'assignment' | 'project';
    title: string;
    max_score: number;
    grades: Array<{
        student_id: number;
        score: number;
        remarks?: string;
    }>;
}

export const getTeacherGrades = async (params?: {
    class_id?: string;
    subject_id?: string;
    semester_id?: string;
}): Promise<TeacherGradeRecord[]> => {
    const query = new URLSearchParams();
    if (params?.class_id)   query.set('class_id',   params.class_id);
    if (params?.subject_id) query.set('subject_id',  params.subject_id);
    if (params?.semester_id) query.set('semester_id', params.semester_id);

    const url = `${TEACHER_API_URL}/grades${query.toString() ? '?' + query.toString() : ''}`;
    const response = await fetch(url, { headers: getAuthHeaders() });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();

    return (result.data ?? []).map((g: Record<string, unknown>) => ({
        id:          String(g.id),
        studentId:   String(g.studentId   ?? g.student_id   ?? ''),
        studentName: String(g.studentName ?? g.student_name ?? ''),
        nis:         String(g.nis         ?? ''),
        class:       String(g.class       ?? ''),
        classId:     String(g.classId     ?? g.class_id     ?? ''),
        subject:     String(g.subject     ?? ''),
        subjectId:   String(g.subjectId   ?? g.subject_id   ?? ''),
        assignments: (g.assignments as TeacherGradeAssignment[]) ?? [],
        midTerm:     Number(g.midTerm     ?? g.mid_term     ?? 0),
        finalExam:   Number(g.finalExam   ?? g.final_exam   ?? 0),
        average:     Number(g.average     ?? 0),
        grade:       (g.grade as TeacherGradeRecord['grade']) ?? 'E',
        description: String(g.description ?? ''),
    }));
};

export const saveTeacherGrades = async (payload: SaveGradePayload): Promise<void> => {
    const response = await fetch(`${TEACHER_API_URL}/grades`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
    });
    if (!response.ok) await handleApiError(response);
};

export const getTeacherClassSubjects = async (): Promise<ClassSubjectOption[]> => {
    const response = await fetch(`${TEACHER_API_URL}/grades/class-subjects`, { headers: getAuthHeaders() });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    return (result.data ?? []).map((cs: Record<string, unknown>) => ({
        id:        String(cs.id),
        classId:   String(cs.classId   ?? cs.class_id   ?? ''),
        className: String(cs.className ?? cs.class_name ?? ''),
        subjectId: String(cs.subjectId ?? cs.subject_id ?? ''),
        subject:   String(cs.subject   ?? ''),
    }));
};
