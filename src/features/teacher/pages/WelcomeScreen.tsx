'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRole } from '@/app/context/RoleContext';
import { School, LogIn, User, Lock } from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const { login } = useRole();
  const [showLogin, setShowLogin] = useState(false);
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
    role: 'guru' as 'guru' | 'siswa' | 'admin' | 'orang_tua',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login process
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock login - accept any credentials for demo
    if (loginData.username && loginData.password) {
      login(loginData.role);
    }

    setIsLoading(false);
  };

  const handleQuickLogin = (role: 'guru' | 'siswa' | 'admin' | 'orang_tua') => {
    login(role);
  };

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 bg-primary rounded-xl flex items-center justify-center">
                <School className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Masuk ke SIMAP
            </CardTitle>
            <CardDescription>
              Sistem Informasi Manajemen Akademik dan Pembelajaran
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Peran</Label>
                <Select
                  value={loginData.role}
                  onValueChange={(value: any) => setLoginData(prev => ({ ...prev, role: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih peran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="guru">Guru</SelectItem>
                    <SelectItem value="siswa">Siswa</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="orang_tua">Orang Tua</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Masukkan username"
                    value={loginData.username}
                    onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Masukkan password"
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    <span>Masuk...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <LogIn className="h-4 w-4" />
                    <span>Masuk</span>
                  </div>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setShowLogin(false)}
              >
                Kembali
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>Demo: Masukkan username dan password apa saja untuk masuk</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center space-y-8">
        {/* Logo and Title */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="h-24 w-24 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <School className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground">
            SIMAP
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Sistem Informasi Manajemen Akademik dan Pembelajaran
          </p>
        </div>

        {/* Login Button */}
        <div className="space-y-4">
          <Button
            size="lg"
            onClick={() => setShowLogin(true)}
            className="h-14 px-8 text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow"
          >
            <LogIn className="h-5 w-5 mr-2" />
            Masuk
          </Button>

          <div className="text-sm text-muted-foreground">
            Atau pilih peran untuk demo cepat:
          </div>

          {/* Quick Login Options */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <Button
              variant="outline"
              onClick={() => handleQuickLogin('guru')}
              className="h-12 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Guru
            </Button>
            <Button
              variant="outline"
              onClick={() => handleQuickLogin('siswa')}
              className="h-12 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Siswa
            </Button>
            <Button
              variant="outline"
              onClick={() => handleQuickLogin('admin')}
              className="h-12 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Admin
            </Button>
            <Button
              variant="outline"
              onClick={() => handleQuickLogin('orang_tua')}
              className="h-12 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Orang Tua
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto">
          <Card className="p-6 text-center">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <User className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Multi Peran</h3>
            <p className="text-sm text-muted-foreground">
              Mendukung Guru, Siswa, Admin, dan Orang Tua
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <School className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Komprehensif</h3>
            <p className="text-sm text-muted-foreground">
              Kelola akademik, pembelajaran, dan dokumen
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <LogIn className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Mudah Digunakan</h3>
            <p className="text-sm text-muted-foreground">
              Antarmuka yang intuitif dan responsif
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};