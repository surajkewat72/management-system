const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('PostgreSQL Connected via Prisma');
    
    // Check if the users table exists (simple check)
    await prisma.user.count().catch(() => {
      console.warn('WARNING: "users" table not found. System may not be initialized. Please run: npm run db:setup');
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { prisma, connectDB };
