# 📘 Panduan Migrasi Sistem Presensi ke API Real

## Status Kesiapan: ✅ SIAP dengan Catatan

Sistem presensi sudah siap menerima data dari API real, dengan beberapa persyaratan format data yang harus dipenuhi.

---

## 1. Format Data Schedule dari API

### Endpoint yang Dibutuhkan
```
GET /api/teacher/schedule
GET /api/teacher/schedule?day=Senin
```

### Response Format
```typescript
{
  "data": [
    {
      "id": "string",
      "day": "Senin" | "Selasa" | "Rabu" | "Kamis" | "Jumat" | "Sabtu",
      "time": "07:00 - 07:45",  // HARUS dengan format ini (spasi sebelum dan sesudah -)
      "class": "X IPA 1",       // Nama kelas harus sama dengan data kelas
      "subject": "Matematika",
      "teacher": "Budi Santoso, S.Pd.",
      "room": "Ruang 8",
      "hasJournal": false,      // Optional
      "hasAttendance": false    // Optional
    }
  ]
}
```

### ⚠️ PERSYARATAN PENTING

#### A. Format Waktu
- **HARUS** menggunakan format: `"HH:MM - HH:MM"` (dengan spasi)
- **HARUS** menggunakan leading zero (07:00, bukan 7:00)
- Waktu yang valid sesuai time mapping:
  ```
  07:00, 07:45, 08:30, 09:15, 10:15, 11:00, 11:45, 13:00, 13:45
  ```

#### B. Nama Hari
- **HARUS** dalam Bahasa Indonesia
- **HARUS** huruf pertama kapital
- Valid: `"Senin"`, `"Selasa"`, `"Rabu"`, `"Kamis"`, `"Jumat"`, `"Sabtu"`

#### C. Nama Kelas
- **HARUS** konsisten dengan data kelas
- Format: `"[Tingkat] [Jurusan] [Nomor]"`
- Contoh: `"X IPA 1"`, `"XI IPA 2"`, `"XII IPA 1"`

#### D. Jadwal Berurutan (Consecutive)
Untuk mata pelajaran yang memiliki 2+ jam berturut-turut:
```json
[
  {
    "id": "1",
    "time": "07:00 - 07:45",
    "class": "X IPA 1",
    "subject": "Matematika"
  },
  {
    "id": "2",
    "time": "07:45 - 08:30",  // Waktu mulai = waktu akhir sebelumnya
    "class": "X IPA 1",
    "subject": "Matematika"    // Subject dan class harus sama
  }
]
```

Sistem akan otomatis menggabungkan menjadi: **"Jam ke-1-2 (07:00-08:30)"**

---

## 2. Cara Implementasi di Code

### Step 1: Update `teacherApi.ts`

Ganti mock implementation dengan real API call:

```typescript
// File: src/features/teacher/services/teacherApi.ts

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const teacherApi = {
  // ... other methods

  // Schedule
  getSchedule: async (day?: string): Promise<Schedule[]> => {
    try {
      const params = day ? { day } : {};
      const response = await axios.get<{ data: Schedule[] }>(
        `${API_BASE_URL}/teacher/schedule`,
        { params }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching schedule:', error);
      throw error;
    }
  },
};
```

### Step 2: Update Environment Variables

