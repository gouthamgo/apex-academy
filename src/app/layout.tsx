import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/lib/theme-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Apex Academy - Master Salesforce Development',
    template: '%s | Apex Academy',
  },
  description: 'Comprehensive Salesforce development tutorials covering Apex, Lightning Web Components, integration patterns, and testing strategies with detailed code examples and expert insights.',
  keywords: [
    'Salesforce',
    'Apex',
    'Lightning Web Components',
    'LWC',
    'Salesforce Development',
    'Trailhead',
    'Salesforce Tutorial',
    'SOQL',
    'Triggers',
    'Integration',
    'Testing',
  ],
  authors: [{ name: 'Apex Academy Team' }],
  creator: 'Apex Academy',
  publisher: 'Apex Academy',
  metadataBase: new URL('https://apex-academy.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://apex-academy.vercel.app',
    title: 'Apex Academy - Master Salesforce Development',
    description: 'Comprehensive Salesforce development tutorials with detailed code examples and expert insights.',
    siteName: 'Apex Academy',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Apex Academy - Salesforce Development Tutorials',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Apex Academy - Master Salesforce Development',
    description: 'Comprehensive Salesforce development tutorials with detailed code examples and expert insights.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}