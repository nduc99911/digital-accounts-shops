import type { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com'
const siteName = process.env.NEXT_PUBLIC_SHOP_NAME || 'Premium Digital Store'

interface PageMetadataProps {
  title: string
  description?: string
  path?: string
  image?: string
  noIndex?: boolean
}

export function generateMetadata({
  title,
  description = "Shop tài khoản số hàng đầu - Netflix, Spotify, ChatGPT, Canva và hơn 100+ dịch vụ premium. Giá tốt nhất, giao hàng tự động, bảo hành đầy đủ.",
  path = '',
  image,
  noIndex = false,
}: PageMetadataProps): Metadata {
  const url = `${siteUrl}${path}`
  const ogImage = image || `${siteUrl}/opengraph-image`

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName,
      type: 'website',
      locale: 'vi_VN',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  }
}

export function generateProductMetadata({
  name,
  description,
  slug,
  imageUrl,
  price,
}: {
  name: string
  description: string
  slug: string
  imageUrl?: string | null
  price?: number
}): Metadata {
  const url = `${siteUrl}/product/${slug}`
  const ogImage = imageUrl || `${siteUrl}/opengraph-image`

  return {
    title: `${name} - Mua ngay | ${siteName}`,
    description: description.slice(0, 160),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: name,
      description: description.slice(0, 160),
      url,
      siteName,
      type: 'product',
      locale: 'vi_VN',
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 800,
              height: 600,
              alt: name,
            },
          ]
        : [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: name,
            },
          ],
    },
    twitter: {
      card: 'summary_large_image',
      title: name,
      description: description.slice(0, 160),
      images: [ogImage],
    },
    other: price
      ? {
          'product:price:amount': String(price),
          'product:price:currency': 'VND',
        }
      : undefined,
  }
}

export function generateCategoryMetadata({
  name,
  slug,
  description,
}: {
  name: string
  slug: string
  description?: string
}): Metadata {
  const url = `${siteUrl}/category/${slug}`

  return {
    title: `${name} - Mua tài khoản ${name} giá rẻ | ${siteName}`,
    description:
      description ||
      `Mua tài khoản ${name} giá rẻ, uy tín, bảo hành đầy đủ tại ${siteName}. Giao hàng tự động, hỗ trợ 24/7.`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${name} - ${siteName}`,
      description:
        description ||
        `Mua tài khoản ${name} giá rẻ, uy tín tại ${siteName}.`,
      url,
      siteName,
      type: 'website',
      locale: 'vi_VN',
      images: [
        {
          url: `${siteUrl}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${name} - ${siteName}`,
        },
      ],
    },
  }
}

export { siteUrl, siteName }
