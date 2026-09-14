import { createClient } from '@/lib/supabase/server'
import { Testimonial } from '@/types/database'

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_active', true)
    .order('display_order')
  return (data as Testimonial[]) ?? []
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('testimonials')
    .select('*')
    .order('display_order')
  return (data as Testimonial[]) ?? []
}

export async function getTestimonialById(id: string): Promise<Testimonial | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('testimonials')
    .select('*')
    .eq('id', id)
    .single()
  return (data as Testimonial) ?? null
}
