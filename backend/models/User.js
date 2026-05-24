import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      default: '',
    },
    // Role-based access preparation
    role: {
      type: String,
      enum: ['user', 'admin', 'premium'],
      default: 'user',
    },
    // Token version — increment to invalidate all issued tokens for this user
    tokenVersion: {
      type: Number,
      default: 0,
    },
    // Hash of the current valid refresh token (for server-side validation)
    refreshTokenHash: {
      type: String,
      default: null,
    },
    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
export default User;
