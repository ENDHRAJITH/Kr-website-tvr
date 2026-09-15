import { StudiozVideoItem } from '@/components/public/StudiozVideoMarquee'
import { FounderDeck } from '@/types/database'

export const FALLBACK_STUDIOZ_VIDEOS: StudiozVideoItem[] = []

export const FALLBACK_FOUNDER_DECKS: FounderDeck[] = [
  {
    id: 'rajitha-deck',
    founder_name: 'Rajitha',
    founder_role: 'Founder & Creative Director (KR Studioz)',
    division: 'studioz',
    avatar_url: '/rajitha.png',
    pdf_url: '/docs/rajitha-studioz-portfolio.pdf',
    bio: 'Pioneer of high-end wedding cinematography and storytelling.',
    slides: [],
    display_order: 1
  },
  {
    id: 'karthik-deck',
    founder_name: 'Karthik',
    founder_role: 'Founder & Managing Director (KR Digital)',
    division: 'marketing',
    avatar_url: '/karthik.png',
    pdf_url: '/docs/karthik-digital-marketing-deck.pdf',
    bio: 'Brand strategist & growth hacker driving multi-million reach.',
    slides: [],
    display_order: 2
  }
]
