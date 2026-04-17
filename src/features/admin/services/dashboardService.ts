import { apiClient } from '@/lib/api-client';

export interface AdminDashboardStats {
    total_students: number;
    enrolled_this_year: number;
    total_teachers: number;
    total_tutors: number;
    total_classes: number;
    classes_without_homeroom: number;
    morning_rate: number | null;
    morning_hadir: number;
    morning_tidak_hadir: number;
    morning_total_active: number;
    ppdb_pending: number;
    ppdb_total: number;
    mutation_pending: number;
}

export interface PendingAction {
    type: string;
    label: string;
    count: number;
    href: string;
    color: 'amber' | 'blue' | 'red' | 'green';
}

export interface EkskulSummary {
    total_ekskul: number;
    total_members: number;
    avg_rate: number | null;
    sessions_count: number;
}

export interface ClassDistributionItem {
    class: string;
    count: number;
}

export interface AdminDashboardData {
    academic_year: { id: number; name: string; is_active: boolean } | null;
    stats: AdminDashboardStats;
    pending_actions: PendingAction[];
    ekskul_summary: EkskulSummary;
    class_distribution: ClassDistributionItem[];
    avg_students_per_class: number;
}

export const dashboardService = {
    getDashboard: (): Promise<AdminDashboardData> =>
        apiClient.get<AdminDashboardData>('/admin/dashboard'),
};
