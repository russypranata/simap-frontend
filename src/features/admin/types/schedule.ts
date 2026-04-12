export interface Schedule {
    id: number;
    class_subject_id: number;
    class_id: number;
    class_name?: string;
    subject_name?: string;
    teacher_name?: string;
    type: string;
    label?: string;
    day_of_week: string;
    start_time: string;
    end_time: string;
    room?: string;
    created_at: string;
    updated_at: string;
}

export interface CreateScheduleRequest {
    class_subject_id: number;
    type: string;
    label?: string;
    day_of_week: string;
    start_time: string;
    end_time: string;
    room?: string;
}

export interface UpdateScheduleRequest {
    class_subject_id?: number;
    type?: string;
    label?: string;
    day_of_week?: string;
    start_time?: string;
    end_time?: string;
    room?: string;
}
