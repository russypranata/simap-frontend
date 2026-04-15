"use client";

import React, { useState } from "react";
import { DocumentCategory } from "@/features/teacher/components/documents/DocumentCategory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate, getDayName } from "@/features/shared/utils/dateFormatter";
import { Calendar, BookOpen, ClipboardCheck, TrendingUp } from "lucide-react";
import { MaterialCard } from "@/features/teacher/components/planning/MaterialCard";
import { LearningObjectiveCard } from "@/features/teacher/components/planning/LearningObjectiveCard";
import { Material, LearningObjective, ACTIVE_ACADEMIC_YEAR, ACTIVE_SEMESTER, MOCK_MATERIALS, MOCK_LEARNING_OBJECTIVES } from "@/features/teacher/components/planning/types";
import { MaterialInputView } from "@/features/teacher/components/planning/MaterialInputView";
import { MaterialHistoryView } from "@/features/teacher/components/planning/MaterialHistoryView";
import { LearningObjectiveInputView } from "@/features/teacher/components/planning/LearningObjectiveInputView";
import { LearningObjectiveHistoryView } from "@/features/teacher/components/planning/LearningObjectiveHistoryView";
import { PageHeader } from "@/features/shared/components";

type ViewType = "dashboard" | "material-input" | "material-history" | "tp-input" | "tp-history";

export const TeacherDocuments = () => {
    const [currentView, setCurrentView] = useState<ViewType>("dashboard");
    const [materials, setMaterials] = useState<Material[]>(MOCK_MATERIALS);
    const [learningObjectives, setLearningObjectives] = useState<LearningObjective[]>(MOCK_LEARNING_OBJECTIVES);

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
