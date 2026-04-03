'use client';

import React from 'react';
import { Users, CheckCircle, AlertCircle, XCircle, Clock, FileText } from 'lucide-react';
import { StatCard } from '@/features/shared/components';

interface StatsCardsProps {
  stats: {
    total: number;
    totalRecords?: number;
    hadir: number;
    sakit: number;
    izin: number;
    tanpaKeterangan: number;
  };
  selectedClassName?: string;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, selectedClassName }) => {
  const calculatePercentage = (value: number) => {
    const denominator = stats.totalRecords || stats.total;
    return denominator > 0 ? ((value / denominator) * 100).toFixed(1) : '0.0';
  };

  const sessionCount = stats.total > 0 && stats.totalRecords
    ? Math.round(stats.totalRecords / stats.total)
    : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
      <StatCard
        title="Total Siswa"
        value={stats.total}
        subtitle={selectedClassName || 'Semua kelas'}
        icon={Users}
        color="blue"
      />
      <StatCard
        title="Total Data"
        value={stats.totalRecords || 0}
        subtitle={selectedClassName ? `${sessionCount} pertemuan` : `Est. ${sessionCount} pertemuan`}
        icon={FileText}
        color="purple"
      />
      <StatCard
        title="Hadir"
        value={`${calculatePercentage(stats.hadir)}%`}
        subtitle={`${stats.hadir} siswa`}
        icon={CheckCircle}
        color="green"
      />
      <StatCard
        title="Sakit"
        value={`${calculatePercentage(stats.sakit)}%`}
        subtitle={`${stats.sakit} siswa`}
        icon={AlertCircle}
        color="amber"
      />
      <StatCard
        title="Izin"
        value={`${calculatePercentage(stats.izin)}%`}
        subtitle={`${stats.izin} siswa`}
        icon={Clock}
        color="indigo"
      />
      <StatCard
        title="Alpa"
        value={`${calculatePercentage(stats.tanpaKeterangan)}%`}
        subtitle={`${stats.tanpaKeterangan} siswa`}
        icon={XCircle}
        color="red"
      />
    </div>
  );
};
