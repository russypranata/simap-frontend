export type MutationType = 'in' | 'out';
export type MutationStatus = 'approved' | 'pending' | 'rejected';

export interface StudentMutation {
    id: string;
    studentName: string;
    nisn: string;
    type: MutationType;
    reason: string;
    schoolOrigin?: string; // For type 'in'
    schoolDestination?: string; // For type 'out'
    date: string;
    status: MutationStatus;
}
