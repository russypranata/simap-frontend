'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  BarChart3,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface StatisticSectionProps {
  stats: {
    total: number;
    totalRecords: number;
    hadir: number;
    sakit: number;
    izin: number;
    tanpaKeterangan: number;
    percentage: string;
  };
  attendanceTrend: Array<{
    date: string;
    hadir: number;
    total: number;
    dateStr: string;
  }>;
  previousDayChange: {
    value: string;
    isUp: boolean;
  } | null;
}

export const StatisticSection: React.FC<StatisticSectionProps> = ({
  stats,
  attendanceTrend,
  previousDayChange,
}) => {
  return (
    <>
      {/* Pie Chart Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChart className="h-5 w-5" />
            <span>Distribusi Kehadiran</span>
          </CardTitle>
          <CardDescription>
            Proporsi kehadiran vs ketidakhadiran semester ini
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-48 h-48">
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="32"
                    strokeDasharray={`${(stats.hadir / stats.totalRecords) * 502.4} 502.4`}
                    transform="rotate(-90 96 96)"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="32"
                    strokeDasharray={`${((stats.totalRecords - stats.hadir) / stats.totalRecords) * 502.4} 502.4`}
                    strokeDashoffset={`-${(stats.hadir / stats.totalRecords) * 502.4}`}
                    transform="rotate(-90 96 96)"
                  />
                </svg>
                <div className="absolute">
                  <div className="text-3xl font-bold">{stats.percentage}%</div>
                  <div className="text-xs text-muted-foreground">Hadir</div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Hadir: {stats.hadir}</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Tidak Hadir: {stats.totalRecords - stats.hadir}</span>
                </div>
              </div>
              {previousDayChange && (
                <div className="mt-4 flex items-center justify-center space-x-1 text-sm">
                  {previousDayChange.isUp ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={previousDayChange.isUp ? 'text-green-600' : 'text-red-600'}>
                    {previousDayChange.isUp ? '+' : '-'}{previousDayChange.value}% dari kemarin
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Trend Kehadiran Mingguan</span>
            </CardTitle>
            <CardDescription>
              Persentase kehadiran siswa minggu ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attendanceTrend.map((day, index) => {
                const percentage = (day.hadir / day.total) * 100;
                return (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-16 text-sm font-medium">{day.date}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${percentage >= 90 ? 'bg-green-500' :
                              percentage >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground w-16 text-right">
                      {day.hadir}/{day.total}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Attendance Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Ringkasan Presensi</span>
            </CardTitle>
            <CardDescription>
              Statistik presensi semester ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-6 bg-muted/30 rounded-lg">
                <div className="text-4xl font-bold text-primary mb-2">
                  {stats.percentage}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Tingkat Kehadiran Semester Ini
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium">Hadir</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600 mt-1">
                    {stats.hadir}
                  </div>
                </div>

                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <span className="text-sm font-medium">Tidak Hadir</span>
                  </div>
                  <div className="text-2xl font-bold text-red-600 mt-1">
                    {stats.sakit + stats.izin + stats.tanpaKeterangan}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
