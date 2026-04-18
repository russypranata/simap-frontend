import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getTeacherProfile, updateTeacherProfile, updateTeacherAvatar } from '../services/teacherProfileService';

interface ProfileData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  profilePicture?: string;
  role: string;
  nip?: string;
  nuptk?: string;
  subject?: string;
  joinDate?: string;
  lastEducation?: string;
  educationMajor?: string;
  employmentStatus?: string;
}

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export const useProfileData = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (USE_MOCK) {
          await new Promise(resolve => setTimeout(resolve, 500));
          setProfileData({
            name: 'Ahmad Fauzi',
            email: 'ahmad.fauzi@school.com',
            phone: '+62 812-3456-7890',
            address: 'Jl. Pendidikan No. 123, Jakarta Selatan',
            role: 'Guru',
            nip: '198512012010011001',
            subject: 'Matematika',
            joinDate: '2020-01-01',
            profilePicture: undefined,
          });
        } else {
          const data = await getTeacherProfile();
          setProfileData({
            name:             data.name,
            email:            data.email,
            phone:            data.phone ?? undefined,
            address:          data.address ?? undefined,
            profilePicture:   data.profilePicture ?? undefined,
            role:             'Guru',
            nip:              data.nip ?? undefined,
            nuptk:            data.nuptk ?? undefined,
            joinDate:         data.joinDate ?? undefined,
            lastEducation:    data.lastEducation ?? undefined,
            educationMajor:   data.educationMajor ?? undefined,
            employmentStatus: data.employmentStatus ?? undefined,
          });
        }
      } catch {
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
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setProfileData(prev => prev ? { ...prev, ...updatedData } : null);
      } else {
        await updateTeacherProfile({
          name:    updatedData.name,
          email:   updatedData.email,
          phone:   updatedData.phone,
          address: updatedData.address,
        });
        setProfileData(prev => prev ? { ...prev, ...updatedData } : null);
      }
      toast.success('Profil berhasil diperbarui!');
      return true;
    } catch {
      toast.error('Gagal memperbarui profil');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const updateAvatar = async (file: File) => {
    setIsSaving(true);
    try {
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 500));
        toast.success('Foto profil berhasil diperbarui!');
        return true;
      } else {
        const result = await updateTeacherAvatar(file);
        setProfileData(prev => prev ? { ...prev, profilePicture: result.profilePicture } : null);
        toast.success('Foto profil berhasil diperbarui!');
        return true;
      }
    } catch {
      toast.error('Gagal memperbarui foto profil');
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
    updateAvatar,
  };
};
