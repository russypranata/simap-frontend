# Student Profile API Contract

Dokumen ini menjelaskan spesifikasi endpoint API yang dibutuhkan oleh halaman **Student Profile**, **Edit Student Profile**, dan **Pengaturan Kata Sandi**.

---

## Base URL

```
Production:  https://api.simap.sch.id/api/v1/student
Development: http://localhost:8000/api/v1/student
```

---

## Authentication

Semua endpoint memerlukan **Bearer Token** (JWT) di header.

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Expiry
- Access Token: 60 menit
- Refresh Token: 7 hari

---

## Request Headers

| Header | Value | Required | Description |
|--------|-------|----------|-------------|
| `Authorization` | `Bearer {token}` | ✅ Yes | JWT access token |
| `Accept` | `application/json` | ✅ Yes | Response format |
| `Content-Type` | `application/json` | ✅ Yes | Request body format (kecuali upload file) |
| `X-Requested-With` | `XMLHttpRequest` | ⚪ Optional | Untuk AJAX request |
| `Accept-Language` | `id` | ⚪ Optional | Bahasa response (id/en) |

### Contoh Request Header
```http
GET /api/v1/student/profile HTTP/1.1
Host: api.simap.sch.id
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Accept: application/json
Content-Type: application/json
```

---

## Rate Limiting

API menggunakan rate limiting untuk mencegah abuse.

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| Regular endpoints | 60 requests | per menit |
| Auth endpoints | 10 requests | per menit |
| Upload endpoints | 10 requests | per menit |

### Rate Limit Headers
```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 58
X-RateLimit-Reset: 1705161600
```

### Rate Limit Exceeded Response (429)
```json
{
  "code": 429,
  "status": "error",
  "message": "Terlalu banyak permintaan. Coba lagi dalam 60 detik.",
  "retry_after": 60
}
```

---

## Daftar Endpoint

| No | Method | Endpoint | Deskripsi | Rate Limit |
|----|--------|----------|-----------|------------|
| 1 | GET | `/profile` | Mengambil data profil siswa | 60/min |
| 2 | PUT | `/profile` | Memperbarui data profil siswa | 60/min |
| 3 | POST | `/profile/avatar` | Upload foto profil | 10/min |
| 4 | PUT | `/profile/password` | Mengubah kata sandi | 10/min |

---

## 1. Get Profile Data

Mengambil data lengkap profil siswa untuk ditampilkan di halaman profil dan formulir edit.

### Request

```http
GET /api/v1/student/profile
Authorization: Bearer {token}
Accept: application/json
```

### cURL Example
```bash
curl -X GET "https://api.simap.sch.id/api/v1/student/profile" \
  -H "Authorization: Bearer {token}" \
  -H "Accept: application/json"
```

### Success Response (200 OK)
```json
{
  "code": 200,
  "status": "success",
  "message": "Data profil berhasil diambil",
  "data": {
    "id": 1,
    "name": "Ahmad Fauzan Ramadhan",
    "nis": "0012345678",
    "nisn": "0107959840",
    "class": "XII IPA 1",
    "email": "ahmad.fauzan@student.sman1.sch.id",
    "phone": "08123456789",
    "address": "Jl. Merdeka No. 10, RT 05/RW 02, Kel. Sukamaju, Kec. Cikupa",
    "birthPlace": "Tangerang",
    "birthDate": "2007-05-15",
    "religion": "Islam",
    "joinDate": "Juli 2023",
    "role": "Siswa",
    "validUntil": "31 Juni 2028",
    "profilePicture": "https://api.simap.sch.id/storage/avatars/student_001.jpg",
    "avatar": "https://api.simap.sch.id/storage/avatars/student_001.jpg",
    "passwordLastChanged": "2024-10-13T10:30:00Z",
    "createdAt": "2023-07-01T00:00:00Z",
    "updatedAt": "2025-01-13T12:00:00Z"
  },
  "meta": {
    "timestamp": "2025-01-13T19:30:00Z",
    "version": "1.1.0"
  }
}
```

### Error Responses

#### 401 Unauthorized
```json
{
  "code": 401,
  "status": "error",
  "message": "Token tidak valid atau sudah kadaluarsa",
  "errors": null
}
```

