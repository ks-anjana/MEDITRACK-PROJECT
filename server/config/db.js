const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Mongoose configuration
    mongoose.set('strictQuery', false);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`✅ Database Name: ${conn.connection.name}`);
    
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('💡 Make sure MongoDB is running: net start MongoDB');
    console.error('💡 Or run: mongod --dbpath="C:\\data\\db"');
    process.exit(1);
  }

  // Handle MongoDB connection events
  mongoose.connection.on('error', (err) => {
    console.error(`❌ MongoDB Error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB Disconnected');
  });
};

module.exports = connectDB;
