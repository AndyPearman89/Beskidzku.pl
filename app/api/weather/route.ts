import { NextRequest, NextResponse } from "next/server";

// WMO Weather Interpretation Codes → Polish label + icon
const WMO_CODES: Record<number, { label: string; icon: string }> = {
  0: { label: "Bezchmurnie", icon: "☀️" },
  1: { label: "Przeważnie słonecznie", icon: "🌤️" },
  2: { label: "Częściowe zachmurzenie", icon: "⛅" },
  3: { label: "Zachmurzenie", icon: "☁️" },
  45: { label: "Mgła", icon: "🌫️" },
  48: { label: "Mgła szronowa", icon: "🌫️" },
  51: { label: "Lekka mżawka", icon: "🌦️" },
  53: { label: "Mżawka", icon: "🌧️" },
  55: { label: "Intensywna mżawka", icon: "🌧️" },
  61: { label: "Lekki deszcz", icon: "🌦️" },
  63: { label: "Deszcz", icon: "🌧️" },
  65: { label: "Silny deszcz", icon: "🌧️" },
  71: { label: "Lekki śnieg", icon: "🌨️" },
  73: { label: "Śnieg", icon: "❄️" },
  75: { label: "Silny śnieg", icon: "❄️" },
  77: { label: "Ziarnisty śnieg", icon: "🌨️" },
  80: { label: "Przelotny deszcz", icon: "🌦️" },
  81: { label: "Deszcz przelotny", icon: "🌧️" },
  82: { label: "Gwałtowny deszcz", icon: "⛈️" },
  85: { label: "Przelotny śnieg", icon: "🌨️" },
  86: { label: "Śnieg z deszczem", icon: "🌨️" },
  95: { label: "Burza", icon: "⛈️" },
  96: { label: "Burza z gradem", icon: "⛈️" },
  99: { label: "Silna burza z gradem", icon: "⛈️" },
};

function decodeWeatherCode(code: number) {
  return WMO_CODES[code] ?? { label: "Nieznane warunki", icon: "🌡️" };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get("lat") ?? "49.715");
  const lng = parseFloat(searchParams.get("lng") ?? "19.034");

  if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  const omUrl = new URL("https://api.open-meteo.com/v1/forecast");
  omUrl.searchParams.set("latitude", lat.toFixed(4));
  omUrl.searchParams.set("longitude", lng.toFixed(4));
  omUrl.searchParams.set("current_weather", "true");
  omUrl.searchParams.set(
    "daily",
    "temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode"
  );
  omUrl.searchParams.set("timezone", "Europe/Warsaw");
  omUrl.searchParams.set("forecast_days", "7");

interface OpenMeteoCurrentWeather {
  temperature: number;
  windspeed: number;
  weathercode: number;
  is_day: number;
}

interface OpenMeteoDaily {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  weathercode: number[];
}

interface OpenMeteoResponse {
  current_weather?: OpenMeteoCurrentWeather;
  daily?: OpenMeteoDaily;
}

  let omData: OpenMeteoResponse;
  try {
    const res = await fetch(omUrl.toString(), { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Open-Meteo returned ${res.status}`);
    omData = await res.json() as OpenMeteoResponse;
  } catch {
    return NextResponse.json({ error: "Weather service unavailable" }, { status: 503 });
  }

  const cw = omData.current_weather;
  const daily = omData.daily;

  const current = cw
    ? {
        temperature: cw.temperature,
        windspeed: cw.windspeed,
        weathercode: cw.weathercode,
        ...decodeWeatherCode(cw.weathercode),
        is_day: cw.is_day === 1,
      }
    : null;

  const forecast =
    daily && Array.isArray(daily.time)
      ? daily.time.map((date, i) => ({
          date,
          tempMax: daily.temperature_2m_max[i],
          tempMin: daily.temperature_2m_min[i],
          precipitation: daily.precipitation_sum[i],
          weathercode: daily.weathercode[i],
          ...decodeWeatherCode(daily.weathercode[i]),
        }))
      : [];

  return NextResponse.json(
    { current, forecast, lat, lng },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600" } }
  );
}
