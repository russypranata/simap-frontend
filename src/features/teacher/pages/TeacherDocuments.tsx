"use client";

import React from "react";
import { DocumentCategory } from "@/features/teacher/components/documents/DocumentCategory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate, getDayName } from "@/features/shared/utils/dateFormatter";
import { Calendar } from "lucide-react";

export const TeacherDocuments = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">
                        Administrasi <span className="text-primary">Guru</span>
                    </h1>
                    <p className="text-muted-foreground">
                        Kelola dokumen administrasi semester ini
                    </p>
                    <div className="flex items-center gap-3 mt-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm font-semibold">Tahun Ajaran 2025/2026</span>
                        </div>
                        <div className="h-4 w-[1px] bg-border" />
                        <span className="text-muted-foreground text-sm font-medium text-primary">Semester Ganjil</span>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="planning" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="planning">Perencanaan Pembelajaran</TabsTrigger>
                    <TabsTrigger value="assessment">Asesmen & Evaluasi</TabsTrigger>
                    <TabsTrigger value="development">Pengembangan & Refleksi</TabsTrigger>
                </TabsList>

                <TabsContent value="planning" className="space-y-4">
                    <DocumentCategory
                        title="Perencanaan Pembelajaran"
                        description="Dokumen perencanaan pembelajaran semester ini"
                        documentTypes={[
                            "Capaian Pembelajaran (CP)",
                            "Alur Tujuan Pembelajaran (ATP)",
                            "Tujuan Pembelajaran (TP)",
                            "Modul Ajar",
                            "Program Tahunan (PROTA)",
                            "Program Semester (PROSEM)",
                            "Analisis Alokasi Waktu",
                        ]}
                    />
                </TabsContent>

                <TabsContent value="assessment" className="space-y-4">
                    <DocumentCategory
                        title="Asesmen & Evaluasi"
                        description="Dokumen terkait penilaian dan evaluasi siswa"
                        documentTypes={[
                            "Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)",
                            "Kisi-kisi Soal",
                            "Analisis Asesmen Diagnostik",
                            "Daya Serap",
                        ]}
                    />
                </TabsContent>

                <TabsContent value="development" className="space-y-4">
                    <DocumentCategory
                        title="Pengembangan & Refleksi"
                        description="Dokumen pengembangan diri dan refleksi guru"
                        documentTypes={[
                            "Jurnal Refleksi Guru",
                            "Dokumen PKB Guru",
                        ]}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
};
