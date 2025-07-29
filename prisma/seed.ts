import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: {
      email: process.env.ADMIN_EMAIL!,
    },
  });

  if (existingAdmin) {
    console.log('✅ Admin user already exists:', existingAdmin.email);
    return;
  }

  // Create admin user from environment variables
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME;

  if (!adminEmail || !adminPassword || !adminName) {
    throw new Error('❌ Missing admin credentials in environment variables. Please check ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_NAME in your .env file.');
  }

  // Hash the admin password
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  // Create the admin user
  const adminUser = await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created successfully:');
  console.log(`   Email: ${adminUser.email}`);
  console.log(`   Name: ${adminUser.name}`);
  console.log(`   Role: ${adminUser.role}`);
  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });