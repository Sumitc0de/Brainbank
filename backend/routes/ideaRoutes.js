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

const router = Router();

// Stats
router.get('/stats', getStats);

// Stale ideas
router.get('/stale', getStaleIdeas);

// CRUD
router.post('/', createIdea);
router.get('/', getAllIdeas);
router.get('/:id', getIdeaById);
router.put('/:id', updateIdea);
router.delete('/:id', deleteIdea);

// PRD
router.post('/:id/generate-prd', generatePrdForIdea);
router.patch('/:id/prd', updatePRDSection);
router.post('/:id/regenerate', regeneratePRDSection);

// Status (drag & drop)
router.patch('/status', updateIdeaStatus);

export default router;
