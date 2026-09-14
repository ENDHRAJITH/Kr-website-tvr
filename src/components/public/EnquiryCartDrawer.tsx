'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { X, Trash2, Send, Loader2 } from 'lucide-react'

const CART_KEY = "kr_global_enquiry_cart_v2"

export interface CartItem {
  id?: string
  division?: 'studioz' | 'marketing'
  name: string
  price?: string
}

export default function EnquiryCartDrawer() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [items, setItems] = useState<CartItem[]>([])
  const [submitting, setSubmitting] = useState(false)

  // Form State
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [business, setBusiness] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Do not render on Admin pages
  if (pathname?.startsWith('/admin')) {
    return null
  }

  const loadCart = () => {
    try {
      const stored = JSON.parse(localStorage.getItem(CART_KEY) || '[]')
      setItems(Array.isArray(stored) ? stored : [])
    } catch {
      setItems([])
    }
  }

  useEffect(() => {
    loadCart()

    const handleOpen = () => {
      loadCart()
      setIsOpen(true)
      document.body.style.overflow = 'hidden'
    }

    const handleUpdate = () => loadCart()

    window.addEventListener('kr-open-drawer', handleOpen)
    window.addEventListener('kr-cart-update', handleUpdate)

    return () => {
      window.removeEventListener('kr-open-drawer', handleOpen)
      window.removeEventListener('kr-cart-update', handleUpdate)
    }
  }, [])

  const closeDrawer = () => {
    setIsOpen(false)
    document.body.style.overflow = ''
  }

  const removeItem = (index: number) => {
    const updated = items.filter((_, idx) => idx !== index)
    setItems(updated)
    localStorage.setItem(CART_KEY, JSON.stringify(updated))
    window.dispatchEvent(new CustomEvent('kr-cart-update'))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim() || !message.trim()) {
      setError('Please fill in your Name, Phone number, and Project Details.')
      return
    }

    setError(null)
    setSubmitting(true)

    try {
      // 1. Post Enquiry to Database API (/api/enquiries)
      await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          event_type: business || email || 'General Enquiry',
          message,
          items: items.map((i) => ({
            id: i.id || null,
            division: i.division || null,
            name: i.name,
          })),
        }),
      })

      // 2. Open WhatsApp with pre-filled message
      const servicesList = items.length
        ? items.map((x) => `• ${x.name}`).join('\n')
        : '• General Enquiry'

      const waText = `Hello KR Digital Marketing & Studioz,\n\nEnquiry Services:\n${servicesList}\n\nName: ${name}\nPhone: ${phone}${
        business ? `\nBusiness/Req: ${business}` : ''
      }${email ? `\nEmail: ${email}` : ''}\nDetails: ${message}`

      window.open(
        `https://wa.me/919626759859?text=${encodeURIComponent(waText)}`,
        '_blank'
      )

      // 3. Clear Cart & Form
      localStorage.setItem(CART_KEY, '[]')
      setItems([])
      setName('')
      setPhone('')
      setEmail('')
      setBusiness('')
      setMessage('')
      window.dispatchEvent(new CustomEvent('kr-cart-update'))

      closeDrawer()
    } catch (err: any) {
      console.error('Failed to submit enquiry:', err)
      setError('An error occurred. Opening WhatsApp directly...')
      
      // Fallback: Open WhatsApp anyway
      const servicesList = items.length
        ? items.map((x) => `• ${x.name}`).join('\n')
        : '• General Enquiry'
      const waText = `Hello KR Digital Marketing & Studioz,\n\nEnquiry Services:\n${servicesList}\n\nName: ${name}\nPhone: ${phone}\nDetails: ${message}`
      window.open(
        `https://wa.me/919626759859?text=${encodeURIComponent(waText)}`,
        '_blank'
      )
      closeDrawer()
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex justify-end transition-opacity duration-300">
      <aside className="w-full max-w-lg h-full bg-white text-zinc-900 overflow-y-auto shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        <div>
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-zinc-200 p-5 flex justify-between items-center z-10">
            <div>
              <p className="text-orange-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                KR Enquiry Cart
              </p>
              <h3 className="font-sans text-xl md:text-2xl font-bold uppercase text-black">
                Selected Services <span className="text-orange-500">({items.length})</span>
              </h3>
            </div>
            <button
              onClick={closeDrawer}
              aria-label="Close enquiry cart"
              className="w-10 h-10 border border-zinc-200 text-xl font-bold hover:border-orange-500 hover:text-orange-500 transition flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List & Form */}
          <div className="p-6 md:p-8 space-y-6">
            {/* Selected Items */}
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="border border-zinc-200 p-4 flex items-center justify-between gap-3 bg-zinc-50/50"
                >
                  <div>
                    <b className="text-sm block font-semibold text-zinc-900">{item.name}</b>
                    <p className="text-xs text-zinc-500 mt-0.5">{item.price || 'Custom Package'}</p>
                  </div>
                  <button
                    onClick={() => removeItem(idx)}
                    className="text-[10px] font-bold text-red-500 hover:text-red-700 transition flex items-center gap-1 uppercase tracking-wider"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              ))}

              {items.length === 0 && (
                <div className="border border-dashed border-zinc-300 p-7 text-center text-sm text-zinc-500 rounded-lg">
                  No services selected yet. Browse Studioz or Digital Marketing services to add.
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <p className="text-orange-500 text-xs font-bold uppercase tracking-[0.2em]">
                Your Contact Details
              </p>

              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name *"
                className="w-full border border-zinc-300 p-3.5 outline-none focus:border-orange-500 text-sm rounded-none bg-white text-zinc-900 placeholder-zinc-400"
              />

              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number *"
                className="w-full border border-zinc-300 p-3.5 outline-none focus:border-orange-500 text-sm rounded-none bg-white text-zinc-900 placeholder-zinc-400"
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address (Optional)"
                className="w-full border border-zinc-300 p-3.5 outline-none focus:border-orange-500 text-sm rounded-none bg-white text-zinc-900 placeholder-zinc-400"
              />

              <input
                type="text"
                value={business}
                onChange={(e) => setBusiness(e.target.value)}
                placeholder="Business / Requirement (Optional)"
                className="w-full border border-zinc-300 p-3.5 outline-none focus:border-orange-500 text-sm rounded-none bg-white text-zinc-900 placeholder-zinc-400"
              />

              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about your project or event *"
                className="w-full border border-zinc-300 p-3.5 outline-none focus:border-orange-500 text-sm rounded-none bg-white text-zinc-900 placeholder-zinc-400 resize-none"
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-orange-500 hover:bg-black text-white py-4 text-xs font-bold uppercase tracking-wider transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting &amp; Opening WhatsApp...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send WhatsApp Enquiry &rarr;</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </aside>
    </div>
  )
}

