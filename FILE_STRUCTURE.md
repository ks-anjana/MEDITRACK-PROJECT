# MediTrack - File Structure & Navigation Guide

## 📂 Complete Directory Map

```
MEDITRACK/
│
├─ 📘 START_HERE.md                 ← START WITH THIS FILE!
├─ 📘 README.md                      ← Full documentation
├─ 📘 QUICKSTART.md                  ← 5-minute setup
├─ 📘 ENV_SETUP.md                   ← Environment guide
├─ 📘 API_DOCUMENTATION.md           ← API reference
├─ 📘 PROJECT_SUMMARY.md             ← Project details
├─ 📘 COMPLETION_REPORT.md           ← Completion status
│
│
├─ 🗂️ SERVER/ (Backend - Node.js/Express)
│  │
│  ├─ 📁 models/
│  │  ├─ User.js                     (5 fields + bcrypt)
│  │  ├─ Medicine.js                 (Medicine reminders)
│  │  ├─ Appointment.js              (Doctor appointments)
│  │  ├─ Prescription.js             (Uploaded images)
│  │  └─ HealthTip.js                (Health tips)
│  │
│  ├─ 📁 routes/
│  │  ├─ authRoutes.js               (Login/Register)
│  │  ├─ medicineRoutes.js           (Medicine CRUD)
│  │  ├─ appointmentRoutes.js        (Appointment CRUD)
│  │  ├─ prescriptionRoutes.js       (Upload/Delete)
│  │  └─ adminRoutes.js              (Admin operations)
│  │
│  ├─ 📁 controllers/
│  │  ├─ authController.js           (Auth logic)
│  │  ├─ medicineController.js       (Medicine logic)
│  │  ├─ appointmentController.js    (Appointment logic)
│  │  ├─ prescriptionController.js   (File upload logic)
│  │  └─ adminController.js          (Health tips logic)
│  │
│  ├─ 📁 middleware/
│  │  ├─ authMiddleware.js           (JWT verification)
│  │  └─ adminMiddleware.js          (Admin check)
│  │
│  ├─ 📁 jobs/
│  │  └─ cronJobs.js                 (Scheduled tasks)
│  │
│  ├─ 📁 uploads/                    (Prescription images)
│  │
│  ├─ server.js                      (Main server)
│  ├─ package.json                   (Dependencies)
│  ├─ .env                           (Configuration)
│  └─ .gitignore
│
│
└─ 🗂️ CLIENT/ (Frontend - React/Vite)
   │
   ├─ 📁 src/
   │  │
   │  ├─ 📁 pages/
   │  │  ├─ LoginPage.jsx            (User + Admin login)
   │  │  ├─ RegisterPage.jsx         (User registration)
   │  │  ├─ UserDashboard.jsx        (User main page)
   │  │  ├─ AdminDashboard.jsx       (Admin main page)
   │  │  ├─ MedicineScheduler.jsx    (Medicine mgmt)
   │  │  ├─ AppointmentTracker.jsx   (Appointment mgmt)
   │  │  └─ PrescriptionUpload.jsx   (File upload)
   │  │
   │  ├─ 📁 components/
   │  │  ├─ Button.jsx               (Reusable button)
   │  │  ├─ Card.jsx                 (Container)
   │  │  ├─ Input.jsx                (Form input)
   │  │  ├─ Alert.jsx                (Messages)
   │  │  └─ ProtectedRoute.jsx       (Route protection)
   │  │
   │  ├─ 📁 context/
   │  │  └─ AuthContext.jsx          (Global auth state)
   │  │
   │  ├─ 📁 services/
   │  │  ├─ api.js                   (API calls)
   │  │  └─ NotificationService.js   (Browser notifications)
   │  │
   │  ├─ App.jsx                     (Main app + routes)
   │  ├─ main.jsx                    (Entry point)
   │  └─ index.css                   (Global styles)
   │
   ├─ 📁 public/                     (Static assets)
   │
   ├─ index.html                     (HTML template)
   ├─ package.json                   (Dependencies)
   ├─ vite.config.js                 (Vite config)
   ├─ tailwind.config.js             (Tailwind config)
   ├─ postcss.config.js              (PostCSS config)
   └─ .gitignore

```

