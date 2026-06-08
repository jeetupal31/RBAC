import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromReq, hasPermission } from "@/lib/auth";
import bcrypt from "bcryptjs";

// 🔍 GET single user
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getUserFromReq(req);
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        // Allow users to view their own profile, or admins to view anyone
        const { id: targetUserId } = await params;

        const isAdmin = await hasPermission(user.userId, "manage_roles");
        if (user.userId !== targetUserId && !isAdmin) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const foundUser = await prisma.user.findUnique({
            where: { id: targetUserId },
            select: {
                id: true,
                email: true,
                createdAt: true,
                roles: {
                    select: {
                        role: true,
                    },
                },
            },
        });

        if (!foundUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(foundUser);
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: "Failed to fetch user" },
            { status: 500 }
        );
    }
}

// ✏️ UPDATE user
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const requestingUser = await getUserFromReq(req);
        if (!requestingUser) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id: targetUserId } = await params;
        const allowed = await hasPermission(requestingUser.userId, "manage_roles");

        // Only admins can update other users (or maybe users can update their own password? 
        // For now, let's restrict to admins for simplicity of RBAC demo, or allow self-update of password only?)
        // Let's stick to Admin management for this route.
        if (!allowed) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const body = await req.json();
        const { email, password, roleIds } = body;

        const data: any = {};
        if (email) data.email = email;
        if (password) {
            data.password = await bcrypt.hash(password, 10);
        }

        // Role updates
        if (Array.isArray(roleIds)) {
            // We need to handle this carefully. `update` with `set` for relation might be easier
            // But prisma `set` works on `UserRole` join table. 
            // Easier: delete all userRoles for this user, then create new ones. 
            // Or usage of `deleteMany` and `createMany` in a transaction.
            // For simplicity in a single update call, we can use `deleteMany` then `create`.
            // But let's do it transactionally or just separate calls if needed.
            // Actually, let's keep it simple: separate role update logic is in `/api/users/[id]/roles` usually, 
            // but if we want to support it here:

            // This is a bit complex for a single `update`. 
            // Let's assume this endpoint updates basic info. 
            // Roles should use the dedicated endpoint OR we handle it here by wiping and recreating.
            // Let's handle it here for convenience.

            const op1 = prisma.userRole.deleteMany({ where: { userId: targetUserId } });
            const op2 = prisma.userRole.createMany({
                data: roleIds.map((rid: string) => ({ userId: targetUserId, roleId: rid }))
            });
            const op3 = prisma.user.update({
                where: { id: targetUserId },
                data
            });

            await prisma.$transaction([op1, op2, op3]);

            return NextResponse.json({ message: "User updated" });
        }

        // If no roles update
        const updated = await prisma.user.update({
            where: { id: targetUserId },
            data,
            select: { id: true, email: true }
        });

        return NextResponse.json(updated);

    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: "Failed to update user" },
            { status: 500 }
        );
    }
}

// ❌ DELETE user
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getUserFromReq(req);
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const allowed = await hasPermission(user.userId, "manage_roles");
        if (!allowed) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const { id: targetUserId } = await params;

        await prisma.user.delete({
            where: { id: targetUserId },
        });

        return NextResponse.json({ message: "User deleted" });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: "Failed to delete user" },
            { status: 500 }
        );
    }
}
