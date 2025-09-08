'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function HomePage() {
  const [isHovered, setIsHovered] = useState(false)

  const features = [
    {
      title: "Ultra 4K Quality",
      description: "Generate stunning videos in ultra-high 4K resolution with crystal clear detail and professional cinematic quality.",
      badge: "4K UHD"
    },
    {
      title: "10-Second Duration",
      description: "Perfect length for social media, presentations, and quick video content that captures attention instantly.",
      badge: "10 Sec"
    },
    {
      title: "AI-Powered Generation",
      description: "Advanced AI models create realistic, engaging videos from your text descriptions with remarkable accuracy.",
      badge: "AI Enhanced"
    },
    {
      title: "Completely Free",
      description: "No hidden costs, no subscriptions, no limits. Generate as many videos as you need without any restrictions.",
      badge: "100% Free"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">VideoAI Generator</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/gallery" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                Gallery
              </Link>
              <Button asChild>
                <Link href="/generate">Generate Video</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-6 text-sm font-medium">
            🚀 Free Ultra 4K Video Generation
          </Badge>
          <h2 className="text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            Transform Text into
            <br />
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Stunning 4K Videos
            </span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
            Create professional-quality 10-second videos from simple text descriptions. 
            Powered by advanced AI models, completely free, and delivered in ultra-high 4K resolution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg" 
              className="text-lg px-8 py-4 h-auto"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Link href="/generate" className="flex items-center space-x-2">
                <span>Start Creating Videos</span>
                <div className={`transition-transform duration-200 ${isHovered ? 'translate-x-1' : ''}`}>
                  →
                </div>
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto" asChild>
              <Link href="/gallery">View Sample Videos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              See It In Action
            </h3>
            <div className="aspect-video bg-slate-300 dark:bg-slate-600 rounded-xl flex items-center justify-center">
              <img 
                src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/69e19991-4e36-4667-a7bf-273e7cc16c61.png" 
                alt="Ultra 4K Video Demo Preview Coming Soon"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <p className="text-slate-600 dark:text-slate-300 mt-4">
              Sample 4K video generated from text: "A serene mountain landscape at golden hour with flowing clouds"
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Why Choose Our Video Generator?
          </h3>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Cutting-edge technology meets user-friendly design
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-12 text-center text-white">
          <h3 className="text-4xl font-bold mb-4">Ready to Create Amazing Videos?</h3>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already using our AI-powered video generator to bring their ideas to life.
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-4 h-auto" asChild>
            <Link href="/generate">Get Started Now - It's Free!</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">VideoAI Generator</h4>
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                The most advanced free text-to-video generator. Create stunning 4K videos with AI technology.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-slate-900 dark:text-white mb-4">Features</h5>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li>• Ultra 4K Resolution</li>
                <li>• 10-Second Videos</li>
                <li>• AI-Powered Generation</li>
                <li>• Unlimited Usage</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-slate-900 dark:text-white mb-4">Support</h5>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li>• Video Gallery</li>
                <li>• Generation Tips</li>
                <li>• Quality Guidelines</li>
                <li>• Technical Support</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-800 mt-12 pt-8 text-center text-slate-600 dark:text-slate-300">
            <p>&copy; 2024 VideoAI Generator. Free text-to-video generation powered by advanced AI.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}