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
import { FileText, Plus, History, BookOpen } from "lucide-react";
import { Material, ACTIVE_ACADEMIC_YEAR, ACTIVE_SEMESTER } from "./types";

interface MaterialCardProps {
    materials: Material[];
    onAddMaterial: (material: Omit<Material, "id" | "createdAt">) => void;
    onDeleteMaterial: (id: string) => void;
    onInputClick: () => void;
    onHistoryClick: () => void;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({
    materials,
    onAddMaterial,
    onDeleteMaterial,
    onInputClick,
    onHistoryClick,
}) => {
    const activeMaterialsCount = materials.filter(
        (m) =>
            m.academicYear === ACTIVE_ACADEMIC_YEAR &&
            m.semester === ACTIVE_SEMESTER
    ).length;

    return (
        <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 flex-1">
                <div className="flex justify-between items-start">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    {activeMaterialsCount > 0 ? (
                        <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                            {activeMaterialsCount} Materi
                        </Badge>
                    ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                            Belum Input
                        </Badge>
                    )}
                </div>
                <CardTitle className="mt-4 text-lg">Materi Pembelajaran</CardTitle>
                <CardDescription className="line-clamp-2">
                    Daftar materi yang diajarkan semester ini
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex space-x-2">
                    <Button
                        className="flex-1"
                        variant="outline"
                        onClick={onInputClick}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Input Materi
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
