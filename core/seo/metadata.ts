/**
 * Enhanced metadata generation utilities for SEO
 */

import type { Metadata } from "next";

export interface SeoMetadataOptions {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  twitterCard?: "summary" | "summary_large_image";
  noindex?: boolean;
  nofollow?: boolean;
}

/**
 * Generate comprehensive SEO metadata
 */
export function generateSeoMetadata(options: SeoMetadataOptions): Metadata {
  const {
    title,
    description,
    keywords = [],
    canonical,
    ogImage,
    ogType = "website",
    twitterCard = "summary_large_image",
    noindex = false,
    nofollow = false,
  } = options;

  const metadata: Metadata = {
    title,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    robots: noindex || nofollow ? {
      index: !noindex,
      follow: !nofollow,
    } : undefined,
    alternates: canonical ? {
      canonical,
    } : undefined,
    openGraph: {
      title,
      description,
      type: ogType,
      locale: "pl_PL",
      siteName: "Beskidzku.pl",
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: twitterCard,
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };

  return metadata;
}

/**
 * Generate metadata for peak pages
 */
export function generatePeakMetadata(peak: {
  name: string;
  elevation: number;
  range: string;
  description?: string;
  slug: string;
}): Metadata {
  return generateSeoMetadata({
    title: `${peak.name} (${peak.elevation}m) — ${peak.range} · Beskidzku.pl`,
    description: peak.description || `${peak.name} — szczyt w paśmie ${peak.range} o wysokości ${peak.elevation}m n.p.m. Przewodnik, mapa, parking i szlaki.`,
    keywords: [
      peak.name,
      peak.range,
      "szczyty Beskidów",
      "szlaki górskie",
      "wędrówki Beskidy",
      `${peak.name} jak dojść`,
      `${peak.name} parking`,
    ],
    canonical: `https://beskidzku.pl/szczyt/${peak.slug}`,
    ogType: "article",
  });
}

/**
 * Generate metadata for town/region pages
 */
export function generateTownMetadata(town: {
  name: string;
  description: string;
  slug: string;
}): Metadata {
  return generateSeoMetadata({
    title: `Noclegi i atrakcje ${town.name} — Beskidzku.pl`,
    description: `Noclegi, restauracje i atrakcje w ${town.name}. ${town.description}`,
    keywords: [
      `noclegi ${town.name}`,
      `atrakcje ${town.name}`,
      `co robić w ${town.name}`,
      `${town.name} Beskidy`,
      `hotele ${town.name}`,
      `pensjonaty ${town.name}`,
    ],
    canonical: `https://beskidzku.pl/region/${town.slug}`,
    ogType: "website",
  });
}

/**
 * Generate metadata for attraction pages
 */
export function generateAttractionMetadata(attraction: {
  name: string;
  description?: string;
  town: string;
  slug: string;
  type?: string;
}): Metadata {
  const typeLabel = attraction.type === "attraction" ? "Atrakcja" : "Miejsce";

  return generateSeoMetadata({
    title: `${attraction.name} — ${attraction.town} · Beskidzku.pl`,
    description: attraction.description || `${typeLabel} w ${attraction.town}. Sprawdź godziny otwarcia, ceny i opinie.`,
    keywords: [
      attraction.name,
      `atrakcje ${attraction.town}`,
      `co zobaczyć ${attraction.town}`,
      "Beskidy atrakcje",
      `${attraction.town} turystyka`,
    ],
    canonical: `https://beskidzku.pl/atrakcja/${attraction.slug}`,
    ogType: "article",
  });
}

/**
 * Generate metadata for route/trail pages
 */
export function generateRouteMetadata(route: {
  name: string;
  description?: string;
  slug: string;
  distance?: number;
  duration?: number;
}): Metadata {
  const distanceText = route.distance ? ` (${route.distance}km)` : "";

  return generateSeoMetadata({
    title: `${route.name}${distanceText} — Trasa · Beskidzku.pl`,
    description: route.description || `Trasa ${route.name} w Beskidach. Mapa, profil wysokościowy, czas przejścia i punkty orientacyjne.`,
    keywords: [
      route.name,
      "trasy Beskidy",
      "szlaki Beskidy",
      "wędrówki górskie",
      "trasy piesze Beskidy",
      "mapa szlaków",
    ],
    canonical: `https://beskidzku.pl/trasy/${route.slug}`,
    ogType: "article",
  });
}

/**
 * Generate metadata for planner pages
 */
export function generatePlannerMetadata(planner?: {
  title?: string;
  slug?: string;
}): Metadata {
  if (planner) {
    return generateSeoMetadata({
      title: `${planner.title} — Plan wycieczki · Beskidzku.pl`,
      description: `Gotowy plan wycieczki po Beskidach: ${planner.title}. Mapa, punkty orientacyjne i przewodnik.`,
      keywords: [
        "plan wycieczki Beskidy",
        "gotowe plany Beskidy",
        "organizacja wyjazdu Beskidy",
      ],
      canonical: `https://beskidzku.pl/planer/${planner.slug}`,
      ogType: "article",
    });
  }

  return generateSeoMetadata({
    title: "Planner Beskidów — Zaplanuj wycieczkę w 30 sekund · Beskidzku.pl",
    description: "Interaktywny planner wycieczek po Beskidach. Dodaj szczyty, noclegi i atrakcje. Generuj trasę i plan dnia.",
    keywords: [
      "planner Beskidy",
      "zaplanuj wycieczkę Beskidy",
      "organizacja wyjazdu Beskidy",
      "plan wycieczki góry",
    ],
    canonical: "https://beskidzku.pl/planner",
  });
}

/**
 * Generate metadata for listing/business pages
 */
export function generateListingMetadata(listing: {
  title: string;
  description?: string;
  town: string;
  type: string;
  id: string;
}): Metadata {
  const typeLabels: Record<string, string> = {
    hotel: "Nocleg",
    restaurant: "Restauracja",
    attraction: "Atrakcja",
  };

  const typeLabel = typeLabels[listing.type] || "Miejsce";

  return generateSeoMetadata({
    title: `${listing.title} — ${listing.town} · Beskidzku.pl`,
    description: listing.description || `${typeLabel} w ${listing.town}. ${listing.title} — sprawdź szczegóły, kontakt i lokalizację.`,
    keywords: [
      listing.title,
      `${listing.type} ${listing.town}`,
      `${listing.town} Beskidy`,
    ],
    canonical: `https://beskidzku.pl/listings/${listing.id}`,
    ogType: "article",
  });
}
