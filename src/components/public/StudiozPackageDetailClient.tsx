'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from '@/context/ThemeContext'
import {
  CheckCircle2,
  Share2,
  Check,
  Sparkles,
  ArrowLeft,
  ShoppingBag,
  Camera,
  Film,
  Package,
  MessageCircle,
  X
} from 'lucide-react'

export interface StudiozItemDetail {
  id: string
  name: string
  type: 'wedding_package' | 'service'
  religion?: string
  planCode?: string
  tagline?: string
  badge?: string
  price: string
  heroImage: string
  photoInclusions: string[]
  deliverablesInclusions: string[]
  galleryUrls?: string[]
}

interface Props {
  item: StudiozItemDetail
  relatedItems: StudiozItemDetail[]
}

export default function StudiozPackageDetailClient({ item, relatedItems }: Props) {
  const { isDarkMode } = useTheme()
  const [copied, setCopied] = useState(false)
  const [added, setAdded] = useState(false)
  const [lightboxImg, setLightboxImg] = useState<string | null>(null)

  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://karthicktamilan.com/studioz/${item.id}`

  const whatsappShareText = encodeURIComponent(
    `📸 Check out this Wedding & Cinematic Photography Package at KR Studioz:\n\n*${item.name}* (${item.price})\n${item.tagline || ''}\n\n👉 View deliverables & full details: ${currentUrl}`
  )

  const whatsappInquiryText = encodeURIComponent(
    `Hi KR Studioz, I am interested in booking *${item.name}* (${item.price}). Please let me know date availability & wedding booking details.\n\nLink: ${currentUrl}`
  )

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(currentUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleAddToCart = () => {
    const CART_KEY = 'kr_global_enquiry_cart_v2'
    const stored = JSON.parse(localStorage.getItem(CART_KEY) || '[]')
    const exists = stored.some((x: { name: string }) => x.name === item.name)
    if (!exists) {
      stored.push({
        id: item.id,
        name: item.name,
        price: item.price || 'Custom Quote',
        division: 'studioz'
      })
      localStorage.setItem(CART_KEY, JSON.stringify(stored))
      window.dispatchEvent(new Event('kr-cart-update'))
    }
    window.dispatchEvent(new Event('kr-open-drawer'))
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className={`min-h-screen pt-32 pb-24 transition-colors duration-500 ${
      isDarkMode ? 'bg-[#050505] text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between pb-8 border-b border-zinc-200 dark:border-white/10">
          <Link
            href="/studioz"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F97316] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Studioz Packages</span>
          </Link>

          <div className="flex items-center gap-2">
            <a
              href={`https://api.whatsapp.com/send?text=${whatsappShareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm transition"
              title="Share on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Share on WhatsApp</span>
            </a>

            <button
              onClick={handleCopyLink}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
                copied
                  ? 'bg-orange-500 text-white border-orange-500'
                  : isDarkMode
                  ? 'bg-zinc-900 border-white/15 text-white hover:border-[#F97316]'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-[#F97316]'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Hero Package Layout */}
        <div className="mt-10 grid lg:grid-cols-[1fr_400px] gap-10 items-start">
          <div className="space-y-8">
            {/* Visual Header & Hero Image */}
            <div className="relative rounded-3xl overflow-hidden aspect-[16/9] border border-white/15 bg-zinc-900 shadow-2xl group">
              <Image
                src={item.heroImage}
                alt={item.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                priority
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-6 sm:p-8 flex flex-col justify-end">
                {item.badge && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#F97316] text-black w-fit mb-3">
                    <Sparkles className="w-3 h-3" />
                    <span>{item.badge}</span>
                  </span>
                )}
                <h1 className="font-display font-black text-2xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white leading-[0.95]">
                  {item.name}
                </h1>
                {item.tagline && (
                  <p className="mt-2 text-xs sm:text-sm text-white/80 max-w-xl">
                    {item.tagline}
                  </p>
                )}
              </div>
            </div>

            {/* Photo & Video Coverage Checklist */}
            {item.photoInclusions && item.photoInclusions.length > 0 && (
              <div className={`p-6 sm:p-8 rounded-2xl border ${
                isDarkMode ? 'bg-zinc-900/90 border-white/10' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <h2 className="font-display font-black text-lg uppercase tracking-wider text-zinc-900 dark:text-white mb-5 flex items-center gap-2.5">
                  <Camera className="w-5 h-5 text-[#F97316]" />
                  <span>Cinematic Coverage &amp; Crew Setup</span>
                </h2>

                <div className="grid sm:grid-cols-2 gap-3.5">
                  {item.photoInclusions.map((inc, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm">
                      <CheckCircle2 className="w-4 h-4 text-[#F97316] shrink-0 mt-0.5" />
                      <span className={isDarkMode ? 'text-white/85' : 'text-slate-700 font-medium'}>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Deliverables Inclusions */}
            {item.deliverablesInclusions && item.deliverablesInclusions.length > 0 && (
              <div className={`p-6 sm:p-8 rounded-2xl border ${
                isDarkMode ? 'bg-zinc-900/90 border-white/10' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <h2 className="font-display font-black text-lg uppercase tracking-wider text-zinc-900 dark:text-white mb-5 flex items-center gap-2.5">
                  <Package className="w-5 h-5 text-emerald-500" />
                  <span>Physical Deliverables &amp; Master Outputs</span>
                </h2>

                <div className="grid sm:grid-cols-2 gap-3.5">
                  {item.deliverablesInclusions.map((del, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm">
                      <span className="text-emerald-500 font-bold shrink-0">✓</span>
                      <span className={isDarkMode ? 'text-white/85' : 'text-slate-700 font-medium'}>{del}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pricing & Booking Card (Sticky) */}
          <div className="lg:sticky lg:top-36 space-y-6">
            <div className={`p-7 rounded-3xl border shadow-xl ${
              isDarkMode
                ? 'bg-zinc-950 border-[#F97316]/30 shadow-orange-500/5'
                : 'bg-white border-orange-200 shadow-orange-500/10'
            }`}>
              <span className="text-[11px] font-black uppercase tracking-widest text-[#F97316]">
                Package Investment
              </span>

              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-display font-black text-3xl sm:text-4xl text-zinc-900 dark:text-white">
                  {item.price}
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-white/60">
                  / complete event
                </span>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/10 space-y-3">
                {/* Book on WhatsApp */}
                <a
                  href={`https://wa.me/919944747775?text=${whatsappInquiryText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 transition cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Book Package on WhatsApp</span>
                </a>

                {/* Add to Basket */}
                <button
                  onClick={handleAddToCart}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider border transition cursor-pointer ${
                    added
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-orange-500/10 hover:bg-orange-500 hover:text-white text-[#F97316] border-orange-500/30'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{added ? 'Added to Inquiry Basket!' : 'Add to Inquiry Basket'}</span>
                </button>

                {/* Share Link */}
                <a
                  href={`https://api.whatsapp.com/send?text=${whatsappShareText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold border border-zinc-200 dark:border-white/15 text-zinc-700 dark:text-zinc-300 hover:border-orange-500 transition"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share with Family &amp; Friends</span>
                </a>
              </div>

              {/* Studioz Assurance */}
              <div className="mt-6 pt-5 border-t border-slate-200 dark:border-white/10 space-y-2 text-[11px] text-slate-500 dark:text-white/50 leading-relaxed">
                <div>✨ <strong>KR Studioz Guarantee:</strong> Shot on 4K Sony Alpha Cinema Cameras &amp; Drone Aerials.</div>
                <div>🎬 Lifetime cloud backup of raw footage &amp; custom photo frame finishes included.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Packages */}
        {relatedItems && relatedItems.length > 0 && (
          <div className="mt-20 pt-12 border-t border-zinc-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#F97316]">
                  More Collections
                </span>
                <h3 className="font-display font-black text-2xl uppercase tracking-tight text-zinc-900 dark:text-white">
                  Other Wedding &amp; Studio Packages
                </h3>
              </div>
              <Link
                href="/studioz"
                className="text-xs font-bold uppercase tracking-wider text-[#F97316] hover:underline"
              >
                View All Studioz ↗
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedItems.slice(0, 3).map((rel) => {
                const relSlug = rel.name ? rel.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : rel.id
                return (
                  <Link
                    key={rel.id}
                    href={`/studioz/${relSlug}`}
                    className={`p-6 rounded-2xl border transition hover:border-[#F97316] group ${
                      isDarkMode ? 'bg-zinc-900/60 border-white/10' : 'bg-white border-slate-200 shadow-sm'
                    }`}
                  >
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#F97316]">
                      {rel.badge || 'WEDDING PACKAGE'}
                    </span>
                    <h4 className="font-display font-black text-lg uppercase mt-2 text-zinc-900 dark:text-white group-hover:text-[#F97316] transition">
                      {rel.name}
                    </h4>
                    <p className="font-display font-black text-xl text-[#F97316] mt-3">
                      {rel.price}
                    </p>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <button
            onClick={() => setLightboxImg(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-red-500 transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={lightboxImg}
            alt="Enlarged package photo"
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl border border-white/20"
          />
        </div>
      )}
    </div>
  )
}
