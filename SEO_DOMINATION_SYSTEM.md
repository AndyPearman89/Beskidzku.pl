# BESKIDZKU.PL — SEO DOMINATION SYSTEM

**Version:** 1.0
**Created:** 2026-04-01
**Status:** Planning & Implementation Ready

---

## EXECUTIVE SUMMARY

This document outlines the comprehensive SEO strategy and technical implementation plan for scaling Beskidzku.pl from its current state to 10,000+ programmatically generated pages, targeting dominance in Polish regional tourism search queries.

### Goal
Dominate Google for high-intent tourism queries:
- `co zobaczyć + miasto` (what to see + town)
- `atrakcje + miasto` (attractions + town)
- `trasy + region` (routes + region)
- `plan weekend + region` (weekend plan + region)

### Scale Target
**10,000 - 100,000 pages** across 4 implementation phases

### Business Pipeline
```
DATA → AI CONTENT → PAGES → INTERNAL LINKS → INDEXATION → RANKINGS → TRAFFIC → LEADS → REVENUE
```

---

## SYSTEM ARCHITECTURE

### 4 Core Engines

#### 1. SEO Engine (Next.js)
- **SSG (Static Site Generation)** for initial page load performance
- **ISR (Incremental Static Regeneration)** for content freshness
- Dynamic routing with `generateStaticParams()`
- Optimized metadata generation per page

#### 2. AI Content Engine
- Programmatic content generation at scale
- Template-based prompts with data injection
- Quality controls and uniqueness validation
- Components:
  - Town introductions (200-300 words)
  - Attraction descriptions (150-200 words)
  - Daily itineraries (300-500 words)
  - FAQ generation (5-7 Q&A pairs)

#### 3. Data Engine
- PostgreSQL + Prisma ORM
- Core entities:
  - **Listings** (accommodations, businesses) ✅ Implemented
  - **Peaks** (mountain summits) ✅ Implemented
  - **Towns** (municipalities) 🔄 To implement
  - **Routes** (hiking/biking trails) 🔄 To implement
  - **Attractions** (POIs, museums, viewpoints) 🔄 To implement

#### 4. Indexation Engine
- Dynamic sitemap generation (split by entity type)
- Google Indexing API integration
- Automated URL submission on publish
- Internal linking graph algorithm

---

## PAGE STRUCTURE

### Dynamic Routes

```
/miejscowosc/[slug]           # Town landing pages (200+ pages)
/atrakcja/[slug]              # Individual attractions (2,000+ pages)
/szczyt/[slug]                # Peak summits (300+ pages) ✅ Implemented
/trasy/[slug]                 # Hiking/biking routes (500+ pages)
/planer/[region]              # Regional trip planners (10+ pages)

# Combinatorial SEO pages (Phase 3)
/miejscowosc/[town]/atrakcje
/miejscowosc/[town]/noclegi
/miejscowosc/[town]/szlaki
/miejscowosc/[town]/weekend
/trasy/[difficulty]/[region]
/szczyty/[range]
```

### URL Strategy
- Clean, semantic URLs (Polish slugs)
- Hyphenated slugs: `wisla`, `szczyrk`, `beskid-slaski`
- No date stamps or IDs in public URLs
- Canonical URLs to prevent duplication

---

## INTERNAL LINKING STRATEGY

### Link Graph Algorithm

**Automatic linking based on:**
- Geographic proximity (Haversine distance < 20km)
- Category similarity (same region/mountain range)
- Difficulty matching (routes of similar level)
- User journey flow (town → attractions → routes → accommodations)

### Link Density Targets
- **Minimum:** 5 internal links per page
- **Optimal:** 10-15 internal links per page
- **Maximum:** 25 links (avoid link farms)

### Link Placement
```
Related Towns Section:      3-5 links (within 20km radius)
Related Attractions:        5-7 links (same town/nearby)
Related Routes:             3-5 links (same difficulty + region)
Related Peaks:              3-5 links (same mountain range)
Contextual In-Content:      3-5 natural anchor links
```

### Anchor Text Strategy
- **50%** natural language: "najlepsze atrakcje w Szczyrku"
- **30%** partial match: "atrakcje Szczyrk"
- **20%** branded: "Szczyrk - Beskidzku.pl"
- Avoid exact match over-optimization

---

## SCHEMA.ORG IMPLEMENTATION

### Required Schema Types

#### TouristDestination (Towns)
```json
{
  "@context": "https://schema.org",
  "@type": "TouristDestination",
  "name": "Szczyrk",
  "description": "...",
  "address": { "@type": "PostalAddress", ... },
  "geo": { "@type": "GeoCoordinates", "latitude": 49.71, "longitude": 19.03 },
  "containsPlace": [...]
}
```

