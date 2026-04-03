# API Documentation: Extracurricular Advisor (Tutor Ekskul)

Dokumen ini adalah **kontrak resmi** antara frontend dan backend untuk role **Tutor Ekstrakurikuler**.
Backend **wajib** mengikuti struktur request/response di bawah ini persis agar frontend berfungsi tanpa perubahan.

- **Base URL**: `{NEXT_PUBLIC_API_URL}/api/v1` (default: `http://localhost:8000/api/v1`)
- **Role Prefix**: semua endpoint di bawah menggunakan prefix `/extracurricular-advisor`
- **Authentication**: semua endpoint (kecuali auth) wajib header `Authorization: Bearer <token>`
- **Content-Type**: `application/json` untuk semua request body JSON
- **Envelope response**: semua response sukses dibungkus `{ "success": true, "data": ... }`
- **Envelope error**: semua response error dibungkus `{ "success": false, "message": "...", "code": <http_status>, "errors": { ... } }`

> **Konvensi field**: Backend **harus** mengembalikan field dalam format **snake_case**.
> Frontend sudah memiliki normalizer yang memetakan snake_case → camelCase secara otomatis.

---

## Daftar Endpoint

| # | Method | Endpoint | Deskripsi |
|---|--------|----------|-----------|
| 1 | POST | `/auth/login` | Login |
| 2 | POST | `/auth/logout` | Logout |
| 3 | POST | `/auth/forgot-password` | Lupa password |
| 4 | GET | `/extracurricular-advisor/academic-year/active` | Tahun ajaran aktif |
| 5 | GET | `/extracurricular-advisor/profile` | Ambil profil |
| 6 | PUT | `/extracurricular-advisor/profile` | Update profil |
| 7 | POST | `/extracurricular-advisor/profile/avatar` | Upload foto |
| 8 | PUT | `/extracurricular-advisor/profile/password` | Ganti password |
| 9 | GET | `/extracurricular-advisor/dashboard/stats` | Statistik dashboard |
| 10 | GET | `/extracurricular-advisor/dashboard/schedule` | Jadwal mendatang |
| 11 | GET | `/extracurricular-advisor/dashboard/recent-activities` | Aktivitas terakhir |
| 12 | GET | `/extracurricular-advisor/members` | Daftar anggota |
| 13 | GET | `/extracurricular-advisor/members/:id` | Detail anggota |
| 14 | POST | `/extracurricular-advisor/members` | Tambah anggota |
| 15 | DELETE | `/extracurricular-advisor/members/:id` | Hapus anggota |
| 16 | GET | `/extracurricular-advisor/attendance` | Riwayat presensi |
| 17 | POST | `/extracurricular-advisor/attendance` | Submit presensi |
| 18 | GET | `/extracurricular-advisor/attendance/:id` | Detail presensi |

---

## I. Authentication

### 1. Login

- **POST** `/auth/login`
- **Auth**: tidak diperlukan

**Request Body:**
```json
{
  "username": "tutor_pramuka",
  "password": "password123"
}
```

