'use client'

export default function SocialShare({ productName, url }: { productName: string; url: string }) {
  const shareText = `Xem sản phẩm này: ${productName}`
  const encodedUrl = encodeURIComponent(url)
  const encodedText = encodeURIComponent(shareText)

  const shareLinks = [
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      color: 'bg-[#1877F2]',
    },
    {
      name: 'Messenger',
      href: `https://m.me/?link=${encodedUrl}`,
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 5.02 3.68 9.18 8.5 9.91v-7h-2.5v-2.5h2.5V9.5c0-2.48 1.52-3.89 3.78-3.89 1.08 0 2.01.08 2.28.12v2.64h-1.56c-1.22 0-1.45.58-1.45 1.43v1.87h2.9l-.38 2.5h-2.52V22C18.32 21.18 22 17.02 22 12c0-5.52-4.48-10-10-10z"/>
        </svg>
      ),
      color: 'bg-[#00B2FF]',
    },
    {
      name: 'Zalo',
      href: `https://zalo.me/share?u=${encodedUrl}&t=${encodedText}`,
      icon: <span className="text-sm font-bold">Zalo</span>,
      color: 'bg-[#0068FF]',
    },
    {
      name: 'Copy',
      onClick: () => {
        navigator.clipboard.writeText(url)
        alert('Đã sao chép link!')
      },
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-slate-600',
    },
  ]

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-500">Chia sẻ:</span>
      {shareLinks.map((link) => (
        link.onClick ? (
          <button
            key={link.name}
            onClick={link.onClick}
            className={`flex h-9 w-9 items-center justify-center rounded-full ${link.color} text-white transition-transform hover:scale-110`}
            title={link.name}
          >
            {link.icon}
          </button>
        ) : (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex h-9 w-9 items-center justify-center rounded-full ${link.color} text-white transition-transform hover:scale-110`}
            title={link.name}
          >
            {link.icon}
          </a>
        )
      ))}
    </div>
  )
}
