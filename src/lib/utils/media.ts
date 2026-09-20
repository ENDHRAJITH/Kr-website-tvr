export type MediaType = 'image' | 'youtube' | 'instagram' | 'video_file'

/**
 * Universally extracts the 11-character YouTube video ID from ANY YouTube URL format:
 * - Short links (youtu.be/ID)
 * - YouTube Shorts (youtube.com/shorts/ID)
 * - Standard web links (youtube.com/watch?v=ID)
 * - Mobile web links (m.youtube.com/watch?v=ID)
 * - Live streams (youtube.com/live/ID)
 * - Embed links (youtube.com/embed/ID)
 * - Raw 11-char video ID (ID)
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null
  const trimmed = url.trim()

  // If it's already an 11-character YouTube ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed
  }

  const regExp = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts|live)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i
  const match = trimmed.match(regExp)

  if (match && match[1]) {
    return match[1]
  }

  return null
}

export function getMediaType(url: string): MediaType {
  if (!url) return 'image'
  const lower = url.toLowerCase()
  if (extractYouTubeId(url) || lower.includes('youtube.com') || lower.includes('youtu.be')) return 'youtube'
  if (lower.includes('instagram.com/reel') || lower.includes('instagram.com/p') || lower.includes('instagr.am')) return 'instagram'
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
  const ytId = extractYouTubeId(url)
  if (ytId) {
    return `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0`
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
