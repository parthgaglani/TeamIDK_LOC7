import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { UserRole } from '@/lib/types';
import { jwtVerify } from 'jose';

// Paths that don't require authentication
const publicPaths = ['/', '/login', '/signup', '/forgot-password'];

// Common authenticated paths that all roles can access
const commonAuthPaths = ['/profile'];

const roleBasedPaths = {
  finance: [
    '/finance/dashboard',
    '/finance/review-expenses',
    '/finance/fraud-detection',
    '/finance/compliance',
    '/finance/analytics',
  ],
  employee: [
    '/employee/dashboard',
    '/employee/expense-history',
    '/employee/submit-expense',
    '/employee/ai-assistant',
  ],
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow public paths
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Check if the path is protected
  const isProtectedPath = pathname.startsWith('/finance/') || 
                         pathname.startsWith('/employee/') || 
                         commonAuthPaths.includes(pathname);

  if (!isProtectedPath) {
    return NextResponse.next();
  }

  const session = request.cookies.get('session')?.value;
  
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(session, secret);
    const userRole = payload.role as UserRole;

    // Allow access to common auth paths for all authenticated users
    if (commonAuthPaths.includes(pathname)) {
      return NextResponse.next();
    }

    // Check role-based access
    const allowedPaths = roleBasedPaths[userRole];
    if (!allowedPaths) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // Check if the current path starts with any of the allowed paths
    const hasAccess = allowedPaths.some(path => pathname.startsWith(path));
    if (!hasAccess) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 