import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const path = req.nextUrl.pathname;
    const token = req.nextauth.token;
    
    // Protect /admin routes - only ADMIN can access
    if (path.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/student", req.url));
    }

    // Protect /student routes - only STUDENT can access
    if (path.startsWith("/student") && token?.role !== "STUDENT") {
      if (token?.role === "ADMIN") {
         return NextResponse.redirect(new URL("/admin", req.url));
      }
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*", 
    "/student/:path*",
    "/redirect"
  ],
};
