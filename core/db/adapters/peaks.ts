/**
 * Peaks Database Adapter
 */

import prisma from '@/core/db/prisma'
import type { Peak } from '@/core/api/peaks'

export const peaksDb = {
  /**
   * Find all peaks with optional filters
   */
  async findMany(filters?: {
    q?: string
    range?: string
    difficulty?: Peak['difficulty']
    minElevation?: number
    maxElevation?: number
    sortBy?: 'elevation' | 'name' | 'difficulty'
    sortOrder?: 'asc' | 'desc'
    perPage?: number
    page?: number
  }): Promise<Peak[]> {
    const where: any = {}

    if (filters?.range) where.range = filters.range
    if (filters?.difficulty) where.difficulty = filters.difficulty

    // Elevation range filter
    if (filters?.minElevation !== undefined || filters?.maxElevation !== undefined) {
      where.elevation = {}
      if (filters.minElevation !== undefined) {
        where.elevation.gte = filters.minElevation
      }
      if (filters.maxElevation !== undefined) {
        where.elevation.lte = filters.maxElevation
      }
    }

    // Full-text search
    if (filters?.q) {
      where.OR = [
        { name: { contains: filters.q, mode: 'insensitive' } },
        { description: { contains: filters.q, mode: 'insensitive' } },
        { range: { contains: filters.q, mode: 'insensitive' } },
      ]
    }

    const take = filters?.perPage || 30
    const skip = filters?.page ? (filters.page - 1) * take : 0

    // Determine sort order
    const orderBy: any = {}
    if (filters?.sortBy === 'elevation') {
      orderBy.elevation = filters?.sortOrder || 'desc'
    } else if (filters?.sortBy === 'difficulty') {
      orderBy.difficulty = filters?.sortOrder || 'asc'
    } else {
      orderBy.name = filters?.sortOrder || 'asc'
    }

    const peaks = await prisma.peak.findMany({
      where,
      take,
      skip,
      orderBy,
    })

    return peaks.map(peak => ({
      ...peak,
      createdAt: peak.createdAt.toISOString(),
      updatedAt: peak.updatedAt.toISOString(),
    }))
  },

  /**
   * Find a single peak by ID
   */
  async findById(id: string): Promise<Peak | null> {
    const peak = await prisma.peak.findUnique({
      where: { id },
    })

    if (!peak) return null

    return {
      ...peak,
      createdAt: peak.createdAt.toISOString(),
      updatedAt: peak.updatedAt.toISOString(),
    }
  },

  /**
   * Find a single peak by slug
   */
  async findBySlug(slug: string): Promise<Peak | null> {
    const peak = await prisma.peak.findUnique({
      where: { slug },
    })

    if (!peak) return null

    return {
      ...peak,
      createdAt: peak.createdAt.toISOString(),
      updatedAt: peak.updatedAt.toISOString(),
    }
  },

  /**
   * Create a new peak
   */
  async create(data: Omit<Peak, 'id' | 'createdAt' | 'updatedAt'>): Promise<Peak> {
    const peak = await prisma.peak.create({
      data,
    })

    return {
      ...peak,
      createdAt: peak.createdAt.toISOString(),
      updatedAt: peak.updatedAt.toISOString(),
    }
  },

  /**
   * Update an existing peak
   */
  async update(id: string, data: Partial<Omit<Peak, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Peak> {
    const peak = await prisma.peak.update({
      where: { id },
      data,
    })

    return {
      ...peak,
      createdAt: peak.createdAt.toISOString(),
      updatedAt: peak.updatedAt.toISOString(),
    }
  },

  /**
   * Delete a peak
   */
  async delete(id: string): Promise<void> {
    await prisma.peak.delete({
      where: { id },
    })
  },

  /**
   * Count peaks with optional filters
   */
  async count(filters?: {
    q?: string
    range?: string
    difficulty?: Peak['difficulty']
    minElevation?: number
    maxElevation?: number
  }): Promise<number> {
    const where: any = {}

    if (filters?.range) where.range = filters.range
    if (filters?.difficulty) where.difficulty = filters.difficulty

    if (filters?.minElevation !== undefined || filters?.maxElevation !== undefined) {
      where.elevation = {}
      if (filters.minElevation !== undefined) {
        where.elevation.gte = filters.minElevation
      }
      if (filters.maxElevation !== undefined) {
        where.elevation.lte = filters.maxElevation
      }
    }

    if (filters?.q) {
      where.OR = [
        { name: { contains: filters.q, mode: 'insensitive' } },
        { description: { contains: filters.q, mode: 'insensitive' } },
        { range: { contains: filters.q, mode: 'insensitive' } },
      ]
    }

    return await prisma.peak.count({ where })
  },

  /**
   * Find peaks near a location (within a bounding box)
   */
  async findNearby(lat: number, lng: number, radiusKm: number = 10): Promise<Peak[]> {
    // Approximate degree conversion (1 degree ≈ 111km)
    const latDelta = radiusKm / 111
    const lngDelta = radiusKm / (111 * Math.cos((lat * Math.PI) / 180))

    const peaks = await prisma.peak.findMany({
      where: {
        lat: {
          gte: lat - latDelta,
          lte: lat + latDelta,
        },
        lng: {
          gte: lng - lngDelta,
          lte: lng + lngDelta,
        },
      },
      orderBy: {
        elevation: 'desc',
      },
    })

    return peaks.map(peak => ({
      ...peak,
      createdAt: peak.createdAt.toISOString(),
      updatedAt: peak.updatedAt.toISOString(),
    }))
  },
}
