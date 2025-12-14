// src/lib/prisma.ts
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from './generated/prisma/client' // Import from your custom output path
import { Role } from './generated/prisma/client'
// Connection setup
const connectionString = `${process.env.DATABASE_URL}`

// 1. Define a factory function to create the client
const prismaClientSingleton = () => {
  // --- PRISMA 7+ ADAPTER SETUP ---
  // Create a pure PostgreSQL pool
  const pool = new Pool({ connectionString })
  // Create the Prisma adapter
  const adapter = new PrismaPg(pool)
  
  // Return the client instance with the adapter
  return new PrismaClient({ adapter })
  
}

// 2. Define the global type to prevent TypeScript errors
declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

// 3. Create the exportable instance
// Check if "prismaGlobal" already exists on globalThis. If so, use it.
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

// 4. In development, save the instance to globalThis
if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma
}