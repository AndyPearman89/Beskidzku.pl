# Database Setup

This project uses **Prisma ORM** with **PostgreSQL** for persistent data storage.

## Prerequisites

- PostgreSQL 14+ installed and running
- Node.js 20+

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/beskidzku?schema=public"
```

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Generate Prisma Client

```bash
npm run db:generate
```

### 3. Push Schema to Database

For development (creates tables without migrations):

```bash
npm run db:push
```

Or create a migration:

```bash
npm run db:migrate
```

### 4. Seed Database

```bash
npm run db:seed
```

This will populate the database with initial data for listings and peaks.

## Database Scripts

- `npm run db:generate` — Generate Prisma Client from schema
- `npm run db:push` — Push schema changes to database (dev only)
- `npm run db:migrate` — Create and run migrations
- `npm run db:seed` — Seed database with initial data
- `npm run db:studio` — Open Prisma Studio (database GUI)

## Schema

The database schema is defined in `prisma/schema.prisma` and includes:

- **Listings** — Business listings with package tiers (FREE, PREMIUM, PREMIUM+)
- **Peaks** — Mountain peaks with elevation, difficulty, and hiking information

## Database Adapters

The `core/db/adapters/` directory contains database adapter functions that provide a clean API for database operations:

- `listingsDb` — CRUD operations for listings
- `peaksDb` — CRUD operations for peaks

These adapters maintain backward compatibility with the existing API while adding database persistence.

## Production Deployment

For production, use migrations instead of `db:push`:

1. Create migration: `npm run db:migrate`
2. Commit the migration files
3. On production server, run: `npx prisma migrate deploy`

## Prisma Studio

To explore and edit data visually:

```bash
npm run db:studio
```

Open http://localhost:5555
