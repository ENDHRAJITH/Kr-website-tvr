'use client'

import { useState, useId } from 'react'
import {
  Sparkles,
  Camera,
  Video,
  BookOpen,
  Calendar,
  MapPin,
  CheckCircle2,
  Plus,
  Send,
  Loader2,
  Sliders,
  Award,
  Layers,
  Heart,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react'

interface CustomPackageBuilderProps {
  isDarkMode?: boolean
}

// Data Options
const EVENT_TYPES = [
  { id: 'hindu-wedding', label: 'Hindu Wedding', icon: '💍', desc: 'Muhurtham, Nalangu & Reception' },
  { id: 'christian-wedding', label: 'Christian Wedding', icon: '✝️', desc: 'Church Ceremony & Grand Reception' },
  { id: 'muslim-wedding', label: 'Muslim Wedding', icon: '☪️', desc: 'Nikkah & Walima Reception' },
  { id: 'engagement', label: 'Engagement / Ring Ceremony', icon: '💎', desc: 'Nichayathartham & Stage Shoot' },
  { id: 'reception', label: 'Reception Evening', icon: '🥂', desc: 'Stage Coverage & Couple Shoot' },
  { id: 'birthday', label: 'Birthday Function', icon: '🎂', desc: 'Party Coverage & Candid Moments' },
  { id: 'grand-opening', label: 'Grand Opening', icon: '🏬', desc: 'Business Launch & Commercial' },
  { id: 'housewarming', label: 'Housewarming / Grahapravesam', icon: '🏡', desc: 'Traditional Puja & Family Shoot' },
  { id: 'baby-ceremony', label: 'Baby Shower / Naming', icon: '👶', desc: 'Seemantham & Family Portraits' },
]

const PHOTO_OPTIONS = [
  { id: 'photo-trad', label: 'Traditional Photography', estPrice: 8000 },
  { id: 'photo-candid', label: 'Candid Photography', estPrice: 12000 },
  { id: 'photo-prewed', label: 'Pre-Wedding Couple Shoot', estPrice: 10000 },
  { id: 'photo-postwed', label: 'Post-Wedding Outdoor Shoot', estPrice: 10000 },
  { id: 'photo-haldi', label: 'Haldi & Mehendi Special Shoot', estPrice: 7000 },
  { id: 'photo-drone', label: 'Drone Aerial Photography', estPrice: 8000 },
]

const VIDEO_OPTIONS = [
  { id: 'video-trad', label: 'Traditional Videography (Full Coverage)', estPrice: 10000 },
  { id: 'video-candid', label: 'Candid Cinematic Highlight Teaser Film', estPrice: 15000 },
  { id: 'video-reels', label: '4K Vertical Instagram Reels (2-3 Clips)', estPrice: 8000 },
  { id: 'video-drone', label: 'Drone Aerial Videography', estPrice: 10000 },
  { id: 'video-live', label: 'Live Streaming (YouTube / Facebook)', estPrice: 12000 },
]

const DELIVERABLE_OPTIONS = [
  { id: 'del-album-300', label: 'High-Quality Printed Album (300 Photos)', estPrice: 12000 },
  { id: 'del-album-500', label: 'Premium Photobook Album (500 Photos)', estPrice: 18000 },
  { id: 'del-box', label: 'Luxury Album Bag & Presentation Box', estPrice: 3000 },
  { id: 'del-pendrive', label: 'Custom Pen Drive & Custom Gift Box', estPrice: 2000 },
  { id: 'del-frames', label: '3 Premium Wall Photo Frames + 1 Calendar', estPrice: 4000 },
  { id: 'del-led', label: 'Stage LED Wall (08 × 06 Size)', estPrice: 15000 },
]

export default function CustomPackageBuilder({ isDarkMode = true }: CustomPackageBuilderProps) {
  const dateInputId = useId()

  // Form State
  const [selectedEventType, setSelectedEventType] = useState<string>('hindu-wedding')
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>(['photo-trad', 'photo-candid'])
  const [selectedVideos, setSelectedVideos] = useState<string[]>(['video-trad', 'video-candid'])
  const [selectedDeliverables, setSelectedDeliverables] = useState<string[]>([
    'del-album-300',
    'del-box',
    'del-pendrive',
    'del-frames'
  ])

  // Custom Event Details
  const [eventDate, setEventDate] = useState('')
  const [eventCity, setEventCity] = useState('')
  const [specialNotes, setSpecialNotes] = useState('')

  // Quick Submit Form State
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [addedNotice, setAddedNotice] = useState(false)

  // Toggle Checkbox handlers
  const toggleOption = (id: string, list: string[], setList: (val: string[]) => void) => {
    if (list.includes(id)) {
      setList(list.filter((x) => x !== id))
    } else {
      setList([...list, id])
    }
  }

  // Calculate estimated total price
  const calculateTotalEstimate = () => {
    let total = 0
    selectedPhotos.forEach((id) => {
      const item = PHOTO_OPTIONS.find((p) => p.id === id)
      if (item) total += item.estPrice
    })
    selectedVideos.forEach((id) => {
      const item = VIDEO_OPTIONS.find((v) => v.id === id)
      if (item) total += item.estPrice
    })
    selectedDeliverables.forEach((id) => {
      const item = DELIVERABLE_OPTIONS.find((d) => d.id === id)
      if (item) total += item.estPrice
    })
    return total
  }

  const totalEstimate = calculateTotalEstimate()
  const currentEventTypeObj = EVENT_TYPES.find((e) => e.id === selectedEventType) || EVENT_TYPES[0]

  // Gather all selected inclusion names
  const getSelectedInclusionNames = () => {
    const list: string[] = []
    selectedPhotos.forEach((id) => {
      const item = PHOTO_OPTIONS.find((p) => p.id === id)
      if (item) list.push(item.label)
    })
    selectedVideos.forEach((id) => {
      const item = VIDEO_OPTIONS.find((v) => v.id === id)
      if (item) list.push(item.label)
    })
    selectedDeliverables.forEach((id) => {
      const item = DELIVERABLE_OPTIONS.find((d) => d.id === id)
      if (item) list.push(item.label)
    })
    return list
  }

  const selectedInclusionNames = getSelectedInclusionNames()

  // Save Custom Package to Cart
  const handleSaveToCart = () => {
    const CART_KEY = 'kr_global_enquiry_cart_v2'
    const stored = JSON.parse(localStorage.getItem(CART_KEY) || '[]')

    const customPackageTitle = `Custom Service: ${currentEventTypeObj.label} (${selectedInclusionNames.length} Inclusions)`
    const priceFormatted = `₹${totalEstimate.toLocaleString('en-IN')}/- (Est.)`

    const customPackageItem = {
      id: `custom-${Date.now()}`,
      name: customPackageTitle,
      price: priceFormatted,
      division: 'studioz',
      details: {
        eventType: currentEventTypeObj.label,
        eventDate,
        eventCity,
        inclusions: selectedInclusionNames,
        specialNotes
      }
    }

    const existsIndex = stored.findIndex((x: any) => x.name.startsWith('Custom Service:'))
    if (existsIndex >= 0) {
      stored[existsIndex] = customPackageItem
    } else {
      stored.push(customPackageItem)
    }

    localStorage.setItem(CART_KEY, JSON.stringify(stored))
    window.dispatchEvent(new Event('kr-cart-update'))
    window.dispatchEvent(new Event('kr-open-drawer'))

    setAddedNotice(true)
    setTimeout(() => setAddedNotice(false), 2000)
  }

  // Direct Enquiry Submission
  const handleDirectSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!clientName.trim() || !clientPhone.trim()) {
      setSubmitError('Please provide your Name and Phone Number.')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    const customPackageTitle = `Custom Service Package: ${currentEventTypeObj.label}`
    const priceFormatted = `₹${totalEstimate.toLocaleString('en-IN')}/- (Est.)`

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: clientName,
          phone: clientPhone,
          email: clientEmail,
          event_type: currentEventTypeObj.label,
          category: 'Custom Package Builder',
          service: customPackageTitle,
          event_date: eventDate,
          message: `Custom Package Requirements:\n• Venue/City: ${eventCity || 'N/A'}\n• Est. Price: ${priceFormatted}\n• Selected Inclusions (${selectedInclusionNames.length}): ${selectedInclusionNames.join(', ')}\n• Notes: ${specialNotes || 'None'}`,
          items: [
            {
              id: 'custom-package',
              name: customPackageTitle,
              category: 'Custom Studioz Package',
              price: priceFormatted,
              division: 'studioz'
            }
          ]
        })
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setSubmitSuccess(true)
        setClientName('')
        setClientPhone('')
        setClientEmail('')
      } else {
        setSubmitError(data.error || 'Failed to submit custom enquiry. Please try again.')
      }
    } catch (err: any) {
      setSubmitError(err.message || 'An unexpected error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="custom-builder" className={`px-4 sm:px-6 lg:px-8 py-20 md:py-28 border-b transition-colors duration-500 ${
      isDarkMode ? 'bg-[#080808] border-white/10' : 'bg-slate-50 border-slate-200'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F97316]/10 border border-[#F97316]/30 text-[#F97316] text-xs font-bold uppercase tracking-widest mb-4">
            <Sliders className="w-4 h-4" />
            <span>Interactive Custom Package Builder</span>
          </div>
          <h2 className={`font-display font-black uppercase text-3xl sm:text-5xl md:text-6xl tracking-tight leading-none ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            CREATE YOUR <span className="text-[#F97316]">CUSTOM PACKAGE.</span>
          </h2>
          <p className={`text-xs sm:text-sm mt-4 leading-relaxed font-medium ${
            isDarkMode ? 'text-white/60' : 'text-slate-600'
          }`}>
            Can&apos;t find an exact package? Select your preferred event type, photography, videography, and deliverables to create a 100% custom service bundle.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left / Main Builder Form (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* STEP 1: EVENT TYPE SELECTION */}
            <div className={`p-6 sm:p-8 rounded-3xl border ${
              isDarkMode ? 'bg-zinc-950 border-white/10' : 'bg-white border-slate-200 shadow-xl'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-7 h-7 rounded-xl bg-[#F97316] text-white text-xs font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <h3 className={`font-display font-bold uppercase text-lg sm:text-xl ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    Select Your Event Type
                  </h3>
                  <p className={`text-xs ${isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>
                    Choose the celebration or function you want to cover
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                {EVENT_TYPES.map((evt) => {
                  const isSelected = selectedEventType === evt.id
                  return (
                    <button
                      key={evt.id}
                      type="button"
                      onClick={() => setSelectedEventType(evt.id)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                        isSelected
                          ? 'bg-[#F97316]/10 border-[#F97316] shadow-lg shadow-orange-500/10 scale-[1.02]'
                          : isDarkMode
                            ? 'bg-zinc-900/60 border-white/10 hover:border-white/30 text-white/80'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{evt.icon}</span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-[#F97316]" />
                        )}
                      </div>
                      <div>
                        <p className={`font-bold text-xs sm:text-sm ${
                          isSelected ? 'text-[#F97316]' : isDarkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          {evt.label}
                        </p>
                        <p className={`text-[10px] mt-0.5 line-clamp-1 ${
                          isDarkMode ? 'text-white/40' : 'text-slate-500'
                        }`}>
                          {evt.desc}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* STEP 2: PHOTOGRAPHY SERVICES */}
            <div className={`p-6 sm:p-8 rounded-3xl border ${
              isDarkMode ? 'bg-zinc-950 border-white/10' : 'bg-white border-slate-200 shadow-xl'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-7 h-7 rounded-xl bg-[#F97316] text-white text-xs font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <h3 className={`font-display font-bold uppercase text-lg sm:text-xl ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    Photography Options
                  </h3>
                  <p className={`text-xs ${isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>
                    Select photo styles and specialized coverage
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {PHOTO_OPTIONS.map((item) => {
                  const isSelected = selectedPhotos.includes(item.id)
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleOption(item.id, selectedPhotos, setSelectedPhotos)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#F97316]/10 border-[#F97316] shadow-sm'
                          : isDarkMode
                            ? 'bg-zinc-900/60 border-white/10 hover:border-white/30 text-white/80'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition ${
                          isSelected
                            ? 'bg-[#F97316] border-[#F97316] text-white'
                            : isDarkMode ? 'border-white/30' : 'border-slate-400'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className={`text-xs sm:text-sm font-semibold ${
                          isSelected ? 'text-[#F97316]' : isDarkMode ? 'text-white/90' : 'text-slate-800'
                        }`}>
                          {item.label}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[#F97316] font-bold">
                        +₹{item.estPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* STEP 3: VIDEOGRAPHY SERVICES */}
            <div className={`p-6 sm:p-8 rounded-3xl border ${
              isDarkMode ? 'bg-zinc-950 border-white/10' : 'bg-white border-slate-200 shadow-xl'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-7 h-7 rounded-xl bg-[#F97316] text-white text-xs font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <div>
                  <h3 className={`font-display font-bold uppercase text-lg sm:text-xl ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    Videography Options
                  </h3>
                  <p className={`text-xs ${isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>
                    Select video formats, reels, teasers, and live streams
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {VIDEO_OPTIONS.map((item) => {
                  const isSelected = selectedVideos.includes(item.id)
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleOption(item.id, selectedVideos, setSelectedVideos)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#F97316]/10 border-[#F97316] shadow-sm'
                          : isDarkMode
                            ? 'bg-zinc-900/60 border-white/10 hover:border-white/30 text-white/80'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition ${
                          isSelected
                            ? 'bg-[#F97316] border-[#F97316] text-white'
                            : isDarkMode ? 'border-white/30' : 'border-slate-400'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className={`text-xs sm:text-sm font-semibold ${
                          isSelected ? 'text-[#F97316]' : isDarkMode ? 'text-white/90' : 'text-slate-800'
                        }`}>
                          {item.label}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[#F97316] font-bold">
                        +₹{item.estPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* STEP 4: DELIVERABLES & ALBUMS */}
            <div className={`p-6 sm:p-8 rounded-3xl border ${
              isDarkMode ? 'bg-zinc-950 border-white/10' : 'bg-white border-slate-200 shadow-xl'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-7 h-7 rounded-xl bg-[#F97316] text-white text-xs font-bold flex items-center justify-center shrink-0">
                  4
                </span>
                <div>
                  <h3 className={`font-display font-bold uppercase text-lg sm:text-xl ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    Albums &amp; Physical Deliverables
                  </h3>
                  <p className={`text-xs ${isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>
                    Choose printed photobooks, luxury boxes, frames, and LED displays
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {DELIVERABLE_OPTIONS.map((item) => {
                  const isSelected = selectedDeliverables.includes(item.id)
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleOption(item.id, selectedDeliverables, setSelectedDeliverables)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#F97316]/10 border-[#F97316] shadow-sm'
                          : isDarkMode
                            ? 'bg-zinc-900/60 border-white/10 hover:border-white/30 text-white/80'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition ${
                          isSelected
                            ? 'bg-[#F97316] border-[#F97316] text-white'
                            : isDarkMode ? 'border-white/30' : 'border-slate-400'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className={`text-xs sm:text-sm font-semibold ${
                          isSelected ? 'text-[#F97316]' : isDarkMode ? 'text-white/90' : 'text-slate-800'
                        }`}>
                          {item.label}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[#F97316] font-bold">
                        +₹{item.estPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* STEP 5: EVENT DETAILS & NOTES */}
            <div className={`p-6 sm:p-8 rounded-3xl border ${
              isDarkMode ? 'bg-zinc-950 border-white/10' : 'bg-white border-slate-200 shadow-xl'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-7 h-7 rounded-xl bg-[#F97316] text-white text-xs font-bold flex items-center justify-center shrink-0">
                  5
                </span>
                <div>
                  <h3 className={`font-display font-bold uppercase text-lg sm:text-xl ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    Event Details &amp; Custom Requests
                  </h3>
                  <p className={`text-xs ${isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>
                    Tell us your event date, location, or specific requirements
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor={dateInputId} className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                    isDarkMode ? 'text-white/70' : 'text-slate-700'
                  }`}>
                    Event Date
                  </label>
                  <input
                    id={dateInputId}
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border text-xs font-medium focus:outline-none focus:border-[#F97316] ${
                      isDarkMode
                        ? 'bg-zinc-900 border-white/15 text-white'
                        : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                    isDarkMode ? 'text-white/70' : 'text-slate-700'
                  }`}>
                    Venue City / Location
                  </label>
                  <input
                    type="text"
                    value={eventCity}
                    onChange={(e) => setEventCity(e.target.value)}
                    placeholder="e.g. Chennai, Madurai, Coimbatore..."
                    className={`w-full px-4 py-3 rounded-xl border text-xs font-medium focus:outline-none focus:border-[#F97316] ${
                      isDarkMode
                        ? 'bg-zinc-900 border-white/15 text-white placeholder-white/30'
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                  isDarkMode ? 'text-white/70' : 'text-slate-700'
                }`}>
                  Special Instructions / Additional Requirements
                </label>
                <textarea
                  rows={3}
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="Mention any custom expectations, stage setup size, or multiple venue details..."
                  className={`w-full px-4 py-3 rounded-xl border text-xs font-medium focus:outline-none focus:border-[#F97316] ${
                    isDarkMode
                      ? 'bg-zinc-900 border-white/15 text-white placeholder-white/30'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Right / Sticky Live Estimate Summary Card (4 Cols) */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-2xl ${
              isDarkMode
                ? 'bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 border-[#F97316]/40'
                : 'bg-white border-[#F97316]/40 shadow-orange-500/10'
            }`}>
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#F97316]" />
                  <span className="text-xs font-bold uppercase tracking-widest text-[#F97316]">
                    Package Summary
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F97316]/20 text-[#F97316] text-[10px] font-bold">
                  LIVE ESTIMATE
                </span>
              </div>

              {/* Event Title */}
              <div className="my-6">
                <span className={`text-[10px] uppercase tracking-widest font-bold ${
                  isDarkMode ? 'text-white/40' : 'text-slate-400'
                }`}>Target Event</span>
                <p className={`font-display font-black text-xl uppercase mt-1 ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  {currentEventTypeObj.icon} {currentEventTypeObj.label}
                </p>
              </div>

              {/* Inclusions Counter & Tags */}
              <div className="space-y-3 my-6">
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-semibold ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>
                    Selected Services:
                  </span>
                  <span className="font-mono font-bold text-[#F97316]">
                    {selectedInclusionNames.length} Items
                  </span>
                </div>

                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                  {selectedInclusionNames.map((name, idx) => (
                    <div
                      key={idx}
                      className={`px-3 py-1.5 rounded-xl border text-[11px] font-medium flex items-center justify-between ${
                        isDarkMode
                          ? 'bg-zinc-900/80 border-white/10 text-white/80'
                          : 'bg-slate-100 border-slate-200 text-slate-800'
                      }`}
                    >
                      <span className="truncate pr-2">• {name}</span>
                      <Check className="w-3.5 h-3.5 text-[#F97316] shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Price Calculation */}
              <div className="pt-6 border-t border-dashed border-white/10">
                <span className={`text-[10px] uppercase tracking-widest font-bold ${
                  isDarkMode ? 'text-white/40' : 'text-slate-400'
                }`}>Estimated Total Package Rate</span>
                <p className="font-display font-black text-3xl sm:text-4xl text-[#F97316] mt-1 tracking-tight">
                  ₹{totalEstimate.toLocaleString('en-IN')}/-
                </p>
                <p className={`text-[10px] mt-1 ${isDarkMode ? 'text-white/40' : 'text-slate-500'}`}>
                  *Final price may vary based on exact venue location and custom timings.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-3">
                <button
                  type="button"
                  onClick={handleSaveToCart}
                  className="w-full py-4 rounded-xl font-display font-bold text-xs uppercase tracking-widest transition cursor-pointer flex items-center justify-center gap-2 bg-[#F97316] hover:bg-white hover:text-black text-white shadow-lg shadow-orange-500/25"
                >
                  <Plus className="w-4 h-4" />
                  <span>{addedNotice ? '✓ Saved To Cart' : 'Save & Add Custom Package To Cart'}</span>
                </button>
              </div>
            </div>

            {/* Direct Quick Enquiry Card */}
            <div className={`p-6 sm:p-8 rounded-3xl border ${
              isDarkMode ? 'bg-zinc-950 border-white/10' : 'bg-white border-slate-200 shadow-xl'
            }`}>
              <h4 className={`font-display font-bold uppercase text-base mb-2 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Instant Custom Enquiry
              </h4>
              <p className={`text-xs mb-4 ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>
                Send this custom configuration directly to our studio team
              </p>

              {submitSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold text-center space-y-2">
                  <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-400" />
                  <p>Custom Enquiry Submitted Successfully!</p>
                  <p className="text-[10px] text-emerald-500 font-normal">
                    Our team will review your inclusions and reach out within 1-2 hours.
                  </p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="mt-2 text-[10px] text-white underline hover:text-emerald-300"
                  >
                    Submit Another Custom Package
                  </button>
                </div>
              ) : (
                <form onSubmit={handleDirectSubmit} className="space-y-3">
                  {submitError && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                      {submitError}
                    </div>
                  )}

                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Your Name *"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#F97316] ${
                      isDarkMode
                        ? 'bg-zinc-900 border-white/15 text-white placeholder-white/30'
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                    }`}
                  />

                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="Phone / WhatsApp Number *"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#F97316] ${
                      isDarkMode
                        ? 'bg-zinc-900 border-white/15 text-white placeholder-white/30'
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                    }`}
                  />

                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="Email Address (Optional)"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#F97316] ${
                      isDarkMode
                        ? 'bg-zinc-900 border-white/15 text-white placeholder-white/30'
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                    }`}
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl font-display font-bold text-xs uppercase tracking-widest transition cursor-pointer flex items-center justify-center gap-2 bg-white text-black hover:bg-[#F97316] hover:text-white disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Custom Request...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Custom Enquiry Now</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
