import { authMiddleware } from "@civic/auth/nextjs/middleware";

export default authMiddleware();

export const config = {
  matcher: [
    // Protect API routes
    "/api/analyze/:path*",
    "/api/transcript/:path*",
  ],
};
