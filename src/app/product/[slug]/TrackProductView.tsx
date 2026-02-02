'use client'

import { useEffect } from 'react'
import { addToRecentlyViewed } from '@/app/_ui/RecentlyViewed'

interface TrackProductViewProps {
  product: {
    id: string
    slug: string
    name: string
    salePriceVnd: number
    listPriceVnd: number
    imageUrl: string | null
  }
}

export default function TrackProductView({ product }: TrackProductViewProps) {
  useEffect(() => {
    addToRecentlyViewed({
      id: product.id,
      slug: product.slug,
      name: product.name,
      salePriceVnd: product.salePriceVnd,
      listPriceVnd: product.listPriceVnd,
      imageUrl: product.imageUrl,
    })
  }, [product])

  return null
}
