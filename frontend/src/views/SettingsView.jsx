import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check, Download, Info, Palette, RefreshCw, Sun, Moon,
  ShieldCheck, Sparkles, User, LogOut, Sliders, Bell, LayoutGrid, Zap, Star
} from 'lucide-react';
import Button from '../components/ui/Button';
import useIdeaStore from '../store/useIdeaStore';
import useResearchStore from '../store/useResearchStore';
import useTaskStore from '../store/useTaskStore';
import useAuthStore from '../store/useAuthStore';
import useStatsStore from '../store/useStatsStore';
import { toast } from '../components/ui/Toast';
import * as XLSX from 'xlsx';

const cardMotion = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const LEVEL_TITLES = ['Beginner', 'Thinker', 'Builder', 'Launcher', 'Founder', 'Unicorn'];

const PRESETS = [
  {
    id: 'sunlit-quest',
    name: 'Sunlit Quest',
    desc: 'Warm playful sands & copper gold',
    colors: ['#fff7df', '#ead7a8', '#df2046', '#213b1f'],
    accent: 'border-l-[#df2046]',
    circle: 'bg-[#df2046]',
    mode: 'light'
  },
  {
    id: 'nordic-snow',
    name: 'Nordic Snow',
    desc: 'Scandinavian slate & icy blue',
    colors: ['#f8fafc', '#cbd5e1', '#3b82f6', '#0f172a'],
    accent: 'border-l-[#3b82f6]',
    circle: 'bg-[#3b82f6]',
    mode: 'light'
  },
  {
    id: 'solarized-garden',
    name: 'Solarized Garden',
    desc: 'Warm olive cream & organic sage',
    colors: ['#f4f4f0', '#dfdfd0', '#2d6f29', '#1d331b'],
    accent: 'border-l-[#2d6f29]',
    circle: 'bg-[#2d6f29]',
    mode: 'light'
  },
  {
    id: 'sunset-quest',
    name: 'Sunset Quest',
    desc: 'Volcanic stone & copper glow',
    colors: ['#120f0e', '#2e2624', '#f97316', '#f5f5f4'],
    accent: 'border-l-[#f97316]',
    circle: 'bg-[#f97316]',
    mode: 'dark'
  },
  {
    id: 'midnight-ai',
    name: 'Midnight AI',
    desc: 'Obsidian void & electric indigo',
    colors: ['#0b0813', '#231c44', '#ec4899', '#f3f4f6'],
    accent: 'border-l-[#ec4899]',
    circle: 'bg-[#ec4899]',
    mode: 'dark'
  },
  {
    id: 'cyber-neon',
    name: 'Cyber Neon',
    desc: 'Void black & digital cyber grid',
    colors: ['#050505', '#1a2323', '#22c55e', '#f0fdf4'],
    accent: 'border-l-[#22c55e]',
    circle: 'bg-[#22c55e]',
    mode: 'dark'
  },
  {
    id: 'minimal-glass',
    name: 'Minimal Glass',
    desc: 'Matte charcoal & frosted silver',
    colors: ['#18181b', '#2d2d30', '#f4f4f5', '#fafafa'],
    accent: 'border-l-[#f4f4f5]',
    circle: 'bg-[#f4f4f5]',
    mode: 'dark'
  },
  {
    id: 'focus-mode',
    name: 'Focus Mode',
    desc: 'Jet black & high contrast lime',
    colors: ['#000000', '#262626', '#84cc16', '#ffffff'],
    accent: 'border-l-[#84cc16]',
    circle: 'bg-[#84cc16]',
    mode: 'dark'
  }
];

