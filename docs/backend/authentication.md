# Authentication API

Base URL: `/api/v1`

## Login

Authenticate a user and retrieve an access token.

- **URL**: `/auth/login`
- **Method**: `POST`
- **Auth Required**: No

### Example Request

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"username": "siswa123", "password": "password"}'
```

### Request Body

| Field      | Type   | Required | Description     |
| ---------- | ------ | -------- | --------------- |
| `username` | string | Yes      | User's username |
| `password` | string | Yes      | User's password |

### Response (200 OK)

```json
{
    "code": 200,
    "status": "success",
    "message": "Login successful",
    "data": {
        "token": "1|laravel_sanctum_token...",
        "user": {
            "id": 1,
            "username": "siswa123",
            "name": "John Doe",
            "role": "student",
            "avatar": "https://api.simap.sch.id/storage/avatars/default.jpg"
        }
    }
}
```

### Response (401 Unauthorized)

```json
{
    "code": 401,
    "status": "error",
    "message": "Invalid username or password"
}
```

### Response (422 Unprocessable Entity)

```json
{
    "code": 422,
    "status": "error",
    "message": "Validation failed",
    "errors": {
        "username": ["The username field is required."]
    }
}
```

---

## Get Current User

Retrieve the currently authenticated user's details.

- **URL**: `/auth/user`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token)

### Request Headers

| Header          | Value                   |
| --------------- | ----------------------- |
| `Authorization` | `Bearer <access_token>` |

### Example Request

```bash
curl -X GET http://localhost:8000/api/v1/auth/user \
  -H "Authorization: Bearer <your_token>" \
  -H "Accept: application/json"
```

### Response (200 OK)

```json
{
    "code": 200,
    "status": "success",
    "message": "User profile successfully retrieved",
    "data": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "email_verified_at": null,
        "created_at": "2024-01-01T00:00:00.000000Z",
        "updated_at": "2024-01-01T00:00:00.000000Z"
    }
}
```

---

## Logout

Revoke the current access token.

- **URL**: `/auth/logout`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer Token)

### Request Headers

| Header          | Value                   |
| --------------- | ----------------------- |
| `Authorization` | `Bearer <access_token>` |

### Example Request

```bash
curl -X POST http://localhost:8000/api/v1/auth/logout \
  -H "Authorization: Bearer <your_token>" \
  -H "Accept: application/json"
```

### Response (200 OK)

```json
{
    "code": 200,
    "status": "success",
    "message": "Successfully logged out"
}
```
