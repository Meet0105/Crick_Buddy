import mongoose from 'mongoose';

// Cache the connection for serverless
let cachedConnection: typeof mongoose | null = null;

const connectDB = async (): Promise<typeof mongoose> => {
  // If we have a cached connection and it's ready, return it
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log('✅ Using cached MongoDB connection');
    return cachedConnection;
  }

  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cricbuzz_ts';
  
  try {
    // Set mongoose options for better serverless performance
    mongoose.set('strictQuery', false);
    
    const connection = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    
    console.log('✅ MongoDB Connected');
    cachedConnection = connection;
    return connection;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', (error as Error).message);
    
    // In production/serverless, don't exit - just throw the error
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
    
    process.exit(1);
  }
};

export default connectDB;
