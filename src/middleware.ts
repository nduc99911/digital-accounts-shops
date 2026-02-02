import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { rateLimitCheck } from '@/lib/rate-limit'

export function middleware(request: NextRequest) {
  // Rate limiting
  const rateLimit = rateLimitCheck(request)
  if (rateLimit && !rateLimit.success) {
    return new NextResponse('Too many requests', {
      status: 429,
      headers: {
        'X-RateLimit-Limit': String(rateLimit.limit),
        'X-RateLimit-Remaining': String(rateLimit.remaining),
        'X-RateLimit-Reset': String(rateLimit.reset),
      },
    })
  }

  // Add security headers
  const response = NextResponse.next()
  
  // Prevent XSS attacks
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY')
  
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')
  
  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.google-analytics.com *.googletagmanager.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' blob: data: *.picsum.photos *.google-analytics.com",
      "font-src 'self'",
      "connect-src 'self' *.google-analytics.com",
      "frame-ancestors 'none'",
    ].join('; ')
  )
  
  // HSTS (HTTPS only)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    )
  }
  
  // Permissions policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()'
  )
  
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
