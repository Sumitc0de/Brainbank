import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search ideas...', className = '' }) {
  return (
    <div className={`relative group ${className}`}>
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent-purple transition-colors"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-14 py-2.5 text-sm bg-bg-input border border-border-default rounded-xl
          text-text-primary placeholder:text-text-muted
          focus:border-accent-purple focus:shadow-[0_0_0_3px_rgba(168,85,247,0.12)]
          transition-all duration-200"
      />
      <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5
        px-1.5 py-0.5 text-[10px] text-text-muted bg-white/5 border border-border-default rounded font-mono">
        ⌘K
      </kbd>
    </div>
  );
}
