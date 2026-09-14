'use client'

import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, MessageSquare, CheckCircle, Send, Sparkles } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

export default function ContactView() {
  const { isDarkMode } = useTheme()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'studioz',
    service: 'Wedding Photography',
    event_date: '',
    message: '',
  })

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || (!formData.phone && !formData.email)) {
      setErrorMsg('Please fill in your name and either phone or email.')
      return
    }

    setSubmitting(true)
    setErrorMsg('')

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setSubmitted(true)
        setFormData({
          name: '',
          email: '',
          phone: '',
          category: 'studioz',
          service: 'Wedding Photography',
          event_date: '',
          message: '',
        })
      } else {
        setErrorMsg(data.error || 'Failed to submit enquiry. Please try again.')
      }
    } catch (err) {
      console.error(err)
      setErrorMsg('Something went wrong. Please check your internet connection.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className={`min-h-screen pt-28 pb-24 transition-colors duration-500 ${
      isDarkMode ? 'bg-[#050505] text-white' : 'bg-white text-zinc-900'
    }`}>
      {/* ==========================================================
          HERO BANNER
      =========================================================== */}
      <section className={`relative py-16 sm:py-24 px-5 md:px-10 lg:px-16 overflow-hidden border-b ${
        isDarkMode ? 'dark-kr-grid border-white/10' : 'kr-grid border-slate-200'
      }`}>
        <div className={`absolute inset-0 pointer-events-none ${
          isDarkMode ? 'dark-grid-fade' : 'grid-fade'
        }`} />

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/40 bg-orange-500/10 text-orange-500 text-xs font-bold uppercase tracking-[0.2em] mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Connect With KR</span>
          </div>

          <h1 className={`font-display font-black uppercase tracking-[-0.06em] leading-[0.85] text-[3.2rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[7rem] ${
            isDarkMode ? 'text-white' : 'text-zinc-900'
          }`}>
            LET&apos;S <span className="text-[#F97316]">TALK.</span>
          </h1>

          <p className={`mt-6 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed ${
            isDarkMode ? 'text-white/70' : 'text-zinc-600'
          }`}>
            Have a wedding coming up, need a creative brand photoshoot, or want to scale your business with digital marketing? We&apos;re here to help.
          </p>
        </div>
      </section>

      {/* ==========================================================
          MAIN CONTACT SECTION & FORM
      =========================================================== */}
      <section className="py-16 md:py-24 px-5 md:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-16">
          {/* LEFT COLUMN: DIRECT CONTACT DETAILS */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] font-extrabold text-[#F97316]">
                Direct Communication
              </p>
              <h2 className={`mt-3 font-display text-4xl sm:text-5xl font-black uppercase tracking-tight ${
                isDarkMode ? 'text-white' : 'text-zinc-900'
              }`}>
                GET IN TOUCH <br />WITH <span className="text-[#F97316]">OUR TEAM</span>
              </h2>

              <p className={`mt-5 text-sm md:text-base leading-relaxed ${
                isDarkMode ? 'text-white/60' : 'text-zinc-600'
              }`}>
                Send us a message using the enquiry form, or reach out to us directly through WhatsApp or phone for immediate consultations.
              </p>

              {/* CONTACT CARDS */}
              <div className="mt-10 flex flex-col gap-4">
                {/* WHATSAPP CARD */}
                <a
                  href="https://wa.me/919626759859"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-6 border flex items-center gap-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500 ${
                    isDarkMode ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-zinc-200 shadow-sm'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-500">Fast Response</p>
                    <h3 className={`font-bold text-base md:text-lg ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                      WhatsApp Chat
                    </h3>
                    <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-white/50' : 'text-zinc-500'}`}>+91 96267 59859</p>
                  </div>
                </a>

                {/* PHONE CARD */}
                <a
                  href="tel:+919626759859"
                  className={`p-6 border flex items-center gap-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#F97316] ${
                    isDarkMode ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-zinc-200 shadow-sm'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-[#F97316]/10 text-[#F97316] flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#F97316]">Call Direct</p>
                    <h3 className={`font-bold text-base md:text-lg ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                      +91 96267 59859
                    </h3>
                    <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-white/50' : 'text-zinc-500'}`}>Mon – Sat: 9:00 AM – 8:00 PM</p>
                  </div>
                </a>

                {/* EMAIL CARD */}
                <a
                  href="mailto:kr.digital.studioz@gmail.com"
                  className={`p-6 border flex items-center gap-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#F97316] ${
                    isDarkMode ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-zinc-200 shadow-sm'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-[#F97316]/10 text-[#F97316] flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#F97316]">Email Inquiries</p>
                    <h3 className={`font-bold text-base md:text-lg ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                      kr.digital.studioz@gmail.com
                    </h3>
                    <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-white/50' : 'text-zinc-500'}`}>Send us your proposal or brief</p>
                  </div>
                </a>

                {/* STUDIO LOCATION CARD */}
                <div className={`p-6 border flex items-center gap-5 ${
                  isDarkMode ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-zinc-200 shadow-sm'
                }`}>
                  <div className="w-12 h-12 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-orange-500">Main Office &amp; Studio</p>
                    <h3 className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                      KR Digital Marketing &amp; Studioz
                    </h3>
                    <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-white/50' : 'text-zinc-500'}`}>
                      Tamil Nadu, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`mt-10 pt-6 border-t flex items-center gap-3 text-xs font-semibold ${
              isDarkMode ? 'border-white/10 text-white/40' : 'border-zinc-200 text-zinc-400'
            }`}>
              <Clock className="w-4 h-4 text-[#F97316]" />
              <span>We usually respond within 2-4 hours during working days.</span>
            </div>
          </div>

          {/* RIGHT COLUMN: ENQUIRY FORM */}
          <div className="lg:col-span-7">
            <div className={`border p-8 sm:p-12 shadow-xl relative ${
              isDarkMode
                ? 'bg-[#0a0a0a] border-[#F97316]/50 shadow-[10px_10px_0px_#F97316]'
                : 'bg-white border-[#F97316] shadow-[10px_10px_0px_#050505]'
            }`}>
              <span className="absolute -top-2 -left-2 w-4 h-4 bg-[#F97316] rounded-full" />
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#F97316] rounded-full" />
              <span className="absolute -bottom-2 -left-2 w-4 h-4 bg-[#F97316] rounded-full" />
              <span className="absolute -bottom-2 -right-2 w-4 h-4 bg-[#F97316] rounded-full" />

              {submitted ? (
                <div className="py-12 text-center flex flex-col items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className={`font-display text-3xl font-black uppercase ${
                    isDarkMode ? 'text-white' : 'text-zinc-900'
                  }`}>
                    ENQUIRY RECEIVED!
                  </h3>
                  <p className={`mt-4 text-base max-w-md ${
                    isDarkMode ? 'text-white/70' : 'text-zinc-600'
                  }`}>
                    Thank you for reaching out to KR Digital Marketing &amp; Studioz. Our team has received your enquiry and will get back to you shortly!
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-8 px-8 py-3.5 bg-[#F97316] text-white font-bold uppercase tracking-[0.15em] text-xs hover:bg-black transition cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div>
                    <h3 className={`font-display text-3xl font-black uppercase tracking-tight ${
                      isDarkMode ? 'text-white' : 'text-zinc-900'
                    }`}>
                      SEND US A MESSAGE
                    </h3>
                    <p className={`mt-2 text-xs font-medium ${
                      isDarkMode ? 'text-white/50' : 'text-zinc-500'
                    }`}>
                      Fill in the form below to receive a custom quote &amp; project consultation.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="p-4 bg-red-500/15 border border-red-500/40 text-red-500 text-xs font-semibold rounded-sm">
                      {errorMsg}
                    </div>
                  )}

                  {/* NAME */}
                  <div>
                    <label className={`block text-xs uppercase font-extrabold tracking-wider mb-2 ${
                      isDarkMode ? 'text-white/80' : 'text-zinc-700'
                    }`}>
                      Full Name <span className="text-[#F97316]">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Anand Kumar"
                      className={`w-full px-4 py-3.5 border text-sm font-medium focus:outline-none focus:border-[#F97316] transition-colors ${
                        isDarkMode
                          ? 'bg-zinc-900 border-white/15 text-white placeholder-white/30'
                          : 'bg-slate-50 border-zinc-200 text-zinc-900 placeholder-zinc-400'
                      }`}
                    />
                  </div>

                  {/* PHONE & EMAIL GRID */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-xs uppercase font-extrabold tracking-wider mb-2 ${
                        isDarkMode ? 'text-white/80' : 'text-zinc-700'
                      }`}>
                        Phone Number <span className="text-[#F97316]">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className={`w-full px-4 py-3.5 border text-sm font-medium focus:outline-none focus:border-[#F97316] transition-colors ${
                          isDarkMode
                            ? 'bg-zinc-900 border-white/15 text-white placeholder-white/30'
                            : 'bg-slate-50 border-zinc-200 text-zinc-900 placeholder-zinc-400'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs uppercase font-extrabold tracking-wider mb-2 ${
                        isDarkMode ? 'text-white/80' : 'text-zinc-700'
                      }`}>
                        Email Address <span className="text-[#F97316]">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="anand@example.com"
                        className={`w-full px-4 py-3.5 border text-sm font-medium focus:outline-none focus:border-[#F97316] transition-colors ${
                          isDarkMode
                            ? 'bg-zinc-900 border-white/15 text-white placeholder-white/30'
                            : 'bg-slate-50 border-zinc-200 text-zinc-900 placeholder-zinc-400'
                        }`}
                      />
                    </div>
                  </div>

                  {/* CATEGORY & SERVICE SELECTION */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-xs uppercase font-extrabold tracking-wider mb-2 ${
                        isDarkMode ? 'text-white/80' : 'text-zinc-700'
                      }`}>
                        Interest Area
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={`w-full px-4 py-3.5 border text-sm font-medium focus:outline-none focus:border-[#F97316] transition-colors cursor-pointer ${
                          isDarkMode
                            ? 'bg-zinc-900 border-white/15 text-white'
                            : 'bg-slate-50 border-zinc-200 text-zinc-900'
                        }`}
                      >
                        <option value="studioz">KR Studioz (Photography &amp; Films)</option>
                        <option value="digital">KR Digital Marketing (Branding &amp; Ads)</option>
                        <option value="both">Both Divisions</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block text-xs uppercase font-extrabold tracking-wider mb-2 ${
                        isDarkMode ? 'text-white/80' : 'text-zinc-700'
                      }`}>
                        Service Selected
                      </label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className={`w-full px-4 py-3.5 border text-sm font-medium focus:outline-none focus:border-[#F97316] transition-colors cursor-pointer ${
                          isDarkMode
                            ? 'bg-zinc-900 border-white/15 text-white'
                            : 'bg-slate-50 border-zinc-200 text-zinc-900'
                        }`}
                      >
                        {formData.category === 'studioz' ? (
                          <>
                            <option value="Wedding Photography">Wedding Photography</option>
                            <option value="Pre-Wedding Shoot">Pre-Wedding Shoot</option>
                            <option value="Baby Shoot">Baby Shoot</option>
                            <option value="Birthday Functions">Birthday Functions</option>
                            <option value="Traditional Ceremonies">Traditional Ceremonies</option>
                            <option value="Model Shoot">Model Shoot</option>
                          </>
                        ) : formData.category === 'digital' ? (
                          <>
                            <option value="Search Engine Optimization">Search Engine Optimization (SEO)</option>
                            <option value="Google & Instagram Ads">Google &amp; Instagram Ads</option>
                            <option value="Influencer Marketing">Influencer Marketing</option>
                            <option value="Branding & Identity">Branding &amp; Visual Identity</option>
                            <option value="YouTube Ads & Video">YouTube Ads &amp; Video</option>
                            <option value="Graphic Design">Graphic Design &amp; Creatives</option>
                          </>
                        ) : (
                          <>
                            <option value="Full Service Ecosystem">Full Service Ecosystem</option>
                            <option value="Custom Project Package">Custom Project Package</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>

                  {/* EVENT DATE */}
                  <div>
                    <label className={`block text-xs uppercase font-extrabold tracking-wider mb-2 ${
                      isDarkMode ? 'text-white/80' : 'text-zinc-700'
                    }`}>
                      Event or Preferred Start Date (Optional)
                    </label>
                    <input
                      type="date"
                      name="event_date"
                      value={formData.event_date}
                      onChange={handleChange}
                      className={`w-full px-4 py-3.5 border text-sm font-medium focus:outline-none focus:border-[#F97316] transition-colors ${
                        isDarkMode
                          ? 'bg-zinc-900 border-white/15 text-white'
                          : 'bg-slate-50 border-zinc-200 text-zinc-900'
                      }`}
                    />
                  </div>

                  {/* MESSAGE */}
                  <div>
                    <label className={`block text-xs uppercase font-extrabold tracking-wider mb-2 ${
                      isDarkMode ? 'text-white/80' : 'text-zinc-700'
                    }`}>
                      Project Details / Message (Optional)
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us more about your event location, vision, or digital marketing goals..."
                      className={`w-full px-4 py-3.5 border text-sm font-medium focus:outline-none focus:border-[#F97316] transition-colors ${
                        isDarkMode
                          ? 'bg-zinc-900 border-white/15 text-white placeholder-white/30'
                          : 'bg-slate-50 border-zinc-200 text-zinc-900 placeholder-zinc-400'
                      }`}
                    />
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-[#F97316] text-white font-extrabold uppercase tracking-[0.16em] text-xs flex items-center justify-center gap-3 transition-all duration-300 hover:bg-black hover:shadow-lg disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? (
                      <span>Sending Enquiry...</span>
                    ) : (
                      <>
                        <span>Submit Enquiry</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
