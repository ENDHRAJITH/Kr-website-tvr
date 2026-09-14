'use client'

import { useEffect, useState } from 'react'

interface VideoPlayerModalProps {
  videoUrl: string | null
  title?: string
  onClose: () => void
}

export default function VideoPlayerModal({ videoUrl, title, onClose }: VideoPlayerModalProps) {
  const [embedType, setEmbedType] = useState<'youtube' | 'instagram' | 'direct' | 'unknown'>('unknown')
  const [embedSrc, setEmbedSrc] = useState<string>('')

  useEffect(() => {
    if (!videoUrl) return

    const trimmed = videoUrl.trim()

    // 1. YouTube check
    const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)
    if (ytMatch && ytMatch[1]) {
      setEmbedType('youtube')
      setEmbedSrc(`https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0`)
      return
    }

    // 2. Instagram Reel / Post check
    const instaMatch = trimmed.match(/instagram\.com\/(?:p|reel|reels)\/([^/?#&]+)/)
    if (instaMatch && instaMatch[1]) {
      setEmbedType('instagram')
      setEmbedSrc(`https://www.instagram.com/p/${instaMatch[1]}/embed/captioned/`)
      return
    }

    // 3. Direct video check (MP4, WebM, Cloudinary, etc.)
    if (trimmed.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) || trimmed.includes('cloudinary.com') || trimmed.includes('res.cloudinary.com')) {
      setEmbedType('direct')
      setEmbedSrc(trimmed)
      return
    }

    // Fallback direct
    setEmbedType('direct')
    setEmbedSrc(trimmed)
  }, [videoUrl])

  if (!videoUrl) return null

  return (
    <div
      className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#050505] border border-white/15 rounded-lg overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-black/50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F97316] animate-pulse" />
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white truncate max-w-[260px] sm:max-w-md">
              {title || 'KR Studioz Video'}
            </h4>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#F97316] text-white flex items-center justify-center text-lg font-bold transition cursor-pointer"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Video Container */}
        <div className="relative w-full bg-black flex items-center justify-center min-h-[300px] sm:min-h-[480px] max-h-[82vh]">
          {embedType === 'youtube' && (
            <div className="relative w-full aspect-video">
              <iframe
                src={embedSrc}
                title={title || 'YouTube Video'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full border-0"
              />
            </div>
          )}

          {embedType === 'instagram' && (
            <div className="w-full flex justify-center py-4 max-h-[75vh] overflow-y-auto">
              <iframe
                src={embedSrc}
                title={title || 'Instagram Video'}
                className="w-full max-w-[400px] min-h-[480px] sm:min-h-[560px] border-0 rounded-md bg-white"
              />
            </div>
          )}

          {embedType === 'direct' && (
            <video
              src={embedSrc}
              controls
              autoPlay
              playsInline
              className="w-full max-h-[78vh] object-contain"
            >
              Your browser does not support HTML5 video.
            </video>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-white/10 bg-black/60 flex items-center justify-between text-[11px] text-white/50">
          <span>KR Digital Marketing &amp; Studioz</span>
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#F97316] font-bold hover:underline"
          >
            Open Original Link ↗
          </a>
        </div>
      </div>
    </div>
  )
}
