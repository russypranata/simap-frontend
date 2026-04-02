import { useState, useCallback, useMemo } from "react";
import { mockParentProfile } from "../data/mockParentData";
import type { SubjectGrade, AcademicYear, AttitudeScore, AttendanceSummary, Extracurricular, SemesterSummary } from "../components/grades";

// ── Mock data (would come from API in production) ──────────────────────────

const academicYears: AcademicYear[] = [
    {
        id: "2025-2026", year: "2025/2026",
        semesters: [
            { id: "ganjil", label: "Ganjil", status: "active" },
            { id: "genap", label: "Genap", status: "upcoming" },
        ],
    },
    {
        id: "2024-2025", year: "2024/2025",
        semesters: [
            { id: "genap", label: "Genap", status: "completed" },
            { id: "ganjil", label: "Ganjil", status: "completed" },
        ],
    },
];

const mockGrades: SubjectGrade[] = [
    { id: 1, subject: "Matematika", teacher: "Ahmad Hidayat, S.Pd", ki3Scores: [85, 88, 82, 86], ki3Average: 85, ki3Predicate: "A", ki3Description: "Menunjukkan pemahaman yang sangat baik dalam aljabar, geometri, dan kalkulus dasar.", ki4Scores: [88, 85, 90], ki4Average: 88, ki4Predicate: "A", ki4Description: "Terampil dalam menyelesaikan masalah matematika dan menyajikan solusi secara sistematis.", finalAverage: 86, finalGrade: "A", kkm: 75, academicYear: "2025/2026", semester: "ganjil" },
    { id: 2, subject: "Fisika", teacher: "Sari Wahyuni, S.Pd", ki3Scores: [78, 80, 82, 79], ki3Average: 80, ki3Predicate: "B", ki3Description: "Memahami konsep fisika dasar dengan baik. Perlu peningkatan dalam pemahaman fisika modern.", ki4Scores: [82, 85, 80], ki4Average: 82, ki4Predicate: "A", ki4Description: "Terampil dalam melakukan eksperimen dan analisis data.", finalAverage: 81, finalGrade: "B+", kkm: 75, academicYear: "2025/2026", semester: "ganjil", remedial: { type: "remedial", date: "2024-12-10", scoreAfter: 82, material: "Fisika Modern & Gelombang" } },
    { id: 3, subject: "Kimia", teacher: "Rudi Hartono, S.Pd", ki3Scores: [82, 85, 84, 86], ki3Average: 84, ki3Predicate: "A", ki3Description: "Penguasaan konsep kimia organik dan anorganik sangat baik.", ki4Scores: [85, 88, 86], ki4Average: 86, ki4Predicate: "A", ki4Description: "Terampil dalam praktikum laboratorium.", finalAverage: 85, finalGrade: "A", kkm: 75, academicYear: "2025/2026", semester: "ganjil" },
    { id: 4, subject: "Biologi", teacher: "Ani Suryani, S.Pd", ki3Scores: [88, 90, 92, 89], ki3Average: 90, ki3Predicate: "A", ki3Description: "Prestasi luar biasa dalam biologi molekuler dan genetika.", ki4Scores: [92, 90, 94], ki4Average: 92, ki4Predicate: "A", ki4Description: "Keterampilan observasi dan analisis data biologi sangat baik.", finalAverage: 91, finalGrade: "A", kkm: 75, academicYear: "2025/2026", semester: "ganjil", remedial: { type: "pengayaan" } },
    { id: 5, subject: "Bahasa Indonesia", teacher: "Dewi Lestari, S.Pd", ki3Scores: [80, 78, 82, 81], ki3Average: 80, ki3Predicate: "B", ki3Description: "Memahami kaidah bahasa Indonesia dengan baik.", ki4Scores: [82, 85, 83], ki4Average: 83, ki4Predicate: "A", ki4Description: "Terampil menulis berbagai jenis teks.", finalAverage: 81, finalGrade: "B+", kkm: 75, academicYear: "2025/2026", semester: "ganjil" },
    { id: 6, subject: "Bahasa Inggris", teacher: "Budi Santoso, S.Pd", ki3Scores: [85, 88, 86, 87], ki3Average: 86, ki3Predicate: "A", ki3Description: "Excellent understanding of English grammar and vocabulary.", ki4Scores: [88, 85, 90], ki4Average: 88, ki4Predicate: "A", ki4Description: "Fluent in speaking and writing.", finalAverage: 87, finalGrade: "A", kkm: 75, academicYear: "2025/2026", semester: "ganjil" },
];

const mockAttitude: AttitudeScore = {
    spiritual: { score: "A", predicate: "Sangat Baik", description: "Menunjukkan sikap spiritual yang sangat baik. Rajin beribadah, jujur, dan berakhlak mulia." },
    social: { score: "A", predicate: "Sangat Baik", description: "Menunjukkan sikap sosial yang sangat baik. Peduli terhadap sesama dan aktif dalam kegiatan sosial." },
};

