"use client";

import { useEffect, useState } from 'react';

interface WeatherData {
  current: {
    temperature: number;
    weathercode: number;
    label: string;
    icon: string;
    windspeed: number;
  } | null;
  forecast: Array<{
    date: string;
    tempMax: number;
    tempMin: number;
    precipitation: number;
    weathercode: number;
    label: string;
    icon: string;
  }>;
  lat: number;
  lng: number;
}

interface WeatherPanelProps {
  lat?: number;
  lng?: number;
  locationName?: string;
}

export default function WeatherPanel({ lat = 49.715, lng = 19.034, locationName = 'Beskidy' }: WeatherPanelProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/weather?lat=${lat}&lng=${lng}`);

        if (!res.ok) {
          throw new Error('Failed to fetch weather');
        }

        const data = await res.json() as WeatherData;
        setWeather(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load weather');
      } finally {
        setLoading(false);
      }
    };

    void fetchWeather();
  }, [lat, lng]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-5">
        <h3 className="text-lg font-bold mb-4">Pogoda</h3>
        <div className="animate-pulse space-y-3">
          <div className="h-20 bg-gray-200 rounded-xl" />
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !weather || !weather.current) {
    return (
      <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-5">
        <h3 className="text-lg font-bold mb-4">Pogoda</h3>
        <div className="text-center py-6 text-[var(--color-muted)]">
          <p className="text-3xl mb-2">🌡️</p>
          <p className="text-sm">Nie udało się pobrać prognozy pogody</p>
        </div>
      </div>
    );
  }

  const { current, forecast } = weather;

  // Check for weather alerts
  const hasAlert = current.weathercode >= 95 || current.windspeed > 50;
  const alertMessage = current.weathercode >= 95
    ? '⚠️ Burza - odłóż wyjście na szlak'
    : current.windspeed > 50
    ? '⚠️ Silny wiatr - zachowaj ostrożność'
    : null;

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Pogoda</h3>
        <span className="text-xs font-semibold text-[var(--color-muted)]">📍 {locationName}</span>
      </div>

      {/* Current weather */}
      <div className="rounded-xl bg-gradient-to-br from-[var(--color-primary-soft)] to-white p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-4xl font-bold text-[var(--color-text)]">
              {Math.round(current.temperature)}°C
            </div>
            <div className="text-sm text-[var(--color-muted)] mt-1">
              {current.label}
            </div>
            <div className="text-xs text-[var(--color-muted)] mt-1">
              💨 Wiatr: {Math.round(current.windspeed)} km/h
            </div>
          </div>
          <div className="text-6xl">{current.icon}</div>
        </div>
      </div>

      {/* Weather alert */}
      {hasAlert && alertMessage && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 px-4 py-3 text-sm font-semibold">
          {alertMessage}
        </div>
      )}

      {/* 7-day forecast */}
      <div>
        <div className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide mb-3">
          Prognoza 7-dniowa
        </div>
        <div className="grid grid-cols-4 gap-2">
          {forecast.slice(0, 4).map((day, index) => {
            const date = new Date(day.date);
            const dayName = index === 0 ? 'Dziś' :
              index === 1 ? 'Jutro' :
              date.toLocaleDateString('pl-PL', { weekday: 'short' });

            return (
              <div
                key={day.date}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-3 text-center"
              >
                <div className="text-xs font-semibold text-[var(--color-muted)] mb-1">
                  {dayName}
                </div>
                <div className="text-2xl mb-1">{day.icon}</div>
                <div className="text-sm font-semibold">
                  {Math.round(day.tempMax)}°
                </div>
                <div className="text-xs text-[var(--color-muted)]">
                  {Math.round(day.tempMin)}°
                </div>
                {day.precipitation > 0 && (
                  <div className="text-xs text-blue-600 mt-1">
                    💧 {day.precipitation.toFixed(1)}mm
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Info footer */}
      <div className="mt-4 pt-4 border-t border-[var(--color-border)] text-xs text-[var(--color-muted)]">
        Dane: Open-Meteo · Aktualizacja co godzinę
      </div>
    </div>
  );
}
