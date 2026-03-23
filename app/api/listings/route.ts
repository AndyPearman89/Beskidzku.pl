import { NextRequest, NextResponse } from "next/server";
import { createListing, getListings } from "@/core/api/listings";
import { hasListingsAdminAccess } from "@/core/api/listingAccess";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const result = getListings({
    type: searchParams.get("type") ?? undefined,
    town: searchParams.get("town") ?? undefined,
    q: searchParams.get("q") ?? undefined,
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

export async function POST(request: NextRequest) {
  if (!hasListingsAdminAccess(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const type = typeof body.type === "string" ? body.type.trim() : "";
  const town = typeof body.town === "string" ? body.town.trim() : "";
  const address = typeof body.address === "string" ? body.address.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";

  if (!title || !type || !town) {
    return NextResponse.json({ error: "title, type and town are required" }, { status: 400 });
  }

  const listing = createListing({
    title,
    type,
    category: typeof body.category === "string" ? body.category.trim() : "",
    town,
    address,
    description,
    lat: typeof body.lat === "number" ? body.lat : undefined,
    lng: typeof body.lng === "number" ? body.lng : undefined,
    phone: typeof body.phone === "string" ? body.phone.trim() : undefined,
    website: typeof body.website === "string" ? body.website.trim() : undefined,
    email: typeof body.email === "string" ? body.email.trim() : undefined,
    ownerId: typeof body.ownerId === "string" ? body.ownerId.trim() : undefined,
  });

  return NextResponse.json({ success: true, listing }, { status: 201 });
}
