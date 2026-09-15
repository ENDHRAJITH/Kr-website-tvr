'use client'

import { SiteStat } from '@/types/database'
import { useTheme } from '@/context/ThemeContext'
import { Award, Users, CheckCircle, Flame, Star, Sparkles } from 'lucide-react'

interface StatsCounterProps {
  stats?: SiteStat[]
}

const FALLBACK_STATS: SiteStat[] = [
  { id: 's1', label: 'Social Media Followers', value: '390K+', icon: 'flame', display_order: 1 },
  { id: 's2', label: 'Projects Completed', value: '500+', icon: 'check', display_order: 2 },
  { id: 's3', label: 'Happy Clients', value: '350+', icon: 'users', display_order: 3 },
  { id: 's4', label: 'Brands & Businesses', value: '120+', icon: 'award', display_order: 4 },
]

export default function StatsCounter({ stats }: StatsCounterProps) {
  const { isDarkMode } = useTheme()

  const cleanStats = (stats || []).filter((s) => {
    const label = (s.label || '').toLowerCase()
    const id = (s.id || '').toLowerCase()
    const val = (s.value || '').toLowerCase()

    if (label.includes('chatbot') || id.includes('chatbot')) return false
    if (label.includes('ai_') || id.includes('ai_')) return false
    if (label.startsWith('home_hero_') || id.startsWith('home_hero_')) return false
    if (label.startsWith('rag_doc_') || id.startsWith('rag_doc_')) return false
    if (val === 'true' || val === 'false') return false
    return true
  })

  const displayStats = cleanStats

  const getIcon = (iconName?: string | null) => {
    switch (iconName?.toLowerCase()) {
      case 'users':
        return <Users className="w-6 h-6 text-[#F97316]" />
      case 'check':
        return <CheckCircle className="w-6 h-6 text-[#F97316]" />
      case 'award':
        return <Award className="w-6 h-6 text-[#F97316]" />
      case 'flame':
        return <Flame className="w-6 h-6 text-[#F97316]" />
      default:
        return <Sparkles className="w-6 h-6 text-[#F97316]" />
    }
  }

  return (
    <section className={`py-16 md:py-24 px-5 md:px-10 lg:px-16 border-y ${
      isDarkMode ? 'bg-[#0a0a0a] border-white/10' : 'bg-slate-50 border-zinc-200'
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-[0.25em] font-bold text-[#F97316]">
            Proven Track Record
          </p>
          <h2 className={`mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight ${
            isDarkMode ? 'text-white' : 'text-zinc-900'
          }`}>
            KR BY THE <span className="text-[#F97316]">NUMBERS</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {displayStats.map((item) => (
            <div
              key={item.id}
              className={`p-6 md:p-8 border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-[#F97316] ${
                isDarkMode
                  ? 'bg-zinc-950/80 border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
                  : 'bg-white border-zinc-200 shadow-md shadow-zinc-200/50'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#F97316]/10 flex items-center justify-center">
                  {getIcon(item.icon)}
                </div>
                <span className="text-xs font-mono text-[#F97316] font-bold">0{item.display_order || 1}</span>
              </div>

              <div>
                <h3 className={`font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight ${
                  isDarkMode ? 'text-white' : 'text-zinc-900'
                }`}>
                  {item.value}
                </h3>
                <p className={`mt-2 text-xs sm:text-sm font-semibold uppercase tracking-wider ${
                  isDarkMode ? 'text-white/60' : 'text-zinc-600'
                }`}>
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
