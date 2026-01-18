const cron = require('node-cron');
const Medicine = require('../models/Medicine');

/**
 * =========================================================
 * MEDICINE REMINDER CRON JOB
 * =========================================================
 * ✔ Runs every minute
 * ✔ Safe in production
 * ✔ No timezone issue (display-only reminder)
 * ✔ Does NOT affect appointments
 *
 * NOTE:
 * Appointment alerts MUST NOT use cron.
 * Appointments are handled via API polling:
 *   GET /api/appointments/alerts/check
 * =========================================================
 */

// Helper: get current time in HH:MM format
const getCurrentTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Medicine reminder checker
const checkMedicineSchedules = async () => {
  try {
    const now = new Date();
    const currentTime = getCurrentTime();
    const period = now.getHours() >= 12 ? 'PM' : 'AM';

    const medicines = await Medicine.find({
      time: currentTime,
      period: period,
    }).populate('userId', 'email');

    if (medicines.length > 0) {
      console.log(
        `💊 Medicine reminders found: ${medicines.length} at ${currentTime} ${period}`
      );
    }

    medicines.forEach((medicine) => {
      if (!medicine.userId) return;

      console.log(
        `[MEDICINE ALERT] ${medicine.medicineName} (${medicine.foodTiming}) → ${medicine.userId.email}`
      );

      /**
       * 🔔 FUTURE IMPROVEMENTS
       * - Save notification to DB
       * - Send via Firebase Cloud Messaging
       * - Send via Socket.io
       */
    });
  } catch (error) {
    console.error('❌ Medicine cron error:', error.message);
  }
};

/**
 * =========================================================
 * START CRON JOBS
 * =========================================================
 */
const startJobs = () => {
  // Every minute medicine reminder
  cron.schedule('* * * * *', checkMedicineSchedules);

  console.log('✅ Cron jobs started');
  console.log('💊 Medicine reminder: every minute');
};

module.exports = {
  startJobs,
};