#### TouristAttraction (Attractions & Peaks)
```json
{
  "@context": "https://schema.org",
  "@type": "TouristAttraction",
  "name": "Skrzyczne",
  "description": "...",
  "geo": { "@type": "GeoCoordinates", ... },
  "isAccessibleForFree": true
}
```

#### FAQPage (All content pages)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "...", "acceptedAnswer": { ... } }
  ]
}
```

#### BreadcrumbList (Navigation)
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [...]
}
```

---

## IMPLEMENTATION PHASES

### PHASE 1: FOUNDATION (500 PAGES)

**Timeline:** Weeks 1-8
**Goal:** Establish technical foundation and proof of concept

#### Database Models (Prisma)

```prisma
model Town {
  id              String        @id @default(cuid())
  name            String
  slug            String        @unique
  region          String
  lat             Float
  lng             Float
  population      Int?
  elevation       Int?
  description     String?       @db.Text
  seo_title       String?
  seo_description String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  attractions     Attraction[]
  routes          Route[]

  @@index([slug])
  @@index([region])
  @@map("towns")
}

model Attraction {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  town_id     String
  category    String
  lat         Float
  lng         Float
  description String?  @db.Text
  image_url   String?
  website     String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  town        Town     @relation(fields: [town_id], references: [id])

  @@index([slug])
  @@index([town_id])
  @@index([category])
  @@map("attractions")
}

model Route {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  region      String
  distance    Float    // km
  difficulty  String   // easy, moderate, hard, very_hard
  duration    Int      // minutes
  elevation_gain Int?  // meters
  waypoints   Json?    // GeoJSON LineString
  description String?  @db.Text
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([slug])
  @@index([region])
  @@index([difficulty])
  @@map("routes")
}
```

#### Initial Data Seeding

**Priority Towns (50):**
- Szczyrk, Wisła, Ustroń, Brenna, Rajcza
- Żywiec, Sucha Beskidzka, Zawoja
- Korbielów, Istebna, Koniaków
- Bielsko-Biała (gateway city)
- All municipalities in Beskidy region

**Attractions (200):**
- Museums, viewpoints, monuments
- Natural attractions (waterfalls, caves)
- Cultural sites (churches, castles)
- Family attractions (playgrounds, mini-golf)

**Routes (100):**
- Popular hiking trails
- Cycling routes
- Educational trails
- Family-friendly walks

#### Page Templates

**File:** `app/miejscowosc/[slug]/page.tsx`
```typescript
export async function generateStaticParams() {
  const towns = await prisma.town.findMany({ select: { slug: true } })
  return towns.map((town) => ({ slug: town.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const town = await getTownBySlug(params.slug)
  return {
    title: `${town.name} - Atrakcje, Noclegi, Szlaki | Beskidzku.pl`,
    description: `Co zobaczyć w ${town.name}? Najlepsze atrakcje, sprawdzone noclegi i szlaki. Plan weekendu w ${town.name} ✓`,
    openGraph: { ... },
    alternates: { canonical: `/miejscowosc/${town.slug}` }
  }
}

export default async function TownPage({ params }: Props) {
  const town = await getTownBySlug(params.slug)
  const attractions = await getAttractionsByTown(town.id)
  const routes = await getRoutesByRegion(town.region)
  const listings = await getNearbyListings(town.lat, town.lng, 10)

  return (
    <>
      <script type="application/ld+json">{generateTownSchema(town)}</script>
      <TownHero town={town} />
      <QuickFacts town={town} />
      <AttractionsSection attractions={attractions} />
      <ItinerarySection town={town} />
      <AccommodationsSection listings={listings} />
      <RoutesSection routes={routes} />
      <FAQSection faqs={generateFAQs(town)} />
      <RelatedTownsSection nearbyTowns={getNearbyTowns(town)} />
    </>
  )
}
```

#### Content Strategy (Phase 1)

**Manual Content Creation:**
- Write unique content for top 50 towns (300-500 words each)
- Focus on value: practical tips, local insights, seasonal recommendations
- No AI content in Phase 1 (quality baseline)

**Content Sections:**
1. **Hero Intro** (150-200 words): Overview, why visit, best season
2. **Quick Facts**: Elevation, population, accessibility, parking
3. **Top Attractions** (5-7 items): Name, description, why visit, location
4. **Sample Itinerary**: 1-day plan with timing and logistics
5. **Accommodation Recommendations**: 3-5 listings with CTAs
6. **FAQ** (5-7 Q&As): Common questions answered
7. **Related Content**: Links to nearby towns, routes, peaks

