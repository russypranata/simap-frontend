'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { JournalCard } from '@/features/teacher/components/journal';
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
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Show 3 items per page

  // Filter journals
  const filteredJournals = journals.filter(journal => {
    const matchesSearch = journal.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         journal.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         journal.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === 'all' || journal.class === filterClass;
    const matchesSubject = filterSubject === 'all' || journal.subject === filterSubject;
    
    return matchesSearch && matchesClass && matchesSubject;
  });

  // Calculate pagination values
  const totalPages = Math.ceil(filteredJournals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJournals = filteredJournals.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterClass, filterSubject]);

  // Pagination handlers
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate page numbers for pagination controls
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page, current page, and last page with ellipses
      if (currentPage <= 3) {
        // Show first 6 pages
        for (let i = 1; i <= Math.min(maxVisiblePages, totalPages); i++) {
          pages.push(i);
        }
        if (totalPages > maxVisiblePages) {
          pages.push('ellipsis');
          pages.push(totalPages);
        }
      } else if (currentPage >= totalPages - 2) {
        // Show last 6 pages
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - maxVisiblePages + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show current page with surrounding pages
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <>
      {filteredJournals.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentJournals.map((journal) => (
              <JournalCard
                key={journal.id}
                journal={journal}
                onView={onView}
                onEdit={onEdit} // Directly use the onEdit prop
                onDelete={onDelete}
              />
            ))}
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Menampilkan {startIndex + 1}-{Math.min(endIndex, filteredJournals.length)} dari {filteredJournals.length} jurnal
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="flex items-center"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="ml-1">Sebelumnya</span>
                </Button>
                
                <div className="flex items-center space-x-1">
                  {getPageNumbers().map((page, index) => (
                    page === 'ellipsis' ? (
                      <span key={`ellipsis-${index}`} className="px-2 py-1 text-muted-foreground">...</span>
                    ) : (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(page as number)}
                        className="w-9 h-9"
                      >
                        {page}
                      </Button>
                    )
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center"
                >
                  <span className="mr-1">Berikutnya</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Belum Ada Jurnal
            </h3>
            <p className="text-muted-foreground text-center max-w-md mb-4">
              {searchTerm || filterClass !== 'all' || filterSubject !== 'all'
                ? 'Tidak ada jurnal yang sesuai dengan filter yang dipilih.'
                : 'Belum ada jurnal mengajar yang dibuat. Mulai dengan menambahkan jurnal baru.'}
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