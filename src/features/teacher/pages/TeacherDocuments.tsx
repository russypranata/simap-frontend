"use client";

import React, { useState } from "react";
import { DocumentCategory } from "@/features/teacher/components/documents/DocumentCategory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate, getDayName } from "@/features/shared/utils/dateFormatter";
import { Calendar } from "lucide-react";
import { MaterialCard } from "@/features/teacher/components/planning/MaterialCard";
import { LearningObjectiveCard } from "@/features/teacher/components/planning/LearningObjectiveCard";
import { Material, LearningObjective, ACTIVE_ACADEMIC_YEAR, ACTIVE_SEMESTER, MOCK_MATERIALS, MOCK_LEARNING_OBJECTIVES } from "@/features/teacher/components/planning/types";
import { MaterialInputView } from "@/features/teacher/components/planning/MaterialInputView";
import { MaterialHistoryView } from "@/features/teacher/components/planning/MaterialHistoryView";
import { LearningObjectiveInputView } from "@/features/teacher/components/planning/LearningObjectiveInputView";
import { LearningObjectiveHistoryView } from "@/features/teacher/components/planning/LearningObjectiveHistoryView";

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
                            <span className="text-sm font-semibold">Tahun Ajaran {ACTIVE_ACADEMIC_YEAR}</span>
                        </div>
                        <div className="h-4 w-[1px] bg-border" />
                        <span className="text-muted-foreground text-sm font-medium text-primary">
                            Semester {ACTIVE_SEMESTER}
                        </span>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="planning" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="planning">Perencanaan Pembelajaran</TabsTrigger>
                    <TabsTrigger value="assessment">Asesmen & Evaluasi</TabsTrigger>
                    <TabsTrigger value="development">Pengembangan & Refleksi</TabsTrigger>
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
