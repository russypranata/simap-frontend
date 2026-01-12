import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface ProfileData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  profilePicture?: string;
  role: string;
  nip?: string;
  subject?: string;
  joinDate?: string;
}

export const useProfileData = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setProfileData({
          name: 'Ahmad Fauzi',
          email: 'ahmad.fauzi@school.com',
          phone: '+62 812-3456-7890',
          address: 'Jl. Pendidikan No. 123, Jakarta Selatan, DKI Jakarta 12345',
          role: 'Guru',
          nip: '198512012010011001',
          subject: 'Matematika',
          joinDate: '1 Januari 2020',
          profilePicture: undefined,
        });
      } catch (error) {
        toast.error('Gagal memuat data profil');
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfileData();
  }, []);

  const updateProfile = async (updatedData: Partial<ProfileData>) => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setProfileData(prev => prev ? ({
        ...prev,
        ...updatedData,
      }) : null);

      toast.success('Profil berhasil diperbarui!');
      return true;
    } catch (error) {
      toast.error('Gagal memperbarui profil');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    profileData,
    isFetching,
    isSaving,
    updateProfile,
  };
};
