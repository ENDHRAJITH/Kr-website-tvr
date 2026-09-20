import { Metadata } from 'next'
import WhyChooseUsView from '@/components/public/WhyChooseUsView'

export const metadata: Metadata = {
  title: 'Why Choose Us | Karthick Tamilan Digital Marketing & Studioz',
  description: 'Discover why top brands and real estate developers trust Karthick Tamilan for high-impact drone video promotions, targeted lead generation, and business revenue growth.',
}

export default function WhyChooseUsPage() {
  return <WhyChooseUsView />
}