#### Success Metrics (Phase 1)
- ✅ 500 pages live and indexed
- ✅ 50+ pages in Google index within 2 weeks
- ✅ 1,000 organic sessions/month
- ✅ 10 target keywords in top 30 positions
- ✅ Average page load time < 2 seconds

---

### PHASE 2: SCALING (3,000 PAGES)

**Timeline:** Weeks 9-16
**Goal:** Scale content generation with AI while maintaining quality

#### AI Content Engine Setup

**File:** `core/ai/contentGenerator.ts`

```typescript
import Anthropic from '@anthropic-ai/sdk'

interface ContentRequest {
  type: 'town_intro' | 'attraction_description' | 'itinerary' | 'faq'
  data: Record<string, any>
}

export async function generateContent(request: ContentRequest): Promise<string> {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const prompt = buildPrompt(request)

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }]
  })

  const content = extractContent(response)

  // Quality checks
  await validateContent(content, request.type)

  return content
}

function buildPrompt(request: ContentRequest): string {
  const templates = {
    town_intro: `Napisz unikalne wprowadzenie (200-250 słów) o miejscowości ${request.data.townName} w Beskidach.

Zawrzyj:
- Dlaczego warto odwiedzić ${request.data.townName}
- Główne atrakcje i charakterystyka
- Praktyczne informacje (jak dojechać, gdzie parkować)
- Naturalny, przyjazny ton, pisz w 2. osobie

Dane: ${JSON.stringify(request.data)}

Zasady:
- Nie używaj ogólników typu "malownicza miejscowość"
- Konkretne fakty i liczby
- Bez clickbaitowych haseł
- Naturalny język, nie SEO spam`,

    attraction_description: `...`,
    itinerary: `...`,
    faq: `...`
  }

  return templates[request.type]
}
```

#### Content Generation Workflow

```
1. Fetch entity from database (town/attraction/route)
2. Generate content using AI (with data injection)
3. Validate content (length, uniqueness, readability)
4. Store content in database
5. Regenerate static page (ISR trigger)
6. Submit URL to Google Indexing API
```

#### Quality Controls

**Automated Checks:**
- Minimum word count (300 words for town pages, 150 for attractions)
- Uniqueness score > 95% (compared to existing content)
- Readability score (Flesch Reading Ease > 60)
- No placeholder text detection
- Keyword density check (avoid stuffing)

**Manual Review:**
- First 100 AI-generated pages reviewed by human
- Random sampling (5% of pages) for ongoing quality
- User feedback collection
- Search Console performance monitoring

#### Data Expansion

**Scale to:**
- 200 towns (all Beskidy municipalities + nearby areas)
- 2,000 attractions (comprehensive POI coverage)
- 500 routes (all documented trails)
- 300 peaks (complete summit catalog)

**Data Sources:**
- OpenStreetMap API (POI extraction)
- Polish tourism board databases
- Wikipedia (verified facts only)
- Manual curation (local knowledge)
- User submissions (moderated queue)

#### Internal Linking Engine

**File:** `core/seo/linkingEngine.ts`

```typescript
interface LinkCandidate {
  sourceId: string
  targetId: string
  targetUrl: string
  targetTitle: string
  score: number
  reason: 'proximity' | 'category' | 'difficulty' | 'journey'
}

export async function generateInternalLinks(
  entityType: 'town' | 'attraction' | 'route' | 'peak',
  entityId: string
): Promise<LinkCandidate[]> {
  const entity = await getEntity(entityType, entityId)

  const candidates: LinkCandidate[] = []

  // Geographic proximity
  if (entity.lat && entity.lng) {
    const nearby = await findNearbyEntities(entity.lat, entity.lng, 20) // 20km radius
    candidates.push(...nearby.map(e => ({
      sourceId: entityId,
      targetId: e.id,
      targetUrl: e.url,
      targetTitle: e.name,
      score: calculateProximityScore(entity, e),
      reason: 'proximity'
    })))
  }

  // Category similarity
  const similar = await findSimilarEntities(entity)
  candidates.push(...similar.map(...))

  // Sort by score and limit
  return candidates
    .sort((a, b) => b.score - a.score)
    .slice(0, 15) // max 15 link suggestions
}
```

#### Success Metrics (Phase 2)
- ✅ 3,000 pages live and indexed
- ✅ 70% indexation rate within 30 days
- ✅ 10,000 organic sessions/month
- ✅ 100 keywords in top 10 positions
- ✅ AI content quality score > 85%
- ✅ Page generation time < 5 seconds

