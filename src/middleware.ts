import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that don't require authentication
const publicPaths = ['/', '/login', '/signup', '/forgot-password'];

// Role-based path prefixes
const rolePathMap = {
  employee: '/employee',
  manager: '/manager',
  finance: '/finance',
  admin: '/admin',
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Check for auth session
  const session = request.cookies.get('session');

  if (!session) {
    // Redirect to login if no session exists
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Get user role from session (you'll need to implement this based on your session structure)
  // This is a placeholder - implement actual role extraction from your session
  const userRole = session.value ? JSON.parse(session.value).role : null;

  if (!userRole) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Check if user is accessing their allowed paths
  const isAccessingAllowedPath = pathname.startsWith(rolePathMap[userRole as keyof typeof rolePathMap]);
  
  if (!isAccessingAllowedPath) {
    // Redirect to their default dashboard if trying to access unauthorized area
    return NextResponse.redirect(new URL(`${rolePathMap[userRole as keyof typeof rolePathMap]}/dashboard`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/ routes
     * 2. /_next/ (Next.js internals)
     * 3. /_static (inside /public)
     * 4. /_vercel (Vercel internals)
     * 5. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
  ],
}; 