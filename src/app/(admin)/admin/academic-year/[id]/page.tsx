'use client';

import { useParams } from 'next/navigation';
import { AcademicYearDetail } from '@/features/admin/pages/AcademicYearDetail';

export default function AcademicYearDetailPage() {
    const params = useParams();
    const id = params.id as string;
    
    return <AcademicYearDetail id={id} />;
}
