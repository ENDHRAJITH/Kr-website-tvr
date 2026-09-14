import { getPortfolioItems } from "@/lib/queries/portfolio";
import PortfolioView from "@/components/public/PortfolioView";

export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function PortfolioPage() {
  const items = await getPortfolioItems();
  return <PortfolioView initialItems={items} />;
}

