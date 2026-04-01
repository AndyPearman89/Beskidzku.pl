import { describe, it, expect, beforeEach } from "vitest";
import {
  getPeaks,
  getPeak,
  getPeakBySlug,
  getNearbyPeaks,
  createPeak,
  updatePeak,
  deletePeak,
  runtimePeaksStore,
} from "@/core/api/peaks";

describe("Peaks API", () => {
  beforeEach(() => {
    runtimePeaksStore.clear();
  });

  describe("getPeaks", () => {
    it("should return seeded peaks when store is empty", () => {
      const result = getPeaks();
      expect(result.items.length).toBeGreaterThan(0);
      expect(result.total).toBeGreaterThan(0);
      expect(result.items[0]).toHaveProperty("name");
      expect(result.items[0]).toHaveProperty("elevation");
    });

    it("should filter by range", () => {
      const result = getPeaks({ range: "Beskid Śląski" });
      result.items.forEach((peak) => {
        expect(peak.range).toContain("Beskid Śląski");
      });
    });

    it("should filter by difficulty", () => {
      const result = getPeaks({ difficulty: "moderate" });
      result.items.forEach((peak) => {
        expect(peak.difficulty).toBe("moderate");
      });
    });

    it("should filter by elevation range", () => {
      const result = getPeaks({ minElevation: 1200, maxElevation: 1600 });
      result.items.forEach((peak) => {
        expect(peak.elevation).toBeGreaterThanOrEqual(1200);
        expect(peak.elevation).toBeLessThanOrEqual(1600);
      });
    });

    it("should paginate results", () => {
      const result = getPeaks({ perPage: 3, page: 1 });
      expect(result.items.length).toBeLessThanOrEqual(3);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(3);
    });

    it("should sort by elevation (highest first)", () => {
      const result = getPeaks();
      for (let i = 0; i < result.items.length - 1; i++) {
        expect(result.items[i].elevation).toBeGreaterThanOrEqual(result.items[i + 1].elevation);
      }
    });
  });

  describe("getPeak", () => {
    it("should return null for non-existent peak", () => {
      const peak = getPeak("non-existent-id");
      expect(peak).toBeNull();
    });

    it("should return peak by id", () => {
      getPeaks(); // seed
      const allPeaks = [...runtimePeaksStore.values()];
      const firstPeak = allPeaks[0];
      const peak = getPeak(firstPeak.id);
      expect(peak).not.toBeNull();
      expect(peak?.id).toBe(firstPeak.id);
    });
  });

  describe("getPeakBySlug", () => {
    it("should return null for non-existent slug", () => {
      const peak = getPeakBySlug("non-existent-slug");
      expect(peak).toBeNull();
    });

    it("should return peak by slug", () => {
      getPeaks(); // seed
      const peak = getPeakBySlug("skrzyczne");
      expect(peak).not.toBeNull();
      expect(peak?.slug).toBe("skrzyczne");
      expect(peak?.name).toBe("Skrzyczne");
    });
  });

  describe("getNearbyPeaks", () => {
    it("should return peaks within radius", () => {
      getPeaks(); // seed
      // Center on Skrzyczne (49.6850, 19.0294)
      const nearby = getNearbyPeaks(49.6850, 19.0294, 20);
      expect(nearby.length).toBeGreaterThan(0);
      // Skrzyczne itself should be in results
      const skrzyczne = nearby.find((p) => p.slug === "skrzyczne");
      expect(skrzyczne).toBeDefined();
    });

    it("should return empty array when no peaks in radius", () => {
      getPeaks(); // seed
      // Far from any peaks
      const nearby = getNearbyPeaks(0, 0, 10);
      expect(nearby.length).toBe(0);
    });

    it("should sort by distance (nearest first)", () => {
      getPeaks(); // seed
      const lat = 49.6850;
      const lng = 19.0294;
      const nearby = getNearbyPeaks(lat, lng, 50);

      // Calculate distances and verify order
      function distance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      }

      for (let i = 0; i < nearby.length - 1; i++) {
        const dist1 = distance(lat, lng, nearby[i].lat, nearby[i].lng);
        const dist2 = distance(lat, lng, nearby[i + 1].lat, nearby[i + 1].lng);
        expect(dist1).toBeLessThanOrEqual(dist2);
      }
    });
  });

  describe("createPeak", () => {
    it("should create a new peak", () => {
      const newPeak = createPeak({
        name: "Test Peak",
        slug: "test-peak",
        lat: 50.0,
        lng: 20.0,
        elevation: 1000,
        range: "Test Range",
        difficulty: "easy",
        hiking_time: 120,
      });

      expect(newPeak.id).toBeDefined();
      expect(newPeak.name).toBe("Test Peak");
      expect(newPeak.slug).toBe("test-peak");
      expect(newPeak.elevation).toBe(1000);
      expect(newPeak.createdAt).toBeDefined();
      expect(newPeak.updatedAt).toBeDefined();
    });
  });

  describe("updatePeak", () => {
    it("should update existing peak", () => {
      const peak = createPeak({
        name: "Test Peak",
        slug: "test-peak",
        lat: 50.0,
        lng: 20.0,
        elevation: 1000,
        range: "Test Range",
        difficulty: "easy",
        hiking_time: 120,
      });

      const updated = updatePeak(peak.id, { elevation: 1100, description: "Updated description" });
      expect(updated).not.toBeNull();
      expect(updated?.elevation).toBe(1100);
      expect(updated?.description).toBe("Updated description");
      expect(updated?.name).toBe("Test Peak"); // unchanged
    });

    it("should return null for non-existent peak", () => {
      const updated = updatePeak("non-existent-id", { elevation: 1100 });
      expect(updated).toBeNull();
    });
  });

  describe("deletePeak", () => {
    it("should delete existing peak", () => {
      const peak = createPeak({
        name: "Test Peak",
        slug: "test-peak",
        lat: 50.0,
        lng: 20.0,
        elevation: 1000,
        range: "Test Range",
        difficulty: "easy",
        hiking_time: 120,
      });

      const deleted = deletePeak(peak.id);
      expect(deleted).toBe(true);
      expect(getPeak(peak.id)).toBeNull();
    });

    it("should return false for non-existent peak", () => {
      const deleted = deletePeak("non-existent-id");
      expect(deleted).toBe(false);
    });
  });
});