const mockExtracurriculars: Extracurricular[] = [
    { name: "Pramuka", type: "Wajib", score: "A", predicate: "Sangat Baik", description: "Aktif dalam semua kegiatan pramuka.", instructor: "Kak Ahmad Fauzi, S.Pd" },
    { name: "Basket", type: "Pilihan", score: "A", predicate: "Sangat Baik", description: "Terampil dalam teknik dasar basket.", instructor: "Kak Rudi Hermawan, S.Pd" },
    { name: "KIR", type: "Pilihan", score: "B", predicate: "Baik", description: "Aktif dalam penelitian ilmiah.", instructor: "Ibu Dr. Siti Aminah, M.Si" },
];

const mockAttendance: AttendanceSummary = { sick: 2, permission: 1, alpha: 0 };

const mockSemesterHistory: SemesterSummary[] = [
    { semester: "Genap", academicYear: "2024/2025", averageScore: 84.5, rank: 6, totalStudents: 32 },
    { semester: "Ganjil", academicYear: "2024/2025", averageScore: 83.8, rank: 8, totalStudents: 32 },
];

const mockReportCardNotes = [
    { category: "Prestasi Akademik", note: "Ananda menunjukkan peningkatan yang signifikan dalam mata pelajaran IPA, khususnya Biologi dan Kimia.", icon: "🏆" },
    { category: "Sikap dan Perilaku", note: "Ananda aktif dalam kegiatan kelas dan menunjukkan sikap yang baik terhadap guru dan teman.", icon: "⭐" },
    { category: "Ekstrakurikuler", note: "Ananda aktif mengikuti kegiatan Pramuka dan Basket. Menunjukkan kepemimpinan yang baik.", icon: "🎯" },
    { category: "Catatan Wali Kelas", note: "Secara keseluruhan, Ananda adalah siswa yang berprestasi dan menjadi kebanggaan kelas.", icon: "📝" },
];

// ── Hook ───────────────────────────────────────────────────────────────────

const getDefaultSemester = () => {
    for (const year of academicYears) {
        const completed = year.semesters.find(s => s.status === "completed");
        if (completed) return completed.id;
    }
    return "ganjil";
};

const getDefaultYearId = () => {
    for (const year of academicYears) {
        if (year.semesters.some(s => s.status === "completed")) return year.id;
    }
    return academicYears[0]?.id ?? "2025-2026";
};

export const useParentGrades = () => {
    const children = mockParentProfile.children;

    const [selectedChildId, setSelectedChildId] = useState(children[0]?.id ?? "");
    const [selectedYearId, setSelectedYearId] = useState(getDefaultYearId);
    const [selectedSemester, setSelectedSemester] = useState(getDefaultSemester);
    const [selectedTab, setSelectedTab] = useState("nilai");
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedGrade, setSelectedGrade] = useState<SubjectGrade | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const selectedChild = children.find(c => c.id === selectedChildId);
    const activeYear = academicYears.find(y => y.id === selectedYearId);
    const displaySemester = selectedSemester === "ganjil" ? "Ganjil" : "Genap";
    const currentSemesterStatus = activeYear?.semesters.find(s => s.id === selectedSemester)?.status ?? "completed";
    const isReportAvailable = currentSemesterStatus === "completed";

    const stats = useMemo(() => {
        const totalAverage = mockGrades.reduce((sum, g) => sum + g.finalAverage, 0) / mockGrades.length;
        const highestSubject = mockGrades.reduce((prev, cur) => prev.finalAverage > cur.finalAverage ? prev : cur);
        const lowestSubject = mockGrades.reduce((prev, cur) => prev.finalAverage < cur.finalAverage ? prev : cur);
        const aboveKKM = mockGrades.filter(g => g.finalAverage >= g.kkm).length;
        const currentRank = mockSemesterHistory[0]?.rank ?? "-";
        const totalStudents = mockSemesterHistory[0]?.totalStudents ?? "-";
        return {
            totalAverage: Math.round(totalAverage * 10) / 10,
            highestSubject, lowestSubject, aboveKKM,
            totalSubjects: mockGrades.length, currentRank, totalStudents,
        };
    }, []);

    const handleApplyFilter = useCallback((yearId: string, semester: string) => {
        setIsLoading(true);
        setSelectedYearId(yearId);
        setSelectedSemester(semester);
        setTimeout(() => setIsLoading(false), 600);
    }, []);

    return {
        // Data
        children, selectedChild, academicYears, activeYear,
        grades: mockGrades, attitude: mockAttitude,
        extracurriculars: mockExtracurriculars, attendance: mockAttendance,
        semesterHistory: mockSemesterHistory, reportCardNotes: mockReportCardNotes,
        stats, isReportAvailable, displaySemester, currentSemesterStatus,

        // State
        selectedChildId, setSelectedChildId,
        selectedYearId, selectedSemester,
        selectedTab, setSelectedTab,
        filterOpen, setFilterOpen,
        selectedGrade, setSelectedGrade,
        isLoading,

        // Actions
        handleApplyFilter,
    };
};
