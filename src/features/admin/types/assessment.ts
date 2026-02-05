export interface AssessmentClass {
    id: string;
    className: string;
    subjectName: string;
    teacherName: string;
    totalStudents: number;
    gradedStudents: number; // How many students have grades input
    status: 'completed' | 'partial' | 'pending';
    lastUpdated: string;
}

export interface ReportCardClass {
    id: string;
    className: string;
    homeroomTeacher: string;
    totalStudents: number;
    generatedReports: number; // How many PDFs generated
    academicYear: string;
    semester: string;
    status: 'ready' | 'processing' | 'pending';
}
