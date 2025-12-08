// Extended mock schedule data for comprehensive weekly view
import { Schedule } from '../types/teacher';
import { mockTeacher } from './mockData';

export const extendedMockSchedule: Schedule[] = [
    // SENIN
    // XII A - Matematika (2 JP)
    {
        id: '1',
        day: 'Senin',
        time: '07:00 - 07:45',
        class: 'XII A',
        subject: 'Matematika',
        teacher: mockTeacher.name,
        room: 'Ruang 12',
    },
    {
        id: '2',
        day: 'Senin',
        time: '07:45 - 08:30',
        class: 'XII A',
        subject: 'Matematika',
        teacher: mockTeacher.name,
        room: 'Ruang 12',
    },
    // XI A - Matematika (2 JP)
    {
        id: '3',
        day: 'Senin',
        time: '10:15 - 11:00',
        class: 'XI A',
        subject: 'Matematika',
        teacher: mockTeacher.name,
        room: 'Ruang 10',
    },
    {
        id: '4',
        day: 'Senin',
        time: '11:00 - 11:45',
        class: 'XI A',
        subject: 'Matematika',
        teacher: mockTeacher.name,
        room: 'Ruang 10',
    },

    // SELASA
    // X B - Biologi (2 JP)
    {
        id: '5',
        day: 'Selasa',
        time: '08:30 - 09:15',
        class: 'X B',
        subject: 'Biologi',
        teacher: mockTeacher.name,
        room: 'Lab Biologi',
    },
    {
        id: '6',
        day: 'Selasa',
        time: '09:15 - 10:00',
        class: 'X B',
        subject: 'Biologi',
        teacher: mockTeacher.name,
        room: 'Lab Biologi',
    },

    // RABU
    // XI A - Fisika (2 JP)
    {
        id: '7',
        day: 'Rabu',
        time: '08:30 - 09:15',
        class: 'XI A',
        subject: 'Fisika',
        teacher: mockTeacher.name,
        room: 'Lab Fisika',
    },
    {
        id: '8',
        day: 'Rabu',
        time: '09:15 - 10:00',
        class: 'XI A',
        subject: 'Fisika',
        teacher: mockTeacher.name,
        room: 'Lab Fisika',
    },

    // KAMIS
    // X B - Biologi (2 JP)
    {
        id: '9',
        day: 'Kamis',
        time: '07:00 - 07:45',
        class: 'X B',
        subject: 'Biologi',
        teacher: mockTeacher.name,
        room: 'Lab Biologi',
    },
    {
        id: '10',
        day: 'Kamis',
        time: '07:45 - 08:30',
        class: 'X B',
        subject: 'Biologi',
        teacher: mockTeacher.name,
        room: 'Lab Biologi',
    },
    // XII A - Matematika (2 JP)
    {
        id: '11',
        day: 'Kamis',
        time: '10:15 - 11:00',
        class: 'XII A',
        subject: 'Matematika',
        teacher: mockTeacher.name,
        room: 'Ruang 12',
    },
    {
        id: '12',
        day: 'Kamis',
        time: '11:00 - 11:45',
        class: 'XII A',
        subject: 'Matematika',
        teacher: mockTeacher.name,
        room: 'Ruang 12',
    },

    // JUMAT
    // XI A - Matematika (2 JP)
    {
        id: '13',
        day: 'Jumat',
        time: '08:30 - 09:15',
        class: 'XI A',
        subject: 'Matematika',
        teacher: mockTeacher.name,
        room: 'Ruang 10',
    },
    {
        id: '14',
        day: 'Jumat',
        time: '09:15 - 10:00',
        class: 'XI A',
        subject: 'Matematika',
        teacher: mockTeacher.name,
        room: 'Ruang 10',
    },
];
