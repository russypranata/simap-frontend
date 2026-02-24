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
    classId?: string;    // ID Kelas Reguler (Induk)
    className?: string;  // Nama Kelas Reguler
    
    // Peminatan Classes (Moving Class) - Many to Many
    peminatanClasses?: {
        id: string;
        name: string;
        subjectId?: string; // Optional: Link to subject
    }[];

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
