export type MediaType = 'image' | 'youtube' | 'instagram' | 'video_file'

export function getMediaType(url: string): MediaType {
  if (!url) return 'image'
  const lower = url.toLowerCase()
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'youtube'
  if (lower.includes('instagram.com/reel') || lower.includes('instagram.com/p')) return 'instagram'
  if (
    lower.endsWith('.mp4') ||
    lower.endsWith('.webm') ||
    lower.endsWith('.mov') ||
    lower.endsWith('.m4v') ||
    lower.includes('/videos/') ||
    lower.startsWith('data:video/')
  ) {
    return 'video_file'
  }
  return 'image'
}

export function isVideoUrl(url: string): boolean {
  const type = getMediaType(url)
  return type === 'youtube' || type === 'instagram' || type === 'video_file'
}

export function getYouTubeEmbedUrl(url: string): string {
  try {
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0]
      return `https://www.youtube.com/embed/${id}?autoplay=1`
    }
    if (url.includes('youtube.com/watch')) {
      const u = new URL(url)
      const v = u.searchParams.get('v')
      return `https://www.youtube.com/embed/${v}?autoplay=1`
    }
    if (url.includes('youtube.com/embed/')) {
      return url
    }
  } catch (e) {
    // fallback
  }
  return url
}

export function getInstagramEmbedUrl(url: string): string {
  try {
    const cleanUrl = url.split('?')[0].replace(/\/+$/, '')
    return `${cleanUrl}/embed`
  } catch (e) {
    return url
  }
}
