'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PortfolioItem } from '@/types/database'
import { useTheme } from '@/context/ThemeContext'
import FoundersPortfolioDeck from './FoundersPortfolioDeck'

interface PortfolioViewProps {
  initialItems: PortfolioItem[]
}

const FALLBACK_PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'p1',
    title: 'A Story Worth Remembering.',
    category: 'studioz',
    cover_image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=90',
    gallery_urls: ['https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=90'],
    description: 'Wedding Photography - Real emotions and genuine moments.',
    display_order: 1,
    is_active: true
  },
  {
    id: 'p2',
    title: 'Identity That Stands Out.',
    category: 'digital',
    cover_image_url: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=90',
    gallery_urls: ['https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=90'],
    description: 'Branding - Complete brand identity overhaul.',
    display_order: 2,
    is_active: true
  },
  {
    id: 'p3',
    title: 'Before The Big Day.',
    category: 'studioz',
    cover_image_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=90',
    gallery_urls: ['https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=90'],
    description: 'Pre-Wedding Shoot - Cinematic couple portraits.',
    display_order: 3,
    is_active: true
  },
  {
    id: 'p4',
    title: 'Creative Built For Growth.',
    category: 'digital',
    cover_image_url: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1400&q=90',
    gallery_urls: ['https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1400&q=90'],
    description: 'Digital Campaign - High ROI ad performance.',
    display_order: 4,
    is_active: true
  },
  {
    id: 'p5',
    title: 'Event Stories',
    category: 'studioz',
    cover_image_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=90',
    gallery_urls: ['https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=90'],
    description: 'Events - Corporate and social celebrations.',
    display_order: 5,
    is_active: true
  },
  {
    id: 'p6',
    title: 'Growth & Results',
    category: 'digital',
    cover_image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=90',
    gallery_urls: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=90'],
    description: 'Digital Marketing - Scalable strategy.',
    display_order: 6,
    is_active: true
  },
  {
    id: 'p7',
    title: 'Memories Forever',
    category: 'studioz',
    cover_image_url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=90',
    gallery_urls: ['https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=90'],
    description: 'Celebration - Special family functions.',
    display_order: 7,
    is_active: true
  }
]

