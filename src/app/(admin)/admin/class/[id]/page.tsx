import { ClassDetail } from '@/features/admin/pages/ClassDetail';

export default async function ClassDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <ClassDetail id={id} />;
}
