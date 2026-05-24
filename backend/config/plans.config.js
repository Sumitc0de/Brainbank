/**
 * Centralized SaaS Plan & Credit Configuration
 * Dynamic limits mapped to the subscription tiers.
 */

export const PLANS = {
  free: {
    activeIdeasLimit: 5,
    aiRequestsLimit: 10,
    uploadCountLimit: 5,
    storageLimitMB: 5,
    label: 'Hobbyist',
  },
  pro: {
    activeIdeasLimit: 12,
    aiRequestsLimit: 100,
    uploadCountLimit: 50,
    storageLimitMB: 15,
    label: 'Founder / Pro',
  },
  ultra: {
    activeIdeasLimit: 100,
    aiRequestsLimit: 1000,
    uploadCountLimit: 500,
    storageLimitMB: 100,
    label: 'Ultra / Startup',
  },
};

/**
 * Returns limits config for a given plan.
 * Fallback to free plan details if invalid.
 */
export function getPlanConfig(planName) {
  const normalized = (planName || 'free').toLowerCase();
  return PLANS[normalized] || PLANS.free;
}
