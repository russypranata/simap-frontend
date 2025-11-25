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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Total Siswa Card */}
      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
        <CardHeader className="relative pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground pr-12">Total Siswa</CardTitle>
          <div className="absolute top-4 right-4 p-2 rounded-lg bg-blue-50">
            <Users className="h-4 w-4 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Siswa terdaftar di {selectedClassName || 'semua kelas'}
          </p>
        </CardContent>
      </Card>

      {/* Total Data Card */}
      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
        <CardHeader className="relative pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground pr-12">Total Data</CardTitle>
          <div className="absolute top-4 right-4 p-2 rounded-lg bg-purple-50">
            <FileText className="h-4 w-4 text-purple-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{stats.totalRecords || 0}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Data dari {sessionCount} pertemuan KBM
          </p>
        </CardContent>
      </Card>

      {/* Hadir Card */}
      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
        <CardHeader className="relative pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground pr-12">Hadir</CardTitle>
          <div className="absolute top-4 right-4 p-2 rounded-lg bg-emerald-50">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600">{stats.hadir}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Tingkat kehadiran {calculatePercentage(stats.hadir)}%
          </p>
        </CardContent>
      </Card>

      {/* Sakit Card */}
      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
        <CardHeader className="relative pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground pr-12">Sakit</CardTitle>
          <div className="absolute top-4 right-4 p-2 rounded-lg bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{stats.sakit}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Persentase sakit {calculatePercentage(stats.sakit)}%
          </p>
        </CardContent>
      </Card>

      {/* Izin Card */}
      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
        <CardHeader className="relative pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground pr-12">Izin</CardTitle>
          <div className="absolute top-4 right-4 p-2 rounded-lg bg-cyan-50">
            <Clock className="h-4 w-4 text-cyan-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-cyan-600">{stats.izin}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Persentase izin {calculatePercentage(stats.izin)}%
          </p>
        </CardContent>
      </Card>

      {/* Alpa Card */}
      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
        <CardHeader className="relative pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground pr-12">Alpa</CardTitle>
          <div className="absolute top-4 right-4 p-2 rounded-lg bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.tanpaKeterangan}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Persentase alpa {calculatePercentage(stats.tanpaKeterangan)}%
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
