'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, FileText } from 'lucide-react';
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Tabel Jurnal Mengajar</span>
        </CardTitle>
        <CardDescription>
          Daftar jurnal mengajar dalam format tabel
        </CardDescription>
      </CardHeader>
      <CardContent>
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
              {filteredJournals.map((journal) => (
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
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(journal)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(journal)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(journal)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};