const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing users for a fresh start (Optional, but good for verification)
    // await User.deleteMany();
    // console.log('Existing users cleared.');

    const adminEmail = 'arjun@example.com';
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);

      const admin = await User.create({
        name: 'Arjun Kumar',
        email: adminEmail,
        password: 'password123',
        role: 'admin',
        status: 'active',
      });
      console.log(`Admin user created: ${adminEmail} / password123`);
      
      // Create some sample users with Indian names
      await User.create([
        {
          name: 'Priya Sharma',
          email: 'priya@example.com',
          password: 'password123',
          role: 'manager',
          status: 'active',
          createdBy: admin._id,
        },
        {
          name: 'Amit Patel',
          email: 'amit@example.com',
          password: 'password123',
          role: 'user',
          status: 'active',
          createdBy: admin._id,
        },
        {
          name: 'Suresh Raina',
          email: 'suresh@example.com',
          password: 'password123',
          role: 'user',
          status: 'inactive',
          createdBy: admin._id,
        }
      ]);
      console.log('Sample users seeded with Indian names.');
    } else {
      console.log('Admin user (Arjun) already exists.');
    }

    console.log(`Seeding complete! You can now log in with ${adminEmail} / password123`);
    process.exit();
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

seedData();
