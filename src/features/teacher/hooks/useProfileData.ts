import { useState } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
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

  const updateProfile = async (updatedData: Partial<ProfileData>) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProfileData(prev => ({
        ...prev,
        ...updatedData,
      }));
      
      toast.success('Profil berhasil diperbarui!');
      return true;
    } catch (error) {
      toast.error('Gagal memperbarui profil');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    profileData,
    isLoading,
    updateProfile,
  };
};
