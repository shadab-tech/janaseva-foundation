const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Force using new URL parser and unified topology
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Log more details about the error
    if (error.name === 'MongoServerSelectionError') {
      console.error('Make sure MongoDB is running on your local machine');
    }
    process.exit(1);
  }
};

module.exports = connectDB;
