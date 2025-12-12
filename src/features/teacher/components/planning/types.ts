export type ApprovalStatus = "DRAFT" | "PENDING" | "APPROVED" | "REJECTED";

export interface Material {
    id: string;
    name: string;
    code?: string; // Urutan/Kode (e.g., M1)
    description: string;
    subject: string;
    semester: string;
    academicYear: string;
    status: ApprovalStatus;
    createdAt: string;
}

export interface LearningObjective {
    id: string;
    materialId: string;
    code?: string; // Kode TP (e.g., TP 1.1)
    title: string;
    description: string; // Isi TP
    indicators?: string; // Indikator Pembelajaran
    semester: string;
    academicYear: string;
    status: ApprovalStatus;
    createdAt: string;
}

// Mock Data
export const ACTIVE_ACADEMIC_YEAR = "2025/2026";
export const ACTIVE_SEMESTER = "Ganjil";

export const MOCK_SUBJECTS = [
    "Matematika",
    "Bahasa Indonesia",
    "IPA",
    "IPS",
    "Bahasa Inggris"
];

export const MOCK_SEMESTERS = [
    "Ganjil",
    "Genap"
];

export const MOCK_MATERIALS: Material[] = [
    // Active Year (2025/2026 Ganjil)
    {
        id: "m1",
        code: "M1",
        name: "Aljabar Linear",
        description: "Konsep dasar matriks, vektor, dan sistem persamaan linear",
        subject: "Matematika",
        semester: "Ganjil",
        academicYear: "2025/2026",
        status: "APPROVED",
        createdAt: "2025-07-15T08:00:00Z"
    },
    {
        id: "m2",
        code: "M2",
        name: "Persamaan Kuadrat",
        description: "Pemahaman mendalam tentang akar-akar persamaan kuadrat",
        subject: "Matematika",
        semester: "Ganjil",
        academicYear: "2025/2026",
        status: "PENDING",
        createdAt: "2025-07-16T09:30:00Z"
    },
    {
        id: "m3",
        code: "M3",
        name: "Trigonometri Lanjut",
        description: "Identitas trigonometri dan aplikasinya",
        subject: "Matematika",
        semester: "Ganjil",
        academicYear: "2025/2026",
        status: "DRAFT",
        createdAt: "2025-07-20T10:15:00Z"
    },
    // Past Year (2024/2025)
    {
        id: "m_past_1",
        code: "M1",
        name: "Statistika Dasar",
        description: "Pengumpulan dan penyajian data statistik",
        subject: "Matematika",
        semester: "Genap",
        academicYear: "2024/2025",
        status: "APPROVED",
        createdAt: "2025-01-10T08:00:00Z"
    },
    {
        id: "m_past_2",
        code: "M2",
        name: "Peluang",
        description: "Konsep dasar probabilitas",
        subject: "Matematika",
        semester: "Genap",
        academicYear: "2024/2025",
        status: "APPROVED",
        createdAt: "2025-02-15T08:00:00Z"
    }
];

export const MOCK_LEARNING_OBJECTIVES: LearningObjective[] = [
    // For M1 (Approved)
    {
        id: "tp1",
        materialId: "m1",
        code: "TP 1.1",
        title: "Operasi Matriks",
        description: "Peserta didik mampu melakukan operasi penjumlahan, pengurangan, dan perkalian matriks.",
        indicators: "1. Menjumlahkan dua matriks\n2. Mengalikan matriks dengan skalar",
        semester: "Ganjil",
        academicYear: "2025/2026",
        status: "APPROVED",
        createdAt: "2025-07-15T08:10:00Z"
    },
    {
        id: "tp2",
        materialId: "m1",
        code: "TP 1.2",
        title: "Determinan Matriks",
        description: "Peserta didik mampu menghitung determinan matriks ordo 2x2 dan 3x3.",
        indicators: "1. Menghitung determinan 2x2\n2. Menghitung determinan 3x3",
        semester: "Ganjil",
        academicYear: "2025/2026",
        status: "PENDING",
        createdAt: "2025-07-15T08:15:00Z"
    },
    // For M2 (Pending)
    {
        id: "tp3",
        materialId: "m2",
        code: "TP 2.1",
        title: "Akar Persamaan",
        description: "Peserta didik dapat menentukan akar persamaan kuadrat dengan faktorisasi.",
        semester: "Ganjil",
        academicYear: "2025/2026",
        status: "DRAFT",
        createdAt: "2025-07-16T09:40:00Z"
    },
    // Past Year
    {
        id: "tp_past_1",
        materialId: "m_past_1",
        code: "TP 1.1",
        title: "Mean, Median, Modus",
        description: "Menghitung ukuran pemusatan data.",
        semester: "Genap",
        academicYear: "2024/2025",
        status: "APPROVED",
        createdAt: "2025-01-10T08:10:00Z"
    }
];
