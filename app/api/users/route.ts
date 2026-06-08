import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromReq, hasPermission } from "@/lib/auth";
import bcrypt from "bcryptjs";

// 📄 GET all users (Admin only)
export async function GET(req: Request) {
  try {
    const user = await getUserFromReq(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check if user has permission to view users
    // (Assuming "manage_users" or similar is needed, but "Admin" usually returns true for hasPermission if implemented that way, 
    // or we check specific permission. The seed has "manage_roles", let's assume we might need to add "manage_users" or just rely on role check if simplified.
    // However, the seed created "manage_roles" and "manage_permissions". Implementation plan didn't specify new permissions but implied full management.
    // I should probably add "manage_users" to the seed or check for it. 
    // For now, let's use "manage_roles" as a proxy for admin, or better, add "manage_users" to seed later.
    // Safest bet for now: check if user has "manage_roles" which Admins have, 
    // OR just checking if they are logged in and have some admin capabilities. 
    // Let's stick to "manage_roles" for now as a proxy for "Admin" access until we update seed.)
    const allowed = await hasPermission(user.userId, "manage_users");
    if (!allowed) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true,
        roles: {
          select: {
            role: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(users);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// ➕ CREATE user (Admin only)
export async function POST(req: Request) {
  try {
    const user = await getUserFromReq(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const allowed = await hasPermission(user.userId, "manage_users");
    if (!allowed) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { email, password, roleIds } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        roles: {
          create: Array.isArray(roleIds)
            ? roleIds.map((rid: string) => ({ roleId: rid }))
            : [],
        },
      },
      select: {
        id: true,
        email: true,
        roles: {
          select: {
            role: true
          }
        }
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to create user" },
      { status: 500 }
    );
  }
}
