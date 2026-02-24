# Attendance Management Endpoints

Attendance tracking endpoints for the Extracurricular Advisor module.

**Base URL**: `/api/v1`  
**Role Prefix**: `/extracurricular-advisor`

---

## Table of Contents

- [GET /extracurricular-advisor/attendance](#get-extracurricular-advisorattendance)
- [GET /extracurricular-advisor/attendance/:id](#get-extracurricular-advisorattendanceid)
- [POST /extracurricular-advisor/attendance](#post-extracurricular-advisorattendance)

---

## GET /extracurricular-advisor/attendance

Retrieve attendance session history with summary statistics.

### Request

**Method**: `GET`  
**Endpoint**: `/extracurricular-advisor/attendance`

**Headers**:

```
Authorization: Bearer <token>
```

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| startDate | string | No | - | Filter by start date (YYYY-MM-DD) |
| endDate | string | No | - | Filter by end date (YYYY-MM-DD) |
| academic_year | string | No | Current | Academic year (e.g., "2025/2026") |
| semester | string | No | Current | Semester filter ("1", "2", or "all") |

### Response

**Status**: `200 OK`

```json
{
    "success": true,
    "message": "Attendance history retrieved successfully",
    "data": [
        {
            "id": 201,
            "date": "2025-12-26",
            "studentStats": {
                "present": 40,
                "total": 45,
                "percentage": 88
            },
            "advisorStats": {
                "tutorName": "Kak Tutor, S.Pd",
                "startTime": "14:00",
                "endTime": "16:00",
                "duration": "2j 0m",
                "status": "hadir"
            }
        },
        {
            "id": 200,
            "date": "2025-12-19",
            "studentStats": {
                "present": 42,
                "total": 45,
                "percentage": 93
            },
            "advisorStats": {
                "tutorName": "Kak Tutor, S.Pd",
                "startTime": "14:00",
                "endTime": "16:00",
                "duration": "2j 0m",
                "status": "hadir"
            }
        }
    ]
}
```

**Response Fields**:

| Field                   | Type    | Description                   |
| ----------------------- | ------- | ----------------------------- |
| id                      | integer | Attendance session identifier |
| date                    | string  | Session date (YYYY-MM-DD)     |
| studentStats            | object  | Student attendance statistics |
| studentStats.present    | integer | Number of students present    |
| studentStats.total      | integer | Total number of students      |
| studentStats.percentage | integer | Attendance percentage (0-100) |
| advisorStats            | object  | Tutor attendance information  |
| advisorStats.tutorName  | string  | Tutor's name                  |
| advisorStats.startTime  | string  | Session start time (HH:MM)    |
| advisorStats.endTime    | string  | Session end time (HH:MM)      |
| advisorStats.duration   | string  | Formatted duration            |
| advisorStats.status     | string  | Tutor attendance status       |

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

## GET /extracurricular-advisor/attendance/:id

Retrieve detailed information for a specific attendance session including per-student status.

### Request

**Method**: `GET`  
**Endpoint**: `/extracurricular-advisor/attendance/:id`

**Headers**:

```
Authorization: Bearer <token>
```

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | Attendance session ID |

### Response

**Status**: `200 OK`

```json
{
    "success": true,
    "message": "Attendance details retrieved successfully",
    "data": {
        "id": 201,
        "date": "2025-12-26",
        "startTime": "14:00",
        "endTime": "16:00",
        "topic": "Latihan Fisik",
        "studentStats": {
            "present": 40,
            "total": 45,
            "percentage": 88
        },
        "advisorStats": {
            "tutorName": "Kak Tutor, S.Pd",
            "startTime": "14:00",
            "endTime": "16:00",
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
            },
            {
                "id": 3,
                "nis": "2022003",
                "name": "Doni Pratama",
                "class": "XI B",
                "status": "izin",
                "note": "Acara keluarga"
            },
            {
                "id": 4,
                "nis": "2022004",
                "name": "Siti Aminah",
                "class": "XII B",
                "status": "alpa",
                "note": null
            }
        ]
    }
}
```

**Response Fields**:

| Field        | Type    | Description                        |
| ------------ | ------- | ---------------------------------- |
| id           | integer | Attendance session identifier      |
| date         | string  | Session date (YYYY-MM-DD)          |
| startTime    | string  | Session start time (HH:MM)         |
| endTime      | string  | Session end time (HH:MM)           |
| topic        | string  | Session topic/material             |
| studentStats | object  | Student attendance summary         |
| advisorStats | object  | Tutor attendance info              |
| students     | array   | List of student attendance records |

**Student Record Fields**:

| Field  | Type    | Description                               |
| ------ | ------- | ----------------------------------------- |
| id     | integer | Student ID                                |
| nis    | string  | Student's NIS                             |
| name   | string  | Student's name                            |
| class  | string  | Student's class                           |
| status | string  | Attendance status (hadir/sakit/izin/alpa) |
| note   | string  | Optional note for absence                 |

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
        "message": "Attendance session not found"
    }
}
```

---

## POST /extracurricular-advisor/attendance

Create a new attendance session with student records.

### Request

**Method**: `POST`  
**Endpoint**: `/extracurricular-advisor/attendance`

**Headers**:

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body**:

```json
{
    "date": "2025-12-26",
    "startTime": "14:00",
    "endTime": "16:00",
    "topic": "Latihan Fisik",
    "students": [
        {
            "studentId": 1,
            "status": "hadir",
            "note": null
        },
        {
            "studentId": 2,
            "status": "sakit",
            "note": "Demam"
        },
        {
            "studentId": 3,
            "status": "izin",
            "note": "Acara keluarga"
        },
        {
            "studentId": 4,
            "status": "alpa",
            "note": null
        }
    ]
}
```

**Request Fields**:

| Field     | Type   | Required | Description                        |
| --------- | ------ | -------- | ---------------------------------- |
| date      | string | Yes      | Session date (YYYY-MM-DD)          |
| startTime | string | Yes      | Session start time (HH:MM)         |
| endTime   | string | Yes      | Session end time (HH:MM)           |
| topic     | string | No       | Session topic/material             |
| students  | array  | Yes      | List of student attendance records |

**Student Record Fields**:

| Field     | Type    | Required | Description           |
| --------- | ------- | -------- | --------------------- |
| studentId | integer | Yes      | Student enrollment ID |
| status    | string  | Yes      | Attendance status     |
| note      | string  | No       | Optional note         |

**Valid Status Values**:

- `hadir` - Present
- `sakit` - Sick
- `izin` - Permit/Excused
- `alpa` - Absent

### Response

**Status**: `201 Created`

```json
{
    "success": true,
    "message": "Attendance saved successfully",
    "data": {
        "id": 202,
        "date": "2025-12-26",
        "studentStats": {
            "present": 1,
            "total": 4,
            "percentage": 25
        }
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
            { "field": "date", "message": "Date is required" },
            { "field": "startTime", "message": "Start time is required" },
            { "field": "endTime", "message": "End time is required" },
            {
                "field": "students",
                "message": "At least one student is required"
            }
        ]
    }
}
```

**Status**: `409 Conflict`

```json
{
    "success": false,
    "error": {
        "code": "DUPLICATE_SESSION",
        "message": "Attendance session for this date already exists"
    }
}
```

---

## Related Documents

- [Member Management](03-members.md) - Manage enrolled members
- [Dashboard](02-dashboard.md) - View attendance statistics
- [Database Schema](../extracurricular-advisor/database-schema.md) - Attendance tables
- [Main Index](README.md) - Module overview
