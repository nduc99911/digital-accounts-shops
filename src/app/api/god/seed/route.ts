import { NextResponse } from 'next/server'
import { seedSampleData } from '@/lib/seed'

// DEV ONLY: Seed sample data
// Call: POST /api/god/seed?key=dev
export async function POST(req: Request) {
  const url = new URL(req.url)
  const key = url.searchParams.get('key')
  
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Disabled in production' }, { status: 403 })
  }
  
  if (!key || key !== (process.env.ADMIN_SEED_KEY || 'dev')) {
    return NextResponse.json({ error: 'Missing/invalid key' }, { status: 401 })
  }

  try {
    await seedSampleData()
    return NextResponse.json({ 
      ok: true, 
      message: 'Sample data seeded successfully!',
      data: {
        categories: 8,
        products: 10,
        admin: 'admin/admin12345',
        paymentSettings: true,
      }
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ 
      error: 'Seed failed', 
      details: String(error) 
    }, { status: 500 })
  }
}

// GET for easy access
export async function GET(req: Request) {
  return POST(req)
}
