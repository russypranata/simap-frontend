export type TeacherStatus = 'active' | 'inactive' | 'leave';

// Jabatan Struktural (bisa lebih dari 1)
export type StructuralPosition = 
    | 'headmaster'           // Kepala Sekolah
    | 'vice_curriculum'      // Waka Kurikulum
    | 'vice_student_affairs' // Waka Kesiswaan
    | 'coord_piket_ikhwan'   // Koordinator Piket Ikhwan
    | 'coord_piket_akhwat'   // Koordinator Piket Akhwat
    | 'admin_dapodik';       // Tata Usaha dan OPS Dapodik

// Tipe Kepegawaian (Kategori Utama)
export type EmploymentType = 
    | 'teacher'           // Guru
    | 'staff';            // Staff Tata Usaha / Admin

// Status Ikatan Kerja (Detail)
export type EmploymentStatus = 
    | 'PNS'   // Pegawai Negeri Sipil
    | 'PPPK'  // Pegawai Pemerintah dengan Perjanjian Kerja
    | 'GTY'   // Guru Tetap Yayasan
    | 'GTT'   // Guru Tidak Tetap / Honorer
    | 'HONORER'; // Tenaga Honorer (Staff)

export type TeacherGender = 'L' | 'P';

// Riwayat Pendidikan
export interface Education {
    lastEducation: 'SMA' | 'D3' | 'S1' | 'S2' | 'S3';
    major: string;      // Jurusan
    university: string; // Universitas / Institusi
    graduationYear: string;
}

// Mata Pelajaran yang diampu
export interface TeachingAssignment {
    subjectId: string;
    subjectName: string;
    subjectCode: string;
    classes: {
        classId: string;
        className: string;
    }[];
}

// Wali Kelas
export interface HomeroomAssignment {
    classId: string;
    className: string;
    academicYear: string;
}

// Pembina Ekstrakurikuler
export interface ExtracurricularAdvisor {
    extracurricularId: string;
    extracurricularName: string;
}

export interface Teacher {
    id: string;
    
    // Identitas
    nip: string;
    nik: string;         // Add NIK
    nuptk?: string;
    name: string;
    title?: string;
    gender: TeacherGender;
    placeOfBirth?: string;
    dateOfBirth?: string;
    religion?: 'Islam' | 'Kristen' | 'Katolik' | 'Hindu' | 'Buddha' | 'Konghucu'; // Add Religion
    
    // Kontak & Alamat
    email: string;
    phoneNumber: string;
    address?: string;
    
    // KEPEGAWAIAN
    employmentType: EmploymentType;           // Guru atau Staff (Kategori)
    employmentStatus: EmploymentStatus;       // Status Kerja (GTY, GTT, dll)
    ptkType: 'Guru Mapel' | 'Guru Kelas' | 'Tenaga Administrasi' | 'Kepala Sekolah'; // Jenis PTK
    institution: string;                      // Lembaga Pengangkat
    skNumber?: string;                        // Nomor SK
    skDate?: string;                          // Tanggal SK
    structuralPositions?: StructuralPosition[]; 
    status: TeacherStatus;
    joinDate: string; // TMT Pengangkatan
    
    // Pendidikan
    education?: Education;

    // Peran Akademik
    teachingAssignments?: TeachingAssignment[];  
    homeroomClass?: HomeroomAssignment;          
    extracurriculars?: ExtracurricularAdvisor[]; 
    
    // System
    profilePicture?: string;
    createdAt: string;
    updatedAt: string;
}

// Legacy support
export type TeacherPosition = EmploymentType | StructuralPosition;

export interface CreateTeacherRequest {
    nip: string;
    nik: string;
    nuptk?: string;
    name: string;
    title?: string;
    email: string;
    phoneNumber: string;
    gender: TeacherGender;
    address?: string;
    dateOfBirth?: string;
    placeOfBirth?: string;
    employmentType: EmploymentType;
    employmentStatus: EmploymentStatus;
    structuralPositions?: StructuralPosition[];
    education?: Education;
    status: TeacherStatus;
    joinDate: string;
}

export interface UpdateTeacherRequest extends Partial<CreateTeacherRequest> {}
