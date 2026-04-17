const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();
const prisma = new PrismaClient();

const seedData = async () => {
  try {
    console.log('PostgreSQL Connected for seeding...');

    // Clear existing users for a fresh start (Optional)
    // await prisma.user.deleteMany();
    // console.log('Existing users cleared.');

    const adminEmail = 'arjun@gmail.com';
    const adminExists = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);

      const admin = await prisma.user.create({
        data: {
          name: 'Arjun Kumar',
          email: adminEmail,
          password: hashedPassword,
          role: 'ADMIN',
          status: 'ACTIVE',
        },
      });
      console.log(`Admin user created: ${adminEmail} / password123`);
      
      const userSalt = await bcrypt.genSalt(10);
      const userHashedPassword = await bcrypt.hash('password123', userSalt);

      // Create some sample users with Indian names
      await prisma.user.createMany({
        data: [
          {
            name: 'Priya Sharma',
            email: 'priya@gmail.com',
            password: userHashedPassword,
            role: 'MANAGER',
            status: 'ACTIVE',
            createdById: admin.id,
          },
          {
            name: 'Amit Patel',
            email: 'amit@gmail.com',
            password: userHashedPassword,
            role: 'USER',
            status: 'ACTIVE',
            createdById: admin.id,
          },
          {
            name: 'Suresh Raina',
            email: 'suresh@gmail.com',
            password: userHashedPassword,
            role: 'USER',
            status: 'INACTIVE',
            createdById: admin.id,
          }
        ],
      });
      console.log('Sample users seeded with Indian names.');
    } else {
      console.log('Admin user (Arjun) already exists in PostgreSQL.');
    }

    console.log(`Seeding complete! You can now log in with ${adminEmail} / password123`);
    await prisma.$disconnect();
    process.exit();
  } catch (err) {
    console.error('Error seeding data:', err);
    await prisma.$disconnect();
    process.exit(1);
  }
};

seedData();
