'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

interface ProductImageGalleryProps {
  mainImage: string | null
  images: { id: string; url: string; sortOrder: number }[]
  productName: string
}

export default function ProductImageGallery({ mainImage, images, productName }: ProductImageGalleryProps) {
  // Combine main image with gallery images
  const allImages = [
    ...(mainImage ? [{ id: 'main', url: mainImage, sortOrder: -1 }] : []),
    ...images.sort((a, b) => a.sortOrder - b.sortOrder),
  ]

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  if (allImages.length === 0) {
    return (
      <div 
        className="flex aspect-square items-center justify-center rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(217, 70, 239, 0.05))',
        }}
      >
        <span className="text-slate-400">Không có hình ảnh</span>
      </div>
    )
  }

  const selectedImage = allImages[selectedIndex]

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div 
        className="group relative aspect-square overflow-hidden rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(217, 70, 239, 0.05))',
          border: '1px solid rgba(139, 92, 246, 0.1)',
        }}
      >
        {selectedImage ? (
          <>
            <Image
              src={selectedImage.url}
              alt={`${productName} - Ảnh ${selectedIndex + 1}`}
              fill
              className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={selectedIndex === 0}
            />
            
            {/* Zoom button */}
            <button
              onClick={() => setIsZoomed(true)}
              className="absolute right-4 top-4 rounded-full bg-white/80 p-2 opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 hover:bg-white"
            >
              <ZoomIn className="h-5 w-5 text-slate-700" />
            </button>

            {/* Navigation arrows (only show if multiple images) */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 hover:bg-white"
                >
                  <ChevronLeft className="h-5 w-5 text-slate-700" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 hover:bg-white"
                >
                  <ChevronRight className="h-5 w-5 text-slate-700" />
                </button>
              </>
            )}

            {/* Image counter */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/80 px-3 py-1 text-sm font-medium backdrop-blur-sm">
                {selectedIndex + 1} / {allImages.length}
              </div>
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">
            Không có hình ảnh
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {allImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square w-20 flex-shrink-0 overflow-hidden rounded-xl transition-all duration-200 ${
                selectedIndex === index
                  ? 'ring-2 ring-violet-500 ring-offset-2'
                  : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(217, 70, 239, 0.05))',
              }}
            >
              <Image
                src={image.url}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                className="object-contain p-2"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      {isZoomed && selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setIsZoomed(false)}
        >
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <Image
            src={selectedImage.url}
            alt={`${productName} - Xem lớn`}
            width={800}
            height={800}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
        </div>
      )}
    </div>
  )
}
