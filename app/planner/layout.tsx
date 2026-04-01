import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Planner Wycieczek po Beskidach | Beskidzku.pl",
  description: "Zaplanuj idealną wycieczkę po Beskidach w 30 sekund. AI wygeneruje trasę, dobierze noclegi i atrakcje. Export do Google Maps i GPX.",
  keywords: ["planner beskidy", "plan wycieczki beskidy", "trasy beskidy", "noclegi beskidy", "atrakcje beskidy"],
  openGraph: {
    title: "Planner Wycieczek po Beskidach | Beskidzku.pl",
    description: "Zaplanuj idealną wycieczkę po Beskidach w 30 sekund. AI dobierze trasę, noclegi i atrakcje.",
    type: "website",
    url: "https://beskidzku.pl/planner",
  },
  twitter: {
    card: "summary_large_image",
    title: "Planner Wycieczek po Beskidach",
    description: "Zaplanuj idealną wycieczkę po Beskidach w 30 sekund. AI dobierze trasę, noclegi i atrakcje.",
  },
  alternates: {
    canonical: "https://beskidzku.pl/planner",
  },
};

export default function PlannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Structured data (JSON-LD) for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Planner Beskidów",
    "description": "Narzędzie do planowania wycieczek po Beskidach z AI",
    "url": "https://beskidzku.pl/planner",
    "applicationCategory": "TravelApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "PLN",
    },
    "featureList": [
      "Generowanie tras",
      "Export do GPX",
      "Integracja z Google Maps",
      "Dobór noclegów",
      "Prognoza pogody",
      "Plan dnia"
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  );
}
