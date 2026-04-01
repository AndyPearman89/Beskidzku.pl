import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getListing, getListings } from "@/core/api/listings";
import {
  createAttractionSchema,
  createBreadcrumbSchema,
  renderJsonLd
} from "@/core/seo/schemas";
import { generateAttractionMetadata } from "@/core/seo/metadata";
import { generateAttractionIntro } from "@/core/seo/content";

type Params = { slug: string };

// Helper function to convert slug to listing title (approximate match)
async function findListingBySlug(slug: string) {
  const { items } = await getListings({ perPage: 100 });

  // Try to find a listing that matches the slug
  // This is a simplified implementation - in production, you'd want a proper slug field in the database
  const normalized = slug.replace(/-/g, " ").toLowerCase();

  return items.find((listing) => {
    const titleNormalized = listing.title.toLowerCase();
    return titleNormalized.includes(normalized) || normalized.includes(titleNormalized);
  });
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const listing = await findListingBySlug(slug);

  if (!listing) return {};

  return generateAttractionMetadata({
    name: listing.title,
    description: listing.description,
    town: listing.town,
    slug: slug,
    type: listing.type,
  });
}

export async function generateStaticParams() {
  const { items } = await getListings({ type: "attraction", perPage: 100 });

  // Generate slugs from listing titles
  return items.map((listing) => ({
    slug: listing.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
  }));
}

export default async function AttractionDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const listing = await findListingBySlug(slug);

  if (!listing) notFound();

  // Get related attractions in the same town
  const { items: related } = await getListings({
    type: "attraction",
    town: listing.town,
    perPage: 3
  });
  const relatedFiltered = related.filter((r) => r.id !== listing.id).slice(0, 3);

  // Generate JSON-LD schemas
  const attractionSchema = listing.lat && listing.lng ? createAttractionSchema({
    name: listing.title,
    description: listing.description,
    latitude: listing.lat,
    longitude: listing.lng,
    addressLocality: listing.town,
    url: `https://beskidzku.pl/atrakcja/${slug}`,
  }) : null;

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Strona główna", url: "https://beskidzku.pl" },
    { name: "Atrakcje", url: "https://beskidzku.pl/listings?type=attraction" },
    { name: listing.title, url: `https://beskidzku.pl/atrakcja/${slug}` },
  ]);

  const seoIntro = generateAttractionIntro({
    name: listing.title,
    town: listing.town,
    type: listing.type,
  });

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
          <a href="/listings?type=attraction" className="hover:text-[var(--color-primary)]">Atrakcje</a>
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
                    {listing.type} · {listing.town}
                  </p>
                  <h1 className="text-3xl font-extrabold mt-1">{listing.title}</h1>
                  <p className="text-[var(--color-muted)] mt-2">📍 {listing.town} · {listing.address}</p>
                </div>
              </div>

              {listing.description ? (
                <p className="text-[var(--color-text)] leading-relaxed mb-4">{listing.description}</p>
              ) : (
                <p className="text-[var(--color-text)] leading-relaxed mb-4">{seoIntro}</p>
              )}

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

            {/* Related attractions */}
            {relatedFiltered.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Inne atrakcje w {listing.town}</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {relatedFiltered.map((r) => {
                    const relatedSlug = r.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
                    return (
                      <a
                        key={r.id}
                        href={`/atrakcja/${relatedSlug}`}
                        className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-md p-4 transition-all block"
                      >
                        <p className="font-semibold text-sm mt-1">{r.title}</p>
                        <p className="text-xs text-[var(--color-muted)] mt-1">📍 {r.town}</p>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Contact info */}
            {listing.packageLevel !== "FREE" && (listing.phone || listing.email || listing.website) && (
              <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-5">
                <h2 className="text-base font-semibold mb-3">Kontakt</h2>
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
                </div>
              </div>
            )}

            {/* Add to planner */}
            <a
              href="/planner"
              className="block text-center px-4 py-3 rounded-xl border border-[var(--color-primary)] bg-[var(--color-primary)] text-white hover:opacity-90 font-semibold text-sm transition-opacity"
            >
              🗺️ Dodaj do plannera
            </a>

            {/* Noclegi CTA */}
            <a
              href={`/region/${listing.town.toLowerCase().replace(/\s+/g, "-")}`}
              className="block text-center px-4 py-3 rounded-xl border border-[var(--color-border)] bg-white hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] font-semibold text-sm transition-colors"
            >
              🏨 Noclegi w {listing.town}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
