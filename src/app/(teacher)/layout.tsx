'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TeacherLayout } from '@/features/teacher/components/TeacherLayout';
import { useRole } from '@/app/context/RoleContext';
import { AcademicYearProvider } from '@/context/AcademicYearContext';
import { AuthLoadingSkeleton } from '@/features/shared/components';

export default function TeacherRouteLayout({ children }: { children: React.ReactNode }) {
  const { role, isAuthenticated, isLoading } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) { router.push('/'); return; }
    if (role !== 'guru') {
      const map: Record<string, string> = {
        siswa: '/student/dashboard', admin: '/admin/dashboard',
        orang_tua: '/parent/dashboard', tutor_ekskul: '/extracurricular-advisor/dashboard',
        pj_mutamayizin: '/mutamayizin-coordinator/dashboard',
      };
      router.push(map[role!] ?? '/');
    }
  }, [isAuthenticated, role, router, isLoading]);

  if (isLoading) return <AuthLoadingSkeleton />;
  if (!isAuthenticated || role !== 'guru') return null;

  return (
    <AcademicYearProvider>
      <TeacherLayout>{children}</TeacherLayout>
    </AcademicYearProvider>
  );
}
