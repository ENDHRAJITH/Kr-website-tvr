'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FounderDeck } from '@/types/database'
import { FALLBACK_FOUNDER_DECKS } from '@/lib/constants/fallbackData'
import ImageUploader from '@/components/admin/ImageUploader'
import PdfUploader from '@/components/admin/PdfUploader'
import { Save, Loader2, FileText, Upload, Plus, Trash2, CheckCircle2, UserCheck } from 'lucide-react'

export default function AdminFounderDecksPage() {
  const supabase = createClient()
  const [decks, setDecks] = useState<FounderDeck[]>(FALLBACK_FOUNDER_DECKS)
  const [activeIdx, setActiveIdx] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Current Active Form State
  const currentDeck = decks[activeIdx] || decks[0]
  const [founderName, setFounderName] = useState(currentDeck?.founder_name || '')
  const [founderRole, setFounderRole] = useState(currentDeck?.founder_role || '')
  const [division, setDivision] = useState<'studioz' | 'marketing'>(currentDeck?.division || 'studioz')
  const [avatarUrl, setAvatarUrl] = useState<string>(currentDeck?.avatar_url || '')
  const [pdfUrl, setPdfUrl] = useState<string>(currentDeck?.pdf_url || '')
  const [bio, setBio] = useState<string>(currentDeck?.bio || '')
  const [youtubeUrl, setYoutubeUrl] = useState<string>(currentDeck?.youtube_url || '')
  const [instagramUrl, setInstagramUrl] = useState<string>(currentDeck?.instagram_url || '')
  const [facebookUrl, setFacebookUrl] = useState<string>(currentDeck?.facebook_url || '')
  const [whatsappUrl, setWhatsappUrl] = useState<string>(currentDeck?.whatsapp_url || '')
  const [linkedinUrl, setLinkedinUrl] = useState<string>(currentDeck?.linkedin_url || '')
  const [slidesText, setSlidesText] = useState<string>((currentDeck?.slides || []).join('\n'))

  // Sync state on tab change
  useEffect(() => {
    const d = decks[activeIdx] || decks[0]
    if (d) {
      setFounderName(d.founder_name || '')
      setFounderRole(d.founder_role || '')
      setDivision(d.division || 'studioz')
      setAvatarUrl(d.avatar_url || '')
      setPdfUrl(d.pdf_url || '')
      setBio(d.bio || '')
      setYoutubeUrl(d.youtube_url || '')
      setInstagramUrl(d.instagram_url || '')
      setFacebookUrl(d.facebook_url || '')
      setWhatsappUrl(d.whatsapp_url || '')
      setLinkedinUrl(d.linkedin_url || '')
      setSlidesText((d.slides || []).join('\n'))
    }
  }, [activeIdx, decks])

  const LOCAL_STORAGE_KEY = 'kr_admin_founder_decks_v2'

  const fetchDecks = async () => {
    setLoading(true)

    // 1. Read from localStorage first for instant render
    let localSaved: FounderDeck[] = []
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (stored) {
        localSaved = JSON.parse(stored)
        if (localSaved && localSaved.length > 0) {
          setDecks(localSaved)
        }
      }
    } catch (e) {}

    // 2. Fetch from Server API (/api/admin/founder-decks) which checks disk JSON & Supabase
    try {
      const res = await fetch('/api/admin/founder-decks')
      const data = await res.json()
      if (data?.decks && Array.isArray(data.decks) && data.decks.length > 0) {
        setDecks(data.decks)
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.decks))
        } catch (e) {}
      }
    } catch (err) {
      console.warn('API fetch failed, relying on localStorage:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDecks()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    const updatedSlides = slidesText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)

    const payload = {
      id: currentDeck?.id || `deck-${activeIdx + 1}`,
      founder_name: founderName,
      founder_role: founderRole,
      division,
      avatar_url: avatarUrl,
      pdf_url: pdfUrl,
      bio,
      youtube_url: youtubeUrl,
      instagram_url: instagramUrl,
      facebook_url: facebookUrl,
      whatsapp_url: whatsappUrl,
      linkedin_url: linkedinUrl,
      slides: updatedSlides,
      display_order: activeIdx + 1,
    }

    const newDecks = decks.map((d, i) => (i === activeIdx ? { ...d, ...payload } : d))
    setDecks(newDecks)

    // Save to localStorage IMMEDIATELY so page refresh retains changes
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newDecks))
      window.dispatchEvent(new Event('kr-founder-decks-updated'))
    } catch (e) {}

    // Save to Server API endpoint (updates disk JSON & Supabase)
    try {
      const res = await fetch('/api/admin/founder-decks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decks: newDecks, activeDeck: payload }),
      })
      const result = await res.json()

      if (result.success) {
        setMessage({
          type: 'success',
          text: `Successfully saved ${founderName}'s portfolio deck! (Saved on server disk & synced with database)`,
        })
      } else {
        setMessage({
          type: 'success',
          text: `Saved ${founderName}'s deck locally in browser storage!`,
        })
      }
    } catch (err: any) {
      setMessage({
        type: 'success',
        text: `Saved ${founderName}'s deck in browser storage!`,
      })
    }

    setSaving(false)
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-zinc-900 border border-zinc-800 rounded-2xl text-white">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
            <h1 className="text-2xl font-bold tracking-tight">Founder Portfolio &amp; PDF Deck Manager</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Manage presentation pitch decks, PDF download links, and slide images for Rajitha and Karthik.
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 text-sm ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}
        >
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
          <span>{message.text}</span>
        </div>
      )}

      {/* Tabs for Rajitha & Karthik */}
      <div className="flex items-center gap-3 border-b border-zinc-800 pb-2">
        {decks.map((d, idx) => (
          <button
            key={d.id || idx}
            onClick={() => setActiveIdx(idx)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
              idx === activeIdx
                ? 'bg-orange-500 text-black border-orange-400 shadow-md shadow-orange-500/20'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>{d.founder_name || `Founder ${idx + 1}`}</span>
            <span className="text-[10px] opacity-75 font-normal">({d.division === 'studioz' ? 'Studioz' : 'Marketing'})</span>
          </button>
        ))}
      </div>

      {/* Main Edit Form */}
      <form onSubmit={handleSave} className="bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-2xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Founder Name */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Founder Name *</label>
            <input
              type="text"
              required
              value={founderName}
              onChange={(e) => setFounderName(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 font-semibold"
            />
          </div>

          {/* Founder Role */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Founder Role Title *</label>
            <input
              type="text"
              required
              value={founderRole}
              onChange={(e) => setFounderRole(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Division Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">KR Division</label>
            <select
              value={division}
              onChange={(e) => setDivision(e.target.value as 'studioz' | 'marketing')}
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
            >
              <option value="studioz">KR Studioz (Photography & Film)</option>
              <option value="marketing">KR Digital (Brand & Strategy)</option>
            </select>
          </div>

          {/* PDF Download URL & PDF File Uploader */}
          <div className="space-y-3 md:col-span-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-orange-500" />
                <span>PDF Document File Link URL *</span>
              </label>
              <input
                type="text"
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
                placeholder="/docs/rajitha-studioz-portfolio.pdf or external PDF URL"
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm font-mono focus:outline-none focus:border-orange-500"
              />
            </div>

            <PdfUploader
              label={`Or Upload ${founderName}'s PDF Document File (.pdf)`}
              value={pdfUrl}
              onChange={(url) => setPdfUrl(url || '')}
            />
          </div>

          {/* Founder Avatar Photo */}
          <div className="space-y-2 md:col-span-2">
            <ImageUploader
              label="Founder Avatar Photo"
              value={avatarUrl}
              onChange={(url) => setAvatarUrl(url || '')}
            />
          </div>

          {/* Bio Description */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Founder Bio Overview</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Founder Social Links */}
          <div className="space-y-4 md:col-span-2 pt-2 border-t border-zinc-800">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">Founder Social Media Links</label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400">YouTube Channel URL</label>
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://youtube.com/@..."
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400">Instagram Profile URL</label>
                <input
                  type="url"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400">Facebook Page URL</label>
                <input
                  type="url"
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400">WhatsApp Link / Contact</label>
                <input
                  type="text"
                  value={whatsappUrl}
                  onChange={(e) => setWhatsappUrl(e.target.value)}
                  placeholder="https://wa.me/919626759859"
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400">LinkedIn Profile URL</label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Interactive Slide Images List & File Uploader */}
          <div className="space-y-4 md:col-span-2">
            <div className="pt-2">
              <ImageUploader
                multiple={true}
                label={`Upload ${founderName}'s Presentation Deck Slides (Select files from computer)`}
                value={slidesText.split('\n').map((s) => s.trim()).filter(Boolean)}
                onChange={(urls) => setSlidesText(urls.join('\n'))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
                <span>Or Edit Deck Slide Image URLs List (One URL per line)</span>
                <span className="text-[11px] text-orange-500 font-normal">Horizontal A4 Landscape (16:10 or 1.414:1)</span>
              </label>
              <textarea
                rows={5}
                value={slidesText}
                onChange={(e) => setSlidesText(e.target.value)}
                placeholder="https://images.unsplash.com/photo-1...\nhttps://images.unsplash.com/photo-2..."
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-orange-500 leading-relaxed"
              />
              <p className="text-[11px] text-zinc-500">
                You can upload image files directly above or edit image URLs line by line. Each line represents one slide page.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-zinc-800">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-xl text-sm shadow-lg shadow-orange-500/20 transition-all duration-150 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Deck Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save {founderName}'s Deck</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
