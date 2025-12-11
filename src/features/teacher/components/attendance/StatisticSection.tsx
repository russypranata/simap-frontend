'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  BarChart3,
  Calendar,
  Users,
  BookOpen,
} from 'lucide-react';
import { LowAttendanceList } from './LowAttendanceList';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

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
    name: string;
    fullName?: string;
    percentage: number;
    percentageSakit: number;
    percentageIzin: number;
    percentageAlpha: number;
    total: number;
    hadir: number;
    sakit: number;
    izin: number;
    tanpaKeterangan: number;
  }>;

  selectedClassName?: string;
  selectedSubjectName?: string;
  attendanceRecords: any[];
  filteredStudents: any[];
  academicYear?: string;
  semester?: string;
}

export const StatisticSection: React.FC<StatisticSectionProps> = ({
  stats,
  attendanceTrend = [],
  selectedClassName,
  selectedSubjectName,
  attendanceRecords,
  filteredStudents,
  academicYear,
  semester,
}) => {
  // Chart Series Toggles
  const [showPresent, setShowPresent] = useState(true);
  const [showSick, setShowSick] = useState(true);
  const [showPermit, setShowPermit] = useState(true);
  const [showAlpha, setShowAlpha] = useState(true);

  const FilterBadges = () => (
    <div className="flex flex-wrap gap-2 mt-3">
      {academicYear && (
        <Badge variant="outline" className="text-xs font-normal gap-1.5 px-2.5 py-0.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
          <Calendar className="h-3 w-3" />
          {academicYear}
        </Badge>
      )}
      {semester ? (
        <Badge variant="outline" className="text-xs font-normal gap-1.5 px-2.5 py-0.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
          <Calendar className="h-3 w-3" />
          {semester}
        </Badge>
      ) : (
        <Badge variant="outline" className="text-xs font-normal gap-1.5 px-2.5 py-0.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
          <Calendar className="h-3 w-3" />
          Satu Tahun Ajaran
        </Badge>
      )}
      {selectedClassName ? (
        <Badge variant="outline" className="text-xs font-normal gap-1.5 px-2.5 py-0.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
          <Users className="h-3 w-3" />
          {selectedClassName}
        </Badge>
      ) : (
        <Badge variant="outline" className="text-xs font-normal gap-1.5 px-2.5 py-0.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
          <Users className="h-3 w-3" />
          Semua Kelas
        </Badge>
      )}
      {selectedSubjectName ? (
        <Badge variant="outline" className="text-xs font-normal gap-1.5 px-2.5 py-0.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
          <BookOpen className="h-3 w-3" />
          {selectedSubjectName}
        </Badge>
      ) : (
        <Badge variant="outline" className="text-xs font-normal gap-1.5 px-2.5 py-0.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
          <BookOpen className="h-3 w-3" />
          Semua Mata Pelajaran
        </Badge>
      )}
    </div>
  );

  // Calculate dynamic width for scrollable chart
  const minChartWidth = attendanceTrend.length > 6 ? attendanceTrend.length * 60 : '100%';

  return (
    <div className="space-y-6">
      {/* Unified Analysis Chart */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Analisis Tren Kehadiran Bulanan
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Grafik persentase kehadiran, sakit, izin, dan alpha setiap bulan
                </CardDescription>
                <FilterBadges />
              </div>
            </div>

            {/* Series Toggles */}
            <div className="flex flex-wrap items-center gap-4 p-2 bg-muted/30 rounded-lg border border-border/50">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="showPresent"
                  checked={showPresent}
                  onCheckedChange={(c) => setShowPresent(!!c)}
                  className="data-[state=checked]:bg-white data-[state=checked]:text-green-600 data-[state=checked]:border-green-600"
                />
                <Label htmlFor="showPresent" className="text-sm font-medium text-green-600 cursor-pointer">Hadir</Label>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="showSick"
                  checked={showSick}
                  onCheckedChange={(c) => setShowSick(!!c)}
                  className="data-[state=checked]:bg-white data-[state=checked]:text-amber-600 data-[state=checked]:border-amber-600"
                />
                <Label htmlFor="showSick" className="text-sm font-medium text-amber-600 cursor-pointer">Sakit</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="showPermit"
                  checked={showPermit}
                  onCheckedChange={(c) => setShowPermit(!!c)}
                  className="data-[state=checked]:bg-white data-[state=checked]:text-blue-600 data-[state=checked]:border-blue-600"
                />
                <Label htmlFor="showPermit" className="text-sm font-medium text-blue-600 cursor-pointer">Izin</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="showAlpha"
                  checked={showAlpha}
                  onCheckedChange={(c) => setShowAlpha(!!c)}
                  className="data-[state=checked]:bg-white data-[state=checked]:text-red-600 data-[state=checked]:border-red-600"
                />
                <Label htmlFor="showAlpha" className="text-sm font-medium text-red-600 cursor-pointer">Alpha</Label>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <style>{`
            .recharts-wrapper,
            .recharts-surface,
            .recharts-layer {
              outline: none !important;
            }
            .recharts-wrapper:focus,
            .recharts-wrapper:focus-visible {
              outline: none !important;
            }
            /* Target any SVG elements inside */
            svg:focus {
              outline: none !important;
            }
          `}</style>
          <div className="w-full overflow-x-auto pb-4">
            <div className="h-[350px] outline-none focus:outline-none" style={{ minWidth: typeof minChartWidth === 'number' ? `${minChartWidth}px` : minChartWidth }}>
              {attendanceTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%" className="outline-none focus:outline-none">
                  <ComposedChart
                    data={attendanceTrend}
                    margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                    className="outline-none focus:outline-none"
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      dy={10}
                      interval={0}
                    />
                    <YAxis
                      width={40}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      domain={[0, 100]}
                      unit="%"
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      cursor={{ fill: '#f3f4f6' }}
                      labelFormatter={(label, payload) => {
                        if (payload && payload.length > 0) {
                          return payload[0].payload.fullName || label;
                        }
                        return label;
                      }}
                      formatter={(value: number, name: string, props: any) => {
                        const data = props.payload;
                        let count = 0;
                        if (name === 'Hadir (%)') count = data.hadir;
                        else if (name === 'Sakit (%)') count = data.sakit;
                        else if (name === 'Izin (%)') count = data.izin;
                        else if (name === 'Alpha (%)') count = data.tanpaKeterangan;

                        return [`${value}% (${count} Siswa)`, name.replace(' (%)', '')];
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />

                    {/* Absence Lines - All on same axis */}
                    {showSick && (
                      <Line
                        type="monotone"
                        dataKey="percentageSakit"
                        name="Sakit (%)"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        dot={{ r: 3, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 5, fill: '#f59e0b', strokeWidth: 0 }}
                      />
                    )}
                    {showPermit && (
                      <Line
                        type="monotone"
                        dataKey="percentageIzin"
                        name="Izin (%)"
                        stroke="#2563eb"
                        strokeWidth={2}
                        dot={{ r: 3, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 5, fill: '#2563eb', strokeWidth: 0 }}
                      />
                    )}
                    {showAlpha && (
                      <Line
                        type="monotone"
                        dataKey="percentageAlpha"
                        name="Alpha (%)"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={{ r: 3, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 5, fill: '#ef4444', strokeWidth: 0 }}
                      />
                    )}

                    {/* Presence Line */}
                    {showPresent && (
                      <Line
                        type="monotone"
                        dataKey="percentage"
                        name="Hadir (%)"
                        stroke="#22c55e"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#22c55e', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6, fill: '#22c55e', strokeWidth: 0 }}
                      />
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-2">
                  <div className="p-3 bg-muted rounded-full">
                    <BarChart3 className="h-6 w-6 opacity-50" />
                  </div>
                  <p className="text-sm font-medium">Belum ada data statistik</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Low Attendance List (Full Width) */}
      <LowAttendanceList
        attendanceRecords={attendanceRecords}
        filteredStudents={filteredStudents}
        threshold={80}
        selectedClassName={selectedClassName}
        selectedSubjectName={selectedSubjectName}
        academicYear={academicYear}
        semester={semester}
      />
    </div>
  );
};
