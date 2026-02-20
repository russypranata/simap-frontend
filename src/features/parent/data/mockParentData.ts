export interface ParentProfileData {
    id: string;
    name: string;
    username: string;
    email: string;
    phone: string;
    address: string;
    occupation: string;
    profilePicture?: string;
    joinDate: string;
    children: {
        id: string;
        name: string;
        class: string;
        nis: string;
    }[];
}

export const mockParentProfile: ParentProfileData = {
    id: "parent-1",
    name: "Budi Santoso",
    username: "budi.santoso",
    email: "budi.santoso@example.com",
    phone: "081234567890",
    address: "Jl. Merdeka No. 45, Jakarta Selatan",
    occupation: "Wiraswasta",
    profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
    joinDate: "2023-07-15",
    children: [
        {
            id: "student-1",
            name: "Ahmad Santoso",
            class: "X-A",
            nis: "123456",
        },
        {
            id: "student-2",
            name: "Siti Aminah",
            class: "XI-B",
            nis: "123457",
        }
    ]
};
