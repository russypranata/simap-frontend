# API Endpoint Documentation - Student Behavior Module

## Base URL
```
https://your-api-domain.com/api
```

---

## 🔐 Authentication
Semua endpoint memerlukan authentication token di header:
```
Authorization: Bearer {token}
```

---

## 📚 Endpoints

### 1. Get Current User Info

**Endpoint:** `GET /auth/me`

**Description:** Mendapatkan informasi guru yang sedang login

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "id": 1,
  "name": "Pak Ahmad Hidayat",
  "email": "ahmad@school.com",
  "role": "teacher",
  "isPiketTeacher": true
}
```

**Response Error (401):**
```json
{
  "error": "Unauthorized",
  "message": "Token tidak valid atau sudah expired"
}
```

---

### 2. Get Students List

**Endpoint:** `GET /students`

**Description:** Mendapatkan daftar siswa dengan filter dan pagination

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| class | string | No | - | Filter by class (e.g., "XII A") |
| search | string | No | - | Search by name or NIS |
| page | number | No | 1 | Page number |
| limit | number | No | 10 | Items per page |

**Example Request:**
```
GET /students?class=XII%20A&search=Ahmad&page=1&limit=10
```

**Response Success (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Ahmad Rizky",
      "nis": "2024101",
      "class": "XII A",
      "classId": 1
    },
    {
      "id": 2,
      "name": "Ahmad Fauzi",
      "nis": "2024102",
      "class": "XII A",
      "classId": 1
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

**Response Error (400):**
```json
{
  "error": "Bad Request",
  "message": "Invalid query parameters"
}
```

---

### 3. Get Behavior Records

**Endpoint:** `GET /behavior-records`

**Description:** Mendapatkan riwayat catatan pelanggaran dengan filter kompleks

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| academicYear | string | No | - | Filter by academic year (e.g., "2025/2026") |
| semester | string | No | - | Filter by semester ("Ganjil" or "Genap") |
| class | string | No | - | Filter by class |
| teacherId | number | No | - | Filter by teacher ID |
| teacherName | string | No | - | Filter by teacher name |
| search | string | No | - | Search by student name, NIS, or problem |
| dateFrom | string | No | - | Start date (ISO format: YYYY-MM-DD) |
| dateTo | string | No | - | End date (ISO format: YYYY-MM-DD) |
| page | number | No | 1 | Page number |
| limit | number | No | 5 | Items per page |

**Example Request:**
```
GET /behavior-records?academicYear=2025/2026&semester=Ganjil&class=XII%20A&dateFrom=2025-12-01&dateTo=2025-12-16&page=1&limit=5
```

**Response Success (200):**
```json
{
  "data": [
    {
      "id": 1,
      "studentId": 3,
      "student": {
        "id": 3,
        "name": "Citra Dewi",
        "nis": "2024103",
        "class": "XII A"
      },
      "teacherId": 5,
      "teacherName": "Pak Budi",
      "problem": "Terlambat masuk kelas lebih dari 15 menit tanpa keterangan.",
      "followUp": "Diberikan teguran lisan dan dicatat.",
      "location": "sekolah",
      "date": "2025-12-15T08:30:00Z",
      "createdAt": "2025-12-15T08:35:00Z",
      "updatedAt": "2025-12-15T08:35:00Z"
    },
    {
      "id": 2,
      "studentId": 5,
      "student": {
        "id": 5,
        "name": "Eko Prasetyo",
        "nis": "2024105",
        "class": "XII B"
      },
      "teacherId": 7,
      "teacherName": "Bu Siti",
      "problem": "Tidak memakai seragam lengkap saat upacara.",
      "followUp": "Diminta melengkapi atribut seragam.",
      "location": "sekolah",
      "date": "2025-12-14T07:00:00Z",
      "createdAt": "2025-12-14T07:05:00Z",
      "updatedAt": "2025-12-14T07:05:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 25,
    "totalPages": 5
  }
}
```

**Response Error (400):**
```json
{
  "error": "Bad Request",
  "message": "Invalid date format"
}
```

---

### 4. Get Single Behavior Record

**Endpoint:** `GET /behavior-records/:id`

**Description:** Mendapatkan detail satu catatan pelanggaran

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | Behavior record ID |

**Example Request:**
```
GET /behavior-records/1
```

**Response Success (200):**
```json
{
  "id": 1,
  "studentId": 3,
  "student": {
    "id": 3,
    "name": "Citra Dewi",
    "nis": "2024103",
    "class": "XII A"
  },
  "teacherId": 5,
  "teacherName": "Pak Budi",
  "problem": "Terlambat masuk kelas lebih dari 15 menit tanpa keterangan.",
  "followUp": "Diberikan teguran lisan dan dicatat.",
  "location": "sekolah",
  "date": "2025-12-15T08:30:00Z",
  "createdAt": "2025-12-15T08:35:00Z",
  "updatedAt": "2025-12-15T08:35:00Z"
}
```

**Response Error (404):**
```json
{
  "error": "Not Found",
  "message": "Behavior record not found"
}
```

---

### 5. Create Behavior Record

**Endpoint:** `POST /behavior-records`

**Description:** Membuat catatan pelanggaran baru

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "studentId": 3,
  "problem": "Terlambat masuk kelas lebih dari 15 menit tanpa keterangan.",
  "followUp": "Diberikan teguran lisan dan dicatat.",
  "location": "sekolah"
}
```

**Field Validation:**
| Field | Type | Required | Min | Max | Description |
|-------|------|----------|-----|-----|-------------|
| studentId | number | Yes | - | - | ID siswa yang melakukan pelanggaran |
| problem | string | Yes | 10 | 500 | Deskripsi masalah/pelanggaran |
| followUp | string | Yes | 5 | 300 | Deskripsi tindak lanjut |
| location | string | Yes | - | - | Enum: "sekolah" or "asrama" |

**Response Success (201):**
```json
{
  "id": 8,
  "studentId": 3,
  "teacherId": 5,
  "teacherName": "Pak Ahmad Hidayat",
  "problem": "Terlambat masuk kelas lebih dari 15 menit tanpa keterangan.",
  "followUp": "Diberikan teguran lisan dan dicatat.",
  "location": "sekolah",
  "date": "2025-12-16T09:00:00Z",
  "createdAt": "2025-12-16T09:00:00Z",
  "updatedAt": "2025-12-16T09:00:00Z"
}
```

**Response Error (422):**
```json
{
  "error": "Validation Error",
  "message": "Invalid input data",
  "errors": [
    {
      "field": "problem",
      "message": "Deskripsi masalah minimal 10 karakter"
    },
    {
      "field": "followUp",
      "message": "Tindak lanjut harus diisi"
    }
  ]
}
```

**Response Error (404):**
```json
{
  "error": "Not Found",
  "message": "Student with ID 3 not found"
}
```

---

### 6. Update Behavior Record

**Endpoint:** `PUT /behavior-records/:id`

**Description:** Update catatan pelanggaran yang sudah ada

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | Behavior record ID |

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Request Body (Partial Update):**
```json
{
  "problem": "Updated problem description",
  "followUp": "Updated follow up action",
  "location": "asrama"
}
```

**Response Success (200):**
```json
{
  "id": 8,
  "studentId": 3,
  "teacherId": 5,
  "teacherName": "Pak Ahmad Hidayat",
  "problem": "Updated problem description",
  "followUp": "Updated follow up action",
  "location": "asrama",
  "date": "2025-12-16T09:00:00Z",
  "createdAt": "2025-12-16T09:00:00Z",
  "updatedAt": "2025-12-16T10:30:00Z"
}
```

**Response Error (404):**
```json
{
  "error": "Not Found",
  "message": "Behavior record not found"
}
```

**Response Error (403):**
```json
{
  "error": "Forbidden",
  "message": "You don't have permission to update this record"
}
```

---

### 7. Delete Behavior Record

**Endpoint:** `DELETE /behavior-records/:id`

**Description:** Hapus catatan pelanggaran

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | Behavior record ID |

**Example Request:**
```
DELETE /behavior-records/8
```

**Response Success (200):**
```json
{
  "message": "Behavior record deleted successfully"
}
```

**Response Error (404):**
```json
{
  "error": "Not Found",
  "message": "Behavior record not found"
}
```

**Response Error (403):**
```json
{
  "error": "Forbidden",
  "message": "You don't have permission to delete this record"
}
```

---

### 8. Get Classes List

**Endpoint:** `GET /classes`

**Description:** Mendapatkan daftar kelas

**Response Success (200):**
```json
{
  "data": [
    { "id": 1, "name": "XII A" },
    { "id": 2, "name": "XII B" },
    { "id": 3, "name": "XI A" },
    { "id": 4, "name": "XI B" },
    { "id": 5, "name": "X A" },
    { "id": 6, "name": "X B" }
  ]
}
```

---

### 9. Get Teachers List

**Endpoint:** `GET /teachers`

**Description:** Mendapatkan daftar guru (untuk filter)

**Response Success (200):**
```json
{
  "data": [
    { "id": 1, "name": "Pak Budi" },
    { "id": 2, "name": "Bu Siti" },
    { "id": 3, "name": "Ust. Ahmad" },
    { "id": 4, "name": "Bu Rina" },
    { "id": 5, "name": "Pak Ahmad Hidayat" }
  ]
}
```

---

### 10. Get Academic Years

**Endpoint:** `GET /academic-years`

**Description:** Mendapatkan daftar tahun ajaran

**Response Success (200):**
```json
{
  "data": [
    { "id": 1, "year": "2025/2026", "isActive": true },
    { "id": 2, "year": "2024/2025", "isActive": false },
    { "id": 3, "year": "2023/2024", "isActive": false }
  ]
}
```

---

## 🔒 Authorization Rules

1. **Semua endpoint** memerlukan authentication
2. **Create/Update/Delete** hanya bisa dilakukan oleh:
   - Guru yang membuat record tersebut
   - Admin
3. **Read** bisa dilakukan oleh semua guru yang terautentikasi

---

## ⚠️ Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Token invalid/expired |
| 403 | Forbidden - No permission |
| 404 | Not Found - Resource not found |
| 422 | Validation Error - Invalid input data |
| 500 | Internal Server Error |

---

## 📝 Notes untuk Backend Developer

### Important Fields:
1. **teacherId & teacherName**: Diambil dari token authentication, TIDAK dari request body
2. **date**: Auto-generated di backend (current timestamp)
3. **location**: Enum strict ("sekolah" | "asrama")
4. **Pagination**: Default page=1, limit=5 untuk records, limit=10 untuk students

### Database Relations:
```
behavior_records
├── studentId → students.id (FK)
└── teacherId → teachers.id (FK)
```

### Indexes Recommended:
- `behavior_records.studentId`
- `behavior_records.teacherId`
- `behavior_records.date`
- `behavior_records.location`
- `students.nis`
- `students.class`

### Soft Delete:
Recommended untuk behavior_records (jangan hard delete)
