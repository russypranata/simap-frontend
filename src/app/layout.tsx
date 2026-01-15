import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ClientProviders } from './client-providers';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'SIMAP - Sistem Informasi Manajemen Administrasi Pendidikan',
    description:
        'SIMAP adalah sistem informasi manajemen sekolah terintegrasi yang memudahkan pengelolaan akademik, kesiswaan, dan administrasi. Mendukung peran Guru, Wali Kelas, Siswa, Orang Tua, hingga pengelola Ekstrakurikuler dan Mutamayizin.',
    keywords: [
        'SIMAP',
        'Sistem Informasi Sekolah',
        'Manajemen Pendidikan',
        'E-Rapor',
        'Presensi',
        'Ekstrakurikuler',
        'Mutamayizin',
        'Sekolah Digital',
        'Aplikasi Sekolah',
    ],
    authors: [{ name: 'SIMAP Team' }],
    openGraph: {
        title: 'SIMAP - Sistem Informasi Manajemen Administrasi Pendidikan',
        description:
            'Sistem informasi manajemen sekolah terintegrasi untuk akademik dan kesiswaan.',
        type: 'website',
        siteName: 'SIMAP',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'SIMAP - Sistem Informasi Manajemen Administrasi Pendidikan',
        description:
            'Sistem informasi manajemen sekolah terintegrasi untuk akademik dan kesiswaan.',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
                suppressHydrationWarning
            >
                <ClientProviders>{children}</ClientProviders>
            </body>
        </html>
    );
}
