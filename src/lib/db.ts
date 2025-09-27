import { PrismaClient } from '@prisma/client'

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = global as unknown as { prisma: PrismaClient }

// Get database URL and modify it to disable prepared statements if needed
function getDatabaseUrl() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL environment variable is not set')
  }
  
  // If using PgBouncer or similar connection pooler, disable prepared statements
  if (url.includes('pgbouncer') || process.env.DISABLE_PREPARED_STATEMENTS === 'true') {
    const urlObj = new URL(url)
    urlObj.searchParams.set('pgbouncer', 'true')
    return urlObj.toString()
  }
  
  return url
}

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: 'pretty',
  datasources: {
    db: {
      url: getDatabaseUrl(),
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Test database connection with timeout
export async function testDatabaseConnection() {
  try {
    // Use a simple query with timeout instead of $connect
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database timeout')), 5000)
      )
    ])
    return true
  } catch (error) {
    // Log error in development only
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Database connection test failed:', error)
    }
    return false
  }
}

// Initialize database connection
export async function initializeDatabase() {
  try {
    await prisma.$connect()
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('Database connected successfully')
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Failed to connect to database:', error)
    }
    throw error
  }
}

// Graceful shutdown function
export async function disconnectPrisma() {
  try {
    await prisma.$disconnect()
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error disconnecting from database:', error)
    }
  }
}

// Handle process termination
if (typeof process !== 'undefined') {
  process.on('beforeExit', disconnectPrisma)
  process.on('SIGINT', disconnectPrisma)
  process.on('SIGTERM', disconnectPrisma)
}
