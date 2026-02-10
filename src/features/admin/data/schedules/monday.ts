import { CompactDaySchedule } from '../../types/compactSchedule';

export const MONDAY_SCHEDULE: CompactDaySchedule = {
    day: 'Senin',
    academicYear: '2024/2025',
    semester: 'Ganjil',
    slots: [
        // Slot 1: 07:50 - 08:30
        {
            startTime: '07:50',
            endTime: '08:30',
            classes: [
                { classId: 'cls-10a', className: 'X A', subjectId: 'subj-tjw', subjectName: 'Tajwid', teacherId: 'tch-fikri-maulana', teacherName: 'Fikri Maulana', room: 'R. 101' },
                { classId: 'cls-10b', className: 'X B', subjectId: 'subj-sjr-w', subjectName: 'Sejarah Wajib', teacherId: 'tch-maulidia', teacherName: 'GI. Maulidia M.', room: 'R. 102' },
                { classId: 'cls-11a', className: 'XI A', subjectId: 'subj-big', subjectName: 'Bahasa Inggris', teacherId: 'tch-paisal', teacherName: 'Paisal', room: 'R. 201' },
                { classId: 'cls-11b', className: 'XI B', subjectId: 'subj-bin', subjectName: 'Bahasa Indonesia', teacherId: 'tch-awaludin', teacherName: 'Awaludin', room: 'R. 202' },
                { classId: 'cls-11-pem-akh', className: 'XI PEM AKH', subjectId: 'subj-bio-p', subjectName: 'Biologi', teacherId: 'tch-irmi', teacherName: 'Irmi', room: 'Lab Bio' },
                { classId: 'cls-11-pem-ikh', className: 'XI PEM IKH', subjectId: 'subj-fis-p', subjectName: 'Fisika', teacherId: 'tch-hikmah', teacherName: 'Hikmah Fadhilah', room: 'Lab Fisika' },
            ]
        },
        // Slot 2: 08:30 - 09:10
        {
            startTime: '08:30',
            endTime: '09:10',
            classes: [
                { classId: 'cls-10a', className: 'X A', subjectId: 'subj-tjw', subjectName: 'Tajwid', teacherId: 'tch-fikri-maulana', teacherName: 'Fikri Maulana', room: 'R. 101' },
                { classId: 'cls-10b', className: 'X B', subjectId: 'subj-sjr-w', subjectName: 'Sejarah Wajib', teacherId: 'tch-maulidia', teacherName: 'GI. Maulidia M.', room: 'R. 102' },
                { classId: 'cls-11a', className: 'XI A', subjectId: 'subj-big', subjectName: 'Bahasa Inggris', teacherId: 'tch-paisal', teacherName: 'Paisal', room: 'R. 201' },
                { classId: 'cls-11b', className: 'XI B', subjectId: 'subj-bin', subjectName: 'Bahasa Indonesia', teacherId: 'tch-awaludin', teacherName: 'Awaludin', room: 'R. 202' },
                { classId: 'cls-11-pem-akh', className: 'XI PEM AKH', subjectId: 'subj-bio-p', subjectName: 'Biologi', teacherId: 'tch-irmi', teacherName: 'Irmi', room: 'Lab Bio' },
                { classId: 'cls-11-pem-ikh', className: 'XI PEM IKH', subjectId: 'subj-fis-p', subjectName: 'Fisika', teacherId: 'tch-hikmah', teacherName: 'Hikmah Fadhilah', room: 'Lab Fisika' },
            ]
        },
        // Slot 3: 09:10 - 09:50
        {
            startTime: '09:10',
            endTime: '09:50',
            classes: [
                { classId: 'cls-10a', className: 'X A', subjectId: 'subj-big', subjectName: 'Bahasa Inggris', teacherId: 'tch-paisal', teacherName: 'Paisal', room: 'R. 101' },
                { classId: 'cls-10b', className: 'X B', subjectId: 'subj-pai', subjectName: 'PAI', teacherId: 'tch-ikhwan', teacherName: 'M. Ikhwan', room: 'R. 102' },
                { classId: 'cls-11a', className: 'XI A', subjectId: 'subj-pjok-p', subjectName: 'Penjaskes', teacherId: 'tch-erik', teacherName: 'Erik Rahmana', room: 'Lapangan' },
                { classId: 'cls-11b', className: 'XI B', subjectId: 'subj-pjok-p', subjectName: 'Penjaskes', teacherId: 'tch-yuyun', teacherName: 'Yuyun R.', room: 'Lap. Basket' },
                { classId: 'cls-11-pem-akh', className: 'XI PEM AKH', subjectId: 'subj-mtk-p', subjectName: 'Matematika Lanjut', teacherId: 'tch-rizky', teacherName: 'Rizky', room: 'R. 203' },
                { classId: 'cls-11-pem-ikh', className: 'XI PEM IKH', subjectId: 'subj-kim', subjectName: 'Kimia', teacherId: 'tch-zahratun', teacherName: 'Zahratun N.', room: 'Lab Kimia' },
            ]
        },
        // ISTIRAHAT: 09:50 - 10:15
        // Slot 4: 10:15 - 10:55
        {
            startTime: '10:15',
            endTime: '10:55',
            classes: [
                { classId: 'cls-10a', className: 'X A', subjectId: 'subj-big', subjectName: 'Bahasa Inggris', teacherId: 'tch-paisal', teacherName: 'Paisal', room: 'R. 101' },
                { classId: 'cls-10b', className: 'X B', subjectId: 'subj-pai', subjectName: 'PAI', teacherId: 'tch-ikhwan', teacherName: 'M. Ikhwan', room: 'R. 102' },
                { classId: 'cls-11a', className: 'XI A', subjectId: 'subj-pjok-p', subjectName: 'Penjaskes', teacherId: 'tch-erik', teacherName: 'Erik Rahmana', room: 'Lapangan' },
                { classId: 'cls-11b', className: 'XI B', subjectId: 'subj-pjok-p', subjectName: 'Penjaskes', teacherId: 'tch-yuyun', teacherName: 'Yuyun R.', room: 'Lap. Basket' },
                { classId: 'cls-11-pem-akh', className: 'XI PEM AKH', subjectId: 'subj-mtk-p', subjectName: 'Matematika Lanjut', teacherId: 'tch-rizky', teacherName: 'Rizky', room: 'R. 203' },
                { classId: 'cls-11-pem-ikh', className: 'XI PEM IKH', subjectId: 'subj-kim', subjectName: 'Kimia', teacherId: 'tch-zahratun', teacherName: 'Zahratun N.', room: 'Lab Kimia' },
            ]
        },
        // Slot 5: 10:55 - 11:35
        {
            startTime: '10:55',
            endTime: '11:35',
            classes: [
                { classId: 'cls-10a', className: 'X A', subjectId: 'subj-sos', subjectName: 'Sosiologi', teacherId: 'tch-putri', teacherName: 'Putri Safitri', room: 'R. 101' },
                { classId: 'cls-10b', className: 'X B', subjectId: 'subj-kod', subjectName: 'Koding', teacherId: 'tch-ranu', teacherName: 'Rizki Ranu', room: 'Lab Komp 2' },
                { classId: 'cls-11a', className: 'XI A', subjectId: 'subj-fis-p', subjectName: 'Fisika', teacherId: 'tch-hikmah', teacherName: 'Hikmah Fadhilah', room: 'Lab Fisika' },
                { classId: 'cls-11b', className: 'XI B', subjectId: 'subj-eko', subjectName: 'Ekonomi', teacherId: 'tch-diah', teacherName: 'Diah Loka', room: 'R. 202' },
                { classId: 'cls-11-pem-akh', className: 'XI PEM AKH', subjectId: 'subj-fis-p', subjectName: 'Fisika', teacherId: 'tch-hikmah', teacherName: 'Hikmah Fadhilah', room: 'Lab Fisika' },
                { classId: 'cls-11-pem-ikh', className: 'XI PEM IKH', subjectId: 'subj-bio-p', subjectName: 'Biologi', teacherId: 'tch-irmi', teacherName: 'Irmi', room: 'Lab Bio' },
            ]
        },
        // ISHOMA: 11:35 - 13:00
        // Slot 6: 13:00 - 13:40
        {
            startTime: '13:00',
            endTime: '13:40',
            classes: [
                { classId: 'cls-10a', className: 'X A', subjectId: 'subj-sos', subjectName: 'Sosiologi', teacherId: 'tch-putri', teacherName: 'Putri Safitri', room: 'R. 101' },
                { classId: 'cls-10b', className: 'X B', subjectId: 'subj-kod', subjectName: 'Koding', teacherId: 'tch-ranu', teacherName: 'Rizki Ranu', room: 'Lab Komp 2' },
                { classId: 'cls-11a', className: 'XI A', subjectId: 'subj-fis-p', subjectName: 'Fisika', teacherId: 'tch-hikmah', teacherName: 'Hikmah Fadhilah', room: 'Lab Fisika' },
                { classId: 'cls-11b', className: 'XI B', subjectId: 'subj-eko', subjectName: 'Ekonomi', teacherId: 'tch-diah', teacherName: 'Diah Loka', room: 'R. 202' },
                { classId: 'cls-11-pem-ikh', className: 'XI PEM IKH', subjectId: 'subj-pkn', subjectName: 'PPKn', teacherId: 'tch-maulidia', teacherName: 'GI. Maulidia M.', room: 'R. 203' },
                { classId: 'cls-11-pem-ikh', className: 'XI PEM IKH', subjectId: 'subj-bin', subjectName: 'Bahasa Indonesia', teacherId: 'tch-slamet', teacherName: 'Slamet Ricky H.', room: 'R. 204' },
            ]
        },
        // Slot 7: 13:40 - 14:20
        {
            startTime: '13:40',
            endTime: '14:20',
            classes: [
                { classId: 'cls-10a', className: 'X A', subjectId: 'subj-bio-w', subjectName: 'Biologi', teacherId: 'tch-irmi', teacherName: 'Irmi', room: 'Lab Bio' },
                { classId: 'cls-10b', className: 'X B', subjectId: 'subj-eko', subjectName: 'Ekonomi', teacherId: 'tch-diah', teacherName: 'Diah Loka', room: 'R. 102' },
                { classId: 'cls-11a', className: 'XI A', subjectId: 'subj-tjw', subjectName: 'Fikih', teacherId: 'tch-fikri-kamil', teacherName: 'Fikri Insan Kamil', room: 'R. 201' },
                { classId: 'cls-11b', className: 'XI B', subjectId: 'subj-kod', subjectName: 'Informatika', teacherId: 'tch-ranu', teacherName: 'Rizki Ranu', room: 'Lab Komp 1' },
                { classId: 'cls-11-pem-akh', className: 'XI PEM AKH', subjectId: 'subj-kim', subjectName: 'Kimia', teacherId: 'tch-zahratun', teacherName: 'Zahratun N.', room: 'Lab Kimia' },
                { classId: 'cls-11-pem-ikh', className: 'XI PEM IKH', subjectId: 'subj-mtk-w', subjectName: 'Matematika Wajib', teacherId: 'tch-rizky', teacherName: 'Rizky', room: 'R. 204' },
            ]
        },
        // Slot 8: 14:20 - 15:00
        {
            startTime: '14:20',
            endTime: '15:00',
            classes: [
                { classId: 'cls-10a', className: 'X A', subjectId: 'subj-bio-w', subjectName: 'Biologi', teacherId: 'tch-irmi', teacherName: 'Irmi', room: 'Lab Bio' },
                { classId: 'cls-10b', className: 'X B', subjectId: 'subj-eko', subjectName: 'Ekonomi', teacherId: 'tch-diah', teacherName: 'Diah Loka', room: 'R. 102' },
                { classId: 'cls-11a', className: 'XI A', subjectId: 'subj-mtk-p', subjectName: 'Matematika Lanjutan', teacherId: 'tch-fikri-kamil', teacherName: 'Fikri Insan Kamil', room: 'R. 201' },
                { classId: 'cls-11b', className: 'XI B', subjectId: 'subj-kod', subjectName: 'Informatika', teacherId: 'tch-ranu', teacherName: 'Rizki Ranu', room: 'Lab Komp 1' },
                { classId: 'cls-11-pem-akh', className: 'XI PEM AKH', subjectId: 'subj-kim', subjectName: 'Kimia', teacherId: 'tch-zahratun', teacherName: 'Zahratun N.', room: 'Lab Kimia' },
                { classId: 'cls-11-pem-ikh', className: 'XI PEM IKH', subjectId: 'subj-mtk-w', subjectName: 'Matematika Wajib', teacherId: 'tch-rizky', teacherName: 'Rizky', room: 'R. 204' },
            ]
        },
    ]
};
