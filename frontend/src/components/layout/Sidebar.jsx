import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Lightbulb, ListOrdered, FlaskConical, CheckSquare,
  Trophy, Settings, X, Zap, Star, LogOut, Sun, Moon,
} from 'lucide-react';
import useIdeaStore from '../../store/useIdeaStore';
import useStatsStore from '../../store/useStatsStore';
import useAuthStore from '../../store/useAuthStore';
import ProgressBar from '../ui/ProgressBar';

const NAV = [
  { id: 'dashboard', label: 'Camp',     icon: LayoutDashboard, emoji: '🏰' },
  { id: 'ideas',     label: 'Ideas',    icon: Lightbulb,       emoji: '💡' },
  { id: 'queue',     label: 'Quests',   icon: ListOrdered,     emoji: '🧭' },
  { id: 'research',  label: 'Scout',    icon: FlaskConical,    emoji: '🔎' },
  { id: 'tasks',     label: 'Forge',    icon: CheckSquare,     emoji: '🛠️' },
  { id: 'completed', label: 'Trophies', icon: Trophy,          emoji: '🏆' },
  { id: 'settings',  label: 'Settings', icon: Settings,        emoji: '⚙️' },
];

const LEVEL_TITLES = ['Beginner', 'Thinker', 'Builder', 'Launcher', 'Founder', 'Unicorn'];

export default function Sidebar({ isOpen, onClose }) {
  const { activeView, setActiveView, ideas } = useIdeaStore();
  const stats = useStatsStore((s) => s.stats);

  const badge = (id) => {
    const m = {
      ideas: ideas.length,
      queue: ideas.filter((i) => i.status === 'queued').length,
      tasks: ideas.filter((i) => i.status === 'building').length,
      completed: ideas.filter((i) => i.status === 'completed').length,
    };
    return m[id] || 0;
  };

  const handleNav = (id) => {
    setActiveView(id);
    onClose();          // close on mobile
  };

  /* XP derived */
  const totalXP   = stats?.totalXP || 0;
  const level     = stats?.level || 1;
  const xpInLevel = totalXP % 100;
  const title     = LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)];

  /* ---- shared panel classes ---- */
  const panelClasses = `
    flex flex-col h-full w-64 bg-surface-2/85 backdrop-blur-xl
    border-r border-edge shadow-card
  `;

  return (
    <>
      {/* ===== Mobile overlay ===== */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* ===== Desktop sidebar (always visible ≥ lg) ===== */}
      <aside className={`hidden lg:flex ${panelClasses} shrink-0`}>
        <SidebarContent
          activeView={activeView}
          onNav={handleNav}
          badge={badge}
          totalXP={totalXP}
          level={level}
          xpInLevel={xpInLevel}
          title={title}
        />
      </aside>

      {/* ===== Mobile sidebar (slide-in) ===== */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className={`fixed inset-y-0 left-0 z-50 lg:hidden ${panelClasses}`}
          >
            {/* Close btn */}
            <button
              onClick={onClose}
              className="absolute top-4 right-3 p-1.5 rounded-lg text-fg-3 hover:text-fg hover:bg-surface-4/50 transition-colors"
            >
              <X size={18} />
            </button>
            <SidebarContent
              activeView={activeView}
              onNav={handleNav}
              badge={badge}
              totalXP={totalXP}
              level={level}
              xpInLevel={xpInLevel}
              title={title}
            />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

/* ========================================================
   Inner content — shared between desktop & mobile panels
   ======================================================== */
function SidebarContent({ activeView, onNav, badge, totalXP, level, xpInLevel, title }) {
  const { user, logout, theme, toggleTheme } = useAuthStore();

  return (
    <>
      {/* ---- Logo ---- */}
      <div className="flex items-center gap-2.5 px-5 h-16 shrink-0 border-b border-edge">
        <img
          src={theme === 'dark' ? '/logo.png' : '/logo1.png'}
          alt="Brainbank Logo"
          className="w-9 h-9 object-contain rounded-xl shadow-md"
        />
        <span className="text-base font-black text-gradient tracking-tight">Brainbank</span>
      </div>

      {/* ---- Navigation ---- */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV.map((item) => {
          const active = activeView === item.id;
          const count  = badge(item.id);
          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              className={`
                group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                text-sm font-medium transition-all duration-200 cursor-pointer
                ${active
                  ? 'bg-gradient-to-r from-purple/12 to-purple-soft/20 text-fg border border-purple/25 shadow-card'
                  : 'text-fg-2 hover:text-fg hover:bg-surface-3/30 border border-transparent'
                }
              `}
            >
              {/* Active indicator bar */}
              {active && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-purple"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}

              <span className="text-base leading-none">{item.emoji}</span>
              <span className="flex-1 text-left">{item.label}</span>
              {count > 0 && (
                <span className={`text-[11px] tabular-nums px-1.5 py-0.5 rounded-md font-medium
                  ${active ? 'bg-purple/20 text-purple-soft' : 'bg-surface-4/60 text-fg-3'}`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ---- XP Widget ---- */}
      <div className="px-3 pb-2 shrink-0">
        <div className="p-3.5 rounded-xl bg-surface-3/60 border border-edge">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber to-amber/60
                flex items-center justify-center">
                <Star size={13} className="text-fg" />
              </div>
              <div>
                <p className="text-xs font-semibold text-fg leading-tight">Level {level}</p>
                <p className="text-[10px] text-fg-3 leading-tight">{title}</p>
              </div>
            </div>
            <span className="text-[11px] font-mono text-amber flex items-center gap-1">
              <Zap size={10} /> {totalXP} XP
            </span>
          </div>
          <ProgressBar value={xpInLevel} max={100} size="sm" color="amber" />
          <p className="text-[10px] text-fg-4 mt-1.5 text-right">{xpInLevel}/100 to Lvl {level + 1}</p>
        </div>
      </div>

      {/* ---- User profile ---- */}
      <div className="px-3 pb-4 shrink-0 border-t border-edge/60 pt-4 mt-2">
        <div className="flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {user?.picture ? (
              <img
                src={user.picture}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover shrink-0 border border-purple/20"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple to-blue flex items-center justify-center text-xs font-bold text-white shrink-0">
                {user?.name ? user.name[0].toUpperCase() : 'F'}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-fg truncate leading-none mb-1">{user?.name || 'Founder'}</p>
              <p className="text-[9px] text-fg-3 truncate leading-none">{user?.email || 'builder@founderos.local'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              title="Toggle Theme"
              aria-label="Toggle Theme"
              className="p-2 rounded-xl text-fg-3 hover:text-purple hover:bg-purple/10 cursor-pointer transition-all duration-200"
            >
              {theme === 'dark' ? <Sun size={15} className="text-purple-soft" /> : <Moon size={15} />}
            </button>
            <button
              type="button"
              onClick={logout}
              title="Log Out"
              aria-label="Log Out"
              className="p-2 rounded-xl text-fg-3 hover:text-red hover:bg-red/10 cursor-pointer transition-all duration-200"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
