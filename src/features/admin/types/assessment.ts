// ─── Types lama (tetap untuk kompatibilitas mock data) ───────────────────────
export interface AssessmentClass {
    id: string;
    className: string;
    subjectName: string;
    teacherName: string;
    totalStudents: number;
    gradedStudents: number;
    status: 'completed' | 'partial' | 'pending';
    lastUpdated: string;
}

export interface ReportCardClass {
    id: string;
    className: string;
    homeroomTeacher: string;
    totalStudents: number;
    generatedReports: number;
    academicYear: string;
    semester: string;
    status: 'ready' | 'processing' | 'pending';
}

// ─── Types baru (API real) ───────────────────────────────────────────────────

export interface AdminClassSubjectProgress {
    id: number;
    class_id: number;
    class_name: string;
    subject_id: number;
    subject_name: string;
    teacher_id: number | null;
    teacher_name: string | null;
    total_students: number;
    graded_students: number;
    total_assessments: number;
    status: 'pending' | 'partial' | 'completed';
}

export interface AdminAssessment {
    id: number;
    title: string;
    type: 'daily' | 'midterm' | 'final' | 'assignment';
    max_score: number;
    weight: number;
    semester_id: number;
    semester_name: string | null;
    total_grades: number;
}

export interface StudentGradeRow {
    student_id: number;
    student_name: string | null;
    admission_number: string | null;
    assessment_id: number;
    score: number | null;
    max_score: number;
}

export interface AssessmentGradeDetail {
    assessment: {
        id: number;
        title: string;
        type: string;
        max_score: number;
        weight: number;
    };
    grades: StudentGradeRow[];
}

export interface CreateAssessmentPayload {
    class_subject_id: number;
    title: string;
    type: 'daily' | 'midterm' | 'final' | 'assignment';
    max_score: number;
    weight: number;
    semester_id: number;
}

export interface ReportCardSummaryItem {
    id: number;
    class_name: string;
    academic_year: string | null;
    homeroom_teacher: string;
    total_students: number;
    students_with_complete_grades: number;
    status: 'pending' | 'processing' | 'ready';
}
