'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, FilePen } from 'lucide-react';
import { JournalCard } from '@/features/teacher/components/journal';
import { TeachingJournal } from '@/features/teacher/types/teacher';
import { PaginationControls } from '@/features/shared/components';

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
  journals, searchTerm, filterClass, filterSubject,
  onView, onEdit, onDelete, onCreateNew,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  React.useEffect(() => { setCurrentPage(1); }, [searchTerm, filterClass, filterSubject]);

  const totalPages = Math.ceil(journals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentJournals = journals.slice(startIndex, startIndex + itemsPerPage);

  if (journals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <div className="p-4 bg-muted/50 rounded-full">
          <BookOpen className="h-10 w-10 text-muted-foreground/50" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-lg font-semibold">Belum Ada Jurnal</h3>
          <p className="text-muted-foreground text-sm max-w-md">
            {searchTerm || filterClass !== 'all' || filterSubject !== 'all'
              ? 'Tidak ada jurnal yang sesuai dengan filter yang dipilih.'
              : 'Belum ada jurnal mengajar yang dibuat. Mulai dengan menambahkan jurnal baru.'}
          </p>
        </div>
        <Button className="bg-blue-800 hover:bg-blue-900 text-white" onClick={onCreateNew}>
          <FilePen className="h-4 w-4 mr-2" />
          Tambah Jurnal Baru
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {currentJournals.map((journal) => (
          <JournalCard key={journal.id} journal={journal} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={journals.length}
        startIndex={journals.length === 0 ? 0 : startIndex + 1}
        endIndex={Math.min(startIndex + itemsPerPage, journals.length)}
        itemsPerPage={itemsPerPage}
        itemLabel="jurnal"
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
      />
    </>
  );
};
