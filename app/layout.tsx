import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Supply Chain Challenges Survey',
  description: 'What are your biggest supply chain challenges in 2026? Explore 6 supply chain areas, select your top challenges, and rank your priorities.',
  icons: {
    icon: '/logo.jpg',
    apple: '/logo.jpg',
  },
}

export const viewport: Viewport = {
  themeColor: '#faf7f2',
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
