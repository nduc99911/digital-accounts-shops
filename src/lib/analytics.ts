'use client'

export function trackEvent(eventName: string, params?: Record<string, any>) {
  // Facebook Pixel
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, params)
  }

  // Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, params)
  }
}

export function trackPurchase(value: number, currency: string = 'VND', contentIds?: string[]) {
  trackEvent('Purchase', {
    value,
    currency,
    content_ids: contentIds,
    content_type: 'product',
  })
}

export function trackAddToCart(productId: string, value: number, currency: string = 'VND') {
  trackEvent('AddToCart', {
    content_ids: [productId],
    content_type: 'product',
    value,
    currency,
  })
}

export function trackInitiateCheckout(value: number, currency: string = 'VND') {
  trackEvent('InitiateCheckout', {
    value,
    currency,
  })
}

export function trackLead(contentName?: string) {
  trackEvent('Lead', {
    content_name: contentName,
  })
}

export function trackCompleteRegistration(method?: string) {
  trackEvent('CompleteRegistration', {
    registration_method: method,
  })
}
