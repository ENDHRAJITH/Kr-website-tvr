import { Testimonial } from '@/types/database'
import { safeSupabaseQuery } from './queryHelper'

export async function getTestimonials(): Promise<Testimonial[]> {
  return safeSupabaseQuery(
    async (supabase) => {
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .order('display_order')
      return (data as Testimonial[]) ?? []
    },
    []
  )
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  return safeSupabaseQuery(
    async (supabase) => {
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .order('display_order')
      return (data as Testimonial[]) ?? []
    },
    []
  )
}

export async function getTestimonialById(id: string): Promise<Testimonial | null> {
  return safeSupabaseQuery(
    async (supabase) => {
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .eq('id', id)
        .single()
      return (data as Testimonial) ?? null
    },
    null
  )
}
