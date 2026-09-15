import { getStudiozServices } from '@/lib/queries/studiozServices'
import { getMarketingServices } from '@/lib/queries/marketingServices'
import { getPortfolioItems } from '@/lib/queries/portfolio'
import { getClientLogos } from '@/lib/queries/clientLogos'
import { getSiteStats } from '@/lib/queries/siteStats'
import HomeView from '@/components/public/HomeView'

export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [studiozServices, marketingServices, portfolioItems, clientLogos, siteStats] =
    await Promise.all([
      getStudiozServices().catch(() => []),
      getMarketingServices().catch(() => []),
      getPortfolioItems().catch(() => []),
      getClientLogos().catch(() => []),
      getSiteStats().catch(() => []),
    ])

  return (
    <HomeView
      studiozServices={studiozServices}
      marketingServices={marketingServices}
      portfolioItems={portfolioItems}
      clientLogos={clientLogos}
      siteStats={siteStats}
    />
  )
}

