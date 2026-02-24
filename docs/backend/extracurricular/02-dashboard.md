# Dashboard Endpoints

Dashboard endpoints for the Extracurricular Advisor module.

**Base URL**: `/api/v1`  
**Role Prefix**: `/extracurricular-advisor`

---

## Table of Contents

- [GET /extracurricular-advisor/dashboard/stats](#get-extracurricular-advisordashboardstats)
- [GET /extracurricular-advisor/dashboard/schedule](#get-extracurricular-advisordashboardschedule)
- [GET /extracurricular-advisor/dashboard/recent-activities](#get-extracurricular-advisordashboardrecent-activities)

---

## GET /extracurricular-advisor/dashboard/stats

Retrieve summary statistics for the dashboard including member counts, attendance rates, and meeting statistics.

### Request

**Method**: `GET`  
**Endpoint**: `/extracurricular-advisor/dashboard/stats`

**Headers**:

```
Authorization: Bearer <token>
```

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| academic_year | string | No | Current | Academic year (e.g., "2025/2026") |
| semester | string | No | Current | Semester filter ("1", "2", or "all") |

### Response

**Status**: `200 OK`

```json
{
    "success": true,
    "message": "Dashboard statistics retrieved successfully",
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

**Response Fields**:

| Field                 | Type    | Description                                |
| --------------------- | ------- | ------------------------------------------ |
| totalMembers          | integer | Total number of enrolled members           |
| lastAttendancePresent | integer | Number of students present at last meeting |
| averageAttendance     | integer | Average attendance percentage (0-100)      |
| totalMeetings         | integer | Total number of meetings held              |
| activeStudents        | integer | Number of students with attendance >= 90%  |
| needsAttention        | integer | Number of students with attendance < 75%   |

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

## GET /extracurricular-advisor/dashboard/schedule

Retrieve upcoming scheduled activities for the extracurricular class.

### Request

**Method**: `GET`  
**Endpoint**: `/extracurricular-advisor/dashboard/schedule`

**Headers**:

```
Authorization: Bearer <token>
```

### Response

**Status**: `200 OK`

```json
{
    "success": true,
    "message": "Schedule retrieved successfully",
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

**Response Fields**:

| Field | Type    | Description                   |
| ----- | ------- | ----------------------------- |
| id    | integer | Schedule item identifier      |
| day   | string  | Day of the week               |
| date  | string  | Formatted date (DD MMMM YYYY) |
| time  | string  | Time range (HH:MM - HH:MM)    |

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

## GET /extracurricular-advisor/dashboard/recent-activities

Retrieve history of recent attendance sessions (last 5 activities).

### Request

**Method**: `GET`  
**Endpoint**: `/extracurricular-advisor/dashboard/recent-activities`

**Headers**:

```
Authorization: Bearer <token>
```

### Response

**Status**: `200 OK`

```json
{
    "success": true,
    "message": "Recent activities retrieved successfully",
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

**Response Fields**:

| Field      | Type    | Description                                    |
| ---------- | ------- | ---------------------------------------------- |
| id         | integer | Attendance session identifier                  |
| day        | string  | Day of the week                                |
| date       | string  | Formatted date (DD MMM YYYY)                   |
| time       | string  | Time range (HH:MM - HH:MM)                     |
| attendance | integer | Attendance percentage for that session (0-100) |

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

## Related Documents

- [Attendance Management](04-attendance.md) - Detailed attendance endpoints
- [Member Management](03-members.md) - Member enrollment endpoints
- [Main Index](README.md) - Module overview
