const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  // Encrypt the password
  const hashedPassword = await bcrypt.hash("superadmin", 10); // Menggunakan password 'admin' langsung

  // Insert or update the user with the new role
  await prisma.user.upsert({
    where: { email: "superadmin@gmail.com" }, // Menggunakan email superadmin
    update: {
      password: hashedPassword,
      role: "superadmin", // Update the role ke superadmin
    },
    create: {
      username: "Super Admin",
      email: "superadmin@gmail.com", // Menggunakan email superadmin
      password: hashedPassword,
      role: "superadmin", // Set the role untuk user baru
    },
  });

  console.log(
    "User created or updated with email superadmin@gmail.com and role superadmin"
  );
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
