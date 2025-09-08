'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('cinematic')
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [motionIntensity, setMotionIntensity] = useState('medium')
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [generatedVideo, setGeneratedVideo] = useState<GeneratedVideo | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const promptSuggestions = [
    "A majestic eagle soaring over snow-capped mountains at golden hour",
    "Underwater coral reef with colorful tropical fish swimming gracefully",
    "Time-lapse of a bustling city street with flowing traffic at night",
    "A serene forest path with sunbeams filtering through tall trees",
    "Abstract geometric shapes morphing and flowing in vibrant colors",
    "A cozy coffee shop interior with steam rising from a warm cup",
    "Northern lights dancing across a starry arctic sky",
    "A field of sunflowers swaying gently in the summer breeze"
  ]

  const handleGenerateVideo = async () => {
    if (!prompt.trim()) {
      setError('Please enter a video description')
      return
    }

    setIsGenerating(true)
    setError(null)
    setProgress(0)
    setShowSuccess(false)

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev
        return prev + Math.random() * 10
      })
    }, 2000)

    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          style,
          aspectRatio,
          motionIntensity
        })
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Video generation failed')
      }

      // Check if response is video content or JSON
      const contentType = response.headers.get('content-type') || ''
      
      if (contentType.includes('video/')) {
        // Direct video response
        const videoBlob = await response.blob()
        const videoUrl = URL.createObjectURL(videoBlob)
        
        const newVideo: GeneratedVideo = {
          id: Date.now().toString(),
          prompt,
          videoUrl,
          metadata: {
            style,
            aspectRatio,
            duration: '10 seconds',
            quality: '4K Ultra HD',
            generatedAt: new Date().toISOString()
          }
        }
        
        setGeneratedVideo(newVideo)
        setProgress(100)
        setShowSuccess(true)
        
        // Save to local storage
        saveVideoToHistory(newVideo)
      } else {
        // JSON response with video URL
        const result = await response.json()
        
        if (result.success && result.videoUrl) {
          const newVideo: GeneratedVideo = {
            id: Date.now().toString(),
            prompt,
            videoUrl: result.videoUrl,
            metadata: result.metadata || {
              style,
              aspectRatio,
              duration: '10 seconds',
              quality: '4K Ultra HD',
              generatedAt: new Date().toISOString()
            }
          }
          
          setGeneratedVideo(newVideo)
          setProgress(100)
          setShowSuccess(true)
          
          // Save to local storage
          saveVideoToHistory(newVideo)
        } else {
          throw new Error(result.message || 'Failed to generate video')
        }
      }

    } catch (error: any) {
      console.error('Video generation error:', error)
      setError(error.message || 'An unexpected error occurred. Please try again.')
      setProgress(0)
    } finally {
      clearInterval(progressInterval)
      setIsGenerating(false)
    }
  }

  const saveVideoToHistory = (video: GeneratedVideo) => {
    try {
      const existingHistory = localStorage.getItem('videoHistory')
      const history: GeneratedVideo[] = existingHistory ? JSON.parse(existingHistory) : []
      const updatedHistory = [video, ...history.slice(0, 19)] // Keep last 20 videos
      localStorage.setItem('videoHistory', JSON.stringify(updatedHistory))
    } catch (error) {
      console.error('Failed to save video to history:', error)
    }
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

  const handlePromptSuggestion = (suggestion: string) => {
    setPrompt(suggestion)
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
              <Link href="/gallery" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                Gallery
              </Link>
              <Link href="/" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                Home
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Generate Ultra 4K Videos
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Transform your ideas into stunning 10-second videos with AI
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Generation Form */}
            <Card className="border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>Video Settings</span>
                  <Badge variant="secondary">Free</Badge>
                </CardTitle>
                <CardDescription>
                  Describe your video and customize the generation settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="prompt" className="text-base font-medium">Video Description</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Describe the video you want to create... (e.g., A serene mountain landscape at golden hour with flowing clouds)"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[120px] mt-2"
                    maxLength={1000}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-slate-500">{prompt.length}/1000 characters</span>
                    {prompt.length > 800 && (
                      <Badge variant="outline" className="text-orange-600">
                        Approaching limit
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="style">Video Style</Label>
                    <Select value={style} onValueChange={setStyle}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cinematic">Cinematic</SelectItem>
                        <SelectItem value="documentary">Documentary</SelectItem>
                        <SelectItem value="animated">Animated</SelectItem>
                        <SelectItem value="artistic">Artistic</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="aspectRatio">Aspect Ratio</Label>
                    <Select value={aspectRatio} onValueChange={setAspectRatio}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
                        <SelectItem value="9:16">9:16 (Vertical)</SelectItem>
                        <SelectItem value="1:1">1:1 (Square)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="motion">Motion Level</Label>
                    <Select value={motionIntensity} onValueChange={setMotionIntensity}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {isGenerating && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                        Generating your 4K video... This may take up to 15 minutes
                      </p>
                      <Progress value={progress} className="w-full" />
                      <p className="text-xs text-slate-500 mt-1">
                        {progress < 30 ? 'Initializing AI models...' : 
                         progress < 60 ? 'Processing your prompt...' :
                         progress < 90 ? 'Rendering 4K video...' :
                         'Finalizing output...'}
                      </p>
                    </div>
                  </div>
                )}

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {showSuccess && (
                  <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                    <AlertDescription className="text-green-800 dark:text-green-200">
                      Video generated successfully! Your ultra 4K video is ready.
                    </AlertDescription>
                  </Alert>
                )}

                <Button 
                  onClick={handleGenerateVideo} 
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full h-12 text-lg"
                  size="lg"
                >
                  {isGenerating ? 'Generating Video...' : 'Generate 4K Video'}
                </Button>

                <div className="text-center text-sm text-slate-500">
                  <p>🎬 Ultra 4K Resolution • ⏱️ 10 Seconds • 🆓 Completely Free</p>
                </div>
              </CardContent>
            </Card>

            {/* Video Preview / Prompt Suggestions */}
            <div className="space-y-6">
              {generatedVideo ? (
                <Card className="border-slate-200 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Generated Video</span>
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                        4K Ready
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      "{generatedVideo.prompt}"
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
                      <video
                        ref={videoRef}
                        src={generatedVideo.videoUrl}
                        controls
                        className="w-full h-full object-cover"
                        preload="metadata"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-slate-600 dark:text-slate-300">Quality:</span>
                        <p>{generatedVideo.metadata.quality}</p>
                      </div>
                      <div>
                        <span className="font-medium text-slate-600 dark:text-slate-300">Duration:</span>
                        <p>{generatedVideo.metadata.duration}</p>
                      </div>
                      <div>
                        <span className="font-medium text-slate-600 dark:text-slate-300">Style:</span>
                        <p className="capitalize">{generatedVideo.metadata.style}</p>
                      </div>
                      <div>
                        <span className="font-medium text-slate-600 dark:text-slate-300">Aspect Ratio:</span>
                        <p>{generatedVideo.metadata.aspectRatio}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={() => downloadVideo(generatedVideo.videoUrl, `video-${generatedVideo.id}.mp4`)}
                        className="flex-1"
                      >
                        Download 4K Video
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setGeneratedVideo(null)
                          setShowSuccess(false)
                          setProgress(0)
                        }}
                      >
                        Generate Another
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-slate-200 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle>Prompt Suggestions</CardTitle>
                    <CardDescription>
                      Click any suggestion to get started quickly
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {promptSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handlePromptSuggestion(suggestion)}
                          className="w-full text-left p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 text-sm text-slate-700 dark:text-slate-300"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}