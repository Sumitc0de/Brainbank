export default function ScoreSlider({ label, value = 5, onChange, min = 1, max = 10 }) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="grid grid-cols-[4.5rem_1fr_2rem] items-center gap-3 sm:gap-4">
      {label && (
        <span className="text-xs font-medium text-fg-2 truncate">{label}</span>
      )}
      <input
        type="range" min={min} max={max} value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        aria-label={label}
        className="w-full h-1"
        style={{
          background: `linear-gradient(to right, #df2046 0%, #ff9f33 ${pct}%, rgba(45,111,41,.12) ${pct}%, rgba(45,111,41,.12) 100%)`,
        }}
      />
      <span className="text-sm font-bold text-fg text-right tabular-nums">{value}</span>
    </div>
  );
}