---

### PHASE 3: DOMINATION (10,000+ PAGES)

**Timeline:** Weeks 17-24
**Goal:** Achieve market dominance through combinatorial SEO

#### Combinatorial Page Generation

**New Route Patterns:**

```
/miejscowosc/[town]/atrakcje          # "atrakcje w [town]"
/miejscowosc/[town]/noclegi           # "noclegi [town]"
/miejscowosc/[town]/szlaki            # "szlaki wokół [town]"
/miejscowosc/[town]/weekend           # "weekend w [town]"
/trasy/[difficulty]/[region]          # "łatwe szlaki Beskid Śląski"
/szczyty/[range]                      # "szczyty Beskidu Żywieckiego"
```

**Page Count Calculation:**
```
200 towns × 4 subtypes        = 800 pages
500 routes × 4 difficulties   = 2,000 pages
50 categories × 20 towns      = 1,000 pages
10 regions × 10 topics        = 100 pages
Seasonal/event pages          = 500 pages
Core pages (towns/peaks)      = 3,000 pages
Guides and resources          = 600 pages
────────────────────────────────────────
TOTAL                         = 8,000 pages
```

Add growth buffer → **10,000+ pages**

#### Dynamic Sitemap System

**File Structure:**
```
app/
  sitemap.xml/route.ts              # Index sitemap
  sitemap-towns.xml/route.ts        # All town pages
  sitemap-attractions.xml/route.ts  # All attraction pages
  sitemap-routes.xml/route.ts       # All route pages
  sitemap-peaks.xml/route.ts        # All peak pages
  sitemap-guides.xml/route.ts       # Editorial content
```

**Implementation:** `app/sitemap-towns.xml/route.ts`
```typescript
export async function GET() {
  const towns = await prisma.town.findMany({
    select: { slug: true, updatedAt: true }
  })

  const urls = towns.map(town => ({
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/miejscowosc/${town.slug}`,
    lastmod: town.updatedAt.toISOString(),
    changefreq: 'weekly',
    priority: 0.8
  }))

  const xml = generateSitemapXML(urls)

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  })
}
```

**Sitemap Index:** `app/sitemap.xml/route.ts`
```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://beskidzku.pl/sitemap-towns.xml</loc>
    <lastmod>2026-04-01T00:00:00+00:00</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://beskidzku.pl/sitemap-attractions.xml</loc>
    <lastmod>2026-04-01T00:00:00+00:00</lastmod>
  </sitemap>
  ...
</sitemapindex>
```

#### Google Indexing API Integration

**File:** `core/seo/googleIndexing.ts`

```typescript
import { google } from 'googleapis'

const indexing = google.indexing('v3')

export async function submitUrlToGoogle(url: string, type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED') {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH,
    scopes: ['https://www.googleapis.com/auth/indexing']
  })

  const authClient = await auth.getClient()

  try {
    const response = await indexing.urlNotifications.publish({
      auth: authClient,
      requestBody: {
        url,
        type
      }
    })

    console.log(`Submitted ${url} to Google: ${response.status}`)
    return response.data
  } catch (error) {
    console.error(`Failed to submit ${url}:`, error)
    throw error
  }
}

