import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory rate limiter
const rateLimit = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX = 100 // 100 requests per minute

export function rateLimitCheck(request: NextRequest): { success: boolean; limit: number; remaining: number; reset: number } | null {
  // Skip rate limiting in development
  if (process.env.NODE_ENV === 'development') return null
  
  const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'unknown'
  const key = `${ip}:${request.nextUrl.pathname}`
  
  const now = Date.now()
  const record = rateLimit.get(key)
  
  if (!record || now > record.resetTime) {
    rateLimit.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    })
    return { success: true, limit: RATE_LIMIT_MAX, remaining: RATE_LIMIT_MAX - 1, reset: now + RATE_LIMIT_WINDOW }
  }
  
  if (record.count >= RATE_LIMIT_MAX) {
    return { success: false, limit: RATE_LIMIT_MAX, remaining: 0, reset: record.resetTime }
  }
  
  record.count++
  return { success: true, limit: RATE_LIMIT_MAX, remaining: RATE_LIMIT_MAX - record.count, reset: record.resetTime }
}

// Stricter limits for auth routes
const AUTH_RATE_LIMIT_MAX = 5 // 5 attempts per minute

export function rateLimitAuth(request: NextRequest): { success: boolean; message?: string } {
  const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'unknown'
  const key = `auth:${ip}`
  
  const now = Date.now()
  const record = rateLimit.get(key)
  
  if (!record || now > record.resetTime) {
    rateLimit.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    })
    return { success: true }
  }
  
  if (record.count >= AUTH_RATE_LIMIT_MAX) {
    return { success: false, message: 'Too many login attempts. Please try again later.' }
  }
  
  record.count++
  return { success: true }
}
