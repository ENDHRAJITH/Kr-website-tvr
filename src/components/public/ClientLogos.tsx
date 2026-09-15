'use client'

import { ClientLogo } from '@/types/database'
import { useTheme } from '@/context/ThemeContext'

interface ClientLogosProps {
  items?: ClientLogo[]
}

const defaultLogos: ClientLogo[] = [
  { id: 'cl1', name: 'KR Studioz', logo_url: '/kr-logo.png', link: null, display_order: 1, is_active: true },
  { id: 'cl2', name: 'Delta Marketing', logo_url: '/kr-logo.png', link: null, display_order: 2, is_active: true },
  { id: 'cl3', name: 'Apex Media', logo_url: '/kr-logo.png', link: null, display_order: 3, is_active: true },
  { id: 'cl4', name: 'Vibe Weddings', logo_url: '/kr-logo.png', link: null, display_order: 4, is_active: true },
  { id: 'cl5', name: 'Cinematic Films', logo_url: '/kr-logo.png', link: null, display_order: 5, is_active: true },
]

export default function ClientLogos({ items = [] }: ClientLogosProps) {
  const { isDarkMode } = useTheme()
  const activeLogos = items.length > 0 ? items : defaultLogos
  const marqueeItems = [...activeLogos, ...activeLogos, ...activeLogos, ...activeLogos]

  return (
    <section className={`border-y overflow-hidden transition-colors duration-500 ${
      isDarkMode ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-[#FDE7D3]'
    }`}>
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-6 flex items-center gap-6 sm:gap-8">
        <div className="shrink-0">
          <p className={`text-xs uppercase tracking-[0.2em] font-semibold ${
            isDarkMode ? 'text-white/40' : 'text-gray-500'
          }`}>
            Trusted By
          </p>
        </div>

        <div className="overflow-hidden flex-1">
          <div className="marquee items-center gap-6 sm:gap-10 whitespace-nowrap">
            {marqueeItems.map((item, i) => (
              <div
                key={`${item.id || i}-${i}`}
                className={`inline-flex items-center gap-3 px-4 py-2 rounded-xl border transition-all duration-300 shrink-0 ${
                  isDarkMode
                    ? 'bg-white/[0.03] border-white/10 hover:border-orange-500/40'
                    : 'bg-orange-500/[0.04] border-orange-500/15 hover:border-orange-500/40'
                }`}
              >
                {item.logo_url && item.logo_url.trim() !== '' && (
                  <img
                    src={item.logo_url}
                    alt={item.name}
                    className="h-7 sm:h-8 w-auto max-w-[90px] sm:max-w-[110px] object-contain rounded shrink-0"
                  />
                )}
                <span
                  className={`font-display font-bold text-xs sm:text-sm md:text-base uppercase tracking-wider ${
                    isDarkMode ? 'text-white/90' : 'text-zinc-800'
                  }`}
                >
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

