# FCM Quick Start (5 Minutes)

## What's Done ✅
- Firebase Cloud Messaging fully integrated
- Service Worker ready for background notifications
- Auto-registration hook on login
- Cron jobs wired to send FCM pushes
- Permission asked only once
- No UI changes, no existing logic modified

## What You Need to Do

### Step 1: Get Keys from Firebase (2 min)

**VAPID Key (Client):**
1. Open https://console.firebase.google.com/
2. Select project "meditrack-51fcc"
3. Settings → Cloud Messaging
4. Copy the **Public key** from "Web Push certificates"

**Server Key (Backend):**
1. Settings → Cloud Messaging
2. Copy the **Server Key** field

### Step 2: Set Environment Variables (1 min)

**File: `client/.env.local`**
```
VITE_FIREBASE_VAPID_KEY=<paste-public-key-here>
```

**File: `server/.env`**
```
FCM_SERVER_KEY=<paste-server-key-here>
```

### Step 3: Restart Servers (2 min)

```bash
# Terminal 1
cd client
npm run dev

# Terminal 2
cd server
npm run dev
```

## Done! 🎉

Now when you:
1. Login → FCM token auto-registered
2. Create medicine/appointment at current time
3. Wait for the minute → OS notification appears (even if tab closed!)

## Files to Check

✅ Client setup: `client/.env.local`
✅ Server setup: `server/.env`
✅ Service Worker: `client/public/firebase-messaging-sw.js` (auto-registered)
✅ FCM client: `client/src/services/fcm.js`
✅ FCM hook: `client/src/hooks/useFcmRegistration.js`
✅ Backend: `server/utils/cronJobs.js` (sends pushes)

## Troubleshooting

**"VITE_FIREBASE_VAPID_KEY is missing"**
→ Add it to `client/.env.local` and restart client

**"FCM_SERVER_KEY not configured"**
→ Add it to `server/.env` and restart server

**No notifications appear**
→ Check if:
  1. Permission was granted (should see popup on login)
  2. FCM keys are set correctly
  3. Medicine/appointment time is set to current minute
  4. Check server console for push send status

## Verify It Works

### In Browser Console:
```javascript
localStorage.getItem('meditrack_fcm_token')  // Should show token
Notification.permission  // Should show "granted"
```

### In Server Console:
After creating medicine/appointment, should see:
```
💊 MEDICINE REMINDER TRIGGERED:
✅ Push send status: 1 success / 0 failed
```

---
**Ready to test?** Login and create a medicine reminder! 🚀
