'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { JournalViewPage } from '@/features/teacher/pages/JournalViewPage';
import { useTeacherData } from '@/features/teacher/hooks/useTeacherData';
import { TeachingJournal } from '@/features/teacher/types/teacher';

export default function ViewJournalPage() {
  const searchParams = useSearchParams();
  const journalId = searchParams.get('id');

  const { teachingJournals, fetchTeachingJournals } = useTeacherData();
  const [journal, setJournal] = useState<TeachingJournal | null>(null);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    const loadData = async () => {
      if (!journalId) {
        setLoading(false);
        return;
      }

      // If we have data, try to find
      if (teachingJournals.length > 0) {
        const foundJournal = teachingJournals.find(j => j.id === journalId);
        setJournal(foundJournal || null);
        setLoading(false);
        return;
      }

      // If no data and haven't fetched yet, fetch
      if (!hasFetched.current) {
        hasFetched.current = true;
        try {
          await fetchTeachingJournals();
          // Don't set loading false here. Wait for dependency update.
        } catch (error) {
          console.error('Failed to load journal:', error);
          setLoading(false);
        }
      } else {
        // We fetched, but still no data.
        setJournal(null);
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

  return <JournalViewPage journal={journal} />;
}