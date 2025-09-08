export interface VideoGenerationRequest {
  prompt: string
  style?: string
  aspectRatio?: string
  motionIntensity?: string
}

export interface VideoGenerationResponse {
  success: boolean
  videoUrl?: string
  jobId?: string
  status?: string
  message?: string
  error?: string
  metadata?: {
    prompt: string
    style: string
    aspectRatio: string
    duration: string
    quality: string
    generatedAt: string
  }
}

export class VideoAPIClient {
  private baseUrl: string

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl
  }

  async generateVideo(request: VideoGenerationRequest): Promise<VideoGenerationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/generate-video`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || `HTTP ${response.status}: ${response.statusText}`)
      }

      // Check if response is video content or JSON
      const contentType = response.headers.get('content-type') || ''
      
      if (contentType.includes('video/')) {
        // Direct video response
        const videoBlob = await response.blob()
        const videoUrl = URL.createObjectURL(videoBlob)
        
        return {
          success: true,
          videoUrl,
          message: 'Video generated successfully!'
        }
      } else {
        // JSON response
        const result = await response.json()
        return result
      }

    } catch (error: any) {
      console.error('Video API Error:', error)
      
      return {
        success: false,
        error: error.message || 'An unexpected error occurred',
        message: 'Failed to generate video. Please try again.'
      }
    }
  }

  async checkHealth(): Promise<{ status: string; service: string; model: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/generate-video`, {
        method: 'GET'
      })

      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Health check error:', error)
      throw error
    }
  }
}

export const videoAPI = new VideoAPIClient()