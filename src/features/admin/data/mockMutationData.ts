import { StudentMutation } from '../types/mutation';

export const MOCK_MUTATIONS: StudentMutation[] = [
    {
        id: 'mut-001',
        studentName: 'Joko Widodo',
        nisn: '0056781234',
        type: 'out',
        reason: 'Pindah ikut orang tua dinas',
        schoolDestination: 'SMA Negeri 1 Solo',
        date: '2024-02-10',
        status: 'approved',
    },
    {
        id: 'mut-002',
        studentName: 'Megawati Putri',
        nisn: '0056785678',
        type: 'in',
        reason: 'Pindah domisili',
        schoolOrigin: 'SMA Swasta Surabaya',
        date: '2024-01-15',
        status: 'approved',
    },
    {
        id: 'mut-003',
        studentName: 'Susilo Bambang',
        nisn: '0056789012',
        type: 'out',
        reason: 'Mengundurkan diri',
        date: '2024-03-01',
        status: 'pending',
    },
];
