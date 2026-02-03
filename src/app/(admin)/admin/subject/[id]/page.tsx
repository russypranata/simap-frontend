'use client';

import { useParams } from 'next/navigation';
import { SubjectDetail } from '@/features/admin/pages/SubjectDetail';

export default function SubjectDetailPage() {
    const params = useParams();
    const id = params.id as string;
    
    return <SubjectDetail id={id} />;
}
