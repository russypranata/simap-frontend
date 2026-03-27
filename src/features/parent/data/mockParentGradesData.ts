// Types for Parent Grades
export interface GradeRecord {
    id: number;
    subject: string;
    teacher: string;
    dailyScore: number;
    midTermScore: number;
    finalScore: number;
    averageScore: number;
    grade: string;
    kkm: number;
    description: string;
    notes: string;
}

export interface SemesterGrade {
    semester: "Ganjil" | "Genap";
    academicYear: string;
    averageScore: number;
    rank: number;
    totalStudents: number;
    grades: GradeRecord[];
}

export interface ChildGradesData {
    childId: string;
    childName: string;
    nis: string;
    nisn: string;
    class: string;
    semesters: SemesterGrade[];
}

// Predikat helper
export const getPredikat = (score: number): string => {
    if (score >= 90) return "A";
    if (score >= 85) return "A-";
    if (score >= 80) return "B+";
    if (score >= 75) return "B";
    if (score >= 70) return "B-";
    if (score >= 65) return "C+";
    if (score >= 60) return "C";
    return "D";
};

// Mock data for Child 1 (Ahmad Santoso - X-A)
export const mockGradesChild1: ChildGradesData = {
    childId: "student-1",
    childName: "Ahmad Santoso",
    nis: "0012345678",
    nisn: "00123456789",
    class: "X-A",
    semesters: [
        {
            semester: "Ganjil",
            academicYear: "2025/2026",
            averageScore: 85.2,
            rank: 5,
            totalStudents: 32,
            grades: [
                {
                    id: 1,
                    subject: "Pendidikan Agama Islam",
                    teacher: "Usman Abdullah, S.Ag.",
                    dailyScore: 92,
                    midTermScore: 90,
                    finalScore: 93,
                    averageScore: 92,
                    grade: "A",
                    kkm: 75,
                    description: "Menunjukkan pemahaman yang sangat baik dalam fikih, akidah, dan sejarah kebudayaan Islam. Aktif dalam diskusi kelas dan praktik ibadah.",
                    notes: "Pertahankan prestasi dan tingkatkan lagi dalam tahfidz Al-Qur'an."
                },
                {
                    id: 2,
                    subject: "Matematika",
                    teacher: "Ahmad Fauzi, S.Pd.",
                    dailyScore: 85,
                    midTermScore: 82,
                    finalScore: 88,
                    averageScore: 85,
                    grade: "A-",
                    kkm: 75,
                    description: "Menguasai konsep aljabar, fungsi, dan trigonometri dengan baik. Mampu menyelesaikan soal-soal HOTS dengan tepat.",
                    notes: "Tingkatkan lagi dalam geometri analitik dan kalkulus dasar."
                },
                {
                    id: 3,
                    subject: "Fisika",
                    teacher: "Sari Wahyuni, S.Si., M.Si.",
                    dailyScore: 78,
                    midTermScore: 80,
                    finalScore: 82,
                    averageScore: 80,
                    grade: "B+",
                    kkm: 75,
                    description: "Memahami konsep kinematika, dinamika, dan fluida dengan baik. Praktikum dilakukan dengan teliti.",
                    notes: "Perbanyak latihan soal cerita dan pemahaman konsep vektor."
                },
                {
                    id: 4,
                    subject: "Kimia",
                    teacher: "Rudi Hartono, S.Si.",
                    dailyScore: 82,
                    midTermScore: 85,
                    finalScore: 84,
                    averageScore: 84,
                    grade: "A-",
                    kkm: 75,
                    description: "Menguasai stoikiometri, struktur atom, dan ikatan kimia. Praktikum laboratorium dilakukan dengan baik.",
                    notes: "Tingkatkan dalam pemahaman reaksi redoks dan elektrokimia."
                },
                {
                    id: 5,
                    subject: "Biologi",
                    teacher: "Ani Lestari, S.Si., M.Si.",
                    dailyScore: 88,
                    midTermScore: 90,
                    finalScore: 92,
                    averageScore: 90,
                    grade: "A",
                    kkm: 75,
                    description: "Sangat baik dalam memahami sistem organ manusia, genetika, dan keanekaragaman hayati. Laporan praktikum lengkap.",
                    notes: "Pertahankan! Bisa dipertimbangkan untuk olimpiade biologi."
                },
                {
                    id: 6,
                    subject: "Bahasa Indonesia",
                    teacher: "Dewi Sartika, S.Pd., M.Pd.",
                    dailyScore: 80,
                    midTermScore: 78,
                    finalScore: 82,
                    averageScore: 80,
                    grade: "B+",
                    kkm: 75,
                    description: "Mampu menganalisis teks eksposisi, prosedur, dan laporan. Presentasi dilakukan dengan baik.",
                    notes: "Tingkatkan lagi dalam menulis karya ilmiah dan membaca puisi."
                },
                {
                    id: 7,
                    subject: "Bahasa Inggris",
                    teacher: "Budi Santoso, S.Pd., M.Ed.",
                    dailyScore: 85,
                    midTermScore: 88,
                    finalScore: 86,
                    averageScore: 86,
                    grade: "A-",
                    kkm: 75,
                    description: "Good command of English in reading, writing, and speaking. Able to compose various text types correctly.",
                    notes: "Keep improving! Try to participate in English debate competition."
                },
                {
                    id: 8,
                    subject: "Sejarah Indonesia",
                    teacher: "Hendra Gunawan, S.Hum., M.Hum.",
                    dailyScore: 78,
                    midTermScore: 75,
                    finalScore: 80,
                    averageScore: 78,
                    grade: "B",
                    kkm: 75,
                    description: "Memahami kronologi sejarah Indonesia dari masa praaksara hingga reformasi. Aktif dalam diskusi.",
                    notes: "Perbanyak membaca sumber sejarah primer untuk pemahaman lebih dalam."
                },
                {
                    id: 9,
                    subject: "Pendidikan Kewarganegaraan",
                    teacher: "Rina Wijaya, S.Sos., M.Si.",
                    dailyScore: 82,
                    midTermScore: 80,
                    finalScore: 84,
                    averageScore: 82,
                    grade: "B+",
                    kkm: 75,
                    description: "Memahami sistem pemerintahan, demokrasi, dan HAM dengan baik. Partisipasi dalam diskusi kelas baik.",
                    notes: "Tingkatkan dalam analisis kasus-kasus kontemporer."
                },
                {
                    id: 10,
                    subject: "Seni Budaya",
                    teacher: "Ratna Sari, S.Sn.",
                    dailyScore: 88,
                    midTermScore: 85,
                    finalScore: 90,
                    averageScore: 88,
                    grade: "A-",
                    kkm: 75,
                    description: "Kreatif dalam berkarya seni rupa, musik, dan tari. Menghasilkan karya orisinal yang menarik.",
                    notes: "Kembangkan bakat seni dan pertimbangkan untuk ikut pameran sekolah."
                },
                {
                    id: 11,
                    subject: "Pendidikan Jasmani, Olahraga, dan Kesehatan",
                    teacher: "Dedi Kurniawan, S.Pd.",
                    dailyScore: 85,
                    midTermScore: 88,
                    finalScore: 87,
                    averageScore: 87,
                    grade: "A-",
                    kkm: 75,
                    description: "Terampil dalam berbagai cabang olahraga. Kondisi fisik prima dan sportivitas tinggi.",
                    notes: "Pertahankan! Bisa mewakili sekolah dalam lomba olahraga."
                },
                {
                    id: 12,
                    subject: "Prakarya dan Kewirausahaan",
                    teacher: "Joko Susilo, S.Pd.",
                    dailyScore: 86,
                    midTermScore: 84,
                    finalScore: 88,
                    averageScore: 86,
                    grade: "A-",
                    kkm: 75,
                    description: "Kreatif dalam membuat produk kerajinan dan memiliki jiwa kewirausahaan yang baik.",
                    notes: "Kembangkan ide bisnis dan ikuti program young entrepreneur sekolah."
                },
                {
                    id: 13,
                    subject: "Teknologi Informasi dan Komunikasi",
                    teacher: "Fajar Nugroho, S.Kom.",
                    dailyScore: 90,
                    midTermScore: 92,
                    finalScore: 91,
                    averageScore: 91,
                    grade: "A",
                    kkm: 75,
                    description: "Sangat mahir dalam pengoperasian komputer, programming dasar, dan pengolahan data digital.",
                    notes: "Prestasi luar biasa! Lanjutkan ke pemrograman tingkat lanjut."
                },
                {
                    id: 14,
                    subject: "Bahasa Arab",
                    teacher: "Yuli Astuti, S.Pd.",
                    dailyScore: 75,
                    midTermScore: 72,
                    finalScore: 78,
                    averageScore: 75,
                    grade: "B",
                    kkm: 75,
                    description: "Mampu membaca dan menulis huruf Arab dengan baik. Pemahaman nahwu-shorof dasar cukup.",
                    notes: "Tingkatkan dalam muhadatsah (percakapan) dan kosakata."
                }
            ]
        },
        {
            semester: "Genap",
            academicYear: "2024/2025",
            averageScore: 84.5,
            rank: 6,
            totalStudents: 32,
            grades: [
                {
                    id: 101,
                    subject: "Pendidikan Agama Islam",
                    teacher: "Usman Abdullah, S.Ag.",
                    dailyScore: 90,
                    midTermScore: 92,
                    finalScore: 91,
                    averageScore: 91,
                    grade: "A",
                    kkm: 75,
                    description: "Menunjukkan peningkatan dalam pemahaman fikih muamalah dan sejarah Islam.",
                    notes: "Pertahankan prestasi."
                },
                {
                    id: 102,
                    subject: "Matematika",
                    teacher: "Ahmad Fauzi, S.Pd.",
                    dailyScore: 82,
                    midTermScore: 80,
                    finalScore: 84,
                    averageScore: 82,
                    grade: "B+",
                    kkm: 75,
                    description: "Menguasai konsep statistika dan peluang dengan baik.",
                    notes: "Tingkatkan dalam pemecahan masalah."
                }
            ]
        }
    ]
};

