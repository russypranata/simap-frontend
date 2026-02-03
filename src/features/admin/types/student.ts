export type StudentGender = 'L' | 'P';
export type StudentStatus = 'active' | 'graduated' | 'transferred' | 'dropped_out';

export interface Student {
    id: string;
    nis: string;     // Nomor Induk Siswa (Lokal)
    nisn: string;    // Nomor Induk Siswa Nasional
    name: string;
    gender: StudentGender;
    placeOfBirth: string;
    dateOfBirth: string;
    
    // Academic
    classId?: string;    // ID Kelas saat ini
    className?: string;  // Nama Kelas (e.g., "X IPA 1")
    generation: string;  // Angkatan (Tahun Masuk)
    status: StudentStatus;
    
    // Contact
    address: string;
    email?: string;
    phoneNumber?: string;
    
    // Parent Info (Simplified for list view)
    parentName?: string;
    parentPhone?: string;

    // Media
    profilePicture?: string;

    createdAt: string;
    updatedAt: string;
}
