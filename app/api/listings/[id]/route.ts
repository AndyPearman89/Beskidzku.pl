import { NextRequest, NextResponse } from "next/server";
import { getListing, updateListing, deleteListing, type PackageLevel } from "@/core/api/listings";
import { canManageListing } from "@/core/api/listingAccess";
import { checkRateLimit, getClientIp } from "@/core/api/rateLimiter";

const MAX_FIELD_LENGTH = 1000;
const MAX_TITLE_LENGTH = 200;
const MAX_ADDRESS_LENGTH = 300;
const VALID_PACKAGE_LEVELS: PackageLevel[] = ["FREE", "PREMIUM", "PREMIUM+"];

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const listing = await getListing(id);

  if (!listing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ data: listing });
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const ip = getClientIp(request);
  if (!checkRateLimit(`put:listings:${ip}`, 20, 60_000)) {
    return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
  }

  if (!canManageListing(request, id)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json() as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const listing = await getListing(id);
  if (!listing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const title = typeof body.title === "string" ? body.title.trim() : undefined;
  const type = typeof body.type === "string" ? body.type.trim() : undefined;
  const category = typeof body.category === "string" ? body.category.trim() : undefined;
  const town = typeof body.town === "string" ? body.town.trim() : undefined;
  const address = typeof body.address === "string" ? body.address.trim() : undefined;
  const description = typeof body.description === "string" ? body.description.trim() : undefined;
  const packageLevel: PackageLevel | undefined =
    typeof body.packageLevel === "string" && VALID_PACKAGE_LEVELS.includes(body.packageLevel as PackageLevel)
      ? (body.packageLevel as PackageLevel)
      : undefined;

  if (title !== undefined && title.length > MAX_TITLE_LENGTH) {
    return NextResponse.json({ error: "Field value too long" }, { status: 400 });
  }
  if (address !== undefined && address.length > MAX_ADDRESS_LENGTH) {
    return NextResponse.json({ error: "Field value too long" }, { status: 400 });
  }
  if (description !== undefined && description.length > MAX_FIELD_LENGTH) {
    return NextResponse.json({ error: "Field value too long" }, { status: 400 });
  }
  if (type !== undefined && type.length > MAX_FIELD_LENGTH) {
    return NextResponse.json({ error: "Field value too long" }, { status: 400 });
  }
  if (category !== undefined && category.length > MAX_FIELD_LENGTH) {
    return NextResponse.json({ error: "Field value too long" }, { status: 400 });
  }
  if (town !== undefined && town.length > MAX_FIELD_LENGTH) {
    return NextResponse.json({ error: "Field value too long" }, { status: 400 });
  }

  const updated = await updateListing(id, {
    title,
    type,
    category,
    town,
    address,
    description,
    lat: typeof body.lat === "number" ? body.lat : undefined,
    lng: typeof body.lng === "number" ? body.lng : undefined,
    phone: typeof body.phone === "string" ? body.phone.trim() : undefined,
    website: typeof body.website === "string" ? body.website.trim() : undefined,
    amenities: Array.isArray(body.amenities) ? (body.amenities as string[]).filter((a) => typeof a === "string") : undefined,
    packageLevel,
  });

  return NextResponse.json({ success: true, listing: updated });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const ip = getClientIp(request);
  if (!checkRateLimit(`delete:listings:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
  }

  if (!canManageListing(request, id)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const deleted = await deleteListing(id);
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, deletedId: id });
}
