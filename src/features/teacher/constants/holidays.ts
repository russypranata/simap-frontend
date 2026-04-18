 
export const INDONESIAN_HOLIDAYS_2025: Record<string, string> = {
    '2025-01-01': 'Tahun Baru 2025 Masehi',
    '2025-01-27': 'Isra Mikraj Nabi Muhammad SAW',
    '2025-01-29': 'Tahun Baru Imlek 2576 Kongzili',
    '2025-03-29': 'Hari Suci Nyepi Tahun Baru Saka 1947',
    '2025-03-31': 'Idul Fitri 1446 Hijriah',
    '2025-04-01': 'Idul Fitri 1446 Hijriah',
    '2025-04-18': 'Wafat Isa Al Masih',
    '2025-04-20': 'Kebangkitan Isa Al Masih (Paskah)',
    '2025-05-01': 'Hari Buruh Internasional',
    '2025-05-12': 'Hari Raya Waisak 2569 BE',
    '2025-05-29': 'Kenaikan Isa Al Masih',
    '2025-06-01': 'Hari Lahir Pancasila',
    '2025-06-06': 'Idul Adha 1446 Hijriah',
    '2025-06-27': 'Tahun Baru Islam 1447 Hijriah',
    '2025-08-17': 'Hari Kemerdekaan Republik Indonesia',
    '2025-09-05': 'Maulid Nabi Muhammad SAW',
    '2025-12-25': 'Hari Raya Natal',
};

export const isWeekend = (dateString: string): boolean => {
    const date = new Date(dateString);
    const day = date.getDay();
    return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
};

export const getHolidayInfo = (dateString: string): { isHoliday: boolean; name: string | null } => {
    // Check for national holiday
    if (INDONESIAN_HOLIDAYS_2025[dateString]) {
        return { isHoliday: true, name: INDONESIAN_HOLIDAYS_2025[dateString] };
    }

    // Check for weekend
    const date = new Date(dateString);
    const day = date.getDay();

    if (day === 0) return { isHoliday: true, name: 'Hari Minggu' };
    if (day === 6) return { isHoliday: true, name: 'Hari Sabtu' };

    return { isHoliday: false, name: null };
};
