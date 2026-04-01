import { NextRequest, NextResponse } from "next/server";
import { createListing, getListings, type PackageLevel } from "@/core/api/listings";
import { hasListingsAdminAccess } from "@/core/api/listingAccess";
import { checkRateLimit, getClientIp } from "@/core/api/rateLimiter";

const MAX_FIELD_LENGTH = 1000;
const MAX_TITLE_LENGTH = 200;
const MAX_ADDRESS_LENGTH = 300;
const VALID_PACKAGE_LEVELS: PackageLevel[] = ["FREE", "PREMIUM", "PREMIUM+"];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const result = await getListings({
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
  const ip = getClientIp(request);
  const allowed = checkRateLimit(`post:listings:${ip}`, 20, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
  }

  if (!hasListingsAdminAccess(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json() as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const type = typeof body.type === "string" ? body.type.trim() : "";
  const town = typeof body.town === "string" ? body.town.trim() : "";
  const address = typeof body.address === "string" ? body.address.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const packageLevel: PackageLevel =
    typeof body.packageLevel === "string" && VALID_PACKAGE_LEVELS.includes(body.packageLevel as PackageLevel)
      ? (body.packageLevel as PackageLevel)
      : "FREE";

  if (!title || !type || !town) {
    return NextResponse.json({ error: "title, type and town are required" }, { status: 400 });
  }

  if (title.length > MAX_TITLE_LENGTH || type.length > MAX_FIELD_LENGTH || town.length > MAX_FIELD_LENGTH) {
    return NextResponse.json({ error: "Field value too long" }, { status: 400 });
  }
  if (address.length > MAX_ADDRESS_LENGTH || description.length > MAX_FIELD_LENGTH) {
    return NextResponse.json({ error: "Field value too long" }, { status: 400 });
  }

  const listing = await createListing({
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
    amenities: Array.isArray(body.amenities) ? (body.amenities as string[]).filter((a) => typeof a === "string") : undefined,
    packageLevel,
    ownerId: typeof body.ownerId === "string" ? body.ownerId.trim() : undefined,
  });

  return NextResponse.json({ success: true, listing }, { status: 201 });
}
