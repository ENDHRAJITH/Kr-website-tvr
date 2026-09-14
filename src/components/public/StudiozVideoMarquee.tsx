'use client'

import { useState } from 'react'
import Image from 'next/image'
import VideoPlayerModal from './VideoPlayerModal'

export interface StudiozVideoItem {
  id: string
  title: string
  thumbnail_url: string
  video_url: string
  category?: string
  duration?: string
}

interface StudiozVideoMarqueeProps {
  videos?: StudiozVideoItem[]
}

const DEFAULT_SHOWCASE_VIDEOS: StudiozVideoItem[] = [
  {
    id: 'v1',
    title: 'A Story Worth Remembering',
    category: 'Wedding Film',
    thumbnail_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '03:45'
  },
  {
    id: 'v2',
    title: 'Before The Big Day',
    category: 'Pre-Wedding Cinematic',
    thumbnail_url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=85',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '02:30'
  },
  {
    id: 'v3',
    title: 'Grand Wedding Reception',
    category: 'Reception Highlights',
    thumbnail_url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=85',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '04:12'
  },
  {
    id: 'v4',
    title: 'Joyful Baby Shower & Ceremony',
    category: 'Baby Function',
    thumbnail_url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=85',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '01:50'
  },
  {
    id: 'v5',
    title: 'Cinematic Fashion & Model Shoot',
    category: 'Model Reel',
    thumbnail_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '02:15'
  },
  {
    id: 'v6',
    title: 'Live Event Broadcast Showcase',
    category: 'Live Broadcast',
    thumbnail_url: 'https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?auto=format&fit=crop&w=1200&q=85',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '05:00'
  }
]

export default function StudiozVideoMarquee({ videos }: StudiozVideoMarqueeProps) {
  const [selectedVideo, setSelectedVideo] = useState<StudiozVideoItem | null>(null)

  const items = videos && videos.length > 0 ? videos : DEFAULT_SHOWCASE_VIDEOS
  // Duplicate array to achieve seamless infinite marquee loop
  const marqueeList = [...items, ...items, ...items]

  return (
    <div className="w-full py-4 overflow-hidden">
      {/* Header Info */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F97316] animate-ping" />
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#F97316]">
            Featured Cinema Reels &amp; Highlights
          </span>
        </div>
        <span className="hidden sm:inline-block text-[10px] uppercase tracking-[0.2em] text-black/50 font-bold">
          Tap any video to play • Auto Scroll
        </span>
      </div>

      {/* Auto Moving Marquee Container */}
      <div className="relative w-full overflow-hidden group">
        <div className="flex gap-5 sm:gap-7 animate-[marquee_40s_linear_infinite] group-hover:[animation-play-state:paused] active:[animation-play-state:paused] w-max py-2">
          {marqueeList.map((item, index) => (
            <article
              key={`${item.id}-${index}`}
              onClick={() => setSelectedVideo(item)}
              className="relative w-[280px] sm:w-[440px] md:w-[500px] lg:w-[560px] h-[200px] sm:h-[300px] md:h-[340px] lg:h-[370px] bg-zinc-900 border-2 border-black/10 hover:border-[#F97316] rounded-xl overflow-hidden shrink-0 cursor-pointer group/card transition-all duration-500 hover:scale-[1.02] shadow-lg hover:shadow-[0_15px_35px_rgba(249,115,22,0.25)]"
            >
              {/* Thumbnail Image */}
              {item.thumbnail_url ? (
                <Image
                  src={item.thumbnail_url}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover/card:scale-105"
                  sizes="(max-width: 640px) 280px, (max-width: 768px) 440px, 560px"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-white/30 font-bold">
                  KR Studioz Video
                </div>
              )}

              {/* Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/20 group-hover/card:via-black/10 transition-colors" />

              {/* Top Category Badge & Duration */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <span className="px-3.5 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-[#F97316] text-white rounded-md shadow-md">
                  {item.category || 'Studioz Reel'}
                </span>
                {item.duration && (
                  <span className="px-3 py-1 text-[10px] sm:text-xs font-bold bg-black/70 backdrop-blur-md border border-white/20 text-white rounded-md">
                    {item.duration}
                  </span>
                )}
              </div>

              {/* Large Center Animated Play Button */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-[#F97316] text-white flex items-center justify-center pl-1 shadow-2xl group-hover/card:scale-110 group-hover/card:bg-white group-hover/card:text-[#F97316] transition-all duration-300">
                  <svg className="w-7 h-7 sm:w-10 sm:h-10 fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {/* Bottom Video Title & Call to Action */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-10 text-white">
                <h3 className="font-display text-lg sm:text-2xl md:text-3xl font-bold uppercase leading-tight line-clamp-1 drop-shadow-md group-hover/card:text-[#F97316] transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#F97316]" />
                  <p className="text-xs sm:text-sm text-white/80 font-bold uppercase tracking-wider">
                    Click to Watch Video ↗
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Video Player Lightbox Modal */}
      {selectedVideo && (
        <VideoPlayerModal
          videoUrl={selectedVideo.video_url}
          title={selectedVideo.title}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  )
}
