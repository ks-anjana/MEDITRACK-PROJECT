# MediTrack - Healthcare Reminder Web Application

A complete MERN stack healthcare reminder application with User and Admin roles. Track medicines, appointments, and upload prescriptions with automated alerts.

## 🌟 Features

### User Features
- **User Registration & Login** - Secure authentication with JWT + bcrypt
- **Medicine Scheduler** - Schedule medicines with time and food timing reminders
- **Appointment Tracker** - Track doctor appointments with advance reminders
- **Prescription Upload** - Upload and store prescription images
- **Health Tips** - View health tips posted by admin
- **Browser Notifications** - Real-time alerts for medicines and appointments

### Admin Features
- **Admin Login** - Separate admin authentication
- **Health Tip Management** - Create and manage health tips visible to all users
- **Default Health Tips** - Pre-seeded with 5 default health tips

## 🛠 Tech Stack

### Frontend
- React.js 18+ (Vite)
- React Router v6
- Axios for API calls
- Tailwind CSS for styling
- Context API for state management

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- node-cron for scheduled notifications
- Multer for file uploads

### Database
- MongoDB (local or cloud)

## 📁 Project Structure

```
MEDITRACK/
├── server/
│   ├── models/
│   │   ├── User.js
│   │   ├── Medicine.js
│   │   ├── Appointment.js
│   │   ├── Prescription.js
│   │   └── HealthTip.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── medicineRoutes.js
│   │   ├── appointmentRoutes.js
│   │   ├── prescriptionRoutes.js
│   │   └── adminRoutes.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── medicineController.js
│   │   ├── appointmentController.js
│   │   ├── prescriptionController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── adminMiddleware.js
│   ├── jobs/
│   │   └── cronJobs.js
│   ├── uploads/
│   ├── server.js
│   ├── .env
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── MedicineScheduler.jsx
│   │   │   ├── AppointmentTracker.jsx
│   │   │   └── PrescriptionUpload.jsx
│   │   ├── components/
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Alert.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── NotificationService.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas cloud)

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with the following:
```
MONGO_URI=mongodb://localhost:27017/meditrack
JWT_SECRET=your_super_secret_jwt_key_change_in_production
PORT=5001
NODE_ENV=development
```

4. Start the backend server:
```bash
npm run dev
```

The server will run on `http://localhost:5001`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 📖 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)

### Medicine Management
- `POST /api/medicine` - Add medicine (Protected)
- `GET /api/medicine` - Get all medicines (Protected)
- `DELETE /api/medicine/:medicineId` - Delete medicine (Protected)

### Appointment Management
- `POST /api/appointment` - Add appointment (Protected)
- `GET /api/appointment` - Get all appointments (Protected)
- `DELETE /api/appointment/:appointmentId` - Delete appointment (Protected)

### Prescription Management
- `POST /api/prescription/upload` - Upload prescription (Protected)
- `GET /api/prescription` - Get all prescriptions (Protected)
- `DELETE /api/prescription/:prescriptionId` - Delete prescription (Protected)

### Admin
- `GET /api/admin/health-tips` - Get all health tips (Public)
- `POST /api/admin/health-tips` - Create health tip (Protected/Admin only)
- `POST /api/admin/seed-health-tips` - Seed default health tips (Public)

## 🔐 Authentication Flow

1. User registers with name, email, and password
2. Password is hashed with bcrypt (10 salt rounds)
3. On login, JWT token is generated (expires in 7 days)
4. Token is stored in localStorage
5. Protected routes check token validity
6. Admin and User have separate login endpoints but same authentication mechanism

## ⏰ Scheduled Notifications

The backend uses node-cron to trigger notifications:

1. **Medicine Reminders** - Checked every minute at scheduled time
2. **Previous Day Appointment Alert** - Triggered at 6:00 PM for next day appointments
3. **Appointment Day Alert** - Triggered at exact appointment time

These notifications are logged on the server. Frontend can poll for updates or use WebSocket integration.

## 📝 User Workflows

### User Registration
1. Click "Register" on login page
2. Enter Name, Email, Password
3. Validate all fields
4. On success, receive "Registration Successful" message
5. Automatically redirect to User Dashboard

### User Login
1. Enter Email and Password
2. Click Login or switch to Admin Login
3. On success, redirect to User Dashboard
4. On failure, show error message (Invalid email or Invalid password)

