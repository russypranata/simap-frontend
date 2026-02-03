'use client';

import { useParams } from 'next/navigation';
import { AcademicYearForm } from '@/features/admin/pages/AcademicYearForm';

export default function EditAcademicYearPage() {
    const params = useParams();
    const id = params.id as string;
    
    return <AcademicYearForm id={id} />;
}
