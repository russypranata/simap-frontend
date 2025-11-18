'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Plus } from 'lucide-react';
import { JournalCard } from '@/features/teacher/components/JournalCard';
import { TeachingJournal } from '@/features/teacher/types/teacher';

interface JournalListProps {
  journals: TeachingJournal[];
  searchTerm: string;
  filterClass: string;
  filterSubject: string;
  onView: (journal: TeachingJournal) => void;
  onEdit: (journal: TeachingJournal) => void;
  onDelete: (journal: TeachingJournal) => void;
  onCreateNew: () => void;
  totalJournals: number;
}

export const JournalList: React.FC<JournalListProps> = ({
  journals,
  searchTerm,
  filterClass,
  filterSubject,
  onView,
  onEdit,
  onDelete,
  onCreateNew,
  totalJournals,
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

  return (
    <>
      {filteredJournals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJournals.map((journal) => (
            <JournalCard
              key={journal.id}
              journal={journal}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Belum Ada Jurnal
            </h3>
            <p className="text-muted-foreground text-center max-w-md mb-4">
              {searchTerm || filterClass !== 'all' || filterSubject !== 'all'
                ? 'Tidak ada jurnal yang cocok dengan filter yang dipilih.'
                : 'Belum ada jurnal mengajar yang dibuat. Mulai dengan menambah jurnal baru.'}
            </p>
            <Button className="flex items-center space-x-2" onClick={onCreateNew}>
              <Plus className="h-4 w-4" />
              <span>Tambah Jurnal Baru</span>
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
};