# Member Management Endpoints

Member enrollment management endpoints for the Extracurricular Advisor module.

**Base URL**: `/api/v1`  
**Role Prefix**: `/extracurricular-advisor`

---

## Table of Contents

- [GET /extracurricular-advisor/members](#get-extracurricular-advisormembers)
- [GET /extracurricular-advisor/members/:id](#get-extracurricular-advisormembersid)
- [POST /extracurricular-advisor/members](#post-extracurricular-advisormembers)
- [DELETE /extracurricular-advisor/members/:id](#delete-extracurricular-advisormembersid)

---

## GET /extracurricular-advisor/members

Retrieve a paginated list of enrolled members with filtering options.

### Request

**Method**: `GET`  
**Endpoint**: `/extracurricular-advisor/members`

**Headers**:

```
Authorization: Bearer <token>
```

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| academic_year | string | No | Current | Academic year (e.g., "2025/2026") |
| semester | string | No | Current | Semester filter ("1", "2", or "all") |
| class | string | No | all | Filter by class name (e.g., "X A") |
| search | string | No | - | Search by name or NIS |
| status | string | No | Aktif | Filter by status ("Aktif", "Nonaktif", "all") |
| page | integer | No | 1 | Page number |
| limit | integer | No | 10 | Items per page |

### Response

**Status**: `200 OK`

```json
{
    "success": true,
    "message": "Members retrieved successfully",
    "data": {
        "data": [
            {
                "id": 1,
                "nis": "2022001",
                "name": "Andi Wijaya",
                "class": "XII A",
                "joinDate": "2024-07-15",
                "attendance": 92,
                "status": "Aktif"
            },
            {
                "id": 2,
                "nis": "2022002",
                "name": "Rina Kusuma",
                "class": "XI A",
                "joinDate": "2024-07-15",
                "attendance": 88,
                "status": "Aktif"
            }
        ],
        "meta": {
            "currentPage": 1,
            "totalPages": 5,
            "totalItems": 45
        }
    }
}
```

**Response Fields**:

| Field      | Type    | Description                               |
| ---------- | ------- | ----------------------------------------- |
| id         | integer | Member enrollment identifier              |
| nis        | string  | Student's NIS (Nomor Induk Siswa)         |
| name       | string  | Student's full name                       |
| class      | string  | Student's current class                   |
| joinDate   | string  | Date joined extracurricular (YYYY-MM-DD)  |
| attendance | integer | Attendance percentage (0-100)             |
| status     | string  | Membership status ("Aktif" or "Nonaktif") |

**Meta Fields**:

| Field       | Type    | Description           |
| ----------- | ------- | --------------------- |
| currentPage | integer | Current page number   |
| totalPages  | integer | Total number of pages |
| totalItems  | integer | Total number of items |

### Error Responses

**Status**: `401 Unauthorized`

```json
{
    "success": false,
    "error": {
        "code": "UNAUTHORIZED",
        "message": "Invalid or expired token"
    }
}
```

---

## GET /extracurricular-advisor/members/:id

Retrieve details for a specific member enrollment.

### Request

**Method**: `GET`  
**Endpoint**: `/extracurricular-advisor/members/:id`

**Headers**:

```
Authorization: Bearer <token>
```

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | Member enrollment ID |

### Response

**Status**: `200 OK`

```json
{
    "success": true,
    "message": "Member details retrieved successfully",
    "data": {
        "id": 5,
        "nis": "2025001",
        "name": "Andi Wijaya",
        "class": "X A",
        "joinDate": "2025-07-15",
        "attendance": 95,
        "status": "Aktif",
        "attendanceHistory": [
            {
                "date": "2025-12-20",
                "status": "hadir",
                "note": null
            },
            {
                "date": "2025-12-13",
                "status": "sakit",
                "note": "Demam"
            }
        ]
    }
}
```

**Response Fields**:

| Field             | Type    | Description                  |
| ----------------- | ------- | ---------------------------- |
| id                | integer | Member enrollment identifier |
| nis               | string  | Student's NIS                |
| name              | string  | Student's full name          |
| class             | string  | Student's current class      |
| joinDate          | string  | Date joined extracurricular  |
| attendance        | integer | Attendance percentage        |
| status            | string  | Membership status            |
| attendanceHistory | array   | Recent attendance records    |

### Error Responses

**Status**: `401 Unauthorized`

```json
{
    "success": false,
    "error": {
        "code": "UNAUTHORIZED",
        "message": "Invalid or expired token"
    }
}
```

**Status**: `404 Not Found`

```json
{
    "success": false,
    "error": {
        "code": "NOT_FOUND",
        "message": "Member not found"
    }
}
```

---

## POST /extracurricular-advisor/members

Add a new member to the extracurricular class.

### Request

**Method**: `POST`  
**Endpoint**: `/extracurricular-advisor/members`

**Headers**:

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body**:

```json
{
    "nis": "2025001",
    "name": "Siswa Baru",
    "class": "X A",
    "joinDate": "2025-07-15"
}
```

| Field    | Type   | Required | Description                     |
| -------- | ------ | -------- | ------------------------------- |
| nis      | string | Yes      | Student's NIS                   |
| name     | string | Yes      | Student's full name             |
| class    | string | Yes      | Student's class                 |
| joinDate | string | No       | Date joined (defaults to today) |

### Response

**Status**: `201 Created`

```json
{
    "success": true,
    "message": "Member added successfully",
    "data": {
        "id": 50,
        "nis": "2025001",
        "name": "Siswa Baru",
        "class": "X A",
        "joinDate": "2025-07-15",
        "status": "Aktif"
    }
}
```

### Error Responses

**Status**: `401 Unauthorized`

```json
{
    "success": false,
    "error": {
        "code": "UNAUTHORIZED",
        "message": "Invalid or expired token"
    }
}
```

**Status**: `422 Unprocessable Entity`

```json
{
    "success": false,
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Validation failed",
        "details": [
            { "field": "nis", "message": "NIS is required" },
            { "field": "name", "message": "Name is required" },
            { "field": "class", "message": "Class is required" }
        ]
    }
}
```

**Status**: `409 Conflict`

```json
{
    "success": false,
    "error": {
        "code": "DUPLICATE_MEMBER",
        "message": "Student is already a member of this extracurricular"
    }
}
```

---

## DELETE /extracurricular-advisor/members/:id

Remove a member from the extracurricular class (soft delete for audit trail).

### Request

**Method**: `DELETE`  
**Endpoint**: `/extracurricular-advisor/members/:id`

**Headers**:

```
Authorization: Bearer <token>
```

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | Member enrollment ID |

### Response

**Status**: `200 OK`

```json
{
    "success": true,
    "message": "Member removed successfully",
    "data": {
        "id": 5,
        "status": "Nonaktif",
        "inactiveDate": "2025-12-26",
        "inactiveReason": "Removed by tutor"
    }
}
```

### Error Responses

**Status**: `401 Unauthorized`

```json
{
    "success": false,
    "error": {
        "code": "UNAUTHORIZED",
        "message": "Invalid or expired token"
    }
}
```

**Status**: `404 Not Found`

```json
{
    "success": false,
    "error": {
        "code": "NOT_FOUND",
        "message": "Member not found"
    }
}
```

---

## Related Documents

- [Attendance Management](04-attendance.md) - Track member attendance
- [Dashboard](02-dashboard.md) - View member statistics
- [Main Index](README.md) - Module overview