> `username` bisa berupa username, NIP, atau NIS.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "5",
      "username": "tutor_pramuka",
      "name": "Kak Tutor, S.Pd",
      "role": "tutor_ekskul",
      "avatar": "https://example.com/avatar.jpg"
    }
  }
}
```

> Token disimpan di `localStorage` dengan key `authToken`. Role disimpan dengan key `userRole`.

**Response 401:**
```json
{
  "success": false,
  "message": "Username atau password salah.",
  "code": 401
}
```

---

### 2. Logout

- **POST** `/auth/logout`
- **Auth**: Bearer Token

**Response 200:**
```json
{
  "success": true,
  "message": "Berhasil logout."
}
```

---

### 3. Forgot Password

- **POST** `/auth/forgot-password`
- **Auth**: tidak diperlukan

**Request Body:**
```json
{
  "email": "tutor@sekolah.sch.id"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Link reset password telah dikirim ke email Anda."
}
```

---

## II. System Configuration

### 4. Get Active Academic Year

- **GET** `/extracurricular-advisor/academic-year/active`
- **Auth**: Bearer Token

**Response 200:**
```json
{
  "success": true,
  "data": {
    "academicYear": "2025/2026",
    "semester": "1",
    "label": "Ganjil"
  }
}
```

> Field `academicYear` dan `semester` digunakan sebagai query param di endpoint lain.
> Nilai semester: `"1"` = Ganjil, `"2"` = Genap.

---

## III. Profile Management

### 5. Get Profile

- **GET** `/extracurricular-advisor/profile`
- **Auth**: Bearer Token

**Response 200:**
```json
{
  "success": true,
  "data": {
    "name": "Budi Santoso, S.Pd",
    "username": "budi.santoso",
    "email": "budi.santoso@alfityan.sch.id",
    "phone": "+62 812-9876-5432",
    "role": "Tutor Ekstrakurikuler",
    "profile_picture": "https://example.com/avatar.jpg",
    "address": "Jl. Merpati No. 45, Makassar",
    "join_date": "2019-08-10",
    "nip": "198812122015021002",
    "extracurricular": "Pramuka"
  },
  "message": "Data profil berhasil diambil"
}
```

> **Field wajib snake_case**: `profile_picture`, `join_date`.
> Field `nip` boleh `null` jika tidak ada.

---

### 6. Update Profile

- **PUT** `/extracurricular-advisor/profile`
- **Auth**: Bearer Token

**Request Body:**
```json
{
  "name": "Budi Santoso, S.Pd",
  "username": "budi.santoso.baru",
  "email": "budi.baru@alfityan.sch.id",
  "phone": "081234567890",
  "address": "Jl. Baru No. 123, Makassar"
}
```

> Field `nip` dan `extracurricular` **tidak dapat diubah** — tidak perlu diterima di endpoint ini.

**Response 200:** sama dengan struktur Get Profile di atas (mengembalikan data terbaru).

**Response 422 (Validasi gagal):**
```json
{
  "success": false,
  "message": "Data tidak valid.",
  "code": 422,
  "errors": {
    "email": ["Email sudah digunakan."],
    "username": ["Username sudah digunakan."]
  }
}
```

---

### 7. Upload Avatar

- **POST** `/extracurricular-advisor/profile/avatar`
- **Auth**: Bearer Token
- **Content-Type**: `multipart/form-data`

**Request Body (FormData):**
```
avatar: <File> (jpg/png, max 2MB)
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "avatar": "https://example.com/storage/avatars/budi.jpg",
    "profile_picture": "https://example.com/storage/avatars/budi.jpg",
    "thumbnails": {
      "small": "https://example.com/storage/avatars/budi_sm.jpg",
      "medium": "https://example.com/storage/avatars/budi_md.jpg"
    }
  }
}
```

**Response 422:**
```json
{
  "success": false,
  "message": "File tidak valid.",
  "code": 422,
  "errors": {
    "avatar": ["File harus berformat JPG atau PNG.", "Ukuran file maksimal 2MB."]
  }
}
```

---

### 8. Change Password

- **PUT** `/extracurricular-advisor/profile/password`
- **Auth**: Bearer Token

**Request Body:**
```json
{
  "current_password": "passwordLama123",
  "new_password": "PasswordBaruKuat1!",
  "password_confirmation": "PasswordBaruKuat1!"
}
```

> **Penting**: frontend mengirim `current_password`, `new_password`, `password_confirmation` (bukan camelCase).

**Response 200:**
```json
{
  "success": true,
  "data": {
    "password_last_changed": "2025-12-26T10:30:00Z"
  },
  "message": "Kata sandi berhasil diubah."
}
```

**Response 400 (Password lama salah):**
```json
{
  "success": false,
  "message": "Kata sandi saat ini salah.",
  "code": 400
}
```

**Response 422 (Validasi gagal):**
```json
{
  "success": false,
  "message": "Data tidak valid.",
  "code": 422,
  "errors": {
    "new_password": ["Kata sandi minimal 8 karakter."],
    "password_confirmation": ["Konfirmasi kata sandi tidak cocok."]
  }
}
```

---

## IV. Dashboard

### 9. Get Dashboard Statistics

- **GET** `/extracurricular-advisor/dashboard/stats`
- **Auth**: Bearer Token

**Query Parameters:**

| Param | Tipe | Wajib | Contoh | Keterangan |
|-------|------|-------|--------|------------|
| `academic_year` | string | tidak | `2025/2026` | Filter tahun ajaran |
| `semester` | string | tidak | `1` | Filter semester (`1` atau `2`) |

**Response 200:**
```json
{
  "success": true,
  "data": {
    "total_members": 45,
    "last_attendance_present": 42,
    "average_attendance": 91,
    "total_meetings": 12,
    "active_students": 38,
    "needs_attention": 7
  }
}
```

> Semua field **wajib snake_case**.
> - `total_members`: jumlah anggota aktif
> - `last_attendance_present`: jumlah hadir pada pertemuan terakhir
> - `average_attendance`: rata-rata kehadiran dalam persen (integer 0–100)
> - `total_meetings`: total pertemuan yang sudah tercatat
> - `active_students`: anggota dengan kehadiran ≥ 90%
> - `needs_attention`: anggota dengan kehadiran < 75%

---

### 10. Get Upcoming Schedule

- **GET** `/extracurricular-advisor/dashboard/schedule`
- **Auth**: Bearer Token

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "day": "Jumat",
      "date": "26 Desember 2025",
      "time": "14:00 - 16:00"
    },
    {
      "id": 2,
      "day": "Jumat",
      "date": "09 Januari 2026",
      "time": "14:00 - 16:00"
    }
  ]
}
```

