'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PortfolioItem } from '@/types/database'
import { useTheme } from '@/context/ThemeContext'

interface HomePortfolioProps {
  initialItems: PortfolioItem[]
}

export default function HomePortfolio({ initialItems }: HomePortfolioProps) {
  const { isDarkMode } = useTheme()
  const [filter, setFilter] = useState<'all' | 'studioz' | 'digital'>('all')

  const itemsToDisplay = initialItems ?? []

  const filteredItems = itemsToDisplay.filter(item => {
    if (filter === 'all') return true
    const cat = (item.category || '').toLowerCase()
    return cat.includes(filter)
  })

  // Split into featured (first 3) and sub grid (rest)
  const featured0 = filteredItems[0]
  const featured1 = filteredItems[1]
  const featured2 = filteredItems[2]
  const smallGrid = filteredItems.slice(3, 7)

  return (
    <section
      id="portfolio"
      className={`relative py-24 md:py-32 px-5 md:px-8 border-t transition-colors duration-500 overflow-hidden ${
        isDarkMode ? 'bg-[#050505] border-white/10 text-white' : 'bg-white border-[#FDE7D3] text-zinc-900'
      }`}
    >
      {/* Background Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage:
            'linear-gradient(rgba(249,115,22,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,.07) 1px, transparent 1px)',
          backgroundSize: '42px 42px',
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-14">
          <div>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 bg-[#F97316] rounded-full animate-pulse" />
              <p className="text-[#F97316] text-xs font-bold uppercase tracking-[0.28em]">
                04 / Selected Work
              </p>
            </div>

            <h2 className={`mt-5 font-display text-5xl sm:text-6xl md:text-8xl font-bold leading-[0.82] tracking-[-0.06em] ${
              isDarkMode ? 'text-white' : 'text-zinc-900'
            }`}>
              OUR
              <br />
              <span className="text-[#F97316]">PORTFOLIO.</span>
            </h2>
          </div>

          <div className="lg:max-w-md">
            <p className={`text-sm md:text-base leading-relaxed ${
              isDarkMode ? 'text-white/60' : 'text-zinc-600'
            }`}>
              A collection of moments we&apos;ve captured and brands we&apos;ve helped build. Explore the creative work behind KR.
            </p>

            {/* FILTER BUTTONS */}
            <div className="flex flex-wrap gap-2 mt-7">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] transition-all cursor-pointer border ${
                  filter === 'all'
                    ? isDarkMode
                      ? 'bg-white text-zinc-900 border-white'
                      : 'bg-zinc-900 text-white border-zinc-900'
                    : isDarkMode
                      ? 'bg-zinc-900 text-white border-white/15 hover:border-[#F97316] hover:text-[#F97316]'
                      : 'bg-white text-zinc-900 border-zinc-200 hover:border-[#F97316] hover:text-[#F97316]'
                }`}
              >
                All
              </button>

              <button
                type="button"
                onClick={() => setFilter('studioz')}
                className={`px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] transition-all cursor-pointer border ${
                  filter === 'studioz'
                    ? isDarkMode
                      ? 'bg-white text-zinc-900 border-white'
                      : 'bg-zinc-900 text-white border-zinc-900'
                    : isDarkMode
                      ? 'bg-zinc-900 text-white border-white/15 hover:border-[#F97316] hover:text-[#F97316]'
                      : 'bg-white text-zinc-900 border-zinc-200 hover:border-[#F97316] hover:text-[#F97316]'
                }`}
              >
                Studioz
              </button>

              <button
                type="button"
                onClick={() => setFilter('digital')}
                className={`px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] transition-all cursor-pointer border ${
                  filter === 'digital'
                    ? isDarkMode
                      ? 'bg-white text-zinc-900 border-white'
                      : 'bg-zinc-900 text-white border-zinc-900'
                    : isDarkMode
                      ? 'bg-zinc-900 text-white border-white/15 hover:border-[#F97316] hover:text-[#F97316]'
                      : 'bg-white text-zinc-900 border-zinc-200 hover:border-[#F97316] hover:text-[#F97316]'
                }`}
              >
                Digital
              </button>
            </div>
          </div>
        </div>

        {/* FEATURED GRID */}
        <div id="portfolioGrid" className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* FEATURED 01 (Large Left) */}
          {featured0 && (
            <article
              className="portfolio-item portfolio-card lg:col-span-7 h-[430px] sm:h-[520px] md:h-[620px] relative group overflow-hidden"
            >
              {featured0.cover_image_url && (
                <Image
                  src={featured0.cover_image_url}
                  alt={featured0.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  unoptimized
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

              <div className="absolute top-6 left-6 flex items-center gap-2">
                <span className="bg-white text-black px-3 py-2 text-[9px] font-bold uppercase tracking-[0.15em]">
                  {featured0.category || 'Studioz'}
                </span>
                <span className="border border-white/40 text-white px-3 py-2 text-[9px] font-bold">
                  01
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-7 md:p-10 text-white">
                <p className="text-[#F97316] text-[10px] font-bold uppercase tracking-[0.24em]">
                  {featured0.category === 'studioz' ? 'Studioz Work' : 'Digital Work'}
                </p>
                <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mt-2">
                  {featured0.title}
                </h3>
                {featured0.description && (
                  <p className="mt-4 text-sm text-white/70 max-w-md">
                    {featured0.description}
                  </p>
                )}
                <Link
                  href="/portfolio"
                  className="inline-block mt-6 text-xs font-bold uppercase tracking-[0.16em] border-b border-[#F97316] pb-2 hover:text-[#F97316] transition"
                >
                  View Project →
                </Link>
              </div>
            </article>
          )}

          {/* RIGHT COLUMN (2 Stacked) */}
          <div className="lg:col-span-5 grid sm:grid-cols-2 lg:grid-cols-1 gap-5">
            {featured1 && (
              <article
                className="portfolio-item portfolio-card relative h-[300px] sm:h-[350px] lg:h-[300px] group overflow-hidden"
              >
                {featured1.cover_image_url && (
                  <Image
                    src={featured1.cover_image_url}
                    alt={featured1.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    unoptimized
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute top-5 left-5">
                  <span className="bg-[#F97316] text-white px-3 py-2 text-[9px] font-bold uppercase tracking-[0.16em]">
                    {featured1.category || 'Digital'}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <p className="text-[#F97316] text-[9px] uppercase tracking-[0.2em] font-bold">
                    {featured1.category === 'digital' ? 'Branding' : 'Studioz'}
                  </p>
                  <h3 className="font-display text-2xl font-bold mt-1">
                    {featured1.title}
                  </h3>
                </div>
              </article>
            )}

            {featured2 && (
              <article
                className="portfolio-item portfolio-card relative h-[300px] sm:h-[350px] lg:h-[300px] group overflow-hidden"
              >
                {featured2.cover_image_url && (
                  <Image
                    src={featured2.cover_image_url}
                    alt={featured2.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    unoptimized
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute top-5 left-5">
                  <span className="bg-white text-black px-3 py-2 text-[9px] font-bold uppercase tracking-[0.16em]">
                    {featured2.category || 'Studioz'}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <p className="text-[#F97316] text-[9px] uppercase tracking-[0.2em] font-bold">
                    {featured2.category === 'studioz' ? 'Pre-Wedding' : 'Digital'}
                  </p>
                  <h3 className="font-display text-2xl font-bold mt-1">
                    {featured2.title}
                  </h3>
                </div>
              </article>
            )}
          </div>
        </div>

        {/* SMALL WORK GRID */}
        {smallGrid.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
            {smallGrid.map((item, idx) => (
              <article
                key={item.id || idx}
                className="portfolio-item portfolio-card relative h-[280px] group overflow-hidden"
              >
                {item.cover_image_url && (
                  <Image
                    src={item.cover_image_url}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    unoptimized
                  />
                )}
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute bottom-0 left-0 p-5 text-white">
                  <p className="text-[#F97316] text-[9px] uppercase tracking-[0.2em] font-bold">
                    {item.category || 'KR Work'}
                  </p>
                  <h3 className="font-display text-xl font-bold mt-1">
                    {item.title}
                  </h3>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* BOTTOM CTA */}
        <div className={`mt-12 border p-7 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-7 shadow-[8px_8px_0px_#F97316] transition-colors duration-500 ${
          isDarkMode ? 'border-[#F97316] bg-[#0a0a0a]' : 'border-[#F97316] bg-white'
        }`}>
          <div>
            <p className="text-[#F97316] text-[10px] uppercase tracking-[0.24em] font-bold">
              Want To See More?
            </p>
            <h3 className={`font-display text-2xl sm:text-3xl md:text-4xl font-bold mt-2 ${
              isDarkMode ? 'text-white' : 'text-zinc-900'
            }`}>
              Explore the complete KR portfolio.
            </h3>
          </div>

          <Link
            href="/portfolio"
            className={`shrink-0 inline-flex items-center justify-center gap-4 px-7 py-4 text-xs font-bold uppercase tracking-[0.15em] transition ${
              isDarkMode
                ? 'bg-white text-black hover:bg-[#F97316] hover:text-white'
                : 'bg-zinc-900 text-white hover:bg-[#F97316]'
            }`}
          >
            View Full Portfolio <span>↗</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
