# Add Member API Documentation

**Base URL:** `{API_BASE_URL}/mutamayizin`

**Authentication:** All endpoints require `Authorization: Bearer {token}` header.

---

## 1. GET /members

**Description:** Get paginated list of extracurricular members

**Query Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| academic_year_id | int\|string | No | Filter by academic year |
| ekstrakurikuler_id | int\|string | No | Filter by extracurricular |
| status | string | No | "active" or "inactive" |
| search | string | No | Search by name, NIS, email |
| page | int | No | Page number (default: 1) |
| per_page | int | No | Items per page (default: 10) |

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "nis": "2023001",
      "name": "Abdullah",
      "class": "X A",
      "email": "abdullah@student.sch.id",
      "phone": "081234567890",
      "ekstrakurikuler": ["Pramuka", "Basket"],
      "status": "active",
      "photo": null,
      "joinDate": "2023-07-15"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "total": 47,
    "per_page": 10
  }
}
```

---

## 2. GET /members/{id}

**Description:** Get single member detail

**Response (200):**
```json
{
  "data": {
    "id": 1,
    "nis": "2023001",
    "name": "Abdullah",
    "class": "X A",
    "email": "abdullah@student.sch.id",
    "phone": "081234567890",
    "ekstrakurikuler": [
      { "id": 1, "name": "Pramuka" },
      { "id": 2, "name": "Basket" }
    ],
    "status": "active",
    "photo": "https://...",
    "joinDate": "2023-07-15",
    "academicYears": [
      { "id": 1, "name": "2023/2024", "joinDate": "2023-07-15" }
    ]
  }
}
```

---

## 3. POST /members

**Description:** Add a student to an extracurricular

**Request Body:**
```json
{
  "student_profile_id": 1,
  "ekstrakurikuler_id": 1,
  "academic_year_id": 1,
  "join_date": "2023-07-15"
}
```

**Validation Rules:**
- `student_profile_id`: required, must exist in student_profiles
- `ekstrakurikuler_id`: required, must exist in ekstrakurikulers
- `academic_year_id`: required, must exist in academic_years
- `join_date`: required, format YYYY-MM-DD, must not be future date

**Response (201):**
```json
{
  "data": {
    "id": 15,
    "nis": "2023001",
    "name": "Abdullah",
    "class": "X A",
    "ekstrakurikuler": ["Basket"],
    "status": "active",
    "joinDate": "2023-07-15"
  },
  "message": "Member added successfully"
}
```

**Error (422):**
```json
{
  "message": "Validation failed",
  "errors": {
    "student_profile_id": ["Student is already a member of this extracurricular"]
  }
}
```

---

## 4. PUT /members/{id}

**Description:** Update member info (change extracurricular, status, etc.)

**Request Body:**
```json
{
  "ekstrakurikuler_id": 2,
  "status": "active",
  "join_date": "2023-08-01"
}
```

**Response (200):**
```json
{
  "data": { ... },
  "message": "Member updated successfully"
}
```

---

## 5. DELETE /members/{id}

**Description:** Remove a student from extracurricular (soft delete or hard delete)

**Response (200):**
```json
{
  "message": "Member removed successfully"
}
```

---

## 6. GET /extracurriculars (for dropdown)

**Description:** Get list of extracurriculars for the dropdown selector

**Query Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| academic_year_id | int\|string | No | Filter by academic year |

**Response (200):**
```json
{
  "data": [
    { "id": 1, "name": "Pramuka" },
    { "id": 2, "name": "Basket" },
    { "id": 3, "name": "PMR" }
  ]
}
```

---

## 7. GET /students (for dropdown)

**Description:** Get list of students for the member selector

**Query Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| search | string | No | Search by name or NIS |
| academic_year_id | int\|string | No | Filter by academic year |

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "nis": "2023001",
      "name": "Abdullah",
      "class": "X A"
    }
  ]
}
```