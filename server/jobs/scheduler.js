const cron = require('node-cron');
const Medicine = require('../models/Medicine');
const Appointment = require('../models/Appointment');

// Helper function to get current time in HH:MM format
const getCurrentTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Helper function to get current date (YYYY-MM-DD)
const getCurrentDate = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

// Check medicine reminders every minute
const checkMedicineReminders = cron.schedule('* * * * *', async () => {
  try {
    const currentTime = getCurrentTime();
    
    // Find medicines that match current time
    const medicines = await Medicine.find({ time: currentTime }).populate('userId', 'name email');
    
    if (medicines.length > 0) {
      console.log(`Found ${medicines.length} medicine reminders for ${currentTime}`);
      
      // TODO: Integrate with Firebase Cloud Messaging or Socket.io
      medicines.forEach(medicine => {
        console.log(`Medicine Reminder: ${medicine.medicineName} for user ${medicine.userId.name}`);
        console.log(`Period: ${medicine.period}, Food Timing: ${medicine.foodTiming}`);
        
        // Placeholder for notification trigger
        // sendNotification(medicine.userId._id, {
        //   title: 'Medicine Reminder',
        //   body: `Time to take ${medicine.medicineName} - ${medicine.foodTiming}`,
        //   data: { type: 'medicine', medicineId: medicine._id }
        // });
      });
    }
  } catch (error) {
    console.error('Error checking medicine reminders:', error.message);
  }
});

// Check appointment reminders every hour
const checkAppointmentReminders = cron.schedule('0 * * * *', async () => {
  try {
    const now = new Date();
    const currentDate = getCurrentDate();
    const currentTime = getCurrentTime();
    
    // Find appointments for today
    const appointments = await Appointment.find({
      appointmentDate: {
        $gte: new Date(currentDate),
        $lt: new Date(new Date(currentDate).setDate(new Date(currentDate).getDate() + 1))
      }
    }).populate('userId', 'name email');
    
    if (appointments.length > 0) {
      console.log(`Found ${appointments.length} appointments for today`);
      
      appointments.forEach(appointment => {
        const appointmentTime = appointment.appointmentTime;
        
        // Check if appointment is within next hour
        const [appHour, appMinute] = appointmentTime.split(':').map(Number);
        const [currHour, currMinute] = currentTime.split(':').map(Number);
        
        const timeDiff = (appHour * 60 + appMinute) - (currHour * 60 + currMinute);
        
        if (timeDiff > 0 && timeDiff <= 60) {
          console.log(`Appointment Reminder: ${appointment.doctorName} at ${appointment.hospitalName}`);
          console.log(`User: ${appointment.userId.name}, Time: ${appointmentTime}`);
          
          // Placeholder for notification trigger
          // sendNotification(appointment.userId._id, {
          //   title: 'Appointment Reminder',
          //   body: `Appointment with Dr. ${appointment.doctorName} at ${appointment.hospitalName} in ${timeDiff} minutes`,
          //   data: { type: 'appointment', appointmentId: appointment._id }
          // });
        }
      });
    }
  } catch (error) {
    console.error('Error checking appointment reminders:', error.message);
  }
});

// Start all scheduled jobs
const startScheduler = () => {
  console.log('Starting cron scheduler...');
  checkMedicineReminders.start();
  checkAppointmentReminders.start();
  console.log('Medicine reminder check: Every minute');
  console.log('Appointment reminder check: Every hour');
};

// Stop all scheduled jobs
const stopScheduler = () => {
  console.log('Stopping cron scheduler...');
  checkMedicineReminders.stop();
  checkAppointmentReminders.stop();
};

module.exports = { startScheduler, stopScheduler };
