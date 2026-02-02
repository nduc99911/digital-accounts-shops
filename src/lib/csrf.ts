import crypto from 'crypto'

const CSRF_TOKEN_SECRET = process.env.CSRF_SECRET || crypto.randomBytes(32).toString('hex')

// Generate CSRF token
export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Verify CSRF token
export function verifyCsrfToken(token: string, storedToken: string): boolean {
  try {
    return crypto.timingSafeEqual(
      Buffer.from(token),
      Buffer.from(storedToken)
    )
  } catch {
    return false
  }
}

// Get CSRF token for forms
export function getCsrfToken(): { token: string; cookie: string } {
  const token = generateCsrfToken()
  const cookie = crypto
    .createHmac('sha256', CSRF_TOKEN_SECRET)
    .update(token)
    .digest('hex')
  
  return { token, cookie }
}
