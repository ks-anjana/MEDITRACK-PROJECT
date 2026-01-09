const cron = require('node-cron');
const Medicine = require('../models/Medicine');
const Appointment = require('../models/Appointment');

// Global alerts storage
let medicineAlerts = [];
let appointmentAlerts = [];

// Helper: Convert 12-hour format with AM/PM to 24-hour format HH:MM
const convertTo24Hour = (timeStr) => {
  try {
    const timeParts = timeStr.trim().split(' ');
    if (timeParts.length !== 2) {
      console.error('Invalid time format:', timeStr);
      return null;
    }

    const [time, period] = timeParts;
    const [hoursStr, minutesStr] = time.split(':');
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    if (isNaN(hours) || isNaN(minutes)) {
      console.error('Invalid time components:', timeStr);
      return null;
    }

    // Convert to 24-hour format
    if (period.toUpperCase() === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period.toUpperCase() === 'AM' && hours === 12) {
      hours = 0;
    }

    const result = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    return result;
  } catch (error) {
    console.error('Error converting time:', timeStr, error);
    return null;
  }
};

// Helper: Get current time in HH:MM format (24-hour)
const getCurrentTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Helper: Get current date in YYYY-MM-DD format
const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0];
};

// Start cron jobs
const startCronJobs = () => {
  console.log('🕐 Starting cron jobs...');
  
  // Run every minute to check medicine and appointment reminders
  cron.schedule('* * * * *', async () => {
    const currentTime = getCurrentTime();
    const currentDate = getCurrentDate();
    
    console.log(`⏰ Cron check at ${currentDate} ${currentTime}`);
    
    try {
      // Check medicine reminders
      await checkMedicineReminders(currentTime);
      
      // Check appointment reminders
      await checkAppointmentReminders(currentTime, currentDate);
    } catch (error) {
      console.error('❌ Error in cron job:', error.message);
    }
  });

  console.log('✅ Cron jobs started successfully');
  console.log('   - Medicine reminders check: Every minute');
  console.log('   - Appointment reminders check: Every minute');
};

// Check medicine reminders
const checkMedicineReminders = async (currentTime) => {
  try {
    const medicines = await Medicine.find().populate('userId', 'name email');
    
    let matchCount = 0;
    
    for (const medicine of medicines) {
      // Convert stored time (12-hour with AM/PM) to 24-hour format
      const medicine24HourTime = convertTo24Hour(medicine.time);
      
      if (!medicine24HourTime) {
        console.error(`Invalid time format for medicine: ${medicine.medicineName} - ${medicine.time}`);
        continue;
      }

      // Match the time (both are now in HH:MM 24-hour format)
      if (medicine24HourTime === currentTime) {
        const alertKey = `${medicine._id.toString()}-${currentTime}`;
        const exists = medicineAlerts.find(a => a.key === alertKey);
        
        if (!exists) {
          matchCount++;
          
          const alert = {
            key: alertKey,
            type: 'medicine',
            medicineId: medicine._id.toString(),
            userId: medicine.userId._id.toString(),
            userName: medicine.userId.name,
            medicineName: medicine.medicineName,
            foodTiming: medicine.foodTiming,
            time: medicine.time, // Keep original format for display
            timestamp: new Date()
          };
          
          medicineAlerts.push(alert);
          
          console.log(`💊 MEDICINE REMINDER TRIGGERED:`);
          console.log(`   📋 Medicine: ${medicine.medicineName}`);
          console.log(`   👤 User: ${medicine.userId.name} (${medicine.userId.email})`);
          console.log(`   ⏰ Time: ${medicine.time} (${medicine24HourTime})`);
          console.log(`   🍽️  Food Timing: ${medicine.foodTiming}`);
        }
      }
    }
    
    if (matchCount > 0) {
      console.log(`✅ ${matchCount} medicine reminder(s) triggered`);
    }
    
    // Clean old alerts (older than 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    medicineAlerts = medicineAlerts.filter(a => a.timestamp > fiveMinutesAgo);
    
  } catch (error) {
    console.error('❌ Error checking medicine reminders:', error.message);
  }
};

// Check appointment reminders
const checkAppointmentReminders = async (currentTime, currentDate) => {
  try {
    const appointments = await Appointment.find().populate('userId', 'name email');
    
    let matchCount = 0;
    
    for (const appointment of appointments) {
      // Convert stored time (12-hour with AM/PM) to 24-hour format
      const appointment24HourTime = convertTo24Hour(appointment.appointmentTime);
      
      if (!appointment24HourTime) {
        console.error(`Invalid time format for appointment: ${appointment.doctorName} - ${appointment.appointmentTime}`);
        continue;
      }

      // Match both date and time
      if (appointment.appointmentDate === currentDate && 
          appointment24HourTime === currentTime) {
        const alertKey = `${appointment._id.toString()}-${currentTime}`;
        const exists = appointmentAlerts.find(a => a.key === alertKey);
        
        if (!exists) {
          matchCount++;
          
          const alert = {
            key: alertKey,
            type: 'appointment',
            appointmentId: appointment._id.toString(),
            userId: appointment.userId._id.toString(),
            userName: appointment.userId.name,
            doctorName: appointment.doctorName,
            hospitalName: appointment.hospitalName,
            time: appointment.appointmentTime, // Keep original format for display
            date: currentDate,
            timestamp: new Date()
          };
          
          appointmentAlerts.push(alert);
          
          console.log(`📅 APPOINTMENT REMINDER TRIGGERED:`);
          console.log(`   🏥 Hospital: ${appointment.hospitalName}`);
          console.log(`   👨‍⚕️  Doctor: ${appointment.doctorName}`);
          console.log(`   👤 User: ${appointment.userId.name} (${appointment.userId.email})`);
          console.log(`   📆 Date: ${currentDate}`);
          console.log(`   ⏰ Time: ${appointment.appointmentTime} (${appointment24HourTime})`);
        }
      }
    }
    
    if (matchCount > 0) {
      console.log(`✅ ${matchCount} appointment reminder(s) triggered`);
    }
    
    // Clean old alerts (older than 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    appointmentAlerts = appointmentAlerts.filter(a => a.timestamp > fiveMinutesAgo);
    
  } catch (error) {
    console.error('❌ Error checking appointment reminders:', error.message);
  }
};

// Get medicine alerts for a user
const getMedicineAlerts = (userId) => {
  return medicineAlerts.filter(alert => alert.userId === userId);
};

// Get appointment alerts for a user
const getAppointmentAlerts = (userId) => {
  return appointmentAlerts.filter(alert => alert.userId === userId);
};

// Clear alerts for a user
const clearUserAlerts = (userId) => {
  medicineAlerts = medicineAlerts.filter(alert => alert.userId !== userId);
  appointmentAlerts = appointmentAlerts.filter(alert => alert.userId !== userId);
};

module.exports = { 
  startCronJobs, 
  getMedicineAlerts, 
  getAppointmentAlerts,
  clearUserAlerts 
};
