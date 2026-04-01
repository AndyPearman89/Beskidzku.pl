import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/planner
 * Mock endpoint for generating travel plans
 *
 * In production, this would proxy to PearTree Core API:
 * POST /peartree/v1/planner/generate
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      location: string;
      duration: number;
      type: 'trekking' | 'family' | 'bike' | 'relaks' | 'aktywnie';
    };

    const { location, duration, type } = body;

    if (!location || !duration || !type) {
      return NextResponse.json(
        { error: 'Missing required parameters: location, duration, type' },
        { status: 400 }
      );
    }

    // Mock response until PearTree Core backend is ready
    // This simulates the structure that would come from the backend
    const mockPlan = {
      id: `plan_${Date.now()}`,
      route: {
        path: generateMockPath(location, duration),
        stops: generateMockStops(location, duration, type),
      },
      stats: {
        distance: duration * 12.5, // km
        duration: duration * 5.2, // hours
        elevation: duration * 450, // meters
        difficulty: getDifficulty(type),
      },
      weather: {
        temp: 18,
        condition: 'Częściowe zachmurzenie',
        icon: '⛅',
        alert: null,
      },
      listings: {
        accommodations: ['acc1', 'acc2'],
        restaurants: ['rest1'],
        attractions: ['attr1', 'attr2'],
      },
      aiPlanReady: false,
      aiPlanId: `ai_${Date.now()}`,
    };

    return NextResponse.json(mockPlan, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Planner API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate plan' },
      { status: 500 }
    );
  }
}

// Helper functions for mock data generation
function generateMockPath(location: string, duration: number): [number, number][] {
  // Mock route path (coordinates)
  const baseCoords: [number, number] = getLocationCoords(location);
  const points: [number, number][] = [baseCoords];

  // Generate waypoints
  for (let i = 1; i <= duration * 3; i++) {
    const lat = baseCoords[0] + (Math.random() - 0.5) * 0.05;
    const lng = baseCoords[1] + (Math.random() - 0.5) * 0.05;
    points.push([lat, lng]);
  }

  return points;
}

function generateMockStops(
  location: string,
  duration: number,
  type: string
): Array<{
  id: string;
  name: string;
  type: 'parking' | 'attraction' | 'peak' | 'restaurant' | 'accommodation';
  lat: number;
  lng: number;
  time?: string;
  duration?: number;
  description?: string;
}> {
  const baseCoords = getLocationCoords(location);
  const stops = [];

  // Starting point (parking)
  stops.push({
    id: 'stop_1',
    name: `Parking ${location}`,
    type: 'parking' as const,
    lat: baseCoords[0],
    lng: baseCoords[1],
    time: '09:00',
    duration: 10,
    description: 'Punkt startowy - darmowy parking',
  });

  // Add attractions based on duration
  const attractionNames = getAttractionsByType(location, type);
  for (let i = 0; i < Math.min(duration * 2, attractionNames.length); i++) {
    const lat = baseCoords[0] + (Math.random() - 0.5) * 0.03;
    const lng = baseCoords[1] + (Math.random() - 0.5) * 0.03;
    const hour = 9 + i * 2;

    stops.push({
      id: `stop_${i + 2}`,
      name: attractionNames[i],
      type: i % 3 === 0 ? ('peak' as const) : ('attraction' as const),
      lat,
      lng,
      time: `${hour}:${i % 2 === 0 ? '00' : '30'}`,
      duration: 60 + Math.random() * 60,
      description: `Punkt widokowy ${i + 1}`,
    });
  }

  // Add restaurant
  if (duration >= 1) {
    stops.push({
      id: `stop_lunch`,
      name: `Restauracja ${location}`,
      type: 'restaurant' as const,
      lat: baseCoords[0] + 0.01,
      lng: baseCoords[1] + 0.01,
      time: '13:00',
      duration: 60,
      description: 'Przerwa obiadowa',
    });
  }

  // Add accommodation if multi-day
  if (duration > 1) {
    stops.push({
      id: `stop_accommodation`,
      name: `Hotel ${location}`,
      type: 'accommodation' as const,
      lat: baseCoords[0] + 0.005,
      lng: baseCoords[1] - 0.005,
      time: '18:00',
      description: 'Nocleg',
    });
  }

  return stops;
}

function getLocationCoords(location: string): [number, number] {
  // Mock coordinates for common Beskidy locations
  const coords: Record<string, [number, number]> = {
    szczyrk: [49.7156, 19.0343],
    wisla: [49.6550, 18.8644],
    ustron: [49.7175, 18.8230],
    zywiec: [49.6850, 19.1944],
    'bielsko-biala': [49.8224, 19.0448],
    sucha: [49.7425, 19.5961],
  };

  const normalized = location.toLowerCase().replace(/[ąćęłńóśźż]/g, (m) => {
    const map: Record<string, string> = {
      ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z',
    };
    return map[m] || m;
  });

  for (const [key, value] of Object.entries(coords)) {
    if (normalized.includes(key)) {
      return value;
    }
  }

  // Default to Szczyrk
  return coords.szczyrk;
}

function getAttractionsByType(location: string, type: string): string[] {
  const attractions: Record<string, string[]> = {
    family: ['Plac zabaw', 'Łatwy szlak', 'Punkt widokowy', 'Park krajobrazowy'],
    trekking: ['Szczyt Skrzyczne', 'Schronisko PTTK', 'Przełęcz', 'Górski szlak'],
    bike: ['Trasa rowerowa', 'Singletrek', 'Punkt widokowy', 'Wypożyczalnia'],
    relaks: ['Punkt widokowy', 'Ławka', 'Polana', 'Uzdrowisko'],
    aktywnie: ['Szlak nordic walking', 'Trasa biegowa', 'Punkt widokowy', 'Ścieżka edukacyjna'],
  };

  return attractions[type] || attractions.family;
}

function getDifficulty(type: string): 'easy' | 'moderate' | 'hard' {
  const difficultyMap: Record<string, 'easy' | 'moderate' | 'hard'> = {
    family: 'easy',
    relaks: 'easy',
    aktywnie: 'moderate',
    bike: 'moderate',
    trekking: 'hard',
  };

  return difficultyMap[type] || 'moderate';
}
