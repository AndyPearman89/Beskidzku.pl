import type { MetadataRoute } from "next";
import { getPeaks } from "@/core/api/peaks";
import { getListings } from "@/core/api/listings";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://beskidzku.pl";

const TOWNS = ["szczyrk", "wisla", "ustron", "zywiec", "bielsko-biala", "sucha"];

// Demo routes data
const ROUTES = [
  "skrzyczne-z-doliny-mietusiej",
  "babia-gora-petla",
  "pilsko-z-korbielowa",
];

// Demo saved planners
const SAVED_PLANNERS = [
  "weekend-w-szczyrku",
  "babia-gora-ekspedycja",
  "rodzinny-wypad-wisla",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/listings`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/szczyty`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/planner`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/dodaj-firme`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Region/town pages
  const townPages: MetadataRoute.Sitemap = TOWNS.map((town) => ({
    url: `${BASE_URL}/region/${town}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.85,
  }));

  // Peak detail pages
  const peaksResult = getPeaks({});
  const peakPages: MetadataRoute.Sitemap = peaksResult.items.map((peak) => ({
    url: `${BASE_URL}/szczyt/${peak.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Attraction pages (from listings with type=attraction)
  const { items: attractions } = await getListings({ type: "attraction", perPage: 100 });
  const attractionPages: MetadataRoute.Sitemap = attractions.map((attraction) => {
    const slug = attraction.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    return {
      url: `${BASE_URL}/atrakcja/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.65,
    };
  });

  // Route/trail pages
  const routePages: MetadataRoute.Sitemap = ROUTES.map((route) => ({
    url: `${BASE_URL}/trasy/${route}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Saved planner pages
  const plannerPages: MetadataRoute.Sitemap = SAVED_PLANNERS.map((planner) => ({
    url: `${BASE_URL}/planer/${planner}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Listing pages (all listings)
  const { items: listings } = await getListings({ perPage: 100 });
  const listingPages: MetadataRoute.Sitemap = listings.map((listing) => ({
    url: `${BASE_URL}/listings/${listing.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...townPages,
    ...peakPages,
    ...attractionPages,
    ...routePages,
    ...plannerPages,
    ...listingPages,
  ];
}