// Mock data for Child 2 (Siti Aminah - XI-B)
export const mockGradesChild2: ChildGradesData = {
    childId: "student-2",
    childName: "Siti Aminah",
    nis: "0012345679",
    nisn: "00123456790",
    class: "XI-B",
    semesters: [
        {
            semester: "Ganjil",
            academicYear: "2025/2026",
            averageScore: 87.5,
            rank: 3,
            totalStudents: 30,
            grades: [
                {
                    id: 201,
                    subject: "Pendidikan Agama Islam",
                    teacher: "Usman Abdullah, S.Ag.",
                    dailyScore: 95,
                    midTermScore: 93,
                    finalScore: 96,
                    averageScore: 95,
                    grade: "A",
                    kkm: 75,
                    description: "Sangat baik dalam semua aspek. Hafalan Al-Qur'an meningkat signifikan.",
                    notes: "Luar biasa! Terus pertahankan."
                },
                {
                    id: 202,
                    subject: "Ekonomi",
                    teacher: "Hartati Susanti, S.E., M.E.",
                    dailyScore: 88,
                    midTermScore: 90,
                    finalScore: 89,
                    averageScore: 89,
                    grade: "A-",
                    kkm: 75,
                    description: "Memahami konsep ekonomi mikro dan makro dengan baik.",
                    notes: "Tingkatkan dalam analisis kasus ekonomi kontemporer."
                },
                {
                    id: 203,
                    subject: "Sosiologi",
                    teacher: "Gunawan Pratama, S.Sos., M.Si.",
                    dailyScore: 85,
                    midTermScore: 87,
                    finalScore: 86,
                    averageScore: 86,
                    grade: "A-",
                    kkm: 75,
                    description: "Mampu menganalisis fenomena sosial dengan baik.",
                    notes: "Kembangkan dalam penelitian sosial."
                }
            ]
        }
    ]
};

// Map child IDs to their grades
export const childGradesMap: Record<string, ChildGradesData> = {
    "student-1": mockGradesChild1,
    "student-2": mockGradesChild2,
};

// Get grades for a child
export const getChildGrades = async (
    childId: string,
    academicYearId?: string,
    semesterId?: string
): Promise<ChildGradesData> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const childData = childGradesMap[childId];

    if (!childData) {
        throw new Error(`Data nilai untuk anak dengan ID ${childId} tidak ditemukan.`);
    }

    return childData;
};
