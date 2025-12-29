# MediTrack - Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Install MongoDB (if not already installed)

**Windows:**
```bash
# Download from https://www.mongodb.com/try/download/community
# Or use Chocolatey
choco install mongodb-community
```

**Mac:**
```bash
brew install mongodb-community
```

**Linux:**
```bash
sudo apt-get install -y mongodb
```

**Or use MongoDB Atlas Cloud (Recommended):**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string: `mongodb+srv://user:password@cluster.mongodb.net/meditrack`

### Step 2: Backend Setup (Terminal 1)

```bash
# Navigate to server directory
cd MEDITRACK/server

# Install dependencies
npm install

# Create .env file (Windows)
echo MONGO_URI=mongodb://localhost:27017/meditrack > .env
echo JWT_SECRET=your_super_secret_jwt_key_change_in_production >> .env
echo PORT=5000 >> .env
echo NODE_ENV=development >> .env

# For Mac/Linux, edit .env manually with:
# MONGO_URI=mongodb://localhost:27017/meditrack
# JWT_SECRET=your_super_secret_jwt_key_change_in_production
# PORT=5000
# NODE_ENV=development

# Start server
npm run dev

# Expected output:
# Server running on port 5000
# MongoDB connected successfully
# Cron jobs started successfully
```

### Step 3: Frontend Setup (Terminal 2)

```bash
# Navigate to client directory
cd MEDITRACK/client

# Install dependencies
npm install

# Start development server
npm run dev

# Expected output:
# Local:   http://localhost:3000
# Press q to quit
```

### Step 4: Test the Application

**In Browser:**
1. Go to http://localhost:3000
2. You'll see the Login page

**Test User Registration:**
- Click "Register here"
- Fill in: Name: John Doe, Email: john@example.com, Password: password123
- Click Register
- Should see "Registration Successful" and redirect to User Dashboard

**Test User Login:**
- Go to http://localhost:3000/login
- Enter: john@example.com / password123
- Click Login
- You're now on User Dashboard

**Test Admin Login:**
- Click "Switch to Admin Login →"
- Create admin account: admin@example.com / admin123
- Or login with any email/password with role=admin

**Test Medicine Scheduler:**
- Click "Schedule Medicine"
- Add: Aspirin, 9:00 AM, After Food
- Should appear in list below
- Try removing it

**Test Appointment Tracker:**
- Click "Track Appointments"
- Add: Dr. Smith, select date, 2:00 PM
- Should show "Saved Successfully"
- Appointment appears in list

**Test Prescription Upload:**
- Click "Upload Prescription"
- Select any JPG or PNG image
- Should show success message

**Test Health Tips:**
- On dashboard, scroll down to see health tips
- Login as admin to create new tips
- Tips appear immediately to all users

## 📊 API Testing with Postman/cURL

### Register User
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

### Login User
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

## 🐛 Troubleshooting

### "Cannot find module 'express'"
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### "MongoDB connection error"
```bash
# Check if MongoDB is running
# Windows: mongod
# Mac: brew services start mongodb-community

# Or change MONGO_URI in .env to MongoDB Atlas cloud
```

### "Port 5000 already in use"
```bash
# Kill process on port 5000
# Windows: netstat -ano | findstr :5000
# Mac/Linux: lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Or change PORT in .env
```

### "Port 3000 already in use"
```bash
# Edit client/vite.config.js and change port to 3001
# Or kill process on port 3000
```

### "CORS error when calling API"
- Ensure backend is running on http://localhost:5000
- Check vite.config.js proxy settings

### "Notification permission not granted"
- Click "Allow" when browser asks for notification permission
- Check browser notification settings

## 📚 File Locations Reference

### Backend Files
- Database Models: `server/models/`
- API Routes: `server/routes/`
- Controllers: `server/controllers/`
- Middleware: `server/middleware/`
- Cron Jobs: `server/jobs/cronJobs.js`
- Main Server: `server/server.js`
- Config: `server/.env`

### Frontend Files
- Pages: `client/src/pages/`
- Components: `client/src/components/`
- Auth Context: `client/src/context/AuthContext.jsx`
- API Service: `client/src/services/api.js`
- Main App: `client/src/App.jsx`
- Styling: `client/src/index.css`

## 🎯 Features to Test

- [x] User Registration with validation
- [x] User Login with JWT
- [x] Admin Login (separate)
- [x] Logout functionality
- [x] Medicine scheduling
- [x] Appointment tracking
- [x] Prescription upload (images only)
- [x] Health tips management
- [x] Responsive design
- [x] Form validation
- [x] Error handling
- [x] Success messages

## 📈 Performance Tips

1. **Database**: Use MongoDB Atlas for better performance
2. **Images**: Compress prescription images before upload
3. **API Calls**: Already optimized with axios interceptors
4. **Frontend**: Vite is already optimized for fast builds

## 🔒 Security Notes

- Change JWT_SECRET in production
- Use HTTPS in production
- Add CORS whitelist in production
- Validate all inputs on backend
- Use environment variables for sensitive data
- Implement rate limiting in production

## 📞 Next Steps

1. Customize branding (colors, fonts, logo)
2. Add email notifications (nodemailer)
3. Add social login (Google, GitHub)
4. Add SMS notifications (Twilio)
5. Add analytics
6. Deploy to production

## 🎉 You're Done!

Your MediTrack application is now running. Start exploring the features!

---

**Need Help?** Check server console logs (Terminal 1) and browser console (F12) for errors.
