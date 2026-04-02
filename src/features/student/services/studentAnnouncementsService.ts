// ============================================
// STUDENT ANNOUNCEMENTS SERVICE
// ============================================

export interface Announcement {
    id: number;
    title: string;
    content: string;
    category: "academic" | "event" | "schedule" | "general" | "achievement";
    date: string;
    author: string;
    isRead: boolean;
    isPinned: boolean;
    attachments?: string[];
}

const initialAnnouncements: Announcement[] = [
    {
        id: 1,
        title: "Jadwal Ujian Akhir Semester Ganjil 2025/2026",
        content: "Diberitahukan kepada seluruh siswa bahwa Ujian Akhir Semester (UAS) Ganjil akan dilaksanakan pada tanggal 13-20 Januari 2026. Harap mempersiapkan diri dengan baik dan mempelajari materi yang telah diajarkan. Jadwal lengkap dapat dilihat pada lampiran.\n\nKetentuan UAS:\n1. Siswa hadir 30 menit sebelum ujian dimulai\n2. Membawa alat tulis lengkap\n3. Dilarang membawa HP ke ruang ujian\n4. Berpakaian rapi sesuai ketentuan",
        category: "academic",
        date: "2026-01-10",
        author: "Tata Usaha / Admin",
        isRead: false,
        isPinned: true,
        attachments: ["Jadwal_UAS_Ganjil_2025-2026.pdf"],
    },
    {
        id: 2,
        title: "Libur Semester Ganjil 2025/2026",
        content: "Diberitahukan bahwa libur semester ganjil akan berlangsung dari tanggal 21 Januari - 3 Februari 2026. Siswa diharapkan memanfaatkan waktu libur dengan kegiatan positif dan mengerjakan tugas yang diberikan.",
        category: "schedule",
        date: "2026-01-09",
        author: "Tata Usaha / Admin",
        isRead: false,
        isPinned: false,
    },
    {
        id: 3,
        title: "Pendaftaran Lomba Olimpiade Sains Nasional 2026",
        content: "Bagi siswa yang berminat mengikuti OSN 2026, pendaftaran dibuka hingga 15 Januari 2026. Silakan hubungi Bapak/Ibu Pembina OSN di ruang guru atau mendaftar melalui website sekolah.",
        category: "achievement",
        date: "2026-01-08",
        author: "Pak Ahmad (Guru Matematika)",
        isRead: true,
        isPinned: false,
    },
    {
        id: 4,
        title: "Peringatan Maulid Nabi Muhammad SAW",
        content: "Dalam rangka memperingati Maulid Nabi Muhammad SAW, sekolah akan mengadakan acara peringatan pada hari Senin, 13 Januari 2026. Seluruh siswa wajib mengikuti acara dengan berpakaian muslim/muslimah.",
        category: "event",
        date: "2026-01-07",
        author: "Drs. H. Syamsul (Kepala Sekolah)",
        isRead: true,
        isPinned: false,
    },
    {
        id: 5,
        title: "Pengumuman Hasil Seleksi Tim Basket SMAN 1",
        content: "Selamat kepada siswa yang terpilih masuk tim basket sekolah! Daftar lengkap dapat dilihat di papan pengumuman atau hubungi Pak Dedi selaku pelatih basket.",
        category: "achievement",
        date: "2026-01-06",
        author: "Coach Dedi (Tutor Ekstrakurikuler Basket)",
        isRead: true,
        isPinned: false,
    },
    {
        id: 6,
        title: "Perubahan Jadwal Pelajaran Sementara",
        content: "Diinformasikan bahwa terdapat perubahan jadwal untuk beberapa mata pelajaran minggu ini dikarenakan ada guru yang berhalangan hadir. Silakan cek jadwal terbaru di website sekolah.",
        category: "schedule",
        date: "2026-01-05",
        author: "Pak Hendra (Guru Piket)",
        isRead: true,
        isPinned: false,
    },
];

export const getStudentAnnouncements = async (): Promise<Announcement[]> => {
    return Promise.resolve(initialAnnouncements);
};
