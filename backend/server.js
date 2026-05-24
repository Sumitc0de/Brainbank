import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import ideaRoutes from './routes/ideaRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import authRoutes from './routes/authRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.set('bufferCommands', false);

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'FounderOS API is running', version: '1.0.0' });
});

// MongoDB Connection Helper
let isConnected = false;
let connectionPromise = null;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) return;

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured. Add it to the backend environment variables.');
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
  }

  try {
    const db = await connectionPromise;
    isConnected = db.connections[0].readyState === 1;
    if (isConnected) console.log('Connected to MongoDB');
  } catch (err) {
    connectionPromise = null;
    isConnected = false;
    throw err;
  }
};

const requireDB = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    res.status(503).json({
      success: false,
      error: `Database unavailable: ${err.message}`,
    });
  }
};

// Routes
app.use('/api/auth', requireDB, authRoutes);
app.use('/ideas', requireDB, authMiddleware, ideaRoutes);
app.use('/api/upload', requireDB, authMiddleware, uploadRoutes);

app.use((err, req, res, next) => {
  if (!err) return next();

  const isUploadError = err.name === 'MulterError' || err.message?.startsWith('Invalid ');
  res.status(isUploadError ? 400 : 500).json({
    success: false,
    error: err.code === 'LIMIT_FILE_SIZE' ? 'File is too large.' : err.message,
  });
});

const startServer = async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error('MongoDB startup connection failed:', err.message);
    console.log('Server will start, and /ideas routes will retry the database connection per request.');
  }

  const server = app.listen(PORT, () => {
    console.log(`FounderOS backend running on port ${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Backend port ${PORT} is already in use. Stop the other server or set PORT to another value.`);
      process.exit(1);
    }

    console.error('Backend server failed:', err);
    process.exit(1);
  });
};

// Start server locally or initialize on Vercel
if (!process.env.VERCEL) {
  startServer();
} else {
  // On Vercel, start the connection immediately (runs once when container boots)
  connectDB().catch((err) => console.error('MongoDB Atlas pre-connect failed:', err.message));
}

export default app;
