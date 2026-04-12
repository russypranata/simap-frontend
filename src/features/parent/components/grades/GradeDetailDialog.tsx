"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { AlertCircle, Award, BookOpen, BookText, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { getGradeColor, getScoreColor } from "./helpers";
import type { SubjectGrade } from "./types";

interface GradeDetailDialogProps {
    grade: SubjectGrade | null;
    onClose: () => void;
}

export const GradeDetailDialog: React.FC<GradeDetailDialogProps> = ({ grade, onClose }) => {
    if (!grade) return null;
    return (
        <Dialog open={!!grade} onOpenChange={(open) => { if (!open) onClose(); }}>
            <DialogContent className="sm:max-w-[520px] max-h-[85vh] flex flex-col rounded-2xl">
                <DialogHeader className="flex-row items-center gap-4 flex-shrink-0">
                    <div className="p-2.5 bg-blue-100 rounded-xl">
                        <BookText className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                        <DialogTitle className="text-lg font-semibold text-slate-900">{grade.subject}</DialogTitle>
                        <DialogDescription className="text-slate-500">{grade.teacher}</DialogDescription>
                    </div>
                </DialogHeader>
                <div className="space-y-4 py-2 overflow-y-auto flex-1 pr-1">
                    {/* KKM Info */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-sm font-semibold text-slate-600">KKM (Kriteria Ketuntasan Minimal)</span>
                        <Badge variant="outline" className="font-bold text-slate-700 border-slate-300">{grade.kkm}</Badge>
                    </div>

                    {/* KI-3 */}
                    <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                                </div>
                                <span className="text-sm font-semibold text-slate-800">KI-3 (Pengetahuan)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={cn("text-lg font-bold", getScoreColor(grade.ki3Average, grade.kkm))}>{grade.ki3Average}</span>
                                <Badge className={cn("text-xs", getGradeColor(grade.ki3Predicate))}>{grade.ki3Predicate}</Badge>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {grade.ki3Scores.map((s, i) => (
                                <span key={i} className={cn("text-xs font-semibold px-2 py-0.5 rounded-md border", getScoreColor(s, grade.kkm), "bg-white border-slate-200")}>
                                    {s}
                                </span>
                            ))}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed italic">{grade.ki3Description || "Siswa menunjukkan pemahaman yang baik pada aspek pengetahuan."}</p>
                    </div>

                    {/* KI-4 */}
                    <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                                    <Award className="h-3.5 w-3.5 text-emerald-600" />
                                </div>
                                <span className="text-sm font-semibold text-slate-800">KI-4 (Keterampilan)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={cn("text-lg font-bold", getScoreColor(grade.ki4Average, grade.kkm))}>{grade.ki4Average}</span>
                                <Badge className={cn("text-xs", getGradeColor(grade.ki4Predicate))}>{grade.ki4Predicate}</Badge>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {grade.ki4Scores.map((s, i) => (
                                <span key={i} className={cn("text-xs font-semibold px-2 py-0.5 rounded-md border", getScoreColor(s, grade.kkm), "bg-white border-slate-200")}>
                                    {s}
                                </span>
                            ))}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed italic">{grade.ki4Description || "Siswa menunjukkan keterampilan yang baik pada aspek praktik."}</p>
                    </div>

                    {/* Final */}
                    <div className={cn("flex items-center justify-between p-4 rounded-xl border-2",
                        grade.finalAverage >= grade.kkm ? "bg-emerald-50 border-emerald-300" : "bg-red-50 border-red-300"
                    )}>
                        <div>
                            <p className="text-sm font-semibold text-slate-700">Nilai Akhir</p>
                            <p className="text-xs text-slate-500 mt-0.5">
                                {grade.finalAverage >= grade.kkm ? "✓ Tuntas KKM" : "✗ Belum Tuntas KKM"}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={cn("text-3xl font-bold", getScoreColor(grade.finalAverage, grade.kkm))}>{grade.finalAverage}</span>
                            <Badge variant="outline" className={cn("text-sm font-bold px-3 py-1", getGradeColor(grade.finalGrade))}>{grade.finalGrade}</Badge>
                        </div>
                    </div>

                    {/* Remedial / Pengayaan */}
                    {grade.remedial && (
                        <div className={cn("p-4 rounded-xl border space-y-2",
                            grade.remedial.type === "remedial"
                                ? "border-amber-200 bg-amber-50/40"
                                : "border-purple-200 bg-purple-50/40"
                        )}>
                            <div className="flex items-center gap-2">
                                <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center",
                                    grade.remedial.type === "remedial" ? "bg-amber-100" : "bg-purple-100"
                                )}>
                                    {grade.remedial.type === "remedial"
                                        ? <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                                        : <Star className="h-3.5 w-3.5 text-purple-600" />
                                    }
                                </div>
                                <span className={cn("text-sm font-semibold",
                                    grade.remedial.type === "remedial" ? "text-amber-800" : "text-purple-800"
                                )}>
                                    {grade.remedial.type === "remedial" ? "Remedial (RTL)" : "Pengayaan"}
                                </span>
                            </div>
                            {grade.remedial.type === "remedial" && (
                                <div className="grid grid-cols-2 gap-2 pt-1">
                                    {grade.remedial.date && (
                                        <div className="text-xs text-slate-600">
                                            <span className="font-semibold text-slate-700">Tanggal: </span>
                                            {new Date(grade.remedial.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                                        </div>
                                    )}
                                    {grade.remedial.scoreAfter !== undefined && (
                                        <div className="text-xs text-slate-600">
                                            <span className="font-semibold text-slate-700">Nilai Setelah: </span>
                                            <span className={cn("font-bold", getScoreColor(grade.remedial.scoreAfter, grade.kkm))}>
                                                {grade.remedial.scoreAfter}
                                            </span>
                                        </div>
                                    )}
                                    {grade.remedial.material && (
                                        <div className="text-xs text-slate-600 col-span-2">
                                            <span className="font-semibold text-slate-700">Materi: </span>
                                            {grade.remedial.material}
                                        </div>
                                    )}
                                </div>
                            )}
                            {grade.remedial.type === "pengayaan" && (
                                <p className="text-xs text-purple-700">Siswa telah mencapai nilai di atas KKM dan mengikuti program pengayaan.</p>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
