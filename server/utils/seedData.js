const User = require("../models/User");
const HealthTip = require("../models/HealthTip");

/**
 * Default Health Tips
 */
const defaultHealthTips = [
  {
    title: "Drink Enough Water",
    content:
      "Drinking enough water daily helps maintain energy, digestion, and healthy skin.",
  },
  {
    title: "Exercise Regularly",
    content:
      "Aim for at least 30 minutes of movement most days to support heart and muscle health.",
  },
  {
    title: "Get Enough Sleep",
    content:
      "Quality sleep (7–8 hours) improves focus, mood, and immune function.",
  },
  {
    title: "Eat a Balanced Diet",
    content:
      "Combine fruits, vegetables, lean proteins, and whole grains for steady energy and immunity.",
  },
  {
    title: "Manage Stress",
    content:
      "Use deep breathing, short walks, or hobbies to lower stress and protect long-term health.",
  },
];

/**
 * Ensure default health tips exist
 */
const ensureDefaultHealthTips = async (adminId) => {
  try {
    const tipsCount = await HealthTip.countDocuments();

    if (tipsCount === 0) {
      console.log("📝 Creating default health tips...");

      await HealthTip.insertMany(
        defaultHealthTips.map((tip) => ({
          ...tip,
          createdBy: adminId,
          isDefault: true,
          isPublished: false,
          sentToUsers: false,
          isAdmin: true,
          likedBy: [],
        }))
      );

      console.log("✅ Default health tips created successfully");
    } else {
      console.log(`✅ Health tips already exist (${tipsCount} tips)`);
    }
  } catch (error) {
    console.error("❌ Error creating default health tips:", error.message);
  }
};

/**
 * Seed default admin + health tips
 */
const seedDefaultData = async () => {
  try {
    let adminUser = await User.findOne({ email: "admin@meditrack.com" });

    if (!adminUser) {
      adminUser = await User.create({
        name: "Admin",
        email: "admin@meditrack.com",
        password: "Admin123", // should be hashed by pre-save hook
        role: "admin",
      });

      console.log("✅ Default admin created");
      console.log("📧 Email: admin@meditrack.com");
      console.log("🔑 Password: Admin123");
    } else {
      console.log("✅ Admin user already exists");
    }

    await ensureDefaultHealthTips(adminUser._id);
  } catch (error) {
    console.error("❌ Error seeding default data:", error.message);
  }
};

module.exports = { seedDefaultData };
