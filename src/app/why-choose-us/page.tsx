import { Metadata } from 'next'
import WhyChooseUsView from '@/components/public/WhyChooseUsView'
import { getWhyChooseUsData } from '@/lib/queries/whyChooseUs'

export const revalidate = 0
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Why Choose Us | Karthick Tamilan Digital Marketing & Studioz',
  description: 'Discover why top brands and real estate developers trust Karthick Tamilan for high-impact drone video promotions, targeted lead generation, and business revenue growth.',
}

export default async function WhyChooseUsPage() {
  const dynamicData = await getWhyChooseUsData()

  return <WhyChooseUsView initialData={dynamicData || undefined} />
}
