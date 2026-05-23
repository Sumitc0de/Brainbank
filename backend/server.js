import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import ideaRoutes from './routes/ideaRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/ideas', ideaRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'FounderOS API is running', version: '1.0.0' });
});

// MongoDB Connection Helper
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
    throw err;
  }
};

// Start server locally or initialize on Vercel
if (!process.env.VERCEL) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 FounderOS backend running on port ${PORT}`);
    });
  });
} else {
  // On Vercel, start the connection immediately (runs once when container boots)
  connectDB().catch((err) => console.error('MongoDB Atlas pre-connect failed:', err.message));
}

export default app;

