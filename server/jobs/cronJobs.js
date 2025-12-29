const cron = require('node-cron');
const Medicine = require('../models/Medicine');
const Appointment = require('../models/Appointment');

// Store active appointments for the day to track alerts
let appointmentAlertsToday = new Set();

// Initialize appointment alerts for the day
const initializeDailyAppointments = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get all appointments for today
    const todayAppointments = await Appointment.find({
      appointmentDate: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    // Clear previous alerts
    appointmentAlertsToday.clear();

    // Add today's appointments to tracking set
    todayAppointments.forEach((apt) => {
      appointmentAlertsToday.add(apt._id.toString());
    });

    console.log(`Initialized ${todayAppointments.length} appointments for today`);
  } catch (error) {
    console.error('Error initializing daily appointments:', error.message);
  }
};

// Start cron jobs
const startJobs = () => {
  // Initialize appointments at midnight
  cron.schedule('0 0 * * *', initializeDailyAppointments);

  // Check medicine schedules every minute
  cron.schedule('* * * * *', checkMedicineSchedules);

  // Check appointment previous day alerts at 6 PM (18:00)
  cron.schedule('0 18 * * *', checkPreviousDayAppointments);

  // Check appointment day alerts every minute
  cron.schedule('* * * * *', checkAppointmentDayAlerts);

  console.log('Cron jobs started successfully');
};

// Function to check medicine schedules
const checkMedicineSchedules = async () => {
  try {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;
    const period = now.getHours() >= 12 ? 'PM' : 'AM';

    // Get all medicines for the current time
    const medicines = await Medicine.find({
      time: currentTime,
      period: period,
    }).populate('userId', 'email');

    // Send notifications
    medicines.forEach((medicine) => {
      if (medicine.userId) {
        const message = `Time to take ${medicine.medicineName} - ${medicine.foodTiming}`;
        console.log(`[Medicine Alert] ${message} for user ${medicine.userId.email}`);

        // In production, you would send this to frontend via WebSocket or store in DB for later retrieval
        // For now, we log it
      }
    });
  } catch (error) {
    console.error('Error checking medicine schedules:', error.message);
  }
};

// Function to check previous day appointment alerts
const checkPreviousDayAppointments = async () => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const nextDay = new Date(tomorrow);
    nextDay.setDate(nextDay.getDate() + 1);

    // Get appointments for tomorrow that haven't been alerted yet
    const tomorrowAppointments = await Appointment.find({
      appointmentDate: {
        $gte: tomorrow,
        $lt: nextDay,
      },
      previousDayAlertSent: false,
    }).populate('userId', 'email');

    // Send notifications and mark as alerted
    for (const appointment of tomorrowAppointments) {
      const message = `Reminder: You have an appointment with Dr. ${appointment.doctorName} tomorrow at ${appointment.appointmentTime}`;
      console.log(
        `[Appointment Reminder - Day Before] ${message} for user ${appointment.userId.email}`
      );

      // Mark as alerted
      await Appointment.findByIdAndUpdate(appointment._id, {
        previousDayAlertSent: true,
      });
    }
  } catch (error) {
    console.error('Error checking previous day appointments:', error.message);
  }
};

// Function to check appointment day alerts
const checkAppointmentDayAlerts = async () => {
  try {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get all appointments for today
    const todayAppointments = await Appointment.find({
      appointmentDate: {
        $gte: today,
        $lt: tomorrow,
      },
      appointmentTime: currentTime,
      alertSent: false,
    }).populate('userId', 'email');

    // Send notifications and mark as alerted
    for (const appointment of todayAppointments) {
      const message = `It's time for your appointment with Dr. ${appointment.doctorName}`;
      console.log(
        `[Appointment Alert - Now] ${message} for user ${appointment.userId.email}`
      );

      // Mark as alerted
      await Appointment.findByIdAndUpdate(appointment._id, {
        alertSent: true,
      });
    }
  } catch (error) {
    console.error('Error checking appointment day alerts:', error.message);
  }
};

module.exports = {
  startJobs,
};