> `date` dalam format string yang sudah diformat (bukan ISO), karena langsung ditampilkan ke UI.
> Kembalikan maksimal 3–5 jadwal mendatang.

---

### 11. Get Recent Activities

- **GET** `/extracurricular-advisor/dashboard/recent-activities`
- **Auth**: Bearer Token

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "day": "Jumat",
      "date": "20 Des 2025",
      "time": "14:00 - 16:00",
      "attendance": 93
    },
    {
      "id": 2,
      "day": "Jumat",
      "date": "13 Des 2025",
      "time": "14:00 - 16:30",
      "attendance": 89
    },
    {
      "id": 3,
      "day": "Jumat",
      "date": "06 Des 2025",
      "time": "14:00 - 16:00",
      "attendance": 84
    }
  ]
}
```

> `attendance` adalah persentase kehadiran siswa (integer 0–100).
> `id` adalah ID dari record presensi — digunakan untuk navigasi ke halaman detail.
> Kembalikan maksimal 3 aktivitas terakhir.

---

## V. Member Management (Anggota)

### 12. Get Members List

- **GET** `/extracurricular-advisor/members`
- **Auth**: Bearer Token

**Query Parameters:**

| Param | Tipe | Wajib | Contoh | Keterangan |
|-------|------|-------|--------|------------|
| `academic_year` | string | tidak | `2025/2026` | Filter tahun ajaran |
| `semester` | string | tidak | `1` | Filter semester |
| `class` | string | tidak | `XI A` | Filter kelas. Kirim `all` atau kosongkan untuk semua |
| `search` | string | tidak | `Andi` | Cari berdasarkan nama atau NIS |
| `status` | string | tidak | `Aktif` | `Aktif` atau `Nonaktif`. Kosongkan untuk semua |
| `page` | integer | tidak | `1` | Halaman (default: 1) |
| `limit` | integer | tidak | `10` | Jumlah per halaman (default: 10) |

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nis": "2022001",
      "name": "Andi Wijaya",
      "class": "XII A",
      "join_date": "2024-07-15",
      "attendance": 92,
      "status": "Aktif"
    },
    {
      "id": 901,
      "nis": "2022901",
      "name": "Kenji Satria",
      "class": "XI A",
      "join_date": "2024-07-15",
      "attendance": 60,
      "status": "Nonaktif",
      "inactive_date": "2024-10-15",
      "inactive_reason": "Pindah Ekstrakurikuler ke Basket"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "total": 45,
    "per_page": 10
  }
}
```

