'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Camera,
  CheckCircle2
} from 'lucide-react';

interface ProfileCardProps {
  name: string;
  email: string;
  phone?: string;
  role: string;
  profilePicture?: string;
  address?: string;
  joinDate?: string;
  nip?: string;
  subject?: string;
  onEdit: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  email,
  phone,
  role,
  profilePicture,
  address,
  joinDate,
  nip,
  subject,
  onEdit,
}) => {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <User className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Profil Saya</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5 font-normal">Informasi lengkap pendidik</p>
            </div>
          </div>
          <Button onClick={onEdit} size="sm" className="flex items-center space-x-2">
            <Edit className="h-4 w-4" />
            <span>Edit Profil</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Profile Picture and Basic Info */}
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative group">
              <Avatar className="h-32 w-32 border-4 border-primary/10">
                <AvatarImage src={profilePicture} alt={name} />
                <AvatarFallback className="text-3xl font-semibold bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                <Camera className="h-8 w-8 text-white" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-2">
              <h2 className="text-2xl font-bold text-foreground">{name}</h2>

              <div className="space-y-2 mt-1">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <Badge className="bg-primary text-primary-foreground">{role}</Badge>
                  {subject && (
                    <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">
                      {subject}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="text-xs text-muted-foreground font-medium">Status Akun:</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 pl-2 pr-3 py-1">
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                    Aktif
                  </Badge>
                </div>
              </div>

              {nip && (
                <p className="text-sm text-muted-foreground mt-1">NIP: {nip}</p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4 pt-6 border-t mt-2">
            <h3 className="text-base font-medium text-foreground flex items-center gap-2">
              <Phone className="h-4.5 w-4.5 text-primary" />
              Informasi Kontak
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                <div className="p-2 rounded-full bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium truncate">{email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                <div className="p-2 rounded-full bg-primary/10">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Telepon</p>
                  {phone ? (
                    <p className="text-sm font-medium">{phone}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Tidak ada isi</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 md:col-span-2">
                <div className="p-2 rounded-full bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Alamat</p>
                  {address ? (
                    <p className="text-sm font-medium">{address}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Tidak ada isi</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                <div className="p-2 rounded-full bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Bergabung Sejak</p>
                  {joinDate ? (
                    <p className="text-sm font-medium">{joinDate}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Tidak ada isi</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card >
  );
};
