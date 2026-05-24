import mongoose from 'mongoose';
import { getPlanConfig } from '../config/plans.config.js';

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
    role: {
      type: String,
      enum: ['user', 'admin', 'premium'],
      default: 'user',
    },
    // SaaS Plan & Quotas
    plan: {
      type: String,
      enum: ['free', 'pro', 'ultra'],
      default: 'free',
      index: true,
    },
    credits: {
      aiRequestsUsed: { type: Number, default: 0 },
      uploadCountUsed: { type: Number, default: 0 },
      uploadStorageUsed: { type: Number, default: 0 }, // in bytes
    },
    limits: {
      aiRequestsLimit: { type: Number, default: 10 },
      uploadLimit: { type: Number, default: 5 },
      storageLimitMB: { type: Number, default: 5 },
      activeIdeasLimit: { type: Number, default: 5 },
    },
    subscription: {
      status: { type: String, default: 'active' },
      startedAt: { type: Date, default: Date.now },
      expiresAt: { type: Date, default: null },
    },
    aiResetDate: {
      type: Date,
      default: Date.now,
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
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

// Pre-save hook: Sync limits block automatically when plan changes
userSchema.pre('save', function (next) {
  if (this.isModified('plan') || this.isNew) {
    const config = getPlanConfig(this.plan);
    this.limits = {
      aiRequestsLimit: config.aiRequestsLimit,
      uploadLimit: config.uploadCountLimit,
      storageLimitMB: config.storageLimitMB,
      activeIdeasLimit: config.activeIdeasLimit,
    };
  }
  next();
});

const User = mongoose.model('User', userSchema);
export default User;
