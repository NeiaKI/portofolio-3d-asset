export function PortfolioGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="h-48 w-full animate-pulse bg-muted/50" />
          <div className="space-y-3 p-4">
            <div className="flex gap-2">
              <div className="h-5 w-16 animate-pulse rounded-full bg-muted/60" />
              <div className="h-5 w-10 animate-pulse rounded-full bg-muted/40" />
            </div>
            <div className="h-4 w-3/4 animate-pulse rounded bg-muted/50" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-muted/40" />
          </div>
        </div>
      ))}
    </div>
  );
}