export default function SettingsView() {
  const ideas = useIdeaStore((s) => s.ideas);
  const getPriorityLabel = useIdeaStore((s) => s.getPriorityLabel);
  const tasks = useTaskStore((s) => s.tasks);
  const research = useResearchStore((s) => s.research);
  const stats = useStatsStore((s) => s.stats);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const theme = useAuthStore((s) => s.theme);
  const toggleTheme = useAuthStore((s) => s.toggleTheme);
  const themeStyle = useAuthStore((s) => s.themeStyle);
  const setThemeStyle = useAuthStore((s) => s.setThemeStyle);
  const glowIntensity = useAuthStore((s) => s.glowIntensity);
  const setGlowIntensity = useAuthStore((s) => s.setGlowIntensity);
  const reduceAnimations = useAuthStore((s) => s.reduceAnimations);
  const setReduceAnimations = useAuthStore((s) => s.setReduceAnimations);
  const compactMode = useAuthStore((s) => s.compactMode);
  const setCompactMode = useAuthStore((s) => s.setCompactMode);

  // Notifications State
  const [notifs, setNotifs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('brainbank_notifications')) || {
        aiSuggestions: true,
        streaks: true,
        buildChecklists: true,
        queueNudges: false
      };
    } catch {
      return {
        aiSuggestions: true,
        streaks: true,
        buildChecklists: true,
        queueNudges: false
      };
    }
  });

  const toggleNotif = (key) => {
    const next = { ...notifs, [key]: !notifs[key] };
    setNotifs(next);
    localStorage.setItem('brainbank_notifications', JSON.stringify(next));
    toast('Preferences updated', 'success');
  };

  const counts = useMemo(() => {
    const activeIdeaIds = new Set(ideas.map(i => i.id || i._id).filter(Boolean));

    let taskCount = 0;
    Object.entries(tasks || {}).forEach(([ideaId, list]) => {
      if (activeIdeaIds.has(ideaId) && Array.isArray(list)) {
        taskCount += list.length;
      }
    });

    let researchCount = 0;
    Object.entries(research || {}).forEach(([ideaId, list]) => {
      if (activeIdeaIds.has(ideaId) && Array.isArray(list)) {
        researchCount += list.length;
      }
    });

    return [
      { label: 'Ideas Captured', value: ideas.length, emoji: '💡' },
      { label: 'Tasks Forged', value: taskCount, emoji: '🛠️' },
      { label: 'Research Tasks', value: researchCount, emoji: '🔎' },
    ];
  }, [ideas, tasks, research]);

  // Derived XP
  const totalXP = stats?.totalXP || 0;
  const level = stats?.level || 1;
  const xpInLevel = totalXP % 100;
  const levelTitle = LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)];

  // Multi-sheet SheetJS XLSX Export
  const handleExcelExport = () => {
    try {
      // Sort queued ideas by priority score to map queue position indices
      const queuedIdeas = ideas
        .filter(i => i.status === 'queued')
        .sort((a, b) => (b.scores?.total || 0) - (a.scores?.total || 0));

      // 1. Ideas Sheet
      const ideasData = ideas.map(idea => {
        let qPos = 'N/A';
        if (idea.status === 'queued') {
          const idx = queuedIdeas.findIndex(q => q.id === idea.id);
          if (idx !== -1) {
            qPos = (idx + 1).toString();
          }
        }
        return {
          'Title': idea.title || '',
          'Description': idea.description || '',
          'Status': idea.status || '',
          'Priority Label': idea.scores ? getPriorityLabel(idea.scores.total || 0) : 'low',
          'Priority Score': idea.scores?.total ? idea.scores.total.toFixed(1) : '0.0',
          'Queue Position': qPos,
          'Created Date': idea.createdAt ? new Date(idea.createdAt).toLocaleDateString() : ''
        };
      });

      // 2. Features Sheet
      const featuresData = [];
      ideas.forEach(idea => {
        const coreFeatures = idea.prd?.coreFeatures;
        if (Array.isArray(coreFeatures)) {
          coreFeatures.forEach(feature => {
            let fName = '';
            let fDesc = '';
            if (typeof feature === 'string') {
              fName = feature;
            } else if (feature && typeof feature === 'object') {
              fName = feature.name || feature.title || '';
              fDesc = feature.description || feature.desc || '';
            }
            if (fName.trim()) {
              let fStatus = 'Pending';
              if (idea.status === 'completed') {
                fStatus = 'Completed';
              } else if (idea.status === 'building') {
                fStatus = 'In Progress';
              } else if (idea.status === 'queued') {
                fStatus = 'Queued';
              } else {
                fStatus = 'Backlog';
              }

              featuresData.push({
                'Feature Name': fName,
                'Description': fDesc,
                'Completion Status': fStatus,
                'Related Idea': idea.title || ''
              });
            }
          });
        }
      });

      // 3. Research Sheet
      const researchData = [];
      ideas.forEach(idea => {
        const ideaResearch = research[idea.id] || [];
        ideaResearch.forEach(r => {
          researchData.push({
            'Research Task': r.title || r.category || '',
            'Category': r.category || '',
            'Status': r.status || 'pending',
            'Notes': r.notes || '',
            'Related Idea': idea.title || ''
          });
        });
      });

      // 4. Tasks Sheet
      const tasksData = [];
      ideas.forEach(idea => {
        const ideaTasks = tasks[idea.id] || [];
        ideaTasks.forEach(t => {
          tasksData.push({
            'Task': t.title || '',
            'Phase': t.phase || 'mvp',
            'Status': t.status || 'pending',
            'Priority': t.priority || 'medium',
            'Deadline/Est Time': t.estimatedTime || '',
            'Progress': t.status === 'completed' ? '100%' : '0%',
            'Related Idea': idea.title || ''
          });
        });
      });

      // Build Workbook
      const wb = XLSX.utils.book_new();

      const wsIdeas = XLSX.utils.json_to_sheet(ideasData);
      const wsFeatures = XLSX.utils.json_to_sheet(featuresData);
      const wsResearch = XLSX.utils.json_to_sheet(researchData);
      const wsTasks = XLSX.utils.json_to_sheet(tasksData);

      XLSX.utils.book_append_sheet(wb, wsIdeas, 'Ideas');
      XLSX.utils.book_append_sheet(wb, wsFeatures, 'Features');
      XLSX.utils.book_append_sheet(wb, wsResearch, 'Research');
      XLSX.utils.book_append_sheet(wb, wsTasks, 'Tasks');

      XLSX.writeFile(wb, `brainbank-backup-${new Date().toISOString().slice(0, 10)}.xlsx`);
      toast('Workspace backup excel generated successfully!', 'success');
    } catch (err) {
      console.error(err);
      toast('Excel export failed', 'error');
    }
  };

  const handlePresetSelect = (preset, event) => {
    // Automatically switch light/dark mode to match preset mode
    if (preset.mode !== theme) {
      toggleTheme(event);
    }
    setThemeStyle(preset.id);
    toast(`${preset.name} active`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Workspace Quick Counts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {counts.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-edge bg-surface-2/65 backdrop-blur-xl p-4 shadow-card hover:border-purple/20 transition-all flex items-center justify-between"
          >
            <div>
              <p className="text-[11px] font-bold text-fg-3 uppercase tracking-wider">{item.label}</p>
              <p className="mt-1 text-2xl font-black text-fg tabular-nums">{item.value}</p>
            </div>
            <span className="text-2xl opacity-80">{item.emoji}</span>
          </div>
        ))}
      </div>

      {/* Spacious 2-Column Dashboard Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_.85fr] gap-6 items-start">
        
        {/* LEFT COLUMN: Appearance & Workspace Options */}
        <div className="space-y-6">
          
          {/* Section 1: Dynamic Theme Customizer */}
          <motion.section
            {...cardMotion}
            transition={{ delay: 0.02 }}
            className="rounded-2xl bg-surface-2/65 border border-edge backdrop-blur-xl shadow-card overflow-hidden"
          >
            <SectionHeader icon={Palette} title="Theme Customizer" subtitle="Personalize your founder environment with gamified dark presets." />
            
            <div className="p-6 space-y-5">
              
              {/* Theme Mode Toggle (Circular Transitions) */}
              <div className="flex items-center justify-between border-b border-edge/60 pb-4 mb-4">
                <div>
                  <h4 className="text-xs font-bold text-fg uppercase tracking-wider">Appearance</h4>
                  <p className="text-[10px] text-fg-3">Switch between light and dark modes</p>
                </div>
                <button
                  onClick={(e) => toggleTheme(e)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-edge bg-surface-3/60 text-xs font-semibold text-fg hover:bg-surface-4/60 transition-all cursor-pointer shadow-card"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun size={13} className="text-purple-soft" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon size={13} className="text-purple" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>
              </div>

              {/* Light Presets Picker */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-fg-3 uppercase tracking-widest block">Gamified Light Presets</h4>
                
                <div className="grid grid-cols-1 gap-2">
                  {PRESETS.filter(p => p.mode === 'light').map((preset) => {
                    const isActive = theme === 'light' && themeStyle === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={(e) => handlePresetSelect(preset, e)}
                        className={`w-full text-left rounded-xl border p-3 flex items-center justify-between transition-all duration-200 cursor-pointer ${
                          isActive
                            ? 'bg-surface-3/90 border-purple ring-1 ring-purple/20 shadow-glow-purple scale-[1.01]'
                            : 'bg-surface-2/30 border-edge/50 hover:bg-surface-3/50 hover:border-edge'
                        } border-l-[4px] ${preset.accent}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-3 h-3 rounded-full shrink-0 ${preset.circle}`} />
                          <div>
                            <p className="text-xs font-bold text-fg">{preset.name}</p>
                            <p className="text-[10px] text-fg-3 mt-0.5">{preset.desc}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Mini UI color preview dots */}
                          <div className="flex -space-x-1">
                            {preset.colors.map((c, i) => (
                              <span key={i} className="w-2.5 h-2.5 rounded-full border border-surface-0" style={{ backgroundColor: c }} />
                            ))}
                          </div>
                          {isActive && <Check size={14} className="text-purple ml-1" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dark Presets Picker */}
              <div className="space-y-3 pt-2">
                <h4 className="text-[10px] font-bold text-fg-3 uppercase tracking-widest block">Gamified Dark Presets</h4>
                
                <div className="grid grid-cols-1 gap-2">
                  {PRESETS.filter(p => p.mode === 'dark').map((preset) => {
                    const isActive = theme === 'dark' && themeStyle === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={(e) => handlePresetSelect(preset, e)}
                        className={`w-full text-left rounded-xl border p-3 flex items-center justify-between transition-all duration-200 cursor-pointer ${
                          isActive
                            ? 'bg-surface-3/90 border-purple ring-1 ring-purple/20 shadow-glow-purple scale-[1.01]'
                            : 'bg-surface-2/30 border-edge/50 hover:bg-surface-3/50 hover:border-edge'
                        } border-l-[4px] ${preset.accent}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-3 h-3 rounded-full shrink-0 ${preset.circle}`} />
                          <div>
                            <p className="text-xs font-bold text-fg">{preset.name}</p>
                            <p className="text-[10px] text-fg-3 mt-0.5">{preset.desc}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Mini UI color preview dots */}
                          <div className="flex -space-x-1">
                            {preset.colors.map((c, i) => (
                              <span key={i} className="w-2.5 h-2.5 rounded-full border border-surface-0" style={{ backgroundColor: c }} />
                            ))}
                          </div>
                          {isActive && <Check size={14} className="text-purple ml-1" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </motion.section>

          {/* Section 2: Workspace Preferences sliders */}
          <motion.section
            {...cardMotion}
            transition={{ delay: 0.08 }}
            className="rounded-2xl bg-surface-2/65 border border-edge backdrop-blur-xl shadow-card overflow-hidden"
          >
            <SectionHeader icon={Sliders} title="Workspace Preferences" subtitle="Calibrate dashboard visuals, response intensity, and spacing limits." />
            
            <div className="p-6 space-y-4">
              {/* Glow Intensity Slider */}
              <Slider
                label="Mesh Glow Intensity"
                desc="Adjust ambient glow, neon mesh matrices, and floating card hover shadows."
                value={glowIntensity}
                onChange={setGlowIntensity}
              />

              <div className="border-t border-edge/60 pt-4 mt-2 space-y-3">
                {/* Reduce Animations Toggle */}
                <Switch
                  label="Reduce Motion Controls"
                  desc="Swap bouncy Framer Motion layouts for rapid high-performance static rendering."
                  checked={reduceAnimations}
                  onChange={setReduceAnimations}
                />

                {/* Compact Mode Toggle */}
                <Switch
                  label="Founder Compact UI"
                  desc="Minimize dashboard margins, sidebars, and paddings for dense information grids."
                  checked={compactMode}
                  onChange={setCompactMode}
                />
              </div>
            </div>
          </motion.section>

        </div>

        {/* RIGHT COLUMN: Account, Notifications, backups, details */}
        <div className="space-y-6">
          
          {/* Section 3: Gamified Account & Founders Guild Details */}
          <motion.section
            {...cardMotion}
            transition={{ delay: 0.14 }}
            className="rounded-2xl bg-surface-2/65 border border-edge backdrop-blur-xl shadow-card overflow-hidden"
          >
            <SectionHeader icon={User} title="Founders Guild Profile" subtitle="Track your founder experience and subscription levels." />
            
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 border-b border-edge/60 pb-4">
                {user?.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover border border-purple/30 shadow-card"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple to-purple-soft flex items-center justify-center text-lg font-black text-white shrink-0 shadow-card">
                    {user?.name ? user.name[0].toUpperCase() : 'F'}
                  </div>
                )}
                
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-black text-fg truncate">{user?.name || 'Founder'}</h4>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple/10 border border-purple/20 text-purple uppercase tracking-wider shrink-0">
                      Pro Founder
                    </span>
                  </div>
                  <p className="text-xs text-fg-3 truncate mt-0.5">{user?.email || 'builder@founderos.local'}</p>
                </div>
              </div>

              {/* Gamified XP Tracker */}
              <div className="rounded-xl border border-edge bg-surface-0/60 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-amber/15 text-amber">
                      <Star size={12} fill="currentColor" />
                    </span>
                    <span className="text-xs font-bold text-fg">Level {level} - {levelTitle}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber flex items-center gap-1">
                    <Zap size={11} fill="currentColor" /> {totalXP} XP
                  </span>
                </div>
                
                {/* Progress bar container */}
                <div className="w-full bg-surface-3 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber h-full rounded-full transition-all duration-300"
                    style={{ width: `${xpInLevel}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-fg-4">
                  <span>{xpInLevel} / 100 XP</span>
                  <span>{100 - xpInLevel} XP to Level {level + 1}</span>
                </div>
              </div>

              {/* Plan Controls & Sign Out */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center gap-1.5 text-xs text-fg-3 hover:text-red transition-all cursor-pointer font-semibold"
                >
                  <LogOut size={13} />
                  <span>Log out of workspace</span>
                </button>

                <span className="text-[10px] text-fg-4 italic">Free Cloud Sync Enabled</span>
              </div>

            </div>
          </motion.section>

          {/* Section 4: Productivity Notifications */}
          <motion.section
            {...cardMotion}
            transition={{ delay: 0.18 }}
            className="rounded-2xl bg-surface-2/65 border border-edge backdrop-blur-xl shadow-card overflow-hidden"
          >
            <SectionHeader icon={Bell} title="Productivity Nudges" subtitle="Automated signals to keep your venture momentum scaling forward." />
            
            <div className="p-6 space-y-3">
              <Switch
                label="AI suggestions frequency"
                desc="Daily micro-briefing notifications detailing competitor shifts and market validation opportunities."
                checked={notifs.aiSuggestions}
                onChange={() => toggleNotif('aiSuggestions')}
              />
              
              <Switch
                label="Daily streak reminders"
                desc="Polished streaks and weekly goals to secure your habit loop in founder mode."
                checked={notifs.streaks}
                onChange={() => toggleNotif('streaks')}
              />

              <Switch
                label="Forge build checklist signals"
                desc="Automated nudges notifying you about task checklist completions and feature releases."
                checked={notifs.buildChecklists}
                onChange={() => toggleNotif('buildChecklists')}
              />

              <Switch
                label="Queue priority nudges"
                desc="Intelligent alerts advising you when backlog ideas score high enough for queue promotion."
                checked={notifs.queueNudges}
                onChange={() => toggleNotif('queueNudges')}
              />
            </div>
          </motion.section>

          {/* Section 5: Professional Sheets Backup Exporter */}
          <motion.section
            {...cardMotion}
            transition={{ delay: 0.22 }}
            className="rounded-2xl bg-surface-2/65 border border-edge backdrop-blur-xl shadow-card overflow-hidden"
          >
            <SectionHeader icon={Download} title="Workspace Backup" subtitle="Download comprehensive spreadsheets of your research, ideas, features, and task lists." />
            
            <div className="p-6 space-y-4">
              <p className="text-xs text-fg-3 leading-relaxed">
                Creates a professional multi-sheet Excel workbook mapping all structured parameters across your venture repository. Ideal for founder backups, pitch deck reference pages, or custom team integrations.
              </p>
              
              {/* Professional Download Button */}
              <button
                type="button"
                onClick={handleExcelExport}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple px-4 py-3 text-xs font-bold text-white hover:bg-purple-deep transition-all cursor-pointer shadow-glow-purple active:scale-[0.99]"
              >
                <Download size={14} />
                <span>Export Multi-Sheet Backup (.xlsx)</span>
              </button>

              <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] text-fg-3 pt-2">
                <div className="bg-surface-0/40 rounded-lg p-1.5 border border-edge/30">Ideas</div>
                <div className="bg-surface-0/40 rounded-lg p-1.5 border border-edge/30">Features</div>
                <div className="bg-surface-0/40 rounded-lg p-1.5 border border-edge/30">Research</div>
                <div className="bg-surface-0/40 rounded-lg p-1.5 border border-edge/30">Tasks</div>
              </div>
            </div>
          </motion.section>

          {/* Section 6: About Brainbank */}
          <motion.section
            {...cardMotion}
            transition={{ delay: 0.26 }}
            className="rounded-2xl bg-surface-2/65 border border-edge backdrop-blur-xl shadow-card overflow-hidden"
          >
            <SectionHeader icon={Info} title="About BrainBank" subtitle="Premium Productivity Workspace." />
            
            <div className="p-6 space-y-4">
              {/* Mission Statement */}
              <p className="text-xs text-fg-2 leading-relaxed italic border-l-2 border-purple pl-3 py-1 font-medium bg-purple/5 rounded-r-lg">
                "BrainBank helps founders capture ideas, organize execution, and turn concepts into real products."
              </p>
              <div className="flex items-center justify-between text-[10px] text-fg-4 pt-4 border-t border-edge/60">
                <span>Release v1.2.0 (Stable)</span>
                <span>
                  Created with ❤️ by{' '}
                  <a
                    href="https://github.com/sumitc0de"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-purple underline font-semibold transition-colors"
                  >
                    sumitc0de
                  </a>
                </span>
              </div>
            </div>
          </motion.section>

        </div>

      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 border-b border-edge/60 px-6 py-4 bg-surface-0/20">
      <div className="flex h-8 h-8 w-8 items-center justify-center rounded-xl bg-purple/10 border border-purple/20 text-purple shadow-card shrink-0">
        <Icon size={15} />
      </div>
      <div>
        <h3 className="text-xs font-bold text-fg uppercase tracking-wider">{title}</h3>
        {subtitle && <p className="text-[10px] text-fg-3 leading-normal mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function Switch({ checked, onChange, label, desc }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 hover:bg-surface-3/20 rounded-lg transition-colors px-1">
      <div className="flex flex-col flex-1">
        <span className="text-xs font-bold text-fg">{label}</span>
        {desc && <span className="text-[10px] text-fg-3 leading-normal mt-0.5">{desc}</span>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none shrink-0 ${
          checked ? 'bg-purple shadow-glow-purple' : 'bg-surface-4'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-surface-0 shadow ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

function Slider({ value, min = 0, max = 100, onChange, label, desc }) {
  return (
    <div className="space-y-1.5 py-1 px-1">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-fg">{label}</span>
        <span className="text-[10px] font-mono font-bold text-purple tabular-nums">{value}%</span>
      </div>
      {desc && <p className="text-[10px] text-fg-3 leading-normal">{desc}</p>}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 bg-surface-3 rounded-lg appearance-none cursor-pointer accent-purple border border-edge/30 transition-all hover:border-purple/30"
      />
    </div>
  );
}
