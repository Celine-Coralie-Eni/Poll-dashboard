const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function makeAdmin() {
  try {
    const email = 'calinecoralie0@gmail.com';
    
    console.log(`Looking for user with email: ${email}`);
    
    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, role: true }
    });

    if (!user) {
      console.log('❌ User not found. Make sure you have signed in with Google OAuth first.');
      return;
    }

    console.log(`Found user: ${user.name} (${user.email}) - Current role: ${user.role}`);

    if (user.role === 'ADMIN') {
      console.log('✅ User is already an admin!');
      return;
    }

    // Update user to admin
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
      select: { id: true, email: true, name: true, role: true }
    });

    console.log('✅ Success! User is now an admin:');
    console.log(`   Name: ${updatedUser.name}`);
    console.log(`   Email: ${updatedUser.email}`);
    console.log(`   Role: ${updatedUser.role}`);

  } catch (error) {
    console.error('❌ Error making user admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

makeAdmin();