#### 404 Not Found
```json
{
  "code": 404,
  "status": "error",
  "message": "Data profil tidak ditemukan",
  "errors": null
}
```

---

## 2. Update Profile Data

Menyimpan perubahan data profil siswa yang dilakukan di halaman Edit Profile.

### Request

```http
PUT /api/v1/student/profile
Authorization: Bearer {token}
Accept: application/json
Content-Type: application/json
```

### Request Body
```json
{
  "name": "Ahmad Fauzan Ramadhan",
  "email": "ahmad.fauzan@student.sman1.sch.id",
  "phone": "081299998888",
  "address": "Jl. Baru No. 1, Tangerang",
  "birthPlace": "Tangerang",
  "birthDate": "2007-05-15"
}
```

### cURL Example
```bash
curl -X PUT "https://api.simap.sch.id/api/v1/student/profile" \
  -H "Authorization: Bearer {token}" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ahmad Fauzan Ramadhan",
    "email": "ahmad.fauzan@student.sman1.sch.id",
    "phone": "081299998888",
    "address": "Jl. Baru No. 1, Tangerang",
    "birthPlace": "Tangerang",
    "birthDate": "2007-05-15"
  }'
```

### Validation Rules (Laravel)

```php
[
    'name'       => 'required|string|min:3|max:100',
    'email'      => 'required|email|unique:users,email,' . auth()->id(),
    'phone'      => 'required|string|regex:/^08[0-9]{9,12}$/',
    'address'    => 'nullable|string|max:500',
    'birthPlace' => 'nullable|string|max:100',
    'birthDate'  => 'nullable|date|before:today',
]
```

| Field | Rules | Error Message |
|-------|-------|---------------|
| `name` | required, string, min:3, max:100 | Nama wajib diisi, minimal 3 karakter, maksimal 100 karakter |
| `email` | required, email, unique:users | Email wajib diisi, format harus valid, tidak boleh duplikat |
| `phone` | required, regex:/^08[0-9]{9,12}$/ | Nomor telepon harus dimulai dengan 08 dan 11-14 digit |
| `address` | nullable, string, max:500 | Alamat maksimal 500 karakter |
| `birthPlace` | nullable, string, max:100 | Tempat lahir maksimal 100 karakter |
| `birthDate` | nullable, date, before:today | Tanggal lahir harus valid dan sebelum hari ini |

### Success Response (200 OK)
```json
{
  "code": 200,
  "status": "success",
  "message": "Profil berhasil diperbarui",
  "data": {
    "id": 1,
    "name": "Ahmad Fauzan Ramadhan",
    "nis": "0012345678",
    "nisn": "0107959840",
    "class": "XII IPA 1",
    "email": "ahmad.fauzan@student.sman1.sch.id",
    "phone": "081299998888",
    "address": "Jl. Baru No. 1, Tangerang",
    "birthPlace": "Tangerang",
    "birthDate": "2007-05-15",
    "religion": "Islam",
    "joinDate": "Juli 2023",
    "role": "Siswa",
    "validUntil": "31 Juni 2028",
    "profilePicture": "https://api.simap.sch.id/storage/avatars/student_001.jpg",
    "avatar": "https://api.simap.sch.id/storage/avatars/student_001.jpg",
    "passwordLastChanged": "2024-10-13T10:30:00Z",
    "createdAt": "2023-07-01T00:00:00Z",
    "updatedAt": "2025-01-13T19:30:00Z"
  }
}
```

### Error Responses

#### 400 Bad Request - Validation Error
```json
{
  "code": 400,
  "status": "error",
  "message": "Validasi gagal",
  "errors": {
    "email": ["Format email tidak valid"],
    "phone": ["Nomor telepon harus dimulai dengan 08"],
    "name": ["Nama minimal 3 karakter"]
  }
}
```

#### 401 Unauthorized
```json
{
  "code": 401,
  "status": "error",
  "message": "Token tidak valid atau sudah kadaluarsa",
  "errors": null
}
```

#### 409 Conflict - Email Already Exists
```json
{
  "code": 409,
  "status": "error",
  "message": "Email sudah digunakan oleh pengguna lain",
  "errors": {
    "email": ["Email sudah terdaftar"]
  }
}
```

