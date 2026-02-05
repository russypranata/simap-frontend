import { Parent } from '../types/parent';

export const MOCK_PARENTS: Parent[] = [
    {
        id: 'par-001',
        name: 'Hendra Gunawan',
        email: 'hendra.gunawan@example.com',
        phone: '081234567001',
        occupation: 'Wiraswasta',
        address: 'Jl. Merdeka No. 10, Jakarta Selatan',
        children: [
            { id: 'std-001', name: 'Fajar Shadiq', className: 'X-A', nis: '2024001' }
        ],
        status: 'active',
        lastLogin: '2025-02-01T08:30:00Z',
    },
    {
        id: 'par-002',
        name: 'Erwin Gutawa',
        email: 'erwin.gutawa@example.com',
        phone: '081234567002',
        occupation: 'Musisi',
        address: 'Jl. Antasari No. 45, Jakarta Selatan',
        children: [
             { id: 'std-002', name: 'Gita Gutawa', className: 'X-B', nis: '2024002' }
        ],
        status: 'active',
        lastLogin: '2025-02-02T09:15:00Z',
    },
    {
        id: 'par-003',
        name: 'James Poter',
        email: 'james.poter@example.com',
        phone: '081234567003',
        occupation: 'Pegawai Negeri Sipil',
        address: 'Jl. Sudirman Kav. 5, Jakarta Pusat',
        children: [
             { id: 'std-003', name: 'Heri Poter', className: 'X-A', nis: '2024003' }
        ],
        status: 'inactive',
    },
    {
        id: 'par-004',
        name: 'Budi Utomo',
        email: 'budi.utomo@example.com',
        phone: '081234567004',
        occupation: 'Dosen',
        address: 'Jl. Dago No. 88, Bandung',
        children: [
             { id: 'std-004', name: 'Indah Pertiwi', className: 'XI-IPA-1', nis: '2023001' }
        ],
        status: 'active',
        lastLogin: '2025-01-20T14:00:00Z',
    },
    {
        id: 'par-005',
        name: 'Susi Susanti',
        email: 'susi.susanti@example.com',
        phone: '081234567005',
        occupation: 'Atlet',
        address: 'Jl. Senayan No. 1, Jakarta Pusat',
        children: [
             { id: 'std-005', name: 'Alan Budikusuma', className: 'XI-IPS-1', nis: '2023002' },
             { id: 'std-006', name: 'Rio Haryanto', className: 'X-B', nis: '2024005' }
        ],
        status: 'active',
        lastLogin: '2025-02-03T10:00:00Z',
    },
];
