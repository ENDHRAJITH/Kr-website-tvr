import { createClient } from '@/lib/supabase/server'
import AdminDashboardOverview from '@/components/admin/AdminDashboardOverview'

export const revalidate = 0

export default async function AdminDashboardPage() {
  let newEnquiriesCount = 0
  let totalEnquiriesCount = 0
  let studiozCount = 0
  let marketingCount = 0

  try {
    const supabase = await createClient()

    const { count: newCount } = await supabase
      .from('enquiries')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new')
    newEnquiriesCount = newCount ?? 0

    const { count: totalCount } = await supabase
      .from('enquiries')
      .select('*', { count: 'exact', head: true })
    totalEnquiriesCount = totalCount ?? 0

    const { count: sCount } = await supabase
      .from('studioz_services')
      .select('*', { count: 'exact', head: true })
    studiozCount = sCount ?? 0

    const { count: mCount } = await supabase
      .from('marketing_services')
      .select('*', { count: 'exact', head: true })
    marketingCount = mCount ?? 0
  } catch (e) {
    console.error('Failed to query counts from Supabase:', e)
  }

  return (
    <AdminDashboardOverview
      newEnquiriesCount={newEnquiriesCount}
      totalEnquiriesCount={totalEnquiriesCount}
      studiozCount={studiozCount}
      marketingCount={marketingCount}
    />
  )
}

