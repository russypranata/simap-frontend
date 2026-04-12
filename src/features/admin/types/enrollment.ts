export interface Enrollment {
    id: number;
    student_id: number;
    student_name?: string;
    class_id: number;
    class_name?: string;
    academic_year_name?: string;
    created_at: string;
    updated_at: string;
}

export interface CreateEnrollmentRequest {
    student_id: number;
    class_id: number;
}

export interface BulkEnrollmentRequest {
    class_id: number;
    student_ids: number[];
}

export interface UnenrolledStudent {
    id: number;
    name: string;
    admission_number: string;
}
