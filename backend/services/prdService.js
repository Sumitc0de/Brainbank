import OpenAI from 'openai';

const DEFAULT_GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

const CANONICAL_PRD_SECTIONS = [
  'problemStatement',
  'targetAudience',
  'userPainPoints',
  'coreFeatures',
  'mvpScope',
  'futureScope',
  'monetizationStrategy',
  'techStackSuggestion',
  'solution',
];

const SECTION_ALIASES = {
  problem: 'problemStatement',
  monetization: 'monetizationStrategy',
  techStack: 'techStackSuggestion',
};

const ARRAY_PRD_SECTIONS = new Set(['userPainPoints', 'coreFeatures']);

let groqClient;

function getGroqClient() {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured. Add it to the backend environment before generating PRDs.');
  }

  if (!groqClient) {
    groqClient = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
    });
  }

  return groqClient;
}

function asPlainObject(value) {
  if (!value) return {};
  if (typeof value.toObject === 'function') return value.toObject();
  return value;
}

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeStringArray(value) {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeText(item)).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeScoreValue(value, fallback) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.min(10, Math.max(1, Math.round(numeric)));
}

function extractJson(content) {
  const trimmed = content.trim();
  if (!trimmed.startsWith('```')) return trimmed;
  return trimmed.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
}

async function createJsonCompletion({ prompt, maxTokens }) {
  const client = getGroqClient();
  const response = await client.chat.completions.create({
    model: DEFAULT_GROQ_MODEL,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: 'You are a senior product strategist. Return valid JSON only. No markdown, no commentary.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.4,
    max_tokens: maxTokens,
  });

  const content = response.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('Groq returned an empty response.');
  }

  return JSON.parse(extractJson(content));
}

function buildIdeaContext({ title, description, keywords = [], details = {} }) {
  const safeDescription = normalizeText(description) || 'No description provided yet.';
  const keywordList = normalizeStringArray(keywords);
  const detailLines = [
    ['Product type', details.productType],
    ['Platforms', normalizeStringArray(details.platforms).join(', ')],
    ['Target audience', details.targetAudience],
    ['Business model', details.businessModel],
    ['Launch stage', details.launchStage],
    ['Known competitor', details.competitor],
    ['Unique angle', details.uniqueAngle],
    ['Desired timeline', details.timeline],
    ['Tech preference', details.techPreference],
  ]
    .map(([label, value]) => [label, normalizeText(value)])
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`);

  return [
    `Idea title: ${title}`,
    `Idea description: ${safeDescription}`,
    `Supporting keywords: ${keywordList.length > 0 ? keywordList.join(', ') : 'None provided'}`,
    detailLines.length ? `Extra product details:\n${detailLines.join('\n')}` : 'Extra product details: None provided',
  ].join('\n');
}

export function resolvePrdSectionKey(section) {
  const normalizedSection = normalizeText(section);
  if (!normalizedSection) return null;
  return SECTION_ALIASES[normalizedSection] || (CANONICAL_PRD_SECTIONS.includes(normalizedSection) ? normalizedSection : null);
}

export function buildPrdSectionValue(section, content) {
  return ARRAY_PRD_SECTIONS.has(section) ? normalizeStringArray(content) : normalizeText(content);
}

export function normalizePrdPayload(raw = {}) {
  const source = asPlainObject(raw);
  const problemStatement = normalizeText(source.problemStatement || source.problem);
  const monetizationStrategy = normalizeText(source.monetizationStrategy || source.monetization);
  const techStackSuggestion = normalizeText(source.techStackSuggestion || source.techStack);

  const normalized = {
    problemStatement,
    targetAudience: normalizeText(source.targetAudience),
    userPainPoints: normalizeStringArray(source.userPainPoints),
    coreFeatures: normalizeStringArray(source.coreFeatures),
    mvpScope: normalizeText(source.mvpScope),
    futureScope: normalizeText(source.futureScope),
    monetizationStrategy,
    techStackSuggestion,
    problem: problemStatement,
    solution: normalizeText(source.solution),
    monetization: monetizationStrategy,
    techStack: techStackSuggestion,
  };

  if (source.generatedAt) {
    normalized.generatedAt = new Date(source.generatedAt);
  }

  return normalized;
}

export function mergePrdPayload(existing, patch = {}) {
  const existingPrd = asPlainObject(existing);
  const patchPrd = asPlainObject(patch);
  const merged = normalizePrdPayload({ ...existingPrd, ...patchPrd });
  const generatedAt = patchPrd.generatedAt || existingPrd.generatedAt;

  if (generatedAt) {
    merged.generatedAt = new Date(generatedAt);
  }

  return merged;
}

export async function generateIdeaPrd({ title, description, keywords = [], details = {} }) {
  const prompt = `${buildIdeaContext({ title, description, keywords, details })}

Generate a production-ready PRD for FounderOS and return JSON with exactly these keys:
{
  "problemStatement": "2-4 sentences",
  "targetAudience": "2-4 sentences",
  "userPainPoints": ["pain point 1", "pain point 2", "pain point 3"],
  "coreFeatures": ["feature 1", "feature 2", "feature 3", "feature 4"],
  "mvpScope": "2-4 sentences",
  "futureScope": "2-4 sentences",
  "monetizationStrategy": "2-4 sentences",
  "techStackSuggestion": "2-4 sentences",
  "solution": "2-3 sentences that summarize the product approach",
  "suggestedTags": ["tag1", "tag2", "tag3"],
  "scores": {
    "impact": 1,
    "effort": 1,
    "skill": 1,
    "demand": 1,
    "money": 1
  }
}

Guidelines:
- Be specific and founder-friendly.
- Keep arrays concise and actionable.
- Scores must be integers from 1 to 10.
- Reflect the product type, platforms, target audience, business model, timeline, and tech preference when provided.
- Focus on an MVP a solo builder could realistically ship.`;

  const parsed = await createJsonCompletion({ prompt, maxTokens: 1800 });

  return {
    prd: normalizePrdPayload({ ...parsed, generatedAt: new Date() }),
    suggestedTags: normalizeStringArray(parsed.suggestedTags),
    suggestedScores: {
      impact: normalizeScoreValue(parsed?.scores?.impact, 5),
      effort: normalizeScoreValue(parsed?.scores?.effort, 5),
      skill: normalizeScoreValue(parsed?.scores?.skill, 5),
      demand: normalizeScoreValue(parsed?.scores?.demand, 5),
      money: normalizeScoreValue(parsed?.scores?.money, 5),
    },
  };
}

export async function regenerateIdeaPrdSection({
  title,
  description,
  keywords = [],
  details = {},
  section,
  currentContent,
  currentPrd,
}) {
  const resolvedSection = resolvePrdSectionKey(section);
  if (!resolvedSection) {
    throw new Error(`Unsupported PRD section: ${section}`);
  }

  const currentPrdSnapshot = normalizePrdPayload(currentPrd);
  const prompt = `${buildIdeaContext({ title, description, keywords, details })}

Current PRD snapshot:
${JSON.stringify(currentPrdSnapshot, null, 2)}

Regenerate only the "${resolvedSection}" field.
Current field value:
${JSON.stringify(currentContent)}

Return JSON in one of these formats only:
- { "content": "updated text" }
- { "content": ["item 1", "item 2"] } for array-based sections

Make the updated content more specific, practical, and consistent with the rest of the PRD.`;

  const parsed = await createJsonCompletion({ prompt, maxTokens: 700 });

  return {
    section: resolvedSection,
    content: buildPrdSectionValue(resolvedSection, parsed.content),
  };
}
