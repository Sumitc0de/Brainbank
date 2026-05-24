import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const prdSchema = new mongoose.Schema(
  {
    problemStatement: { type: String, default: '' },
    targetAudience: { type: String, default: '' },
    userPainPoints: { type: [String], default: [] },
    coreFeatures: { type: [String], default: [] },
    mvpScope: { type: String, default: '' },
    futureScope: { type: String, default: '' },
    monetizationStrategy: { type: String, default: '' },
    techStackSuggestion: { type: String, default: '' },
    generatedAt: { type: Date },

    // Legacy aliases kept temporarily so the current UI keeps rendering
    problem: { type: String, default: '' },
    solution: { type: String, default: '' },
    monetization: { type: String, default: '' },
    techStack: { type: String, default: '' },
  },
  { _id: false }
);

const detailsSchema = new mongoose.Schema(
  {
    productType: { type: String, default: 'web-app', trim: true },
    platforms: { type: [String], default: [] },
    targetAudience: { type: String, default: '', trim: true, maxlength: 500 },
    businessModel: { type: String, default: 'freemium', trim: true },
    launchStage: { type: String, default: 'concept', trim: true },
    competitor: { type: String, default: '', trim: true, maxlength: 300 },
    uniqueAngle: { type: String, default: '', trim: true, maxlength: 700 },
    timeline: { type: String, default: '', trim: true, maxlength: 200 },
    techPreference: { type: String, default: '', trim: true, maxlength: 300 },
  },
  { _id: false }
);

const attachmentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['image', 'pdf'],
      required: true,
    },
    name: { type: String, default: '' },
    url: { type: String, required: true },
    public_id: { type: String, required: true },
    size: { type: Number, default: 0 },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const ideaSchema = new mongoose.Schema(
  {
    id: { type: String, default: () => uuidv4(), unique: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    keywords: { type: [String], default: [] },
    description: { type: String, default: '', trim: true, maxlength: 2000 },
    tags: { type: [String], default: [] },
    stage: { type: String, enum: ['raw', 'validated', 'mvp', 'scaling'], default: 'raw' },
    status: { type: String, enum: ['backlog', 'queued', 'building', 'completed'], default: 'backlog' },
    queuePosition: { type: Number, default: 0 },
    details: { type: detailsSchema, default: () => ({}) },

    // Priority scores
    scores: {
      impact: { type: Number, min: 1, max: 10, default: 5 },
      effort: { type: Number, min: 1, max: 10, default: 5 },
      skill: { type: Number, min: 1, max: 10, default: 5 },
      demand: { type: Number, min: 1, max: 10, default: 5 },
      money: { type: Number, min: 1, max: 10, default: 5 },
      total: { type: Number, default: 0 },
    },

    // AI-generated PRD (all editable)
    prd: { type: prdSchema, default: () => ({}) },

    // Cloud media and document attachments
    attachments: { type: [attachmentSchema], default: [] },

    // Activity tracking
    lastActiveAt: { type: Date, default: Date.now },

    // Gamification
    xp: { type: Number, default: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual: is stale (7+ days inactive while in queue/building)
ideaSchema.virtual('isStale').get(function () {
  if (!['queued', 'building'].includes(this.status)) return false;
  const daysSinceActive = (Date.now() - new Date(this.lastActiveAt).getTime()) / (1000 * 60 * 60 * 24);
  return daysSinceActive >= 7;
});

ideaSchema.virtual('staleDays').get(function () {
  const days = Math.floor((Date.now() - new Date(this.lastActiveAt).getTime()) / (1000 * 60 * 60 * 24));
  return days;
});

// Auto-calc score before save
ideaSchema.pre('save', function (next) {
  const { impact, effort, skill, demand, money } = this.scores;
  this.scores.total = Math.round((((impact + demand + money) / (effort + 1)) * (skill / 10)) * 100) / 100;
  next();
});

const Idea = mongoose.model('Idea', ideaSchema);
export default Idea;
