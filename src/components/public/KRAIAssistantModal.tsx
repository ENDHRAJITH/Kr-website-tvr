'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Sparkles, MessageSquare, X, Send, Bot, User, Loader2, ArrowRight, PhoneCall } from 'lucide-react'

interface Message {
  id: string
  sender: 'user' | 'bot'
  text: string
  sources?: Array<{ title: string; category?: string; division?: string }>
}

export default function KRAIAssistantModal() {
  const pathname = usePathname()
  const [botEnabled, setBotEnabled] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: '👋 Hi! I am the **KR AI Assistant** (powered by LangChain RAG & live Database context).\n\nHow can I help you today with **KR Studioz** photography or **KR Digital Marketing** services?',
    },
  ])

  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/ai-chat/status')
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.enabled === 'boolean') {
          setBotEnabled(data.enabled)
        }
      })
      .catch(() => setBotEnabled(true))
  }, [])

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  // Do not render if disabled by admin or on Admin dashboard
  if (pathname?.startsWith('/admin') || !botEnabled) {
    return null
  }

  const handleSend = async (questionText?: string) => {
    const q = (questionText || input).trim()
    if (!q || loading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: q,
    }

    setMessages((prev) => [...prev, userMsg])
    if (!questionText) setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: data.answer,
          sources: data.sources,
        }
        setMessages((prev) => [...prev, botMsg])
      } else {
        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: `⚠️ ${data.error || 'Sorry, I could not fetch an answer right now. Please try again.'}`,
        }
        setMessages((prev) => [...prev, errorMsg])
      }
    } catch (err) {
      console.error(err)
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: '⚠️ Network connection issue. Please check your connection or reach out on WhatsApp at +91 96267 59859.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const quickPrompts = [
    '📸 What wedding packages do you offer?',
    '🚀 Show me Digital Marketing services',
    '📞 How to contact Karthik & Rajitha?',
    '💼 Tell me about founder portfolios',
  ]

  return (
    <>
      {/* FLOATING TRIGGER BUTTON (Bottom-Right) */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open KR AI Assistant"
          className="relative group p-4 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 cursor-pointer border border-white/20"
        >
          {/* Animated Glow Ring */}
          <span className="absolute -inset-1 rounded-full bg-orange-500/40 blur-md group-hover:bg-orange-500/70 transition duration-300 animate-pulse pointer-events-none" />
          
          <div className="relative flex items-center gap-2">
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <>
                <Sparkles className="w-6 h-6 animate-spin-slow" />
                <span className="text-xs font-black uppercase tracking-wider hidden sm:inline-block pr-1">
                  Ask KR AI
                </span>
              </>
            )}
          </div>
        </button>
      </div>

      {/* CHAT MODAL WINDOW */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[580px] h-[75vh] bg-zinc-950/95 text-white border border-orange-500/30 rounded-2xl shadow-2xl backdrop-blur-xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* MODAL HEADER */}
          <div className="bg-zinc-900/90 p-4 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5 leading-tight">
                  <span>KR AI Assistant</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    LangChain RAG
                  </span>
                </h3>
                <p className="text-[11px] text-zinc-400">Powered by Live Database Knowledge</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* MESSAGES BODY */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs font-sans">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-start gap-2.5 ${
                  m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    m.sender === 'user'
                      ? 'bg-orange-500 text-white'
                      : 'bg-zinc-800 border border-zinc-700 text-orange-400'
                  }`}
                >
                  {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Box */}
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                    m.sender === 'user'
                      ? 'bg-orange-500 text-white rounded-tr-none font-medium'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none'
                  }`}
                >
                  {m.text}

                  {/* Sources tag if available */}
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-zinc-800 flex flex-wrap gap-1">
                      <span className="text-[10px] text-zinc-400 font-bold block w-full">DB Knowledge Context:</span>
                      {m.sources.slice(0, 3).map((s, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-300 border border-zinc-700"
                        >
                          {s.title}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-zinc-400 text-xs py-2">
                <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                <span>Searching live database &amp; compiling answer...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* QUICK PROMPTS */}
          <div className="px-4 py-2 border-t border-zinc-800/60 bg-zinc-900/40 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSend(qp)}
                disabled={loading}
                className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-medium bg-zinc-800/80 text-zinc-300 border border-zinc-700 hover:border-orange-500 hover:text-orange-400 transition cursor-pointer shrink-0"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* INPUT FORM */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="p-3 border-t border-zinc-800 bg-zinc-900/90 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about photography, SEO, pricing..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-40 transition cursor-pointer flex items-center justify-center shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  )
}
