import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// NOTE: Next.js middleware runs on the Edge runtime, which does NOT support
// the Node `crypto`-based `jsonwebtoken` library. We use `jose`, which is
// built on the Web Crypto API and works on the Edge.
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 🔓 Public routes (auth not required)
  if (
    pathname.startsWith("/api/auth") ||
    pathname === "/" ||
    pathname.startsWith("/_next")
  ) {
    return NextResponse.next();
  }

  // 🔒 Protect all other /api routes
  if (pathname.startsWith("/api")) {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
