import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only apply to admin routes (excluding login)
  if (request.nextUrl.pathname.startsWith('/admin') && 
      request.nextUrl.pathname !== '/admin/login') {
    
    // Check for admin authentication cookie (httpOnly for security)
    const adminAuth = request.cookies.get('admin_auth');
    
    if (!adminAuth || adminAuth.value !== 'true') {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
