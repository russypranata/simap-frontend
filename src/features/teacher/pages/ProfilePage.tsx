'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { ProfileCard } from '../components/profile';
import { useProfileData } from '../hooks/useProfileData';
import { User, Users, GraduationCap, Clock, Home } from 'lucide-react';
import { ProfileSkeleton } from '../components/profile';
import { PageHeader } from '@/features/shared/components';

export const ProfilePage: React.FC = () => {
    const { profileData, isFetching } = useProfileData();
    const router = useRouter();

    if (isFetching || !profileData) {
        return <ProfileSkeleton />;
    }

    const handleEditProfile = () => {
        router.push('/profile/edit');
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Profil"
                titleHighlight="Saya"
                icon={User}
                description="Kelola informasi profil dan pengaturan akun Anda"
            />

            {/* Profile Content */}
            <ProfileCard
                name={profileData.name}
                email={profileData.email}
                phone={profileData.phone}
                role={profileData.role}
                profilePicture={profileData.profilePicture}
                address={profileData.address}
                joinDate={profileData.joinDate}
                nip={profileData.nip}
                subject={profileData.subject}
                onEdit={handleEditProfile}
            />

            {/* Additional Info Card */}
            <Card>
                <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Informasi Tambahan</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                            <div className="p-2 rounded-full bg-primary/10">
                                <Users className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground">Total Kelas</p>
                                <p className="text-lg font-semibold">5</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                            <div className="p-2 rounded-full bg-primary/10">
                                <GraduationCap className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground">Total Siswa</p>
                                <p className="text-lg font-semibold">150</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                            <div className="p-2 rounded-full bg-primary/10">
                                <Clock className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground">Jam Mengajar/Minggu</p>
                                <p className="text-lg font-semibold">24</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                            <div className="p-2 rounded-full bg-primary/10">
                                <Home className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground">Wali Kelas</p>
                                <p className="text-lg font-semibold">Kelas XI A</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
