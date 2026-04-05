'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/app/context/RoleContext';
import { ParentLayout } from '@/features/parent/components/ParentLayout';
import { AcademicYearProvider } from '@/context/AcademicYearContext';
import { AuthLoadingSkeleton } from '@/features/shared/components';

export default function ParentRouteLayout({ children }: { children: React.ReactNode }) {
  const { role, isAuthenticated, isLoading } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) { router.push('/'); return; }
    if (role !== 'orang_tua') {
      const map: Record<string, string> = {
        guru: '/teacher/dashboard', siswa: '/student/dashboard',
        admin: '/admin/dashboard', tutor_ekskul: '/extracurricular-advisor/dashboard',
        pj_mutamayizin: '/mutamayizin-coordinator/dashboard',
      };
      router.push(map[role!] ?? '/');
    }
  }, [isAuthenticated, role, router, isLoading]);

  if (isLoading) return <AuthLoadingSkeleton />;
  if (!isAuthenticated || role !== 'orang_tua') return null;

  return (
    <AcademicYearProvider>
      <ParentLayout>{children}</ParentLayout>
    </AcademicYearProvider>
  );
}
