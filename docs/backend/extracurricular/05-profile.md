# Profile Management Endpoints

Profile management endpoints for the Extracurricular Advisor module.

**Base URL**: `/api/v1`  
**Role Prefix**: `/extracurricular-advisor`

---

## Table of Contents

- [GET /extracurricular-advisor/profile](#get-extracurricular-advisorprofile)
- [PUT /extracurricular-advisor/profile](#put-extracurricular-advisorprofile)
- [POST /extracurricular-advisor/profile/avatar](#post-extracurricular-advisorprofileavatar)
- [PUT /extracurricular-advisor/profile/password](#put-extracurricular-advisorprofilepassword)

---

## GET /extracurricular-advisor/profile

Retrieve the logged-in tutor's profile information.

### Request

**Method**: `GET`  
**Endpoint**: `/extracurricular-advisor/profile`

**Headers**:

```
Authorization: Bearer <token>
```

### Response

**Status**: `200 OK`

```json
{
    "success": true,
    "message": "Profile retrieved successfully",
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
        "extracurricular": "Pramuka"
    }
}
```

**Response Fields**:

| Field           | Type   | Description                  |
| --------------- | ------ | ---------------------------- |
| name            | string | Full name with title         |
| username        | string | Login username               |
| email           | string | Email address                |
| phone           | string | Phone number                 |
| role            | string | User role name               |
| profilePicture  | string | Avatar URL                   |
| address         | string | Home address                 |
| joinDate        | string | Join date (YYYY-MM-DD)       |
| nip             | string | Employee ID (NIP)            |
| extracurricular | string | Managed extracurricular name |

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
        "message": "Profile not found"
    }
}
```

---

## PUT /extracurricular-advisor/profile

Update the tutor's profile information.

### Request

**Method**: `PUT`  
**Endpoint**: `/extracurricular-advisor/profile`

**Headers**:

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body**:

```json
{
    "name": "Budi Santoso, S.Pd",
    "username": "budisantoso.new",
    "email": "budi@example.com",
    "phone": "081234567890",
    "address": "Jl. Baru No. 123"
}
```

| Field    | Type   | Required | Description          |
| -------- | ------ | -------- | -------------------- |
| name     | string | Yes      | Full name with title |
| username | string | Yes      | Login username       |
| email    | string | Yes      | Email address        |
| phone    | string | No       | Phone number         |
| address  | string | No       | Home address         |

### Response

**Status**: `200 OK`

```json
{
    "success": true,
    "message": "Profile updated successfully",
    "data": {
        "name": "Budi Santoso, S.Pd",
        "username": "budisantoso.new",
        "email": "budi@example.com",
        "phone": "081234567890",
        "role": "Tutor Ekstrakurikuler",
        "profilePicture": "https://example.com/avatar.jpg",
        "address": "Jl. Baru No. 123",
        "joinDate": "2019-08-10",
        "nip": "198812122015021002",
        "extracurricular": "Pramuka"
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
            { "field": "name", "message": "Name is required" },
            { "field": "username", "message": "Username is required" },
            { "field": "email", "message": "Invalid email format" }
        ]
    }
}
```

**Status**: `409 Conflict`

```json
{
    "success": false,
    "error": {
        "code": "DUPLICATE_USERNAME",
        "message": "Username is already taken"
    }
}
```

---

## POST /extracurricular-advisor/profile/avatar

Upload a new profile picture.

### Request

**Method**: `POST`  
**Endpoint**: `/extracurricular-advisor/profile/avatar`

**Headers**:

```
Authorization: Bearer <token>
Accept: application/json
```

**Content-Type**: `multipart/form-data`

**Body** (FormData):
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| avatar | File | Yes | Image file (JPG/PNG, max 2MB) |

### Response

**Status**: `200 OK`

```json
{
    "success": true,
    "message": "Avatar uploaded successfully",
    "data": {
        "avatar": "https://example.com/avatars/new-avatar.jpg",
        "profilePicture": "https://example.com/avatars/new-avatar.jpg",
        "thumbnails": {
            "small": "https://example.com/avatars/new-avatar-small.jpg",
            "medium": "https://example.com/avatars/new-avatar-medium.jpg"
        }
    }
}
```

**Response Fields**:

| Field             | Type   | Description          |
| ----------------- | ------ | -------------------- |
| avatar            | string | Full-size avatar URL |
| profilePicture    | string | Alias for avatar URL |
| thumbnails.small  | string | Small thumbnail URL  |
| thumbnails.medium | string | Medium thumbnail URL |

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
            { "field": "avatar", "message": "Avatar file is required" },
            { "field": "avatar", "message": "File must be JPG or PNG" },
            { "field": "avatar", "message": "File size must not exceed 2MB" }
        ]
    }
}
```

---

## PUT /extracurricular-advisor/profile/password

Change the tutor's password.

### Request

**Method**: `PUT`  
**Endpoint**: `/extracurricular-advisor/profile/password`

**Headers**:

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body**:

```json
{
    "currentPassword": "passwordLama123",
    "newPassword": "PasswordBaruStrong1!",
    "confirmPassword": "PasswordBaruStrong1!"
}
```

| Field           | Type   | Required | Description           |
| --------------- | ------ | -------- | --------------------- |
| currentPassword | string | Yes      | Current password      |
| newPassword     | string | Yes      | New password          |
| confirmPassword | string | Yes      | Password confirmation |

**Password Requirements**:

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Response

**Status**: `200 OK`

```json
{
    "success": true,
    "message": "Password changed successfully",
    "data": {
        "passwordLastChanged": "2025-12-26T14:30:00Z"
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

**Status**: `400 Bad Request`

```json
{
    "success": false,
    "error": {
        "code": "INVALID_CURRENT_PASSWORD",
        "message": "Current password is incorrect"
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
            {
                "field": "currentPassword",
                "message": "Current password is required"
            },
            { "field": "newPassword", "message": "New password is required" },
            { "field": "confirmPassword", "message": "Passwords do not match" }
        ]
    }
}
```

---

## Related Documents

- [Authentication](01-authentication.md) - Login and logout
- [Main Index](README.md) - Module overview
- [Profile API](profiles.md) - General profile documentation
