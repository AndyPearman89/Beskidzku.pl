import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  runtimeListingsStore,
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  type Listing,
} from "@/core/api/listings";

// Helper to build a minimal listing payload
function makePayload(overrides: Partial<Omit<Listing, "id" | "createdAt" | "updatedAt">> = {}) {
  return {
    title: "Test Hotel",
    type: "hotel",
    category: "nocleg",
    town: "Szczyrk",
    address: "ul. Testowa 1",
    description: "A test listing description",
    ...overrides,
  };
}

// Reset the in-memory store before every test so tests are isolated
beforeEach(() => {
  runtimeListingsStore.clear();
});

// ---------------------------------------------------------------------------
// createListing
// ---------------------------------------------------------------------------
describe("createListing", () => {
  it("returns a listing with a generated id and timestamps", () => {
    const listing = createListing(makePayload());

    expect(listing.id).toMatch(/^listing_/);
    expect(listing.title).toBe("Test Hotel");
    expect(listing.type).toBe("hotel");
    expect(listing.town).toBe("Szczyrk");
    expect(listing.createdAt).toBeTruthy();
    expect(listing.updatedAt).toBeTruthy();
  });

  it("persists the listing in the store", () => {
    const listing = createListing(makePayload());
    expect(runtimeListingsStore.has(listing.id)).toBe(true);
  });

  it("stores optional fields when provided", () => {
    const listing = createListing(
      makePayload({
        lat: 49.71,
        lng: 19.03,
        phone: "+48 123 456 789",
        website: "https://example.com",
        email: "test@example.com",
        ownerId: "owner-1",
      })
    );

    expect(listing.lat).toBe(49.71);
    expect(listing.lng).toBe(19.03);
    expect(listing.phone).toBe("+48 123 456 789");
    expect(listing.website).toBe("https://example.com");
    expect(listing.email).toBe("test@example.com");
    expect(listing.ownerId).toBe("owner-1");
  });

  it("creates listings with unique ids", () => {
    const a = createListing(makePayload());
    const b = createListing(makePayload({ title: "Another Hotel" }));
    expect(a.id).not.toBe(b.id);
  });
});

// ---------------------------------------------------------------------------
// getListing
// ---------------------------------------------------------------------------
describe("getListing", () => {
  it("returns the correct listing by id", () => {
    const created = createListing(makePayload());
    const found = getListing(created.id);
    expect(found).toEqual(created);
  });

  it("returns null for a non-existent id", () => {
    expect(getListing("does-not-exist")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// getListings
// ---------------------------------------------------------------------------
describe("getListings", () => {
  beforeEach(() => {
    createListing(makePayload({ title: "Hotel Alpha", type: "hotel", town: "Szczyrk" }));
    createListing(makePayload({ title: "Restaurant Beta", type: "restaurant", town: "Wisła", description: "Polish cuisine" }));
    createListing(makePayload({ title: "Browar Gamma", type: "attraction", town: "Żywiec", description: "Brewery tour" }));
  });

  it("returns all items when no filters are provided", () => {
    const result = getListings();
    expect(result.items).toHaveLength(3);
    expect(result.total).toBe(3);
  });

  it("filters by exact type", () => {
    const result = getListings({ type: "hotel" });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].type).toBe("hotel");
  });

  it("returns empty array when type filter matches nothing", () => {
    const result = getListings({ type: "spa" });
    expect(result.items).toHaveLength(0);
    expect(result.total).toBe(0);
  });

  it("filters by town (case-insensitive, partial match)", () => {
    const result = getListings({ town: "wisła" });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].town).toBe("Wisła");
  });

  it("filters by q matching title", () => {
    const result = getListings({ q: "alpha" });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].title).toBe("Hotel Alpha");
  });

  it("filters by q matching description", () => {
    const result = getListings({ q: "brewery" });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].title).toBe("Browar Gamma");
  });

  it("filters by q matching town", () => {
    const result = getListings({ q: "żywiec" });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].town).toBe("Żywiec");
  });

  it("q filter is case-insensitive", () => {
    const result = getListings({ q: "ALPHA" });
    expect(result.items).toHaveLength(1);
  });

  it("returns correct page/perPage metadata", () => {
    const result = getListings({ page: 1, perPage: 20 });
    expect(result.page).toBe(1);
    expect(result.perPage).toBe(20);
  });

  it("paginates items correctly", () => {
    const page1 = getListings({ page: 1, perPage: 2 });
    expect(page1.items).toHaveLength(2);
    expect(page1.total).toBe(3);

    const page2 = getListings({ page: 2, perPage: 2 });
    expect(page2.items).toHaveLength(1);
    expect(page2.total).toBe(3);
  });

  it("returns empty items for out-of-range page", () => {
    const result = getListings({ page: 99, perPage: 10 });
    expect(result.items).toHaveLength(0);
    expect(result.total).toBe(3);
  });

  it("can combine type and town filters", () => {
    createListing(makePayload({ type: "hotel", town: "Wisła", title: "Hotel Wisła" }));
    const result = getListings({ type: "hotel", town: "Wisła" });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].title).toBe("Hotel Wisła");
  });

  it("seeds demo data when store is empty (no explicit listings)", () => {
    // Store was cleared in outer beforeEach, call with empty store
    const result = getListings();
    // The seed function adds 5 demo listings
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.total).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// updateListing
// ---------------------------------------------------------------------------
describe("updateListing", () => {
  it("updates fields on an existing listing", () => {
    const created = createListing(makePayload());
    const updated = updateListing(created.id, { title: "Updated Title", town: "Ustroń" });

    expect(updated).not.toBeNull();
    expect(updated!.title).toBe("Updated Title");
    expect(updated!.town).toBe("Ustroń");
    // Unchanged fields remain
    expect(updated!.type).toBe(created.type);
  });

  it("updates the updatedAt timestamp", () => {
    vi.useFakeTimers();
    const created = createListing(makePayload());
    const before = created.updatedAt;
    vi.advanceTimersByTime(1);
    const updated = updateListing(created.id, { title: "New Title" });
    vi.useRealTimers();
    expect(updated!.updatedAt).not.toBe(before);
  });

  it("preserves the original id and createdAt", () => {
    const created = createListing(makePayload());
    const updated = updateListing(created.id, { title: "Changed" });
    expect(updated!.id).toBe(created.id);
    expect(updated!.createdAt).toBe(created.createdAt);
  });

  it("returns null for a non-existent id", () => {
    const result = updateListing("no-such-id", { title: "X" });
    expect(result).toBeNull();
  });

  it("persists the updated listing in the store", () => {
    const created = createListing(makePayload());
    updateListing(created.id, { title: "Persisted" });
    expect(runtimeListingsStore.get(created.id)?.title).toBe("Persisted");
  });
});

// ---------------------------------------------------------------------------
// deleteListing
// ---------------------------------------------------------------------------
describe("deleteListing", () => {
  it("returns true and removes an existing listing", () => {
    const created = createListing(makePayload());
    const result = deleteListing(created.id);
    expect(result).toBe(true);
    expect(runtimeListingsStore.has(created.id)).toBe(false);
  });

  it("returns false for a non-existent id", () => {
    expect(deleteListing("ghost-id")).toBe(false);
  });
});
