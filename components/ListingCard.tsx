"use client";

import type { PackageLevel } from '@/core/api/listings';

interface ListingCardProps {
  id: string;
  title: string;
  type: string;
  town: string;
  description: string;
  rating?: number;
  price?: string;
  packageLevel: PackageLevel;
  imageUrl?: string;
  website?: string;
  phone?: string;
  onLeadClick?: () => void;
}

const PACKAGE_STYLES = {
  'FREE': {
    badge: 'bg-gray-100 text-gray-700 border-gray-300',
    border: 'border-gray-200',
  },
  'PREMIUM': {
    badge: 'bg-[var(--color-primary-soft)] text-[var(--color-primary)] border-[var(--color-primary)]',
    border: 'border-[var(--color-primary)]',
  },
  'PREMIUM+': {
    badge: 'bg-gradient-to-r from-amber-400 to-orange-500 text-white border-amber-500',
    border: 'border-amber-400',
  },
};

export default function ListingCard({
  id,
  title,
  type,
  town,
  description,
  rating,
  price,
  packageLevel,
  imageUrl,
  website,
  phone,
  onLeadClick,
}: ListingCardProps) {
  const styles = PACKAGE_STYLES[packageLevel];

  const handleBookingClick = () => {
    // Track conversion
    if (typeof window !== 'undefined') {
      // Analytics tracking would go here
      console.log('Booking clicked:', id);
    }

    if (website) {
      window.open(website, '_blank', 'noopener,noreferrer');
    } else if (onLeadClick) {
      onLeadClick();
    }
  };

  const handleLeadClick = () => {
    if (onLeadClick) {
      onLeadClick();
    } else {
      // Default lead form behavior
      alert(`Wyślij zapytanie do: ${title}\n\nFunkcja w budowie.`);
    }
  };

  return (
    <div className={`rounded-2xl border-2 ${styles.border} bg-white shadow-sm hover:shadow-md transition-all p-5`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wide font-semibold text-[var(--color-muted)]">
              {type}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${styles.badge}`}>
              {packageLevel}
            </span>
          </div>
          <h3 className="text-lg font-bold text-[var(--color-text)] leading-tight">
            {title}
          </h3>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            📍 {town}
          </p>
        </div>

        {/* Rating */}
        {rating && (
          <div className="flex flex-col items-end">
            <div className="text-2xl font-bold text-[var(--color-primary)]">
              {rating.toFixed(1)}
            </div>
            <div className="text-xs text-[var(--color-muted)]">⭐⭐⭐⭐⭐</div>
          </div>
        )}
      </div>

      {/* Image placeholder (if provided) */}
      {imageUrl && (
        <div className="mb-3 rounded-xl overflow-hidden aspect-video bg-gray-100">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Description */}
      <p className="text-sm text-[var(--color-text)] mb-4 line-clamp-2">
        {description}
      </p>

      {/* Price */}
      {price && (
        <div className="mb-4 pb-4 border-b border-[var(--color-border)]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--color-muted)]">Cena</span>
            <span className="text-lg font-bold text-[var(--color-primary)]">{price}</span>
          </div>
        </div>
      )}

      {/* CTA Buttons */}
      <div className="grid grid-cols-2 gap-3">
        {/* Primary CTA - Book/Visit */}
        <button
          onClick={handleBookingClick}
          className="rounded-xl bg-[var(--color-primary)] text-white font-semibold py-3 text-sm hover:bg-[var(--color-primary-hover)] transition-colors shadow-[0_10px_20px_rgba(227,6,19,0.15)]"
        >
          {website ? '🌐 Strona' : '👁️ Zobacz'}
        </button>

        {/* Secondary CTA - Lead */}
        <button
          onClick={handleLeadClick}
          className="rounded-xl border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-semibold py-3 text-sm hover:bg-[var(--color-primary-soft)] transition-colors"
        >
          {phone ? '📞 Zadzwoń' : '✉️ Zapytaj'}
        </button>
      </div>

      {/* Premium+ features */}
      {packageLevel === 'PREMIUM+' && (
        <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2 py-1 rounded-full bg-green-50 text-green-700 font-semibold">
              ✓ Zweryfikowany
            </span>
            <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold">
              ⚡ Szybka odpowiedź
            </span>
            <span className="px-2 py-1 rounded-full bg-purple-50 text-purple-700 font-semibold">
              💎 Top wybór
            </span>
          </div>
        </div>
      )}

      {/* Affiliate disclaimer (for PREMIUM+) */}
      {packageLevel === 'PREMIUM+' && (
        <p className="mt-2 text-xs text-[var(--color-muted)] italic">
          Link partnerski · Wspierasz naszą platformę
        </p>
      )}
    </div>
  );
}