---

## 3. Upload Profile Picture

Upload atau update foto profil siswa.

### Request

```http
POST /api/v1/student/profile/avatar
Authorization: Bearer {token}
Accept: application/json
Content-Type: multipart/form-data
```

### Request Body (FormData)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `avatar` | File | ✅ Yes | File gambar (JPG, JPEG, PNG) |

### cURL Example
```bash
curl -X POST "https://api.simap.sch.id/api/v1/student/profile/avatar" \
  -H "Authorization: Bearer {token}" \
  -H "Accept: application/json" \
  -F "avatar=@/path/to/photo.jpg"
```

### Validation Rules (Laravel)

```php
[
    'avatar' => [
        'required',
        'image',
        'mimes:jpg,jpeg,png',
        'max:2048', // 2MB
        'dimensions:min_width=300,min_height=400,ratio=3/4',
    ],
]
```

| Rule | Value | Error Message |
|------|-------|---------------|
| File Type | jpg, jpeg, png | Format file harus JPG, JPEG, atau PNG |
| Max Size | 2MB (2048 KB) | Ukuran file maksimal 2MB |
| Min Dimensions | 300x400 px | Resolusi minimal 300x400 pixel |
| Aspect Ratio | 3:4 (tolerance ±10%) | Foto harus portrait dengan rasio 3:4 |

### Success Response (200 OK)
```json
{
  "code": 200,
  "status": "success",
  "message": "Foto profil berhasil diperbarui",
  "data": {
    "avatar": "https://api.simap.sch.id/storage/avatars/student_001_1705161600.jpg",
    "profilePicture": "https://api.simap.sch.id/storage/avatars/student_001_1705161600.jpg",
    "thumbnails": {
      "small": "https://api.simap.sch.id/storage/avatars/thumbs/student_001_sm.jpg",
      "medium": "https://api.simap.sch.id/storage/avatars/thumbs/student_001_md.jpg"
    }
  }
}
```

### Error Responses

#### 400 Bad Request - Validation Error
```json
{
  "code": 400,
  "status": "error",
  "message": "Validasi gagal",
  "errors": {
    "avatar": ["Format file tidak valid. Gunakan JPG, JPEG, atau PNG"]
  }
}
```

#### 413 Payload Too Large
```json
{
  "code": 413,
  "status": "error",
  "message": "Ukuran file terlalu besar. Maksimal 2MB",
  "errors": {
    "avatar": ["Ukuran file melebihi batas maksimal 2MB"]
  }
}
```

#### 422 Unprocessable Entity - Invalid Dimensions
```json
{
  "code": 422,
  "status": "error",
  "message": "Dimensi foto tidak sesuai",
  "errors": {
    "avatar": [
      "Resolusi foto minimal 300x400 pixel",
      "Foto harus memiliki rasio 3:4 (portrait)"
    ]
  }
}
```

---

## 4. Change Password (Ubah Kata Sandi)

Mengubah kata sandi akun siswa.

### Request

```http
PUT /api/v1/student/profile/password
Authorization: Bearer {token}
Accept: application/json
Content-Type: application/json
```

### Request Body
```json
{
  "currentPassword": "PasswordLama123!",
  "newPassword": "PasswordBaru456!",
  "confirmPassword": "PasswordBaru456!"
}
```

### cURL Example
```bash
curl -X PUT "https://api.simap.sch.id/api/v1/student/profile/password" \
  -H "Authorization: Bearer {token}" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "PasswordLama123!",
    "newPassword": "PasswordBaru456!",
    "confirmPassword": "PasswordBaru456!"
  }'
```

### Validation Rules (Laravel)

```php
[
    'currentPassword' => 'required|string|current_password',
    'newPassword'     => [
        'required',
        'string',
        'min:8',
        'confirmed',
        'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/',
        'different:currentPassword',
    ],
    'confirmPassword' => 'required|same:newPassword',
]
```

### Password Requirements

Kata sandi baru harus memenuhi kriteria:

| Requirement | Description |
|-------------|-------------|
| Minimal 8 karakter | Password length ≥ 8 |
| Huruf besar | Minimal 1 huruf besar (A-Z) |
| Huruf kecil | Minimal 1 huruf kecil (a-z) |
| Angka | Minimal 1 angka (0-9) |
| Berbeda | Tidak boleh sama dengan password lama |

