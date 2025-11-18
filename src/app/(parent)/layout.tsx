'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/app/context/RoleContext';

export default function ParentLayout({
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
    } else if (role !== 'orang_tua') {
      // Redirect to appropriate dashboard based on role
      switch (role) {
        case 'guru':
          router.push('/dashboard');
          break;
        case 'siswa':
          router.push('/student/dashboard');
          break;
        case 'admin':
          router.push('/admin/dashboard');
          break;
        default:
          router.push('/');
      }
    }
  }, [isAuthenticated, role, router]);

  // Show nothing while redirecting
  if (!isAuthenticated || role !== 'orang_tua') {
    return null;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Parent Dashboard (Coming Soon)</h1>
      {children}
    </div>
  );
}
