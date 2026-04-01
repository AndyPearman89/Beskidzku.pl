import { NextRequest, NextResponse } from "next/server";
import { getPeaks, type Peak } from "@/core/api/peaks";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const range = searchParams.get("range") ?? undefined;
  const difficulty = searchParams.get("difficulty") as Peak["difficulty"] | null;
  const minElevation = searchParams.has("min_elevation")
    ? Number(searchParams.get("min_elevation"))
    : undefined;
  const maxElevation = searchParams.has("max_elevation")
    ? Number(searchParams.get("max_elevation"))
    : undefined;

  const result = getPeaks({
    range,
    difficulty: difficulty ?? undefined,
    minElevation,
    maxElevation,
    page: searchParams.has("page") ? Number(searchParams.get("page")) : 1,
    perPage: searchParams.has("per_page") ? Number(searchParams.get("per_page")) : 20,
  });

  return NextResponse.json({
    data: result.items,
    meta: {
      page: result.page,
      per_page: result.perPage,
      total: result.total,
      total_pages: Math.ceil(result.total / result.perPage),
    },
  });
}