**Regex Pattern:**
```regex
^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$
```

### Success Response (200 OK)
```json
{
  "code": 200,
  "status": "success",
  "message": "Kata sandi berhasil diperbarui",
  "data": {
    "passwordLastChanged": "2025-01-13T19:30:00Z"
  }
}
```

### Error Responses

#### 400 Bad Request - Validation Error
```json
{
  "code": 400,
  "status": "error",
  "message": "Validasi gagal",
  "errors": {
    "newPassword": [
      "Kata sandi minimal 8 karakter",
      "Kata sandi harus mengandung huruf besar",
      "Kata sandi harus mengandung huruf kecil",
      "Kata sandi harus mengandung angka"
    ],
    "confirmPassword": ["Konfirmasi kata sandi tidak cocok"]
  }
}
```

#### 401 Unauthorized - Invalid Current Password
```json
{
  "code": 401,
  "status": "error",
  "message": "Kata sandi saat ini tidak valid",
  "errors": {
    "currentPassword": ["Kata sandi saat ini salah"]
  }
}
```

#### 422 Unprocessable Entity - Same Password
```json
{
  "code": 422,
  "status": "error",
  "message": "Kata sandi baru tidak boleh sama dengan kata sandi saat ini",
  "errors": {
    "newPassword": ["Kata sandi baru harus berbeda dari kata sandi lama"]
  }
}
```

---

## 5. Authentication
 
Endpoints untuk autentikasi pengguna (Login & Logout).
 
### 5.1 Login
 
 Autentikasi pengguna untuk mendapatkan access token.
 
 ### Request
 
 ```http
 POST /api/v1/auth/login
 Content-Type: application/json
 Accept: application/json
 ```
 
 ### Request Body
 
 ```json
 {
   "username": "12345678",
   "password": "password123"
 }
 ```
 
 ### Success Response (200 OK)
 
 ```json
 {
   "code": 200,
   "status": "success",
   "message": "Login successful",
   "token": "eyJhbGciOiJIUzI1NiIs...",
   "user": {
     "id": 1,
     "username": "12345678",
     "name": "Ahmad Fauzan",
     "role": "student",
     "avatar": "https://api.simap.sch.id/storage/avatars/default.jpg"
   }
 }
 ```
 
 ### Error Responses
 
 #### 401 Unauthorized
 ```json
 {
   "code": 401,
   "status": "error",
   "message": "Username atau password salah"
 }
 ```
 
 ---
 
 ### 5.2 Logout
 
 Mengakhiri sesi pengguna dan membatalkan token.
 
 ### Request
 
 ```http
 POST /api/v1/auth/logout
 Authorization: Bearer {token}
 Accept: application/json
 ```
 
 ### Success Response (200 OK)
 
 ```json
 {
   "code": 200,
   "status": "success",
   "message": "Logout successful"
 }
 ```
 
 ---
 
 ## Catatan untuk Statistik Akademik

> **⚠️ PENTING:** Untuk saat ini, data **Statistik Akademik** (Kehadiran, Tugas Selesai, Rata-rata Nilai, Poin Prestasi) menggunakan **data static** di frontend dan **TIDAK** ada endpoint API.
>
> ```typescript
> // Frontend Static Data
> const stats = {
>     attendance: 95,           // Kehadiran 95%
>     assignmentsCompleted: 42, // 42 tugas selesai
>     averageGrade: 85.5,       // Rata-rata nilai 85.5
>     points: 1250,             // 1250 poin prestasi
> };
> ```
>
> Endpoint untuk statistik akademik akan ditambahkan di fase berikutnya ketika modul akademik sudah tersedia.

---

## Response Format Standard

### Success Response
```json
{
  "code": 200,
  "status": "success",
  "message": "Deskripsi sukses",
  "data": { ... },
  "meta": {
    "timestamp": "2025-01-13T19:30:00Z",
    "version": "1.1.0"
  }
}
```

### Error Response
```json
{
  "code": 400,
  "status": "error",
  "message": "Deskripsi error",
  "errors": {
    "field_name": ["Pesan error 1", "Pesan error 2"]
  }
}
```

