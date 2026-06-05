import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

// 1. Define your route categories clearly
const isPublicPageRoute = createRouteMatcher([
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
]);

const isDashboardRoute = createRouteMatcher([
    "/home(.*)"
]);

const isPublicApiRoute = createRouteMatcher([
    "/api/videos"
]);

export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth();
    const currentUrl = new URL(req.url);
    const isApiRequest = currentUrl.pathname.startsWith("/api");

    // Case 1: Logged-in user trying to access landing, sign-in, or sign-up pages
    // Redirect them straight to the dashboard
    if (userId && isPublicPageRoute(req)) {
        return NextResponse.redirect(new URL("/home", req.url));
    }

    // Case 2: User is NOT logged in
    if (!userId) {
        // If it's a protected API route, DO NOT redirect to a UI page. Return 401.
        if (isApiRequest && !isPublicApiRoute(req)) {
            return new NextResponse(
                JSON.stringify({ success: false, message: "Authentication required" }),
                { status: 401, headers: { 'content-type': 'application/json' } }
            );
        }

        // If it's a protected frontend page (like /home), redirect to sign-in
        if (!isPublicPageRoute(req) && isDashboardRoute(req)) {
            return NextResponse.redirect(new URL("/sign-in", req.url));
        }
    }

    // Allow the request to proceed normally
    return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    // Always run for Clerk-specific frontend API routes
    '/__clerk/(.*)',
  ],
};