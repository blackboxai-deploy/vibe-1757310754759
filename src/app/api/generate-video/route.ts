import { NextRequest, NextResponse } from 'next/server'

interface VideoGenerationRequest {
  prompt: string
  style?: string
  aspectRatio?: string
  motionIntensity?: string
}

interface VideoGenerationResponse {
  success: boolean
  videoUrl?: string
  jobId?: string
  status?: string
  message?: string
  error?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: VideoGenerationRequest = await request.json()
    
    // Validate the request
    if (!body.prompt || body.prompt.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      )
    }

    if (body.prompt.length > 1000) {
      return NextResponse.json(
        { success: false, error: 'Prompt must be less than 1000 characters' },
        { status: 400 }
      )
    }

    // Enhance the prompt for better video generation
    const enhancedPrompt = enhancePromptForVideo(body.prompt, body.style, body.aspectRatio, body.motionIntensity)

    console.log('Generating video with prompt:', enhancedPrompt)

    // Make request to Replicate Veo-3 model via custom endpoint
    const apiResponse = await fetch('https://oi-server.onrender.com/chat/completions', {
      method: 'POST',
      headers: {
        'customerId': 'starauditconsultant@gmail.com',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer xxx'
      },
      body: JSON.stringify({
        model: 'replicate/google/veo-3',
        messages: [
          {
            role: 'user',
            content: enhancedPrompt
          }
        ]
      }),
      signal: AbortSignal.timeout(900000) // 15 minute timeout
    })

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text()
      console.error('API request failed:', apiResponse.status, errorText)
      
      return NextResponse.json(
        { 
          success: false, 
          error: `Video generation failed: ${apiResponse.status} ${apiResponse.statusText}`,
          message: 'Unable to generate video at this time. Please try again.'
        },
        { status: 500 }
      )
    }

    // Check content type to handle different response formats
    const contentType = apiResponse.headers.get('content-type') || ''
    
    if (contentType.includes('application/json')) {
      // JSON response - likely contains video URL or job status
      const result = await apiResponse.json()
      
      if (result.choices && result.choices[0] && result.choices[0].message) {
        const videoUrl = result.choices[0].message.content
        
        return NextResponse.json({
          success: true,
          videoUrl: videoUrl,
          message: 'Video generated successfully!',
          metadata: {
            prompt: body.prompt,
            style: body.style || 'cinematic',
            aspectRatio: body.aspectRatio || '16:9',
            duration: '10 seconds',
            quality: '4K Ultra HD',
            generatedAt: new Date().toISOString()
          }
        })
      } else {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid response format from video generation service',
            message: 'Please try again with a different prompt.'
          },
          { status: 500 }
        )
      }
    } else if (contentType.includes('video/')) {
      // Direct video content response
      const videoBuffer = await apiResponse.arrayBuffer()
      
      // Return the video directly
      return new NextResponse(videoBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'video/mp4',
          'Content-Disposition': 'attachment; filename="generated-video.mp4"',
          'Content-Length': videoBuffer.byteLength.toString(),
          'Cache-Control': 'public, max-age=31536000'
        }
      })
    } else {
      // Unexpected content type
      const responseText = await apiResponse.text()
      console.error('Unexpected content type:', contentType, responseText)
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Unexpected response format from video generation service',
          message: 'Please try again.'
        },
        { status: 500 }
      )
    }

  } catch (error: any) {
    console.error('Video generation error:', error)
    
    if (error.name === 'AbortError' || error.message?.includes('timeout')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Request timeout',
          message: 'Video generation is taking longer than expected. Please try again with a simpler prompt.'
        },
        { status: 408 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: 'An unexpected error occurred. Please try again.'
      },
      { status: 500 }
    )
  }
}

function enhancePromptForVideo(
  prompt: string, 
  style?: string, 
  aspectRatio?: string, 
  motionIntensity?: string
): string {
  let enhancedPrompt = prompt.trim()

  // Add style modifiers
  const styleModifiers: Record<string, string> = {
    'cinematic': 'cinematic style, professional lighting, film grain, dramatic composition',
    'documentary': 'documentary style, natural lighting, realistic, authentic feel',
    'animated': 'animated style, smooth motion, vibrant colors, stylized rendering',
    'artistic': 'artistic style, creative composition, unique visual approach',
    'commercial': 'commercial style, clean visuals, product-focused, professional quality'
  }

  if (style && styleModifiers[style]) {
    enhancedPrompt += `. ${styleModifiers[style]}`
  }

  // Add motion intensity guidance
  const motionModifiers: Record<string, string> = {
    'low': 'subtle movement, gentle motion, minimal camera movement',
    'medium': 'moderate movement, smooth transitions, balanced motion',
    'high': 'dynamic movement, active scenes, energetic motion'
  }

  if (motionIntensity && motionModifiers[motionIntensity]) {
    enhancedPrompt += `. ${motionModifiers[motionIntensity]}`
  }

  // Add technical specifications
  enhancedPrompt += '. Ultra 4K resolution, 10 seconds duration, high quality, professional video production'

  // Add aspect ratio guidance
  if (aspectRatio === '9:16') {
    enhancedPrompt += ', vertical orientation suitable for mobile viewing'
  } else if (aspectRatio === '1:1') {
    enhancedPrompt += ', square format suitable for social media'
  } else {
    enhancedPrompt += ', widescreen cinematic format'
  }

  return enhancedPrompt
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'Video Generation API',
    model: 'Veo-3 Ultra 4K',
    maxPromptLength: 1000,
    supportedFormats: ['MP4'],
    supportedResolutions: ['4K Ultra HD'],
    duration: '10 seconds'
  })
}