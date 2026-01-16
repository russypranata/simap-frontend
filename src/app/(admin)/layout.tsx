'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/app/context/RoleContext';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { role, isAuthenticated } = useRole();
    const router = useRouter();

    // Role-based auth guard
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/');
        } else if (role !== 'admin') {
            // Redirect to appropriate dashboard based on role
            switch (role) {
                case 'subject_teacher':
                case 'homeroom_teacher':
                case 'picket_teacher':
                case 'headmaster':
                    router.push('/teacher/dashboard'); // Corrected path from /dashboard
                    break;
                case 'student':
                    router.push('/student/dashboard');
                    break;
                case 'parent':
                    router.push('/parent/dashboard');
                    break;
                default:
                    router.push('/');
            }
        }
    }, [isAuthenticated, role, router]);

    // Show nothing while redirecting
    if (!isAuthenticated || role !== 'admin') {
        return null;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">
                Admin Dashboard (Coming Soon)
            </h1>
            {children}
        </div>
    );
}
