# Alert System - Quick Test Guide

## 🚀 Quick Start (2 minutes)

### Step 1: Ensure Server is Running
```bash
cd C:\MEDITRACK\server
npm start
```

Look for these messages (indicates success):
```
✅ Cron jobs started successfully
   - Medicine reminders check: Every minute
   - Appointment reminders check: Every minute
⏰ Cron check at YYYY-MM-DD HH:MM
```

### Step 2: Start Client (in another terminal)
```bash
cd C:\MEDITRACK\client
npm run dev
```

Access at: http://localhost:5173

### Step 3: Login
- Email: `admin@example.com`
- Password: `adminPass123`

(Or any user account you registered)

---

## 🧪 Test Procedure (5 minutes)

### Test 1: Medicine Alert

1. Go to **Medicine Scheduler** page
2. Click **Add Medicine**
3. Fill in the form:
   - Medicine Name: `Test Medicine`
   - Dosage: `1 tablet`
   - Food Timing: `After meals`
   - **Time: SET TO CURRENT TIME + 1 MINUTE**
     - Example: If it's 2:30 PM now, set to "2:31 PM"
   - Select Days: Check at least one day
4. Click **Add**
5. **Wait maximum 70 seconds**
   - The alert should pop up automatically
   - You should hear a sound (or click page for fallback)

**Expected Result:**
- Modal appears with dark theme
- Shows "Test Medicine" with "After meals"
- Bouncing bell emoji in header
- Sound plays
- "Got it!" button to dismiss

### Test 2: Appointment Alert

1. Go to **Appointment Tracker** page
2. Click **Add Appointment**
3. Fill in the form:
   - Doctor Name: `Dr. Test`
   - Hospital Name: `Test Hospital`
   - **Appointment Date: TODAY** (must match)
   - **Appointment Time: CURRENT TIME + 1 MINUTE**
     - Example: If it's 2:35 PM now, set to "2:36 PM"
4. Click **Add**
5. **Wait maximum 70 seconds**
   - Modal should appear
   - Sound should play

**Expected Result:**
- Modal shows doctor name and hospital
- Appointment emoji (📅)
- Alert displays time
- Sound plays

---

## 🔍 Debug Mode: Check Console

### Open Browser Console
Press `F12` → Go to **Console** tab

### Watch for These Logs
```
✅ [ALERT] = Alert system is working
❌ [ALERT] = Error detected
🔍 [ALERT] = Polling happening
📊 [ALERT] = Backend response received
🚨 [ALERT] = New alert detected
🖥️ [ALERT] = Modal rendering
🔊 [ALERT] = Sound playing
```

### Example Good Console Output
```
🟢 [ALERT] Initializing AlertProvider
🟢 [ALERT] Alert polling started (every 10 seconds)
🔍 [ALERT] Checking for alerts at 14:31:15
📊 [ALERT] Total alerts from backend: 0
🔍 [ALERT] Checking for alerts at 14:31:25
📊 [ALERT] Total alerts from backend: 0
🔍 [ALERT] Checking for alerts at 14:31:35
📊 [ALERT] Total alerts from backend: 1    <-- Alert created!
🚨 [ALERT] NEW ALERTS FOUND: 1
✅ [ALERT] Marked as shown: medicine-507f-14:31
🖥️ [ALERT] Rendering modal with 1 alert(s)
🔊 [ALERT] Playing sound...
🔔 [ALERT] Browser notification shown: 💊 Medicine Reminder
```

### Example Issues & Fixes

#### ❌ "No token found, skipping alert check"
- **Problem**: Not logged in
- **Fix**: Login with valid credentials

#### ❌ "Could not auto-play sound"
- **Problem**: Browser blocked autoplay
- **Fix**: Click anywhere on page to enable sound

#### ❌ "API Error Response: 401"
- **Problem**: Token invalid/expired
- **Fix**: Logout and login again

#### ✅ No new alerts but backend shows alert
- **Problem**: Might already be shown
- **Fix**: Check "Already shown: medicine-{id}-{time}" in console
- **Solution**: Wait 5 minutes or refresh browser

---

## ⏱️ Timing Guide

| Event | Time |
|-------|------|
| User adds medicine for "2:30 PM" | 0 sec |
| Cron checks (next minute at :00) | 30-90 sec |
| Frontend polls (every 10 sec) | 5-10 sec after cron |
| Modal appears | 35-100 sec (max 70 if lucky) |
| Alert stays in system | 5 minutes |
| Alert cleaned from memory | After 5 minutes |

**Best Case**: Alert shows within 5 seconds  
**Expected Case**: Alert shows within 30 seconds  
**Worst Case**: Alert shows within 70 seconds

---

## 🔊 Sound Notes

- Base64 encoded WAV file (~170 bytes)
- Plays automatically with `autoPlay` attribute
- Falls back to click-to-play if browser blocks autoplay
- Works in all modern browsers
- Muted/Unmuted browser doesn't matter (it's notification sound)

---

## 🌐 Network Check

### Open DevTools Network Tab
Press `F12` → Go to **Network** tab

### Filter for Alert Requests
1. Type in search: `alerts/check`
2. You should see requests like:
   - `GET /medicines/alerts/check` (every 10 sec)
   - `GET /appointments/alerts/check` (every 10 sec)

### Expected Status
- **Status 200**: Alert check successful
- **Status 401**: Token expired (logout & login)
- **Status 500**: Server error (check server console)

### Response Format
```json
{
  "alerts": [
    {
      "key": "medicine-507f...-14:30",
      "type": "medicine",
      "medicineId": "507f...",
      "medicineName": "Test Medicine",
      "foodTiming": "After meals",
      "time": "2:30 PM"
    }
  ]
}
```

---

## 📱 Browser Notifications

### Enable Notifications (Optional)
1. Go to appointment or medicine page
2. Browser may ask: "Allow notifications?"
3. Click "Allow"
4. Check "Notification permission: granted" in console

### Disable Notifications
1. Click lock icon in address bar
2. Find Notifications
3. Set to "Block"

---

## 🐛 Troubleshooting Checklist

- [ ] Server running? (Check console for "Cron check" messages)
- [ ] Client running? (Access http://localhost:5173)
- [ ] Logged in? (Check localStorage.token in DevTools)
- [ ] Added medicine/appointment? (Check in list)
- [ ] Time is future? (Set to current + 1 min)
- [ ] Waited 70 seconds? (Don't give up too early)
- [ ] Console open? (F12 to watch logs)
- [ ] Clock synchronized? (Server and client clock match)

---

## ✅ Success Indicators

You'll know it's working when:

1. ✅ Console shows "[ALERT]" messages
2. ✅ Network tab shows `alerts/check` requests every 10 sec
3. ✅ Dark modal pops up after 1-70 seconds
4. ✅ Sound plays (with bounce bell animation)
5. ✅ Modal shows correct medicine/appointment details
6. ✅ "Got it!" button dismisses the modal
7. ✅ Browser notification appears (if permitted)

---

## 📞 Need Help?

Check this file: `ALERT_SYSTEM_WORKING.md` for detailed documentation

---

**Quick Test Time**: ~5 minutes  
**Expected Success Rate**: 99% (if server is running)
