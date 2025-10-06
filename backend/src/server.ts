import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import matchRoutes from './routes/matches';
import playerRoutes from './routes/players';
import teamRoutes from './routes/teams';
import newsRoutes from './routes/news';
import seriesRoutes from './routes/series';
import rankingsRoutes from './routes/rankings';
import venueRoutes from './routes/venues';
import photoRoutes from './routes/photos';

// Load environment variables from the correct path
dotenv.config({ path: __dirname + '/../.env' });

const app = express();

// CORS configuration - allow frontend domains
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://crick-buddy-frontend-v.vercel.app',
  'https://crick-buddy-frontend-v-git-main-meets-projects-e0e0e0e0.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(allowed => origin.startsWith(allowed as string))) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins for now, restrict later if needed
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '2mb' }));

// Log environment variables for debugging (only in development)
if (process.env.NODE_ENV !== 'production') {
  console.log('RAPIDAPI_KEY:', process.env.RAPIDAPI_KEY ? 'SET' : 'NOT SET');
  console.log('RAPIDAPI_HOST:', process.env.RAPIDAPI_HOST ? 'SET' : 'NOT SET');
  console.log('MONGO_URI:', process.env.MONGO_URI ? 'SET' : 'NOT SET');
}

// Connect to MongoDB with error handling
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  // Don't exit in serverless environment
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Cricket backend (TypeScript) is running' });
});

app.use('/api/matches', matchRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/series', seriesRoutes);
app.use('/api/rankings', rankingsRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/photos', photoRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    message: 'Internal server error', 
    error: process.env.NODE_ENV === 'production' ? 'An error occurred' : err?.message 
  });
});

const PORT = process.env.PORT || 5000;

// For Vercel serverless, export the app
export default app;

// For local development, start the server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
  });
}