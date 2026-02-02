import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "./_ui/ToastProvider";
import FakePurchaseNotifications from "./_ui/FakePurchaseNotifications";
import FloatingSupport from "./_ui/FloatingSupport";
import FacebookPixel from "./_analytics/FacebookPixel";
import GoogleAnalytics from "./_analytics/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com'
const siteName = process.env.NEXT_PUBLIC_SHOP_NAME || 'Premium Digital Store'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} - Tài khoản số chính hãng`,
    template: `%s | ${siteName}`,
  },
  description: "Shop tài khoản số hàng đầu - Netflix, Spotify, ChatGPT, Canva và hơn 100+ dịch vụ premium. Giá tốt nhất, giao hàng tự động, bảo hành đầy đủ.",
  keywords: [
    "netflix",
    "spotify",
    "chatgpt",
    "canva",
    "tài khoản premium",
    "mua tài khoản",
    "tài khoản số",
    "tài khoản giá rẻ",
    "digital account",
    "subscription",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: siteUrl,
    siteName: siteName,
    title: `${siteName} - Tài khoản số chính hãng`,
    description: "Shop tài khoản số hàng đầu - Netflix, Spotify, ChatGPT, Canva và hơn 100+ dịch vụ premium. Giá tốt nhất, giao hàng tự động, bảo hành đầy đủ.",
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `${siteName} - Tài khoản số chính hãng`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} - Tài khoản số chính hãng`,
    description: "Shop tài khoản số hàng đầu - Netflix, Spotify, ChatGPT, Canva và hơn 100+ dịch vụ premium.",
    images: [`${siteUrl}/opengraph-image`],
    creator: '@yourhandle',
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      'vi-VN': siteUrl,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  category: 'ecommerce',
  classification: 'Digital Products, Subscription Services',
  applicationName: siteName,
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    telephone: true,
    date: true,
    address: true,
    email: true,
    url: true,
  },
};

// JSON-LD Structured Data
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteName,
  url: siteUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteUrl}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
  description: "Shop tài khoản số hàng đầu - Netflix, Spotify, ChatGPT, Canva và hơn 100+ dịch vụ premium.",
};

const organizationData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteName,
  url: siteUrl,
  logo: {
    '@type': 'ImageObject',
    url: `${siteUrl}/logo.png`,
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: ['Vietnamese'],
  },
  sameAs: [
    // Add your social media URLs here
    // 'https://facebook.com/yourpage',
    // 'https://zalo.me/yourzalo',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#7c3aed" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastProvider>
          {children}
          <FakePurchaseNotifications />
          <FloatingSupport />
        </ToastProvider>
        <FacebookPixel />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