---

## 🗺️ Navigation Guide

### 📚 Documentation (Read in this order)

1. **START_HERE.md** ← You are here
   - 5-minute quick start
   - Troubleshooting
   
2. **QUICKSTART.md**
   - Detailed setup steps
   - Terminal commands
   
3. **README.md**
   - Complete documentation
   - Features overview
   - Project structure
   
4. **API_DOCUMENTATION.md**
   - All endpoints
   - Request/response examples
   - Error handling
   
5. **ENV_SETUP.md**
   - Environment variables
   - MongoDB setup
   - Configuration options

6. **PROJECT_SUMMARY.md**
   - Detailed project info
   - Architecture overview
   - Testing scenarios

7. **COMPLETION_REPORT.md**
   - Completion status
   - Code statistics
   - Quality metrics

---

## 🔄 Typical User Flow

```
1. User visits http://localhost:3000
   ↓
2. Sees LoginPage
   ├─ Option A: Register (goes to RegisterPage)
   └─ Option B: Login (if already registered)
   ↓
3. After successful login, redirected to:
   ├─ User Dashboard (role = user)
   └─ Admin Dashboard (role = admin)
   ↓
4. User Dashboard shows:
   ├─ Medicine Scheduler card → MedicineScheduler page
   ├─ Appointment Tracker card → AppointmentTracker page
   ├─ Prescription Upload card → PrescriptionUpload page
   └─ Health Tips section below
   ↓
5. Admin Dashboard shows:
   ├─ Create health tip form
   └─ All existing health tips
   ↓
6. User can logout → redirects to LoginPage
```

---

## 🎯 Backend Flow

```
Request from Frontend
    ↓
Express Server (server.js)
    ↓
CORS & JSON middleware
    ↓
Routes (authRoutes, medicineRoutes, etc.)
    ↓
authMiddleware (JWT verification)
    ↓
adminMiddleware (if needed)
    ↓
Controller (Business logic)
    ↓
Model (MongoDB query)
    ↓
Database (MongoDB)
    ↓
Response back to Frontend
```

---

## 💾 Database Operations

### Create (INSERT)
- User registration → User model
- Add medicine → Medicine model
- Schedule appointment → Appointment model
- Upload prescription → Prescription model
- Create health tip → HealthTip model

### Read (SELECT)
- Login → Find user
- Get medicines → Find user's medicines
- Get appointments → Find user's appointments
- Get health tips → Find all health tips

### Update (UPDATE)
- Alert tracking → Update appointment.alertSent
- Update user profile → Update user fields

### Delete (DELETE)
- Remove medicine → Delete from Medicine
- Cancel appointment → Delete from Appointment
- Delete prescription → Delete from Prescription

---

## 🔐 Security Flow

```
User Password
    ↓
Hashed with bcrypt (10 rounds)
    ↓
Stored in Database
    ↓
On Login: Compare with bcrypt
    ↓
Generate JWT Token
    ↓
Send to Frontend (localStorage)
    ↓
Frontend includes in every API request (Authorization header)
    ↓
Backend verifies JWT with authMiddleware
    ↓
If valid: Proceed with request
If invalid: Return 401 error
```

---

## 📊 Component Hierarchy

```
App.jsx (Main component)
├─ AuthProvider (Global auth state)
│  └─ Router (React Router)
│     ├─ LoginPage
│     ├─ RegisterPage
│     ├─ ProtectedRoute
│     │  └─ UserDashboard
│     │     ├─ Card (3 items)
│     │     │  ├─ Button
│     │     │  ├─ Button
│     │     │  └─ Button
│     │     ├─ Health Tips Section
│     │     │  └─ Card (for each tip)
│     │     └─ Logout Button
│     ├─ ProtectedRoute
│     │  └─ MedicineScheduler
│     │     ├─ Input (form)
│     │     ├─ Button
│     │     └─ Medicine List
│     │        └─ Card (for each medicine)
│     ├─ ProtectedRoute
│     │  └─ AppointmentTracker
│     │     ├─ Input (form)
│     │     ├─ Button
│     │     └─ Appointment List
│     │        └─ Card (for each appointment)
│     ├─ ProtectedRoute
│     │  └─ PrescriptionUpload
│     │     └─ File Input
│     │     └─ Button
│     └─ ProtectedRoute
│        └─ AdminDashboard
│           ├─ Health Tip Form
│           │  ├─ Input
│           │  ├─ Textarea
│           │  └─ Button
│           └─ Health Tips List
│              └─ Card (for each tip)
```

