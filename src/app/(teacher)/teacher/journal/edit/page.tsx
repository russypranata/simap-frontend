'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { JournalEditPage } from '@/features/teacher/pages/JournalEditPage';
import { useTeacherData } from '@/features/teacher/hooks/useTeacherData';
import { TeachingJournal } from '@/features/teacher/types/teacher';

export default function EditJournalPage() {
  const searchParams = useSearchParams();
  const journalId = searchParams.get('id');
  
  const { teachingJournals, fetchTeachingJournals } = useTeacherData();
  const [journal, setJournal] = useState<TeachingJournal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!journalId) {
        setLoading(false);
        return;
      }
      
      try {
        // Fetch journals if not already loaded
        if (teachingJournals.length === 0) {
          await fetchTeachingJournals();
        }
        
        // Find the journal by ID
        const foundJournal = teachingJournals.find(j => j.id === journalId);
        setJournal(foundJournal || null);
      } catch (error) {
        console.error('Failed to load journal:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [journalId, teachingJournals, fetchTeachingJournals]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!journal) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <h2 className="text-2xl font-bold">Journal Not Found</h2>
        <p className="text-muted-foreground">The journal you are looking for does not exist or has been deleted.</p>
      </div>
    );
  }

  return <JournalEditPage journal={journal} />;
}