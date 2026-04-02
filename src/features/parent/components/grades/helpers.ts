export const getGradeColor = (grade: string): string => {
    if (grade === "A") return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (grade === "B") return "bg-blue-100 text-blue-700 border-blue-200";
    if (grade === "C") return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-red-100 text-red-700 border-red-200";
};

export const getScoreColor = (score: number, kkm: number): string => {
    if (score >= kkm + 15) return "text-emerald-600";
    if (score >= kkm) return "text-blue-600";
    return "text-red-600";
};
