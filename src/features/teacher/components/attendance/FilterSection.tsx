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
      {/* Schedule Status Indicator */}
      {selectedClass && selectedDate && selectedSubject && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-muted/30 rounded-lg border">
          <div className="flex items-center gap-2 sm:gap-3">
            {isAttendanceMarked ? (
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
            ) : (
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 flex-shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-sm sm:text-base font-medium truncate">
                {isAttendanceMarked ? '✅ Sudah ditandai' : '⏳ Belum ditandai'}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                {selectedClassData?.name} • {selectedSubject} • {formatDate(selectedDate, 'dd MMM yyyy')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {isSaved && (
              <Badge className="bg-green-600 text-white text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                Tersimpan
              </Badge>
            )}
            {!isSaved && hasUnsavedChanges && (
              <Badge variant="outline" className="text-yellow-600 border-yellow-600 text-xs">
                <AlertCircle className="h-3 w-3 mr-1" />
                Belum Tersimpan
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filter Presensi</span>
          </CardTitle>
          <CardDescription>
            Pilih kelas, tanggal, dan mata pelajaran untuk mengelola presensi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="class">Kelas</Label>
              <Select value={selectedClass} onValueChange={(val) => { setSelectedClass(val); onFilterChange(); }}>
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
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => { setSelectedDate(e.target.value); onFilterChange(); }}
                max={formatDate(new Date(), 'yyyy-MM-dd')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Mata Pelajaran</Label>
              <Select value={selectedSubject} onValueChange={(val) => { setSelectedSubject(val); onFilterChange(); }}>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="lessonHour">Jam Pelajaran</Label>
              <Select value={selectedLessonHour} onValueChange={setSelectedLessonHour}>
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
            </div>
          </div>

          {selectedClass && selectedDate && selectedSubject && (
            <div className="mt-4 flex flex-col gap-3 sm:gap-4">
              <div className="text-xs sm:text-sm text-muted-foreground">
                Menampilkan {filteredStudents.length} siswa untuk kelas {selectedClassData?.name} pada {formatDate(selectedDate, 'dd MMM yyyy')}
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={onMarkAllPresent}
                  className="flex items-center gap-2 text-xs sm:text-sm"
                >
                  <CheckSquare className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Tandai Semua Hadir</span>
                  <span className="xs:hidden">Tandai Semua</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onExportData('excel')}
                  className="flex items-center gap-2 text-xs sm:text-sm"
                >
                  <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Export Excel</span>
                  <span className="sm:hidden">Excel</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onExportData('pdf')}
                  className="flex items-center gap-2 text-xs sm:text-sm"
                >
                  <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Export PDF</span>
                  <span className="sm:hidden">PDF</span>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};
