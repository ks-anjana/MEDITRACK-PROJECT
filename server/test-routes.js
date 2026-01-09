const fs = require('fs');
const path = require('path');

console.log('\n📋 MediTrack Backend Route Verification\n');

const requiredRoutes = [
  { file: './routes/authRoutes.js', name: 'Auth Routes' },
  { file: './routes/medicines.js', name: 'Medicine Routes' },
  { file: './routes/appointments.js', name: 'Appointment Routes' },
  { file: './routes/prescriptions.js', name: 'Prescription Routes' },
  { file: './routes/healthTips.js', name: 'Health Tips Routes' },
  { file: './routes/advertisements.js', name: 'Advertisement Routes' },
  { file: './routes/feedback.js', name: 'Feedback Routes' },
  { file: './routes/users.js', name: 'User Routes' }
];

const requiredControllers = [
  { file: './controllers/authController.js', name: 'Auth Controller' },
  { file: './controllers/medicineController.js', name: 'Medicine Controller' },
  { file: './controllers/appointmentController.js', name: 'Appointment Controller' },
  { file: './controllers/prescriptionController.js', name: 'Prescription Controller' },
  { file: './controllers/healthTipController.js', name: 'Health Tip Controller' },
  { file: './controllers/advertisementController.js', name: 'Advertisement Controller' },
  { file: './controllers/feedbackController.js', name: 'Feedback Controller' },
  { file: './controllers/userController.js', name: 'User Controller' }
];

const requiredModels = [
  { file: './models/User.js', name: 'User Model' },
  { file: './models/Medicine.js', name: 'Medicine Model' },
  { file: './models/Appointment.js', name: 'Appointment Model' },
  { file: './models/Prescription.js', name: 'Prescription Model' },
  { file: './models/HealthTip.js', name: 'Health Tip Model' },
  { file: './models/Advertisement.js', name: 'Advertisement Model' },
  { file: './models/Feedback.js', name: 'Feedback Model' }
];

console.log('🔍 Checking Routes:\n');
requiredRoutes.forEach(route => {
  const filePath = path.join(__dirname, route.file);
  const exists = fs.existsSync(filePath);
  console.log(`${exists ? '✅' : '❌'} ${route.name}: ${route.file}`);
});

console.log('\n🔍 Checking Controllers:\n');
requiredControllers.forEach(controller => {
  const filePath = path.join(__dirname, controller.file);
  const exists = fs.existsSync(filePath);
  console.log(`${exists ? '✅' : '❌'} ${controller.name}: ${controller.file}`);
});

console.log('\n🔍 Checking Models:\n');
requiredModels.forEach(model => {
  const filePath = path.join(__dirname, model.file);
  const exists = fs.existsSync(filePath);
  console.log(`${exists ? '✅' : '❌'} ${model.name}: ${model.file}`);
});

console.log('\n✅ Verification complete\n');
