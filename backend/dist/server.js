"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const matches_1 = __importDefault(require("./routes/matches"));
const players_1 = __importDefault(require("./routes/players"));
const teams_1 = __importDefault(require("./routes/teams"));
const news_1 = __importDefault(require("./routes/news"));
const series_1 = __importDefault(require("./routes/series"));
const rankings_1 = __importDefault(require("./routes/rankings"));
const venues_1 = __importDefault(require("./routes/venues"));
const photos_1 = __importDefault(require("./routes/photos"));
// Load environment variables from the correct path
dotenv_1.default.config({ path: __dirname + '/../.env' });
const app = (0, express_1.default)();
// CORS configuration - allow frontend domains
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://crick-buddy-frontend-v.vercel.app',
    'https://crick-buddy-frontend-v-git-main-meets-projects-e0e0e0e0.vercel.app',
    process.env.FRONTEND_URL
].filter(Boolean);
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
            callback(null, true);
        }
        else {
            callback(null, true); // Allow all origins for now, restrict later if needed
        }
    },
    credentials: true
}));
app.use(express_1.default.json({ limit: '2mb' }));
// Log environment variables for debugging (only in development)
if (process.env.NODE_ENV !== 'production') {
    console.log('RAPIDAPI_KEY:', process.env.RAPIDAPI_KEY ? 'SET' : 'NOT SET');
    console.log('RAPIDAPI_HOST:', process.env.RAPIDAPI_HOST ? 'SET' : 'NOT SET');
    console.log('MONGO_URI:', process.env.MONGO_URI ? 'SET' : 'NOT SET');
}
// Connect to MongoDB with error handling
(0, db_1.default)().catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    // Don't exit in serverless environment
    if (process.env.NODE_ENV !== 'production') {
        process.exit(1);
    }
});
app.get('/', (req, res) => {
    res.json({ message: 'Cricket backend (TypeScript) is running' });
});
// Debug endpoint to check environment variables
app.get('/api/debug/env', (req, res) => {
    res.json({
        RAPIDAPI_KEY: process.env.RAPIDAPI_KEY ? 'SET (length: ' + process.env.RAPIDAPI_KEY.length + ')' : 'NOT SET',
        RAPIDAPI_HOST: process.env.RAPIDAPI_HOST ? 'SET' : 'NOT SET',
        RAPIDAPI_MATCHES_LIVE_URL: process.env.RAPIDAPI_MATCHES_LIVE_URL ? 'SET' : 'NOT SET',
        RAPIDAPI_MATCHES_INFO_URL: process.env.RAPIDAPI_MATCHES_INFO_URL ? 'SET' : 'NOT SET',
        MONGO_URI: process.env.MONGO_URI ? 'SET' : 'NOT SET',
        NODE_ENV: process.env.NODE_ENV || 'NOT SET',
        timestamp: new Date().toISOString()
    });
});
app.use('/api/matches', matches_1.default);
app.use('/api/players', players_1.default);
app.use('/api/teams', teams_1.default);
app.use('/api/news', news_1.default);
app.use('/api/series', series_1.default);
app.use('/api/rankings', rankings_1.default);
app.use('/api/venues', venues_1.default);
app.use('/api/photos', photos_1.default);
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'production' ? 'An error occurred' : err === null || err === void 0 ? void 0 : err.message
    });
});
const PORT = process.env.PORT || 5000;
// For Vercel serverless, export the app
exports.default = app;
// For local development, start the server
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Server listening on port ${PORT}`);
    });
}
