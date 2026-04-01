import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Seed Listings
  console.log('📝 Seeding listings...')

  const listings = [
    {
      title: "Hotel Szczyrk Mountain Resort",
      type: "hotel",
      category: "nocleg",
      town: "Szczyrk",
      lat: 49.7156,
      lng: 19.0343,
      address: "ul. Myśliwska 2, 43-370 Szczyrk",
      description: "Czterogwiazdkowy hotel u podnóża Skrzycznego z aquaparkiem i SPA. Idealne miejsce dla rodzin i par szukających komfortu w górach.",
      phone: "+48 33 829 80 00",
      website: "https://szczyrk-mountain-resort.pl",
      amenities: ["aquapark", "SPA", "restaurant", "parking", "wifi"],
      packageLevel: "PREMIUM_PLUS" as const,
    },
    {
      title: "Restauracja Regionalka",
      type: "restaurant",
      category: "gastronomia",
      town: "Wisła",
      lat: 49.6504,
      lng: 18.8565,
      address: "ul. 1 Maja 10, 43-460 Wisła",
      description: "Tradycyjna kuchnia beskidzka — żurek, gołąbki, oscypek. Serwujemy regionalne potrawy z lokalnych składników.",
      phone: "+48 33 855 12 34",
      amenities: ["parking", "wifi", "outdoor seating"],
      packageLevel: "PREMIUM" as const,
    },
    {
      title: "Browar Żywiec",
      type: "attraction",
      category: "atrakcja",
      town: "Żywiec",
      lat: 49.6888,
      lng: 19.1979,
      address: "ul. Browarna 88, 34-300 Żywiec",
      description: "Muzeum browaru z degustacją i zwiedzaniem. Jeden z najstarszych browarów w Polsce — historia sięgająca 1856 roku.",
      phone: "+48 33 861 22 00",
      website: "https://zywieckibrowar.pl",
      amenities: ["guided tours", "tasting"],
      packageLevel: "PREMIUM_PLUS" as const,
    },
    {
      title: "Zamek Sucha Beskidzka",
      type: "attraction",
      category: "atrakcja",
      town: "Sucha Beskidzka",
      lat: 49.7399,
      lng: 19.5974,
      address: "ul. Zamkowa 1, 34-200 Sucha Beskidzka",
      description: "Renesansowy zamek z XVI w. — ekspozycje historyczne i widok na Beskid Makowski. Idealne miejsce na rodzinną wycieczkę.",
      amenities: ["guided tours", "parking"],
      packageLevel: "FREE" as const,
    },
    {
      title: "SPA Ustroń Health Resort",
      type: "spa",
      category: "zdrowie",
      town: "Ustroń",
      lat: 49.7197,
      lng: 18.8090,
      address: "ul. Zdrojowa 14, 43-450 Ustroń",
      description: "Uzdrowiskowy ośrodek SPA z basenami termalnymi i zabiegami leczniczymi. Najlepsze SPA w Beskidach Śląskich.",
      phone: "+48 33 854 31 00",
      amenities: ["thermal pools", "massage", "sauna", "restaurant"],
      packageLevel: "PREMIUM" as const,
    },
    {
      title: "Pensjonat Górski Widok",
      type: "hotel",
      category: "nocleg",
      town: "Wisła",
      lat: 49.6590,
      lng: 18.8620,
      address: "ul. Górska 5, 43-460 Wisła",
      description: "Rodzinny pensjonat z widokiem na Baranią Górę. Domowa atmosfera, śniadania, parking.",
      phone: "+48 33 855 44 22",
      amenities: ["breakfast", "parking", "wifi", "terrace"],
      packageLevel: "PREMIUM" as const,
    },
    {
      title: "Kolej Gondolowa Szczyrk",
      type: "attraction",
      category: "atrakcja",
      town: "Szczyrk",
      lat: 49.7120,
      lng: 19.0300,
      address: "ul. Gondolowa 1, 43-370 Szczyrk",
      description: "Nowoczesna kolej gondolowa na Skrzyczne (1257 m n.p.m.). Panoramiczne widoki na Beskidy. Czynna całorocznie.",
      phone: "+48 33 829 85 00",
      website: "https://gondola.szczyrk.pl",
      amenities: ["parking", "restaurant at top", "wifi"],
      packageLevel: "PREMIUM_PLUS" as const,
    },
    {
      title: "Hostel Trekker Bielsko-Biała",
      type: "hotel",
      category: "nocleg",
      town: "Bielsko-Biała",
      lat: 49.8220,
      lng: 19.0440,
      address: "ul. Wzgórze 8, 43-300 Bielsko-Biała",
      description: "Budżetowy hostel w centrum Bielska-Białej. Doskonały punkt startowy do Beskidów. Pokoje wieloosobowe i prywatne.",
      phone: "+48 33 812 10 10",
      amenities: ["wifi", "kitchen", "lockers"],
      packageLevel: "FREE" as const,
    },
    {
      title: "Restauracja Pod Skrzycznem",
      type: "restaurant",
      category: "gastronomia",
      town: "Szczyrk",
      lat: 49.7180,
      lng: 19.0370,
      address: "ul. Myśliwska 44, 43-370 Szczyrk",
      description: "Restauracja serwująca dania kuchni góralskiej i europejskiej. Polecamy żeberka po góralsku i oscypek z żurawiną.",
      phone: "+48 33 829 90 10",
      amenities: ["parking", "outdoor seating", "wifi"],
      packageLevel: "PREMIUM" as const,
    },
    {
      title: "Kościół Wang",
      type: "attraction",
      category: "atrakcja",
      town: "Karpacz",
      lat: 50.7833,
      lng: 15.7333,
      address: "ul. Na Śnieżkę 8, 58-540 Karpacz",
      description: "Norweska świątynia z XII wieku przeniesiona do Karkonoszy. Unikalna architektura drewniana.",
      amenities: ["guided tours", "parking"],
      packageLevel: "FREE" as const,
    },
  ]

  for (const listing of listings) {
    await prisma.listing.create({ data: listing })
  }

  console.log(`✅ Created ${listings.length} listings`)

  // Seed Peaks
  console.log('⛰️  Seeding peaks...')

  const peaks = [
    {
      name: "Skrzyczne",
      slug: "skrzyczne",
      lat: 49.6850,
      lng: 19.0294,
      elevation: 1257,
      range: "Beskid Śląski",
      difficulty: "moderate" as const,
      hiking_time: 180,
      parking_lat: 49.7120,
      parking_lng: 19.0300,
      viewpoints: ["Szczyrk", "Wisła", "Tatry"],
      description: "Najwyższy szczyt Beskidu Śląskiego z panoramicznym widokiem na Tatry. Dostępna kolej gondolowa lub szlaki piesze.",
    },
    {
      name: "Babia Góra",
      slug: "babia-gora",
      lat: 49.5736,
      lng: 19.5294,
      elevation: 1725,
      range: "Beskid Żywiecki",
      difficulty: "hard" as const,
      hiking_time: 300,
      parking_lat: 49.5950,
      parking_lng: 19.5150,
      viewpoints: ["Tatry", "Beskidy", "Pieniny"],
      description: "Królowa Beskidów — najwyższy szczyt Beskidów z surowym klimatem górskim. Park Narodowy Babiogórski.",
    },
    {
      name: "Pilsko",
      slug: "pilsko",
      lat: 49.5531,
      lng: 19.3311,
      elevation: 1557,
      range: "Beskid Żywiecki",
      difficulty: "moderate" as const,
      hiking_time: 240,
      parking_lat: 49.5650,
      parking_lng: 19.3200,
      viewpoints: ["Babia Góra", "Tatry", "Kotlina Żywiecka"],
      description: "Drugi szczyt Beskidów Żywieckich z obserwatorium meteorologicznym na szczycie.",
    },
    {
      name: "Barania Góra",
      slug: "barania-gora",
      lat: 49.6194,
      lng: 18.9142,
      elevation: 1220,
      range: "Beskid Śląski",
      difficulty: "easy" as const,
      hiking_time: 150,
      parking_lat: 49.6400,
      parking_lng: 18.9000,
      viewpoints: ["Wisła", "Ustroń", "Beskidy"],
      description: "Łagodny szczyt na granicy polsko-czeskiej. Łatwe szlaki i rodzinne wycieczki.",
    },
    {
      name: "Wielka Racza",
      slug: "wielka-racza",
      lat: 49.5092,
      lng: 19.1906,
      elevation: 1236,
      range: "Beskid Żywiecki",
      difficulty: "moderate" as const,
      hiking_time: 210,
      parking_lat: 49.5200,
      parking_lng: 19.1800,
      viewpoints: ["Pilsko", "Babia Góra", "Tatry"],
      description: "Szczyt na granicy polsko-słowackiej z pięknymi widokami na Tatry. Część Korony Gór Polski.",
    },
    {
      name: "Równica",
      slug: "rownica",
      lat: 49.7106,
      lng: 19.0372,
      elevation: 1065,
      range: "Beskid Śląski",
      difficulty: "easy" as const,
      hiking_time: 120,
      parking_lat: 49.7180,
      parking_lng: 19.0370,
      viewpoints: ["Szczyrk", "Skrzyczne", "Beskidy"],
      description: "Łatwy szczyt z panoramą na cały Beskid Śląski. Wieża widokowa na szczycie.",
    },
    {
      name: "Klimczok",
      slug: "klimczok",
      lat: 49.7167,
      lng: 18.9597,
      elevation: 1117,
      range: "Beskid Śląski",
      difficulty: "moderate" as const,
      hiking_time: 150,
      parking_lat: 49.7300,
      parking_lng: 18.9600,
      viewpoints: ["Szczyrk", "Beskidy", "Wisła"],
      description: "Szczyt z charakterystyczną skałą i krzyżem. Popularne miejsce trekkingowe.",
    },
    {
      name: "Malinowska Skała",
      slug: "malinowska-skala",
      lat: 49.7211,
      lng: 18.9358,
      elevation: 1152,
      range: "Beskid Śląski",
      difficulty: "moderate" as const,
      hiking_time: 135,
      parking_lat: 49.7300,
      parking_lng: 18.9400,
      viewpoints: ["Ustroń", "Wisła", "Skrzyczne"],
      description: "Malowniczy szczyt z piękną panoramą. Częsty cel wycieczek z Ustronia.",
    },
  ]

  for (const peak of peaks) {
    await prisma.peak.create({ data: peak })
  }

  console.log(`✅ Created ${peaks.length} peaks`)

  console.log('✨ Database seed completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
