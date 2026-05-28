import { Plus, Menu } from 'lucide-react';
import useIdeaStore from '../store/useIdeaStore';

const titles = {
  dashboard: { h: '🏰 Command Camp', sub: 'Level up your founder quests' },
  ideas:     { h: '💡 Idea Vault',   sub: 'Collect sparks before they vanish' },
  queue:     { h: '🧭 Quest Queue',  sub: 'Pick the next mission' },
  research:  { h: '🔎 Scout Lab',    sub: 'Validate before the boss fight' },
  tasks:     { h: '🛠️ Task Forge',   sub: 'Craft the build plan' },
  completed: { h: '🏆 Trophy Hall',  sub: 'Shipped and celebrated' },
  settings:  { h: '⚙️ Game Settings', sub: 'Tune your workspace' },
};

export default function Header({ onMenuToggle }) {
  const { activeView, setAddModalOpen } = useIdeaStore();
  const { h, sub } = titles[activeView] || titles.dashboard;

  return (
    <header className="shrink-0 flex items-center gap-3 sm:gap-4 px-4 sm:px-6 lg:px-8 min-h-16 border-b border-edge bg-surface-2/85 backdrop-blur-lg z-20 shadow-card">
      {/* Mobile hamburger */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 -ml-2 rounded-lg text-fg-3 hover:text-fg hover:bg-surface-4/40 transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-black text-fg leading-tight truncate">{h}</h1>
        <p className="text-xs text-fg-3 truncate hidden sm:block">{sub}</p>
      </div>

      {/* Add Idea */}
      <button
        onClick={() => setAddModalOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-accent-fg
          bg-gradient-to-r from-purple to-purple-soft rounded-xl
          shadow-lg shadow-purple/20
          hover:shadow-purple/30 hover:scale-[1.03]
          active:scale-[0.97] transition-all duration-200 cursor-pointer shrink-0"
      >
        <Plus size={16} />
        <span className="hidden sm:inline">Add Idea ✨</span>
      </button>
    </header>
  );
}
