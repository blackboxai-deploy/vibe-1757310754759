export interface GeneratedVideo {
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

export interface VideoHistory {
  videos: GeneratedVideo[]
  totalCount: number
  lastUpdated: string
}

// Local storage key for video history
const VIDEO_HISTORY_KEY = 'videoHistory'

/**
 * Save a video to local storage history
 */
export function saveVideoToHistory(video: GeneratedVideo): void {
  try {
    const existingHistory = getVideoHistory()
    const updatedVideos = [video, ...existingHistory.videos.slice(0, 19)] // Keep last 20 videos
    
    const newHistory: VideoHistory = {
      videos: updatedVideos,
      totalCount: updatedVideos.length,
      lastUpdated: new Date().toISOString()
    }
    
    localStorage.setItem(VIDEO_HISTORY_KEY, JSON.stringify(newHistory))
  } catch (error) {
    console.error('Failed to save video to history:', error)
    throw new Error('Unable to save video to history')
  }
}

/**
 * Get video history from local storage
 */
export function getVideoHistory(): VideoHistory {
  try {
    const stored = localStorage.getItem(VIDEO_HISTORY_KEY)
    
    if (!stored) {
      return {
        videos: [],
        totalCount: 0,
        lastUpdated: new Date().toISOString()
      }
    }

    // Handle legacy format (direct array)
    const parsed = JSON.parse(stored)
    if (Array.isArray(parsed)) {
      return {
        videos: parsed,
        totalCount: parsed.length,
        lastUpdated: new Date().toISOString()
      }
    }

    return parsed
  } catch (error) {
    console.error('Failed to load video history:', error)
    return {
      videos: [],
      totalCount: 0,
      lastUpdated: new Date().toISOString()
    }
  }
}

/**
 * Delete a video from history
 */
export function deleteVideoFromHistory(videoId: string): boolean {
  try {
    const history = getVideoHistory()
    const updatedVideos = history.videos.filter(video => video.id !== videoId)
    
    const newHistory: VideoHistory = {
      videos: updatedVideos,
      totalCount: updatedVideos.length,
      lastUpdated: new Date().toISOString()
    }
    
    localStorage.setItem(VIDEO_HISTORY_KEY, JSON.stringify(newHistory))
    return true
  } catch (error) {
    console.error('Failed to delete video from history:', error)
    return false
  }
}

/**
 * Clear all video history
 */
export function clearVideoHistory(): void {
  try {
    localStorage.removeItem(VIDEO_HISTORY_KEY)
  } catch (error) {
    console.error('Failed to clear video history:', error)
    throw new Error('Unable to clear video history')
  }
}

/**
 * Download a video file
 */
export async function downloadVideo(videoUrl: string, filename: string): Promise<void> {
  try {
    const response = await fetch(videoUrl)
    
    if (!response.ok) {
      throw new Error(`Download failed: ${response.status} ${response.statusText}`)
    }
    
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.style.display = 'none'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Clean up the object URL
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Download failed:', error)
    throw new Error('Unable to download video')
  }
}

/**
 * Get video file size
 */
export async function getVideoSize(videoUrl: string): Promise<number> {
  try {
    const response = await fetch(videoUrl, { method: 'HEAD' })
    const contentLength = response.headers.get('content-length')
    return contentLength ? parseInt(contentLength, 10) : 0
  } catch (error) {
    console.error('Failed to get video size:', error)
    return 0
  }
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  } catch {
    return 'Unknown date'
  }
}

/**
 * Generate video filename with metadata
 */
export function generateVideoFilename(video: GeneratedVideo): string {
  const date = new Date(video.metadata.generatedAt)
  const dateStr = date.toISOString().split('T')[0] // YYYY-MM-DD
  const timeStr = date.toTimeString().split(' ')[0].replace(/:/g, '-') // HH-MM-SS
  const style = video.metadata.style.toLowerCase()
  
  return `video-${style}-${dateStr}-${timeStr}.mp4`
}

/**
 * Validate video URL
 */
export function isValidVideoUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:' || urlObj.protocol === 'blob:'
  } catch {
    return false
  }
}

/**
 * Get video statistics from history
 */
export function getVideoStats(): {
  totalVideos: number
  styleBreakdown: Record<string, number>
  aspectRatioBreakdown: Record<string, number>
  recentActivity: GeneratedVideo[]
} {
  const history = getVideoHistory()
  
  const styleBreakdown: Record<string, number> = {}
  const aspectRatioBreakdown: Record<string, number> = {}
  
  history.videos.forEach(video => {
    const style = video.metadata.style
    const aspectRatio = video.metadata.aspectRatio
    
    styleBreakdown[style] = (styleBreakdown[style] || 0) + 1
    aspectRatioBreakdown[aspectRatio] = (aspectRatioBreakdown[aspectRatio] || 0) + 1
  })
  
  return {
    totalVideos: history.totalCount,
    styleBreakdown,
    aspectRatioBreakdown,
    recentActivity: history.videos.slice(0, 5) // Last 5 videos
  }
}