import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const perms = ["manage_roles", "manage_permissions", "manage_users"];

  // Create permissions
  for (const p of perms) {
    await prisma.permission.upsert({
      where: { name: p },
      update: {},
      create: { name: p },
    });
  }

  // Create Admin role
  const admin = await prisma.role.upsert({
    where: { name: "Admin" },
    update: {},
    create: { name: "Admin" },
  });

  // Assign all permissions to Admin
  const all = await prisma.permission.findMany();

  await prisma.rolePermission.deleteMany({
    where: { roleId: admin.id },
  });

  await prisma.rolePermission.createMany({
    data: all.map((perm) => ({
      roleId: admin.id,
      permissionId: perm.id,
    })),
  });

  console.log("✅ Admin role & permissions seeded");

  // Create default Admin user
  const hashedPassword = await import("bcrypt").then(m => m.hash("password", 10));

  const user = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password: hashedPassword,
    },
  });

  // Assign Admin role to user
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: user.id,
        roleId: admin.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      roleId: admin.id,
    },
  });

  console.log("✅ Default Admin user seeded: admin@example.com / password");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
