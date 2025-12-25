'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StudentLayout } from '@/features/student/components/StudentLayout';
import { useRole } from '@/app/context/RoleContext';

export default function StudentRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, isAuthenticated, isLoading } = useRole();
  const router = useRouter();

  // Role-based auth guard
  useEffect(() => {
    // Wait for loading to complete before checking auth
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push('/');
    } else if (role !== 'siswa') {
      // Redirect to appropriate dashboard based on role
      switch (role) {
        case 'guru':
          router.push('/teacher/dashboard');
          break;
        case 'admin':
          router.push('/admin/dashboard');
          break;
        case 'orang_tua':
          router.push('/parent/dashboard');
          break;
        case 'pembina_ekskul':
          router.push('/extracurricular-advisor/dashboard');
          break;
        case 'pj_mutamayizin':
          router.push('/mutamayizin-coordinator/dashboard');
          break;
        default:
          router.push('/');
      }
    }
  }, [isAuthenticated, role, router, isLoading]);

  // Show nothing while initializing or redirecting
  if (isLoading || !isAuthenticated || role !== 'siswa') {
    return null;
  }

  return <StudentLayout>{children}</StudentLayout>;
}
