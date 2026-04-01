import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getListing, getListings } from "@/core/api/listings";
import ContactForm from "./ContactForm";
import {
  createAttractionSchema,
  createBreadcrumbSchema,
  renderJsonLd
} from "@/core/seo/schemas";
import { generateListingMetadata } from "@/core/seo/metadata";

type Params = { id: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) return {};
  return generateListingMetadata(listing);
}

export default async function ListingDetailPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) notFound();

  const { items: related } = await getListings({ town: listing.town, perPage: 3 });
  const relatedFiltered = related.filter((r) => r.id !== listing.id).slice(0, 3);

  const packageLabel: Record<string, string> = {
    "PREMIUM+": "PREMIUM+",
    "PREMIUM": "PREMIUM",
    "FREE": "FREE",
  };
  const packageColors: Record<string, string> = {
    "PREMIUM+": "bg-[var(--color-primary-soft)] text-[var(--color-primary)] border border-[var(--color-primary)]",
    "PREMIUM": "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
    "FREE": "bg-gray-100 text-gray-500",
  };

  const isContactVisible = listing.packageLevel !== "FREE";

  // Generate JSON-LD schemas
  const attractionSchema = listing.lat && listing.lng ? createAttractionSchema({
    name: listing.title,
    description: listing.description,
    latitude: listing.lat,
    longitude: listing.lng,
    addressLocality: listing.town,
    url: `https://beskidzku.pl/listings/${listing.id}`,
  }) : null;

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Strona główna", url: "https://beskidzku.pl" },
    { name: "Katalog", url: "https://beskidzku.pl/listings" },
    { name: listing.title, url: `https://beskidzku.pl/listings/${listing.id}` },
  ]);

  return (
    <>
      {/* JSON-LD Schemas */}
      {attractionSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: renderJsonLd(attractionSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(breadcrumbSchema) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="text-xs text-[var(--color-muted)] mb-6">
        <a href="/" className="hover:text-[var(--color-primary)]">Strona główna</a>
        {" / "}
        <a href="/listings" className="hover:text-[var(--color-primary)]">Katalog</a>
        {" / "}
        <span>{listing.title}</span>
      </nav>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide">
                  {listing.type} · {listing.category}
                </p>
                <h1 className="text-3xl font-extrabold mt-1">{listing.title}</h1>
                <p className="text-[var(--color-muted)] mt-2">📍 {listing.town} · {listing.address}</p>
              </div>
              <span className={`text-xs px-3 py-1.5 rounded-full font-bold flex-shrink-0 ${packageColors[listing.packageLevel] ?? ""}`}>
                {packageLabel[listing.packageLevel]}
              </span>
            </div>
            <p className="text-[var(--color-text)] leading-relaxed">{listing.description}</p>

            {listing.amenities && listing.amenities.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide mb-2">Udogodnienia</p>
                <div className="flex flex-wrap gap-2">
                  {listing.amenities.map((a) => (
                    <span key={a} className="px-3 py-1 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-full text-xs font-semibold">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Map */}
          {listing.lat && listing.lng && (
            <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-5">
              <h2 className="text-base font-semibold mb-3">Lokalizacja</h2>
              <div className="rounded-xl overflow-hidden">
                <iframe
                  title={`Mapa - ${listing.title}`}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${listing.lng - 0.02},${listing.lat - 0.01},${listing.lng + 0.02},${listing.lat + 0.01}&layer=mapnik&marker=${listing.lat},${listing.lng}`}
                  style={{ width: "100%", height: "280px", border: 0, borderRadius: "12px" }}
                  loading="lazy"
                />
              </div>
              <a
                href={`https://www.openstreetmap.org/?mlat=${listing.lat}&mlon=${listing.lng}#map=15/${listing.lat}/${listing.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[var(--color-primary)] font-semibold mt-2 hover:underline"
              >
                Otwórz na OpenStreetMap →
              </a>
            </div>
          )}

          {/* Related listings */}
          {relatedFiltered.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Inne w {listing.town}</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {relatedFiltered.map((r) => (
                  <a
                    key={r.id}
                    href={`/listings/${r.id}`}
                    className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-md p-4 transition-all block"
                  >
                    <p className="text-xs text-[var(--color-muted)] uppercase">{r.type}</p>
                    <p className="font-semibold text-sm mt-1">{r.title}</p>
                    <p className="text-xs text-[var(--color-muted)] mt-1 line-clamp-2">{r.description}</p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Contact info */}
          <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-5">
            <h2 className="text-base font-semibold mb-3">Kontakt</h2>
            {isContactVisible ? (
              <div className="space-y-2 text-sm">
                {listing.phone && (
                  <a href={`tel:${listing.phone}`} className="flex items-center gap-2 text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors font-semibold">
                    📞 {listing.phone}
                  </a>
                )}
                {listing.email && (
                  <a href={`mailto:${listing.email}`} className="flex items-center gap-2 text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors">
                    ✉️ {listing.email}
                  </a>
                )}
                {listing.website && (
                  <a href={listing.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[var(--color-primary)] hover:underline">
                    🌐 Strona WWW →
                  </a>
                )}
                {!listing.phone && !listing.email && !listing.website && (
                  <p className="text-[var(--color-muted)] text-sm">Brak danych kontaktowych</p>
                )}
              </div>
            ) : (
              <div className="rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] p-4 text-center">
                <p className="text-sm font-semibold text-[var(--color-muted)]">🔒 Dane kontaktowe ukryte</p>
                <p className="text-xs text-[var(--color-muted)] mt-1">Skontaktuj się przez formularz poniżej.</p>
              </div>
            )}
          </div>

          {/* Package info */}
          <div className={`rounded-2xl border p-4 ${listing.packageLevel === "FREE" ? "bg-gray-50 border-gray-200" : "bg-[var(--color-primary-soft)] border-[var(--color-primary)]"}`}>
            <p className={`text-xs font-bold uppercase tracking-wide ${listing.packageLevel === "FREE" ? "text-gray-500" : "text-[var(--color-primary)]"}`}>
              {packageLabel[listing.packageLevel]}
            </p>
            {listing.packageLevel === "FREE" && (
              <p className="text-xs text-gray-500 mt-1">Chcesz wyróżnić swój wpis? <a href="/dodaj-firme" className="text-[var(--color-primary)] font-semibold hover:underline">Skontaktuj się →</a></p>
            )}
          </div>

          {/* Add to planner */}
          <a
            href="/planner"
            className="block text-center px-4 py-3 rounded-xl border border-[var(--color-border)] bg-white hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] font-semibold text-sm transition-colors"
          >
            🗺️ Dodaj do plannera
          </a>
        </div>
      </div>

      {/* Contact form (always visible) */}
      <div className="mt-8">
        <ContactForm listingId={listing.id} listingTitle={listing.title} />
      </div>
    </div>
    </>
  );
}
