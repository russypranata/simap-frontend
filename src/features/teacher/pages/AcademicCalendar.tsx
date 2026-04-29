'use client';

import React from 'react';
import { AcademicCalendarView } from '@/features/shared/components/AcademicCalendarView';

export const AcademicCalendar: React.FC = () => {
    return (
        <AcademicCalendarView
            description="Lihat agenda kegiatan sekolah, jadwal ujian, rapat, dan hari libur akademik."
        />
    );
};

export default AcademicCalendar;
