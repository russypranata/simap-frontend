'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, BookOpen, Grid, List as ListIcon, X, SlidersHorizontal } from 'lucide-react';
import { TeacherClass } from '@/features/teacher/types/teacher';
import { JournalListFilterDialog, QuickDateFilter } from './JournalListFilterDialog';

interface JournalFilterSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterClass: string;
  filterSubject: string;
  activeDateFilter: QuickDateFilter;
  classes: TeacherClass[];
  subjects: string[];
  filteredCount: number;
  viewType: string;
  onViewTypeChange: (type: string) => void;
  onApplyFilter: (filterClass: string, filterSubject: string, dateFilter: QuickDateFilter) => void;
  onResetFilter: () => void;
  children: React.ReactNode;
}

const DATE_LABEL: Record<string, string> = {
  today: 'Hari Ini',
  week: 'Minggu Ini',
  month: 'Bulan Ini',
};

export const JournalFilterSection: React.FC<JournalFilterSectionProps> = ({
  searchTerm, setSearchTerm,
  filterClass, filterSubject, activeDateFilter,
  classes, subjects,
  filteredCount,
  viewType, onViewTypeChange,
  onApplyFilter, onResetFilter,
  children,
}) => {
  const activeCount = [
    filterClass !== 'all',
    filterSubject !== 'all',
    activeDateFilter !== null,
  ].filter(Boolean).length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-lg font-semibold">Daftar Jurnal</CardTitle>
              <CardDescription>Cari dan filter jurnal mengajar</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-semibold px-2.5 py-1 text-xs border-0">
              {filteredCount} jurnal
            </Badge>
            <Tabs value={viewType} onValueChange={onViewTypeChange}>
              <TabsList className="inline-flex h-auto items-center justify-center rounded-full bg-muted/50 p-1.5 gap-1">
                <TabsTrigger value="card" className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 h-8 text-sm font-medium transition-all data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=inactive]:text-muted-foreground">
                  <Grid className="h-4 w-4 mr-1.5" />
                  Kartu
                </TabsTrigger>
                <TabsTrigger value="table" className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 h-8 text-sm font-medium transition-all data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=inactive]:text-muted-foreground">
                  <ListIcon className="h-4 w-4 mr-1.5" />
                  Tabel
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari mata pelajaran, materi, atau topik..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <JournalListFilterDialog
            filterClass={filterClass}
            filterSubject={filterSubject}
            activeDateFilter={activeDateFilter}
            classes={classes}
            subjects={subjects}
            activeCount={activeCount}
            onApply={onApplyFilter}
            onReset={onResetFilter}
          />
        </div>

        {activeCount > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              <SlidersHorizontal className="h-3 w-3" />
              <span>Filter Aktif:</span>
            </div>
            {filterClass !== 'all' && (
              <Badge variant="secondary" className="gap-2 bg-blue-800 text-white border-none px-3 py-1 rounded-lg text-xs font-medium">
                {filterClass}
                <button onClick={() => onApplyFilter('all', filterSubject, activeDateFilter)} className="inline-flex items-center justify-center h-4 w-4 hover:text-white/70 transition-colors -mr-1">
                  <X className="h-3.5 w-3.5" />
                </button>
              </Badge>
            )}
            {filterSubject !== 'all' && (
              <Badge variant="secondary" className="gap-2 bg-blue-800 text-white border-none px-3 py-1 rounded-lg text-xs font-medium">
                {filterSubject}
                <button onClick={() => onApplyFilter(filterClass, 'all', activeDateFilter)} className="inline-flex items-center justify-center h-4 w-4 hover:text-white/70 transition-colors -mr-1">
                  <X className="h-3.5 w-3.5" />
                </button>
              </Badge>
            )}
            {activeDateFilter && (
              <Badge variant="secondary" className="gap-2 bg-blue-800 text-white border-none px-3 py-1 rounded-lg text-xs font-medium">
                {DATE_LABEL[activeDateFilter]}
                <button onClick={() => onApplyFilter(filterClass, filterSubject, null)} className="inline-flex items-center justify-center h-4 w-4 hover:text-white/70 transition-colors -mr-1">
                  <X className="h-3.5 w-3.5" />
                </button>
              </Badge>
            )}
          </div>
        )}

        {children}
      </CardContent>
    </Card>
  );
};
