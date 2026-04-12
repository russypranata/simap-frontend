export interface ParentStudentLink {
    id: number;
    parent_profile_id: number;
    parent_name?: string;
    student_profile_id: number;
    student_name?: string;
    relationship: string;
    created_at: string;
    updated_at: string;
}

export interface CreateParentStudentRequest {
    parent_profile_id: number;
    student_profile_id: number;
    relationship: string;
}

export interface UpdateParentStudentRequest {
    parent_profile_id?: number;
    student_profile_id?: number;
    relationship?: string;
}
