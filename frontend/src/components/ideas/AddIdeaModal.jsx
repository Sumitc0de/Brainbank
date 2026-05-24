import { useState } from 'react';
import { X, Plus, Sparkles, Check } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import ScoreSlider from '../ui/ScoreSlider';
import useIdeaStore from '../../store/useIdeaStore';
import { toast } from '../ui/Toast';

const PRODUCT_TYPES = [
  { value: 'web-app', label: 'Web App', emoji: '🌐' },
  { value: 'mobile-app', label: 'Mobile App', emoji: '📱' },
  { value: 'desktop-app', label: 'Desktop', emoji: '🖥️' },
  { value: 'ai-agent', label: 'AI Agent', emoji: '🤖' },
  { value: 'marketplace', label: 'Marketplace', emoji: '🛍️' },
  { value: 'game', label: 'Game', emoji: '🎮' },
  { value: 'api-tool', label: 'API/Tool', emoji: '🧰' },
  { value: 'other', label: 'Other', emoji: '✨' },
];

const PLATFORMS = [
  { value: 'web', label: 'Web', emoji: '🌐' },
  { value: 'ios', label: 'iOS', emoji: '🍎' },
  { value: 'android', label: 'Android', emoji: '🤖' },
  { value: 'desktop', label: 'Desktop', emoji: '🖥️' },
  { value: 'extension', label: 'Extension', emoji: '🧩' },
  { value: 'api', label: 'API', emoji: '🔌' },
];

const BUSINESS_MODELS = [
  { value: 'freemium', label: 'Freemium', emoji: '🎁' },
  { value: 'subscription', label: 'Subscription', emoji: '💎' },
  { value: 'one-time', label: 'One-time', emoji: '🪙' },
  { value: 'ads', label: 'Ads', emoji: '📣' },
  { value: 'marketplace-fee', label: 'Fee', emoji: '🏪' },
  { value: 'open-source', label: 'Open Source', emoji: '🌱' },
];

const LAUNCH_STAGES = [
  { value: 'concept', label: 'Concept', emoji: '💭' },
  { value: 'prototype', label: 'Prototype', emoji: '🧪' },
  { value: 'mvp', label: 'MVP', emoji: '🚀' },
  { value: 'growth', label: 'Growth', emoji: '📈' },
];

const INITIAL = {
  title: '',
  description: '',
  keywords: [],
  keywordInput: '',
  autoGeneratePrd: true,
  details: {
    productType: 'web-app',
    platforms: ['web'],
    targetAudience: '',
    businessModel: 'freemium',
    launchStage: 'concept',
    competitor: '',
    uniqueAngle: '',
    timeline: '',
    techPreference: '',
  },
  scores: { impact: 5, effort: 5, skill: 5, demand: 5, money: 5 },
};

