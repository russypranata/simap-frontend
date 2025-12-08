'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CheckCircle, AlertCircle, XCircle, Clock, FileText } from 'lucide-react';

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Siswa Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="h-4 w-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{stats.total}</div>
          <p className="text-xs text-muted-foreground">
            Siswa terdaftar di {selectedClassName || 'semua kelas'}
          </p>
        </CardContent>
      </Card>

      {/* Total Data Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Data</CardTitle>
          <div className="p-2 bg-purple-100 rounded-lg">
            <FileText className="h-4 w-4 text-purple-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{stats.totalRecords || 0}</div>
          <p className="text-xs text-muted-foreground">
            {selectedClassName
              ? `Data dari ${sessionCount} pertemuan KBM`
              : `Estimasi ${sessionCount} pertemuan per kelas`
            }
          </p>
        </CardContent>
      </Card>

      {/* Hadir Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Hadir</CardTitle>
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{calculatePercentage(stats.hadir)}%</div>
          <p className="text-xs text-muted-foreground">
            {stats.hadir} siswa hadir
          </p>
        </CardContent>
      </Card>

      {/* Sakit Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sakit</CardTitle>
          <div className="p-2 bg-yellow-100 rounded-lg">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{calculatePercentage(stats.sakit)}%</div>
          <p className="text-xs text-muted-foreground">
            {stats.sakit} siswa sakit
          </p>
        </CardContent>
      </Card>

      {/* Izin Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Izin</CardTitle>
          <div className="p-2 bg-blue-100 rounded-lg">
            <Clock className="h-4 w-4 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{calculatePercentage(stats.izin)}%</div>
          <p className="text-xs text-muted-foreground">
            {stats.izin} siswa izin
          </p>
        </CardContent>
      </Card>

      {/* Alpa Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tanpa Keterangan</CardTitle>
          <div className="p-2 bg-red-100 rounded-lg">
            <XCircle className="h-4 w-4 text-red-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{calculatePercentage(stats.tanpaKeterangan)}%</div>
          <p className="text-xs text-muted-foreground">
            {stats.tanpaKeterangan} siswa tanpa keterangan
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