> **Field wajib snake_case**: `join_date`, `inactive_date`, `inactive_reason`.
> `attendance` adalah persentase kehadiran (integer 0–100).
> `status` nilainya: `"Aktif"` atau `"Nonaktif"` (kapital, bahasa Indonesia).
> `inactive_date` dan `inactive_reason` hanya ada jika `status = "Nonaktif"`, boleh `null` jika tidak ada.
> Meta pagination menggunakan format Laravel default: `current_page`, `last_page`, `total`, `per_page`.

---

### 13. Get Member Detail

- **GET** `/extracurricular-advisor/members/:id`
- **Auth**: Bearer Token

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nis": "2022001",
    "name": "Andi Wijaya",
    "class": "XII A",
    "join_date": "2024-07-15",
    "attendance": 92,
    "status": "Aktif"
  }
}
```

**Response 404:**
```json
{
  "success": false,
  "message": "Anggota tidak ditemukan.",
  "code": 404
}
```

---

### 14. Add Member

- **POST** `/extracurricular-advisor/members`
- **Auth**: Bearer Token

**Request Body:**
```json
{
  "nis": "2025001",
  "name": "Siswa Baru",
  "class": "X A",
  "join_date": "2025-07-15"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": 50,
    "nis": "2025001",
    "name": "Siswa Baru",
    "class": "X A",
    "join_date": "2025-07-15",
    "attendance": 0,
    "status": "Aktif"
  }
}
```

---

### 15. Delete Member

- **DELETE** `/extracurricular-advisor/members/:id`
- **Auth**: Bearer Token

**Response 200:**
```json
{
  "success": true,
  "message": "Anggota berhasil dihapus."
}
```

---

## VI. Attendance (Presensi)

### 16. Get Attendance History

- **GET** `/extracurricular-advisor/attendance`
- **Auth**: Bearer Token

**Query Parameters:**

| Param | Tipe | Wajib | Contoh | Keterangan |
|-------|------|-------|--------|------------|
| `start_date` | string | tidak | `2025-12-01` | Filter dari tanggal (YYYY-MM-DD) |
| `end_date` | string | tidak | `2025-12-31` | Filter sampai tanggal (YYYY-MM-DD) |

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "date": "2025-12-20",
      "student_stats": {
        "present": 14,
        "total": 15,
        "percentage": 93
      },
      "advisor_stats": {
        "tutor_name": "Ahmad Fauzi, S.Pd",
        "start_time": "14:00",
        "end_time": "16:00",
        "duration": "2j 0m",
        "status": "hadir"
      }
    },
    {
      "id": 2,
      "date": "2025-12-13",
      "student_stats": {
        "present": 13,
        "total": 15,
        "percentage": 87
      },
      "advisor_stats": {
        "tutor_name": "Ahmad Fauzi, S.Pd",
        "start_time": "14:00",
        "end_time": "16:30",
        "duration": "2j 30m",
        "status": "hadir"
      }
    }
  ]
}
```

> **Field wajib snake_case**: `student_stats`, `advisor_stats`, dan semua field di dalamnya (`tutor_name`, `start_time`, `end_time`).
> `date` format ISO: `YYYY-MM-DD`.
> `percentage` adalah integer 0–100.
> Urutkan dari yang terbaru (descending by date).

---

### 17. Submit Attendance

- **POST** `/extracurricular-advisor/attendance`
- **Auth**: Bearer Token

**Request Body:**
```json
{
  "date": "2025-12-26",
  "start_time": "14:00",
  "end_time": "16:00",
  "topic": "Kegiatan Rutin",
  "students": [
    { "student_id": 1, "status": "hadir" },
    { "student_id": 2, "status": "sakit", "note": "Demam" },
    { "student_id": 3, "status": "izin", "note": "Acara keluarga" },
    { "student_id": 4, "status": "alpa" }
  ]
}
```

