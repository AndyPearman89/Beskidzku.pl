"use client";

interface TimelineItem {
  time: string;
  activity: string;
  location: string;
  notes?: string;
}

interface PlanTimelineProps {
  timeline: TimelineItem[];
  loading?: boolean;
}

export default function PlanTimeline({ timeline, loading = false }: PlanTimelineProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-5">
        <h3 className="text-lg font-bold mb-4">Plan dnia</h3>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (timeline.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-5">
        <h3 className="text-lg font-bold mb-4">Plan dnia</h3>
        <div className="text-center py-8 text-[var(--color-muted)]">
          <p className="text-3xl mb-2">📅</p>
          <p className="text-sm">Plan dnia zostanie wygenerowany wkrótce...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Plan dnia</h3>
        <span className="text-xs px-3 py-1 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-semibold">
          {timeline.length} aktywności
        </span>
      </div>

      <div className="space-y-4">
        {timeline.map((item, index) => (
          <div key={index} className="relative">
            {/* Timeline connector line */}
            {index < timeline.length - 1 && (
              <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-[var(--color-border)]" />
            )}

            <div className="flex items-start gap-4">
              {/* Time indicator */}
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-[var(--color-primary)] text-white font-bold flex items-center justify-center text-sm">
                {item.time}
              </div>

              {/* Activity details */}
              <div className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
                <div className="font-semibold text-sm text-[var(--color-text)]">
                  {item.activity}
                </div>
                <div className="text-sm text-[var(--color-muted)] mt-1">
                  📍 {item.location}
                </div>
                {item.notes && (
                  <div className="text-xs text-[var(--color-muted)] mt-2 italic">
                    {item.notes}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info footer */}
      <div className="mt-4 pt-4 border-t border-[var(--color-border)] text-xs text-[var(--color-muted)]">
        💡 Czasy są szacunkowe. Dostosuj je do swojego tempa.
      </div>
    </div>
  );
}
