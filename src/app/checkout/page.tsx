import SiteHeader from '@/app/_ui/SiteHeader'
import CheckoutClient from './CheckoutClient'

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SiteHeader />
      <CheckoutClient />
    </div>
  )
}
