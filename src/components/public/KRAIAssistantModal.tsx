'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import {
  Sparkles,
  X,
  Send,
  User,
  Copy,
  Check,
  Plus,
  ChevronDown,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react'

interface Message {
  id: string
  sender: 'user' | 'bot'
  text: string
  sources?: Array<{ title: string; category?: string; division?: string }>
  timestamp: string
}

export default function KRAIAssistantModal() {
  const pathname = usePathname()
  const [botEnabled, setBotEnabled] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showTooltip, setShowTooltip] = useState(true)

  const INITIAL_WELCOME: Message = {
    id: 'welcome-1',
    sender: 'bot',
    text: "Hello! I'm **Lossy AI**, your instant creative & digital marketing assistant.\n\nHow can I help you today with **KR Studioz** photography or **KR Digital Marketing** services?",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }

  const [messages, setMessages] = useState<Message[]>([INITIAL_WELCOME])

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
      setShowTooltip(false)
    }
  }, [messages, isOpen, loading])

  // Hide on admin panel or if bot is disabled globally
  if (pathname?.startsWith('/admin') || !botEnabled) {
    return null
  }

  const handleSend = async (questionText?: string) => {
    const q = (questionText || input).trim()
    if (!q || loading) return

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: q,
      timestamp: now,
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
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
        setMessages((prev) => [...prev, botMsg])
      } else {
        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: `I'm sorry, I couldn't retrieve that information right now. Please contact our team directly at +91 96267 59859 or try again.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
          text: 'Network connection error. Please reach out to us on WhatsApp at **+91 96267 59859**.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleNewChat = () => {
    setMessages([INITIAL_WELCOME])
  }

  const suggestionCards = [
    {
      title: '📸 Wedding Photography',
      desc: 'Explore event packages, coverage & pricing',
      query: 'What wedding photography packages do you offer?',
    },
    {
      title: '🚀 Digital Marketing',
      desc: 'SEO, Social Media management & Paid Ads',
      query: 'Tell me about KR Digital Marketing services and plans',
    },
    {
      title: '💼 Founder Portfolios',
      desc: 'Karthik & Rajitha brand showcases & decks',
      query: 'Show me details about Karthik & Rajitha founder portfolio',
    },
    {
      title: '📞 Contact Team',
      desc: 'Reach out via WhatsApp or phone call',
      query: 'How to contact Karthik & Rajitha team directly?',
    },
  ]

  // Render formatted markdown text cleanly
  const formatLossyText = (text: string) => {
    const lines = text.split('\n')
    return lines.map((line, lIdx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g)
      const parsedLine = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-semibold text-white">
              {part.slice(2, -2)}
            </strong>
          )
        }
        return part
      })

      return (
        <span key={lIdx} className="block min-h-[1.4em]">
          {parsedLine}
        </span>
      )
    })
  }

  return (
    <>
      {/* FLOATING TRIGGER BUTTON (Bottom-Right) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {/* Tooltip bubble */}
        {showTooltip && !isOpen && (
          <div className="relative animate-bounce hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#212121] border border-[#383838] text-white text-xs shadow-2xl backdrop-blur-md font-sans">
            <span className="w-2 h-2 rounded-full bg-[#10a37f] animate-ping" />
            <span className="font-medium text-[#ececf1]">Ask Lossy AI Assistant ⚡</span>
            <button
              onClick={() => setShowTooltip(false)}
              className="text-zinc-400 hover:text-white ml-1 text-xs cursor-pointer"
            >
              ×
            </button>
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-[#212121] border-r border-b border-[#383838] rotate-45" />
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open Lossy AI Assistant"
          className="relative group p-4 rounded-full bg-[#212121] text-white shadow-2xl hover:bg-[#2f2f2f] hover:scale-105 transition-all duration-300 flex items-center gap-2.5 cursor-pointer border border-[#3e3e3e]"
        >
          <div className="relative flex items-center gap-2">
            {isOpen ? (
              <X className="w-6 h-6 text-[#ececf1]" />
            ) : (
              <>
                {/* Lossy AI Avatar Icon */}
                <div className="w-6 h-6 rounded-md bg-[#10a37f] flex items-center justify-center text-white font-bold text-xs shadow-sm">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-bold tracking-wide text-[#ececf1] hidden sm:inline-block pr-1 font-sans">
                  Lossy AI
                </span>
              </>
            )}
          </div>
        </button>
      </div>

      {/* LOSSY AI MODAL WINDOW */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[440px] h-[640px] max-h-[84vh] bg-[#212121] text-[#ececf1] border border-[#383838] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300 font-sans">
          
          {/* HEADER BAR */}
          <div className="bg-[#171717] px-4 py-3 border-b border-[#2f2f2f] flex items-center justify-between">
            {/* Model Selector Pill Style */}
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#212121] hover:bg-[#2f2f2f] transition cursor-pointer border border-[#2a2b32]">
              <div className="w-5 h-5 rounded bg-[#10a37f] flex items-center justify-center text-white">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs font-bold text-[#ececf1] tracking-wide">Lossy AI 4.0</span>
              <span className="text-[10px] font-semibold text-[#10a37f] bg-[#10a37f]/10 px-1.5 py-0.5 rounded border border-[#10a37f]/30">
                Pro
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleNewChat}
                title="New Chat"
                className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-[#2f2f2f] transition cursor-pointer flex items-center gap-1 text-xs"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline text-[11px] font-medium">New chat</span>
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-[#2f2f2f] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CHAT MESSAGES BODY */}
          <div className="flex-1 p-4 overflow-y-auto space-y-6 text-xs sm:text-sm leading-relaxed scroll-smooth bg-[#212121]">
            
            {/* Suggestions Cards (Shown when only initial message exists) */}
            {messages.length === 1 && (
              <div className="pt-2 pb-4 space-y-4">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 rounded-full bg-[#10a37f] text-white flex items-center justify-center mx-auto shadow-lg">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-white tracking-tight">How can Lossy AI help you today?</h3>
                  <p className="text-xs text-[#acacbe]">Ask anything about KR Studioz or Digital Marketing</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  {suggestionCards.map((card, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSend(card.query)}
                      className="p-3 text-left rounded-xl bg-[#2f2f2f]/60 hover:bg-[#2f2f2f] border border-[#3e3e3e]/80 hover:border-[#565656] transition cursor-pointer group flex flex-col justify-between min-h-[90px]"
                    >
                      <span className="font-semibold text-xs text-[#ececf1] group-hover:text-white">
                        {card.title}
                      </span>
                      <span className="text-[10px] text-[#acacbe] line-clamp-2 mt-1">
                        {card.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message Stream */}
            {messages.map((m) => (
              <div key={m.id} className="space-y-2">
                {/* User Message Row */}
                {m.sender === 'user' ? (
                  <div className="flex justify-end">
                    <div className="max-w-[85%] px-4 py-3 rounded-2xl bg-[#2f2f2f] text-[#ececf1] font-normal leading-relaxed border border-[#3e3e3e]/40 shadow-sm">
                      {m.text}
                    </div>
                  </div>
                ) : (
                  /* Lossy AI Bot Message Row */
                  <div className="flex items-start gap-3 pt-1">
                    {/* Lossy Avatar Icon */}
                    <div className="w-7 h-7 rounded-md bg-[#10a37f] text-white flex items-center justify-center shrink-0 shadow mt-0.5">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>

                    <div className="flex-1 space-y-2 text-[#ececf1]">
                      {/* Response Text */}
                      <div className="prose prose-invert text-xs sm:text-sm leading-relaxed max-w-none">
                        {formatLossyText(m.text)}
                      </div>

                      {/* Source tag pills */}
                      {m.sources && m.sources.length > 0 && (
                        <div className="pt-2 flex flex-wrap gap-1.5 items-center">
                          {m.sources.slice(0, 3).map((s, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded text-[10px] bg-[#2f2f2f] text-zinc-300 border border-[#3e3e3e]"
                            >
                              {s.title}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Bottom Action Buttons (Copy, Thumbs Up/Down) */}
                      <div className="flex items-center gap-3 pt-1 text-[#acacbe] text-xs">
                        <button
                          type="button"
                          onClick={() => handleCopy(m.id, m.text)}
                          className="hover:text-white flex items-center gap-1 transition cursor-pointer"
                          title="Copy response"
                        >
                          {copiedId === m.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-[11px] text-emerald-400 font-medium">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                        <button type="button" className="hover:text-white transition cursor-pointer" title="Good response">
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button type="button" className="hover:text-white transition cursor-pointer" title="Bad response">
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Bouncing Dots Loading Indicator */}
            {loading && (
              <div className="flex items-start gap-3 pt-1">
                <div className="w-7 h-7 rounded-md bg-[#10a37f] text-white flex items-center justify-center shrink-0 shadow animate-pulse">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="flex items-center gap-1.5 py-2">
                  <span className="w-2 h-2 rounded-full bg-[#10a37f] animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 rounded-full bg-[#10a37f] animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 rounded-full bg-[#10a37f] animate-bounce" />
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* FOOTER INPUT BAR */}
          <div className="p-3 bg-[#171717] border-t border-[#2f2f2f] space-y-2">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="relative flex items-center"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message Lossy..."
                className="w-full pl-4 pr-12 py-3 rounded-2xl bg-[#2f2f2f] text-xs sm:text-sm text-[#ececf1] placeholder-[#acacbe] border border-[#3e3e3e] focus:outline-none focus:border-[#565656] transition"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="absolute right-2 p-2 rounded-xl bg-white hover:bg-zinc-200 text-black disabled:opacity-20 transition cursor-pointer flex items-center justify-center shadow"
              >
                <Send className="w-3.5 h-3.5 fill-black text-black" />
              </button>
            </form>

            {/* Signature Micro Disclaimer */}
            <div className="flex items-center justify-between px-1 text-[10px] text-[#acacbe]">
              <span>Lossy AI can make mistakes. Verify details on WhatsApp.</span>
              <a
                href="https://wa.me/919626759859"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#10a37f] hover:underline flex items-center gap-1 font-medium"
              >
                <span>WhatsApp</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>

        </div>
      )}
    </>
  )
}
