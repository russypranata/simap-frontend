export interface Extracurricular {
  id: number;
  name: string;
  category: string | null;
  description: string | null;
}

export interface DashboardStats {
  totalExtracurriculars: number;
  totalMembers: number;
  totalMeetings: number;
  averageAttendance: number;
}

export interface UpcomingSchedule {
  id: number;
  extracurricularName: string;
  day: string;
  time_start: string;
  time_end: string;
}

export interface RecentActivity {
  id: number;
  type: string;
  title: string;
  date: string;
  topic: string;
  totalMembers: number;
}

export interface DashboardData {
  totalExtracurriculars: number;
  totalMembers: number;
  totalMeetings: number;
  averageAttendance: number;
  upcomingSchedules: UpcomingSchedule[];
  recentActivities: RecentActivity[];
  extracurriculars: Extracurricular[];
}

export interface Member {
  id: number;
  membership_id: number;
  nis: string;
  name: string;
  class: string;
  join_date: string | null;
  attendance: number;
  status: string;
  inactive_date?: string | null;
  inactive_reason?: string | null;
}

export interface MemberListResponse {
  items: Member[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface AttendanceSession {
  id: number;
  date: string;
  topic: string;
  start_time: string;
  end_time: string;
  student_stats: {
    present: number;
    total: number;
    percentage: number;
  };
}

export interface AttendanceRecord {
  id: number;
  nis: string;
  name: string;
  class: string;
  status: string;
  note: string | null;
}

export interface AttendanceDetail {
  id: number;
  date: string;
  topic: string;
  start_time: string;
  end_time: string;
  student_stats: {
    present: number;
    total: number;
    percentage: number;
  };
  students: AttendanceRecord[];
}

export interface CreateAttendancePayload {
  date: string;
  start_time: string;
  end_time: string;
  topic: string;
  students: {
    student_id: number;
    status: 'hadir' | 'izin' | 'sakit' | 'alpa';
    note?: string;
  }[];
}

export interface AssessmentMember {
  membership_id: number;
  student_profile_id: number;
  nis: string;
  name: string;
  class: string;
  scores: Record<string, { id: number; score: number; note: string | null }>;
}

export interface AssessmentData {
  aspects: string[];
  members: AssessmentMember[];
}

export interface SaveAssessmentPayload {
  assessments: {
    membership_id: number;
    aspect: string;
    score: number;
    note?: string;
  }[];
}
