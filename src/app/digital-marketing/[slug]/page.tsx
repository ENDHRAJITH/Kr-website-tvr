import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getMarketingServices } from '@/lib/queries/marketingServices'
import { MarketingService } from '@/types/database'
import { slugify } from '@/lib/utils/slugify'
import DigitalMarketingDetailClient from '@/components/public/DigitalMarketingDetailClient'

export const revalidate = 60
export const dynamic = 'force-dynamic'

const FALLBACK_SERVICES: MarketingService[] = [
  {
    id: 'm1',
    service_no: 1,
    name: 'Plan A — Master Reel Promotion',
    subtitle: 'Instagram, Facebook & YouTube Shorts Reel Promotion',
    description: 'Using Reels (Instagram, Facebook, or YouTube Shorts) is one of the fastest ways to build an audience and drive sales today. Promoted across Karthick Tamilan 375,000+ follower channels.',
    price: '₹25,000/-',
    price_unit: 'per campaign',
    features: ['Reel Shoot', 'Reel Edit', 'Reel Promote', 'Casting', 'Voice Over', 'Drone Photos', 'Drone Shots in Reel', 'Targeting 375k+ Followers Pages'],
    benefits: ['Fast audience growth', '100,000+ Verified Views', 'High social media engagement', 'Instant brand awareness'],
    project_tag: 'PLAN A - REEL PROMOTION',
    category_id: 'reels',
    links: { 'Instagram ↗': 'https://instagram.com/karthick_tamilan' },
    display_order: 1,
    is_active: true
  },
  {
    id: 'm2',
    service_no: 2,
    name: 'Plan B — Landscape Cinematic Ad Video',
    subtitle: 'DSLR Mirrorless Full Frame Sony Alpha Shoot',
    description: 'Landscape ads allow you to showcase the full scale, luxury, and premium feel of a property or business, making them highly effective for YouTube, Facebook feed ads, website landing pages, theater ads, and big-screen office displays.',
    price: '₹25,000/-',
    price_unit: 'per ad video',
    features: ['01 Min Ad Video (for YouTube Ads)', 'Landscape Video Shoot (DSLR Mirrorless Sony Alpha)', 'Landscape Video Edit & Color Grading', 'Landscape Video Promote', 'Professional Voice Over', 'Drone Landscape Video & Photos', 'Usable for Theater Ads & LED Vehicles'],
    benefits: ['Showcases full scale & luxury feel', '100,000+ Verified Views', 'Perfect for YouTube & Facebook feed ads', 'High-impact big screen display'],
    project_tag: 'PLAN B - CINEMATIC AD',
    category_id: 'ads',
    links: { 'YouTube Ad ↗': '#' },
    display_order: 2,
    is_active: true
  },
  {
    id: 'm3',
    service_no: 3,
    name: 'Plan C — Organic Content Reels Promotions',
    subtitle: '10 Reels Per Month (Publish Every 2 Days)',
    description: 'Organic Content Reels Promotion by Karthick Tamilan. One video published every 2 days (10 reels/month) across FB, Instagram & YouTube to scale your business revenue.',
    price: '₹50,000/-',
    price_unit: '/ month',
    features: ['10 Reels Per Month', 'Publish Every 02 Days Once', 'Full Reel Shoot & Edit', 'Multi-Platform Promotion (FB, Insta, YouTube)', 'Karthick Tamilan Organic Reach Integration'],
    benefits: ['500,000+ Organic Views', '3x Growth in Monthly Revenue', 'Consistent brand visibility', 'High customer retention'],
    project_tag: 'PLAN C - MONTHLY REELS',
    category_id: 'reels',
    links: { 'Case Study ↗': '#' },
    display_order: 3,
    is_active: true
  },
  {
    id: 'm4',
    service_no: 4,
    name: 'Plan D — Local Influencer Connects',
    subtitle: '5 Local Niche Influencer Collaborations',
    description: 'Collaborate with 5 top local niche influencers in the region to launch promotional reels and boost brand awareness among your target audience.',
    price: '₹25,000/-',
    price_unit: 'for 05 Influencers',
    features: ['05 Niche Local Influencers Collaboration', '50k to 100k Reach Per Influencer', 'Target Audience Social Media Connect', 'Campaign Strategy & Co-ordination', '10 Lakh+ Total Projected Views'],
    benefits: ['Over 10 Lakh total views', 'High local brand awareness', 'Authentic creator trust', 'Hyper-targeted audience reach'],
    project_tag: 'PLAN D - INFLUENCERS',
    category_id: 'influencer',
    links: { 'Influencers List ↗': '#' },
    display_order: 4,
    is_active: true
  },
  {
    id: 'm5',
    service_no: 5,
    name: 'Plan E — Local Social Media Pages Connect',
    subtitle: '50+ Local Instagram Pages (60KM Radius)',
    description: 'Connect with 50+ local Instagram pages targeted specifically within a 60KM radius surrounding your business location at just ₹500 per page.',
    price: '₹25,000/-',
    price_unit: '50+ Pages @ ₹500/page',
    features: ['50+ Local Influencer & Meme/News Instagram Pages', 'Targeted 60KM Surrounding Radius', 'Hyper-Local Community Promotion', 'Massive Viral Regional Reach'],
    benefits: ['Dominates local target market', 'Surrounding 60KM radius saturation', 'Budget-friendly per page promotion', 'Instant local inquiries'],
    project_tag: 'PLAN E - LOCAL PAGES',
    category_id: 'local',
    links: { 'Network ↗': '#' },
    display_order: 5,
    is_active: true
  },
  {
    id: 'm6',
    service_no: 6,
    name: 'Plan F — Paid Promotions (Meta & YouTube Ads)',
    subtitle: 'Targeted Lead Gen Ads (FB + Insta + YouTube)',
    description: 'Paid promotional ad campaigns across Facebook, Instagram, and YouTube specifically optimized to collect verified phone numbers and emails of serious buyers.',
    price: '₹15,000/-',
    price_unit: 'for First Month',
    features: ['FB Ads — ₹5,000 Budget', 'Instagram Ads — ₹5,000 Budget', 'YouTube Ads — ₹5,000 Budget', 'Targeted Lead Generation Setup', 'Hyper-Local & NRI Investor Targeting', 'Verified Phone & Email Lead Capture'],
    benefits: ['Direct lead generation', 'High-intent buyer acquisition', 'Hand-delivered sales leads', 'Full ad account optimization'],
    project_tag: 'PLAN F - PAID ADS',
    category_id: 'ads',
    links: { 'Lead Proof ↗': '#' },
    display_order: 6,
    is_active: true
  },
  {
    id: 'm7',
    service_no: 7,
    name: 'Plan G — Grand Opening Shoot Promotions',
    subtitle: 'Full Launch & Event Shoot Coverage',
    description: 'Grand opening event shoot with traditional photography, candid videography, soft copies of photos, and 1 highlight output video.',
    price: '₹25,000/-',
    price_unit: 'per launch event',
    features: ['Traditional Photography', 'Candid Videography', 'Soft Copy of All Photos', '01 Edited Video Output with Highlights', 'Social Media Launch Posters'],
    benefits: ['Complete event coverage', 'Professional highlight reel', 'Social media launch hype', 'High quality soft copies'],
    project_tag: 'PLAN G - GRAND OPENING',
    category_id: 'events',
    links: { 'Sample Shoot ↗': '#' },
    display_order: 7,
    is_active: true
  },
  {
    id: 'm8',
    service_no: 8,
    name: 'Overall Plan — 360° All-In-One Master Package',
    subtitle: 'Complete Combined Growth Package (Plan A to Plan G)',
    description: 'The ultimate 360-degree digital marketing package combining all 7 plans (Plan A through G) for total market dominance and maximum ROI.',
    price: '₹1,90,000/-',
    price_unit: 'Full Package (Total 190K)',
    features: ['Plan A: Master Reel Promotion (25K)', 'Plan B: Landscape Cinematic Ad Video (25K)', 'Plan C: 10 Organic Reels (50K)', 'Plan D: 05 Local Influencers Connect (25K)', 'Plan E: 50+ Local Pages Connect (25K)', 'Plan F: Meta & YouTube Paid Ads (15K)', 'Plan G: Grand Opening Shoot (25K)'],
    benefits: ['Complete market dominance', 'Over 1 Million+ Combined Reach', 'Full-funnel marketing strategy', 'Maximum ROI and lead conversion'],
    project_tag: 'OVERALL MASTER PLAN',
    category_id: 'master',
    links: { 'Full Roadmap ↗': '#' },
    display_order: 8,
    is_active: true
  }
]

