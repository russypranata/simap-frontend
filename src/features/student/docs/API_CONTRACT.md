# Student Profile API Contract

Dokumen ini menjelaskan spesifikasi endpoint API yang dibutuhkan oleh halaman **Student Profile** dan **Edit Student Profile**.

## Base URL
`/api/student` (Disarankan)

---

## 1. Get Profile Data
Mengambil data lengkap profil siswa untuk ditampilkan di halaman profil dan formulir edit.

- **Endpoint**: `GET /profile`
- **Auth**: Required (Bearer Token)

### Success Response (200 OK)
```json
{
  "code": 200,
  "status": "success",
  "data": {
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
    "profilePicture": "https://example.com/uploads/avatars/student_001.jpg",
    "avatar": "https://example.com/uploads/avatars/student_001.jpg" 
  }
}
```
*Catatan: Field `avatar` dan `profilePicture` bisa disatukan backend menjadi satu field saja (misal `avatar_url`), namun frontend saat ini mendukung keduanya.*

---

## 2. Get Student Statistics
Mengambil ringkasan statistik akademik siswa untuk ditampilkan di kartu statistik profil.

- **Endpoint**: `GET /stats`
- **Auth**: Required

### Success Response (200 OK)
```json
{
  "code": 200,
  "status": "success",
  "data": {
    "attendance": 98,              // Persentase kehadiran (0-100)
    "assignmentsCompleted": 45,    // Jumlah tugas selesai
    "averageGrade": 88.5,          // Rata-rata nilai
    "points": 120                  // Poin kedisiplinan/prestasi
  }
}
```

---

## 3. Update Profile Data
Menyimpan perubahan data profil siswa yang dilakukan di halaman Edit Profile.

- **Endpoint**: `PUT /profile`
- **Method**: `PUT` atau `PATCH`
- **Content-Type**: `application/json` (atau `multipart/form-data` jika upload file handled di endpoint yang sama)

### Request Body
Frontend akan mengirimkan JSON dengan struktur berikut. Field yang tidak diubah tetap dikirim (PUT) atau hanya field berubah (PATCH) tergantung implementasi Backend.

```json
{
  "name": "Ahmad Fauzan Ramadhan",
  "email": "ahmad.fauzan@student.sman1.sch.id",
  "phone": "081299998888",
  "address": "Jl. Baru No. 1, Tangerang",
  "birthPlace": "Tangerang",
  "birthDate": "2007-05-15",
  "avatar": "blob:http://localhost:3000/..." // JIKA upload handled frontend (Base64/Blob)
  // ATAU "avatar": Type File (Multipart) jika Backend handle upload
}
```

**Catatan Penting untuk Upload Foto:**
1. Jika backend menghendaki **Multipart/Form-Data** (paling umum): Frontend perlu menyesuaikan `service` `updateStudentProfile` untuk mengirim `FormData` object, bukan JSON raw.
2. Jika backend menerima **Base64** string di dalam JSON: Struktur JSON di atas valid.

### Success Response (200 OK)
```json
{
  "code": 200,
  "status": "success",
  "message": "Profil berhasil diperbarui",
  "data": {
    // Return updated profile object (optional tapi recommended)
  }
}
```

### Error Responses
- **400 Bad Request**: Validasi gagal (misal email tidak valid).
- **401 Unauthorized**: Token expired/invalid.
- **413 Payload Too Large**: Ukuran foto terlalu besar.
