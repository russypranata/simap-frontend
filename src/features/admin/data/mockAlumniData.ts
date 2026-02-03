import { Alumni } from '../types/alumni';

export const MOCK_ALUMNI: Alumni[] = [
    {
        id: 'alum-001',
        nisn: '0012345678',
        name: 'Andi Pratama',
        graduationYear: '2024',
        className: 'XII-IPA-1',
        phone: '081298765432',
        university: 'Institut Teknologi Bandung (ITB)',
    },
    {
        id: 'alum-002',
        nisn: '0012345679',
        name: 'Bunga Citra',
        graduationYear: '2024',
        className: 'XII-IPS-2',
        phone: '081298765433',
        university: 'Universitas Indonesia (UI)',
    },
    {
        id: 'alum-003',
        nisn: '0012345680',
        name: 'Candra Wijaya',
        graduationYear: '2023',
        className: 'XII-IPA-2',
        phone: '081298765434',
        job: 'Software Engineer di Gojek',
    },
];
