export default function Skeleton({ className = '', variant = 'rect' }) {
  const base = 'animate-pulse bg-white/5 rounded-lg';

  if (variant === 'circle') {
    return <div className={`${base} rounded-full ${className}`} />;
  }

  if (variant === 'text') {
    return <div className={`${base} h-4 ${className}`} />;
  }

  return <div className={`${base} ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="p-5 rounded-2xl bg-bg-card border border-border-default space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton variant="rect" className="h-5 w-32" />
        <Skeleton variant="rect" className="h-5 w-16" />
      </div>
      <Skeleton variant="text" className="w-full" />
      <Skeleton variant="text" className="w-3/4" />
      <div className="flex gap-2 pt-2">
        <Skeleton variant="rect" className="h-6 w-14" />
        <Skeleton variant="rect" className="h-6 w-14" />
        <Skeleton variant="rect" className="h-6 w-14" />
      </div>
    </div>
  );
}
