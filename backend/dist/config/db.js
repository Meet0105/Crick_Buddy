"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Cache the connection for serverless
let cachedConnection = null;
const connectDB = async () => {
    // If we have a cached connection and it's ready, return it
    if (cachedConnection && mongoose_1.default.connection.readyState === 1) {
        console.log('✅ Using cached MongoDB connection');
        return cachedConnection;
    }
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cricbuzz_ts';
    try {
        // Set mongoose options for better serverless performance
        mongoose_1.default.set('strictQuery', false);
        const connection = await mongoose_1.default.connect(uri, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        });
        console.log('✅ MongoDB Connected');
        cachedConnection = connection;
        return connection;
    }
    catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        // In production/serverless, don't exit - just throw the error
        if (process.env.NODE_ENV === 'production') {
            throw error;
        }
        process.exit(1);
    }
};
exports.default = connectDB;
