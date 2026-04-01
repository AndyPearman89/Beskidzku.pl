/**
 * Database Adapter Layer
 *
 * This module provides an abstraction layer over the database,
 * allowing seamless migration from in-memory storage to PostgreSQL with Prisma.
 *
 * It maintains backward compatibility with the existing API while adding
 * database persistence.
 */

import prisma from '@/core/db/prisma'
import type { Listing, PackageLevel } from '@/core/api/listings'

// Map between Prisma enum and app enum for packageLevel
function mapPackageLevelToApp(level: string): PackageLevel {
  if (level === 'PREMIUM_PLUS') return 'PREMIUM+'
  return level as PackageLevel
}

function mapPackageLevelToPrisma(level: PackageLevel): string {
  if (level === 'PREMIUM+') return 'PREMIUM_PLUS'
  return level
}

/**
 * Listings Database Adapter
 */
export const listingsDb = {
  /**
   * Find all listings with optional filters
   */
  async findMany(filters?: {
    q?: string
    type?: string
    town?: string
    category?: string
    packageLevel?: PackageLevel
    perPage?: number
    page?: number
  }): Promise<Listing[]> {
    const where: any = {}

    if (filters?.type) where.type = filters.type
    if (filters?.town) where.town = filters.town
    if (filters?.category) where.category = filters.category
    if (filters?.packageLevel) {
      where.packageLevel = mapPackageLevelToPrisma(filters.packageLevel)
    }

    // Full-text search across multiple fields
    if (filters?.q) {
      where.OR = [
        { title: { contains: filters.q, mode: 'insensitive' } },
        { description: { contains: filters.q, mode: 'insensitive' } },
        { town: { contains: filters.q, mode: 'insensitive' } },
        { address: { contains: filters.q, mode: 'insensitive' } },
      ]
    }

    const take = filters?.perPage || 30
    const skip = filters?.page ? (filters.page - 1) * take : 0

    const listings = await prisma.listing.findMany({
      where,
      take,
      skip,
      orderBy: [
        { packageLevel: 'asc' }, // PREMIUM+ first, then PREMIUM, then FREE
        { createdAt: 'desc' },
      ],
    })

    return listings.map(listing => ({
      ...listing,
      packageLevel: mapPackageLevelToApp(listing.packageLevel),
      createdAt: listing.createdAt.toISOString(),
      updatedAt: listing.updatedAt.toISOString(),
    }))
  },

  /**
   * Find a single listing by ID
   */
  async findById(id: string): Promise<Listing | null> {
    const listing = await prisma.listing.findUnique({
      where: { id },
    })

    if (!listing) return null

    return {
      ...listing,
      packageLevel: mapPackageLevelToApp(listing.packageLevel),
      createdAt: listing.createdAt.toISOString(),
      updatedAt: listing.updatedAt.toISOString(),
    }
  },

  /**
   * Create a new listing
   */
  async create(data: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>): Promise<Listing> {
    const listing = await prisma.listing.create({
      data: {
        ...data,
        packageLevel: mapPackageLevelToPrisma(data.packageLevel),
      },
    })

    return {
      ...listing,
      packageLevel: mapPackageLevelToApp(listing.packageLevel),
      createdAt: listing.createdAt.toISOString(),
      updatedAt: listing.updatedAt.toISOString(),
    }
  },

  /**
   * Update an existing listing
   */
  async update(id: string, data: Partial<Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Listing> {
    const updateData: any = { ...data }
    if (data.packageLevel) {
      updateData.packageLevel = mapPackageLevelToPrisma(data.packageLevel)
    }

    const listing = await prisma.listing.update({
      where: { id },
      data: updateData,
    })

    return {
      ...listing,
      packageLevel: mapPackageLevelToApp(listing.packageLevel),
      createdAt: listing.createdAt.toISOString(),
      updatedAt: listing.updatedAt.toISOString(),
    }
  },

  /**
   * Delete a listing
   */
  async delete(id: string): Promise<void> {
    await prisma.listing.delete({
      where: { id },
    })
  },

  /**
   * Count listings with optional filters
   */
  async count(filters?: {
    q?: string
    type?: string
    town?: string
    category?: string
    packageLevel?: PackageLevel
  }): Promise<number> {
    const where: any = {}

    if (filters?.type) where.type = filters.type
    if (filters?.town) where.town = filters.town
    if (filters?.category) where.category = filters.category
    if (filters?.packageLevel) {
      where.packageLevel = mapPackageLevelToPrisma(filters.packageLevel)
    }

    if (filters?.q) {
      where.OR = [
        { title: { contains: filters.q, mode: 'insensitive' } },
        { description: { contains: filters.q, mode: 'insensitive' } },
        { town: { contains: filters.q, mode: 'insensitive' } },
        { address: { contains: filters.q, mode: 'insensitive' } },
      ]
    }

    return await prisma.listing.count({ where })
  },
}
