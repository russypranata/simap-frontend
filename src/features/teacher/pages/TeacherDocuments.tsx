 
"use client";

import React, { useState } from "react";
import { DocumentCategory } from "@/features/teacher/components/documents/DocumentCategory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, BookOpen, ClipboardCheck, TrendingUp } from "lucide-react";
import { MaterialCard } from "@/features/teacher/components/planning/MaterialCard";
import { LearningObjectiveCard } from "@/features/teacher/components/planning/LearningObjectiveCard";
import { Material, LearningObjective, MOCK_MATERIALS, MOCK_LEARNING_OBJECTIVES } from "@/features/teacher/components/planning/types";
import { MaterialInputView } from "@/features/teacher/components/planning/MaterialInputView";
import { MaterialHistoryView } from "@/features/teacher/components/planning/MaterialHistoryView";
import { LearningObjectiveInputView } from "@/features/teacher/components/planning/LearningObjectiveInputView";
import { LearningObjectiveHistoryView } from "@/features/teacher/components/planning/LearningObjectiveHistoryView";
import { PageHeader } from "@/features/shared/components";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

type ViewType = "dashboard" | "material-input" | "material-history" | "tp-input" | "tp-history";

export const TeacherDocuments = () => {
    const [currentView, setCurrentView] = useState<ViewType>("dashboard");
    const [materials, setMaterials] = useState<Material[]>(MOCK_MATERIALS);
    const [learningObjectives, setLearningObjectives] = useState<LearningObjective[]>(MOCK_LEARNING_OBJECTIVES);
    const [isMounted, setIsMounted] = useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleAddMaterial = (data: Omit<Material, "id" | "createdAt">) => {
        const newMaterial: Material = {
            ...data,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
        };
        setMaterials([newMaterial, ...materials]);
    };

    const handleDeleteMaterial = (id: string) => {
        setMaterials(materials.filter((m) => m.id !== id));
        // Cascade delete TPs
        setLearningObjectives(learningObjectives.filter((tp) => tp.materialId !== id));
    };

    const handleAddLearningObjective = (
        data: Omit<LearningObjective, "id" | "createdAt">
    ) => {
        const newTP: LearningObjective = {
            ...data,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
        };
        setLearningObjectives([newTP, ...learningObjectives]);
    };

    const handleDeleteLearningObjective = (id: string) => {
        setLearningObjectives(learningObjectives.filter((tp) => tp.id !== id));
    };

    // Render Logic based on currentView
    if (!isMounted) {
        return (
            <div className="space-y-6 animate-in fade-in duration-500">
                {/* Page header skeleton */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-56" />
                        <Skeleton className="h-4 w-72" />
                    </div>
                </div>
                {/* Tabs skeleton */}
                <div className="flex gap-0.5 p-1 bg-muted/50 rounded-full w-fit">
                    <Skeleton className="h-8 w-44 rounded-full" />
                    <Skeleton className="h-8 w-36 rounded-full" />
                    <Skeleton className="h-8 w-40 rounded-full" />
                </div>
                {/* Planning tab content skeleton */}
                <div className="space-y-8">
                    {/* Material & TP cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 2 }).map((_, i) => (
                            <Card key={i} className="animate-pulse">
                                <CardContent className="p-5 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-10 w-10 rounded-lg" />
                                        <div className="space-y-1.5 flex-1">
                                            <Skeleton className="h-5 w-32" />
                                            <Skeleton className="h-3 w-48" />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Skeleton className="h-9 flex-1 rounded-lg" />
                                        <Skeleton className="h-9 flex-1 rounded-lg" />
                                    </div>
                                    <Skeleton className="h-4 w-24" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    {/* Document category skeleton */}
                    <Card className="animate-pulse">
                        <CardContent className="p-5 space-y-4">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-9 w-9 rounded-lg" />
                                <div className="space-y-1.5">
                                    <Skeleton className="h-5 w-44" />
                                    <Skeleton className="h-3 w-64" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-muted">
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="h-8 w-8 rounded-lg" />
                                            <Skeleton className="h-4 w-48" />
                                        </div>
                                        <div className="flex gap-2">
                                            <Skeleton className="h-8 w-20 rounded-lg" />
                                            <Skeleton className="h-8 w-20 rounded-lg" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (currentView === "material-input") {
        return (
            <MaterialInputView
                onBack={() => setCurrentView("dashboard")}
                onSave={handleAddMaterial}
            />
        );
    }

    if (currentView === "material-history") {
        return (
            <MaterialHistoryView
                onBack={() => setCurrentView("dashboard")}
                materials={materials}
                onDelete={handleDeleteMaterial}
            />
        );
    }

    if (currentView === "tp-input") {
        return (
            <LearningObjectiveInputView
                onBack={() => setCurrentView("dashboard")}
                onSave={handleAddLearningObjective}
                materials={materials}
            />
        );
    }

    if (currentView === "tp-history") {
        return (
            <LearningObjectiveHistoryView
                onBack={() => setCurrentView("dashboard")}
                learningObjectives={learningObjectives}
                materials={materials}
                onDelete={handleDeleteLearningObjective}
            />
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <PageHeader
                title="Administrasi"
                titleHighlight="Guru"
                icon={Calendar}
                description="Kelola dokumen administrasi semester ini"
            />

            <Tabs defaultValue="planning" className="space-y-4">
                <TabsList className="inline-flex h-auto items-center justify-center rounded-full bg-muted/50 p-1 gap-0.5">
                    <TabsTrigger value="planning" className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 h-8 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=inactive]:text-muted-foreground">
                        <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                        Perencanaan Pembelajaran
                    </TabsTrigger>
                    <TabsTrigger value="assessment" className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 h-8 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=inactive]:text-muted-foreground">
                        <ClipboardCheck className="h-3.5 w-3.5 mr-1.5" />
                        Asesmen &amp; Evaluasi
                    </TabsTrigger>
                    <TabsTrigger value="development" className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 h-8 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=inactive]:text-muted-foreground">
                        <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
                        Pengembangan &amp; Refleksi
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="planning" className="space-y-8">
                    {/* Section: Data Utama */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <MaterialCard
                                materials={materials}
                                onAddMaterial={handleAddMaterial}
                                onDeleteMaterial={handleDeleteMaterial}
                                onInputClick={() => setCurrentView("material-input")}
                                onHistoryClick={() => setCurrentView("material-history")}
                            />
                            <LearningObjectiveCard
                                materials={materials}
                                learningObjectives={learningObjectives}
                                onAddLearningObjective={handleAddLearningObjective}
                                onDeleteLearningObjective={handleDeleteLearningObjective}
                                onInputClick={() => setCurrentView("tp-input")}
                                onHistoryClick={() => setCurrentView("tp-history")}
                            />
                        </div>
                    </div>

                    {/* Section: Dokumen Pendukung */}
                    <DocumentCategory
                        title="Perencanaan Pembelajaran"
                        description="Dokumen perencanaan pembelajaran semester ini"
                        documentTypes={[
                            "Capaian Pembelajaran (CP)",
                            "Alur Tujuan Pembelajaran (ATP)",
                            // "Tujuan Pembelajaran (TP)", // Removed as requested
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
