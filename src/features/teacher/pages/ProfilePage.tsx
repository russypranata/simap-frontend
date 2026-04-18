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
            <Card className="border-slate-100 shadow-sm">
                <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Users className="h-5 w-5 text-blue-700" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800">Informasi Tambahan</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/50 border border-blue-100">
                            <div className="p-2 rounded-xl bg-blue-100">
                                <Users className="h-5 w-5 text-blue-700" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-slate-500">Total Kelas</p>
                                <p className="text-lg font-bold text-slate-800">5</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50/50 border border-green-100">
                            <div className="p-2 rounded-xl bg-green-100">
                                <GraduationCap className="h-5 w-5 text-green-700" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-slate-500">Total Siswa</p>
                                <p className="text-lg font-bold text-slate-800">150</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/50 border border-amber-100">
                            <div className="p-2 rounded-xl bg-amber-100">
                                <Clock className="h-5 w-5 text-amber-700" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-slate-500">Jam Mengajar/Minggu</p>
                                <p className="text-lg font-bold text-slate-800">24</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50/50 border border-purple-100">
                            <div className="p-2 rounded-xl bg-purple-100">
                                <Home className="h-5 w-5 text-purple-700" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-slate-500">Wali Kelas</p>
                                <p className="text-lg font-bold text-slate-800">Kelas XI A</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
