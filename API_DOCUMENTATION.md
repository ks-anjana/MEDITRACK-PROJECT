# MediTrack API Documentation

Complete API reference for MediTrack backend.

## Base URL
```
http://localhost:5000/api
```

## Headers

All authenticated requests require:
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

---

## Authentication Endpoints

### 1. Register User
Create a new user account.

**Endpoint:** `POST /auth/register`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

**Response (201):**
```json
{
  "message": "Registration Successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Error (400):**
```json
{
  "message": "User already registered with this email"
}
```

---

### 2. Login User
Authenticate and receive JWT token.

**Endpoint:** `POST /auth/login`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

**Response (200):**
```json
{
  "message": "Login Successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Error (400):**
```json
{
  "message": "Invalid email"
}
```

---

### 3. Get User Profile
Get authenticated user's profile.

**Endpoint:** `GET /auth/profile`

**Headers:** `Authorization: Bearer <TOKEN>`

**Response (200):**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

## Medicine Endpoints

### 1. Add Medicine
Create a new medicine reminder.

**Endpoint:** `POST /medicine`

**Headers:** `Authorization: Bearer <TOKEN>`

**Body:**
```json
{
  "medicineName": "Aspirin",
  "time": "09:00",
  "period": "AM",
  "foodTiming": "After Food"
}
```

**Response (201):**
```json
{
  "message": "Medicine added successfully",
  "medicine": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "medicineName": "Aspirin",
    "time": "09:00",
    "period": "AM",
    "foodTiming": "After Food",
    "createdAt": "2024-12-28T10:30:00.000Z"
  }
}
```

---

### 2. Get All Medicines
Retrieve all medicines for authenticated user.

**Endpoint:** `GET /medicine`

**Headers:** `Authorization: Bearer <TOKEN>`

**Response (200):**
```json
{
  "medicines": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "userId": "507f1f77bcf86cd799439011",
      "medicineName": "Aspirin",
      "time": "09:00",
      "period": "AM",
      "foodTiming": "After Food",
      "createdAt": "2024-12-28T10:30:00.000Z"
    }
  ]
}
```

---

### 3. Delete Medicine
Remove a medicine reminder.

**Endpoint:** `DELETE /medicine/:medicineId`

**Headers:** `Authorization: Bearer <TOKEN>`

**URL Parameters:**
- `medicineId` (required): MongoDB ID of medicine

**Response (200):**
```json
{
  "message": "Medicine removed successfully"
}
```

---

## Appointment Endpoints

### 1. Add Appointment
Schedule a doctor appointment.

**Endpoint:** `POST /appointment`

**Headers:** `Authorization: Bearer <TOKEN>`

**Body:**
```json
{
  "doctorName": "Dr. John Smith",
  "appointmentDate": "2024-12-30",
  "appointmentTime": "14:00"
}
```

**Response (201):**
```json
{
  "message": "Saved Successfully",
  "appointment": {
    "_id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439011",
    "doctorName": "Dr. John Smith",
    "appointmentDate": "2024-12-30T00:00:00.000Z",
    "appointmentTime": "14:00",
    "alertSent": false,
    "previousDayAlertSent": false,
    "createdAt": "2024-12-28T10:30:00.000Z"
  }
}
```

---

### 2. Get All Appointments
Retrieve all appointments for authenticated user.

**Endpoint:** `GET /appointment`

**Headers:** `Authorization: Bearer <TOKEN>`

**Response (200):**
```json
{
  "appointments": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "userId": "507f1f77bcf86cd799439011",
      "doctorName": "Dr. John Smith",
      "appointmentDate": "2024-12-30T00:00:00.000Z",
      "appointmentTime": "14:00",
      "alertSent": false,
      "previousDayAlertSent": false,
      "createdAt": "2024-12-28T10:30:00.000Z"
    }
  ]
}
```

---

### 3. Delete Appointment
Cancel an appointment.

**Endpoint:** `DELETE /appointment/:appointmentId`

**Headers:** `Authorization: Bearer <TOKEN>`

**URL Parameters:**
- `appointmentId` (required): MongoDB ID of appointment

**Response (200):**
```json
{
  "message": "Appointment deleted successfully"
}
```

---

## Prescription Endpoints

### 1. Upload Prescription
Upload a prescription image.

**Endpoint:** `POST /prescription/upload`

**Headers:** 
```
Authorization: Bearer <TOKEN>
Content-Type: multipart/form-data
```

**Form Data:**
- `prescription` (file, required): JPG or PNG image (max 10MB)

**Response (201):**
```json
{
  "message": "Prescription uploaded successfully",
  "prescription": {
    "_id": "507f1f77bcf86cd799439014",
    "userId": "507f1f77bcf86cd799439011",
    "fileName": "prescription.jpg",
    "filePath": "uploads/prescription-1702209000000-123456789.jpg",
    "uploadedAt": "2024-12-28T10:30:00.000Z"
  }
}
```

---

### 2. Get All Prescriptions
Retrieve all prescriptions for authenticated user.

**Endpoint:** `GET /prescription`

**Headers:** `Authorization: Bearer <TOKEN>`

**Response (200):**
```json
{
  "prescriptions": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "userId": "507f1f77bcf86cd799439011",
      "fileName": "prescription.jpg",
      "filePath": "uploads/prescription-1702209000000-123456789.jpg",
      "uploadedAt": "2024-12-28T10:30:00.000Z"
    }
  ]
}
```

---

### 3. Delete Prescription
Remove a prescription image.

**Endpoint:** `DELETE /prescription/:prescriptionId`

**Headers:** `Authorization: Bearer <TOKEN>`

**URL Parameters:**
- `prescriptionId` (required): MongoDB ID of prescription

**Response (200):**
```json
{
  "message": "Prescription deleted successfully"
}
```

---

## Admin Endpoints

### 1. Create Health Tip
Create a new health tip (Admin only).

**Endpoint:** `POST /admin/health-tips`

**Headers:** `Authorization: Bearer <TOKEN>` (Admin role required)

**Body:**
```json
{
  "title": "Stay Hydrated",
  "description": "Drink at least 8 glasses of water daily. Proper hydration maintains body temperature and removes waste."
}
```

**Response (201):**
```json
{
  "message": "Post Completed",
  "healthTip": {
    "_id": "507f1f77bcf86cd799439015",
    "title": "Stay Hydrated",
    "description": "Drink at least 8 glasses of water daily. Proper hydration maintains body temperature and removes waste.",
    "createdAt": "2024-12-28T10:30:00.000Z"
  }
}
```

---

### 2. Get All Health Tips
Retrieve all health tips (Public endpoint).

**Endpoint:** `GET /admin/health-tips`

**Response (200):**
```json
{
  "healthTips": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "title": "Stay Hydrated",
      "description": "Drink at least 8 glasses of water daily.",
      "createdAt": "2024-12-28T10:30:00.000Z"
    }
  ]
}
```

---

### 3. Seed Default Health Tips
Initialize database with 5 default health tips (Public endpoint).

**Endpoint:** `POST /admin/seed-health-tips`

**Response (201):**
```json
{
  "message": "Health tips seeded successfully",
  "count": 5
}
```

**Note:** This endpoint will only seed if no health tips exist.

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Please provide all required fields"
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid token"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied. Admin only."
}
```

### 404 Not Found
```json
{
  "message": "Medicine not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error",
  "error": "Error details here"
}
```

---

## Data Validation Rules

### Medicine
- `medicineName`: Required, string, trimmed
- `time`: Required, string (HH:MM format)
- `period`: Required, "AM" or "PM"
- `foodTiming`: Required, "Before Food" or "After Food"

### Appointment
- `doctorName`: Required, string, trimmed
- `appointmentDate`: Required, valid date
- `appointmentTime`: Required, string (HH:MM format)

### Prescription
- `prescription`: Required, file
- `File Type`: JPG or PNG only
- `Max Size`: 10MB

### Health Tip
- `title`: Required, string, trimmed
- `description`: Required, string

---

## JWT Token Structure

All JWT tokens have this structure:
```
Header: { alg: "HS256", typ: "JWT" }
Payload: { id: "userId", role: "user|admin" }
Secret: your_jwt_secret
Expiry: 7 days
```

---

## Rate Limiting

Currently no rate limiting is implemented. For production, add:
- 100 requests per 15 minutes per IP
- 1000 requests per hour per user

---

## CORS Configuration

The backend accepts requests from all origins in development. For production, configure:
```javascript
const allowedOrigins = ['https://yourdomain.com'];
```

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "user"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "role": "user"
  }'
```

### Add Medicine (with token)
```bash
curl -X POST http://localhost:5000/api/medicine \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "medicineName": "Aspirin",
    "time": "09:00",
    "period": "AM",
    "foodTiming": "After Food"
  }'
```

---

## Postman Collection

Import this into Postman:

```json
{
  "info": {
    "name": "MediTrack API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Register",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/auth/register",
        "body": {
          "mode": "raw",
          "raw": "{\"name\": \"John\", \"email\": \"john@example.com\", \"password\": \"pass123\", \"role\": \"user\"}"
        }
      }
    }
  ]
}
```

---

**Last Updated:** December 2024
**Version:** 1.0.0
**Status:** Production Ready ✅
