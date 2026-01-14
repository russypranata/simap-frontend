# Profiles API

Base URL: `/api/v1`

This API handles both the **authenticated student's self-service profile** and the **admin management of role-based profiles** (Student, Teacher, Staff).

---

## 1. Student Self-Service Profile

**Base URL**: `/student/profile`  
**Auth Required**: Yes (Bearer Token - Student Role)

### Get Profile

Retrieve the authenticated student's profile information.

- **URL**: `/student/profile`
- **Method**: `GET`

#### Example Request

```bash
curl -X GET http://localhost:8000/api/v1/student/profile \
  -H "Authorization: Bearer <your_token>" \
  -H "Accept: application/json"
```

#### Response (200 OK)

```json
{
    "code": 200,
    "status": "success",
    "message": "Profile data retrieved successfully",
    "data": {
        "id": 1,
        "name": "Ahmad Fauzan",
        "nis": "12345678",
        "nisn": "12345678",
        "class": "XII IPA 1",
        "email": "ahmad@example.com",
        "phone": "08123456789",
        "address": "Test Address",
        "birthPlace": "Jakarta",
        "birthDate": "2007-05-15",
        "religion": "Islam",
        "joinDate": "January 2026",
        "role": "Student",
        "validUntil": "31 June 2028",
        "profilePicture": "http://localhost:8000/storage/avatars/default.jpg",
        "avatar": "http://localhost:8000/storage/avatars/default.jpg",
        "passwordLastChanged": "2026-01-13T15:00:00+00:00",
        "createdAt": "2026-01-13T15:00:00+00:00",
        "updatedAt": "2026-01-13T15:00:00+00:00"
    }
}
```

### Update Profile

Update the authenticated student's profile information.

- **URL**: `/student/profile`
- **Method**: `PUT`

#### Example Request

```bash
curl -X PUT http://localhost:8000/api/v1/student/profile \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "Ahmad Fauzan Updated",
    "email": "ahmad@example.com",
    "phone": "081999888777",
    "address": "New Address",
    "birthPlace": "Bandung",
    "birthDate": "2007-06-01"
  }'
```

#### Request Body

| Field        | Type   | Required | Description                |
| ------------ | ------ | -------- | -------------------------- |
| `name`       | string | Yes      | Full name (min 3 chars)    |
| `email`      | string | Yes      | Valid email address        |
| `phone`      | string | Yes      | Phone (starts with 08)     |
| `address`    | string | No       | Address (max 500 chars)    |
| `birthPlace` | string | No       | Place of birth             |
| `birthDate`  | date   | No       | Date of birth (YYYY-MM-DD) |

#### Response (200 OK)

```json
{
    "code": 200,
    "status": "success",
    "message": "Profile updated successfully",
    "data": { ... }
}
```

### Upload Avatar

Upload or update profile picture.

- **URL**: `/student/profile/avatar`
- **Method**: `POST`
- **Headers**: `Content-Type: multipart/form-data`

### Example Request

```bash
curl -X POST http://localhost:8000/api/v1/student/profile/avatar \
  -H "Authorization: Bearer <your_token>" \
  -H "Accept: application/json" \
  -F "avatar=@/path/to/your/image.jpg"
```

#### Request Body

| Field    | Type | Required | Description                          |
| -------- | ---- | -------- | ------------------------------------ |
| `avatar` | File | Yes      | Image file (jpg, jpeg, png, max 2MB) |

#### Response (200 OK)

```json
{
    "code": 200,
    "status": "success",
    "message": "Avatar updated successfully",
    "data": {
        "avatar_url": "http://..."
    }
}
```

### Change Password

Change account password.

- **URL**: `/student/profile/password`
- **Method**: `PUT`

### Example Request

```bash
curl -X PUT http://localhost:8000/api/v1/student/profile/password \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "currentPassword": "old_password",
    "newPassword": "new_secure_password",
    "confirmPassword": "new_secure_password"
  }'
```