> **Field wajib snake_case**: `start_time`, `end_time`, `student_id`.
> `topic` opsional.
> `status` nilai yang valid: `"hadir"`, `"sakit"`, `"izin"`, `"alpa"`.
> `note` opsional, hanya relevan untuk `sakit` dan `izin`.
> Semua anggota aktif **harus** disertakan dalam array `students`.

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": 123
  },
  "message": "Presensi berhasil disimpan."
}
```

**Response 422:**
```json
{
  "success": false,
  "message": "Data tidak valid.",
  "code": 422,
  "errors": {
    "date": ["Tanggal wajib diisi."],
    "start_time": ["Waktu mulai wajib diisi."],
    "students": ["Daftar siswa tidak boleh kosong."]
  }
}
```

---

### 18. Get Attendance Detail

- **GET** `/extracurricular-advisor/attendance/:id`
- **Auth**: Bearer Token

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "date": "2025-12-20",
    "topic": "Kegiatan Rutin Ekstrakurikuler",
    "student_stats": {
      "present": 14,
      "total": 15,
      "percentage": 93
    },
    "advisor_stats": {
      "tutor_name": "Ahmad Fauzi, S.Pd",
      "start_time": "14:00",
      "end_time": "16:00",
      "duration": "2j 0m",
      "status": "hadir"
    },
    "students": [
      {
        "id": 1,
        "nis": "2022001",
        "name": "Andi Wijaya",
        "class": "XII A",
        "status": "hadir",
        "note": null
      },
      {
        "id": 2,
        "nis": "2022002",
        "name": "Rina Kusuma",
        "class": "XI A",
        "status": "sakit",
        "note": "Demam"
      }
    ]
  }
}
```

> Struktur `student_stats` dan `advisor_stats` sama dengan endpoint history.
> `students` berisi semua anggota yang tercatat pada sesi tersebut.
> `note` boleh `null`.

**Response 404:**
```json
{
  "success": false,
  "message": "Data presensi tidak ditemukan.",
  "code": 404
}
```

---

## VII. Error Response Format

Semua error menggunakan format berikut:

```json
{
  "success": false,
  "message": "Pesan error yang dapat ditampilkan ke user.",
  "code": 422,
  "errors": {
    "field_name": ["Pesan validasi 1.", "Pesan validasi 2."]
  }
}
```

> `errors` hanya ada pada response 422 (validasi). Untuk error lain (`401`, `403`, `404`, `500`) cukup `message` saja.

| HTTP Status | Kasus |
|-------------|-------|
| 200 | Sukses GET / PUT |
| 201 | Sukses POST (create) |
| 400 | Bad request (misal: password lama salah) |
| 401 | Token tidak valid / expired |
| 403 | Tidak punya akses ke resource |
| 404 | Data tidak ditemukan |
| 422 | Validasi gagal |
| 500 | Server error |

---

## VIII. Catatan Implementasi

1. **Token**: frontend menyimpan token di `localStorage["authToken"]`. Pastikan token dikembalikan saat login dan divalidasi via middleware Laravel Sanctum/Passport.

2. **Role guard**: endpoint `/extracurricular-advisor/*` hanya boleh diakses oleh user dengan role `tutor_ekskul`. Kembalikan `403` jika role tidak sesuai.

3. **Scope data**: semua data (anggota, presensi) harus di-scope ke ekstrakurikuler yang diasuh oleh tutor yang sedang login — bukan semua data global.

4. **Pagination**: gunakan Laravel default pagination. Frontend membaca `meta.current_page`, `meta.last_page`, `meta.total`.

5. **`academic_year` format**: `"2025/2026"` (dengan slash, bukan dash).

6. **`semester` format**: `"1"` atau `"2"` sebagai string.

7. **`class` field**: gunakan nama kolom `class` di query param dan response. Jika nama kolom di database berbeda (misal `class_name`), lakukan mapping di Laravel Resource sebelum dikembalikan ke frontend.
