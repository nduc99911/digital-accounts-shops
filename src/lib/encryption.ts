import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16
const AUTH_TAG_LENGTH = 16

// Get encryption key from env
function getKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY
  if (!key) {
    throw new Error('ENCRYPTION_KEY not set in environment variables')
  }
  // Hash the key to ensure it's 32 bytes (256 bits)
  return crypto.createHash('sha256').update(key).digest()
}

/**
 * Encrypt sensitive data (account credentials)
 */
export function encrypt(text: string): string {
  const key = getKey()
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
  
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  const authTag = cipher.getAuthTag()
  
  // Format: iv:authTag:encryptedData
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`
}

/**
 * Decrypt sensitive data (account credentials)
 */
export function decrypt(encryptedData: string): string {
  const key = getKey()
  const parts = encryptedData.split(':')
  
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted data format')
  }
  
  const iv = Buffer.from(parts[0], 'hex')
  const authTag = Buffer.from(parts[1], 'hex')
  const encrypted = parts[2]
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(authTag)
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  
  return decrypted
}

/**
 * Generate a secure random encryption key
 * Run this once to generate a key for .env
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Check if data is already encrypted (simple heuristic)
 */
export function isEncrypted(data: string): boolean {
  return data.includes(':') && data.split(':').length === 3
}
