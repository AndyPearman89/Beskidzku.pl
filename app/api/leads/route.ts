import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/core/api/rateLimiter";
import { getListing } from "@/core/api/listings";

export interface Lead {
  id: string;
  listingId: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
  status: "new" | "contacted" | "converted";
}

// Runtime in-memory lead store (use DB in production — data is lost on server restart)
const runtimeLeadsStore = new Map<string, Lead>();

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const allowed = checkRateLimit(`leads:${ip}`, 5, 60_000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Zbyt wiele zapytań. Spróbuj ponownie za chwilę." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { listingId, name, email, phone, message } = body as {
    listingId?: string;
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
  };

  if (!listingId || typeof listingId !== "string") {
    return NextResponse.json({ error: "listingId jest wymagane" }, { status: 400 });
  }
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return NextResponse.json({ error: "Imię i nazwisko jest wymagane (min. 2 znaki)" }, { status: 400 });
  }
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Podaj prawidłowy adres e-mail" }, { status: 400 });
  }
  if (!message || typeof message !== "string" || message.trim().length < 10) {
    return NextResponse.json({ error: "Wiadomość jest wymagana (min. 10 znaków)" }, { status: 400 });
  }

  // Verify the listing exists
  const listing = getListing(listingId);
  if (!listing) {
    return NextResponse.json({ error: "Wpis nie istnieje" }, { status: 404 });
  }

  const id = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const lead: Lead = {
    id,
    listingId,
    name: name.trim().slice(0, 120),
    email: email.trim().slice(0, 254),
    phone: phone?.trim().slice(0, 30),
    message: message.trim().slice(0, 2000),
    createdAt: new Date().toISOString(),
    status: "new",
  };

  runtimeLeadsStore.set(id, lead);

  return NextResponse.json({ success: true, leadId: id }, { status: 201 });
}
