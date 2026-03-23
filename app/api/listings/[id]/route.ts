import { NextRequest, NextResponse } from "next/server";
import { getListing, updateListing, deleteListing } from "@/core/api/listings";
import { canManageListing } from "@/core/api/listingAccess";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const listing = getListing(id);

  if (!listing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ data: listing });
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  if (!canManageListing(request, id)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const listing = getListing(id);
  if (!listing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = updateListing(id, {
    title: typeof body.title === "string" ? body.title.trim() : undefined,
    type: typeof body.type === "string" ? body.type.trim() : undefined,
    category: typeof body.category === "string" ? body.category.trim() : undefined,
    town: typeof body.town === "string" ? body.town.trim() : undefined,
    address: typeof body.address === "string" ? body.address.trim() : undefined,
    description: typeof body.description === "string" ? body.description.trim() : undefined,
    lat: typeof body.lat === "number" ? body.lat : undefined,
    lng: typeof body.lng === "number" ? body.lng : undefined,
    phone: typeof body.phone === "string" ? body.phone.trim() : undefined,
    website: typeof body.website === "string" ? body.website.trim() : undefined,
  });

  return NextResponse.json({ success: true, listing: updated });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  if (!canManageListing(request, id)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const deleted = deleteListing(id);
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, deletedId: id });
}
