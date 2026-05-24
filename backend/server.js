import 'dotenv/config';

// ── Validate environment before anything else ───────────────
import { validateEnv } from './config/env.js';
validateEnv();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import ideaRoutes from './routes/ideaRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import authRoutes from './routes/authRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';
import requestLogger from './middleware/requestLogger.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ── Mongoose strict mode ────────────────────────────────────
mongoose.set('bufferCommands', false);
mongoose.set('strictQuery', true);

// ═════════════════════════════════════════════════════════════
//  SECURITY MIDDLEWARE
// ═════════════════════════════════════════════════════════════

// 1. Helmet — secure HTTP headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com', 'https://lh3.googleusercontent.com', 'https://images.unsplash.com'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
    },
  },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// 2. CORS — restricted origins with credentials
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
];

// Add production origins from env
if (process.env.ALLOWED_ORIGINS) {
  process.env.ALLOWED_ORIGINS.split(',').forEach((origin) => {
    const trimmed = origin.trim();
    if (trimmed) allowedOrigins.push(trimmed);
  });
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile, Postman, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed.`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
}));

// 3. Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

// 4. Cookie parser
app.use(cookieParser());

// 5. HPP — HTTP parameter pollution protection
app.use(hpp());

// 6. Compression
app.use(compression());

// 7. Request logging
app.use(requestLogger);

// ═════════════════════════════════════════════════════════════
//  HEALTH CHECK
// ═════════════════════════════════════════════════════════════
app.get('/', (req, res) => {
  res.json({ status: 'BrainBank API is running', version: '2.0.0' });
});

// ═════════════════════════════════════════════════════════════
//  DATABASE CONNECTION
// ═════════════════════════════════════════════════════════════
let isConnected = false;
let connectionPromise = null;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) return;

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured.');
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
  }

  try {
    const db = await connectionPromise;
    isConnected = db.connections[0].readyState === 1;
    if (isConnected) console.log('✓ Connected to MongoDB');
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
      error: 'Database unavailable. Please try again later.',
      code: 'DB_UNAVAILABLE',
    });
  }
};

// ═════════════════════════════════════════════════════════════
//  ROUTES
// ═════════════════════════════════════════════════════════════
app.use('/api/auth', requireDB, authRoutes);
app.use('/ideas', requireDB, authMiddleware, ideaRoutes);
app.use('/api/upload', requireDB, authMiddleware, uploadRoutes);

// ═════════════════════════════════════════════════════════════
//  ERROR HANDLING
// ═════════════════════════════════════════════════════════════
app.use(errorHandler);

// ═════════════════════════════════════════════════════════════
//  START
// ═════════════════════════════════════════════════════════════
const startServer = async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error('MongoDB startup connection failed:', err.message);
    console.log('Server will start, routes will retry database connection per request.');
  }

  const server = app.listen(PORT, () => {
    console.log(`\n🚀 BrainBank backend running on port ${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   CORS origins: ${allowedOrigins.join(', ')}\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use.`);
      process.exit(1);
    }
    console.error('Server failed:', err);
    process.exit(1);
  });
};

if (!process.env.VERCEL) {
  startServer();
} else {
  connectDB().catch((err) => console.error('MongoDB pre-connect failed:', err.message));
}

export default app;
