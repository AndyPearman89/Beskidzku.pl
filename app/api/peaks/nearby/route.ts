import { NextRequest, NextResponse } from "next/server";
import { getNearbyPeaks } from "@/core/api/peaks";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const lat = parseFloat(searchParams.get("lat") ?? "");
  const lng = parseFloat(searchParams.get("lng") ?? "");
  const radius = searchParams.has("radius") ? parseFloat(searchParams.get("radius")!) : 20;

  if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  if (isNaN(radius) || radius <= 0 || radius > 100) {
    return NextResponse.json({ error: "Invalid radius (must be 0-100 km)" }, { status: 400 });
  }

  const peaks = getNearbyPeaks(lat, lng, radius);

  return NextResponse.json({
    data: peaks,
    meta: {
      lat,
      lng,
      radius,
      count: peaks.length,
    },
  });
}
