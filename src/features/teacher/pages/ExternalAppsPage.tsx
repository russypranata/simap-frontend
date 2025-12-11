import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Globe, BookOpen, GraduationCap, Video, Library } from 'lucide-react';

interface ExternalApp {
    title: string;
    description: string;
    url: string;
    icon: React.ComponentType<{ className?: string }>;
    category: string;
}

const apps: ExternalApp[] = [
    {
        title: "E-Learning SMAIT Al-Fityan Kubu-Raya",
        description: "Portal pembelajaran resmi dari Kementerian Pendidikan dan Kebudayaan.",
        url: "https://elearning.kemdikbud.go.id/",
        icon: Globe,
        category: "Pembelajaran"
    },
    {
        title: "Rumah Belajar",
        description: "Konten sumber belajar audio, video, gambar, dan buku sekolah elektronik.",
        url: "https://belajar.kemdikbud.go.id/",
        icon: BookOpen,
        category: "Sumber Belajar"
    },
    {
        title: "Dapodik",
        description: "Sistem pendataan skala nasional yang terintegrasi (Data Pokok Pendidikan).",
        url: "https://dapo.kemdikbud.go.id/",
        icon: Library,
        category: "Administrasi"
    },
    {
        title: "Google Classroom",
        description: "Kelola kelas, tugas, dan nilai secara online dengan mudah.",
        url: "https://classroom.google.com/",
        icon: GraduationCap,
        category: "Alat Pembelajaran"
    },
    {
        title: "Zoom Meeting",
        description: "Aplikasi video conference untuk pembelajaran jarak jauh.",
        url: "https://zoom.us/",
        icon: Video,
        category: "Komunikasi"
    }
];

export const ExternalAppsPage: React.FC = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-foreground tracking-tight">
                    Aplikasi <span className="text-primary">Eksternal</span>
                </h1>
                <p className="text-muted-foreground mt-1">
                    Kumpulan tautan cepat ke aplikasi dan website pendukung kegiatan belajar mengajar.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {apps.map((app, index) => (
                    <Card key={index} className="flex flex-col group hover:shadow-lg transition-all duration-300 border-primary/10 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="p-3 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                    <app.icon className="h-8 w-8 text-primary" />
                                </div>

                            </div>
                            <CardTitle className="mt-4 text-xl group-hover:text-primary transition-colors min-h-[3.5rem] flex items-center">
                                {app.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 flex flex-col flex-1">
                            <CardDescription className="text-sm leading-relaxed line-clamp-2 min-h-[40px]">
                                {app.description}
                            </CardDescription>
                            <div className="mt-auto pt-2">
                                <Button
                                    className="w-full group/btn relative overflow-hidden"
                                    variant="outline"
                                    asChild
                                >
                                    <a href={app.url} target="_blank" rel="noopener noreferrer">
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            Buka Aplikasi
                                            <ExternalLink className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </span>
                                        <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
