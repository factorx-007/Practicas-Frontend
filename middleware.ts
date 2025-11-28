import { NextRequest, NextResponse } from 'next/server';
//import { AUTH_ROUTES, PROTECTED_ROUTES, PUBLIC_ROUTES, ROLE_ROUTES } from './src/constants/middleware';

// Define which routes require authentication
const PROTECTED_PREFIXES = ['/dashboard', '/profile', '/settings', '/chat', '/offers/create', '/offers/edit'];
const AUTH_PREFIXES = ['/auth'];
const PUBLIC_PREFIXES = ['/api/auth', '/api/health'];


// Optimistic cookie check - just verify existence (2024 best practice)
function hasCookieSession(accessToken?: string, refreshToken?: string): boolean {
  // For httpOnly cookies, we can only check existence, not decode
  // The server will validate the actual token content
  return !!(accessToken || refreshToken);
}

// Since we can't decode httpOnly cookies in middleware, we'll rely on server validation
// Role-based route protection will be handled by the actual page components

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files, API routes, and public assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/health') ||
    pathname.includes('.') ||
    PUBLIC_PREFIXES.some(prefix => pathname.startsWith(prefix))
  ) {
    return NextResponse.next();
  }

  // Get tokens from cookies
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  console.log(`🛡️ [Middleware] Path: ${pathname} | AccessToken: ${!!accessToken} | RefreshToken: ${!!refreshToken}`);

  const isAuthRoute = AUTH_PREFIXES.some(prefix => pathname.startsWith(prefix));
  const isProtectedRoute = PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix));

  // For protected routes, be very permissive - only block if absolutely no cookies
  if (isProtectedRoute) {
    // Only redirect if absolutely no cookies at all
    if (!accessToken && !refreshToken) {
      console.log(`🚫 [Middleware] Blocking protected route ${pathname} - No tokens found`);
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    console.log(`✅ [Middleware] Allowing protected route ${pathname}`);

    // If we have any cookies, let the component handle the verification
    return NextResponse.next();
  }

  // For auth routes, check if user is already authenticated
  if (isAuthRoute) {
    const hasSessionCookies = hasCookieSession(accessToken, refreshToken);
    if (hasSessionCookies) {
      // Quick check - if has cookies, likely authenticated
      console.log(`Example: [Middleware] Redirecting from auth route ${pathname} to dashboard`);
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Handle root route redirection
  if (pathname === '/') {
    const hasSessionCookies = hasCookieSession(accessToken, refreshToken);
    if (hasSessionCookies) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};