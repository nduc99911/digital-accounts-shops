import { redirect } from 'next/navigation'
import { isAuthed } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import PaymentSettingsForm from './PaymentSettingsForm'

export default async function PaymentSettingsPage() {
  if (!(await isAuthed())) redirect('/admin/login')

  const setting = await prisma.paymentSetting.findFirst({ orderBy: { createdAt: 'desc' } })

  return (
    <div className="grid gap-4">
      <h2 className="text-lg font-semibold tracking-tight text-white">Cài đặt thanh toán (Chuyển khoản)</h2>
      <PaymentSettingsForm setting={setting} />
    </div>
  )
}