### Medicine Scheduler
1. Go to User Dashboard
2. Click "Schedule Medicine"
3. Fill in medicine name, time, AM/PM, and food timing
4. Add medicine to list
5. View all scheduled medicines
6. Remove medicine if needed
7. Return to dashboard

### Appointment Tracker
1. Go to User Dashboard
2. Click "Track Appointments"
3. Fill in doctor name, date, and time
4. Schedule appointment (shows "Saved Successfully")
5. View all appointments
6. Delete appointments if needed
7. Receive reminders: Previous day at 6 PM and on appointment day at scheduled time

### Prescription Upload
1. Go to User Dashboard
2. Click "Upload Prescription"
3. Upload JPG or PNG image
4. See success message
5. Return to dashboard

### Health Tips
1. View health tips on User Dashboard
2. Admin can create new health tips
3. Tips are immediately visible to all users

### Admin Health Tip Management
1. Login as admin (use "Admin Login" on login page)
2. Go to Admin Dashboard
3. Create new health tip with title and description
4. See "Post Completed" message
5. View all health tips (including 5 default ones)

## 🔄 State Management

### Auth Context
Manages:
- User information (name, email, role)
- JWT token
- Login/Register/Logout functions
- Loading and error states
- Authentication status

### Local Storage
Stores:
- JWT token
- User information

## 🎨 UI Components

### Reusable Components
- **Button** - Variants: primary, secondary, danger, outline
- **Input** - With label, error messages, validation
- **Card** - Container for content sections
- **Alert** - Success, error, warning, info messages
- **ProtectedRoute** - Route protection with role-based access

## 📱 Responsive Design

The application is fully responsive using Tailwind CSS:
- Mobile-first approach
- Grid layout (1 column on mobile, 2-3 columns on desktop)
- Touch-friendly buttons and inputs
- Responsive navigation

## 🔔 Browser Notifications

- Request permission on first load
- Show notifications for medicine reminders
- Show notifications for appointment reminders
- Notifications only work with HTTPS in production

## ⚠️ Error Handling

- Form validation errors
- API error messages
- Authentication errors
- File upload validation (type and size)
- Network error handling
- Graceful error displays with Alert component

## 🧪 Testing Scenarios

### Test User Account
1. **Register**: test@example.com / password123
2. **Login**: Use above credentials
3. **Add Medicine**: Aspirin, 9:00 AM, After Food
4. **Schedule Appointment**: Dr. Smith, 2024-12-30, 2:00 PM
5. **Upload Prescription**: Try uploading a JPG/PNG image

### Test Admin Account
1. Create admin account or login with existing
2. Use "Admin Login" on login page
3. Create health tips
4. Verify tips are visible to all users

## 🐛 Common Issues & Solutions

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Or use MongoDB Atlas cloud: `mongodb+srv://user:password@cluster.mongodb.net/meditrack`

### Port Already in Use
- Backend: Change PORT in .env
- Frontend: Change port in vite.config.js

### CORS Errors
- Backend CORS is configured for all origins in development
- For production, set specific origins in server.js

### File Upload Fails
- Check uploads folder exists
- Verify file type (only JPG/PNG)
- Check file size (max 10MB)

## 📦 Dependencies

### Backend
```json
{
  "express": "^4.18.2",
  "mongoose": "^8.0.3",
  "bcrypt": "^5.1.1",
  "jsonwebtoken": "^9.1.2",
  "multer": "^1.4.5-lts.1",
  "node-cron": "^3.0.2",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1"
}
```

### Frontend
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "axios": "^1.6.0",
  "tailwindcss": "^3.4.1"
}
```

## 🚀 Deployment

### Backend Deployment (Heroku)
1. Create Heroku account
2. Install Heroku CLI
3. Deploy: `heroku create` then `git push heroku main`

### Frontend Deployment (Vercel)
1. Create Vercel account
2. Connect GitHub repository
3. Set build command: `npm run build`
4. Automatic deployments on push

## 📄 License

MIT License - Feel free to use this project for personal or commercial use.

## 👨‍💻 Author

Senior MERN Stack Engineer

## 📞 Support

For issues or questions, create a GitHub issue or contact support.

---

**Last Updated**: December 2024
**Version**: 1.0.0
**Status**: Production Ready ✅
