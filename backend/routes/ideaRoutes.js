import { Router } from 'express';
import {
  createIdea,
  deleteIdea,
  getAllIdeas,
  getIdeaById,
  getStaleIdeas,
  getStats,
  updateIdea,
  updateIdeaStatus,
} from '../controllers/ideaController.js';
import {
  generatePrdForIdea,
  regeneratePRDSection,
  updatePRDSection,
} from '../controllers/ideaPrdController.js';
import { apiLimiter, aiLimiter } from '../middleware/rateLimiter.js';
import {
  validate,
  createIdeaSchema,
  updateIdeaSchema,
  updateStatusSchema,
  updatePrdSectionSchema,
  regeneratePrdSectionSchema,
} from '../middleware/validate.js';
import { checkActiveIdeasLimit, checkAiLimit } from '../middleware/gatingMiddleware.js';

const router = Router();

// Apply rate limiter to all idea routes
router.use(apiLimiter);

// Stats
router.get('/stats', getStats);

// Stale ideas
router.get('/stale', getStaleIdeas);

// CRUD
router.post('/', checkActiveIdeasLimit, validate(createIdeaSchema), createIdea);
router.get('/', getAllIdeas);
router.get('/:id', getIdeaById);
router.put('/:id', validate(updateIdeaSchema), updateIdea);
router.delete('/:id', deleteIdea);

// PRD (protected by special aiLimiter + checkAiLimit daily quotas)
router.post('/:id/generate-prd', aiLimiter, checkAiLimit, generatePrdForIdea);
router.patch('/:id/prd', validate(updatePrdSectionSchema), updatePRDSection);
router.post('/:id/regenerate', aiLimiter, checkAiLimit, validate(regeneratePrdSectionSchema), regeneratePRDSection);

// Status (drag & drop)
router.patch('/status', validate(updateStatusSchema), updateIdeaStatus);

export default router;
