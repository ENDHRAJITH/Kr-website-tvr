import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getWeddingPackages } from '@/lib/queries/weddingPackages'
import { getStudiozServices } from '@/lib/queries/studiozServices'
import { slugify } from '@/lib/utils/slugify'
import StudiozPackageDetailClient, { StudiozItemDetail } from '@/components/public/StudiozPackageDetailClient'

export const revalidate = 60
export const dynamic = 'force-dynamic'

const FALLBACK_WEDDING_ITEMS: StudiozItemDetail[] = [
  {
    id: 'p-hindu-a',
    name: 'Hindu Wedding — Plan A (Traditional Photo & 4K Video)',
    type: 'wedding_package',
    religion: 'hindu',
    planCode: 'A',
    badge: 'Traditional Package',
    tagline: 'Nichayathartham, Muhurtham & Reception Coverage with dual cameraman setup.',
    price: '₹45,000/-',
    heroImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
    photoInclusions: ['1 Traditional Photographer', '1 Traditional Videographer', 'Full HD & 4K Camera Setup', 'Stage & Mandap Lighting Coverage'],
    deliverablesInclusions: ['Premium Canvera Photo Album (35 Sheets)', 'Edited Full HD Video Output in Pen Drive', 'Highlight Teaser Reel for Instagram', 'Complimentary Photo Frame']
  },
  {
    id: 'p-hindu-b',
    name: 'Hindu Wedding — Plan B (Candid Photography & Cinematography)',
    type: 'wedding_package',
    religion: 'hindu',
    planCode: 'B',
    badge: 'Most Popular',
    tagline: 'Haldi, Mehendi, Muhurtham & Grand Reception with Candid & Cinematic Storytelling.',
    price: '₹65,000/-',
    heroImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85',
    photoInclusions: ['1 Candid Photographer (Sony Alpha Full Frame)', '1 Cinematic Videographer (4K Gimbal & Slow Motion)', '1 Traditional Photographer', '1 Traditional Videographer', 'Couple Outdoor Portrait Session'],
    deliverablesInclusions: ['2 Premium Leather Photo Albums (70 Sheets)', '4K Cinematic Wedding Film (3–5 Mins)', 'Full Wedding Long-form Video', '60-sec Instagram Reels Output', 'Metal Finish Portrait Frame (12x18)']
  },
  {
    id: 'p-hindu-c',
    name: 'Hindu Wedding — Plan C (VIP Luxury Drone & Multi-Cam Cinema)',
    type: 'wedding_package',
    religion: 'hindu',
    planCode: 'C',
    badge: 'VIP Ultra Luxury',
    tagline: 'Complete 360° Royal Wedding Cinema with 4K Drone Aerials, Live Mixing & Candid Masterclass.',
    price: '₹90,000/-',
    heroImage: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=85',
    photoInclusions: ['2 Senior Candid Photographers', '2 Cinematic Videographers (Sony FX3 Cinema Line)', '1 Traditional Photographer & 1 Videographer', 'Licensed 4K Drone Aerial Cinematography', 'Live Streaming Setup for NRI Relatives'],
    deliverablesInclusions: ['3 Ultra-HD Velvet Matte Albums', 'Full Cinematic Documentary Wedding Film', '3 Viral Instagram Reels with Sound Design', '2 Mini Pocket Albums for Parents', '20x30 Canvas Wall Art Frame', 'Raw Footage in 1TB External Hard Drive']
  },
  {
    id: 'p-christian-a',
    name: 'Christian Wedding — Plan A (Church Matrimony & Reception)',
    type: 'wedding_package',
    religion: 'christian',
    planCode: 'A',
    badge: 'Traditional Package',
    tagline: 'Holy Matrimony Nuptial Mass & Reception Evening Coverage.',
    price: '₹45,000/-',
    heroImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
    photoInclusions: ['1 Traditional Photographer', '1 Traditional Videographer', 'Church Ceremony & Choir Audio Capture'],
    deliverablesInclusions: ['Premium Photo Album (35 Sheets)', 'Full HD Video on Pen Drive', 'Highlight Teaser Video']
  },
  {
    id: 'p-christian-b',
    name: 'Christian Wedding — Plan B (Candid Matrimony & 4K Cinema)',
    type: 'wedding_package',
    religion: 'christian',
    planCode: 'B',
    badge: 'Most Popular',
    tagline: 'Bridal Preparation, Church Nuptial Vows & Grand Ballroom Reception.',
    price: '₹65,000/-',
    heroImage: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=85',
    photoInclusions: ['1 Candid Photographer', '1 Cinematic Videographer', '1 Traditional Photographer & Videographer', 'Bridal Prep & Gown Session'],
    deliverablesInclusions: ['2 Premium Hardbound Albums', '4K Cinematic Wedding Film', 'Social Media Reel Teasers', 'Large Wall Frame']
  },
  {
    id: 'p-christian-c',
    name: 'Christian Wedding — Plan C (Royal Matrimony & Grand Reception VIP)',
    type: 'wedding_package',
    religion: 'christian',
    planCode: 'C',
    badge: 'VIP Ultra Luxury',
    tagline: 'Complete Royal Church & Grand Gala Coverage with 4K Drone Aerials.',
    price: '₹90,000/-',
    heroImage: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=85',
    photoInclusions: ['2 Candid Photographers', '2 Cinematic Videographers', 'Drone Aerials', 'Traditional Crew & Live Broadcast'],
    deliverablesInclusions: ['3 Luxury Albums', 'Full Cinematic Film', 'Viral Reels', 'Parent Mini Books', 'Complete Raw Drive']
  },
  {
    id: 'p-muslim-a',
    name: 'Muslim Wedding — Plan A (Nikah Traditional Coverage)',
    type: 'wedding_package',
    religion: 'muslim',
    planCode: 'A',
    badge: 'Traditional Package',
    tagline: 'Sacred Nikah Ceremony & Groom Reception Coverage.',
    price: '₹45,000/-',
    heroImage: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=85',
    photoInclusions: ['1 Traditional Photographer', '1 Traditional Videographer', 'Nikah & Stage Coverage'],
    deliverablesInclusions: ['Premium Photo Album (35 Sheets)', 'Full HD Video on Pen Drive', 'Teaser Reel']
  },
  {
    id: 'p-muslim-b',
    name: 'Muslim Wedding — Plan B (Nikah & Walima Candid Cinema)',
    type: 'wedding_package',
    religion: 'muslim',
    planCode: 'B',
    badge: 'Most Popular',
    tagline: 'Mehendi, Sacred Nikah & Grand Walima Reception with 4K Cinematography.',
    price: '₹65,000/-',
    heroImage: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1200&q=85',
    photoInclusions: ['1 Candid Photographer', '1 Cinematic Videographer', '1 Traditional Photographer & Videographer', 'Separate Ladies Hall Coverage if requested'],
    deliverablesInclusions: ['2 Premium Albums', '4K Cinematic Film', 'Instagram Reels', 'Wall Portrait Frame']
  },
  {
    id: 'p-muslim-c',
    name: 'Muslim Wedding — Plan C (Grand Royal Nikah & Walima VIP)',
    type: 'wedding_package',
    religion: 'muslim',
    planCode: 'C',
    badge: 'VIP Ultra Luxury',
    tagline: 'All Rituals, Groom Baraat, Sacred Nikah, Walima Reception & 4K Drone Aerials.',
    price: '₹90,000/-',
    heroImage: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=85',
    photoInclusions: ['2 Candid Photographers', '2 Cinematic Videographers', 'Licensed Drone Aerials', 'Traditional Team & Live Streaming'],
    deliverablesInclusions: ['3 Luxury Albums', 'Full Cinematic Wedding Film', 'Viral Reels', 'Mini Albums', 'Complete Raw Drive']
  }
]

