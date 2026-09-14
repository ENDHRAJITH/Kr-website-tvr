import { StudiozVideoItem } from '@/components/public/StudiozVideoMarquee'
import { FounderDeck } from '@/types/database'

export const FALLBACK_STUDIOZ_VIDEOS: StudiozVideoItem[] = [
  {
    id: '11111111-1111-4111-a111-111111111101',
    title: 'Grand Cinematic Wedding Story',
    category: 'Wedding Film',
    thumbnail_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    id: '11111111-1111-4111-a111-111111111102',
    title: 'Pre-Wedding Love Story Highlights',
    category: 'Pre-Wedding',
    thumbnail_url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1600&q=85',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    id: '11111111-1111-4111-a111-111111111103',
    title: 'Royal Reception Celebration Teaser',
    category: 'Reception',
    thumbnail_url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1600&q=85',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    id: '11111111-1111-4111-a111-111111111104',
    title: 'Traditional Nikkah Ceremony Moments',
    category: 'Nikkah',
    thumbnail_url: 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1600&q=85',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    id: '11111111-1111-4111-a111-111111111105',
    title: 'Adorable Baby Milestone Shoot',
    category: 'Baby Shoot',
    thumbnail_url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1600&q=85',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  }
]

export const FALLBACK_FOUNDER_DECKS: FounderDeck[] = [
  {
    id: 'rajitha-deck',
    founder_name: 'Rajitha',
    founder_role: 'Founder & Creative Director (KR Studioz)',
    division: 'studioz',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    pdf_url: '/docs/rajitha-studioz-portfolio.pdf',
    bio: 'Pioneer of high-end wedding cinematography and storytelling. Over 10+ years shaping unforgettable visual legacies across South India.',
    slides: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1200&q=85'
    ],
    display_order: 1
  },
  {
    id: 'karthik-deck',
    founder_name: 'Karthik',
    founder_role: 'Founder & Managing Director (KR Digital)',
    division: 'marketing',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    pdf_url: '/docs/karthik-digital-marketing-deck.pdf',
    bio: 'Brand strategist & growth hacker driving multi-million reach for top business brands, influencers, and digital campaigns.',
    slides: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1542744094-3a31727223ec?auto=format&fit=crop&w=1200&q=85'
    ],
    display_order: 2
  }
]
