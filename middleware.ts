import { auth } from "./lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isAccountRoute = req.nextUrl.pathname.startsWith("/compte");

  if (isAdminRoute && req.auth?.user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (isAccountRoute && !req.auth?.user) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
});

export const config = {
  matcher: ["/admin/:path*", "/compte/:path*"],
};
