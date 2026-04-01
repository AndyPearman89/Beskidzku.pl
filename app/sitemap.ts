import type { MetadataRoute } from "next";
import { getPeaks } from "@/core/api/peaks";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://beskidzku.pl";

const TOWNS = ["szczyrk", "wisla", "ustron", "zywiec", "bielsko-biala", "sucha"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

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

  const townPages: MetadataRoute.Sitemap = TOWNS.map((town) => ({
    url: `${BASE_URL}/region/${town}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.85,
  }));

  const { items: peaks } = getPeaks();
  const peakPages: MetadataRoute.Sitemap = peaks.map((peak) => ({
    url: `${BASE_URL}/szczyt/${peak.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...townPages, ...peakPages];
}
