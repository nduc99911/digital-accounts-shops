'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'vi' | 'en'

interface Translations {
  [key: string]: string | Translations
}

const translations: Record<Language, Translations> = {
  vi: {
    nav: {
      home: 'Trang chủ',
      products: 'Sản phẩm',
      cart: 'Giỏ hàng',
      orders: 'Đơn hàng',
      login: 'Đăng nhập',
      register: 'Đăng ký',
      logout: 'Đăng xuất',
      admin: 'Admin',
    },
    product: {
      addToCart: 'Thêm vào giỏ',
      buyNow: 'Mua ngay',
      outOfStock: 'Hết hàng',
      inStock: 'Còn hàng',
      sold: 'Đã bán',
      reviews: 'Đánh giá',
      writeReview: 'Viết đánh giá',
      related: 'Sản phẩm liên quan',
    },
    cart: {
      title: 'Giỏ hàng',
      empty: 'Giỏ hàng trống',
      continueShopping: 'Tiếp tục mua sắm',
      checkout: 'Thanh toán',
      total: 'Tổng cộng',
      remove: 'Xóa',
    },
    checkout: {
      title: 'Thanh toán',
      name: 'Họ tên',
      phone: 'Số điện thoại',
      email: 'Email',
      note: 'Ghi chú',
      placeOrder: 'Đặt hàng',
      orderSuccess: 'Đặt hàng thành công!',
    },
    common: {
      loading: 'Đang tải...',
      save: 'Lưu',
      cancel: 'Hủy',
      delete: 'Xóa',
      edit: 'Sửa',
      search: 'Tìm kiếm',
      viewAll: 'Xem tất cả',
      copy: 'Sao chép',
    },
  },
  en: {
    nav: {
      home: 'Home',
      products: 'Products',
      cart: 'Cart',
      orders: 'Orders',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      admin: 'Admin',
    },
    product: {
      addToCart: 'Add to Cart',
      buyNow: 'Buy Now',
      outOfStock: 'Out of Stock',
      inStock: 'In Stock',
      sold: 'Sold',
      reviews: 'Reviews',
      writeReview: 'Write a Review',
      related: 'Related Products',
    },
    cart: {
      title: 'Shopping Cart',
      empty: 'Your cart is empty',
      continueShopping: 'Continue Shopping',
      checkout: 'Checkout',
      total: 'Total',
      remove: 'Remove',
    },
    checkout: {
      title: 'Checkout',
      name: 'Full Name',
      phone: 'Phone',
      email: 'Email',
      note: 'Note',
      placeOrder: 'Place Order',
      orderSuccess: 'Order placed successfully!',
    },
    common: {
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      search: 'Search',
      viewAll: 'View All',
      copy: 'Copy',
    },
  },
}

interface I18nContext {
  lang: Language
  setLang: (lang: Language) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContext | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('vi')

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language
    if (saved && (saved === 'vi' || saved === 'en')) {
      setLang(saved)
    }
  }, [])

  const handleSetLang = (newLang: Language) => {
    setLang(newLang)
    localStorage.setItem('language', newLang)
  }

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations[lang]
    for (const k of keys) {
      value = value?.[k]
    }
    return typeof value === 'string' ? value : key
  }

  return (
    <I18nContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used within I18nProvider')
  return context
}
