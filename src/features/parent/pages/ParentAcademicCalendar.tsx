'use client';

import React from 'react';
import { AcademicCalendarView } from '@/features/shared/components/AcademicCalendarView';

export const ParentAcademicCalendar: React.FC = () => {
    return (
        <AcademicCalendarView
            description="Lihat agenda kegiatan sekolah dan hari libur akademik untuk memantau jadwal anak Anda."
        />
    );
};

export default ParentAcademicCalendar;
