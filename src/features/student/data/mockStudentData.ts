export interface StudentProfileData {
    name: string;
    nis: string;
    nisn: string;
    class: string;
    email: string;
    phone: string;
    address: string;
    birthPlace: string;
    birthDate: string;
    religion: string;
    joinDate: string;
    role: string;
    validUntil: string;
    profilePicture?: string;
    avatar?: string;
}

export const mockStudentProfile: StudentProfileData = {
    name: "Ahmad Fauzan Ramadhan",
    nis: "0012345678",
    nisn: "0107959840",
    class: "XII IPA 1",
    email: "ahmad.fauzan@student.sman1.sch.id",
    phone: "08123456789",
    address: "Jl. Merdeka No. 10, RT 05/RW 02, Kel. Sukamaju, Kec. Cikupa",
    birthPlace: "Tangerang",
    birthDate: "2007-05-15",
    religion: "Islam",
    joinDate: "Juli 2023",
    role: "Siswa",
    validUntil: "31 Juni 2028",
    profilePicture: "",
    avatar: "",
};

export interface StudentStats {
    attendance: number;
    assignmentsCompleted: number;
    averageGrade: number;
    points: number;
}

export const mockStudentStats: StudentStats = {
    attendance: 98,
    assignmentsCompleted: 45,
    averageGrade: 88.5,
    points: 120,
};
