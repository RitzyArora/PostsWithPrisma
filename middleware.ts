import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    
  // Only protect API routes
  if (req.nextUrl.pathname.startsWith("/api/posts")) {
    const token = req.headers.get("x-api-key");
  

    // Check for missing token
    if (!token || token !== process.env.API_TOKEN) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing token" },
        { status: 401 }
      );
    }
  }

  // Continue to the route
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/posts/:path*"], // Only apply to posts API routes
};
