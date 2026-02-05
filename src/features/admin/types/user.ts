export type UserRole = 'admin' | 'teacher' | 'student' | 'parent' | 'staff';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface UserAccount {
    id: string;
    username: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    lastLogin: string;
    createdAt: string;
}
