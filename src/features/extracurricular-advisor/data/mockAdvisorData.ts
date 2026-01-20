export interface AdvisorProfileData {
    name: string;
    username: string;
    email: string;
    phone: string;
    role: string;
    profilePicture: string;
    address: string;
    joinDate: string;
    nip?: string;
    extracurricular: string;
    totalMembers: number;
    activeMembers: number;
    totalMeetings: number;
    avgStudentAttendance: number;
}

export const mockAdvisorData: AdvisorProfileData = {
    name: "Budi Santoso, S.Pd",
    username: "budi.santoso",
    email: "budi.santoso@alfityan.sch.id",
    phone: "+62 812-9876-5432",
    role: "Tutor Ekstrakurikuler",
    profilePicture: "",
    address: "Jl. Merpati No. 45, Makassar, Sulawesi Selatan",
    joinDate: "10 Agustus 2019",
    nip: "198812122015021002",
    extracurricular: "Futsal",
    totalMembers: 30,
    activeMembers: 28,
    totalMeetings: 14,
    avgStudentAttendance: 95,
};