export default function PortfolioView({ initialItems }: PortfolioViewProps) {
  const { isDarkMode } = useTheme()
  const [activeFilter, setActiveFilter] = useState<'all' | 'studioz' | 'digital'>('all')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedTitle, setSelectedTitle] = useState<string>('')

  const items = initialItems ?? []

  const filteredItems = items.filter(item => {
    if (activeFilter === 'all') return true
    return (item.category || '').toLowerCase().includes(activeFilter)
  })

  // Grid layout helper mapping index to column span and height class
  const getLayoutClasses = (index: number) => {
    const mod = index % 7
    switch (mod) {
      case 0:
        return 'h-[500px] md:h-[620px] lg:col-span-7'
      case 1:
        return 'h-[500px] md:h-[620px] lg:col-span-5'
      case 2:
        return 'h-[360px] lg:col-span-5'
      case 3:
        return 'h-[360px] lg:col-span-7'
      case 4:
        return 'h-[380px] lg:col-span-4'
      case 5:
        return 'h-[380px] lg:col-span-4'
      case 6:
        return 'h-[380px] lg:col-span-4'
      default:
        return 'h-[380px] lg:col-span-6'
    }
  }

  return (
    <main className={`transition-colors duration-500 ${isDarkMode ? 'bg-[#050505] text-white' : 'bg-white text-slate-900'}`}>
      {/* HERO */}
      <section className={`relative min-h-[78vh] flex items-center pt-36 pb-20 px-5 md:px-8 border-b overflow-hidden ${
        isDarkMode ? 'bg-[#050505] border-white/10' : 'kr-grid border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-[1.2fr_.8fr] gap-12 items-end">
            <div>
              <div className="flex items-center gap-3 mb-7">
                <span className="w-3 h-3 bg-[#F97316] rounded-full animate-pulse" />
                <span className="text-[#F97316] text-xs font-bold uppercase tracking-[0.28em]">
                  04 / Selected Work
                </span>
              </div>

              <h1 className={`font-display text-6xl sm:text-7xl md:text-[8rem] font-bold uppercase leading-[.78] tracking-[-.07em] ${
                isDarkMode ? 'text-white' : 'text-zinc-900'
              }`}>
                OUR<br />
                <span className="text-[#F97316]">PORTFOLIO.</span>
              </h1>
            </div>

            <div>
              <p className={`text-lg md:text-xl font-semibold leading-relaxed max-w-lg ${
                isDarkMode ? 'text-white' : 'text-zinc-900'
              }`}>
                Moments we&apos;ve captured. Brands we&apos;ve built. Stories we&apos;ve helped tell.
              </p>
              <p className={`mt-5 text-sm leading-relaxed max-w-md ${
                isDarkMode ? 'text-white/50' : 'text-black/50'
              }`}>
                Explore selected work from KR Studioz and KR Digital Marketing — from celebrations and cinematic films to branding and digital campaigns.
              </p>
            </div>
          </div>

          <div className="mt-16 pt-6 border-t border-[#F97316]/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <span className={`text-[10px] uppercase tracking-[.25em] font-bold ${
              isDarkMode ? 'text-white/40' : 'text-black/50'
            }`}>
              Photography • Films • Memories
            </span>
            <span className={`text-[10px] uppercase tracking-[.25em] font-bold ${
              isDarkMode ? 'text-white/40' : 'text-black/50'
            }`}>
              Strategy • Creativity • Growth
            </span>
          </div>
        </div>
      </section>

      {/* FOUNDERS PORTFOLIO DECKS */}
      <FoundersPortfolioDeck />

      {/* FILTER BAR */}
      <section className={`px-5 md:px-8 py-8 border-y ${
        isDarkMode ? 'bg-[#0a0a0a] border-white/10' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <p className={`text-xs uppercase tracking-[.2em] font-bold ${
            isDarkMode ? 'text-white' : 'text-zinc-900'
          }`}>
            Explore Our Work
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-5 py-2.5 text-[10px] font-bold uppercase tracking-[.16em] transition-all border cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-[#F97316] text-white border-[#F97316]'
                  : isDarkMode
                    ? 'bg-zinc-900 text-white/80 border-white/10 hover:border-[#F97316] hover:text-[#F97316]'
                    : 'bg-white text-zinc-900 border-slate-300 hover:border-[#F97316] hover:text-[#F97316]'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('studioz')}
              className={`px-5 py-2.5 text-[10px] font-bold uppercase tracking-[.16em] transition-all border cursor-pointer ${
                activeFilter === 'studioz'
                  ? 'bg-[#F97316] text-white border-[#F97316]'
                  : isDarkMode
                    ? 'bg-zinc-900 text-white/80 border-white/10 hover:border-[#F97316] hover:text-[#F97316]'
                    : 'bg-white text-zinc-900 border-slate-300 hover:border-[#F97316] hover:text-[#F97316]'
              }`}
            >
              KR Studioz
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('digital')}
              className={`px-5 py-2.5 text-[10px] font-bold uppercase tracking-[.16em] transition-all border cursor-pointer ${
                activeFilter === 'digital'
                  ? 'bg-[#F97316] text-white border-[#F97316]'
                  : isDarkMode
                    ? 'bg-zinc-900 text-white/80 border-white/10 hover:border-[#F97316] hover:text-[#F97316]'
                    : 'bg-white text-zinc-900 border-slate-300 hover:border-[#F97316] hover:text-[#F97316]'
              }`}
            >
              KR Digital
            </button>
          </div>
        </div>
      </section>

      {/* GALLERY GRID */}
      <section className={`px-5 md:px-8 py-20 ${
        isDarkMode ? 'bg-[#050505]' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
            {filteredItems.map((item, index) => {
              const layoutClass = getLayoutClasses(index)
              const displayImage = item.cover_image_url || (item.gallery_urls && item.gallery_urls[0]) || ''
              const isStudioz = (item.category || '').toLowerCase().includes('studioz')

              return (
                <article
                  key={item.id || index}
                  onClick={() => {
                    if (displayImage) {
                      setSelectedImage(displayImage)
                      setSelectedTitle(item.title)
                    }
                  }}
                  className={`portfolio-item group relative border overflow-hidden cursor-pointer ${layoutClass} ${
                    isDarkMode ? 'border-white/10 bg-zinc-900' : 'border-slate-200 bg-slate-100'
                  }`}
                >
                  {displayImage ? (
                    <Image
                      src={displayImage}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[#FDE7D3] flex items-center justify-center font-display font-bold text-xl text-[#F97316]">
                      {item.title}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:via-black/45 transition-all duration-500" />

                  <div className="absolute top-5 left-5 z-10">
                    <span className={`px-3 py-1 text-[9px] font-bold uppercase tracking-[.18em] backdrop-blur-md border ${
                      isStudioz
                        ? 'bg-[#F97316] text-white border-[#F97316]'
                        : 'bg-black/60 text-white border-white/20'
                    }`}>
                      {isStudioz ? 'KR Studioz' : 'KR Digital'}
                    </span>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 z-10 text-white">
                    <h3 className="font-display font-bold uppercase text-2xl md:text-3xl lg:text-4xl leading-none">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs md:text-sm text-white/70 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[120] bg-black/95 flex items-center justify-center p-5 cursor-pointer backdrop-blur-md"
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            className="absolute top-6 right-6 text-white text-3xl font-bold hover:text-[#F97316]"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>
          <div className="relative max-w-5xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center">
            <Image
              src={selectedImage}
              alt={selectedTitle}
              width={1400}
              height={900}
              className="max-h-[80vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
              unoptimized
            />
            {selectedTitle && (
              <p className="mt-4 text-white text-sm font-bold uppercase tracking-wider">
                {selectedTitle}
              </p>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
