# Cricket Application

A full-stack cricket information application built with Next.js (frontend) and Express.js (backend).

## Features
- Live match tracking
- Player statistics
- Team information
- News updates
- Series information

## Tech Stack
- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Express.js, MongoDB/Mongoose
- **API**: Cricbuzz API via RapidAPI

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cric-app.git
   cd cric-app
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd ../backend
   npm install
   ```

4. Create a `.env` file in the backend directory with your MongoDB connection string and API keys:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   RAPIDAPI_KEY=your_rapidapi_key
   ```

5. Create a `.env.local` file in the frontend directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect Vercel to your GitHub repository
3. Set environment variables in Vercel dashboard

### Backend (Heroku or similar)
1. Deploy the backend separately to a Node.js hosting service
2. Update the frontend environment variables to point to your deployed backend

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License
This project is licensed under the MIT License.