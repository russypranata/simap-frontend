export interface Alumni {
    id: string;
    nisn: string;
    name: string;
    graduationYear: string; // "2023"
    className: string; // Last class, e.g. "XII-IPA-1"
    phone: string;
    university?: string; // Optional: Where they continued studies
    job?: string; // Optional: Current job
}
