import { redirect } from 'next/navigation'
import { isAuthed } from '@/lib/auth'
import ViettelPayImportClient from './ui'

export default async function ViettelPayPayments() {
  if (!(await isAuthed())) redirect('/god/login')

  return (
    <div className="grid gap-4">
      <h2 className="text-lg font-semibold tracking-tight text-white">ViettelPay — Log giao dịch (parse tin nhắn)</h2>
      <ViettelPayImportClient />
      <div className="text-xs text-slate-400">Dán nhiều tin nhắn ViettelPay (mỗi dòng 1 tin) → Parse → Lưu DB.</div>
    </div>
  )
}
