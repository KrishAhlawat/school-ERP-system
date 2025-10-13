import type { Metadata } from 'next'
import { Inter, Noto_Sans_Devanagari } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

const notoSansDevanagari = Noto_Sans_Devanagari({ 
  subsets: ['devanagari'],
  variable: '--font-noto-sans-devanagari'
})

export const metadata: Metadata = {
  title: 'School ERP System',
  description: 'Multi-tenant School ERP SaaS Platform',
  keywords: ['school', 'erp', 'education', 'management', 'saas'],
  authors: [{ name: 'School ERP Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hi" suppressHydrationWarning>
      <body 
        className={`${inter.variable} ${notoSansDevanagari.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            {children}
            <Toaster />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
