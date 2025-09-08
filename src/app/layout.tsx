import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from 'next-themes'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ultra 4K Video Generator - Free Text to Video AI',
  description: 'Generate stunning 10-second ultra 4K videos from text prompts using advanced AI. Free, fast, and professional quality results.',
  keywords: 'AI video generator, text to video, 4K video, free video generator, AI video creation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}