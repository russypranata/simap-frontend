/* eslint-disable @typescript-eslint/no-explicit-any , @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import {
  Camera,
  Save,
  X,
  User,
  Mail,
  Phone,
  IdCard,
  BookOpen,
  MapPin
} from 'lucide-react';

interface ProfileFormProps {
  initialData: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    profilePicture?: string;
    nip?: string;
    subject?: string;
  };
  onSave: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const TeacherProfileForm: React.FC<ProfileFormProps> = ({
  initialData,
  onSave,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [imagePreview, setImagePreview] = useState(initialData.profilePicture || '');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, profilePicture: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      toast.error('Nama dan email wajib diisi');
      return;
    }

    onSave(formData);
  };

  const initials = formData.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            <User className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Informasi Profil</CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5 font-normal">Perbarui detail identitas dan kontak</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative group">
              <Avatar className="h-32 w-32 border-4 border-primary/10">
                <AvatarImage src={imagePreview} alt={formData.name} />
                <AvatarFallback className="text-3xl font-semibold bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="profile-picture"
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer"
              >
                <Camera className="h-8 w-8 text-white" />
              </label>
              <input
                id="profile-picture"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-blue-800 hover:text-blue-900 border-blue-800/30 hover:border-blue-800"
              onClick={() => document.getElementById('profile-picture')?.click()}
            >
              <Camera className="h-4 w-4 mr-2" />
              Ubah Foto Profil
            </Button>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <Label htmlFor="name" className="mb-0">
                  Nama Lengkap <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Masukkan nama lengkap"
                required
                className=""
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <Label htmlFor="email" className="mb-0">
                  Email <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="email@example.com"
                required
                className=""
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <Label htmlFor="phone" className="mb-0">
                  Nomor Telepon
                </Label>
              </div>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone || ''}
                onChange={handleInputChange}
                placeholder="+62 812-3456-7890"
                className=""
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <IdCard className="h-4 w-4 text-primary" />
                <Label htmlFor="nip" className="mb-0">
                  NIP
                </Label>
              </div>
              <Input
                id="nip"
                name="nip"
                value={formData.nip || ''}
                onChange={handleInputChange}
                placeholder="NIP"
                disabled
                className="bg-muted cursor-not-allowed"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <Label htmlFor="subject" className="mb-0">
                  Mata Pelajaran
                </Label>
              </div>
              <Input
                id="subject"
                name="subject"
                value={formData.subject || ''}
                onChange={handleInputChange}
                placeholder="Mata Pelajaran"
                className=""
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <Label htmlFor="address" className="mb-0">
                  Alamat
                </Label>
              </div>
              <Textarea
                id="address"
                name="address"
                value={formData.address || ''}
                onChange={handleInputChange}
                placeholder="Alamat lengkap"
                rows={3}
                className=""
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              <X className="h-4 w-4 mr-2" />
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
