import { EditAdminProfile } from '@/features/admin/pages/EditProfile';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Edit Profil | SIMAP Admin',
    description: 'Perbarui informasi profil administrator SIMAP',
};

export default function AdminEditProfilePage() {
    return <EditAdminProfile />;
}
