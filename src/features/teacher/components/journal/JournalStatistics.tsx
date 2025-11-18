'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, BookOpen, CheckCircle, TrendingUp } from 'lucide-react';
import { TeachingJournal } from '@/features/teacher/types/teacher';

interface JournalStatisticsProps {
  journals: TeachingJournal[];
  subjects: string[];
  filterClass: string;
  filterSubject: string;
  searchTerm: string;
}

export const JournalStatistics: React.FC<JournalStatisticsProps> = ({
  journals,
  subjects,
  filterClass,
  filterSubject,
  searchTerm,
}) => {
  // Filter journals
  const filteredJournals = journals.filter(journal => {
    const matchesSearch = journal.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         journal.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         journal.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === 'all' || journal.class === filterClass;
    const matchesSubject = filterSubject === 'all' || journal.subject === filterSubject;
    
    return matchesSearch && matchesClass && matchesSubject;
  });

  // Get statistics
  const getJournalStats = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const thisMonthJournals = filteredJournals.filter(journal => {
      const journalDate = new Date(journal.date);
      return journalDate.getMonth() === currentMonth && journalDate.getFullYear() === currentYear;
    });

    const totalAttendance = thisMonthJournals.reduce((sum, journal) => sum + journal.attendance.total, 0);
    const totalPresent = thisMonthJournals.reduce((sum, journal) => sum + journal.attendance.present, 0);

    return {
      totalJournals: thisMonthJournals.length,
      totalAttendance,
      totalPresent,
      attendanceRate: totalAttendance > 0 ? ((totalPresent / totalAttendance) * 100).toFixed(1) : '0',
    };
  };

  const stats = getJournalStats();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Journal Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Statistik Jurnal</span>
          </CardTitle>
          <CardDescription>
            Ringkasan jurnal mengajar bulan ini
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center p-6 bg-muted/30 rounded-lg">
              <div className="text-4xl font-bold text-primary mb-2">
                {stats.totalJournals}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Jurnal Bulan Ini
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">Siswa Hadir</span>
                </div>
                <div className="text-2xl font-bold text-green-600 mt-1">
                  {stats.totalPresent}
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium">Tingkat Kehadiran</span>
                </div>
                <div className="text-2xl font-bold text-blue-600 mt-1">
                  {stats.attendanceRate}%
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subject Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>Distribusi Mata Pelajaran</span>
          </CardTitle>
          <CardDescription>
            Jumlah jurnal per mata pelajaran
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {subjects.slice(0, 5).map((subject) => {
              const count = filteredJournals.filter(j => j.subject === subject).length;
              const percentage = filteredJournals.length > 0 ? (count / filteredJournals.length) * 100 : 0;
              
              return (
                <div key={subject} className="flex items-center space-x-4">
                  <div className="w-24 text-sm font-medium truncate">{subject}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};