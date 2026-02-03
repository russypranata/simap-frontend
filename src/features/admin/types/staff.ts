export type StaffRole = 'teacher' | 'admin' | 'staff' | 'librarian' | 'security';
export type StaffStatus = 'active' | 'inactive' | 'leave';

export interface Staff {
    id: string;
    nip: string; // Nomor Induk Pegawai
    name: string;
    role: StaffRole;
    subject?: string; // Only for teachers
    phone: string;
    email: string;
    status: StaffStatus;
    joinDate: string;
}