#### Request Body

| Field             | Type   | Required |
| ----------------- | ------ | -------- |
| `currentPassword` | string | Yes      |
| `newPassword`     | string | Yes      |
| `confirmPassword` | string | Yes      |

#### Response (200 OK)

```json
{
    "code": 200,
    "status": "success",
    "message": "Password updated successfully"
}
```

---

## 2. Admin Profile Management

Manage role-specific profiles. All endpoints require **Admin** privileges.

### A. Student Profiles

**Base URL**: `/student-profiles`

#### Create Student Profile

- **URL**: `/student-profiles`
- **Method**: `POST`

### Example Request

```bash
curl -X POST http://localhost:8000/api/v1/student-profiles \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "user_id": 2,
    "admission_number": "STU-001",
    "dob": "2005-01-01"
  }'
```

**Example Body**:

```json
{
    "user_id": 2,
    "admission_number": "STU-001",
    "dob": "2005-01-01"
}
```

**Fields**:

- `user_id`: int (required, unique)
- `admission_number`: string (required, unique)
- `dob`: date (required, YYYY-MM-DD)
- `guardian_details`: object (nullable)

#### Update Student Profile

- **URL**: `/student-profiles/{id}`
- **Method**: `PUT`

### Example Request

```bash
curl -X PUT http://localhost:8000/api/v1/student-profiles/1 \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "user_id": 2,
    "admission_number": "STU-001-UPDATED",
    "dob": "2005-01-01"
  }'
```

- **Body**: Same as Create

#### Response (201 Created / 200 OK)

```json
{
    "code": 201,
    "status": "success",
    "message": "Student profile created successfully",
    "data": {
        "id": 1,
        "user_id": 2,
        "admission_number": "STU-001",
        "dob": "2005-01-01T00:00:00.000000Z",
        "guardian_details": { ... }
    }
}
```

### B. Teacher Profiles

**Base URL**: `/teacher-profiles`

#### Create Teacher Profile

- **URL**: `/teacher-profiles`
- **Method**: `POST`

### Example Request

```bash
curl -X POST http://localhost:8000/api/v1/teacher-profiles \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "user_id": 3,
    "employee_id": "TCH-001",
    "qualifications": "PhD in Education"
  }'
```

**Example Body**:

```json
{
    "user_id": 3,
    "employee_id": "TCH-001",
    "qualifications": "PhD in Education"
}
```

**Fields**:

- `user_id`: int (required, unique)
- `employee_id`: string (required, unique)
- `qualifications`: string (nullable)

#### Update Teacher Profile

- **URL**: `/teacher-profiles/{id}`
- **Method**: `PUT`

### Example Request

```bash
curl -X PUT http://localhost:8000/api/v1/teacher-profiles/1 \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "user_id": 3,
    "employee_id": "TCH-001",
    "qualifications": "Masters in Education"
  }'
```

- **Body**: Same as Create

### C. Staff Profiles

**Base URL**: `/staff-profiles`

#### Create Staff Profile

- **URL**: `/staff-profiles`
- **Method**: `POST`

### Example Request

```bash
curl -X POST http://localhost:8000/api/v1/staff-profiles \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "user_id": 4,
    "department": "HR",
    "job_title": "Manager"
  }'
```

**Example Body**:

```json
{
    "user_id": 4,
    "department": "HR",
    "job_title": "Manager"
}
```

**Fields**:

- `user_id`: int (required, unique)
- `department`: string (required)
- `job_title`: string (required)

#### Update Staff Profile

- **URL**: `/staff-profiles/{id}`
- **Method**: `PUT`

### Example Request

```bash
curl -X PUT http://localhost:8000/api/v1/staff-profiles/1 \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "user_id": 4,
    "department": "Finance",
    "job_title": "Senior Manager"
  }'
```

- **Body**: Same as Create