async function findStudiozItem(rawSlug: string): Promise<{ item: StudiozItemDetail | null; allItems: StudiozItemDetail[] }> {
  // Fetch from DB
  const [dbPackages, dbServices] = await Promise.all([
    getWeddingPackages().catch(() => []),
    getStudiozServices().catch(() => [])
  ])

  const mappedDbPackages: StudiozItemDetail[] = dbPackages.map((wp) => ({
    id: wp.id,
    name: wp.plan_name,
    type: 'wedding_package',
    religion: wp.religion,
    planCode: wp.plan_code,
    badge: wp.badge || (wp.is_popular ? 'Most Popular' : wp.is_ultra ? 'VIP Ultra' : undefined),
    tagline: wp.tagline || '',
    price: wp.price,
    heroImage: wp.hero_image_url || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
    photoInclusions: wp.photo_video_inclusions || [],
    deliverablesInclusions: wp.deliverables_inclusions || [],
    galleryUrls: wp.gallery_urls || []
  }))

  const mappedDbServices: StudiozItemDetail[] = dbServices.map((s) => ({
    id: s.id,
    name: s.name,
    type: 'service',
    badge: s.label || undefined,
    tagline: s.description || '',
    price: s.price || 'Custom Quote',
    heroImage: s.hero_image_url || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
    photoInclusions: s.cover_points || [],
    deliverablesInclusions: [],
    galleryUrls: s.gallery_urls || []
  }))

  const allItems: StudiozItemDetail[] = [
    ...mappedDbPackages,
    ...mappedDbServices,
    ...FALLBACK_WEDDING_ITEMS
  ]

  const cleanSlug = decodeURIComponent(rawSlug).toLowerCase().trim()

  const match = allItems.find((it) => {
    const itId = (it.id || '').toLowerCase()
    const itSlug = slugify(it.name)

    return (
      itId === cleanSlug ||
      itSlug === cleanSlug ||
      cleanSlug.includes(itId) ||
      cleanSlug.includes(itSlug) ||
      itSlug.includes(cleanSlug)
    )
  })

  return { item: match || null, allItems }
}

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const { item } = await findStudiozItem(resolvedParams.slug)

  if (!item) {
    return {
      title: 'Studioz Package Not Found | KR Studioz',
      robots: { index: false, follow: false }
    }
  }

  const title = `${item.name} (${item.price}) | KR Studioz Wedding Films`
  const description = item.tagline
    ? `${item.name} — ${item.tagline.slice(0, 140)}...`
    : `Book ${item.name} at KR Studioz with 4K Sony Alpha cinematography and drone aerials.`

  const url = `https://karthicktamilan.com/studioz/${resolvedParams.slug}`

  return {
    title,
    description,
    keywords: [
      item.name,
      'KR Studioz',
      'Wedding Cinematography Tamil Nadu',
      'Thiruvarur Wedding Photography',
      'Candid Wedding Photographer',
      'Drone Wedding Shoots',
      '4K Wedding Cinema'
    ],
    openGraph: {
      title,
      description,
      url,
      siteName: 'KR Studioz Wedding Films',
      images: [
        {
          url: item.heroImage || '/kr-logo.png',
          width: 1200,
          height: 630,
          alt: item.name,
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [item.heroImage || '/kr-logo.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: url,
    }
  }
}

export default async function StudiozPackageSlugPage({ params }: PageProps) {
  const resolvedParams = await params
  const { item, allItems } = await findStudiozItem(resolvedParams.slug)

  if (!item) {
    notFound()
  }

  const related = allItems.filter((i) => i.id !== item.id)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: item.name,
    description: item.tagline,
    provider: {
      '@type': 'LocalBusiness',
      name: 'KR Studioz',
      telephone: '+919944747775',
      founder: 'Rajitha & Karthick Tamilan',
      url: 'https://karthicktamilan.com/studioz',
      image: item.heroImage || 'https://karthicktamilan.com/kr-logo.png'
    },
    offers: {
      '@type': 'Offer',
      price: (item.price || '65000').replace(/[^0-9]/g, '') || '65000',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
    areaServed: 'Tamil Nadu, South India'
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StudiozPackageDetailClient item={item} relatedItems={related} />
    </>
  )
}
