import { ExtracurricularMember } from '../types/extracurricular';

export const MOCK_EXTRACURRICULAR_MEMBERS: Record<string, ExtracurricularMember[]> = {
    '1': [ // Pramuka
        { id: 'm1', studentId: 'S001', studentName: 'Aditya Pratama', class: '7A', nis: '23241001', joinDate: '2025-07-15' },
        { id: 'm2', studentId: 'S002', studentName: 'Bunga Citra', class: '7B', nis: '23241002', joinDate: '2025-07-15' },
        { id: 'm3', studentId: 'S015', studentName: 'Fajar Ramadhan', class: '8A', nis: '22231015', joinDate: '2025-07-16' },
    ],
    '2': [ // Basket
        { id: 'm4', studentId: 'S003', studentName: 'Chandra Wijaya', class: '7C', nis: '23241003', joinDate: '2025-07-17' },
        { id: 'm5', studentId: 'S010', studentName: 'Dewi Lestari', class: '8C', nis: '22231010', joinDate: '2025-07-17' },
    ],
};
