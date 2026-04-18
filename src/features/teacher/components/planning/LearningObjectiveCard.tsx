/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Plus, History } from "lucide-react";
import { Material, LearningObjective, ACTIVE_ACADEMIC_YEAR, ACTIVE_SEMESTER } from "./types";

interface LearningObjectiveCardProps {
    materials: Material[];
    learningObjectives: LearningObjective[];
    onAddLearningObjective: (lo: Omit<LearningObjective, "id" | "createdAt">) => void;
    onDeleteLearningObjective: (id: string) => void;
    onInputClick: () => void;
    onHistoryClick: () => void;
}

export const LearningObjectiveCard: React.FC<LearningObjectiveCardProps> = ({
    materials,
    learningObjectives,
    onAddLearningObjective,
    onDeleteLearningObjective,
    onInputClick,
    onHistoryClick
}) => {
    const activeTPCount = learningObjectives.filter(
        (tp) =>
            tp.academicYear === ACTIVE_ACADEMIC_YEAR &&
            tp.semester === ACTIVE_SEMESTER
    ).length;

    // Check if there are any materials for the active semester
    const hasActiveMaterials = materials.some(
        (m) =>
            m.academicYear === ACTIVE_ACADEMIC_YEAR &&
            m.semester === ACTIVE_SEMESTER
    );

    const handleInputClick = () => {
        if (!hasActiveMaterials) {
            alert("Input Materi untuk semester aktif terlebih dahulu sebelum menambahkan TP.");
            return;
        }
        onInputClick();
    };

    return (
        <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 flex-1">
                <div className="flex justify-between items-start">
                    <div className="p-2 bg-slate-100 rounded-lg">
                        <Target className="h-5 w-5 text-slate-600" />
                    </div>
                    {activeTPCount > 0 ? (
                        <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                            {activeTPCount} TP
                        </Badge>
                    ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                            Belum Input
                        </Badge>
                    )}
                </div>
                <CardTitle className="mt-4 text-lg">Tujuan Pembelajaran (TP)</CardTitle>
                <CardDescription className="line-clamp-2">
                    TP yang diturunkan dari materi
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex space-x-2">
                    <Button
                        className="flex-1"
                        variant="outline"
                        onClick={handleInputClick}
                        disabled={!hasActiveMaterials}
                        title={!hasActiveMaterials ? "Input Materi untuk semester aktif terlebih dahulu" : "Input Tujuan Pembelajaran"}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Input TP
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onHistoryClick}
                        title="Riwayat"
                    >
                        <History className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
