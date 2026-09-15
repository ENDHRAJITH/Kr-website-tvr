import { getMarketingServices } from '@/lib/queries/marketingServices'
import { getCategories } from '@/lib/queries/categories'
import DigitalMarketingView from '@/components/public/DigitalMarketingView'

export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function DigitalMarketingPage() {
  const [services, categories] = await Promise.all([
    getMarketingServices().catch(() => []),
    getCategories('marketing').catch(() => []),
  ])

  return (
    <DigitalMarketingView
      initialServices={services}
      categories={categories}
    />
  )
}
