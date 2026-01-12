"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Edit,
    Camera,
    Users,
    Award,
    Activity,
    Star,
    BarChart3,
    BookOpen,
    GraduationCap,
    Printer,
    Download,
    CreditCard,
    Loader2,
} from "lucide-react";
import { ProfileSkeleton } from "@/features/student/components/profile";

import { StudentProfileData, StudentStats } from "../data/mockStudentData";
import { getStudentProfile, getStudentStats } from "../services/studentProfileService";

export const StudentProfile: React.FC = () => {
    const router = useRouter();
    const [profileData, setProfileData] = useState<StudentProfileData | null>(null);
    const [stats, setStats] = useState<StudentStats>({
        attendance: 0,
        assignmentsCompleted: 0,
        averageGrade: 0,
        points: 0,
    });
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Mock Data Fetching
        const fetchData = async () => {
            try {
                const [profile, stats] = await Promise.all([
                    getStudentProfile(),
                    getStudentStats()
                ]);

                setProfileData(profile);
                setStats(stats);
            } catch (error) {
                console.error("Failed to fetch profile data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading || !profileData) {
        return <ProfileSkeleton />;
    }

    const initials = profileData.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);

    // Helper to load image
    const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    };

    // Generate PDF from card element
    const generatePDF = async (): Promise<jsPDF | null> => {
        if (!cardRef.current) return null;

        try {
            // 1. Capture Front Side (HTML)
            // 1. Capture Front Side (HTML) - USING IFRAME ISOLATION
            // We create a clean iframe to render the card without Tailwind's global CSS variables
            const iframe = document.createElement('iframe');
            iframe.style.position = 'fixed';
            iframe.style.top = '-10000px';
            iframe.style.width = '1000px'; // Ensure enough width
            iframe.style.height = '1000px';
            document.body.appendChild(iframe);

            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
            if (!iframeDoc) throw new Error("Iframe error");

            // Open iframe document
            iframeDoc.open();
            iframeDoc.write(`
                <html>
                <head>
                    <style>
                        /* Base Reset */
                        body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
                        /* Ensure fonts load if needed, otherwise rely on system fonts */
                    </style>
                </head>
                <body>
                    <!-- Inject Card HTML -->
                    ${cardRef.current.outerHTML}
                </body>
                </html>
            `);
            iframeDoc.close();

            // Wait for iframe to render
            await new Promise(resolve => setTimeout(resolve, 500));

            // Capture from IFRAME body (Clean Environment)
            const canvas = await html2canvas(iframeDoc.body.querySelector('div') as HTMLElement, {
                scale: 4, // High quality
                useCORS: true,
                allowTaint: true,
                backgroundColor: null,
                logging: false,
                // Explicitly ignore external styles
                ignoreElements: (element) => element.tagName === 'LINK' || element.tagName === 'STYLE',
            });

            // Cleanup
            document.body.removeChild(iframe);

            const frontImgData = canvas.toDataURL("image/png");

            // 2. Prepare PDF
            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: [85.6, 54], // Standard ID card size
            });

            // 3. Add Front Page
            pdf.addImage(frontImgData, "PNG", 0, 0, 85.6, 54);

            // 4. Add Back Page (from Template)
            try {
                const backImg = await loadImage("/assets/student-id-cards/student-card.jpg");
                pdf.addPage();
                pdf.addImage(backImg, "JPEG", 0, 0, 85.6, 54);
            } catch (err) {
                console.error("Failed to load back image template", err);
                // If back image fails, we just return the PDF with front only, 
                // or we could show a toast. For now, log and proceed.
            }

            return pdf;
        } catch (error) {
            console.error("Error generating PDF:", error);
            return null;
        }
    };

    // Download PDF
    const handleDownloadPDF = async () => {
        setIsGenerating(true);
        try {
            const pdf = await generatePDF();
            if (pdf) {
                const fileName = `Kartu_Pelajar_${profileData.name.replace(/\s+/g, "_")}.pdf`;
                pdf.save(fileName);
            }
        } finally {
            setIsGenerating(false);
        }
    };

    // Print PDF (open in new tab)
    const handlePrintPDF = async () => {
        setIsGenerating(true);
        try {
            const pdf = await generatePDF();
            if (pdf) {
                const pdfBlob = pdf.output("blob");
                const pdfUrl = URL.createObjectURL(pdfBlob);
                const printWindow = window.open(pdfUrl, "_blank");
                if (printWindow) {
                    printWindow.onload = () => {
                        printWindow.print();
                    };
                }
            }
        } finally {
            setIsGenerating(false);
        }
    };

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
                    <p className="text-muted-foreground mt-1">
                        Lihat informasi pribadi dan statistik akademik Anda
                    </p>
                    <div className="flex items-center gap-3 mt-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm font-semibold">
                                Tahun Ajaran 2025/2026
                            </span>
                        </div>
                        <div className="h-4 w-[1px] bg-border" />
                        <span className="text-sm font-medium text-blue-800">
                            Semester Ganjil
                        </span>
                    </div>
                </div>
            </div>

            {/* Profile Card */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                <User className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle>Data Diri</CardTitle>
                                <p className="text-sm text-muted-foreground mt-0.5 font-normal">Informasi lengkap siswa</p>
                            </div>
                        </div>
                        <Button
                            onClick={() => router.push("/student/profile/edit")}
                            size="sm"
                            className="flex items-center space-x-2 bg-blue-800 hover:bg-blue-900 text-white"
                        >
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
                                    <AvatarImage
                                        src={profileData.profilePicture}
                                        alt={profileData.name}
                                    />
                                    <AvatarFallback className="text-3xl font-semibold bg-blue-800 text-white">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                                    <Camera className="h-8 w-8 text-white" />
                                </div>
                            </div>

                            <div className="flex-1 text-center md:text-left space-y-2">
                                <h2 className="text-2xl font-bold text-foreground">
                                    {profileData.name}
                                </h2>
                                <div className="flex items-center justify-center md:justify-start gap-2">
                                    <Badge className="bg-blue-800 text-white">
                                        {profileData.role}
                                    </Badge>
                                    <Badge variant="outline" className="border-blue-200 text-blue-800 bg-blue-50">
                                        {profileData.class}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    NIS: {profileData.nis}
                                </p>
                            </div>
                        </div>

                        {/* Informasi Pribadi */}
                        <div className="space-y-3 pt-4 border-t">
                            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <GraduationCap className="h-4 w-4 text-primary" />
                                Informasi Pribadi
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <User className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">NIS</p>
                                        <p className="text-sm font-medium">
                                            {profileData.nis}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <User className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">NISN</p>
                                        <p className="text-sm font-medium">
                                            {profileData.nisn}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 md:col-span-2">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <Calendar className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">
                                            Tempat, Tanggal Lahir
                                        </p>
                                        <p className="text-sm font-medium">
                                            {profileData.birthPlace}, {profileData.birthDate}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <BookOpen className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Agama</p>
                                        <p className="text-sm font-medium">
                                            {profileData.religion}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <Calendar className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">
                                            Tahun Masuk
                                        </p>
                                        <p className="text-sm font-medium">
                                            {profileData.joinDate}
                                        </p>
                                    </div>
                                </div>

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

                        {/* Contact Information */}
                        <div className="space-y-3 pt-4 border-t">
                            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <Phone className="h-4 w-4 text-primary" />
                                Informasi Kontak
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <Mail className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-muted-foreground">Email</p>
                                        <p className="text-sm font-medium truncate">
                                            {profileData.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <Phone className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Telepon</p>
                                        <p className="text-sm font-medium">
                                            {profileData.phone}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 md:col-span-2">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <MapPin className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Alamat</p>
                                        <p className="text-sm font-medium">
                                            {profileData.address}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Academic Statistic s */}
            <Card>
                <CardContent className="px-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                            <BarChart3 className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Statistik Akademik</h3>
                            <p className="text-sm text-muted-foreground">Ringkasan performa akademik Anda</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                            <div className="p-2 rounded-full bg-blue-100">
                                <Activity className="h-5 w-5 text-blue-800" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground">Kehadiran</p>
                                <p className="text-lg font-semibold text-blue-800">
                                    {stats.attendance}%
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                            <div className="p-2 rounded-full bg-green-100">
                                <BookOpen className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground">Tugas Selesai</p>
                                <p className="text-lg font-semibold">
                                    {stats.assignmentsCompleted}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                            <div className="p-2 rounded-full bg-yellow-100">
                                <Star className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground">Rata-rata Nilai</p>
                                <p className="text-lg font-semibold">
                                    {stats.averageGrade}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                            <div className="p-2 rounded-full bg-purple-100">
                                <Award className="h-5 w-5 text-purple-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground">Poin Prestasi</p>
                                <p className="text-lg font-semibold">
                                    {stats.points}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Student ID Card */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                <CreditCard className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle>Kartu Pelajar</CardTitle>
                                <p className="text-sm text-muted-foreground mt-0.5 font-normal">Cetak atau unduh kartu identitas Anda</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2"
                                onClick={handlePrintPDF}
                                disabled={isGenerating}
                            >
                                {isGenerating ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Printer className="h-4 w-4" />
                                )}
                                <span className="hidden sm:inline">Cetak</span>
                            </Button>
                            <Button
                                size="sm"
                                className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white"
                                onClick={handleDownloadPDF}
                                disabled={isGenerating}
                            >
                                {isGenerating ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Download className="h-4 w-4" />
                                )}
                                <span className="hidden sm:inline">Unduh PDF</span>
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Student ID Card Preview */}
                    <div className="flex justify-center">
                        <div className="w-full max-w-md shadow-xl rounded-xl">
                            {/* Card Front - SAFE MODE for html2canvas */}
                            <div
                                ref={cardRef}
                                style={{
                                    width: "100%",
                                    aspectRatio: "1.6/1",
                                    backgroundColor: "#1e40af", // Solid color, no gradient
                                    color: "#ffffff", // Explicit color to prevent inheritance
                                    borderRadius: "12px",
                                    overflow: "hidden",
                                    fontFamily: "Arial, sans-serif",
                                    position: "relative",
                                    padding: "24px",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    border: "1px solid transparent" // Prevent border inheritance
                                }}
                            >
                                {/* Header */}
                                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                    <div style={{ width: "48px", height: "48px", backgroundColor: "#ffffff", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        {/* Simple SVG Logo */}
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1e40af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                            <path d="M6 12v5c3 3 9 3 12 0v-5" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "bold", color: "#ffffff", lineHeight: "1.2" }}>SMA AL-FITYAN</h3>
                                        <p style={{ margin: 0, fontSize: "12px", color: "#bfdbfe" }}>Kalimantan Barat, Indonesia</p>
                                    </div>
                                </div>

                                {/* Main Info */}
                                <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                                    {/* Photo */}
                                    <div style={{ width: "80px", height: "100px", backgroundColor: "#bfdbfe", borderRadius: "8px", overflow: "hidden", border: "2px solid #ffffff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        {profileData.profilePicture ? (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img
                                                src={profileData.profilePicture}
                                                alt="Profile"
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            />
                                        ) : (
                                            <span style={{ fontSize: "24px", fontWeight: "bold", color: "#1e40af" }}>{initials}</span>
                                        )}
                                    </div>

                                    {/* Text Info */}
                                    <div style={{ flex: 1 }}>
                                        <h2 style={{ margin: "0 0 8px 0", fontSize: "20px", fontWeight: "bold", color: "#ffffff" }}>{profileData.name}</h2>
                                        <div style={{ lineHeight: "1.4" }}>
                                            <div style={{ display: "flex", fontSize: "14px" }}>
                                                <span style={{ width: "60px", color: "#bfdbfe" }}>NIS</span>
                                                <span style={{ fontWeight: "bold", color: "#ffffff" }}>{profileData.nis}</span>
                                            </div>
                                            <div style={{ display: "flex", fontSize: "14px" }}>
                                                <span style={{ width: "60px", color: "#bfdbfe" }}>Kelas</span>
                                                <span style={{ fontWeight: "bold", color: "#ffffff" }}>{profileData.class}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div style={{ borderTop: "1px solid rgba(255,255,255,0.3)", paddingTop: "12px", textAlign: "center" }}>
                                    <p style={{ margin: 0, fontSize: "11px", color: "#bfdbfe" }}>
                                        Kartu Pelajar Siswa • Tahun Ajaran 2025/2026
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
