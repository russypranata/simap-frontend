export interface Parent {
    id: string;
    name: string;
    email: string;
    phone: string;
    occupation: string; // Pekerjaan
    address: string;
    children: StudentChild[]; // List of children in the school
    status: 'active' | 'inactive';
    lastLogin?: string;
}

export interface StudentChild {
    id: string;
    name: string;
    className: string;
    nis: string;
}
