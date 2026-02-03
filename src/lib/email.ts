import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@taikhoanso.com'
const SHOP_NAME = process.env.SHOP_NAME || 'taikhoanso.com'

interface SendEmailParams {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: SendEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set, email not sent')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `${SHOP_NAME} <${FROM_EMAIL}>`,
      to,
      subject,
      html,
      text,
    })

    if (error) {
      console.error('Resend error:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (err) {
    console.error('Email send error:', err)
    return { success: false, error: err }
  }
}

// Password reset email template
export function getPasswordResetEmailTemplate(resetUrl: string, shopName: string = SHOP_NAME) {
  return {
    subject: `Đặt lại mật khẩu - ${shopName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #7c3aed; margin: 0;">${shopName}</h1>
        </div>
        
        <div style="background: #f9fafb; border-radius: 12px; padding: 30px;">
          <h2 style="color: #1f2937; margin-top: 0;">Đặt lại mật khẩu</h2>
          <p style="color: #4b5563; line-height: 1.6;">
            Bạn đã yêu cầu đặt lại mật khẩu. Click vào nút bên dưới để tiếp tục:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: linear-gradient(135deg, #7c3aed, #c026d3); 
                      color: white; 
                      padding: 14px 32px; 
                      text-decoration: none; 
                      border-radius: 8px;
                      display: inline-block;
                      font-weight: bold;">
              Đặt lại mật khẩu
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">
            Hoặc copy link này vào trình duyệt:<br>
            <a href="${resetUrl}" style="color: #7c3aed; word-break: break-all;">${resetUrl}</a>
          </p>
          
          <p style="color: #9ca3af; font-size: 12px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
            Link này sẽ hết hạn sau 1 giờ.<br>
            Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
          </p>
        </div>
      </div>
    `,
    text: `Đặt lại mật khẩu - ${shopName}\n\nBạn đã yêu cầu đặt lại mật khẩu.\n\nClick vào link sau để đặt lại mật khẩu:\n${resetUrl}\n\nLink này sẽ hết hạn sau 1 giờ.`,
  }
}

// Order confirmation email template
export function getOrderConfirmationEmailTemplate(
  orderCode: string, 
  orderTotal: number,
  orderUrl: string,
  shopName: string = SHOP_NAME
) {
  const formatVnd = (n: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
  
  return {
    subject: `Xác nhận đơn hàng ${orderCode} - ${shopName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #7c3aed; margin: 0;">${shopName}</h1>
        </div>
        
        <div style="background: #f9fafb; border-radius: 12px; padding: 30px;">
          <h2 style="color: #1f2937; margin-top: 0;">🎉 Đơn hàng đã được tạo!</h2>
          <p style="color: #4b5563; line-height: 1.6;">
            Cảm ơn bạn đã đặt hàng. Đơn hàng <strong>${orderCode}</strong> đang chờ thanh toán.
          </p>
          
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Tổng tiền:</strong> <span style="color: #7c3aed; font-size: 18px;">${formatVnd(orderTotal)}</span></p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${orderUrl}" 
               style="background: linear-gradient(135deg, #7c3aed, #c026d3); 
                      color: white; 
                      padding: 14px 32px; 
                      text-decoration: none; 
                      border-radius: 8px;
                      display: inline-block;
                      font-weight: bold;">
              Xem chi tiết đơn hàng
            </a>
          </div>
          
          <p style="color: #9ca3af; font-size: 12px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
            Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.
          </p>
        </div>
      </div>
    `,
    text: `Xác nhận đơn hàng ${orderCode} - ${shopName}\n\nCảm ơn bạn đã đặt hàng. Đơn hàng đang chờ thanh toán.\n\nTổng tiền: ${formatVnd(orderTotal)}\n\nXem chi tiết: ${orderUrl}`,
  }
}
