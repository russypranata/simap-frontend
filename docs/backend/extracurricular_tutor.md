# API Documentation: Extracurricular Advisor (Tutor Ekskul)

This document details the API endpoints for the **Extracurricular Tutor** Role.

**Base URL**: `/api/v1`
**Authentication**: Bearer Token in `Authorization` Header.
**Role Prefix**: `/extracurricular-advisor`

---

## I. Context & Configuration

Global context for the extracurricular advisor session.

### 1. Get Active Academic Year

Retrieve the currently active academic year context.

- **Endpoint**: `GET /extracurricular-advisor/academic-year/active`
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**:

```json
{
    "success": true,
    "message": "Active academic year retrieved successfully",
    "data": {
        "id": 1,
        "name": "2025/2026",
        "startDate": "2025-07-01",
        "endDate": "2026-06-30",
        "isActive": true
    }
}
```

---

## II. Dashboard

Summary data for the main dashboard page.

### 1. Get Dashboard Statistics

Retrieve summary metrics including total members, attendance rates, and meeting counts.

- **Endpoint**: `GET /extracurricular-advisor/dashboard/stats`
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**:

```json
{
    "success": true,
    "message": "Operation successful",
    "data": {
        "totalMembers": 45,
        "lastAttendancePresent": 40,
        "averageAttendance": 92,
        "totalMeetings": 12,
        "activeStudents": 45,
        "needsAttention": 0
    }
}
```

### 2. Get Upcoming Schedule

Retrieve the upcoming scheduled activities based on the class schedule.

- **Endpoint**: `GET /extracurricular-advisor/dashboard/schedule`
- **Response (200 OK)**:

```json
{
    "success": true,
    "message": "Operation successful",
    "data": [
        {
            "id": 1,
            "day": "Friday",
            "date": "26 December 2025",
            "time": "14:00 - 16:00"
        }
    ]
}
```

### 3. Get Recent Activities

Retrieve the history of the last 5 attendance sessions.

- **Endpoint**: `GET /extracurricular-advisor/dashboard/recent-activities`
- **Response (200 OK)**:

```json
{
    "success": true,
    "message": "Operation successful",
    "data": [
        {
            "id": 101,
            "date": "2025-12-19",
            "presentCount": 42,
            "topic": "Latihan Rutin"
        }
    ]
}
```

---

## II. Member Management

Manage students enrolled in the extracurricular class.

### 1. Get Members List

Retrieve a paginated list of members.

- **Endpoint**: `GET /extracurricular-advisor/members`
- **Query Params**:
    - `search`: Search by Name or NIS/Admission Number.
    - `class`: Filter by Student's Academic Class name (e.g. "X A").
    - `limit`: Items per page (default 10).
    - `page`: Page number.

- **Response (200 OK)**:

```json
{
    "success": true,
    "message": "Operation successful",
    "data": {
        "data": [
            {
                "id": 5,
                "studentId": 101,
                "nis": "2025001",
                "name": "Andi Wijaya",
                "class": "X A",
                "joinDate": "2025-07-15",
                "attendance": 95
            }
        ],
        "meta": {
            "currentPage": 1,
            "totalPages": 5,
            "totalItems": 50
        }
    }
}
```

### 2. Get Member Detail

Retrieve details for a specific member enrollment.

- **Endpoint**: `GET /extracurricular-advisor/members/{id}`
- **Path Params**: `id` (The Member ID, not Student ID).

- **Response (200 OK)**:

```json
{
    "success": true,
    "message": "Operation successful",
    "data": {
        "id": 5,
        "nis": "2025001",
        "name": "Andi Wijaya",
        "class": "X A",
        "joinDate": "2025-07-15",
        "attendance": 95
    }
}
```

---

## III. Attendance Tracking

Manage attendance sessions.

### 1. Get Attendance History

Retrieve a list of past attendance sessions.

- **Endpoint**: `GET /extracurricular-advisor/attendance`
- **Query Params**:
    - `startDate`: YYYY-MM-DD
    - `endDate`: YYYY-MM-DD

- **Response (200 OK)**:

```json
{
    "success": true,
    "message": "Operation successful",
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
                "tutorName": "Kak Tutor",
                "startTime": "14:00",
                "endTime": "16:00",
                "status": "hadir"
            }
        }
    ]
}
```

### 2. Submit Attendance (Create)

Create a new attendance session record.

- **Endpoint**: `POST /extracurricular-advisor/attendance`
- **Request Body**:

```json
{
    "date": "2025-12-26",
    "startTime": "14:00",
    "endTime": "16:00",
    "topic": "Latihan Fisik",
    "students": [
        {
            "studentId": 101,
            "status": "present", 
            "note": null
        },
        {
            "studentId": 102,
            "status": "absent",
            "note": "Tanpa Keterangan"
        },
        {
            "studentId": 103,
            "status": "excused",
            "note": "Sakit"
        }
    ]
}
```
*Note: Status must be one of: `present`, `late`, `absent`, `excused`.*

- **Response (201 Created)**:

```json
{
    "success": true,
    "message": "Attendance saved successfully",
    "data": {
        "id": 202
    }
}
```

### 3. Get Attendance Detail

Retrieve full details of a session, including per-student status.

- **Endpoint**: `GET /extracurricular-advisor/attendance/{id}`
- **Response (200 OK)**:

```json
{
    "success": true,
    "message": "Operation successful",
    "data": {
        "id": 201,
        "date": "2025-12-26",
        "startTime": "14:00",
        "endTime": "16:00",
        "students": [
            {
                "id": 101,
                "name": "Andi Wijaya",
                "status": "present",
                "note": null
            }
            // ...
        ]
    }
}
```
