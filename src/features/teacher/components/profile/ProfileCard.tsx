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
  Camera
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
          <CardTitle>Profil Saya</CardTitle>
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
              <Badge className="bg-primary text-primary-foreground">{role}</Badge>
              {nip && (
                <p className="text-sm text-muted-foreground">NIP: {nip}</p>
              )}
              {subject && (
                <p className="text-sm font-medium text-primary">Mata Pelajaran: {subject}</p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
              <div className="p-2 rounded-full bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium truncate">{email}</p>
              </div>
            </div>

            {phone && (
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                <div className="p-2 rounded-full bg-primary/10">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Telepon</p>
                  <p className="text-sm font-medium">{phone}</p>
                </div>
              </div>
            )}

            {address && (
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 md:col-span-2">
                <div className="p-2 rounded-full bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Alamat</p>
                  <p className="text-sm font-medium">{address}</p>
                </div>
              </div>
            )}

            {joinDate && (
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                <div className="p-2 rounded-full bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Bergabung Sejak</p>
                  <p className="text-sm font-medium">{joinDate}</p>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
              <div className="p-2 rounded-full bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="text-sm font-medium text-green-600">Aktif</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
