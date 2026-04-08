'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import JsBarcode from 'jsbarcode';
import {
    User, Mail, Phone, MapPin, Calendar, Edit,
    GraduationCap, Printer, Download, CreditCard,
    CheckCircle2, Users, AtSign, BookOpen,
} from 'lucide-react';
import { ProfileSkeleton } from '@/features/student/components/profile';
import { StudentProfileData } from '../data/mockStudentData';
import { getStudentProfile } from '../services/studentProfileService';

export const StudentProfile: React.FC = () => {
    const router = useRouter();
    const [profileData, setProfileData] = useState<StudentProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isPhotoOpen, setIsPhotoOpen] = useState(false);
    const barcodeRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profile = await getStudentProfile();
                setProfileData(profile);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (profileData?.nis && barcodeRef.current) {
            try {
                JsBarcode(barcodeRef.current, profileData.nis, {
                    format: 'CODE128',
                    displayValue: false,
                    background: '#ffffff',
                    lineColor: '#000000',
                    margin: 0,
                    height: 40,
                    width: 2,
                });
            } catch (e) {
                console.error('Barcode generation error:', e);
            }
        }
    }, [profileData?.nis]);

    if (loading || !profileData) return <ProfileSkeleton />;

    const initials = profileData.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

    const handlePrintPDF = () => alert('Fitur Cetak akan membuka tab baru ke PDF dari server (Backend Implementation).');
    const handleDownloadPDF = () => alert('Fitur Unduh akan mendownload PDF langsung dari server (Backend Implementation).');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Profil </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Saya</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <User className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">Lihat informasi pribadi dan data akademik Anda</p>
                </div>
            </div>

            {/* Profile Card */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <User className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Data Diri</CardTitle>
                                <p className="text-sm text-muted-foreground mt-0.5 font-normal">Informasi lengkap siswa</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 pl-2 pr-3 py-1 hidden sm:flex">
                                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                                Aktif
                            </Badge>
                            <Button onClick={() => router.push('/student/profile/edit')} size="sm" className="flex items-center space-x-2 bg-blue-800 hover:bg-blue-900 text-white">
                                <Edit className="h-4 w-4" />
                                <span>Edit Profil</span>
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {/* Avatar + Basic Info */}
                        <div className="flex flex-col md:flex-row items-center md:items-center space-y-4 md:space-y-0 md:space-x-6">
                            <div onClick={() => profileData.profilePicture && setIsPhotoOpen(true)} className={`relative group ${profileData.profilePicture ? 'cursor-pointer' : 'cursor-default'}`}>
                                <Avatar className="w-32 h-32 rounded-full border-4 border-primary/10 transition-transform duration-300 group-hover:scale-105">
                                    <AvatarImage src={profileData.profilePicture} alt={profileData.name} className="object-cover" />
                                    <AvatarFallback className="text-3xl font-semibold bg-blue-800 text-white rounded-full">{initials}</AvatarFallback>
                                </Avatar>
                                {profileData.profilePicture && (
                                    <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <div className="bg-white/90 p-2 rounded-full shadow-sm backdrop-blur-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-800">
                                                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /><path d="M11 8v6" /><path d="M8 11h6" />
                                            </svg>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Dialog open={isPhotoOpen} onOpenChange={setIsPhotoOpen}>
                                <DialogContent className="max-w-md md:max-w-lg p-1 bg-transparent border-none shadow-none text-transparent">
                                    <div className="relative rounded-lg overflow-hidden bg-white shadow-2xl">
                                        {profileData.profilePicture && (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={profileData.profilePicture} alt={`Foto Profil ${profileData.name}`} className="w-full h-auto object-contain max-h-[80vh] rounded-lg" />
                                        )}
                                    </div>
                                </DialogContent>
                            </Dialog>

                            <div className="flex-1 text-center md:text-left space-y-2">
                                <h2 className="text-2xl font-bold text-foreground">{profileData.name}</h2>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-1">
                                    <Badge className="bg-blue-800 text-white pl-2 pr-3 py-1">
                                        <GraduationCap className="h-3.5 w-3.5 mr-1.5" />
                                        {profileData.role}
                                    </Badge>
                                    <Badge variant="outline" className="border-blue-200 text-blue-800 bg-blue-50 pl-2 pr-3 py-1">
                                        <Users className="h-3.5 w-3.5 mr-1.5" />
                                        {profileData.class}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Informasi Pribadi */}
                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="text-base font-medium text-foreground flex items-center gap-2">
                                <GraduationCap className="h-4 w-4 text-primary" />
                                Informasi Pribadi
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { label: "NIS", value: profileData.nis, icon: User },
                                    { label: "NISN", value: profileData.nisn, icon: User },
                                    { label: "Username", value: profileData.username, icon: AtSign },
                                    { label: "Agama", value: profileData.religion, icon: BookOpen },
                                    { label: "Tahun Masuk", value: profileData.joinDate, icon: Calendar },
                                ].map(({ label, value, icon: Icon }) => (
                                    <div key={label} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                        <div className="p-2 rounded-full bg-primary/10"><Icon className="h-5 w-5 text-primary" /></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-muted-foreground">{label}</p>
                                            <p className="text-sm font-medium truncate">{value}</p>
                                        </div>
                                    </div>
                                ))}
                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 md:col-span-2">
                                    <div className="p-2 rounded-full bg-primary/10"><Calendar className="h-5 w-5 text-primary" /></div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Tempat, Tanggal Lahir</p>
                                        <p className="text-sm font-medium">{profileData.birthPlace}, {profileData.birthDate}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Informasi Kontak */}
                        <div className="space-y-4 pt-6 border-t">
                            <h3 className="text-base font-medium text-foreground flex items-center gap-2">
                                <Phone className="h-4 w-4 text-primary" />
                                Informasi Kontak
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                    <div className="p-2 rounded-full bg-primary/10"><Mail className="h-5 w-5 text-primary" /></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-muted-foreground">Email</p>
                                        <p className="text-sm font-medium truncate">{profileData.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                    <div className="p-2 rounded-full bg-primary/10"><Phone className="h-5 w-5 text-primary" /></div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Telepon</p>
                                        {profileData.phone ? (
                                            <p className="text-sm font-medium">{profileData.phone}</p>
                                        ) : (
                                            <p className="text-sm text-muted-foreground italic">Tidak ada isi</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 md:col-span-2">
                                    <div className="p-2 rounded-full bg-primary/10"><MapPin className="h-5 w-5 text-primary" /></div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Alamat</p>
                                        {profileData.address ? (
                                            <p className="text-sm font-medium">{profileData.address}</p>
                                        ) : (
                                            <p className="text-sm text-muted-foreground italic">Tidak ada isi</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Kartu Pelajar */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <CreditCard className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Kartu Pelajar</CardTitle>
                                <p className="text-sm text-muted-foreground mt-0.5 font-normal">Cetak atau unduh kartu identitas Anda</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={handlePrintPDF} disabled={loading}>
                                <Printer className="h-4 w-4" />
                                <span className="hidden sm:inline">Cetak</span>
                            </Button>
                            <Button size="sm" className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white" onClick={handleDownloadPDF} disabled={loading}>
                                <Download className="h-4 w-4" />
                                <span className="hidden sm:inline">Unduh PDF</span>
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 p-4 rounded-lg bg-blue-50/50 border border-blue-100 flex gap-3 text-blue-900/80">
                        <div className="mt-0.5 shrink-0 text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" />
                            </svg>
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-semibold text-blue-900">Mode Pratinjau (Preview)</h4>
                            <p className="text-xs sm:text-sm leading-relaxed text-blue-800/80">
                                Tampilan di bawah ini hanya simulasi visual. Hasil cetak/PDF akan memiliki resolusi tinggi dan barcode yang tajam sesuai standar kartu pelajar.
                            </p>
                        </div>
                    </div>

                    <div className="w-full py-8 bg-slate-50/50 rounded-xl border border-slate-100/80 mb-6">
                        <div className="flex flex-col xl:flex-row gap-12 justify-center items-center mx-auto px-4">
                            {/* FRONT */}
                            <div className="flex flex-col gap-4 items-center group/front">
                                <div className="flex items-center gap-2.5 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-50/50 rounded-lg border border-blue-200/60">
                                    <div className="p-1.5 rounded-md bg-blue-800"><CreditCard className="h-3.5 w-3.5 text-white" /></div>
                                    <h3 className="font-semibold text-blue-900 text-sm">Tampak Depan</h3>
                                </div>
                                <div className="relative shadow-2xl shadow-slate-200/50 rounded-xl overflow-hidden group bg-white border ring-1 ring-slate-100 w-[428px] h-[270px] transition-transform hover:scale-[1.02] duration-300">
                                    <div style={{ width: '856px', height: '539.8px', position: 'relative', backgroundColor: 'white', fontFamily: 'Arial, sans-serif', overflow: 'hidden', transform: 'scale(0.5)', transformOrigin: 'top left', textAlign: 'left' }}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src="/assets/student-id-cards/kartu-bg.png" alt="Background Front" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', zIndex: 0 }} />
                                        <div className="absolute inset-0 z-10" style={{ fontFamily: 'Arial, sans-serif' }}>
                                            {/* PHOTO */}
                                            <div style={{ position: 'absolute', top: '185px', left: '30px', width: '180px', height: '250px', backgroundColor: '#f0f0f0', overflow: 'hidden' }}>
                                                {profileData.profilePicture ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={profileData.profilePicture} alt="Photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                                        <User className="w-16 h-16 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            {/* DATA FIELDS */}
                                            <div style={{ position: 'absolute', top: '185px', left: '275px', right: '20px', color: '#000', fontWeight: 'normal', fontSize: '20px', lineHeight: '1.5' }}>
                                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                    <tbody>
                                                        {[
                                                            ["No Induk", profileData.nis],
                                                            ["NISN", profileData.nisn],
                                                            ["Nama", profileData.name],
                                                            ["TTL", `${profileData.birthPlace}, ${profileData.birthDate}`],
                                                            ["Agama", profileData.religion],
                                                        ].map(([label, value]) => (
                                                            <tr key={label}>
                                                                <td style={{ width: '110px', paddingBottom: '4px' }}>{label}</td>
                                                                <td style={{ width: '20px', paddingBottom: '4px' }}>:</td>
                                                                <td style={{ paddingBottom: '4px' }}>{value}</td>
                                                            </tr>
                                                        ))}
                                                        <tr>
                                                            <td style={{ verticalAlign: 'top' }}>Alamat</td>
                                                            <td style={{ verticalAlign: 'top' }}>:</td>
                                                            <td style={{ verticalAlign: 'top', lineHeight: '1.2' }}>{profileData.address}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            {/* BARCODE */}
                                            <div style={{ position: 'absolute', top: '445px', left: '30px', width: '180px', height: '45px', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start' }}>
                                                <canvas ref={barcodeRef} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                            </div>
                                            {/* VALIDITY */}
                                            <div style={{ position: 'absolute', bottom: '45px', left: '275px', fontSize: '20px', fontWeight: 'normal', color: '#000', display: 'flex', alignItems: 'center' }}>
                                                <span style={{ width: '110px' }}>Berlaku</span>
                                                <span style={{ width: '20px' }}>:</span>
                                                <span>{profileData.validUntil}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* BACK */}
                            <div className="flex flex-col gap-4 items-center group/back">
                                <div className="flex items-center gap-2.5 px-4 py-2 bg-gradient-to-r from-slate-50 to-slate-50/50 rounded-lg border border-slate-200/60">
                                    <div className="p-1.5 rounded-md bg-slate-700"><CreditCard className="h-3.5 w-3.5 text-white" /></div>
                                    <h3 className="font-semibold text-slate-900 text-sm">Tampak Belakang</h3>
                                </div>
                                <div className="relative shadow-2xl shadow-slate-200/50 rounded-xl overflow-hidden group bg-white border ring-1 ring-slate-100 w-[428px] h-[270px] transition-transform hover:scale-[1.02] duration-300">
                                    <div style={{ width: '856px', height: '539.8px', position: 'relative', backgroundColor: 'white', fontFamily: 'Arial, sans-serif', overflow: 'hidden', transform: 'scale(0.5)', transformOrigin: 'top left' }}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src="/assets/student-id-cards/student-card.jpg" alt="Back Card" style={{ width: '100%', height: '100%', objectFit: 'fill' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
