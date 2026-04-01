/**
 * Internal linking strategy helpers
 */

export interface InternalLink {
  text: string;
  url: string;
  rel?: string;
}

/**
 * Generate internal links for peak pages
 */
export function getPeakInternalLinks(peak: {
  name: string;
  range: string;
  slug: string;
}): InternalLink[] {
  const rangeSlug = peak.range.toLowerCase().replace(/\s+/g, "-");

  return [
    {
      text: "Szczyty Beskidów",
      url: "/szczyty",
    },
    {
      text: `Szczyty ${peak.range}`,
      url: `/szczyty?range=${encodeURIComponent(peak.range)}`,
    },
    {
      text: "Zaplanuj wycieczkę",
      url: `/planner?peak=${peak.slug}`,
    },
    {
      text: "Noclegi w Beskidach",
      url: "/listings?type=hotel",
    },
  ];
}

/**
 * Generate internal links for town pages
 */
export function getTownInternalLinks(town: {
  name: string;
  slug: string;
}): InternalLink[] {
  return [
    {
      text: `Noclegi w ${town.name}`,
      url: `/listings?type=hotel&town=${encodeURIComponent(town.name)}`,
    },
    {
      text: `Atrakcje w ${town.name}`,
      url: `/listings?type=attraction&town=${encodeURIComponent(town.name)}`,
    },
    {
      text: `Restauracje w ${town.name}`,
      url: `/listings?type=restaurant&town=${encodeURIComponent(town.name)}`,
    },
    {
      text: "Szczyty w okolicy",
      url: "/szczyty",
    },
    {
      text: "Zaplanuj wycieczkę",
      url: "/planner",
    },
  ];
}

/**
 * Generate internal links for attraction pages
 */
export function getAttractionInternalLinks(attraction: {
  name: string;
  town: string;
  type: string;
}): InternalLink[] {
  return [
    {
      text: `Atrakcje w ${attraction.town}`,
      url: `/listings?type=attraction&town=${encodeURIComponent(attraction.town)}`,
    },
    {
      text: `Noclegi w ${attraction.town}`,
      url: `/listings?type=hotel&town=${encodeURIComponent(attraction.town)}`,
    },
    {
      text: "Katalog atrakcji",
      url: "/listings?type=attraction",
    },
    {
      text: "Zaplanuj wycieczkę",
      url: "/planner",
    },
  ];
}

/**
 * Generate breadcrumb links
 */
export function generateBreadcrumbs(segments: Array<{ name: string; url: string }>): Array<{ name: string; url: string }> {
  // Always start with home
  return [
    { name: "Strona główna", url: "https://beskidzku.pl" },
    ...segments,
  ];
}

/**
 * Generate footer links for SEO
 */
export function getFooterLinks(): Array<{ category: string; links: InternalLink[] }> {
  return [
    {
      category: "Noclegi",
      links: [
        { text: "Noclegi Szczyrk", url: "/region/szczyrk" },
        { text: "Noclegi Wisła", url: "/region/wisla" },
        { text: "Noclegi Ustroń", url: "/region/ustron" },
        { text: "Noclegi Żywiec", url: "/region/zywiec" },
        { text: "Wszystkie noclegi", url: "/listings?type=hotel" },
      ],
    },
    {
      category: "Szczyty",
      links: [
        { text: "Beskid Śląski", url: "/szczyty?range=Beskid+Śląski" },
        { text: "Beskid Żywiecki", url: "/szczyty?range=Beskid+Żywiecki" },
        { text: "Beskid Mały", url: "/szczyty?range=Beskid+Mały" },
        { text: "Wszystkie szczyty", url: "/szczyty" },
      ],
    },
    {
      category: "Atrakcje",
      links: [
        { text: "Atrakcje Szczyrk", url: "/listings?type=attraction&town=Szczyrk" },
        { text: "Atrakcje Wisła", url: "/listings?type=attraction&town=Wisła" },
        { text: "Wszystkie atrakcje", url: "/listings?type=attraction" },
      ],
    },
    {
      category: "Narzędzia",
      links: [
        { text: "Planner Beskidów", url: "/planner" },
        { text: "Katalog firm", url: "/listings" },
        { text: "Dodaj firmę", url: "/dodaj-firme" },
      ],
    },
  ];
}

/**
 * Generate contextual CTA links
 */
export function getContextualCTA(context: {
  type: "peak" | "town" | "attraction" | "route" | "planner";
  name?: string;
  town?: string;
  lat?: number;
  lng?: number;
}): InternalLink[] {
  const ctas: InternalLink[] = [];

  switch (context.type) {
    case "peak":
      if (context.lat && context.lng) {
        ctas.push({
          text: "Dodaj do plannera",
          url: `/planner?lat=${context.lat}&lng=${context.lng}&name=${encodeURIComponent(context.name || "")}`,
        });
      }
      ctas.push({
        text: "Szukaj noclegu w okolicy",
        url: "/listings?type=hotel",
      });
      break;

    case "town":
      ctas.push({
        text: `Noclegi w ${context.name}`,
        url: `/listings?type=hotel&town=${encodeURIComponent(context.name || "")}`,
      });
      ctas.push({
        text: "Zaplanuj wycieczkę",
        url: "/planner",
      });
      break;

    case "attraction":
      if (context.town) {
        ctas.push({
          text: `Noclegi w ${context.town}`,
          url: `/listings?type=hotel&town=${encodeURIComponent(context.town)}`,
        });
      }
      ctas.push({
        text: "Dodaj do plannera",
        url: "/planner",
      });
      break;

    case "route":
      ctas.push({
        text: "Szukaj noclegu",
        url: "/listings?type=hotel",
      });
      ctas.push({
        text: "Zaplanuj wycieczkę",
        url: "/planner",
      });
      break;

    case "planner":
      ctas.push({
        text: "Przeglądaj szczyty",
        url: "/szczyty",
      });
      ctas.push({
        text: "Znajdź nocleg",
        url: "/listings?type=hotel",
      });
      break;
  }

  return ctas;
}
