import { CompactDaySchedule } from '../../types/compactSchedule';

export const TUESDAY_SCHEDULE: CompactDaySchedule = {
    day: 'Selasa',
    academicYear: '2024/2025',
    semester: 'Ganjil',
    slots: [
        // Slot 1: 07:50 - 08:30 (mapped from 07:20-08:00)
        {
            startTime: '07:50',
            endTime: '08:30',
            classes: [
                { classId: 'cls-10a', className: 'X A', subjectId: 'subj-mtk-w', subjectName: 'Matematika Wajib', teacherId: 'tch-dian', teacherName: 'Dian Arwulan', room: 'R. 101' },
                { classId: 'cls-10b', className: 'X B', subjectId: 'subj-bin', subjectName: 'Bahasa Arab', teacherId: 'tch-fathul', teacherName: 'Fathul Bari', room: 'R. 102' },
                { classId: 'cls-11-pem-akh', className: 'XI PEM AKH', subjectId: 'subj-bio-p', subjectName: 'Biologi', teacherId: 'tch-irmi', teacherName: 'Irmi', room: 'Lab Bio' },
                { classId: 'cls-11-pem-ikh', className: 'XI PEM IKH', subjectId: 'subj-kim', subjectName: 'Kimia', teacherId: 'tch-zahratun', teacherName: 'Zahratun N.', room: 'Lab Kimia' },
                { classId: 'cls-12a', className: 'XII A', subjectId: 'subj-kod', subjectName: 'Bimbel Sukses TKA', teacherId: 'tch-bimbel', teacherName: 'Tim Bimbel', room: 'Aula' },
                { classId: 'cls-12b', className: 'XII B', subjectId: 'subj-kod', subjectName: 'Bimbel Sukses TKA', teacherId: 'tch-bimbel', teacherName: 'Tim Bimbel', room: 'Aula' },
            ]
        },
        // Slot 2: 08:30 - 09:10 (mapped from 08:00-08:40)
        {
            startTime: '08:30',
            endTime: '09:10',
            classes: [
                { classId: 'cls-10a', className: 'X A', subjectId: 'subj-mtk-w', subjectName: 'Matematika Wajib', teacherId: 'tch-dian', teacherName: 'Dian Arwulan', room: 'R. 101' },
                { classId: 'cls-10b', className: 'X B', subjectId: 'subj-bin', subjectName: 'Bahasa Arab', teacherId: 'tch-fathul', teacherName: 'Fathul Bari', room: 'R. 102' },
                { classId: 'cls-11-pem-akh', className: 'XI PEM AKH', subjectId: 'subj-bio-p', subjectName: 'Biologi', teacherId: 'tch-irmi', teacherName: 'Irmi', room: 'Lab Bio' },
                { classId: 'cls-11-pem-ikh', className: 'XI PEM IKH', subjectId: 'subj-kim', subjectName: 'Kimia', teacherId: 'tch-zahratun', teacherName: 'Zahratun N.', room: 'Lab Kimia' },
                { classId: 'cls-12a', className: 'XII A', subjectId: 'subj-sos', subjectName: 'Seni Budaya', teacherId: 'tch-maulidia', teacherName: 'GI. Maulidia M.', room: 'R. 301' },
                { classId: 'cls-12b', className: 'XII B', subjectId: 'subj-kod', subjectName: 'BK', teacherId: 'tch-windawati', teacherName: 'Windawati', room: 'R. BK' },
            ]
        },
        // Slot 3: 09:10 - 09:50 (mapped from 08:40-09:20)
        {
            startTime: '09:10',
            endTime: '09:50',
            classes: [
                { classId: 'cls-10a', className: 'X A', subjectId: 'subj-sjr-w', subjectName: 'SJR P', teacherId: 'tch-maulidia', teacherName: 'GI. Maulidia M.', room: 'R. 101' },
                { classId: 'cls-10b', className: 'X B', subjectId: 'subj-geo', subjectName: 'Geografi', teacherId: 'tch-rini', teacherName: 'Rini F.', room: 'R. 102' },
                { classId: 'cls-11-pem-akh', className: 'XI PEM AKH', subjectId: 'subj-fis-p', subjectName: 'Fisika', teacherId: 'tch-hikmah', teacherName: 'Hikmah Fadhilah', room: 'Lab Fisika' },
                { classId: 'cls-11-pem-ikh', className: 'XI PEM IKH', subjectId: 'subj-mtk-p', subjectName: 'Matematika Lanjutan', teacherId: 'tch-fikri-kamil', teacherName: 'Fikri Insan Kamil', room: 'R. 203' },
                { classId: 'cls-12a', className: 'XII A', subjectId: 'subj-pjok-l', subjectName: 'Penjaskes', teacherId: 'tch-erik', teacherName: 'Erik Rahmana', room: 'Lapangan' },
                { classId: 'cls-12b', className: 'XII B', subjectId: 'subj-pjok-l', subjectName: 'Penjaskes', teacherId: 'tch-yuyun', teacherName: 'Yuyun R.', room: 'Lap. Basket' },
            ]
        },
        // ISTIRAHAT: 09:50 - 10:15
        // Slot 4: 10:15 - 10:55 (mapped from 10:20-11:00 combined with 09:20-10:00 content)
        {
            startTime: '10:15',
            endTime: '10:55',
            classes: [
                { classId: 'cls-10a', className: 'X A', subjectId: 'subj-kod', subjectName: 'Koding', teacherId: 'tch-ranu', teacherName: 'Rizki Ranu', room: 'Lab Komp 2' },
                { classId: 'cls-10b', className: 'X B', subjectId: 'subj-pkn', subjectName: 'PPKn', teacherId: 'tch-paisal', teacherName: 'Paisal', room: 'R. 102' },
                { classId: 'cls-11a', className: 'XI A', subjectId: 'subj-bin', subjectName: 'Bahasa Arab', teacherId: 'tch-awaludin', teacherName: 'Awaludin', room: 'R. 201' },
                { classId: 'cls-11b', className: 'XI B', subjectId: 'subj-mtk-w', subjectName: 'Matematika Wajib', teacherId: 'tch-rizky', teacherName: 'Rizky', room: 'R. 202' },
                { classId: 'cls-12a', className: 'XII A', subjectId: 'subj-kod', subjectName: 'BK', teacherId: 'tch-windawati', teacherName: 'Windawati', room: 'R. BK' },
                { classId: 'cls-12b', className: 'XII B', subjectId: 'subj-sos', subjectName: 'Seni Budaya', teacherId: 'tch-maulidia', teacherName: 'GI. Maulidia M.', room: 'R. 302' },
            ]
        },
        // Slot 5: 10:55 - 11:35 (mapped from 11:00-11:40)
        {
            startTime: '10:55',
            endTime: '11:35',
            classes: [
                { classId: 'cls-10a', className: 'X A', subjectId: 'subj-kod', subjectName: 'Koding', teacherId: 'tch-ranu', teacherName: 'Rizki Ranu', room: 'Lab Komp 2' },
                { classId: 'cls-10b', className: 'X B', subjectId: 'subj-pkn', subjectName: 'PPKn', teacherId: 'tch-paisal', teacherName: 'Paisal', room: 'R. 102' },
                { classId: 'cls-11a', className: 'XI A', subjectId: 'subj-bin', subjectName: 'Bahasa Arab', teacherId: 'tch-awaludin', teacherName: 'Awaludin', room: 'R. 201' },
                { classId: 'cls-11b', className: 'XI B', subjectId: 'subj-mtk-w', subjectName: 'Matematika Wajib', teacherId: 'tch-rizky', teacherName: 'Rizky', room: 'R. 202' },
                { classId: 'cls-11-pem-akh', className: 'XI PEM AKH', subjectId: 'subj-bio-p', subjectName: 'Biologi', teacherId: 'tch-irmi', teacherName: 'Irmi', room: 'Lab Bio' },
                { classId: 'cls-11-pem-ikh', className: 'XI PEM IKH', subjectId: 'subj-fis-p', subjectName: 'Fisika', teacherId: 'tch-hikmah', teacherName: 'Hikmah Fadhilah', room: 'Lab Fisika' },
            ]
        },
        // ISHOMA: 11:35 - 13:00
        // Slot 6: 13:00 - 13:40
        {
            startTime: '13:00',
            endTime: '13:40',
            classes: [
                { classId: 'cls-10a', className: 'X A', subjectId: 'subj-pkn', subjectName: 'PPKn', teacherId: 'tch-paisal', teacherName: 'Paisal', room: 'R. 101' },
                { classId: 'cls-10b', className: 'X B', subjectId: 'subj-mtk-w', subjectName: 'Matematika Wajib', teacherId: 'tch-dian', teacherName: 'Dian Arwulan', room: 'R. 102' },
                { classId: 'cls-11a', className: 'XI A', subjectId: 'subj-kod', subjectName: 'BK', teacherId: 'tch-windawati', teacherName: 'Windawati', room: 'R. BK' },
                { classId: 'cls-11b', className: 'XI B', subjectId: 'subj-sos', subjectName: 'Seni Budaya', teacherId: 'tch-ranu', teacherName: 'Rizki Ranu', room: 'R. 202' },
                { classId: 'cls-11-pem-akh', className: 'XI PEM AKH', subjectId: 'subj-bio-p', subjectName: 'Biologi', teacherId: 'tch-irmi', teacherName: 'Irmi', room: 'Lab Bio' },
                { classId: 'cls-11-pem-ikh', className: 'XI PEM IKH', subjectId: 'subj-fis-p', subjectName: 'Fisika', teacherId: 'tch-hikmah', teacherName: 'Hikmah Fadhilah', room: 'Lab Fisika' },
            ]
        },
        // Slot 7: 13:40 - 14:20
        {
            startTime: '13:40',
            endTime: '14:20',
            classes: [
                { classId: 'cls-10a', className: 'X A', subjectId: 'subj-pkn', subjectName: 'PPKn', teacherId: 'tch-paisal', teacherName: 'Paisal', room: 'R. 101' },
                { classId: 'cls-10b', className: 'X B', subjectId: 'subj-mtk-w', subjectName: 'Matematika Wajib', teacherId: 'tch-dian', teacherName: 'Dian Arwulan', room: 'R. 102' },
                { classId: 'cls-11a', className: 'XI A', subjectId: 'subj-tjw', subjectName: 'Tajwid', teacherId: 'tch-fathul', teacherName: 'Fathul Bari', room: 'R. 201' },
                { classId: 'cls-11b', className: 'XI B', subjectId: 'subj-sjr-w', subjectName: 'SJR W', teacherId: 'tch-maulidia', teacherName: 'GI. Maulidia M.', room: 'R. 202' },
                { classId: 'cls-11-pem-akh', className: 'XI PEM AKH', subjectId: 'subj-mtk-p', subjectName: 'Matematika Lanjutan', teacherId: 'tch-rizky', teacherName: 'M. Rizky', room: 'R. 203' },
                { classId: 'cls-11-pem-ikh', className: 'XI PEM IKH', subjectId: 'subj-kim', subjectName: 'Kimia', teacherId: 'tch-zahratun', teacherName: 'Zahratun N.', room: 'Lab Kimia' },
            ]
        },
        // Slot 8: 14:20 - 15:00
        {
            startTime: '14:20',
            endTime: '15:00',
            classes: [
                { classId: 'cls-10a', className: 'X A', subjectId: 'subj-kod', subjectName: 'BK', teacherId: 'tch-windawati', teacherName: 'Windawati', room: 'R. BK' },
                { classId: 'cls-10b', className: 'X B', subjectId: 'subj-sos', subjectName: 'Seni Budaya', teacherId: 'tch-slamet', teacherName: 'Slamet Ricky H.', room: 'R. 102' },
                { classId: 'cls-11a', className: 'XI A', subjectId: 'subj-tjw', subjectName: 'Tajwid', teacherId: 'tch-fathul', teacherName: 'Fathul Bari', room: 'R. 201' },
                { classId: 'cls-11b', className: 'XI B', subjectId: 'subj-sjr-w', subjectName: 'SJR W', teacherId: 'tch-maulidia', teacherName: 'GI. Maulidia M.', room: 'R. 202' },
                { classId: 'cls-11-pem-akh', className: 'XI PEM AKH', subjectId: 'subj-mtk-p', subjectName: 'Matematika Lanjutan', teacherId: 'tch-rizky', teacherName: 'M. Rizky', room: 'R. 203' },
                { classId: 'cls-11-pem-ikh', className: 'XI PEM IKH', subjectId: 'subj-kim', subjectName: 'Kimia', teacherId: 'tch-zahratun', teacherName: 'Zahratun N.', room: 'Lab Kimia' },
            ]
        },
    ]
};
