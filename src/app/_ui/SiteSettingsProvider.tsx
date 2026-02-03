'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface SiteSettings {
  shopName: string
  shopDescription: string
  contactPhone: string
  contactZalo: string
  contactEmail: string
  facebookPage: string
  facebookMessenger: string
  telegram: string
  bannerText: string
  bannerImage: string
  footerText: string
}

const defaultSettings: SiteSettings = {
  shopName: 'taikhoanso.com',
  shopDescription: '',
  contactPhone: '',
  contactZalo: '',
  contactEmail: '',
  facebookPage: '',
  facebookMessenger: '',
  telegram: '',
  bannerText: '',
  bannerImage: '',
  footerText: '',
}

const SiteSettingsContext = createContext<SiteSettings>(defaultSettings)

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)

  useEffect(() => {
    fetch('/api/site-settings')
      .then(r => r.json())
      .then(data => setSettings({ ...defaultSettings, ...data }))
      .catch(console.error)
  }, [])

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext)
}
