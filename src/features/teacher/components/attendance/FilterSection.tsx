'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/features/shared/utils/dateFormatter';
import {
  Filter,
  Download,
  FileText,
  CheckSquare,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

interface FilterSectionProps {
  selectedClass: string;
  setSelectedClass: (value: string) => void;
  selectedDate: string;
  setSelectedDate: (value: string) => void;
  selectedSubject: string;
  setSelectedSubject: (value: string) => void;
  selectedLessonHour: string;
  setSelectedLessonHour: (value: string) => void;
  classes: any[];
  subjects: string[];
  lessonHours: string[];
  filteredStudents: any[];
  selectedClassData: any;
  isAttendanceMarked: boolean;
  isSaved: boolean;
  hasUnsavedChanges: boolean;
  onFilterChange: () => void;
  onMarkAllPresent: () => void;
  onExportData: (format: 'excel' | 'pdf') => void;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  selectedClass,
  setSelectedClass,
  selectedDate,
  setSelectedDate,
  selectedSubject,
  setSelectedSubject,
  selectedLessonHour,
  setSelectedLessonHour,
  classes,
  subjects,
  lessonHours,
  filteredStudents,
  selectedClassData,
  isAttendanceMarked,
  isSaved,
  hasUnsavedChanges,
  onFilterChange,
  onMarkAllPresent,
  onExportData,
}) => {
  return (
    <>
      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <Filter className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-gray-900">
                Filter Presensi
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground font-medium">
                Pilih kelas, tanggal, dan mata pelajaran untuk mengelola presensi
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="class">Kelas</Label>
              <Select
                value={selectedClass || ''}
                onValueChange={(val) => { setSelectedClass(val); onFilterChange(); }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kelas" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name} ({cls.studentCount} siswa)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Tanggal</Label>
              <Input
                key={`date-${selectedDate}`}
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => { setSelectedDate(e.target.value); onFilterChange(); }}
                max={formatDate(new Date(), 'yyyy-MM-dd')}
              />
            </div>

            {/* Show Subject and Lesson Hour ONLY if class is selected AND there are subjects available */}
            {selectedClass && selectedDate && subjects.length > 0 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="subject">Mata Pelajaran</Label>
                  {subjects.length === 1 ? (
                    <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm items-center">
                      {subjects[0]}
                    </div>
                  ) : (
                    <Select
                      key={`subject-${selectedClass}-${selectedDate}`}
                      value={selectedSubject || undefined}
                      onValueChange={(val) => { setSelectedSubject(val); onFilterChange(); }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih mata pelajaran" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lessonHour">Jam Pelajaran</Label>
                  {lessonHours.length === 1 ? (
                    <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm items-center">
                      {lessonHours[0]}
                    </div>
                  ) : lessonHours.length > 1 ? (
                    <Select
                      key={`lesson-${selectedClass}-${selectedDate}-${selectedSubject}`}
                      value={selectedLessonHour || undefined}
                      onValueChange={setSelectedLessonHour}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jam pelajaran" />
                      </SelectTrigger>
                      <SelectContent>
                        {lessonHours.map((hour) => (
                          <SelectItem key={hour} value={hour}>
                            {hour}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground items-center">
                      Tidak ada jam tersedia
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Warning if no subjects found (e.g. Day off) */}
            {selectedClass && selectedDate && subjects.length === 0 && (
              <div className="col-span-1 md:col-span-2 lg:col-span-4 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-center gap-2 text-blue-700 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>
                  Tidak ada jadwal mengajar untuk kelas <strong>{selectedClassData?.name}</strong> pada hari <strong>{new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long' })}</strong>.
                </span>
              </div>
            )}
          </div>

          {/* Warning if no schedule found for selected subject - ONLY show if subjects exist */}
          {selectedClass && selectedDate && selectedSubject && lessonHours.length === 0 && subjects.length > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-center gap-2 text-yellow-700 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>
                Tidak ada jadwal <strong>{selectedSubject}</strong> untuk kelas <strong>{selectedClassData?.name}</strong> pada tanggal ini.
              </span>
            </div>
          )}

          {selectedClass && selectedDate && selectedSubject && selectedLessonHour && (
            <div className="mt-6 pt-6 border-t flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                Menampilkan <strong>{filteredStudents.length}</strong> siswa untuk kelas <strong>{selectedClassData?.name}</strong>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onExportData('excel')}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Excel</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onExportData('pdf')}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  <span>PDF</span>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};
