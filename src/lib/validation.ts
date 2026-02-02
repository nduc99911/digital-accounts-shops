import { z } from 'zod'

// Email validation
export const emailSchema = z.string()
  .min(1, 'Email là bắt buộc')
  .email('Email không hợp lệ')
  .max(255, 'Email quá dài')

// Password validation - strong password
export const passwordSchema = z.string()
  .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
  .max(128, 'Mật khẩu quá dài')
  .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ hoa')
  .regex(/[a-z]/, 'Mật khẩu phải có ít nhất 1 chữ thường')
  .regex(/[0-9]/, 'Mật khẩu phải có ít nhất 1 số')

// Phone validation
export const phoneSchema = z.string()
  .regex(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ')

// Name validation - prevent XSS
export const nameSchema = z.string()
  .min(1, 'Tên là bắt buộc')
  .max(100, 'Tên quá dài')
  .regex(/^[\p{L}\s'-]+$/u, 'Tên chỉ chứa chữ cái, khoảng trắng và dấu gạch ngang')

// Sanitize input to prevent XSS
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

// Login validation
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Mật khẩu là bắt buộc'),
})

// Register validation
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
  phone: phoneSchema.optional().or(z.literal('')),
})

// Product review validation
export const reviewSchema = z.object({
  productId: z.string().uuid('ID sản phẩm không hợp lệ'),
  rating: z.number().int().min(1).max(5, 'Đánh giá từ 1-5 sao'),
  comment: z.string().max(1000, 'Bình luận quá dài').optional(),
})

// Order validation
export const orderSchema = z.object({
  customerName: nameSchema,
  phone: phoneSchema,
  email: emailSchema.optional(),
  note: z.string().max(500, 'Ghi chú quá dài').optional(),
  items: z.array(z.object({
    productId: z.string(),
    qty: z.number().int().min(1).max(100),
  })).min(1, 'Giỏ hàng trống'),
})

// Coupon validation
export const couponSchema = z.object({
  code: z.string().min(3).max(20).regex(/^[A-Z0-9]+$/i, 'Mã chỉ chứa chữ và số'),
})

// Contact form validation
export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: z.string().min(1).max(100),
  message: z.string().min(10, 'Tin nhắn quá ngắn').max(5000, 'Tin nhắn quá dài'),
})

// Newsletter validation
export const newsletterSchema = z.object({
  email: emailSchema,
})