async function findService(rawSlug: string): Promise<{ service: MarketingService | null; allServices: MarketingService[] }> {
  const dbServices = await getMarketingServices().catch(() => [])
  const allServices = dbServices.length > 0 ? dbServices : FALLBACK_SERVICES
  const cleanSlug = decodeURIComponent(rawSlug).toLowerCase().trim()

  const match = allServices.find((s) => {
    const sId = (s.id || '').toLowerCase()
    const sNameSlug = slugify(s.name)
    const sTagSlug = slugify(s.project_tag || '')

    return (
      sId === cleanSlug ||
      sNameSlug === cleanSlug ||
      sTagSlug === cleanSlug ||
      cleanSlug.includes(sId) ||
      cleanSlug.includes(sNameSlug) ||
      sNameSlug.includes(cleanSlug)
    )
  })

  return { service: match || null, allServices }
}

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const { service } = await findService(resolvedParams.slug)

  if (!service) {
    return {
      title: 'Marketing Service Not Found | KR Digital Marketing',
      robots: { index: false, follow: false }
    }
  }

  const title = `${service.name} (${service.price}) | KR Digital Marketing`
  const description = service.description
    ? service.description.slice(0, 160) + '...'
    : `Book ${service.name} with Karthick Tamilan for high-impact social media reach across 375,000+ followers.`

  const url = `https://karthicktamilan.com/digital-marketing/${resolvedParams.slug}`

  return {
    title,
    description,
    keywords: [
      service.name,
      'Karthick Tamilan',
      'KR Digital Marketing',
      'Tamil Nadu Reel Promotion',
      'Real Estate Plot Video Ads',
      'Thiruvarur Influencer Marketing',
      'Chennai Social Media Growth'
    ],
    openGraph: {
      title,
      description,
      url,
      siteName: 'KR Digital Marketing & Studioz',
      images: [
        {
          url: '/kr-logo.png',
          width: 800,
          height: 600,
          alt: service.name,
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/kr-logo.png'],
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

export default async function MarketingServiceSlugPage({ params }: PageProps) {
  const resolvedParams = await params
  const { service, allServices } = await findService(resolvedParams.slug)

  if (!service) {
    notFound()
  }

  const related = allServices.filter((s) => s.id !== service.id)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'LocalBusiness',
      name: 'KR Digital Marketing',
      telephone: '+919626759859',
      founder: 'Karthick Tamilan',
      url: 'https://karthicktamilan.com',
      image: 'https://karthicktamilan.com/kr-logo.png'
    },
    offers: {
      '@type': 'Offer',
      price: (service.price || '25000').replace(/[^0-9]/g, '') || '25000',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
    areaServed: 'Tamil Nadu, India, UAE, Singapore'
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DigitalMarketingDetailClient service={service} relatedServices={related} />
    </>
  )
}
