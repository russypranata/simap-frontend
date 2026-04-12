export interface ClassSubject {
    id: number;
    class_id: number;
    class_name?: string;
    subject_id: number;
    subject_name?: string;
    teacher_id: number;
    teacher_name?: string;
    created_at: string;
    updated_at: string;
}

export interface CreateClassSubjectRequest {
    class_id: number;
    subject_id: number;
    teacher_id: number;
}

export interface UpdateClassSubjectRequest {
    class_id?: number;
    subject_id?: number;
    teacher_id?: number;
}
