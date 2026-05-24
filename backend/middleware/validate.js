import { z } from 'zod';

// ═══════════════════════════════════════
//  ZOD SCHEMAS
// ═══════════════════════════════════════

// Strip HTML tags from a string to prevent XSS
function stripHtml(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/<[^>]*>/g, '').trim();
}

const safeString = (maxLen = 2000) =>
  z.string().max(maxLen).transform(stripHtml);

const safeOptionalString = (maxLen = 2000) =>
  z.string().max(maxLen).transform(stripHtml).optional().default('');

const scoreField = z.number().int().min(1).max(10).optional().default(5);

// ---- Idea creation ----
export const createIdeaSchema = z.object({
  title: safeString(200),
  description: safeOptionalString(2000),
  keywords: z.array(z.string().max(50).transform(stripHtml)).max(20).optional().default([]),
  tags: z.array(z.string().max(30).transform(stripHtml)).max(10).optional().default([]),
  stage: z.enum(['raw', 'validated', 'mvp', 'scaling']).optional().default('raw'),
  status: z.enum(['backlog', 'queued', 'building', 'completed']).optional(),
  details: z.object({
    productType: z.string().max(50).optional().default('web-app'),
    platforms: z.array(z.string().max(30)).max(5).optional().default([]),
    targetAudience: z.string().max(500).transform(stripHtml).optional().default(''),
    businessModel: z.string().max(50).optional().default('freemium'),
    launchStage: z.string().max(50).optional().default('concept'),
    competitor: z.string().max(300).transform(stripHtml).optional().default(''),
    uniqueAngle: z.string().max(700).transform(stripHtml).optional().default(''),
    timeline: z.string().max(200).optional().default(''),
    techPreference: z.string().max(300).optional().default(''),
  }).optional().default({}),
  scores: z.object({
    impact: scoreField,
    effort: scoreField,
    skill: scoreField,
    demand: scoreField,
    money: scoreField,
  }).optional(),
  autoGeneratePrd: z.boolean().optional(),
});

// ---- Idea update ----
export const updateIdeaSchema = createIdeaSchema.partial();

// ---- Status update (drag & drop) ----
export const updateStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(['backlog', 'queued', 'building', 'completed']),
});

// ---- PRD section update ----
export const updatePrdSectionSchema = z.object({
  section: z.string().min(1).max(50),
  content: z.union([
    z.string().max(5000).transform(stripHtml),
    z.array(z.string().max(500).transform(stripHtml)).max(20),
  ]),
});

// ---- PRD section regenerate ----
export const regeneratePrdSectionSchema = z.object({
  section: z.string().min(1).max(50),
});

// ---- Upload params ----
export const uploadParamsSchema = z.object({
  ideaId: z.string().min(1),
  category: z.string().max(30).optional().default('idea'),
});

// ---- Google login ----
export const googleLoginSchema = z.object({
  token: z.string().min(1, 'Google ID token is required.'),
});

// ═══════════════════════════════════════
//  VALIDATION MIDDLEWARE FACTORY
// ═══════════════════════════════════════

/**
 * Returns Express middleware that validates req.body against the given Zod schema.
 * On success, replaces req.body with the parsed (sanitized) data.
 * On failure, returns 400 with structured errors.
 */
export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return res.status(400).json({
        success: false,
        error: 'Validation failed.',
        code: 'VALIDATION_ERROR',
        details: errors,
      });
    }
    req.body = result.data;
    next();
  };
}
