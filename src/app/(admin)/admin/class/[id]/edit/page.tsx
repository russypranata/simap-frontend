import { ClassForm } from '@/features/admin/pages/ClassForm';

export default async function EditClassPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <ClassForm id={id} />;
}
