/**
 * SEO content generation utilities
 * Generates unique, valuable content to avoid thin/duplicate content issues
 */

/**
 * Generate unique intro for location pages
 */
export function generateLocationIntro(location: {
  name: string;
  description: string;
  hotelsCount: number;
  attractionsCount: number;
  restaurantsCount: number;
}): string {
  const templates = [
    `${location.name} to jedno z najpopularniejszych miejsc w Beskidach. ${location.description} Znajdziesz tutaj ${location.hotelsCount} opcji noclegowych, ${location.attractionsCount} atrakcji turystycznych oraz ${location.restaurantsCount} restauracji.`,

    `Planując wycieczkę do ${location.name}, możesz liczyć na bogatą ofertę turystyczną. ${location.description} W okolicy dostępnych jest ${location.hotelsCount} noclegów, ${location.attractionsCount} miejsc wartych odwiedzenia i ${location.restaurantsCount} lokali gastronomicznych.`,

    `${location.name} przyciąga turystów przez cały rok. ${location.description} Miasto oferuje ${location.hotelsCount} miejsc noclegowych, ${location.attractionsCount} atrakcji oraz ${location.restaurantsCount} punktów gastronomicznych.`,
  ];

  // Use a simple hash of the location name to consistently pick the same template
  const hash = location.name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const templateIndex = hash % templates.length;

  return templates[templateIndex];
}

/**
 * Generate unique intro for peak pages
 */
export function generatePeakIntro(peak: {
  name: string;
  elevation: number;
  range: string;
  difficulty: string;
  hiking_time: number;
}): string {
  const difficultyLabels: Record<string, string> = {
    easy: "łatwym",
    moderate: "umiarkowanym",
    hard: "trudnym",
    very_hard: "bardzo trudnym",
  };

  const hoursMinutes = Math.floor(peak.hiking_time / 60) + "h " + (peak.hiking_time % 60) + "min";
  const difficultyLabel = difficultyLabels[peak.difficulty] || "umiarkowanym";

  const templates = [
    `${peak.name} (${peak.elevation}m n.p.m.) to jeden z charakterystycznych szczytów w paśmie ${peak.range}. Szczyt charakteryzuje się ${difficultyLabel} poziomem trudności, a średni czas podejścia wynosi około ${hoursMinutes}.`,

    `Wejście na ${peak.name} to świetna propozycja dla miłośników górskich wędrówek. Szczyt wznosi się na wysokość ${peak.elevation} metrów w ${peak.range}. Trasa wymaga ${difficultyLabel} przygotowania, a podejście zajmuje średnio ${hoursMinutes}.`,

    `${peak.name} w ${peak.range} to popularna destynacja turystyczna o wysokości ${peak.elevation}m n.p.m. Charakteryzuje się ${difficultyLabel} stopniem trudności, przy czym typowe podejście trwa około ${hoursMinutes}.`,
  ];

  const hash = peak.name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const templateIndex = hash % templates.length;

  return templates[templateIndex];
}

/**
 * Generate unique intro for attraction pages
 */
export function generateAttractionIntro(attraction: {
  name: string;
  town: string;
  type: string;
}): string {
  const templates = [
    `${attraction.name} w ${attraction.town} to miejsce warte odwiedzenia podczas pobytu w Beskidach. Atrakcja cieszy się dużym zainteresowaniem wśród turystów odwiedzających region.`,

    `Odwiedzając ${attraction.town}, koniecznie zajrzyj do ${attraction.name}. To jedna z lokalnych atrakcji, która przyciąga zarówno turystów, jak i mieszkańców regionu.`,

    `${attraction.name} znajduje się w ${attraction.town} i stanowi interesujący punkt na mapie Beskidów. Miejsce to często pojawia się w planach wycieczek po okolicy.`,
  ];

  const hash = attraction.name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const templateIndex = hash % templates.length;

  return templates[templateIndex];
}

/**
 * Generate FAQ content for peaks
 */
