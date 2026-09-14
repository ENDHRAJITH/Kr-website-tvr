import { getTeamMembers } from "@/lib/queries/team";
import { getTestimonials } from "@/lib/queries/testimonials";
import { getSiteStats } from "@/lib/queries/siteStats";
import AboutView from "@/components/public/AboutView";

export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function AboutPage() {
  const [teamMembers, testimonials, stats] = await Promise.all([
    getTeamMembers(),
    getTestimonials(),
    getSiteStats(),
  ]);

  return (
    <AboutView
      initialTeamMembers={teamMembers}
      initialTestimonials={testimonials}
      initialStats={stats}
    />
  );
}

