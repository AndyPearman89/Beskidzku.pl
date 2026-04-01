"use client";

import { useEffect, useRef } from 'react';
import type L from 'leaflet';

interface RouteStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'parking' | 'attraction' | 'peak' | 'restaurant' | 'accommodation';
}

interface MapViewProps {
  route?: [number, number][]; // [lat, lng][]
  stops: RouteStop[];
  height?: string;
  showRoute?: boolean;
}

const STOP_ICONS: Record<string, string> = {
  parking: '🅿️',
  attraction: '🎯',
  peak: '⛰️',
  restaurant: '🍽️',
  accommodation: '🏨',
};

const STOP_COLORS: Record<string, string> = {
  parking: '#6366f1',
  attraction: '#f59e0b',
  peak: '#dc2626',
  restaurant: '#10b981',
  accommodation: '#8b5cf6',
};

export default function MapView({ route, stops, height = '500px', showRoute = true }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    // Dynamic import to avoid SSR issues
    let isMounted = true;

    const initMap = async () => {
      if (!mapContainerRef.current || mapRef.current) return;

      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      if (!isMounted || !mapContainerRef.current) return;

      // Create map
      const map = L.map(mapContainerRef.current, {
        center: stops.length > 0 ? [stops[0].lat, stops[0].lng] : [49.715, 19.034],
        zoom: stops.length > 0 ? 12 : 10,
        scrollWheelZoom: true,
      });

      mapRef.current = map;

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);
    };

    void initMap();

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update route and markers
  useEffect(() => {
    const updateMap = async () => {
      if (!mapRef.current) return;

      const L = (await import('leaflet')).default;
      const map = mapRef.current;

      // Clear existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      // Clear existing route
      if (routeLayerRef.current) {
        routeLayerRef.current.remove();
        routeLayerRef.current = null;
      }

      // Draw route if provided
      if (showRoute && route && route.length > 0) {
        const polyline = L.polyline(route, {
          color: '#e30613',
          weight: 4,
          opacity: 0.7,
        }).addTo(map);

        routeLayerRef.current = polyline;
      }

      // Add markers for stops
      stops.forEach((stop, index) => {
        const icon = L.divIcon({
          html: `
            <div style="
              background-color: ${STOP_COLORS[stop.type] || '#e30613'};
              width: 36px;
              height: 36px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 18px;
              border: 3px solid white;
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            ">
              ${STOP_ICONS[stop.type] || (index + 1)}
            </div>
          `,
          className: '',
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });

        const marker = L.marker([stop.lat, stop.lng], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="min-width: 150px">
              <div style="font-weight: bold; margin-bottom: 4px">${stop.name}</div>
              <div style="font-size: 12px; color: #666">${stop.type}</div>
              <div style="font-size: 11px; color: #999; margin-top: 4px">
                ${stop.lat.toFixed(5)}, ${stop.lng.toFixed(5)}
              </div>
            </div>
          `);

        markersRef.current.push(marker);
      });

      // Fit bounds to show all stops
      if (stops.length > 0) {
        const bounds = L.latLngBounds(stops.map(s => [s.lat, s.lng]));
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    };

    void updateMap();
  }, [route, stops, showRoute]);

  return (
    <div
      ref={mapContainerRef}
      style={{ height, width: '100%' }}
      className="rounded-xl overflow-hidden border border-[var(--color-border)]"
    >
      {/* Fallback for when map is loading */}
      {!mapRef.current && (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <div className="text-center text-[var(--color-muted)]">
            <p className="text-3xl mb-2">🗺️</p>
            <p className="text-sm">Ładowanie mapy...</p>
          </div>
        </div>
      )}
    </div>
  );
}
