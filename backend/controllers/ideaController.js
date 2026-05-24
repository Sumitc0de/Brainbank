import Idea from '../models/Idea.js';
import { generateIdeaPrd, mergePrdPayload } from '../services/prdService.js';

function calculateScore(scores) {
  const { impact, effort, skill, demand, money } = scores;
  return Math.round((((impact + demand + money) / (effort + 1)) * (skill / 10)) * 100) / 100;
}

async function autoPromote(userId) {
  const buildingCount = await Idea.countDocuments({ status: 'building', user: userId });
  if (buildingCount < 2) {
    const slots = 2 - buildingCount;
    const next = await Idea.find({ status: 'queued', user: userId }).sort({ 'scores.total': -1 }).limit(slots);
    for (const idea of next) {
      idea.status = 'building';
      idea.lastActiveAt = new Date();
      await idea.save();
    }
  }
}

async function resortQueue(userId) {
  const queued = await Idea.find({ status: 'queued', user: userId }).sort({ 'scores.total': -1 });
  for (let i = 0; i < queued.length; i += 1) {
    queued[i].queuePosition = i + 1;
    await queued[i].save();
  }
}

// CREATE
export async function createIdea(req, res) {
  try {
    const {
      title,
      description = '',
      keywords = [],
      tags: inputTags = [],
      stage = 'raw',
      status,
      details = {},
      scores: inputScores,
      autoGeneratePrd,
    } = req.body;

    let prd = mergePrdPayload(null, {});
    let scores = { impact: 5, effort: 5, skill: 5, demand: 5, money: 5, ...(inputScores || {}) };
    let tags = Array.isArray(inputTags) ? inputTags : [];

    const shouldGeneratePrd = typeof autoGeneratePrd === 'boolean'
      ? autoGeneratePrd
      : !String(description).trim() && Array.isArray(keywords) && keywords.length > 0;

    if (shouldGeneratePrd) {
      try {
        const aiResult = await generateIdeaPrd({ title, description, keywords, details });
        prd = aiResult.prd;
        if (!inputScores) scores = { ...scores, ...aiResult.suggestedScores };
        if (tags.length === 0) tags = aiResult.suggestedTags;
      } catch (aiErr) {
        console.error('AI PRD generation failed, creating without PRD:', aiErr.message);
      }
    }

    scores.total = calculateScore(scores);

    const idea = new Idea({
      user: req.user._id,
      title,
      keywords: Array.isArray(keywords) ? keywords : [],
      description: String(description).trim() || prd.problemStatement || '',
      tags,
      stage,
      status: status || 'backlog',
      details,
      scores,
      prd,
      lastActiveAt: new Date(),
      xp: 10,
    });

    await idea.save();
    if (idea.status === 'queued') {
      await resortQueue(req.user._id);
      await autoPromote(req.user._id);
    }

    res.status(201).json({ success: true, data: idea });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
}

// GET ALL
export async function getAllIdeas(req, res) {
  try {
    const ideas = await Idea.find({ user: req.user._id }).sort({ 'scores.total': -1 });
    res.json({ success: true, data: ideas });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// GET ONE
export async function getIdeaById(req, res) {
  try {
    const idea = await Idea.findOne({ id: req.params.id, user: req.user._id });
    if (!idea) return res.status(404).json({ success: false, error: 'Idea not found' });

    idea.lastActiveAt = new Date();
    await idea.save();
    res.json({ success: true, data: idea });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// UPDATE
export async function updateIdea(req, res) {
  try {
    const idea = await Idea.findOne({ id: req.params.id, user: req.user._id });
    if (!idea) return res.status(404).json({ success: false, error: 'Idea not found' });

    const oldStatus = idea.status;
    const updateData = { ...req.body };

    if (updateData.scores) {
      updateData.scores.total = calculateScore(updateData.scores);
    }

    if (updateData.status === 'building' && oldStatus !== 'building') {
      const count = await Idea.countDocuments({ status: 'building', user: req.user._id, _id: { $ne: idea._id } });
      if (count >= 2) return res.status(400).json({ success: false, error: 'Max 2 ideas in Building.' });
    }

    if (updateData.prd) {
      updateData.prd = mergePrdPayload(idea.prd, updateData.prd);
    }

    Object.assign(idea, updateData);
    if (updateData.scores) Object.assign(idea.scores, updateData.scores);
    if (updateData.prd) idea.prd = updateData.prd;
    idea.lastActiveAt = new Date();

    idea.xp = (idea.xp || 0) + 5;
    if (updateData.status === 'completed' && oldStatus !== 'completed') idea.xp += 50;

    await idea.save();

    if (updateData.status === 'completed' && oldStatus !== 'completed') await autoPromote(req.user._id);
    await resortQueue(req.user._id);

    const updated = await Idea.findOne({ id: req.params.id, user: req.user._id });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
}

// DELETE
export async function deleteIdea(req, res) {
  try {
    const idea = await Idea.findOneAndDelete({ id: req.params.id, user: req.user._id });
    if (!idea) return res.status(404).json({ success: false, error: 'Idea not found' });
    if (idea.status === 'building') await autoPromote(req.user._id);
    await resortQueue(req.user._id);
    res.json({ success: true, data: idea });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// GET STALE IDEAS
export async function getStaleIdeas(req, res) {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const stale = await Idea.find({
      user: req.user._id,
      status: { $in: ['queued', 'building'] },
      lastActiveAt: { $lt: sevenDaysAgo },
    }).sort({ lastActiveAt: 1 });
    res.json({ success: true, data: stale });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// UPDATE STATUS (drag & drop)
export async function updateIdeaStatus(req, res) {
  try {
    const { id, status } = req.body;
    const idea = await Idea.findOne({ id, user: req.user._id });
    if (!idea) return res.status(404).json({ success: false, error: 'Idea not found' });

    if (status === 'building' && idea.status !== 'building') {
      const count = await Idea.countDocuments({ status: 'building', user: req.user._id, _id: { $ne: idea._id } });
      if (count >= 2) return res.status(400).json({ success: false, error: 'Max 2 ideas in Building.' });
    }

    idea.status = status;
    idea.lastActiveAt = new Date();
    if (status === 'completed') idea.xp = (idea.xp || 0) + 50;
    await idea.save();

    if (status === 'completed') await autoPromote(req.user._id);
    await resortQueue(req.user._id);

    const allIdeas = await Idea.find({ user: req.user._id }).sort({ 'scores.total': -1 });
    res.json({ success: true, data: allIdeas });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
}

// STATS
export async function getStats(req, res) {
  try {
    const ideas = await Idea.find({ user: req.user._id });
    const totalXP = ideas.reduce((sum, item) => sum + (item.xp || 0), 0);
    const level = Math.floor(totalXP / 100) + 1;
    const totalIdeas = ideas.length;
    const completedIdeas = ideas.filter((item) => item.status === 'completed').length;
    const ideasWithPrd = ideas.filter((item) =>
      item.prd?.problemStatement ||
      item.prd?.problem ||
      item.prd?.targetAudience ||
      (item.prd?.coreFeatures?.length || 0) > 0
    ).length;
    const completionRate = totalIdeas ? Math.round((completedIdeas / totalIdeas) * 1000) / 10 : 0;
    const prdCoverage = totalIdeas ? Math.round((ideasWithPrd / totalIdeas) * 1000) / 10 : 0;
    const averageScore = totalIdeas
      ? Math.round((ideas.reduce((sum, item) => sum + (item.scores?.total || 0), 0) / totalIdeas) * 100) / 100
      : 0;
    const highPriorityIdeas = ideas.filter((item) => (item.scores?.total || 0) >= 8).length;
    const recentlyCreated = ideas.filter((item) => {
      const createdAt = new Date(item.createdAt).getTime();
      return Date.now() - createdAt <= 7 * 24 * 60 * 60 * 1000;
    }).length;
    const statusBreakdown = {
      backlog: ideas.filter((item) => item.status === 'backlog').length,
      queued: ideas.filter((item) => item.status === 'queued').length,
      building: ideas.filter((item) => item.status === 'building').length,
      completed: completedIdeas,
    };
    const stageBreakdown = {
      raw: ideas.filter((item) => item.stage === 'raw').length,
      validated: ideas.filter((item) => item.stage === 'validated').length,
      mvp: ideas.filter((item) => item.stage === 'mvp').length,
      scaling: ideas.filter((item) => item.stage === 'scaling').length,
    };
    const scoreBands = {
      high: ideas.filter((item) => (item.scores?.total || 0) >= 8).length,
      medium: ideas.filter((item) => (item.scores?.total || 0) >= 5 && (item.scores?.total || 0) < 8).length,
      low: ideas.filter((item) => (item.scores?.total || 0) < 5).length,
    };

    res.json({
      success: true,
      data: {
        total: totalIdeas,
        backlog: statusBreakdown.backlog,
        queued: statusBreakdown.queued,
        building: statusBreakdown.building,
        completed: completedIdeas,
        totalXP,
        level,
        avgScore: averageScore,
        completionRate,
        ideasWithPrd,
        prdCoverage,
        highPriorityIdeas,
        recentlyCreated,
        analytics: {
          completionRate,
          prdCoverage,
          averageScore,
          ideasWithPrd,
          highPriorityIdeas,
          recentlyCreated,
          statusBreakdown,
          stageBreakdown,
          scoreBands,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