### Pagination Response (untuk future endpoints)
```json
{
  "code": 200,
  "status": "success",
  "message": "Data berhasil diambil",
  "data": [...],
  "meta": {
    "current_page": 1,
    "per_page": 10,
    "total": 100,
    "last_page": 10,
    "from": 1,
    "to": 10
  },
  "links": {
    "first": "https://api.simap.sch.id/api/v1/...?page=1",
    "last": "https://api.simap.sch.id/api/v1/...?page=10",
    "prev": null,
    "next": "https://api.simap.sch.id/api/v1/...?page=2"
  }
}
```

---

## HTTP Status Codes

| Code | Status | Penggunaan |
|------|--------|------------|
| 200 | OK | Request berhasil |
| 201 | Created | Resource berhasil dibuat |
| 204 | No Content | Berhasil tanpa response body |
| 400 | Bad Request | Validasi gagal / request tidak valid |
| 401 | Unauthorized | Token tidak valid / password salah |
| 403 | Forbidden | Tidak memiliki akses |
| 404 | Not Found | Resource tidak ditemukan |
| 409 | Conflict | Data sudah ada (duplicate) |
| 413 | Payload Too Large | File terlalu besar |
| 422 | Unprocessable Entity | Data tidak dapat diproses |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Error di server |
| 503 | Service Unavailable | Server maintenance |

---

## CORS Configuration (Laravel)

```php
// config/cors.php
return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'http://localhost:3000',
        'https://simap.sch.id',
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [
        'X-RateLimit-Limit',
        'X-RateLimit-Remaining',
        'X-RateLimit-Reset',
    ],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

---

## Security Best Practices

### 1. Input Sanitization
Semua input harus di-sanitize untuk mencegah XSS dan SQL Injection.

```php
// Laravel sudah handle secara default via Eloquent
// Tapi tetap validate semua input
$validated = $request->validate([...]);
```

### 2. Password Hashing
```php
// Gunakan bcrypt (default Laravel)
Hash::make($password);
```

### 3. Rate Limiting
```php
// routes/api.php
Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
    // Protected routes
});
```

### 4. File Upload Security
```php
// Validate MIME type, not just extension
$request->validate([
    'avatar' => 'required|image|mimes:jpg,jpeg,png|max:2048',
]);

// Store with unique name
$path = $request->file('avatar')->store('avatars', 'public');
```

### 5. Sensitive Data
- Jangan return password (bahkan yang di-hash)
- Jangan return token di response
- Log hanya data non-sensitif

---

## Laravel Implementation Notes

### Suggested Controller Structure

```php
// app/Http/Controllers/Api/V1/Student/ProfileController.php

namespace App\Http\Controllers\Api\V1\Student;

class ProfileController extends Controller
{
    public function show(): JsonResponse
    public function update(UpdateProfileRequest $request): JsonResponse
    public function updateAvatar(UpdateAvatarRequest $request): JsonResponse
    public function updatePassword(UpdatePasswordRequest $request): JsonResponse
}
```

### Suggested Route Structure

```php
// routes/api.php

Route::prefix('v1')->group(function () {
    Route::prefix('student')->middleware(['auth:sanctum', 'role:student'])->group(function () {
        Route::get('profile', [ProfileController::class, 'show']);
        Route::put('profile', [ProfileController::class, 'update']);
        Route::post('profile/avatar', [ProfileController::class, 'updateAvatar']);
        Route::put('profile/password', [ProfileController::class, 'updatePassword']);
    });
});
```

### Suggested Form Request Classes

```
app/Http/Requests/Student/
├── UpdateProfileRequest.php
├── UpdateAvatarRequest.php
└── UpdatePasswordRequest.php
```

---

## Changelog

| Versi | Tanggal | Deskripsi |
|-------|---------|-----------|
| 1.0.0 | 2024-01-10 | Initial API contract |
| 1.1.0 | 2025-01-13 | Menambahkan endpoint Change Password, Upload Avatar |
| 1.2.0 | 2025-01-13 | Menambahkan best practices: Rate Limiting, CORS, cURL examples, Laravel implementation notes, Security guidelines |
