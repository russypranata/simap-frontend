# Extracurricular Advisor API Documentation

Modular API documentation for the Extracurricular Advisor (Tutor Ekstrakurikuler) module.

## Overview

This API module provides endpoints for managing extracurricular activities, member enrollment, attendance tracking, and profile management for tutors.

**Base URL**: `/api/v1`  
**Authentication**: Bearer Token in `Authorization` header  
**Role Prefix**: `/extracurricular-advisor`

---

## Module Structure

| Document                                       | Description                                       |
| ---------------------------------------------- | ------------------------------------------------- |
| [`01-authentication.md`](01-authentication.md) | Login, logout, password management                |
| [`02-dashboard.md`](02-dashboard.md)           | Dashboard statistics, schedule, recent activities |
| [`03-members.md`](03-members.md)               | Member enrollment management                      |
| [`04-attendance.md`](04-attendance.md)         | Attendance tracking and history                   |
| [`05-profile.md`](05-profile.md)               | Profile management (already documented)           |

---

## Quick Reference

### Authentication Endpoints

| Method | Endpoint                | Description            |
| ------ | ----------------------- | ---------------------- |
| POST   | `/auth/login`           | User login             |
| POST   | `/auth/logout`          | User logout            |
| POST   | `/auth/forgot-password` | Request password reset |

### Dashboard Endpoints

| Method | Endpoint                                               | Description              |
| ------ | ------------------------------------------------------ | ------------------------ |
| GET    | `/extracurricular-advisor/dashboard/stats`             | Get dashboard statistics |
| GET    | `/extracurricular-advisor/dashboard/schedule`          | Get upcoming schedule    |
| GET    | `/extracurricular-advisor/dashboard/recent-activities` | Get recent activities    |

### Member Endpoints

| Method | Endpoint                               | Description       |
| ------ | -------------------------------------- | ----------------- |
| GET    | `/extracurricular-advisor/members`     | List members      |
| GET    | `/extracurricular-advisor/members/:id` | Get member detail |
| POST   | `/extracurricular-advisor/members`     | Add member        |
| DELETE | `/extracurricular-advisor/members/:id` | Remove member     |

### Attendance Endpoints

| Method | Endpoint                                  | Description            |
| ------ | ----------------------------------------- | ---------------------- |
| GET    | `/extracurricular-advisor/attendance`     | Get attendance history |
| GET    | `/extracurricular-advisor/attendance/:id` | Get attendance detail  |
| POST   | `/extracurricular-advisor/attendance`     | Submit attendance      |

### Profile Endpoints

| Method | Endpoint                                    | Description     |
| ------ | ------------------------------------------- | --------------- |
| GET    | `/extracurricular-advisor/profile`          | Get profile     |
| PUT    | `/extracurricular-advisor/profile`          | Update profile  |
| POST   | `/extracurricular-advisor/profile/avatar`   | Upload avatar   |
| PUT    | `/extracurricular-advisor/profile/password` | Change password |

---

## Standard Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response

```json
{
    "success": false,
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Invalid input data",
        "details": [{ "field": "email", "message": "Invalid email format" }]
    }
}
```

### HTTP Status Codes

| Code | Description                             |
| ---- | --------------------------------------- |
| 200  | OK - Request successful                 |
| 201  | Created - Resource created successfully |
| 400  | Bad Request - Invalid input             |
| 401  | Unauthorized - Missing or invalid token |
| 403  | Forbidden - Insufficient permissions    |
| 404  | Not Found - Resource not found          |
| 422  | Unprocessable Entity - Validation error |
| 500  | Internal Server Error                   |

---

## Status Mapping Reference

The backend uses English status values in the database, while the frontend uses Indonesian labels.

### Member Status

| Frontend (Indonesian) | Database (English) | API Response |
| --------------------- | ------------------ | ------------ |
| Aktif                 | active             | `active`     |
| Nonaktif              | inactive           | `inactive`   |

### Attendance Status

| Frontend (Indonesian) | Database (English) | API Response |
| --------------------- | ------------------ | ------------ |
| hadir                 | present            | `present`    |
| sakit                 | excused            | `excused`    |
| izin                  | excused            | `excused`    |
| alpa                  | absent             | `absent`     |

**Note**: The API accepts Indonesian status values (`hadir`, `sakit`, `izin`, `alpa`) in requests for convenience, but returns standardized English values in responses.

---

## Implementation Notes

### Completed Endpoints

All endpoints are implemented and ready for testing:

| Method | Endpoint                                               | Status |
| ------ | ------------------------------------------------------ | ------ |
| GET    | `/extracurricular-advisor/profile`                     | ✅     |
| PUT    | `/extracurricular-advisor/profile`                     | ✅     |
| POST   | `/extracurricular-advisor/profile/avatar`              | ✅     |
| PUT    | `/extracurricular-advisor/profile/password`            | ✅     |
| GET    | `/extracurricular-advisor/dashboard/stats`             | ✅     |
| GET    | `/extracurricular-advisor/dashboard/schedule`          | ✅     |
| GET    | `/extracurricular-advisor/dashboard/recent-activities` | ✅     |
| GET    | `/extracurricular-advisor/members`                     | ✅     |
| POST   | `/extracurricular-advisor/members`                     | ✅     |
| GET    | `/extracurricular-advisor/members/:id`                 | ✅     |
| DELETE | `/extracurricular-advisor/members/:id`                 | ✅     |
| GET    | `/extracurricular-advisor/attendance`                  | ✅     |
| POST   | `/extracurricular-advisor/attendance`                  | ✅     |
| GET    | `/extracurricular-advisor/attendance/:id`              | ✅     |

### Key Implementation Details

1. **Soft Delete for Members**: The `DELETE /members/:id` endpoint performs a soft delete, setting `status` to "Nonaktif" and recording `inactiveDate` and `inactiveReason` for audit trail purposes.

2. **Attendance Duration**: The `GET /attendance` endpoint includes a `duration` field in `advisorStats` formatted as "Xj Ym" (e.g., "2j 0m" for 2 hours).

3. **Recent Activities**: The `GET /dashboard/recent-activities` endpoint returns the last 5 attendance sessions with formatted `day`, `date`, `time`, `duration`, and `attendance` percentage.

4. **Member Attendance History**: The `GET /members/:id` endpoint includes `attendanceHistory` array with recent attendance records for that student.

---

## Related Documentation

- [Database Schema](../extracurricular-advisor/database-schema.md)
- [Authentication API](authentication.md)
- [Profile API](profiles.md)
