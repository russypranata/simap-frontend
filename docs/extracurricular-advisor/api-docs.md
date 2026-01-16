# API Documentation: Extracurricular Advisor (Tutor Ekskul)

Dokumen ini menjelaskan endpoint API lengkap untuk Role **Tutor Ekstrakurikuler**.

**Base URL**: `http://localhost:8000/api/v1` (Default)
**Authentication**: Bearer Token pada Header `Authorization`.
**Role Prefix**: `/extracurricular-advisor`

---

## I. Authentication

Endpoint umum untuk otentikasi pengguna.

### 1. Login

Masuk ke sistem untuk mendapatkan token akses.

- **Endpoint**: `POST /auth/login`
- **Request Body**:

```json
{
  "username": "tutor_pramuka", // Bisa berupa Username, NIP, atau NIS
  "password": "password123"
}
```

**Response (200 OK):**

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

### 2. Forgot Password

Mengirim permintaan reset password jika lupa kata sandi.

- **Endpoint**: `POST /auth/forgot-password`
- **Request Body**:

```json
{
  "email": "tutor@sekolah.sch.id"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Link reset password telah dikirim ke email Anda."
}
```

### 3. Logout

Keluar dari sistem dan menghapus sesi (token invalidation).

- **Endpoint**: `POST /auth/logout`
- **Headers**: `Authorization: Bearer <token>`

---

## II. Profile Management

Fitur pengelolaan profil tutor.

### 1. Get Profile

Mengambil data detail profil tutor yang sedang login.

- **Endpoint**: `GET /extracurricular-advisor/profile`
- **Headers**: `Authorization: Bearer <token>`

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "name": "Budi Santoso, S.Pd",
    "username": "budi.santoso",
    "email": "budi.santoso@alfityan.sch.id",
    "phone": "+62 812-9876-5432",
    "role": "Tutor Ekstrakurikuler",
    "profilePicture": "https://example.com/avatar.jpg",
    "address": "Jl. Merpati No. 45",
    "joinDate": "2019-08-10",
    "nip": "198812122015021002",
    "extracurricular": "Futsal"
  },
  "message": "Data profil berhasil diambil"
}
```

### 2. Update Profile

Memperbarui informasi dasar profil tutor.

- **Endpoint**: `PUT /extracurricular-advisor/profile`
- **Request Body**:

```json
{
  "name": "Budi Santoso, S.Pd",
  "username": "budisantoso.new",
  "email": "budi@example.com",
  "phone": "081234567890",
  "address": "Jl. Baru No. 123"
}
```

### 3. Upload Avatar

Mengunggah foto profil baru.

- **Endpoint**: `POST /extracurricular-advisor/profile/avatar`
- **Body (FormData)**: `avatar` (File: jpg/png, max 2MB)

### 4. Change Password

Mengubah kata sandi akun.

- **Endpoint**: `PUT /extracurricular-advisor/profile/password`
- **Request Body**:

```json
{
  "currentPassword": "passwordLama123",
  "newPassword": "PasswordBaruStrong1!",
  "confirmPassword": "PasswordBaruStrong1!"
}
```

---

## III. Dashboard

Data ringkasan untuk halaman utama dashboard.

### 1. Get Dashboard Statistics

Mengambil statistik ringkas (anggota, kehadiran, pertemuan).

- **Endpoint**: `GET /extracurricular-advisor/dashboard/stats`
- **Query Params**: `academicYear` (optional), `semester` (optional)

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "totalMembers": 45,
    "lastAttendancePresent": 42,
    "averageAttendance": 91,
    "totalMeetings": 12,
    "activeStudents": 38,
    "needsAttention": 7
  }
}
```

### 2. Get Upcoming Schedule

Mengambil jadwal kegiatan mendatang.

- **Endpoint**: `GET /extracurricular-advisor/dashboard/schedule`

**Response (200 OK):**

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

### 3. Get Recent Activities

Mengambil riwayat aktivitas (presensi) terakhir untuk widget dashboard.

- **Endpoint**: `GET /extracurricular-advisor/dashboard/recent-activities`
- **Response**: Array dari ringkasan presensi (ID, Tanggal, Jumlah Hadir).

---

## IV. Member Management (Anggota)

Pengelolaan data siswa anggota ekstrakurikuler.

### 1. Get Members List

Mengambil daftar anggota dengan filter.

- **Endpoint**: `GET /extracurricular-advisor/members`
- **Query Params**:
  - `academicYear` (2025/2026)
  - `semester` (Filter semester: "1" for Ganjil, "2" for Genap)
  - `class` (Filter kelas, e.g., "X A")
  - `search` (Pencarian nama/NIS)
  - `page` (Pagination)
  - `limit` (Items per page)

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nis": "2022001",
      "name": "Andi Wijaya",
      "class": "XII A",
      "joinDate": "2024-07-15",
      "attendance": 92 // Persentase kehadiran total
    }
    // ...
  ],
  "meta": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 45
  }
}
```

### 2. Get Member Detail

Mengambil detail satu anggota beserta riwayat kehadirannya.

- **Endpoint**: `GET /extracurricular-advisor/members/:id`

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "nis": "2022001",
    "name": "Andi Wijaya",
    "class": "XII A",
    "joinDate": "2024-07-15",
    "attendance": 92
  }
}
```

---

## V. Attendance (Presensi)

Fitur pencatatan kehadiran siswa.

### 1. Get Attendance History

Mengambil riwayat sesi presensi yang sudah dilakukan.

- **Endpoint**: `GET /extracurricular-advisor/attendance`
- **Query Params**:
  - `startDate` (YYYY-MM-DD)
  - `endDate` (YYYY-MM-DD)

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "date": "2025-12-20",
      "studentStats": { "present": 42, "total": 45, "percentage": 93 },
      "advisorStats": {
        "tutorName": "Ahmad Fauzi",
        "startTime": "14:00",
        "endTime": "16:00",
        "status": "hadir"
      }
    }
  ]
}
```

### 2. Submit Attendance (Create)

Menyimpan data presensi baru (Siswa & Tutor).

- **Endpoint**: `POST /extracurricular-advisor/attendance`
- **Request Body**:

```json
{
  "date": "2025-12-26",
  "startTime": "14:00",
  "endTime": "16:00",
  "tutorStatus": "hadir", // Status kehadiran tutor
  "students": [
    { "studentId": 1, "status": "hadir" },
    { "studentId": 2, "status": "sakit", "note": "Demam" },
    { "studentId": 3, "status": "alpa" }
  ]
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Presensi berhasil disimpan",
  "data": { "id": 123 } // ID presensi yang baru dibuat
}
```

### 3. Get Attendance Detail

Mengambil detail satu sesi presensi (siapa saja yang hadir/tidak).

- **Endpoint**: `GET /extracurricular-advisor/attendance/:id`

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 123,
    "date": "2025-12-26",
    "startTime": "14:00",
    "endTime": "16:00",
    "students": [
      { "id": 1, "name": "Andi", "status": "hadir" }
      // ...
    ]
  }
}
```
