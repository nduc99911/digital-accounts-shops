import CheckoutClient from './CheckoutClient'

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ coupon?: string }>
}) {
  const { coupon } = await searchParams
  
  return <CheckoutClient couponCode={coupon} />
}
