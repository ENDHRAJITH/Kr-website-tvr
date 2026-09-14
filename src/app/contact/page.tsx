import { Metadata } from 'next'
import ContactView from '@/components/public/ContactView'

export const metadata: Metadata = {
  title: 'Contact Us | KR Digital Marketing & Studioz',
  description: 'Get in touch with KR Digital Marketing & Studioz. Book wedding photography, pre-wedding shoots, branding, Google Ads, and digital marketing services.',
}

export default function ContactPage() {
  return <ContactView />
}
