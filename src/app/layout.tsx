import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "./_ui/ToastProvider";
import FakePurchaseNotifications from "./_ui/FakePurchaseNotifications";

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

export const metadata: Metadata = {
  title: "Premium Digital Store - Tài khoản số chính hãng",
  description: "Shop tài khoản số hàng đầu - Netflix, Spotify, ChatGPT, Canva và hơn 100+ dịch vụ premium. Giá tốt nhất, giao hàng tự động, bảo hành đầy đủ.",
  keywords: ["netflix", "spotify", "chatgpt", "canva", "tài khoản premium", "mua tài khoản"],
  authors: [{ name: "Divine Style Shop" }],
  openGraph: {
    title: "Premium Digital Store - Tài khoản số chính hãng",
    description: "Shop tài khoản số hàng đầu - Giá tốt nhất, giao hàng tự động",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastProvider>
          {children}
          <FakePurchaseNotifications />
        </ToastProvider>
      </body>
    </html>
  );
}
