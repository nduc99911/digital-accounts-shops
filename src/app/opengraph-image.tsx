import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'taikhoanso.com - Tài khoản số chính hãng'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #7c3aed 0%, #c026d3 50%, #0891b2 100%)',
          padding: '60px',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            inset: '0',
            opacity: '0.1',
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Content container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* Logo icon */}
          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '24px',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '40px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            <svg
              width="70"
              height="70"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7c3aed"
              strokeWidth="2"
            >
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: '72px',
              fontWeight: '900',
              color: 'white',
              marginBottom: '20px',
              textAlign: 'center',
              lineHeight: '1.1',
              textShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
            }}
          >
            taikhoanso.com
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '36px',
              color: 'rgba(255, 255, 255, 0.9)',
              textAlign: 'center',
              fontWeight: '600',
            }}
          >
            Tài khoản số chính hãng - Giá tốt nhất
          </p>

          {/* Features */}
          <div
            style={{
              display: 'flex',
              gap: '30px',
              marginTop: '50px',
            }}
          >
            {['Netflix', 'Spotify', 'ChatGPT', 'Canva'].map((item) => (
              <div
                key={item}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  padding: '12px 24px',
                  borderRadius: '9999px',
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: '600',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
