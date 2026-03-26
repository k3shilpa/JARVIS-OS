// backend/src/db/prisma.js
// ─── Prisma Client Singleton ──────────────────────────────────────────────────
//
// We create ONE PrismaClient instance and reuse it everywhere.
// This avoids opening too many database connections.
//
// Import this in any route file that needs DB access:
//   import prisma from '../db/prisma.js'
//
// Phase 5 sets up the full Prisma schema and migrations.
// For now this file just exports the client so routes can import it.
// The routes won't use it until Phase 5 — they return mock data for now.

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default prisma