export default function AddIdeaModal() {
  const { isAddModalOpen, setAddModalOpen, createIdea } = useIdeaStore();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ ...INITIAL, details: { ...INITIAL.details } });

  const reset = () => setForm({ ...INITIAL, details: { ...INITIAL.details } });

  const setDetail = (key, value) => {
    setForm((current) => ({ ...current, details: { ...current.details, [key]: value } }));
  };

  const togglePlatform = (value) => {
    setForm((current) => {
      const platforms = current.details.platforms.includes(value)
        ? current.details.platforms.filter((item) => item !== value)
        : [...current.details.platforms, value];
      return {
        ...current,
        details: { ...current.details, platforms: platforms.length ? platforms : [value] },
      };
    });
  };

  const addKw = () => {
    const kw = form.keywordInput.trim();
    if (kw && !form.keywords.includes(kw)) {
      setForm({ ...form, keywords: [...form.keywords, kw], keywordInput: '' });
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast('Enter a quest title', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await createIdea({
        title: form.title,
        description: form.description,
        keywords: form.keywords,
        details: form.details,
        autoGeneratePrd: form.autoGeneratePrd,
        scores: form.scores,
      });
      toast('Quest created! 🚀', 'success');
      reset();
    } catch (err) {
      toast(err.message || 'Failed to create quest', 'error');
    }
    setSubmitting(false);
  };

  const inputClass = `w-full text-sm bg-surface-0 border border-edge rounded-xl px-4 py-3
    text-fg placeholder:text-fg-4 transition-all duration-200
    focus:border-purple focus:bg-surface-0 focus:shadow-[0_0_0_3px_rgba(223,32,70,.10)]`;

  return (
    <Modal isOpen={isAddModalOpen} onClose={() => { setAddModalOpen(false); reset(); }}
      title="✨ New Quest Idea" maxWidth="max-w-3xl">
      <form onSubmit={submit} className="space-y-5">
        <div>
          <label className="text-[11px] font-bold text-fg-3 uppercase tracking-widest mb-2 block">
            Quest Title <span className="text-red">*</span>
          </label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g., AI-Powered Resume Builder"
            autoFocus
            className={inputClass}
          />
        </div>

        <OptionGrid
          label="What are you building?"
          options={PRODUCT_TYPES}
          value={form.details.productType}
          onChange={(value) => setDetail('productType', value)}
        />

        <MultiOptionGrid
          label="Target Platforms"
          options={PLATFORMS}
          values={form.details.platforms}
          onToggle={togglePlatform}
        />

        <div className="space-y-4">
          <OptionGrid
            label="Launch Stage"
            options={LAUNCH_STAGES}
            value={form.details.launchStage}
            onChange={(value) => setDetail('launchStage', value)}
            columns="grid-cols-2 sm:grid-cols-4"
          />
          <OptionGrid
            label="Business Model"
            options={BUSINESS_MODELS}
            value={form.details.businessModel}
            onChange={(value) => setDetail('businessModel', value)}
            columns="grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Target Player / Audience"
            value={form.details.targetAudience}
            onChange={(value) => setDetail('targetAudience', value)}
            placeholder="e.g., students, recruiters, solo founders"
            inputClass={inputClass}
          />
          <Field
            label="Known Rival / Competitor"
            value={form.details.competitor}
            onChange={(value) => setDetail('competitor', value)}
            placeholder="e.g., Notion, Canva, Duolingo"
            inputClass={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Build Timeline"
            value={form.details.timeline}
            onChange={(value) => setDetail('timeline', value)}
            placeholder="e.g., weekend MVP, 4 weeks, 90 days"
            inputClass={inputClass}
          />
          <Field
            label="Tech Preference"
            value={form.details.techPreference}
            onChange={(value) => setDetail('techPreference', value)}
            placeholder="e.g., React + Node, Flutter, no-code"
            inputClass={inputClass}
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-fg-3 uppercase tracking-widest mb-2 block">
            Unique Power-Up
          </label>
          <input
            value={form.details.uniqueAngle}
            onChange={(e) => setDetail('uniqueAngle', e.target.value)}
            placeholder="What makes this different or more fun/useful?"
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-fg-3 uppercase tracking-widest mb-2 block">
            Power Tags
          </label>
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <input
              value={form.keywordInput}
              onChange={(e) => setForm({ ...form, keywordInput: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKw())}
              placeholder="Add power tag, press Enter"
              className={`flex-1 ${inputClass}`}
            />
            <Button type="button" variant="secondary" size="md" onClick={addKw} icon={Plus}>
              Add
            </Button>
          </div>
          {form.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {form.keywords.map((kw) => (
                <span key={kw} className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5
                  rounded-lg bg-purple/10 text-purple border border-purple/20">
                  #{kw}
                  <button type="button"
                    onClick={() => setForm({ ...form, keywords: form.keywords.filter((k) => k !== kw) })}
                    className="hover:text-red cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="text-[11px] font-bold text-fg-3 uppercase tracking-widest mb-2 block">
            Quest Brief
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            placeholder="Describe the problem, users, gameplay/workflow, or outcome..."
            className={`${inputClass} resize-none`}
          />
        </div>

        <label className="flex items-start gap-3 sm:gap-4 px-4 sm:px-5 py-4 rounded-xl
          bg-purple/5 border border-purple/15
          cursor-pointer hover:bg-purple/8 transition-colors">
          <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
            form.autoGeneratePrd ? 'border-purple bg-purple text-white' : 'border-edge bg-surface-2 text-transparent'
          }`}>
            <Check size={13} />
          </span>
          <input
            type="checkbox"
            checked={form.autoGeneratePrd}
            onChange={(e) => setForm({ ...form, autoGeneratePrd: e.target.checked })}
            className="sr-only"
          />
          <Sparkles size={18} className="text-purple shrink-0" />
          <div>
            <p className="text-sm font-bold text-fg">✨ Auto-generate PRD loot with AI</p>
            <p className="text-xs text-fg-3 mt-0.5">Uses your type, platform, audience, business model, and timeline</p>
          </div>
        </label>

        <div className="p-4 sm:p-5 rounded-xl bg-surface-0 border border-edge space-y-4">
          <label className="text-[11px] font-bold text-fg-3 uppercase tracking-widest block">
            Power Scores
          </label>
          <div className="space-y-4">
            {['impact', 'demand', 'money', 'effort', 'skill'].map((k) => (
              <ScoreSlider
                key={k}
                label={k[0].toUpperCase() + k.slice(1)}
                value={form.scores[k]}
                onChange={(v) => setForm({ ...form, scores: { ...form.scores, [k]: v } })}
              />
            ))}
          </div>
        </div>

        <Button type="submit" disabled={submitting} className="w-full" size="lg" icon={Sparkles}>
          {submitting ? 'Crafting...' : 'Create Quest 🚀'}
        </Button>
      </form>
    </Modal>
  );
}

function OptionGrid({ label, options, value, onChange, columns = 'grid-cols-2 sm:grid-cols-4' }) {
  return (
    <div>
      <label className="text-[11px] font-bold text-fg-3 uppercase tracking-widest mb-2 block">
        {label}
      </label>
      <div className={`grid ${columns} gap-2`}>
        {options.map((option) => (
          <ChoiceButton
            key={option.value}
            option={option}
            active={value === option.value}
            onClick={() => onChange(option.value)}
          />
        ))}
      </div>
    </div>
  );
}

function MultiOptionGrid({ label, options, values, onToggle }) {
  return (
    <div>
      <label className="text-[11px] font-bold text-fg-3 uppercase tracking-widest mb-2 block">
        {label}
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
        {options.map((option) => (
          <ChoiceButton
            key={option.value}
            option={option}
            active={values.includes(option.value)}
            onClick={() => onToggle(option.value)}
          />
        ))}
      </div>
    </div>
  );
}

function ChoiceButton({ option, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-12 rounded-xl border px-3 py-2 text-left transition-all cursor-pointer ${
        active
          ? 'border-purple bg-purple/10 text-fg shadow-card'
          : 'border-edge bg-surface-0/70 text-fg-2 hover:border-purple/35 hover:bg-white/70'
      }`}
    >
      <span className="flex items-center gap-2 text-sm font-bold">
        <span>{option.emoji}</span>
        <span className="truncate">{option.label}</span>
      </span>
    </button>
  );
}

function Field({ label, value, onChange, placeholder, inputClass }) {
  return (
    <div>
      <label className="text-[11px] font-bold text-fg-3 uppercase tracking-widest mb-2 block">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}
