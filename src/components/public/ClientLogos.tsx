'use client'

import { useState, useEffect } from 'react'
import { ClientLogo } from '@/types/database'

interface ClientLogosProps {
  items?: ClientLogo[]
}

// Iconic partner / ecosystem marks matching reference image
const brandMarks = [
  { name: 'Figma', font: 'font-sans font-bold tracking-tight text-lg sm:text-xl' },
  { name: 'Redis', font: 'font-serif italic font-extrabold text-lg sm:text-xl' },
  { name: 'replit', font: 'font-mono font-bold lowercase text-base sm:text-lg' },
  { name: 'ANTHROP\\C', font: 'font-mono font-extrabold tracking-widest text-sm sm:text-base' },
  { name: 'Spotify', font: 'font-sans font-black tracking-tight text-lg sm:text-xl' },
  { name: 'Linear', font: 'font-sans font-bold tracking-normal text-lg sm:text-xl' },
  { name: 'SKIMS', font: 'font-black tracking-wider text-xl sm:text-2xl' },
  { name: "ARC'TERYX", font: 'font-mono font-extrabold tracking-widest text-sm sm:text-base' },
  { name: 'COMPLEX', font: 'font-black tracking-tighter uppercase text-xl sm:text-2xl' },
  { name: 'Brex', font: 'font-sans font-black tracking-tight text-lg sm:text-xl' },
  { name: 'TECOVAS', font: 'font-serif font-extrabold tracking-widest text-base sm:text-lg' },
]

export default function ClientLogos({ items: propItems }: ClientLogosProps) {
  const [fetchedLogos, setFetchedLogos] = useState<ClientLogo[]>([])

  useEffect(() => {
    fetch('/api/client-logos')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.logos && Array.isArray(data.logos) && data.logos.length > 0) {
          setFetchedLogos(data.logos)
        }
      })
      .catch(() => {})
  }, [])

  // Strictly use database-driven logos (from props or fetched from Supabase)
  const activeLogos = (propItems && propItems.length > 0) 
    ? propItems 
    : fetchedLogos

  // Interleave client logos and brand marks for a rich, continuous marquee
  const combinedItems = [
    ...activeLogos.map((l) => ({ type: 'client' as const, ...l })),
    ...brandMarks.map((b, idx) => ({ type: 'brand' as const, id: `bm-${idx}`, ...b })),
  ]

  // Quadruple items to ensure seamless infinite looping on all screen sizes
  const marqueeItems = [...combinedItems, ...combinedItems, ...combinedItems, ...combinedItems]

  return (
    <section 
      aria-label="Client & Partner Brands Marquee"
      className="relative w-full overflow-hidden bg-[#FF4500] py-4 sm:py-5 select-none border-y border-black/15 shadow-inner"
    >
      {/* Edge gradient fades for a ultra-smooth infinite roll */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 z-10 bg-gradient-to-r from-[#FF4500] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 z-10 bg-gradient-to-l from-[#FF4500] to-transparent" />

      {/* Marquee ticker wrapper */}
      <div className="flex w-max marquee items-center gap-10 sm:gap-14 md:gap-16 whitespace-nowrap hover:[animation-play-state:paused]">
        {marqueeItems.map((item, i) => (
          <div
            key={`${item.id}-${i}`}
            className="inline-flex items-center gap-3 shrink-0 cursor-default transition-transform duration-200 hover:scale-105"
          >
            {item.type === 'client' ? (
              <>
                {item.logo_url && item.logo_url.trim() !== '' && (
                  <img
                    src={item.logo_url}
                    alt={item.name}
                    className="h-6 sm:h-7 md:h-8 w-auto max-w-[90px] sm:max-w-[120px] object-contain shrink-0 [filter:brightness(0)]"
                  />
                )}
                <span className="font-display font-black text-sm sm:text-base md:text-lg text-black uppercase tracking-wider">
                  {item.name}
                </span>
              </>
            ) : (
              <span className={`text-black select-none ${item.font}`}>
                {item.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