Tambahkan di `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

### Step 3: Testing

Tidak perlu mengubah kode di `Attendance.tsx` atau `useTeacherData.ts`. Sistem sudah siap!

---

## 3. Validasi Data dari API

### Checklist Validasi

Pastikan API response memenuhi kriteria berikut:

- [ ] Format waktu: `"HH:MM - HH:MM"` dengan spasi
- [ ] Waktu menggunakan leading zero (07:00, bukan 7:00)
- [ ] Waktu start dan end ada dalam time mapping
- [ ] Nama hari dalam Bahasa Indonesia dengan huruf pertama kapital
- [ ] Nama kelas konsisten dengan data kelas
- [ ] Untuk jadwal berurutan: waktu end slot 1 = waktu start slot 2
- [ ] Subject dan class sama untuk jadwal berurutan

### Contoh Validasi Script

```typescript
function validateSchedule(schedule: Schedule): boolean {
  // 1. Validate time format
  const timeRegex = /^\d{2}:\d{2} - \d{2}:\d{2}$/;
  if (!timeRegex.test(schedule.time)) {
    console.error(`Invalid time format: ${schedule.time}`);
    return false;
  }

  // 2. Validate day
  const validDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  if (!validDays.includes(schedule.day)) {
    console.error(`Invalid day: ${schedule.day}`);
    return false;
  }

  // 3. Validate time mapping
  const [startTime, endTime] = schedule.time.split(' - ');
  const validTimes = ['07:00', '07:45', '08:30', '09:15', '10:15', '11:00', '11:45', '13:00', '13:45'];
  
  if (!validTimes.includes(startTime)) {
    console.error(`Invalid start time: ${startTime}`);
    return false;
  }

  return true;
}
```

---

## 4. Troubleshooting

### Problem: Jam mapel tidak muncul

**Penyebab:**
1. Format waktu tidak sesuai (tanpa spasi atau tanpa leading zero)
2. Waktu tidak ada dalam time mapping
3. Nama hari tidak sesuai format

**Solusi:**
1. Cek console browser untuk error
2. Validasi response API dengan script di atas
3. Pastikan backend mengirim format yang benar

### Problem: Jadwal tidak tergabung (2 jam terpisah)

**Penyebab:**
Waktu end dari slot pertama ≠ waktu start dari slot kedua

**Contoh Salah:**
```json
[
  { "time": "07:00 - 07:45" },
  { "time": "07:50 - 08:35" }  // ❌ Gap antara 07:45 dan 07:50
]
```

**Contoh Benar:**
```json
[
  { "time": "07:00 - 07:45" },
  { "time": "07:45 - 08:30" }  // ✅ Berurutan
]
```

---

## 5. Testing dengan Mock vs Real API

### Development Mode (Mock)
```typescript
// teacherApi.ts
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export const teacherApi = {
  getSchedule: async (day?: string): Promise<Schedule[]> => {
    if (USE_MOCK) {
      // Use mock data
      return extendedMockSchedule.filter(s => !day || s.day === day);
    } else {
      // Use real API
      const response = await axios.get(`${API_BASE_URL}/teacher/schedule`, {
        params: { day }
      });
      return response.data.data;
    }
  },
};
```

### .env.local
```env
NEXT_PUBLIC_USE_MOCK=false  # Set to true untuk development
NEXT_PUBLIC_API_URL=https://api.example.com/api
```

---

## 6. Contoh Response API yang Benar

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "day": "Selasa",
      "time": "11:00 - 11:45",
      "class": "X IPA 1",
      "subject": "Matematika",
      "teacher": "Budi Santoso, S.Pd.",
      "room": "Ruang 8",
      "hasJournal": false,
      "hasAttendance": false
    },
    {
      "id": "2",
      "day": "Selasa",
      "time": "11:45 - 13:00",
      "class": "X IPA 1",
      "subject": "Matematika",
      "teacher": "Budi Santoso, S.Pd.",
      "room": "Ruang 8",
      "hasJournal": false,
      "hasAttendance": false
    }
  ]
}
```

Sistem akan otomatis memproses ini menjadi:
- **Mata Pelajaran**: Matematika
- **Jam Pelajaran**: Jam ke-6-7 (11:00-13:00)

---

## 7. Summary

### ✅ Yang Sudah Siap
- Struktur data dan types
- API service layer
- Data fetching hooks
- Logika pemrosesan jadwal
- UI components
- Error handling

### ⚠️ Yang Perlu Diperhatikan Backend
- Format waktu harus konsisten
- Nama hari dalam Bahasa Indonesia
- Waktu harus sesuai time mapping
- Jadwal berurutan harus consecutive

### 🚀 Next Steps
1. Koordinasi dengan backend untuk format data
2. Update `teacherApi.ts` dengan real API endpoint
3. Set environment variables
4. Testing dengan data real
5. Monitor dan fix issues jika ada

---

**Kesimpulan**: Sistem frontend **SUDAH SIAP** menerima data dari API, asalkan backend mengirim data dengan format yang sesuai dengan spesifikasi di atas.
