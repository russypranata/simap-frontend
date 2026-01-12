'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TeacherProfileForm, EditProfileSkeleton } from '../components/profile';
import { useProfileData } from '../hooks/useProfileData';
import { ArrowLeft, User } from 'lucide-react';

export const EditProfilePage: React.FC = () => {
  const { profileData, updateProfile, isSaving, isFetching } = useProfileData();
  const router = useRouter();

  if (isFetching || !profileData) {
    return <EditProfileSkeleton />;
  }

  const handleSave = async (updatedData: any) => {
    const success = await updateProfile(updatedData);
    if (success) {
      setTimeout(() => {
        router.push('/profile');
      }, 1500);
    }
  };

  const handleCancel = () => {
    router.push('/profile');
  };

  return (
    <div className="space-y-6">
      {/* Header Standardized */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <div className="flex items-start gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="h-8 w-8 p-0 mt-1.5"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Edit </span>
                  <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Profil</span>
                </h1>
                <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                  <User className="h-5 w-5" />
                </div>
              </div>
              <p className="text-muted-foreground mt-1">
                Kelola dan ubah informasi data diri Anda
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form Card */}
      <TeacherProfileForm
        initialData={{
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          address: profileData.address,
          profilePicture: profileData.profilePicture,
          nip: profileData.nip,
          subject: profileData.subject,
        }}
        onSave={handleSave}
        onCancel={handleCancel}
        isLoading={isSaving}
      />

      {/* Info Card Standardized (Bottom) */}
      <Card className="border-blue-800/20 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-semibold text-blue-800">
                Informasi Penting
              </p>
              <ul className="text-sm text-blue-900 space-y-1 list-disc list-inside">
                <li>Pastikan informasi yang Anda masukkan benar dan akurat</li>
                <li>Data NIP tidak dapat diubah. Jika ada kesalahan, hubungi administrator</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
