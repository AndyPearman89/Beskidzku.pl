"use client";

import dynamic from "next/dynamic";
import type { Listing } from "@/core/api/listings";

const ListingsMap = dynamic(() => import("./ListingsMap"), { ssr: false });

type MapListing = Pick<Listing, "id" | "title" | "town" | "type" | "lat" | "lng" | "address" | "packageLevel">;

interface Props {
  listings: MapListing[];
  height?: string;
  center?: [number, number];
  zoom?: number;
}

export default function DynamicMap({ listings, height, center, zoom }: Props) {
  return <ListingsMap listings={listings} height={height} center={center} zoom={zoom} />;
}
