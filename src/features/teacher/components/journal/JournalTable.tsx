'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { TeachingJournal } from '@/features/teacher/types/teacher';
import { formatDate } from '@/features/shared/utils/dateFormatter';

interface JournalTableProps {
  journals: TeachingJournal[];
  searchTerm: string;
  filterClass: string;
  filterSubject: string;
  onView: (journal: TeachingJournal) => void;
  onEdit: (journal: TeachingJournal) => void;
  onDelete: (journal: TeachingJournal) => void;
}

export const JournalTable: React.FC<JournalTableProps> = ({
  journals,
  searchTerm,
  filterClass,
  filterSubject,
  onView,
  onEdit,
  onDelete,
}) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate pagination values
  // Note: journals are already filtered by the parent component
  const totalPages = Math.ceil(journals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJournals = journals.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterClass, filterSubject, journals.length]);

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
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= Math.min(maxVisiblePages, totalPages); i++) {
          pages.push(i);
        }
        if (totalPages > maxVisiblePages) {
          pages.push('ellipsis');
          pages.push(totalPages);
        }
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - maxVisiblePages + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
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
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Tabel Jurnal Mengajar
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Daftar jurnal mengajar dalam format tabel
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium text-sm">Tanggal</th>
                  <th className="text-left p-4 font-medium text-sm">Kelas</th>
                  <th className="text-left p-4 font-medium text-sm">Mata Pelajaran</th>
                  <th className="text-left p-4 font-medium text-sm">Materi</th>
                  <th className="text-left p-4 font-medium text-sm">Topik</th>
                  <th className="text-left p-4 font-medium text-sm">Kehadiran</th>
                  <th className="text-left p-4 font-medium text-sm">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentJournals.length > 0 ? (
                  currentJournals.map((journal) => (
                    <tr key={journal.id} className="border-b hover:bg-muted/30">
                      <td className="p-4 text-sm">{formatDate(journal.date, 'dd MMM yyyy')}</td>
                      <td className="p-4 text-sm">{journal.class}</td>
                      <td className="p-4 text-sm">{journal.subject}</td>
                      <td className="p-4 text-sm max-w-xs truncate">{journal.material}</td>
                      <td className="p-4 text-sm max-w-xs truncate">{journal.topic}</td>
                      <td className="p-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs">{journal.attendance.present}/{journal.attendance.total}</span>
                          <Badge variant="outline" className="text-xs">
                            {((journal.attendance.present / journal.attendance.total) * 100).toFixed(0)}%
                          </Badge>
                        </div>
                      </td>
                      <td className="p-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            onClick={() => onView(journal)}
                            className="h-8 w-8 p-0 bg-green-500 hover:bg-green-600 text-white border-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => onEdit(journal)}
                            className="h-8 w-8 p-0 bg-blue-500 hover:bg-blue-600 text-white border-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => onDelete(journal)}
                            className="h-8 w-8 p-0 bg-red-500 hover:bg-red-600 text-white border-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      Tidak ada data jurnal yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Menampilkan {startIndex + 1}-{Math.min(endIndex, journals.length)} dari {journals.length} data
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
        </div>
      </CardContent>
    </Card>
  );
};