export function generatePeakFAQ(peak: {
  name: string;
  elevation: number;
  difficulty: string;
  hiking_time: number;
  parking_lat?: number;
  parking_lng?: number;
}): Array<{ question: string; answer: string }> {
  const hoursMinutes = Math.floor(peak.hiking_time / 60) + "h " + (peak.hiking_time % 60) + "min";

  const difficultyLabels: Record<string, string> = {
    easy: "łatwy",
    moderate: "umiarkowany",
    hard: "trudny",
    very_hard: "bardzo trudny",
  };

  const faq: Array<{ question: string; answer: string }> = [
    {
      question: `Jaka jest wysokość ${peak.name}?`,
      answer: `${peak.name} wznosi się na wysokość ${peak.elevation} metrów nad poziomem morza.`,
    },
    {
      question: `Jak długo trwa wejście na ${peak.name}?`,
      answer: `Średni czas podejścia na ${peak.name} wynosi około ${hoursMinutes}. Czas może się różnić w zależności od kondycji i doświadczenia.`,
    },
    {
      question: `Jaki jest poziom trudności ${peak.name}?`,
      answer: `Trasa na ${peak.name} ma ${difficultyLabels[peak.difficulty]} poziom trudności.`,
    },
  ];

  if (peak.parking_lat && peak.parking_lng) {
    faq.push({
      question: `Gdzie zaparkować jadąc na ${peak.name}?`,
      answer: `W pobliżu ${peak.name} znajduje się parking, z którego można rozpocząć wędrówkę. Szczegółową lokalizację parkingu znajdziesz na mapie na tej stronie.`,
    });
  }

  return faq;
}

/**
 * Generate FAQ content for locations
 */
export function generateLocationFAQ(location: {
  name: string;
  hotelsCount: number;
  attractionsCount: number;
}): Array<{ question: string; answer: string }> {
  return [
    {
      question: `Co warto zobaczyć w ${location.name}?`,
      answer: `W ${location.name} znajdziesz ${location.attractionsCount} atrakcji turystycznych wartych odwiedzenia. Sprawdź pełną listę na naszej stronie.`,
    },
    {
      question: `Ile jest noclegów w ${location.name}?`,
      answer: `W naszej bazie znajdziesz ${location.hotelsCount} opcji noclegowych w ${location.name}, w tym hotele, pensjonaty i apartamenty.`,
    },
    {
      question: `Jak zaplanować wyjazd do ${location.name}?`,
      answer: `Skorzystaj z naszego plannera Beskidów, aby szybko zaplanować wycieczkę. Wybierz noclegi, atrakcje i szczyty, a my wygenerujemy dla Ciebie optymalną trasę.`,
    },
    {
      question: `Kiedy najlepiej odwiedzić ${location.name}?`,
      answer: `${location.name} jest atrakcyjne przez cały rok. Latem możesz cieszyć się wędrówkami i aktywnościami outdoor, zimą dostępne są atrakcje narciarskie i zimowe.`,
    },
  ];
}

/**
 * Generate route description
 */
export function generateRouteDescription(route: {
  name: string;
  distance?: number;
  duration?: number;
  elevationGain?: number;
}): string {
  const distanceText = route.distance ? `Długość trasy wynosi ${route.distance} km` : "Trasa";
  const durationText = route.duration ? `, a jej przejście zajmuje około ${Math.floor(route.duration / 60)}h ${route.duration % 60}min` : "";
  const elevationText = route.elevationGain ? ` Suma podejść to ${route.elevationGain}m.` : "";

  return `${distanceText}${durationText}.${elevationText} Sprawdź szczegółową mapę, profil wysokościowy i punkty orientacyjne na trasie.`;
}

/**
 * Generate internal linking suggestions
 */
export function generateRelatedLinks(context: {
  type: "peak" | "town" | "attraction" | "route";
  name: string;
  town?: string;
  range?: string;
}): Array<{ text: string; url: string }> {
  const links: Array<{ text: string; url: string }> = [];

  if (context.type === "peak") {
    if (context.town) {
      links.push({
        text: `Noclegi w pobliżu ${context.name}`,
        url: `/region/${context.town.toLowerCase().replace(/\s+/g, "-")}`,
      });
    }
    links.push({
      text: "Wszystkie szczyty Beskidów",
      url: "/szczyty",
    });
    links.push({
      text: "Zaplanuj wycieczkę",
      url: "/planner",
    });
  } else if (context.type === "town") {
    links.push({
      text: `Atrakcje w ${context.name}`,
      url: `/listings?type=attraction&town=${context.name}`,
    });
    links.push({
      text: `Noclegi w ${context.name}`,
      url: `/listings?type=hotel&town=${context.name}`,
    });
    links.push({
      text: "Szczyty w okolicy",
      url: "/szczyty",
    });
  } else if (context.type === "attraction") {
    if (context.town) {
      links.push({
        text: `Więcej atrakcji w ${context.town}`,
        url: `/region/${context.town.toLowerCase().replace(/\s+/g, "-")}`,
      });
      links.push({
        text: `Noclegi w ${context.town}`,
        url: `/listings?type=hotel&town=${context.town}`,
      });
    }
  }

  return links;
}
