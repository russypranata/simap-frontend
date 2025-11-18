'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileForm } from '../components/profile';
import { useProfileData } from '../hooks/useProfileData';
import { ArrowLeft, Info } from 'lucide-react';
import { toast } from 'sonner';

export const EditProfilePage: React.FC = () => {
  const { profileData, updateProfile, isLoading } = useProfileData();
  const router = useRouter();

  const handleSave = async (updatedData: any) => {
    const success = await updateProfile(updatedData);
    if (success) {
      // Navigate back to profile page
      setTimeout(() => {
        router.push('/profile');
      }, 1500);
    }
  };

  const handleCancel = () => {
    // Navigate back to profile page
    router.push('/profile');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handleCancel}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Profil</h1>
            <p className="text-muted-foreground">
              Perbarui informasi profil Anda
            </p>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">
                Informasi Penting
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Pastikan semua informasi yang Anda masukkan akurat dan terkini. 
                Data NIP tidak dapat diubah. Jika ada kesalahan, hubungi administrator.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Form */}
      <ProfileForm
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
        isLoading={isLoading}
      />

      {/* Additional Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tips Keamanan</CardTitle>
          <CardDescription>
            Lindungi akun Anda dengan mengikuti tips berikut
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start space-x-2">
              <span className="text-primary mt-1">•</span>
              <span>Gunakan foto profil yang profesional dan jelas</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary mt-1">•</span>
              <span>Pastikan alamat email selalu aktif untuk menerima notifikasi penting</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary mt-1">•</span>
              <span>Perbarui nomor telepon jika ada perubahan untuk memudahkan komunikasi</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary mt-1">•</span>
              <span>Jangan bagikan informasi login Anda kepada siapapun</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
