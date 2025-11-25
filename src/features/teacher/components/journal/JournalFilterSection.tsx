'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Download, FileText, Plus } from 'lucide-react';
import { TeacherClass } from '@/features/teacher/types/teacher';

interface JournalFilterSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterClass: string;
  setFilterClass: (cls: string) => void;
  filterSubject: string;
  setFilterSubject: (subject: string) => void;
  classes: TeacherClass[];
  subjects: string[];
  onExportData: (format: 'excel' | 'pdf' | 'csv') => void;
  onCreateNew: () => void;
  totalJournals: number;
  filteredCount: number;
}

export const JournalFilterSection: React.FC<JournalFilterSectionProps> = ({
  searchTerm,
  setSearchTerm,
  filterClass,
  setFilterClass,
  filterSubject,
  setFilterSubject,
  classes,
  subjects,
  onExportData,
  onCreateNew,
  totalJournals,
  filteredCount,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari berdasarkan mata pelajaran, materi, atau topik..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={filterClass} onValueChange={setFilterClass}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter kelas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kelas</SelectItem>
              {classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.name}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filterSubject} onValueChange={setFilterSubject}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter mata pelajaran" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Mata Pelajaran</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          Menampilkan {filteredCount} dari {totalJournals} jurnal
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onExportData('excel')}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Ekspor Excel</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onExportData('pdf')}
            className="flex items-center space-x-2"
          >
            <FileText className="h-4 w-4" />
            <span>Ekspor PDF</span>
          </Button>
          <Button
            className="flex items-center space-x-2"
            onClick={onCreateNew}
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Jurnal</span>
          </Button>
        </div>
      </div>
    </div>
  );
};