/**
 * JSON-LD Schema builders for SEO
 * Implements Schema.org structured data types for better search engine understanding
 */

export interface Organization {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  url: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
  contactPoint?: {
    "@type": "ContactPoint";
    telephone?: string;
    contactType: string;
    areaServed?: string;
    availableLanguage?: string[];
  };
}

export interface LocalBusiness extends Organization {
  "@type": "LocalBusiness";
  address?: {
    "@type": "PostalAddress";
    streetAddress?: string;
    addressLocality: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry: string;
  };
  geo?: {
    "@type": "GeoCoordinates";
    latitude: number;
    longitude: number;
  };
  telephone?: string;
  priceRange?: string;
}

export interface Place {
  "@context": "https://schema.org";
  "@type": "Place" | "TouristAttraction" | "Mountain";
  name: string;
  description?: string;
  geo: {
    "@type": "GeoCoordinates";
    latitude: number;
    longitude: number;
    elevation?: number;
  };
  address?: {
    "@type": "PostalAddress";
    addressLocality?: string;
    addressRegion?: string;
    addressCountry: string;
  };
  image?: string | string[];
  url?: string;
}

export interface BreadcrumbList {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }>;
}

export interface FAQPage {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: Array<{
    "@type": "Question";
    name: string;
    acceptedAnswer: {
      "@type": "Answer";
      text: string;
    };
  }>;
}

export interface Article {
  "@context": "https://schema.org";
  "@type": "Article";
  headline: string;
  description?: string;
  author?: {
    "@type": "Organization" | "Person";
    name: string;
  };
  publisher?: {
    "@type": "Organization";
    name: string;
    logo?: {
      "@type": "ImageObject";
      url: string;
    };
  };
  datePublished?: string;
  dateModified?: string;
  image?: string | string[];
  url?: string;
}

/**
 * Create Organization schema for homepage
 */
export function createOrganizationSchema(data: {
  name: string;
  url: string;
  description?: string;
  logo?: string;
  sameAs?: string[];
}): Organization {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: data.name,
    url: data.url,
    description: data.description,
    logo: data.logo,
    sameAs: data.sameAs,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      areaServed: "PL",
      availableLanguage: ["Polish"],
    },
  };
}

/**
 * Create LocalBusiness schema for towns/regions
 */
export function createLocalBusinessSchema(data: {
  name: string;
  description: string;
  url: string;
  addressLocality: string;
  latitude: number;
  longitude: number;
  telephone?: string;
}): LocalBusiness {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: data.name,
    description: data.description,
    url: data.url,
    address: {
      "@type": "PostalAddress",
      addressLocality: data.addressLocality,
      addressRegion: "Śląskie",
      addressCountry: "PL",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: data.latitude,
      longitude: data.longitude,
    },
    telephone: data.telephone,
  };
}

/**
 * Create Mountain/Place schema for peaks
 */
export function createMountainSchema(data: {
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  elevation: number;
  addressLocality?: string;
  url?: string;
  image?: string | string[];
}): Place {
  return {
    "@context": "https://schema.org",
    "@type": "Mountain",
    name: data.name,
    description: data.description,
    geo: {
      "@type": "GeoCoordinates",
      latitude: data.latitude,
      longitude: data.longitude,
      elevation: data.elevation,
    },
    address: data.addressLocality ? {
      "@type": "PostalAddress",
      addressLocality: data.addressLocality,
      addressRegion: "Beskidy",
      addressCountry: "PL",
    } : undefined,
    url: data.url,
    image: data.image,
  };
}

/**
 * Create TouristAttraction schema for attractions
 */
export function createAttractionSchema(data: {
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  addressLocality: string;
  url?: string;
  image?: string | string[];
}): Place {
  return {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: data.name,
    description: data.description,
    geo: {
      "@type": "GeoCoordinates",
      latitude: data.latitude,
      longitude: data.longitude,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: data.addressLocality,
      addressRegion: "Beskidy",
      addressCountry: "PL",
    },
    url: data.url,
    image: data.image,
  };
}

/**
 * Create BreadcrumbList schema
 */
export function createBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>): BreadcrumbList {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

/**
 * Create FAQPage schema
 */
export function createFAQSchema(questions: Array<{ question: string; answer: string }>): FAQPage {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };
}

/**
 * Create Article schema for routes/guides
 */
export function createArticleSchema(data: {
  headline: string;
  description?: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
  image?: string | string[];
  url?: string;
}): Article {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.headline,
    description: data.description,
    author: {
      "@type": "Organization",
      name: data.author || "Beskidzku.pl",
    },
    publisher: {
      "@type": "Organization",
      name: "Beskidzku.pl",
      logo: {
        "@type": "ImageObject",
        url: "https://beskidzku.pl/logo.png",
      },
    },
    datePublished: data.datePublished,
    dateModified: data.dateModified,
    image: data.image,
    url: data.url,
  };
}

/**
 * Helper to render JSON-LD script tag
 */
export function renderJsonLd(schema: object): string {
  return JSON.stringify(schema);
}
