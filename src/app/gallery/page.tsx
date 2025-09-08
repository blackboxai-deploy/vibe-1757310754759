'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface GeneratedVideo {
  id: string
  prompt: string
  videoUrl: string
  metadata: {
    style: string
    aspectRatio: string
    duration: string
    quality: string
    generatedAt: string
  }
}

export default function GalleryPage() {
  const [videos, setVideos] = useState<GeneratedVideo[]>([])
  const [filteredVideos, setFilteredVideos] = useState<GeneratedVideo[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadVideosFromHistory()
  }, [])

  useEffect(() => {
    filterVideos()
  }, [videos, searchQuery, selectedStyle])

  const loadVideosFromHistory = () => {
    try {
      const existingHistory = localStorage.getItem('videoHistory')
      if (existingHistory) {
        const history: GeneratedVideo[] = JSON.parse(existingHistory)
        setVideos(history)
      }
    } catch (error) {
      console.error('Failed to load video history:', error)
    }
    setIsLoading(false)
  }

  const filterVideos = () => {
    let filtered = videos

    if (searchQuery) {
      filtered = filtered.filter(video =>
        video.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.metadata.style.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedStyle) {
      filtered = filtered.filter(video =>
        video.metadata.style === selectedStyle
      )
    }

    setFilteredVideos(filtered)
  }

  const downloadVideo = async (videoUrl: string, filename: string) => {
    try {
      const response = await fetch(videoUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const deleteVideo = (videoId: string) => {
    try {
      const updatedVideos = videos.filter(video => video.id !== videoId)
      setVideos(updatedVideos)
      localStorage.setItem('videoHistory', JSON.stringify(updatedVideos))
    } catch (error) {
      console.error('Failed to delete video:', error)
    }
  }

  const clearAllVideos = () => {
    setVideos([])
    localStorage.removeItem('videoHistory')
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch {
      return 'Unknown date'
    }
  }

  const uniqueStyles = Array.from(new Set(videos.map(video => video.metadata.style)))

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Loading your video gallery...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">VideoAI Generator</h1>
            </Link>
            <nav className="flex items-center space-x-4">
              <Link href="/generate" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                Generate
              </Link>
              <Link href="/" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                Home
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Your Video Gallery
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Browse and manage your generated 4K videos
            </p>
          </div>

          {videos.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-slate-400 dark:bg-slate-500 rounded"></div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                No Videos Yet
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-md mx-auto">
                You haven't generated any videos yet. Start creating amazing 4K videos from your text descriptions.
              </p>
              <Button asChild size="lg">
                <Link href="/generate">Generate Your First Video</Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Filters and Search */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex-1">
                  <Input
                    placeholder="Search videos by description or style..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedStyle === null ? "default" : "outline"}
                    onClick={() => setSelectedStyle(null)}
                    size="sm"
                  >
                    All Styles
                  </Button>
                  {uniqueStyles.map((style) => (
                    <Button
                      key={style}
                      variant={selectedStyle === style ? "default" : "outline"}
                      onClick={() => setSelectedStyle(style)}
                      size="sm"
                      className="capitalize"
                    >
                      {style}
                    </Button>
                  ))}
                </div>
                {videos.length > 0 && (
                  <Button
                    variant="destructive"
                    onClick={clearAllVideos}
                    size="sm"
                  >
                    Clear All
                  </Button>
                )}
              </div>

              {/* Gallery Stats */}
              <div className="flex flex-wrap gap-4 mb-8">
                <Badge variant="outline" className="px-3 py-1">
                  {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''} found
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  {videos.length} total generated
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  All in 4K Ultra HD
                </Badge>
              </div>

              {filteredVideos.length === 0 && (searchQuery || selectedStyle) ? (
                <Alert>
                  <AlertDescription>
                    No videos match your current filters. Try adjusting your search or clearing the filters.
                  </AlertDescription>
                </Alert>
              ) : (
                /* Video Grid */
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredVideos.map((video) => (
                    <Card key={video.id} className="group hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-slate-700">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge 
                            variant="secondary" 
                            className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 capitalize"
                          >
                            {video.metadata.style}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {video.metadata.quality}
                          </Badge>
                        </div>
                        <CardTitle className="text-sm line-clamp-2 text-slate-900 dark:text-white">
                          {video.prompt}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {formatDate(video.metadata.generatedAt)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
                          <video
                            src={video.videoUrl}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            preload="metadata"
                            muted
                            onMouseEnter={(e) => {
                              const video = e.target as HTMLVideoElement
                              video.play()
                            }}
                            onMouseLeave={(e) => {
                              const video = e.target as HTMLVideoElement
                              video.pause()
                              video.currentTime = 0
                            }}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                          <div>
                            <span className="font-medium">Duration:</span>
                            <br />
                            {video.metadata.duration}
                          </div>
                          <div>
                            <span className="font-medium">Ratio:</span>
                            <br />
                            {video.metadata.aspectRatio}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="flex-1 text-xs"
                            onClick={() => downloadVideo(video.videoUrl, `video-${video.id}.mp4`)}
                          >
                            Download
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-xs"
                            onClick={() => deleteVideo(video.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Load More / Pagination could go here if needed */}
              {filteredVideos.length > 0 && (
                <div className="text-center mt-12">
                  <Button asChild variant="outline" size="lg">
                    <Link href="/generate">Generate More Videos</Link>
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}