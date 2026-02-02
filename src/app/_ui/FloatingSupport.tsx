'use client'

import { useState } from 'react'

interface SupportLink {
  name: string
  icon: React.ReactNode
  href: string
  color: string
  bgColor: string
}

export default function FloatingSupport() {
  const [isOpen, setIsOpen] = useState(false)

  const supportLinks: SupportLink[] = [
    {
      name: 'Zalo',
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 14.5h-7c-.28 0-.5-.22-.5-.5v-1c0-.28.22-.5.5-.5h7c.28 0 .5.22.5.5v1c0 .28-.22.5-.5.5zm0-3h-7c-.28 0-.5-.22-.5-.5v-1c0-.28.22-.5.5-.5h7c.28 0 .5.22.5.5v1c0 .28-.22.5-.5.5zm0-3h-7c-.28 0-.5-.22-.5-.5v-1c0-.28.22-.5.5-.5h7c.28 0 .5.22.5.5v1c0 .28-.22.5-.5.5z"/>
        </svg>
      ),
      href: 'https://zalo.me/your-zalo-id',
      color: 'text-white',
      bgColor: 'bg-[#0068FF]',
    },
    {
      name: 'Facebook',
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      href: 'https://m.me/your-fb-page',
      color: 'text-white',
      bgColor: 'bg-[#1877F2]',
    },
    {
      name: 'Telegram',
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      ),
      href: 'https://t.me/your-telegram-id',
      color: 'text-white',
      bgColor: 'bg-[#26A5E4]',
    },
    {
      name: 'Hotline',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      href: 'tel:+84987654321',
      color: 'text-white',
      bgColor: 'bg-emerald-500',
    },
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Support buttons - expand when open */}
      <div className={`flex flex-col gap-3 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        {supportLinks.map((link, index) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex items-center gap-3 rounded-full ${link.bgColor} ${link.color} shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl`}
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            <span className="flex h-12 w-12 items-center justify-center">
              {link.icon}
            </span>
            <span className="pr-4 text-sm font-semibold hidden group-hover:inline-block animate-in fade-in slide-in-from-left-2 duration-200">
              {link.name}
            </span>
          </a>
        ))}
      </div>

      {/* Main toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all duration-300 hover:scale-110 ${
          isOpen 
            ? 'bg-rose-500 rotate-45' 
            : 'bg-gradient-to-r from-violet-600 to-fuchsia-600'
        } text-white ring-4 ring-white/30 dark:ring-white/10`}
      >
        {isOpen ? (
          <svg className="h-6 w-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        ) : (
          <div className="relative">
            <svg className="h-7 w-7 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {/* Pulse animation when closed */}
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
          </div>
        )}
      </button>

      {/* Label when closed */}
 {!isOpen && (
        <div className="absolute -top-8 right-0 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
          Hỗ trợ khách hàng
          <div className="absolute -bottom-1 right-5 h-2 w-2 rotate-45 bg-slate-900"></div>
        </div>
      )}
    </div>
  )
}
