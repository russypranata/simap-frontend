// Types for Tutor Attendance Recap

export interface TutorAttendance {
    id: number;
    date: string;
    tutorName: string;
    ekstrakurikuler: string;
    startTime: string;
    endTime: string;
    duration: number; // in minutes
    honor?: number;
}

export type ExportFormat = "csv" | "excel" | "pdf";
