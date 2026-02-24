'use client';

import { useParams } from 'next/navigation';
import { SubjectForm } from '@/features/admin/pages/SubjectForm';

export default function EditSubjectPage() {
    const params = useParams();
    const id = params.id as string;
    
    return <SubjectForm id={id} />;
}
