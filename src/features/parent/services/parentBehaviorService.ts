import { getParentChildren, type ChildInfo } from "./dailyAttendanceService";

// Types
export interface ViolationRecord {
    id: number;
    date: string;
    time: string;
    location: "sekolah" | "asrama";
    problem: string;
    followUp: string;
    reporterName: string;
    reporterGender: "L" | "P";
    reporterRole?: string;
    academicYearId: string;
}

export interface BehaviorData {
    records: ViolationRecord[];
}

// Base mock data for violations
const baseMockViolations: Omit<ViolationRecord, "id">[] = [
    // 2025-2026 (Current Academic Year)
    {
        date: "2026-02-15",
        time: "07:15",
        location: "sekolah",
        problem: "Terlambat masuk kelas 15 menit",
        followUp: "Peringatan lisan dan poin pelanggaran",
        reporterName: "Hendra Wijaya",
        reporterGender: "L",
        reporterRole: "Guru Piket",
        academicYearId: "2025-2026",
    },
    {
        date: "2025-11-10",
        time: "10:00",
        location: "sekolah",
        problem: "Tidur di kelas saat jam pelajaran Sejarah",
        followUp: "Teguran lisan dan cuci muka",
        reporterName: "Budi Santoso",
        reporterGender: "L",
        reporterRole: "Guru Sejarah",
        academicYearId: "2025-2026",
    },
    {
        date: "2025-09-28",
        time: "21:30",
        location: "asrama",
        problem: "Keluar kamar setelah jam malam tanpa izin",
        followUp: "Teguran tertulis dari pembina asrama",
        reporterName: "Ahmad Zulfikar",
        reporterGender: "L",
        reporterRole: "Pembina Asrama",
        academicYearId: "2025-2026",
    },
    
    // 2024-2025 (Previous Academic Year)
    {
        date: "2025-04-12",
        time: "08:00",
        location: "sekolah",
        problem: "Tidak memakai sepatu hitam standar sekolah",
        followUp: "Peringatan dan sepatu disita sementara waktu",
        reporterName: "Sri Wahyuni",
        reporterGender: "P",
        reporterRole: "Kesiswaan",
        academicYearId: "2024-2025",
    },
    {
        date: "2024-11-05",
        time: "16:15",
        location: "asrama",
        problem: "Tidak mengikuti kegiatan sholat Ashar berjamaah",
        followUp: "Membersihkan masjid asrama selama 3 hari",
        reporterName: "Maulana Malik",
        reporterGender: "L",
        reporterRole: "Mushrif Asrama",
        academicYearId: "2024-2025",
    },
    {
        date: "2024-08-20",
        time: "07:30",
        location: "sekolah",
        problem: "Rambut terlalu panjang (melebihi kerah)",
        followUp: "Dipotong di tempat oleh guru BK",
        reporterName: "Linda Kusuma",
        reporterGender: "P",
        reporterRole: "Guru BK",
        academicYearId: "2024-2025",
    },

    // 2023-2024
    {
        date: "2024-03-15",
        time: "09:30",
        location: "sekolah",
        problem: "Tidak mengerjakan PR Matematika",
        followUp: "Hukuman lari lapangan 2 keliling",
        reporterName: "Endang Suparni",
        reporterGender: "P",
        reporterRole: "Guru Matematika",
        academicYearId: "2023-2024",
    },
    {
        date: "2023-10-10",
        time: "12:00",
        location: "asrama",
        problem: "Membawa handphone ke dalam asrama (ketahuan saat razia)",
        followUp: "HP disita selama 1 bulan, pemanggilan wali",
        reporterName: "Ahmad Zulfikar",
        reporterGender: "L",
        reporterRole: "Pembina Asrama",
        academicYearId: "2023-2024",
    },
    // More 2025-2026 records to trigger pagination
    {
        date: "2026-03-01",
        time: "08:30",
        location: "sekolah",
        problem: "Berisik di Perpustakaan",
        followUp: "Dikeluarkan dari perpustakaan untuk hari itu",
        reporterName: "Maya Sari",
        reporterGender: "P",
        reporterRole: "Pustakawan",
        academicYearId: "2025-2026",
    },
    {
        date: "2026-02-28",
        time: "13:30",
        location: "sekolah",
        problem: "Makan di saat jam pelajaran",
        followUp: "Teguran keras",
        reporterName: "Budi Santoso",
        reporterGender: "L",
        reporterRole: "Guru",
        academicYearId: "2025-2026",
    },
    {
        date: "2026-02-25",
        time: "09:00",
        location: "sekolah",
        problem: "Tidak memakai atribut lengkap (topi) saat upacara",
        followUp: "Baris terpisah",
        reporterName: "Sri Wahyuni",
        reporterGender: "P",
        reporterRole: "Kesiswaan",
        academicYearId: "2025-2026",
    },
    {
        date: "2026-02-20",
        time: "10:30",
        location: "sekolah",
        problem: "Izin ke kamar mandi terlalu lama (30 menit)",
        followUp: "Teguran lisan",
        reporterName: "Hendra Wijaya",
        reporterGender: "L",
        academicYearId: "2025-2026",
    },
    {
        date: "2026-02-18",
        time: "15:00",
        location: "sekolah",
        problem: "Membuang sampah permen sembarangan",
        followUp: "Operasi semut sekitar kelas",
        reporterName: "Linda Kusuma",
        reporterGender: "P",
        academicYearId: "2025-2026",
    },
    {
        date: "2026-02-16",
        time: "07:45",
        location: "sekolah",
        problem: "Atribut pramuka tidak lengkap",
        followUp: "Peringatan",
        reporterName: "Hendra Wijaya",
        reporterGender: "L",
        academicYearId: "2025-2026",
    }
];

/**
 * Fetch behavioral records data for a specific child.
 * Currently uses mock data.
 * GET /api/parent/{parentId}/behavior?childId={childId}
 */
export const getBehaviorData = async (
    childId: string
): Promise<BehaviorData> => {
    return new Promise((resolve, reject) => {
        // Simulate potential API failure (10% chance)
        // if (Math.random() < 0.1) return reject(new Error("Gagal terhubung ke server SIMAP."));

        setTimeout(() => {
            const seed = childId.charCodeAt(childId.length - 1);

            // Generate deterministic mock behaviors based on child ID
            // Some children are good boys/girls, some have many records
            const behaviorMultiplier = (seed % 3); // 0 (good), 1 (average), 2 (naughty)
            
            let generatedRecords: ViolationRecord[] = [];

            if (behaviorMultiplier > 0) {
                generatedRecords = baseMockViolations
                    .filter((_, index) => index % behaviorMultiplier === 0 || index % 4 === 0)
                    .map((base, index) => {
                        return {
                            ...base,
                            id: parseInt(`${seed}${index}`),
                        };
                    });
            } else {
                // Good child case: only has 1 minor violation from 2 years ago
                generatedRecords = [
                    {
                        ...baseMockViolations[6], // Tidak ngerjain PR
                        id: parseInt(`${seed}99`),
                    }
                ];
            }

            // Always sort by date descending
            generatedRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            resolve({ records: generatedRecords });
        }, 800);
    });
};

export { getParentChildren, type ChildInfo };
