"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap, MarkerClusterGroup } from "leaflet";
import type { Listing } from "@/core/api/listings";

interface Props {
  listings: Pick<Listing, "id" | "title" | "town" | "type" | "lat" | "lng" | "address" | "packageLevel">[];
  height?: string;
  center?: [number, number];
  zoom?: number;
}

const PACKAGE_COLORS: Record<string, string> = {
  "PREMIUM+": "#e30613",
  "PREMIUM": "#c00511",
  "FREE": "#6b7280",
};

// Beskidy region center
const DEFAULT_CENTER: [number, number] = [49.72, 19.1];
const DEFAULT_ZOOM = 10;

export default function ListingsMap({
  listings,
  height = "400px",
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const clusterGroupRef = useRef<MarkerClusterGroup | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Dynamically import Leaflet and markercluster to avoid SSR issues
    Promise.all([
      import("leaflet"),
      import("leaflet.markercluster"),
      import("leaflet.markercluster/dist/MarkerCluster.css"),
      import("leaflet.markercluster/dist/MarkerCluster.Default.css"),
    ]).then(([L]) => {
      // Fix default marker icon paths broken by webpack bundling
      (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: unknown })._getIconUrl = undefined;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!).setView(center, zoom);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      // Create marker cluster group with custom styling
      const markerCluster = L.markerClusterGroup({
        maxClusterRadius: 60,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        iconCreateFunction: (cluster) => {
          const count = cluster.getChildCount();
          let sizeClass = 'small';
          let size = 40;

          if (count >= 100) {
            sizeClass = 'large';
            size = 60;
          } else if (count >= 10) {
            sizeClass = 'medium';
            size = 50;
          }

          return L.divIcon({
            html: `<div style="
              background: linear-gradient(135deg, #e30613 0%, #c00511 100%);
              width: ${size}px;
              height: ${size}px;
              border-radius: 50%;
              border: 4px solid white;
              box-shadow: 0 6px 16px rgba(227, 6, 19, 0.4);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: ${size / 2.5}px;
              font-family: system-ui, -apple-system, sans-serif;
            ">${count}</div>`,
            className: `marker-cluster-${sizeClass}`,
            iconSize: [size, size],
          });
        },
      });

      clusterGroupRef.current = markerCluster;

      listings.forEach((listing) => {
        if (!listing.lat || !listing.lng) return;

        const color = PACKAGE_COLORS[listing.packageLevel] ?? "#6b7280";
        const isPremiumPlus = listing.packageLevel === "PREMIUM+";

        const icon = L.divIcon({
          html: `<div style="
            background:${color};
            width:${isPremiumPlus ? "36px" : "28px"};
            height:${isPremiumPlus ? "36px" : "28px"};
            border-radius:50%;
            border:3px solid white;
            box-shadow:0 4px 12px rgba(0,0,0,0.3);
            display:flex;align-items:center;justify-content:center;
            font-size:${isPremiumPlus ? "16px" : "13px"};
            color:white;font-weight:bold;
          ">${listing.type.slice(0, 1).toUpperCase()}</div>`,
          className: "",
          iconSize: [isPremiumPlus ? 36 : 28, isPremiumPlus ? 36 : 28],
          iconAnchor: [isPremiumPlus ? 18 : 14, isPremiumPlus ? 18 : 14],
          popupAnchor: [0, isPremiumPlus ? -20 : -16],
        });

        const packageBadge =
          listing.packageLevel === "PREMIUM+"
            ? `<span style="background:#e30613;color:white;font-size:10px;padding:2px 6px;border-radius:999px;font-weight:700">PREMIUM+</span>`
            : listing.packageLevel === "PREMIUM"
            ? `<span style="background:#c00511;color:white;font-size:10px;padding:2px 6px;border-radius:999px;font-weight:700">PREMIUM</span>`
            : `<span style="background:#6b7280;color:white;font-size:10px;padding:2px 6px;border-radius:999px;font-weight:700">FREE</span>`;

        L.marker([listing.lat, listing.lng], { icon })
          .bindPopup(
            `<div style="min-width:180px;font-family:system-ui,sans-serif">
              <div style="display:flex;align-items:start;justify-content:space-between;gap:8px;margin-bottom:4px">
                <strong style="font-size:14px">${listing.title}</strong>
                ${packageBadge}
              </div>
              <p style="font-size:12px;color:#555;margin:2px 0">📍 ${listing.town}</p>
              ${listing.address ? `<p style="font-size:11px;color:#888;margin:2px 0">${listing.address}</p>` : ""}
              <a href="/listings?q=${encodeURIComponent(listing.title)}" style="display:inline-block;margin-top:6px;font-size:12px;color:#e30613;font-weight:600;text-decoration:none">
                Zobacz szczegóły →
              </a>
            </div>`,
            { maxWidth: 260 }
          )
          .addTo(markerCluster);
      });

      // Add the cluster group to the map
      map.addLayer(markerCluster);
    });

    return () => {
      if (clusterGroupRef.current) {
        clusterGroupRef.current.clearLayers();
        clusterGroupRef.current = null;
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // Empty dependency array is intentional: the map is initialized once on mount.
    // Leaflet manages the DOM directly; re-running would create duplicate map instances.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={mapRef}
      style={{ height, width: "100%", borderRadius: "16px", overflow: "hidden" }}
      aria-label="Mapa obiektów w Beskidach"
    />
  );
}
