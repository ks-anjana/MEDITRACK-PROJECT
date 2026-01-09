const User = require('../models/User');
const HealthTip = require('../models/HealthTip');

const defaultHealthTips = [
  {
    title: 'Drink Enough Water',
    content: 'Drinking enough water daily helps maintain energy, digestion, and healthy skin.'
  },
  {
    title: 'Exercise Regularly',
    content: 'Aim for at least 30 minutes of movement most days to support heart and muscle health.'
  },
  {
    title: 'Get Enough Sleep',
    content: 'Quality sleep (7-8 hours) improves focus, mood, and immune function.'
  },
  {
    title: 'Eat a Balanced Diet',
    content: 'Combine fruits, vegetables, lean proteins, and whole grains for steady energy and immunity.'
  },
  {
    title: 'Manage Stress',
    content: 'Use deep breathing, short walks, or hobbies to lower stress and protect long-term health.'
  }
];

const ensureDefaultHealthTips = async (adminId) => {
  try {
    // Check if any health tips exist in database
    const tipsCount = await HealthTip.countDocuments();

    // Only create default tips if collection is empty
    if (tipsCount === 0) {
      console.log('📝 Creating 5 default health tips...');
      
      // Create all 5 default tips at once
      await HealthTip.insertMany(
        defaultHealthTips.map((tip) => ({
          ...tip,
          createdBy: adminId,
          isDefault: true,
          isPublished: false,
          sentToUsers: false,
          isAdmin: true,
          likedBy: []
        }))
      );

      console.log('✅ Default health tips created successfully');
    } else {
      console.log(`✅ Health tips already exist in database (${tipsCount} tips)`);
    }
  } catch (error) {
    console.error('❌ Error ensuring default health tips:', error.message);
  }
};

const seedDefaultData = async () => {
  try {
    // Check if admin exists
    let adminUser = await User.findOne({ email: 'admin@meditrack.com' });
    
    if (!adminUser) {
      // Create default admin
      adminUser = await User.create({
        name: 'Admin',
        email: 'admin@meditrack.com',
        password: 'Admin123',
        role: 'admin'
      });
      
      console.log('✅ Default admin created successfully');
      console.log('   📧 Email: admin@meditrack.com');
      console.log('   🔑 Password: Admin123');
      console.log('   👤 Role: admin');
    } else {
      console.log('✅ Admin user already exists');
    }

    // Ensure exactly 5 default health tips exist (if collection is empty)
    await ensureDefaultHealthTips(adminUser._id);
  } catch (error) {
    console.error('❌ Error seeding default data:', error.message);
  }
};

module.exports = { seedDefaultData };
