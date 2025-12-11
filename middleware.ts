import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  // Check if user is accessing dashboard
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    const session = request.cookies.get("admin_session")

    if (!session && !request.nextUrl.pathname.startsWith("/dashboard/login")) {
      return NextResponse.redirect(new URL("/dashboard/login", request.url))
    }

    if (session && request.nextUrl.pathname === "/dashboard/login") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
