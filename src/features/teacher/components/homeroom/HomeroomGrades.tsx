import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const HomeroomGrades = () => {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Rekap Nilai Siswa</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">Fitur Rekap Nilai akan segera hadir</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
