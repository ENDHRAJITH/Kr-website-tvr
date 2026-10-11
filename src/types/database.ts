export type ServiceCategory = {
  id: string;
  division: 'studioz' | 'marketing';
  name: string;
  slug: string;
  display_order: number;
};

export type StudiozService = {
  id: string;
  service_no: number | null;
  name: string;
  category_id: string | null;
  label: string | null;
  price: string | null;
  description: string | null;
  icon: string | null;
  hero_image_url: string | null;
  cover_points: string[] | null;
  gallery_urls: string[] | null;
  display_order: number;
  is_active: boolean;
};

export type MarketingService = {
  id: string;
  service_no: number | null;
  name: string;
  subtitle: string | null;
  description: string | null;
  price: string | null;
  price_unit: string | null;
  features: string[] | null;
  benefits: string[] | null;
  project_tag: string | null;
  category_id: string | null;
  links: Record<string, string> | null;
  display_order: number;
  is_active: boolean;
};

export type PortfolioItem = {
  id: string;
  title: string;
  category: 'studioz' | 'digital';
  cover_image_url: string | null;
  gallery_urls: string[] | null;
  description: string | null;
  display_order: number;
  is_active: boolean;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string | null;
  photo_url: string | null;
  bio: string | null;
  social_links: Record<string, string> | null;
  display_order: number;
};

export type Testimonial = {
  id: string;
  name: string;
  text: string;
  rating: number | null;
  photo_url: string | null;
  is_active: boolean;
  display_order: number;
};

export type ClientLogo = {
  id: string;
  name: string;
  logo_url: string;
  link: string | null;
  display_order: number;
  is_active: boolean;
};

export type SiteStat = {
  id: string;
  label: string;
  value: string;
  icon: string | null;
  display_order: number;
};

export type Enquiry = {
  id: string;
  name: string;
  phone: string;
  event_type: string | null;
  message: string | null;
  status: 'new' | 'contacted' | 'closed';
  created_at: string;
};

export type EnquiryItem = {
  id: string;
  enquiry_id: string;
  service_division: 'studioz' | 'marketing';
  service_id: string;
  service_name: string;
};

export type FounderDeck = {
  id: string;
  founder_name: string;
  founder_role: string;
  division: 'studioz' | 'marketing';
  avatar_url?: string;
  pdf_url?: string;
  slides?: string[];
  bio?: string;
  youtube_url?: string;
  instagram_url?: string;
  facebook_url?: string;
  whatsapp_url?: string;
  linkedin_url?: string;
  social_links?: Record<string, string>;
  display_order?: number;
};

export type WeddingPackage = {
  id: string;
  religion: 'hindu' | 'christian' | 'muslim' | string;
  plan_code: 'A' | 'B' | 'C' | string;
  plan_name: string;
  tagline: string | null;
  badge: string | null;
  price: string;
  hero_image_url: string | null;
  photo_video_inclusions: string[] | null;
  deliverables_inclusions: string[] | null;
  gallery_urls?: string[] | null;
  is_popular: boolean;
  is_ultra: boolean;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type WhyChooseUsData = {
  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
    stats: Array<{ value: string; label: string }>;
  };
  bniLeadership: {
    badge: string;
    chapterName: string;
    leaderName: string;
    role: string;
    subtitle: string;
    description: string;
    photoUrl: string;
    highlights: Array<{ title: string; description: string }>;
    whyItMatters: string;
  };
  analytics: {
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
    overview: {
      contentViews: string;
      viewsGrowth: string;
      nonFollowersRatio: string;
      followersRatio: string;
      uniqueViewers: string;
      reelsPlays: string;
      postImpressions: string;
      monthlyGrowth: string;
    };
    age: {
      headline: string;
      description: string;
      decisionMakersPercent: string;
      decisionMakersNote: string;
      ranges: Array<{ label: string; pct: string; color?: string }>;
    };
    locations: {
      countries: Array<{ name: string; flag: string; pct: string; highlight?: boolean }>;
      cities: Array<{ name: string; icon: string; pct: string; highlight?: boolean }>;
      nriFunnelsNote: string;
      deltaMonopolyNote: string;
    };
    proofScreenshots: Array<{ title: string; subtitle: string; imageUrl: string }>;
  };
  growthScenarios: Array<{
    number: string;
    title: string;
    description: string;
    tags: string[];
  }>;
};



