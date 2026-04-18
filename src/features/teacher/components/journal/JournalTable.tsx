/* eslint-disable react-hooks/set-state-in-effect , @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, FileText, Search } from 'lucide-react';
import { TeachingJournal } from '@/features/teacher/types/teacher';
import { formatDate } from '@/features/shared/utils/dateFormatter';
import { PaginationControls, EmptyState } from '@/features/shared/components';

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
  journals, searchTerm, filterClass, filterSubject,
  onView, onEdit, onDelete,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(journals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentJournals = journals.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, filterClass, filterSubject, journals.length]);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Tanggal</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Kelas</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Mata Pelajaran</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Materi</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Topik</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Kehadiran</th>
                <th className="text-center p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 w-28">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentJournals.length > 0 ? (
                currentJournals.map((journal) => (
                  <tr key={journal.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-sm text-slate-600">{formatDate(journal.date, 'dd MMM yyyy')}</td>
                    <td className="p-4">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-0">{journal.class}</Badge>
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-800">{journal.subject}</td>
                    <td className="p-4 text-sm text-slate-600 max-w-xs truncate">{journal.material}</td>
                    <td className="p-4 text-sm text-slate-600 max-w-xs truncate">{journal.topic}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600">{journal.attendance.present}/{journal.attendance.total}</span>
                        <Badge variant="outline" className={
                          (journal.attendance.present / journal.attendance.total) >= 0.9
                            ? "bg-green-50 text-green-700 border-green-200"
                            : (journal.attendance.present / journal.attendance.total) >= 0.75
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }>
                          {((journal.attendance.present / journal.attendance.total) * 100).toFixed(0)}%
                        </Badge>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button size="sm" variant="ghost" onClick={() => onView(journal)}
                          className="h-8 w-8 p-0 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => onEdit(journal)}
                          className="h-8 w-8 p-0 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => onDelete(journal)}
                          className="h-8 w-8 p-0 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>
                    <EmptyState
                      icon={Search}
                      title="Tidak ada jurnal ditemukan"
                      description="Coba ubah kata kunci pencarian atau filter yang dipilih"
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
    </div>
  );
};
