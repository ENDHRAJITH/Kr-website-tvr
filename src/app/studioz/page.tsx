import { getStudiozServices } from '@/lib/queries/studiozServices'
import { getCategories } from '@/lib/queries/categories'
import { getStudiozVideos } from '@/lib/queries/studiozVideos'
import StudiozView from '@/components/public/StudiozView'

export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function StudiozPage() {
  const [services, categories, studiozVideos] = await Promise.all([
    getStudiozServices().catch(() => []),
    getCategories('studioz').catch(() => []),
    getStudiozVideos().catch(() => []),
  ])

  return (
    <StudiozView
      initialServices={services}
      categories={categories}
      videoShowcases={studiozVideos.length > 0 ? studiozVideos : undefined}
    />
  )
}

