"use client";

import { useState } from "react";
import BottomSheet from "./BottomSheet";
import type { Listing } from "@/core/api/listings";

interface DiscoveryMapSectionProps {
  listings: Pick<Listing, "id" | "title" | "town" | "type" | "lat" | "lng" | "address" | "packageLevel" | "description">[];
}

export default function DiscoveryMapSection({ listings }: DiscoveryMapSectionProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const featuredListings = listings.slice(0, 6);

  return (
    <>
      {/* Desktop: side-by-side layout */}
      <div className="hidden lg:grid lg:grid-cols-2 gap-6 items-stretch">
        {/* Listings column */}
        <div className="rounded-2xl bg-white border border-[var(--color-border)] shadow-sm p-5 space-y-4">
          <div className="flex flex-wrap gap-2">
            {["noclegi", "atrakcje", "szlaki"].map((filter) => (
              <button
                key={filter}
                className={`px-3 py-2 rounded-full border text-sm font-semibold transition-colors ${
                  selectedFilter === filter
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                    : "border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                }`}
                type="button"
                onClick={() => setSelectedFilter(filter === selectedFilter ? null : filter)}
              >
                {filter}
              </button>
            ))}
            <button
              type="button"
              className="px-3 py-2 rounded-full bg-[var(--color-primary)] text-white text-sm font-semibold shadow-[0_12px_24px_rgba(227,6,19,0.14)]"
            >
              Sortuj: popularność
            </button>
          </div>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {featuredListings.map((listing) => (
              <a
                key={listing.id}
                href={`/listings?q=${encodeURIComponent(listing.title)}`}
                className="block rounded-xl border border-[var(--color-border)] p-4 hover:border-[var(--color-primary)] hover:shadow-md transition-all bg-[var(--color-bg)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm uppercase tracking-wide text-[var(--color-muted)]">{listing.type}</p>
                    <h3 className="text-lg font-semibold leading-tight">{listing.title}</h3>
                    <p className="text-sm text-[var(--color-muted)]">
                      📍 {listing.town} · {listing.address || "adres wkrótce"}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-semibold ${
                      listing.packageLevel === "PREMIUM+"
                        ? "bg-[var(--color-primary)] text-white"
                        : listing.packageLevel === "PREMIUM"
                        ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {listing.packageLevel}
                  </span>
                </div>
                <p className="text-sm text-[var(--color-text)] mt-2 line-clamp-2">{listing.description}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Map column */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#ffecef] via-white to-[#f6f7f9] border border-[var(--color-border)] shadow-[0_25px_50px_rgba(0,0,0,0.08)] p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide">Mapa</p>
              <h3 className="text-xl font-bold">Markery premium wyróżnione</h3>
            </div>
            <span className="text-[var(--color-primary)] font-semibold text-sm bg-white border border-[var(--color-border)] px-3 py-1.5 rounded-full shadow-sm">
              Widok live
            </span>
          </div>
          <div className="relative aspect-[4/3] rounded-2xl bg-white border border-[var(--color-border)] overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(227,6,19,0.08),transparent_45%),radial-gradient(circle_at_70%_60%,rgba(0,0,0,0.05),transparent_40%)]" />
            <div className="absolute inset-0">
              {featuredListings.slice(0, 4).map((listing, idx) => {
                const positions = [
                  { top: "18%", left: "22%" },
                  { top: "45%", left: "68%" },
                  { top: "62%", left: "30%" },
                  { top: "28%", left: "52%" },
                ];
                const pos = positions[idx] ?? { top: "40%", left: "50%" };
                return (
                  <div
                    key={listing.id}
                    className="absolute flex flex-col items-center gap-1"
                    style={pos}
                  >
                    <div className="relative">
                      <span className="absolute -inset-2 rounded-full bg-[var(--color-primary-soft)] blur-sm" />
                      <span className="relative inline-flex items-center justify-center h-9 w-9 rounded-full bg-[var(--color-primary)] text-white shadow-[0_15px_30px_rgba(227,6,19,0.4)]">
                        {listing.type.slice(0, 1).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-xs font-semibold bg-white border border-[var(--color-border)] rounded-full px-3 py-1 shadow-sm">
                      {listing.town}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <p className="mt-4 text-sm text-[var(--color-muted)]">
            ✨ Większe markery = pakiet PREMIUM+ | widok interaktywny na /listings
          </p>
        </div>
      </div>

      {/* Mobile: map with bottom sheet */}
      <div className="lg:hidden">
        {/* Map - full width on mobile */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#ffecef] via-white to-[#f6f7f9] border border-[var(--color-border)] shadow-[0_25px_50px_rgba(0,0,0,0.08)] p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide">Mapa</p>
              <h3 className="text-lg font-bold">Odkrywaj miejsca</h3>
            </div>
            <button
              onClick={() => setIsSheetOpen(true)}
              className="px-3 py-1.5 rounded-full bg-[var(--color-primary)] text-white text-xs font-semibold shadow-[0_8px_16px_rgba(227,6,19,0.2)] hover:scale-105 transition-transform"
              type="button"
            >
              Zobacz listę ({featuredListings.length})
            </button>
          </div>
          <div className="relative aspect-[16/9] rounded-xl bg-white border border-[var(--color-border)] overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(227,6,19,0.08),transparent_45%),radial-gradient(circle_at_70%_60%,rgba(0,0,0,0.05),transparent_40%)]" />
            <div className="absolute inset-0">
              {featuredListings.slice(0, 4).map((listing, idx) => {
                const positions = [
                  { top: "15%", left: "20%" },
                  { top: "50%", left: "70%" },
                  { top: "65%", left: "25%" },
                  { top: "25%", left: "60%" },
                ];
                const pos = positions[idx] ?? { top: "40%", left: "50%" };
                return (
                  <button
                    key={listing.id}
                    className="absolute flex flex-col items-center gap-1"
                    style={pos}
                    onClick={() => setIsSheetOpen(true)}
                    type="button"
                  >
                    <div className="relative">
                      <span className="absolute -inset-1.5 rounded-full bg-[var(--color-primary-soft)] blur-sm" />
                      <span className="relative inline-flex items-center justify-center h-8 w-8 rounded-full bg-[var(--color-primary)] text-white shadow-[0_12px_20px_rgba(227,6,19,0.4)] text-xs font-bold">
                        {listing.type.slice(0, 1).toUpperCase()}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Sheet with listings */}
        <BottomSheet
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          snapPoints={[40, 70, 90]}
          defaultSnap={0}
          title="Dostępne miejsca"
          showHandle={true}
        >
          <div className="px-6 py-4 space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {["noclegi", "atrakcje", "szlaki"].map((filter) => (
                <button
                  key={filter}
                  className={`px-3 py-2 rounded-full border text-sm font-semibold transition-colors ${
                    selectedFilter === filter
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                      : "border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                  }`}
                  type="button"
                  onClick={() => setSelectedFilter(filter === selectedFilter ? null : filter)}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Listings */}
            <div className="space-y-3">
              {featuredListings.map((listing) => (
                <a
                  key={listing.id}
                  href={`/listings?q=${encodeURIComponent(listing.title)}`}
                  className="block rounded-xl border border-[var(--color-border)] p-4 hover:border-[var(--color-primary)] hover:shadow-md transition-all bg-white active:scale-[0.98]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">{listing.type}</p>
                      <h3 className="text-base font-semibold leading-tight">{listing.title}</h3>
                      <p className="text-xs text-[var(--color-muted)] mt-1">
                        📍 {listing.town} · {listing.address || "adres wkrótce"}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-semibold whitespace-nowrap ${
                        listing.packageLevel === "PREMIUM+"
                          ? "bg-[var(--color-primary)] text-white"
                          : listing.packageLevel === "PREMIUM"
                          ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {listing.packageLevel}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-text)] mt-2 line-clamp-2">{listing.description}</p>
                </a>
              ))}
            </div>

            {/* View all link */}
            <div className="pt-4 pb-6">
              <a
                href="/listings"
                className="block w-full text-center px-6 py-3 rounded-full bg-[var(--color-primary)] text-white font-semibold shadow-[0_12px_24px_rgba(227,6,19,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                Zobacz wszystkie miejsca →
              </a>
            </div>
          </div>
        </BottomSheet>
      </div>
    </>
  );
}
