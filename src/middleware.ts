import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "tanal_session";

/**
 * Edge-safe sessiya tekshiruvi. Middleware Edge runtime'da ishlagani uchun
 * Prisma/bcrypt ishlatmaymiz — faqat JWT imzosini tekshiramiz.
 */
async function getRoleFromRequest(
  req: NextRequest,
): Promise<{ role: string } | null> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });
    return { role: String(payload.role ?? "") };
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await getRoleFromRequest(req);

  // Tizimga kirgan foydalanuvchi login sahifasiga kirsa — panelga yo'naltiramiz
  if (pathname === "/kirish" && session) {
    const target = session.role === "SUPER_ADMIN" ? "/admin" : "/panel";
    return NextResponse.redirect(new URL(target, req.url));
  }

  // Bosh admin sahifalari
  if (pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/kirish", req.url));
    }
    if (session.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/panel", req.url));
    }
  }

  // Test markaz admin paneli
  if (pathname.startsWith("/panel")) {
    if (!session) {
      return NextResponse.redirect(new URL("/kirish", req.url));
    }
    if (session.role !== "TEST_CENTER_ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/panel/:path*", "/kirish"],
};