---

## 🌐 API Call Flow

```
User Action (e.g., click "Add Medicine")
    ↓
React Component (MedicineScheduler.jsx)
    ↓
Form Submit Handler
    ↓
Validation
    ↓
API Call (medicineAPI.addMedicine)
    ↓
Axios request with JWT token
    ↓
Backend Route (/api/medicine)
    ↓
Controller (medicineController.addMedicine)
    ↓
Database Operation
    ↓
Response (JSON)
    ↓
Frontend receives data
    ↓
Update component state
    ↓
Show success message
    ↓
Refresh medicine list
```

---

## 📋 File Size Reference

| File/Folder | Lines | Purpose |
|-------------|-------|---------|
| User.js | 45 | User model |
| Medicine.js | 25 | Medicine model |
| Appointment.js | 35 | Appointment model |
| Prescription.js | 20 | Prescription model |
| HealthTip.js | 15 | HealthTip model |
| authController.js | 100 | Auth logic |
| medicineController.js | 60 | Medicine logic |
| appointmentController.js | 60 | Appointment logic |
| prescriptionController.js | 60 | Upload logic |
| adminController.js | 80 | Admin logic |
| cronJobs.js | 150 | Scheduled tasks |
| UserDashboard.jsx | 150 | Main dashboard |
| LoginPage.jsx | 150 | Login page |
| RegisterPage.jsx | 150 | Registration page |
| MedicineScheduler.jsx | 200 | Medicine page |
| AppointmentTracker.jsx | 200 | Appointment page |
| PrescriptionUpload.jsx | 150 | Upload page |
| App.jsx | 80 | Main app |
| **Total** | **~3000** | Complete app |

---

## 🔑 Key Files to Understand

### If you want to understand...

| Topic | File to Read |
|-------|-------------|
| Authentication | `server/middleware/authMiddleware.js` |
| Password hashing | `server/models/User.js` |
| API structure | `server/routes/medicineRoutes.js` |
| Database access | `server/controllers/medicineController.js` |
| Routing | `client/src/App.jsx` |
| Form handling | `client/src/pages/MedicineScheduler.jsx` |
| State management | `client/src/context/AuthContext.jsx` |
| API calls | `client/src/services/api.js` |
| UI components | `client/src/components/Button.jsx` |
| Notifications | `client/src/services/NotificationService.js` |

---

## 🚀 Running Different Parts

### Just Backend
```bash
cd server
npm install
npm run dev
# Runs on http://localhost:5000
```

### Just Frontend
```bash
cd client
npm install
npm run dev
# Runs on http://localhost:3000
```

### Both (Recommended)
```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

---

## 📞 Quick Links

- **Start**: [START_HERE.md](START_HERE.md)
- **Setup**: [QUICKSTART.md](QUICKSTART.md)
- **API**: [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Env**: [ENV_SETUP.md](ENV_SETUP.md)
- **Full Docs**: [README.md](README.md)

---

## ✅ Everything You Need

✅ 50+ complete source files
✅ 5+ comprehensive documentation files
✅ 7 working pages
✅ 17 API endpoints
✅ Full database schema
✅ Authentication system
✅ File upload system
✅ Cron job scheduling
✅ Responsive UI
✅ Production ready

---

**Ready to start? Go to [START_HERE.md](START_HERE.md)** 🚀

---

*Last Updated: December 28, 2024*
*Version: 1.0.0*
