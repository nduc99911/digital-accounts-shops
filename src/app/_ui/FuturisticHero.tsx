'use client'

import { useEffect, useRef } from 'react'

export default function FuturisticHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Particle network animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
    }> = []

    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      })
    }

    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      // Update and draw particles
      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy

        // Wrap around
        if (p.x < 0) p.x = canvas.offsetWidth
        if (p.x > canvas.offsetWidth) p.x = 0
        if (p.y < 0) p.y = canvas.offsetHeight
        if (p.y > canvas.offsetHeight) p.y = 0

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(139, 92, 246, ${p.opacity})`
        ctx.fill()

        // Draw connections
        particles.slice(i + 1).forEach((p2) => {
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.15 * (1 - distance / 150)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div className="relative overflow-hidden">
      {/* Particle Network Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ opacity: 0.6 }}
      />

      {/* Animated Grid */}
      <div 
        className="absolute inset-0 cyber-grid opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: 'grid-move 20s linear infinite',
        }}
      />

      {/* Floating Blobs */}
      <div 
        className="absolute -left-32 top-1/4 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.8) 0%, transparent 70%)',
          animation: 'morph 10s ease-in-out infinite',
        }}
      />
      <div 
        className="absolute -right-32 bottom-1/4 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(217, 70, 239, 0.8) 0%, transparent 70%)',
          animation: 'morph 10s ease-in-out infinite reverse',
        }}
      />

      {/* Scanlines */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139, 92, 246, 0.02) 2px, rgba(139, 92, 246, 0.02) 4px)',
          animation: 'scanline 10s linear infinite',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Banner */}
        <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
          {/* Main banner */}
          <div 
            className="group relative overflow-hidden rounded-3xl p-8 text-white shadow-2xl holographic"
            style={{
              background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              boxShadow: '0 0 60px rgba(139, 92, 246, 0.2), inset 0 0 60px rgba(139, 92, 246, 0.05)',
            }}
          >
            {/* Animated Corner Accents */}
            <div className="absolute left-0 top-0 h-20 w-20">
              <div className="absolute left-4 top-4 h-px w-12 bg-gradient-to-r from-cyan-400 to-transparent animate-pulse" />
              <div className="absolute left-4 top-4 h-12 w-px bg-gradient-to-b from-cyan-400 to-transparent animate-pulse" />
            </div>
            <div className="absolute bottom-0 right-0 h-20 w-20">
              <div className="absolute bottom-4 right-4 h-px w-12 bg-gradient-to-l from-fuchsia-400 to-transparent animate-pulse" />
              <div className="absolute bottom-4 right-4 h-12 w-px bg-gradient-to-t from-fuchsia-400 to-transparent animate-pulse" />
            </div>

            {/* Glowing Orbs */}
            <div 
              className="absolute right-20 top-20 h-32 w-32 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
                filter: 'blur(20px)',
                animation: 'float 6s ease-in-out infinite',
              }}
            />
            <div 
              className="absolute bottom-20 left-20 h-24 w-24 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%)',
                filter: 'blur(15px)',
                animation: 'float 8s ease-in-out infinite reverse',
              }}
            />

            {/* Content */}
            <div className="relative z-10">
              <div 
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold backdrop-blur-sm"
                style={{
                  background: 'rgba(139, 92, 246, 0.2)',
                  border: '1px solid rgba(139, 92, 246, 0.5)',
                  boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
                }}
              >
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="neon-text-cyan">HỆ THỐNG ONLINE</span>
              </div>

              <h1 
                className="mt-5 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl"
                style={{
                  background: 'linear-gradient(135deg, #fff 0%, #c4b5fd 50%, #fff 100%)',
                  backgroundSize: '200% 200%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'gradient-shift 5s ease infinite',
                }}
              >
                TÀI KHOẢN SỐ
                <br />
                <span className="neon-text-pink">THẾ HỆ MỚI</span>
              </h1>

              <p className="mt-4 max-w-lg text-sm font-light leading-relaxed text-slate-300">
                Trải nghiệm mua sắm tài khoản premium với công nghệ{' '}
                <span className="neon-text-cyan font-semibold">AI-POWERED</span>.
                Giao dịch tự động, bảo mật tuyệt đối.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {['Netflix', 'Spotify', 'ChatGPT', 'Canva'].map((item, i) => (
                  <span 
                    key={item}
                    className="flex items-center gap-1.5 rounded-full bg-white/5 px-4 py-2 text-sm font-semibold backdrop-blur-sm ring-1 ring-white/10 transition-all hover:scale-105 hover:bg-white/10"
                    style={{
                      animationDelay: `${i * 0.1}s`,
                      boxShadow: '0 0 20px rgba(139, 92, 246, 0.1)',
                    }}
                  >
                    <svg className="h-4 w-4 text-violet-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    {item}
                  </span>
                ))}
              </div>

              {/* Promo badges */}
              <div className="mt-6 flex flex-wrap gap-3">
                <span 
                  className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white"
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                    boxShadow: '0 0 30px rgba(245, 158, 11, 0.4)',
                  }}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                  GIẢM ĐẾN 70%
                </span>
                <span 
                  className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white"
                  style={{
                    background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                    boxShadow: '0 0 30px rgba(6, 182, 212, 0.4)',
                  }}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  GIAO TỰ ĐỘNG
                </span>
              </div>
            </div>
          </div>

          {/* Side Cards */}
          <div className="grid gap-4">
            <div 
              className="group relative overflow-hidden rounded-2xl p-5 transition-all duration-500 hover:scale-[1.02]"
              style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(217, 70, 239, 0.05))',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                boxShadow: '0 0 30px rgba(139, 92, 246, 0.1)',
              }}
            >
              <div 
                className="absolute -right-6 -top-6 h-20 w-20 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
                  filter: 'blur(10px)',
                }}
              />
              <div className="relative">
                <div className="flex items-center gap-2 text-sm font-bold text-violet-300">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  HỖ TRỢ 24/7
                </div>
                <p className="mt-2 text-xs text-slate-400">Đội ngũ hỗ trợ luôn sẵn sàng</p>
                <div className="mt-3 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-emerald-400">Online</span>
                </div>
              </div>
            </div>

            <div 
              className="group relative overflow-hidden rounded-2xl p-5 transition-all duration-500 hover:scale-[1.02]"
              style={{
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(59, 130, 246, 0.05))',
                border: '1px solid rgba(6, 182, 212, 0.2)',
                boxShadow: '0 0 30px rgba(6, 182, 212, 0.1)',
              }}
            >
              <div 
                className="absolute -right-6 -top-6 h-20 w-20 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%)',
                  filter: 'blur(10px)',
                }}
              />
              <div className="relative">
                <div className="flex items-center gap-2 text-sm font-bold text-cyan-300">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  BẢO HÀNH 100%
                </div>
                <p className="mt-2 text-xs text-slate-400">Hoàn tiền nếu có lỗi</p>
                <div className="mt-3 text-2xl font-bold neon-text-cyan">100%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