export async function batchSubmitUrls(urls: string[]) {
  const BATCH_SIZE = 100 // Google limit: 200/minute, be conservative

  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE)

    await Promise.all(
      batch.map(url => submitUrlToGoogle(url).catch(console.error))
    )

    // Rate limiting: wait 60s between batches
    if (i + BATCH_SIZE < urls.length) {
      await new Promise(resolve => setTimeout(resolve, 60000))
    }
  }
}
```

**Webhook Trigger:** On content publish/update
```typescript
// In core/api/towns.ts or similar
export async function updateTown(id: string, data: TownUpdate) {
  const town = await prisma.town.update({ where: { id }, data })

  // Trigger ISR revalidation
  await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate?path=/miejscowosc/${town.slug}`, {
    method: 'POST',
    headers: { 'X-Revalidate-Secret': process.env.REVALIDATE_SECRET }
  })

  // Submit to Google
  await submitUrlToGoogle(`${process.env.NEXT_PUBLIC_SITE_URL}/miejscowosc/${town.slug}`)

  return town
}
```

#### Advanced AI Content

**Context-Aware Generation:**
- Real distance calculations (Haversine formula)
- Actual weather patterns (historical data)
- Seasonal recommendations (peak seasons)
- Event integration (local festivals, holidays)
- User behavior signals (popular routes, high-converting attractions)

**Content Variations:**
- Comprehensive guides (2,000+ words) for top 20 towns
- Comparison pages: "Szczyrk vs Wisła - Która miejscowość wybrać?"
- Seasonal guides: "Beskidy zimą - najlepsze miejsca na narty"
- Activity-based: "Beskidy z dziećmi - rodzinne atrakcje"

**Quality Improvements:**
- Expert review for flagship pages (top 50 pages)
- User-generated content integration (reviews, photos, tips)
- Licensed photo galleries (Unsplash, Pexels)
- Video embeds (YouTube: trails, attractions)

#### Success Metrics (Phase 3)
- ✅ 10,000+ pages live and indexed
- ✅ 90% indexation rate within 60 days
- ✅ 50,000+ organic sessions/month
- ✅ 500+ keywords in top 10 positions
- ✅ 100+ featured snippets captured
- ✅ 100+ leads/month from organic traffic

---

### PHASE 4: INDEXATION & RANKING OPTIMIZATION

**Timeline:** Ongoing (post-launch)
**Goal:** Maximize visibility and conversion

#### Technical SEO Audit

**Core Web Vitals:**
- **LCP (Largest Contentful Paint):** < 2.5s
  - Optimize images (WebP, lazy loading)
  - Server response time < 500ms
  - CDN for static assets
- **FID (First Input Delay):** < 100ms
  - Minimize JavaScript execution
  - Code splitting and tree shaking
- **CLS (Cumulative Layout Shift):** < 0.1
  - Reserve space for images, ads, embeds
  - Avoid dynamic content injection above fold

**Mobile Optimization:**
- Mobile-first indexing ready
- Touch-friendly UI (44px+ tap targets)
- Fast mobile load times (< 3s)
- Responsive images with srcset

**Structured Data:**
- Validate all schema.org markup (Google Rich Results Test)
- Implement Event schema for seasonal content
- Add Review schema (user ratings)
- Product schema for accommodations

#### Content Quality Assurance

**Anti-Duplication System:**
```typescript
import similarity from 'string-similarity'

export async function checkContentUniqueness(content: string, entityType: string): Promise<number> {
  // Fetch sample of existing content
  const existingContent = await prisma[entityType].findMany({
    select: { description: true },
    take: 100,
    orderBy: { createdAt: 'desc' }
  })

  const scores = existingContent.map(existing =>
    similarity.compareTwoStrings(content, existing.description)
  )

  const maxSimilarity = Math.max(...scores)
  const uniquenessScore = 1 - maxSimilarity

  return uniquenessScore * 100 // Return percentage
}
```

**Thin Content Prevention:**
- Minimum word count: 300 words
- Minimum internal links: 5 per page
- At least 1 image per page
- Structured content (headings H2-H4, lists, tables)

**Content Update Strategy:**
- Refresh top 20% pages every quarter
- Update based on search performance (GSC data)
- Add trending topics (new attractions, events)
- Seasonal content rotation

#### Link Building Strategy

**Internal Link Density:**
- Average 10-15 internal links per page
- Bi-directional linking (A ↔ B)
- Hub pages (comprehensive guides with 20+ links)
- Orphan page detection and repair

**External Links:**
- Link to authoritative sources (tourism boards, government)
- Natural citations (Wikipedia, official sites)
- Affiliate links (nofollow): Booking.com, Airbnb

**Link Monitoring:**
- Broken link detection (weekly scan)
- Redirect chain resolution
- 404 error tracking and fixing

#### Monitoring & Analytics

**Google Search Console Integration:**
```typescript
// Fetch GSC data via API
export async function getSearchPerformance(page: string, days: number = 30) {
  const webmasters = google.webmasters('v3')

  const response = await webmasters.searchanalytics.query({
    siteUrl: 'https://beskidzku.pl',
    requestBody: {
      startDate: getDateDaysAgo(days),
      endDate: getDateToday(),
      dimensions: ['query', 'page'],
      dimensionFilterGroups: [{
        filters: [{ dimension: 'page', expression: page }]
      }],
      rowLimit: 1000
    }
  })

  return response.data.rows
}
```

**Key Metrics to Track:**
- Organic traffic per page group
- Keyword rankings (track 500+ target keywords)
- Indexation coverage (indexed vs submitted)
- Click-through rate from SERPs
- Pages crawled/day (crawl budget)
- Core Web Vitals scores
- Conversion rate (visit → lead)

**Dashboard Setup:**
- Next.js Analytics (Vercel) for performance
- Google Analytics 4 for user behavior
- Google Search Console for SEO metrics
- Custom dashboard for business KPIs

#### Success Metrics (Phase 4)
- ✅ Core Web Vitals: all green
- ✅ 95%+ indexation rate
- ✅ Average position < 15 for target keywords
- ✅ 100,000+ organic sessions/month
- ✅ 1,000+ keywords in top 10
- ✅ 500+ leads/month from organic traffic
- ✅ Conversion rate > 2%

---

## TECHNICAL IMPLEMENTATION

### File Structure

```
beskidzku.pl/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                           # Homepage
│   ├── miejscowosc/
│   │   └── [slug]/
│   │       ├── page.tsx                   # Town landing page
│   │       ├── atrakcje/page.tsx          # Town attractions page
│   │       ├── noclegi/page.tsx           # Town accommodations
│   │       ├── szlaki/page.tsx            # Town routes
│   │       └── weekend/page.tsx           # Weekend planner
│   ├── atrakcja/
│   │   └── [slug]/page.tsx                # Individual attraction
│   ├── trasy/
│   │   ├── [slug]/page.tsx                # Individual route
│   │   └── [difficulty]/
│   │       └── [region]/page.tsx          # Filtered routes
│   ├── szczyt/
│   │   └── [slug]/page.tsx                # Peak summit (existing)
│   ├── szczyty/
│   │   ├── page.tsx                       # All peaks (existing)
│   │   └── [range]/page.tsx               # Peaks by range
│   ├── planer/
│   │   ├── page.tsx                       # Main planner (existing)
│   │   └── [region]/page.tsx              # Regional planner
│   ├── sitemap.xml/route.ts               # Sitemap index
│   ├── sitemap-towns.xml/route.ts
│   ├── sitemap-attractions.xml/route.ts
│   ├── sitemap-routes.xml/route.ts
│   ├── sitemap-peaks.xml/route.ts
│   └── api/
│       ├── towns/
│       │   ├── route.ts                   # GET/POST towns
│       │   └── [slug]/route.ts            # GET/PUT/DELETE town
│       ├── attractions/
│       │   ├── route.ts
│       │   └── [slug]/route.ts
│       ├── routes/
│       │   ├── route.ts
│       │   └── [slug]/route.ts
│       ├── revalidate/route.ts            # ISR webhook
│       └── seo/
│           ├── submit-to-google/route.ts  # Manual trigger
│           └── link-suggestions/route.ts  # Internal link API
│
├── core/
│   ├── api/
│   │   ├── listings.ts                    # Existing
│   │   ├── peaks.ts                       # Existing
│   │   ├── towns.ts                       # New
│   │   ├── attractions.ts                 # New
│   │   └── routes.ts                      # New
│   ├── ai/
│   │   ├── contentGenerator.ts            # AI content engine
│   │   ├── prompts/
│   │   │   ├── town-intro.txt
│   │   │   ├── attraction-description.txt
│   │   │   ├── itinerary.txt
│   │   │   └── faq.txt
│   │   └── validators.ts                  # Content quality checks
│   ├── seo/
│   │   ├── linkingEngine.ts               # Internal link algorithm
│   │   ├── sitemapGenerator.ts            # Sitemap XML generation
│   │   ├── googleIndexing.ts              # Google Indexing API
│   │   ├── schemaGenerator.ts             # Schema.org helpers
│   │   └── metadataGenerator.ts           # Meta tags helper
│   └── db/
│       └── prisma.ts                      # Prisma client singleton
│
├── prisma/
│   ├── schema.prisma                      # Database schema
│   ├── seed.ts                            # Main seed script
│   ├── seeds/
│   │   ├── towns.ts                       # Town data
│   │   ├── attractions.ts                 # Attraction data
│   │   └── routes.ts                      # Route data
│   └── migrations/                        # Migration history
│
├── public/
│   ├── images/
│   └── robots.txt
│
├── SEO_DOMINATION_SYSTEM.md               # This document
├── SYSTEM_SPECIFICATION.txt               # Existing spec
└── package.json
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/beskidzku"

# AI Content Generation
ANTHROPIC_API_KEY="sk-ant-..."

# Google Services
GOOGLE_SERVICE_ACCOUNT_KEY_PATH="/path/to/service-account.json"
GOOGLE_SEARCH_CONSOLE_SITE_URL="https://beskidzku.pl"

# Next.js
NEXT_PUBLIC_SITE_URL="https://beskidzku.pl"
NEXT_PUBLIC_SITE_NAME="Beskidzku.pl"
REVALIDATE_SECRET="<random_secret>"

# Admin
LISTINGS_ADMIN_KEY="<existing_key>"
```

### Next.js Configuration

**File:** `next.config.ts`
```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',

  // ISR configuration
  experimental: {
    isrMemoryCacheSize: 0, // Disable in-memory cache (use CDN)
  },

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    minimumCacheTTL: 86400, // 24 hours
  },

  // Performance
  compress: true,
  poweredByHeader: false,

  // Redirects for old URLs (if migrating)
  async redirects() {
    return [
      // Add redirects as needed
    ]
  },

  // Headers for SEO and security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ]
  },
}

export default nextConfig
```

### ISR Configuration

**In page components:**
```typescript
// Revalidate every 24 hours
export const revalidate = 86400

// Or per-request revalidation
export const dynamic = 'force-static'
export const dynamicParams = true // Allow ISR for new pages
```

---

## MONETIZATION INTEGRATION

### Lead Generation Flow

```
1. User searches "co zobaczyć Szczyrk" → lands on /miejscowosc/szczyrk
2. Reads attractions, itinerary, tips
3. Sees accommodation cards: "Zobacz noclegi w Szczyrku" CTA
4. Clicks → goes to /miejscowosc/szczyrk/noclegi
5. Views listing with contact form
6. Submits inquiry → lead sent to business owner
7. Business receives email → contacts user → booking
```

### Conversion Points

**On Every Content Page:**
- Accommodation recommendations (3-5 cards)
- "Book now" / "Contact" CTAs
- Featured listings (PREMIUM+ highlighted)
- Planner integration ("Add to trip" button)

**Tracking Events (GA4):**
```typescript
// In components
gtag('event', 'view_accommodation', {
  listing_id: listing.id,
  listing_title: listing.title,
  page_type: 'town_page'
})

gtag('event', 'lead_submit', {
  listing_id: listing.id,
  source_page: window.location.pathname
})

gtag('event', 'cta_click', {
  cta_type: 'book_now',
  listing_package: listing.packageLevel
})
```

### A/B Testing Strategy

**Test Variations:**
- CTA button text: "Zobacz szczegóły" vs "Sprawdź dostępność" vs "Rezerwuj"
- Card placement: Sidebar vs in-content vs bottom
- Number of recommendations: 3 vs 5 vs 7
- Image presence: With photos vs without

**Success Metrics:**
- Click-through rate on CTAs
- Lead submission rate
- Time on page before conversion
- Scroll depth to CTA sections

---

## RISK MITIGATION

### Duplicate Content Risks

**Prevention:**
- Unique templates per page type
- AI variation prompts (same data, different phrasing)
- Content fingerprinting before publish
- Canonical tags on all pages
- Parameter handling for filters (?sort, ?page)

**Detection:**
- Weekly uniqueness audits
- Google Search Console duplicate meta tag alerts
- Manual sampling (5% of pages)

### Google Penalty Risks

**Avoid:**
- ❌ Keyword stuffing (natural language only)
- ❌ Cloaking or hidden text
- ❌ Link schemes or PBNs
- ❌ Auto-generated gibberish
- ❌ Doorway pages (thin content)

**Ensure:**
- ✅ Genuine value per page (300+ words)
- ✅ Unique content (95%+ uniqueness)
- ✅ Natural internal linking
- ✅ User-focused content
- ✅ Transparent citations

### Technical Failure Risks

**Safeguards:**
- ISR fallback if AI service fails
- Static fallback content for critical pages
- Error boundaries in Next.js components
- Monitoring and alerting (Sentry, Vercel)
- Database backups (daily)

**Incident Response:**
- Rollback mechanism for bad content
- Manual override for AI-generated pages
- Emergency contact form (if lead system fails)

### Performance Risks

**Optimization:**
- Incremental builds (only changed pages)
- CDN for all static assets (Vercel Edge)
- Database query optimization (proper indexes)
- Caching at all layers (database, API, CDN)
- Lazy loading for heavy components

**Monitoring:**
- Real User Monitoring (Vercel Analytics)
- Core Web Vitals tracking
- Server response time alerts
- Database query performance logs

---

## SUCCESS METRICS SUMMARY

### Phase 1: Foundation (Weeks 1-8)
| Metric | Target |
|--------|--------|
| Pages Live | 500 |
| Pages Indexed | 50+ (within 2 weeks) |
| Organic Sessions/Month | 1,000 |
| Keywords in Top 30 | 10 |
| Average Page Load Time | < 2s |

### Phase 2: Scaling (Weeks 9-16)
| Metric | Target |
|--------|--------|
| Pages Live | 3,000 |
| Indexation Rate | 70% (within 30 days) |
| Organic Sessions/Month | 10,000 |
| Keywords in Top 10 | 100 |
| AI Content Quality Score | > 85% |

### Phase 3: Domination (Weeks 17-24)
| Metric | Target |
|--------|--------|
| Pages Live | 10,000+ |
| Indexation Rate | 90% (within 60 days) |
| Organic Sessions/Month | 50,000+ |
| Keywords in Top 10 | 500+ |
| Featured Snippets | 100+ |
| Leads/Month | 100+ |

### Phase 4: Optimization (Ongoing)
| Metric | Target |
|--------|--------|
| Core Web Vitals | All green |
| Indexation Rate | 95%+ |
| Average SERP Position | < 15 |
| Organic Sessions/Month | 100,000+ |
| Keywords in Top 10 | 1,000+ |
| Leads/Month | 500+ |
| Conversion Rate | > 2% |

---

## IMPLEMENTATION CHECKLIST

### Week 1-2: Database & Models
- [ ] Create Prisma models: Town, Attraction, Route
- [ ] Add indexes for performance
- [ ] Write migration scripts
- [ ] Seed initial data (50 towns, 200 attractions, 100 routes)
- [ ] Test database queries

### Week 3-4: Page Templates
- [ ] Create `/miejscowosc/[slug]/page.tsx`
- [ ] Create `/atrakcja/[slug]/page.tsx`
- [ ] Create `/trasy/[slug]/page.tsx`
- [ ] Implement `generateStaticParams()` for all routes
- [ ] Implement `generateMetadata()` for SEO
- [ ] Add Schema.org JSON-LD to all templates

### Week 5-6: Content & Linking
- [ ] Write manual content for top 50 town pages
- [ ] Create internal linking engine (`core/seo/linkingEngine.ts`)
- [ ] Implement link suggestions API
- [ ] Add "Related Content" sections to all templates
- [ ] Test internal link graph

### Week 7-8: Sitemaps & Launch
- [ ] Implement dynamic sitemaps (all entity types)
- [ ] Create sitemap index
- [ ] Submit sitemaps to Google Search Console
- [ ] Deploy Phase 1 (500 pages)
- [ ] Monitor indexation

### Week 9-12: AI Content Engine
- [ ] Set up Anthropic API integration
- [ ] Create content generation prompts
- [ ] Build content validation system
- [ ] Generate content for 2,500 additional pages
- [ ] Manual review of first 100 AI pages
- [ ] Deploy Phase 2 (3,000 pages)

### Week 13-16: Google Indexing API
- [ ] Set up Google service account
- [ ] Implement indexing API integration
- [ ] Create webhook for auto-submission
- [ ] Batch submit all existing pages
- [ ] Monitor submission status

### Week 17-20: Combinatorial Pages
- [ ] Create subtopic page templates (atrakcje, noclegi, szlaki, weekend)
- [ ] Generate 7,000 additional pages
- [ ] Implement advanced internal linking
- [ ] Deploy Phase 3 (10,000+ pages)

### Week 21-24: Optimization
- [ ] Audit Core Web Vitals
- [ ] Fix performance issues
- [ ] Implement A/B testing for CTAs
- [ ] Set up analytics dashboards
- [ ] Monitor and iterate

### Ongoing: Maintenance
- [ ] Weekly content quality audits
- [ ] Monthly top-pages refresh
- [ ] Quarterly SEO performance review
- [ ] Continuous monitoring and optimization

---

## CONCLUSION

This SEO Domination System transforms Beskidzku.pl from a regional directory into a comprehensive tourism content engine capable of generating 10,000+ unique, valuable pages targeting high-intent search queries.

**Key Success Factors:**
1. **Quality over quantity** - Even at scale, each page must provide genuine value
2. **Technical excellence** - Fast, mobile-friendly, properly structured
3. **Strategic linking** - Internal link graph that boosts all pages
4. **Continuous optimization** - Data-driven iteration based on performance

**Expected Outcome:**
- Dominate "co zobaczyć + miasto" for 200+ towns
- Capture 50%+ of regional tourism search traffic
- Generate 500+ qualified leads/month
- Establish Beskidzku.pl as the definitive Beskidy tourism resource

**Next Steps:**
1. Review and approve this plan
2. Set up development environment
3. Begin Phase 1 implementation (Week 1-2: Database models)
4. Follow checklist sequentially

---

**Document Version:** 1.0
**Last Updated:** 2026-04-01
**Status:** Ready for Implementation
**Owner:** Andy Pearman / Beskidzku.pl Team
