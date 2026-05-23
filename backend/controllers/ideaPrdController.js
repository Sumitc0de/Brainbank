import Idea from '../models/Idea.js';
import {
  buildPrdSectionValue,
  generateIdeaPrd,
  mergePrdPayload,
  regenerateIdeaPrdSection,
  resolvePrdSectionKey,
} from '../services/prdService.js';

function getSectionContent(prd, section) {
  if (!prd) return '';
  const canonical = resolvePrdSectionKey(section);
  if (canonical && prd[canonical] !== undefined) return prd[canonical];
  return prd[section] ?? '';
}

export async function generatePrdForIdea(req, res) {
  try {
    const idea = await Idea.findOne({ id: req.params.id });
    if (!idea) return res.status(404).json({ success: false, error: 'Idea not found' });

    const { prd } = await generateIdeaPrd({
      title: idea.title,
      description: idea.description,
      keywords: idea.keywords,
      details: idea.details,
    });

    idea.prd = mergePrdPayload(idea.prd, { ...prd, generatedAt: new Date() });
    if (!idea.description?.trim()) {
      idea.description = idea.prd.problemStatement;
    }
    idea.lastActiveAt = new Date();
    await idea.save();

    res.json({ success: true, data: idea });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function updatePRDSection(req, res) {
  try {
    const { section, content } = req.body;
    const sectionKey = resolvePrdSectionKey(section);
    if (!sectionKey) {
      return res.status(400).json({ success: false, error: 'Unsupported PRD section' });
    }

    const idea = await Idea.findOne({ id: req.params.id });
    if (!idea) return res.status(404).json({ success: false, error: 'Idea not found' });

    idea.prd = mergePrdPayload(idea.prd, {
      [sectionKey]: buildPrdSectionValue(sectionKey, content),
    });
    idea.lastActiveAt = new Date();
    idea.xp = (idea.xp || 0) + 3;
    await idea.save();

    res.json({ success: true, data: idea });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
}

export async function regeneratePRDSection(req, res) {
  try {
    const { section } = req.body;
    const sectionKey = resolvePrdSectionKey(section);
    if (!sectionKey) {
      return res.status(400).json({ success: false, error: 'Unsupported PRD section' });
    }

    const idea = await Idea.findOne({ id: req.params.id });
    if (!idea) return res.status(404).json({ success: false, error: 'Idea not found' });

    const result = await regenerateIdeaPrdSection({
      title: idea.title,
      description: idea.description,
      keywords: idea.keywords,
      details: idea.details,
      section: sectionKey,
      currentContent: getSectionContent(idea.prd, sectionKey),
      currentPrd: idea.prd,
    });

    idea.prd = mergePrdPayload(idea.prd, {
      [result.section]: result.content,
      generatedAt: new Date(),
    });
    idea.lastActiveAt = new Date();
    idea.xp = (idea.xp || 0) + 5;
    await idea.save();

    res.json({ success: true, data: idea });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
