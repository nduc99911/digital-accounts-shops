import SiteHeader from '@/app/_ui/SiteHeader'
import CheckoutClient from './CheckoutClient'

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ coupon?: string }>
}) {
  const { coupon } = await searchParams
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SiteHeader />
      <CheckoutClient couponCode={coupon} />
    </div>
  )
}
