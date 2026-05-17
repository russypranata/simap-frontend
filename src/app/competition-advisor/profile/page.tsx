'use client';

import { useRouter } from 'next/navigation';

export default function CompetitionAdvisorProfilePage() {
  const router = useRouter();
  // Redirect ke halaman profil umum atau tampilkan pesan
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h2 className="text-xl font-semibold text-slate-800 mb-2">Profil Pembimbing Lomba</h2>
      <p className="text-sm text-slate-500 mb-4">Fitur profil akan segera hadir</p>
      <button
        onClick={() => router.push('/competition-advisor/dashboard')}
        className="text-primary hover:underline text-sm"
      >
        Kembali ke Dashboard
      </button>
    </div>
  );
}
